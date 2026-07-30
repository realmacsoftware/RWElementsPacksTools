#!/usr/bin/env node
/**
 * AI Property Coverage Audit
 *
 * Finds every component property across the shared control library and any number of
 * element pack directories, and reports which ones are NOT curated for the LLM/MCP
 * assistant (i.e. have no `ai.name`, or are explicitly `ai.exclude`d).
 *
 * "Curated" mirrors the rule the app uses at runtime to decide which properties are exposed to the
 * LLM/MCP assistant:
 *
 *   a property is curated  <=>  property.ai?.name is a non-empty string AND property.ai?.exclude != true
 *
 * Scans two categories of source:
 *   1. RWElementsPacksTools/controls/*  — the shared control library. A gap here ripples into
 *      every component that references the control via `globalControl`, so it's the highest-
 *      leverage place to fix.
 *   2. One or more packs directories (each containing *.elementsdevpack subdirs), passed via
 *      config. An optional "core" packs directory is fused with the shared controls into the main
 *      report (AI-Audit-Report.md); every other pack root produces its own per-pack file under Packs/.
 *
 * Writes a report directory:
 *   <out-dir>/AI-Audit-Index.md          — methodology + summary + links to every report below
 *   <out-dir>/AI-Audit-Report.md         — shared controls + core packs directory (if given)
 *   <out-dir>/Packs/AI-Audit-<Name>.md  — one file per pack discovered in the additional roots
 *
 * Invoked via:  rw-build audit [options]
 */

import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { sync as globSync } from "glob";
import { fileURLToPath, pathToFileURL } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// =============================================================================
// SHARED CLASSIFICATION RULES
// These mirror the property curation rule the app applies at runtime.
// =============================================================================

// Keys that make a property row a real, addressable, value-bearing property.
const CONTROL_KEYS = [
  "switch", "select", "segmented", "slider", "text", "textArea", "number", "numbers",
  "resource", "link", "collection", "themeColor", "themeFont", "themeTextStyle",
  "themeTypography", "themeSpacing", "themeShadow", "themeBorderWidth", "themeBorderRadius",
  "input", "inputs", "color", "colors", "buttons", "date", "multi",
];

// Keys that mark a row as display-only chrome (inspector headings/dividers/info text) — these
// never carry an id and can never be curated, so they're excluded from the audit entirely.
const DISPLAY_ONLY_KEYS = ["heading", "divider", "information", "info", "description"];

function controlTypeOf(prop) {
  for (const key of CONTROL_KEYS) {
    if (prop[key] !== undefined) return key;
  }
  return "unknown";
}

/**
 * Classifies a single raw property object.
 * Returns null for display-only / id-less rows (not addressable, excluded from the audit).
 */
function classifyProperty(prop) {
  const id = prop.id ?? prop.property;
  if (!id) return null; // display-only chrome, or an id-less row we can't curate as-is

  const ai = prop.ai;
  const hasName = typeof ai?.name === "string" && ai.name.length > 0;
  const excluded = ai?.exclude === true;
  const curated = hasName && !excluded;

  let status;
  if (curated) status = "curated";
  else if (excluded) status = "excluded"; // deliberate opt-out, not a gap
  else if (ai && !hasName) status = "ai-incomplete"; // ai block present but no name — malformed
  else status = "uncurated"; // no ai block at all — the common gap

  return {
    id,
    title: prop.title ?? null,
    controlType: controlTypeOf(prop),
    status,
    aiName: ai?.name ?? null,
    reason: ai?.reason ?? null,
  };
}

function flattenPropertiesJSON(json) {
  const rows = [];
  for (const group of json.groups ?? []) {
    for (const prop of group.properties ?? []) {
      const classified = classifyProperty(prop);
      if (classified) rows.push({ groupTitle: group.title ?? null, ...classified });
    }
  }
  return rows;
}

function summarize(rows) {
  const total = rows.length;
  const curated = rows.filter((r) => r.status === "curated").length;
  const excluded = rows.filter((r) => r.status === "excluded").length;
  const uncurated = rows.filter((r) => r.status === "uncurated").length;
  const aiIncomplete = rows.filter((r) => r.status === "ai-incomplete").length;
  // Real, addressable gaps only — deliberate `ai.exclude: true` opt-outs are reviewed and
  // justified (see Exclusions Review), so they don't count as "not curated" work to do.
  const gaps = uncurated + aiIncomplete;
  // Coverage is measured against the curatable surface (total minus deliberate exclusions),
  // so a control/component that's fully curated aside from justified exclusions reads as 100%.
  const curatable = total - excluded;
  const coverage = curatable > 0 ? (curated / curatable) * 100 : 100;
  return { total, curated, excluded, uncurated, aiIncomplete, gaps, coverage };
}

// =============================================================================
// ALIAS COLLISION DETECTION
//
// The app's MCP compiler processes one component's (or one collection item's) properties
// in file order and rejects any `ai.name` it has already seen, regardless of which
// property declared it. That rejection is silent: the LLM keeps working, it just
// permanently loses access to whichever property lost the race. This scans the same rows
// this report already collects for exactly that failure mode, splitting it into two buckets:
//
//   - "collisions": the same alias is attached to *different* canonical property ids —
//     a real bug. One of those properties is silently unreachable via MCP.
//   - "duplicate declarations": the same alias is attached to the *same* canonical id
//     more than once (typically because a component wires the same control through two
//     different paths, e.g. a raw control plus a wrapper that re-embeds it). Harmless —
//     both declarations write the same underlying property — but redundant and worth
//     cleaning up since only the first declaration's description/domain actually wins.
//
// Must be run per compile unit (one `properties.json` file / one shared control's own
// row list) to mirror the compiler's actual scope — collisions across unrelated
// components can never happen at runtime, since each is compiled independently.
// =============================================================================

/**
 * Shared-control source files reference each other via `globalControl` and often override the
 * embedded control's `id`/`ai.name` with a literal `"{{value}}"` template — `build-properties.js`
 * substitutes each embedding's own id into that placeholder, but a shared control's *raw*,
 * unexpanded item array can't resolve that substitution, so several genuinely-distinct embeddings
 * look identical (same literal `"{{value}}..."` string) until expansion. Real per-component
 * collisions are already caught accurately by the (fully expanded) `properties.json` scan in
 * `auditPacksTree` — so at the shared-control level, only compare rows whose id/alias are template-free.
 */
function isTemplateId(value) {
  return typeof value === "string" && value.includes("{{value}}");
}

function findAliasIssues(rows) {
  const comparable = rows.filter((r) => !isTemplateId(r.id) && !isTemplateId(r.aiName));

  const idsByName = new Map(); // aiName -> Set of canonical ids
  for (const r of comparable) {
    if (r.status !== "curated") continue;
    if (!idsByName.has(r.aiName)) idsByName.set(r.aiName, new Set());
    idsByName.get(r.aiName).add(r.id);
  }

  const collisions = [];
  for (const [name, idSet] of idsByName) {
    const ids = [...idSet];
    if (ids.length > 1) collisions.push({ name, ids });
  }

  // Duplicate declarations (same alias, same id, appearing >1 time) need the raw counts,
  // not just the deduped id set, so tally separately.
  const countByNameId = new Map(); // "name\u0000id" -> count
  for (const r of comparable) {
    if (r.status !== "curated") continue;
    const key = `${r.aiName}\u0000${r.id}`;
    countByNameId.set(key, (countByNameId.get(key) ?? 0) + 1);
  }
  const duplicateDeclarations = [];
  for (const [key, count] of countByNameId) {
    if (count > 1) {
      const [name, id] = key.split("\u0000");
      duplicateDeclarations.push({ name, id, count });
    }
  }

  collisions.sort((a, b) => a.name.localeCompare(b.name));
  duplicateDeclarations.sort((a, b) => a.name.localeCompare(b.name));
  return { collisions, duplicateDeclarations };
}

// =============================================================================
// SOURCE 1: RWElementsPacksTools shared controls (controls/index.js)
// =============================================================================

async function loadControlModules(corePackToolsDir) {
  const indexPath = path.join(corePackToolsDir, "controls", "index.js");
  const mod = await import(pathToFileURL(indexPath).href);

  const modules = new Map(); // name -> raw item array (unexpanded — globalControl refs still present)
  for (const [name, value] of Object.entries(mod)) {
    const items = (Array.isArray(value) ? value : [value]).filter((p) => p && typeof p === "object");
    if (items.length > 0) modules.set(name, items);
  }
  return modules;
}

function auditSharedControls(modules) {
  const controls = [];
  for (const [name, items] of modules) {
    const rows = [];
    for (const prop of items) {
      const classified = classifyProperty(prop);
      if (classified) rows.push(classified);
    }
    if (rows.length === 0) continue; // export carries no addressable properties
    const { collisions, duplicateDeclarations } = findAliasIssues(rows);
    controls.push({ name, rows, collisions, duplicateDeclarations, ...summarize(rows) });
  }

  controls.sort((a, b) => a.coverage - b.coverage || a.name.localeCompare(b.name));
  return controls;
}

// =============================================================================
// SHARED CONTROL USAGE — how many times each control's properties actually end up expanded
// into a generated properties.json, across all resolved pack roots. This is the "impact"
// signal: a control expanded 50 times is a much higher-leverage fix than one expanded 4 times.
//
// Controls can reference each other via `globalControl` (e.g. `Borders` embeds `BorderStyle`,
// `BorderColor`, etc.) and `build-properties.js` expands these recursively. So a control's true
// usage isn't just its direct `globalControl` references from component `properties.config.json`
// files — it also inherits usage transitively through every other control that embeds it.
// =============================================================================

function collectGlobalControlRefs(groups) {
  const refs = [];
  for (const group of groups ?? []) {
    for (const prop of group.properties ?? []) {
      if (typeof prop.globalControl === "string" && prop.globalControl.length > 0) {
        refs.push(prop.globalControl);
      }
    }
  }
  return refs;
}

/**
 * Computes, for every control, how many times it is expanded into a generated properties.json
 * across the given packs directories, following globalControl composition transitively.
 *
 * @param {Map} modules - Control modules from loadControlModules().
 * @param {string[]} packsRoots - Directories each directly containing *.elementsdevpack subdirs.
 */
function countControlActivations(modules, packsRoots) {
  // Root activations: one per `globalControl` reference in a real component's properties.config.json.
  const rootCounts = new Map(); // controlName -> count
  for (const packsRoot of packsRoots) {
    const pattern = path.join(packsRoot, "*.elementsdevpack", "components", "**", "properties.config.json");
    for (const file of globSync(pattern, { windowsPathsNoEscape: true })) {
      let json;
      try {
        json = JSON.parse(fs.readFileSync(file, "utf-8"));
      } catch (err) {
        console.warn(`[audit-ai-properties] Failed to parse ${file}: ${err.message}`);
        continue;
      }
      for (const ref of collectGlobalControlRefs(json.groups)) {
        rootCounts.set(ref, (rootCounts.get(ref) ?? 0) + 1);
      }
    }
  }

  // Composition edges: controlName -> [childControlName, ...] (one entry per reference; a
  // control can embed the same child more than once, each is a distinct expansion site).
  const childRefsByControl = new Map();
  for (const [name, items] of modules) {
    const refs = items
      .map((item) => item.globalControl)
      .filter((ref) => typeof ref === "string" && ref.length > 0);
    if (refs.length > 0) childRefsByControl.set(name, refs);
  }

  const memo = new Map();
  const visiting = new Set();
  function activationsOf(name) {
    if (memo.has(name)) return memo.get(name);
    if (visiting.has(name)) return 0; // defensive cycle guard; composition is expected to be a DAG
    visiting.add(name);

    let total = rootCounts.get(name) ?? 0;
    for (const [parentName, childRefs] of childRefsByControl) {
      const timesEmbedded = childRefs.filter((ref) => ref === name).length;
      if (timesEmbedded > 0) total += activationsOf(parentName) * timesEmbedded;
    }

    visiting.delete(name);
    memo.set(name, total);
    return total;
  }

  const usage = new Map();
  for (const name of modules.keys()) usage.set(name, activationsOf(name));
  return usage;
}

// =============================================================================
// SOURCE 2+: generated properties.json across a packs directory
// =============================================================================

/**
 * Walks packsRoot/*.elementsdevpack/components/**\/properties.json, grouping results
 * by pack -> component -> (optional collection sub-path).
 *
 * Also returns `collisionReports`: one entry per `properties.json` file that has an alias
 * collision or duplicate declaration — each file is its own compile unit, matching the scope
 * the app's MCP compiler uses at runtime.
 *
 * @param {string} packsRoot - Directory directly containing *.elementsdevpack subdirs.
 */
function auditPacksTree(packsRoot) {
  const pattern = path.join(packsRoot, "*.elementsdevpack", "components", "**", "properties.json");
  const files = globSync(pattern, { windowsPathsNoEscape: true }).sort();

  const packs = new Map(); // packName -> Map(componentId -> { title, entries: [{ subPath, rows }] })
  const collisionReports = [];

  for (const file of files) {
    const rel = path.relative(packsRoot, file);
    const segments = rel.split(path.sep);
    const packDirName = segments[0]; // "Core.elementsdevpack"
    const packName = packDirName.replace(/\.elementsdevpack$/, "");
    // segments: [pack.elementsdevpack, "components", componentId, ...subPath, "properties.json"]
    const componentId = segments[2];
    const subPathSegments = segments.slice(3, -1); // e.g. ["collections", "tags"]
    const subPath = subPathSegments.join("/");

    if (componentId === "shared") continue; // shared assets, not a component

    let json;
    try {
      json = JSON.parse(fs.readFileSync(file, "utf-8"));
    } catch (err) {
      console.warn(`[audit-ai-properties] Failed to parse ${file}: ${err.message}`);
      continue;
    }
    const rows = flattenPropertiesJSON(json);

    if (!packs.has(packName)) packs.set(packName, new Map());
    const components = packs.get(packName);
    if (!components.has(componentId)) {
      const infoPath = path.join(packsRoot, packDirName, "components", componentId, "info.json");
      let title = componentId;
      try {
        const info = JSON.parse(fs.readFileSync(infoPath, "utf-8"));
        if (info.title) title = info.title;
      } catch {
        // no info.json / unreadable — fall back to the identifier
      }
      components.set(componentId, { title, entries: [] });
    }
    const component = components.get(componentId);
    component.entries.push({ subPath, rows });

    const { collisions, duplicateDeclarations } = findAliasIssues(rows);
    if (collisions.length > 0 || duplicateDeclarations.length > 0) {
      collisionReports.push({ packName, componentId, componentTitle: component.title, subPath, collisions, duplicateDeclarations });
    }
  }

  return { packs, collisionReports };
}

function flattenComponentRows(component) {
  return component.entries.flatMap((e) => e.rows);
}

/** Flattens a pack's `Map(componentId -> component)` into a sorted, summarized list. */
function summarizeComponents(components) {
  const list = [];
  for (const [componentId, component] of components) {
    const rows = flattenComponentRows(component);
    list.push({ componentId, title: component.title, rows, ...summarize(rows) });
  }
  return list.sort((a, b) => a.coverage - b.coverage || a.title.localeCompare(b.title));
}

function slugify(name) {
  return name.trim().replace(/[^a-zA-Z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

/**
 * Derives a human-readable label for a packs directory.
 * When the directory itself is named "packs", uses its parent's name instead
 * (e.g. "../RWElementsCorePack/packs" → "RWElementsCorePack").
 */
function rootLabelFor(packsDir) {
  const base = path.basename(packsDir);
  return base === "packs" ? path.basename(path.dirname(packsDir)) : base;
}

// =============================================================================
// MARKDOWN RENDERING
// =============================================================================

function pct(n) {
  return `${n.toFixed(1)}%`;
}

function coverageBadge(coverage) {
  if (coverage >= 99.95) return "✅";
  if (coverage <= 0.05) return "⛔️";
  return "⚠️";
}

function gitRevision(dir) {
  try {
    return execSync("git rev-parse --short HEAD", { cwd: dir }).toString().trim();
  } catch {
    return "unknown";
  }
}

/** Quote a path/arg for safe paste into a POSIX shell. */
function shellQuote(value) {
  const s = String(value);
  if (/^[A-Za-z0-9_./:@%+=,-]+$/.test(s)) return s;
  return `'${s.replace(/'/g, `'\\''`)}'`;
}

/**
 * Reconstruct a pasteable re-run command from the paths this report actually used.
 * Absolute paths + cwd so an LLM (or human) can reproduce the same report.
 */
function formatRerunCommand({ cwd, corePacksDir, auditPackRoots, auditOutDir }) {
  const parts = ["npx", "rw-build", "audit"];
  if (corePacksDir) {
    parts.push("--core-packs", shellQuote(corePacksDir));
  } else {
    parts.push("--no-core-packs");
  }
  for (const root of auditPackRoots) {
    parts.push("--packs", shellQuote(root));
  }
  parts.push("--out-dir", shellQuote(auditOutDir));
  return `cd ${shellQuote(cwd)} && ${parts.join(" ")}`;
}

function renderNotCuratedTable(rows) {
  // Deliberate `ai.exclude: true` opt-outs are not gaps — they're covered separately in the
  // Exclusions Review section — so they're left out of this table entirely.
  const gaps = rows.filter((r) => r.status === "uncurated" || r.status === "ai-incomplete");
  if (gaps.length === 0) return "_All addressable properties are covered (aside from deliberate exclusions — see the Exclusions Review section)._\n";
  const lines = [
    "| Property ID | Title | Control Type | Group | Status |",
    "|---|---|---|---|---|",
  ];
  for (const r of gaps) {
    const status = { uncurated: "Not covered", "ai-incomplete": "`ai` block missing `name`" }[r.status] ?? r.status;
    lines.push(`| \`${r.id}\` | ${r.title ?? "—"} | ${r.controlType} | ${r.groupTitle ?? "—"} | ${status} |`);
  }
  return lines.join("\n") + "\n";
}

function renderExclusionsSection(items) {
  const lines = ["## Explicit Exclusions Review", ""];
  lines.push(
    "Properties whose `ai` block sets `exclude: true` are a deliberate opt-out (e.g. a hover/end-state variant that ",
    "would collide with its base alias) — not a coverage gap, so they're left out of the *Not Covered* / *Gaps* tables ",
    "and the *Coverage* percentage everywhere in this report. They're listed here instead, at the bottom, so a human can ",
    "sanity-check that each exclusion is still justified. Where a component-level exclusion is just an inherited expansion ",
    "of a shared control's own exclusion (e.g. every component using `Transforms` inherits its `globalTransformsState` ",
    "opt-out), it's already covered by that control's row below and is not repeated here per component.",
    ""
  );

  if (items.length === 0) {
    lines.push("_No explicit exclusions found._", "");
    return lines.join("\n");
  }

  const missingReason = items.filter((i) => !i.reason);
  if (missingReason.length > 0) {
    lines.push(
      `⚠️ ${missingReason.length} of ${items.length} exclusion${items.length === 1 ? "" : "s"} ${missingReason.length === 1 ? "has" : "have"} no \`ai.reason\` given.`,
      ""
    );
  }

  lines.push("| Location | Property ID | Title | Reason |", "|---|---|---|---|");
  for (const i of items) {
    lines.push(`| ${i.location} | \`${i.id}\` | ${i.title ?? "—"} | ${i.reason ?? "⚠️ _No reason given_"} |`);
  }
  lines.push("");

  return lines.join("\n");
}

/**
 * Flattens an array of collision reports into the flat shape renderCollisionsSection expects.
 * @param {object[]} reports
 * @param {(report: object) => string} locationFor
 */
function collisionItemsFromReports(reports, locationFor) {
  const collisionItems = [];
  const duplicateItems = [];
  for (const r of reports) {
    const location = locationFor(r);
    for (const col of r.collisions) collisionItems.push({ location, ...col });
    for (const dup of r.duplicateDeclarations) duplicateItems.push({ location, ...dup });
  }
  return { collisionItems, duplicateItems };
}

/**
 * Flattens a list of entries with `rows` into the flat shape renderExclusionsSection expects.
 * @param {object[]} entries - Each has a `rows` array.
 * @param {(entry: object) => string} locationFor
 */
function collectExclusionItems(entries, locationFor) {
  const items = [];
  for (const entry of entries) {
    const location = locationFor(entry);
    for (const r of entry.rows) {
      if (r.status === "excluded") items.push({ location, id: r.id, title: r.title, reason: r.reason });
    }
  }
  return items;
}

function renderCollisionsSection(collisionItems, duplicateItems) {
  const lines = ["## Alias Collision Check", ""];
  lines.push(
    "Each component — and each shared control, and each nested collection item — is processed independently ",
    "(the app treats each `properties.json` as a separate compile unit). ",
    "Within one such scope, if the same `ai.name` is attached to two *different* property ids, the compiler keeps only the first ",
    "and silently drops the second — that property becomes permanently unreachable via MCP under its intended alias. This section scans ",
    "every compiled scope in this report for exactly that failure mode.",
    ""
  );

  if (collisionItems.length === 0 && duplicateItems.length === 0) {
    lines.push("✅ No alias collisions or duplicate declarations found.", "");
    return lines.join("\n");
  }

  if (collisionItems.length > 0) {
    lines.push(
      `### 🔴 ${collisionItems.length} collision${collisionItems.length === 1 ? "" : "s"} — different properties sharing one alias (real bug: one is silently unreachable)`,
      ""
    );
    lines.push("| Location | Alias | Colliding Property IDs |", "|---|---|---|");
    for (const c of collisionItems) {
      lines.push(`| ${c.location} | \`${c.name}\` | ${c.ids.map((id) => `\`${id}\``).join(", ")} |`);
    }
    lines.push("");
  } else {
    lines.push("✅ No real alias collisions found.", "");
  }

  if (duplicateItems.length > 0) {
    lines.push(
      `### 🟡 ${duplicateItems.length} redundant duplicate declaration${duplicateItems.length === 1 ? "" : "s"} — same alias declared more than once for the same property`,
      "",
      "Harmless (both declarations write the same underlying property), but only the first declaration's description/domain is actually used — worth cleaning up.",
      ""
    );
    lines.push("| Location | Alias | Property ID | Declared × |", "|---|---|---|---|");
    for (const d of duplicateItems) {
      lines.push(`| ${d.location} | \`${d.name}\` | \`${d.id}\` | ${d.count} |`);
    }
    lines.push("");
  }

  return lines.join("\n");
}

const METHODOLOGY = [
  "The Elements MCP/Assistant integration only exposes properties that are explicitly opted in via an inline `ai` block ",
  "(`ai: { name: \"...\", description: \"...\" }`) in a component's `properties.json`. Everything else — the vast majority of ",
  "properties in the inspector — is invisible to the LLM. This report inverts that: it walks every property definition across ",
  "the shared control library and every element pack, and lists exactly which ones are **not** currently exposed.",
  "",
  "**Coverage rule** (mirrors the property curation logic the app applies at runtime):",
  "",
  "```",
  "covered  <=>  property.ai?.name is a non-empty string  AND  property.ai?.exclude != true",
  "```",
  "",
  "| Status | Meaning |",
  "|---|---|",
  "| **Not covered** | No `ai` block at all — the common gap. Add `ai: { name, description }` to expose it. |",
  "| **Explicitly excluded** | `ai: { exclude: true }` — a deliberate opt-out (e.g. a hover/end-state variant that would collide with its base alias). Not a gap, so it's kept out of the *Not Covered* / *Gaps* tables entirely and surfaced instead in the dedicated **Explicit Exclusions Review** section, alongside its `ai.reason` (when authored), for human sanity-checking. |",
  "| **`ai` block missing `name`** | Malformed — an `ai` object exists but has no `name`, so it contributes nothing. Likely a mistake. |",
  "",
  "Display-only inspector rows (`heading`, `divider`, `information`, `description`) carry no `id` and can never be covered — they're excluded from every count in this report.",
].join("\n");

/**
 * @param {object[]} controls - From auditSharedControls().
 * @param {Map} usage - From countControlActivations().
 * @param {string[]} packsRootLabels - Labels for the roots used to compute impact, for the doc note.
 */
function renderSharedControlsSection(controls, usage, packsRootLabels) {
  const lines = ["## Shared Controls — `RWElementsPacksTools/controls`", ""];
  lines.push(
    "Each shared control is referenced via `globalControl` from one or more components across every pack. ",
    "A gap here is the highest-leverage fix: annotating one control's `ai` metadata propagates to every component that uses it (after a rebuild).",
    ""
  );

  const rootsDesc = packsRootLabels.length > 0
    ? packsRootLabels.map((l) => `\`${l}\``).join(" + ")
    : "the pack roots passed to this audit run";
  lines.push(
    `**Usage** = number of times this control is actually expanded into a generated \`properties.json\`, across ${rootsDesc} — `,
    "following `globalControl` composition transitively (e.g. `Borders` embeds `BorderStyle`/`BorderColor`/etc., so their usage includes every component that uses `Borders`, not just direct references). ",
    "**Impact** = `Usage × Gaps` — a rough proxy for how many exposed-property opportunities a fix to this control would unlock; sort by this to prioritize.",
    ""
  );

  const withUsage = controls.map((c) => {
    const usageCount = usage.get(c.name) ?? 0;
    return { ...c, usage: usageCount, impact: usageCount * c.gaps };
  });

  const totals = summarize(controls.flatMap((c) => c.rows));
  lines.push(`**Totals:** ${totals.curated}/${totals.total} properties covered (${pct(totals.coverage)}).`, "");

  const byImpact = [...withUsage].sort((a, b) => b.impact - a.impact || a.name.localeCompare(b.name));
  lines.push("### Ranked by impact (usage × gaps)", "");
  lines.push("| Control | Usage | Properties | Covered | Gaps | Coverage | Impact |", "|---|---|---|---|---|---|---|");
  for (const c of byImpact) {
    lines.push(`| \`${c.name}\` | ${c.usage} | ${c.total} | ${c.curated} | ${c.gaps} | ${coverageBadge(c.coverage)} ${pct(c.coverage)} | ${c.impact} |`);
  }
  lines.push("");

  const gappy = byImpact.filter((c) => c.gaps > 0);
  lines.push(`### Gaps by control (${gappy.length} of ${controls.length} controls have at least one uncovered property, ordered by impact)`, "");
  for (const c of gappy) {
    lines.push(`<details><summary><code>${c.name}</code> — used ${c.usage}× — ${c.curated}/${c.total} coverage (${pct(c.coverage)}) — impact ${c.impact}</summary>`, "");
    lines.push(renderNotCuratedTable(c.rows));
    lines.push("</details>", "");
  }

  return lines.join("\n");
}

function renderComponentsSection(heading, intro, componentSummaries) {
  const lines = [heading, "", intro, ""];

  const totals = summarize(componentSummaries.flatMap((c) => c.rows));
  lines.push(`**Totals:** ${componentSummaries.length} components, ${totals.curated}/${totals.total} properties covered (${pct(totals.coverage)}).`, "");

  lines.push("| Component | Properties | Covered | Gaps | Coverage |", "|---|---|---|---|---|");
  for (const c of componentSummaries) {
    lines.push(`| ${c.title} (\`${c.componentId}\`) | ${c.total} | ${c.curated} | ${c.gaps} | ${coverageBadge(c.coverage)} ${pct(c.coverage)} |`);
  }
  lines.push("");

  const gappy = componentSummaries.filter((c) => c.gaps > 0);
  lines.push(`### Gaps by component (${gappy.length} of ${componentSummaries.length} components have at least one uncovered property)`, "");
  for (const c of gappy) {
    lines.push(`<details><summary><b>${c.title}</b> (<code>${c.componentId}</code>) — ${c.curated}/${c.total} coverage (${pct(c.coverage)})</summary>`, "");
    lines.push(renderNotCuratedTable(c.rows));
    lines.push("</details>", "");
  }

  return lines.join("\n");
}

// =============================================================================
// MAIN
// =============================================================================

/**
 * Runs the full AI property coverage audit and writes the report directory.
 *
 * @param {object} config
 * @param {string|null}  config.corePacksDir   - Directory directly containing the core pack's
 *                                               *.elementsdevpack subdirs (optional). Fused with
 *                                               shared controls into AI-Audit-Report.md.
 * @param {string[]}     config.auditPackRoots - Additional packs directories (each directly
 *                                               containing *.elementsdevpack subdirs). Each
 *                                               produces a Packs/AI-Audit-<Name>.md file.
 * @param {string}       config.auditOutDir    - Directory to write the report into (created if needed).
 */
export async function runAudit(config) {
  const { corePacksDir = null, auditPackRoots = [], auditOutDir } = config;

  if (!auditOutDir) throw new Error("[audit-ai-properties] config.auditOutDir is required");

  // --- 1. Shared controls (always from the tools package itself) --------------
  console.log("[audit-ai-properties] Auditing shared controls…");
  const controlModules = await loadControlModules(__dirname);
  const sharedControls = auditSharedControls(controlModules);

  // --- 2. Core packs (optional, fused into AI-Audit-Report.md) ---------------
  let corePackTree = new Map();
  let coreCollisionReports = [];
  const resolvedCorePacksDir = corePacksDir && fs.existsSync(corePacksDir) ? corePacksDir : null;
  if (corePacksDir && !resolvedCorePacksDir) {
    console.warn(`[audit-ai-properties] Core packs dir not found: ${corePacksDir} — skipping`);
  }
  if (resolvedCorePacksDir) {
    console.log(`[audit-ai-properties] Auditing core packs at ${resolvedCorePacksDir}…`);
    const r = auditPacksTree(resolvedCorePacksDir);
    corePackTree = r.packs;
    coreCollisionReports = r.collisionReports;
  }

  // --- 3. Additional pack roots ---------------------------------------------
  const resolvedPackRoots = auditPackRoots.filter((r) => {
    if (fs.existsSync(r)) return true;
    console.warn(`[audit-ai-properties] Pack root not found: ${r} — skipping`);
    return false;
  });
  for (const r of resolvedPackRoots) {
    console.log(`[audit-ai-properties] Auditing additional packs at ${r}…`);
  }

  // --- 4. Usage/Impact across ALL resolved roots ----------------------------
  const allPacksRoots = [
    ...(resolvedCorePacksDir ? [resolvedCorePacksDir] : []),
    ...resolvedPackRoots,
  ];
  const controlUsage = countControlActivations(controlModules, allPacksRoots);
  const packsRootLabels = allPacksRoots.map(rootLabelFor);

  // --- 5. Audit each additional root ----------------------------------------
  const additionalByRoot = resolvedPackRoots.map((r) => {
    const { packs, collisionReports } = auditPacksTree(r);
    return { rootLabel: rootLabelFor(r), packsDir: r, packs, collisionReports };
  });

  // --- 6. Collision items (for index + per-report) --------------------------
  const sharedControlCollisionItems = collisionItemsFromReports(
    sharedControls.filter((c) => c.collisions.length > 0 || c.duplicateDeclarations.length > 0),
    (c) => `Shared Control → \`${c.name}\``
  );
  const coreCollisionItems = collisionItemsFromReports(
    coreCollisionReports,
    (r) => `Core Packs → ${r.componentTitle ?? r.componentId}${r.subPath ? ` → ${r.subPath}` : ""}`
  );

  // Index-level collision lists (all sources, with root labels)
  const indexCollisionItems = [
    ...sharedControlCollisionItems.collisionItems,
    ...coreCollisionItems.collisionItems,
  ];
  const indexDuplicateItems = [
    ...sharedControlCollisionItems.duplicateItems,
    ...coreCollisionItems.duplicateItems,
  ];
  for (const { rootLabel, collisionReports } of additionalByRoot) {
    const items = collisionItemsFromReports(
      collisionReports,
      (r) => `${rootLabel} → ${r.componentTitle ?? r.componentId}${r.subPath ? ` → ${r.subPath}` : ""}`
    );
    indexCollisionItems.push(...items.collisionItems);
    indexDuplicateItems.push(...items.duplicateItems);
  }

  // --- 7. Exclusion items ---------------------------------------------------
  const sharedControlExclusionItems = collectExclusionItems(sharedControls, (c) => `Shared Control → \`${c.name}\``);
  const sharedExcludedIds = new Set(sharedControlExclusionItems.map((i) => i.id));

  const coreComponentsByPack = [...corePackTree.entries()].map(([packName, components]) => [
    packName,
    summarizeComponents(components),
  ]);
  const coreComponents = coreComponentsByPack.flatMap(([, list]) => list);
  const coreExclusionItems = collectExclusionItems(
    coreComponents,
    (c) => `Core Packs → ${c.title} (\`${c.componentId}\`)`
  ).filter((i) => !sharedExcludedIds.has(i.id));

  // --- 8. Build allPackEntries with filenames (handle slug collisions) -------
  const allPackEntries = [];
  for (const { rootLabel, packsDir, packs, collisionReports } of additionalByRoot) {
    const packsByPack = [...packs.entries()]
      .map(([packName, components]) => [packName, summarizeComponents(components)])
      .sort((a, b) => a[0].localeCompare(b[0]));

    for (const [packName, componentSummaries] of packsByPack) {
      // Per-pack collision items use component-scoped labels (no root prefix in per-pack doc)
      const { collisionItems: packCollisionItems, duplicateItems: packDuplicateItems } = collisionItemsFromReports(
        collisionReports.filter((r) => r.packName === packName),
        (r) => `${r.componentTitle ?? r.componentId}${r.subPath ? ` → ${r.subPath}` : ""}`
      );
      const packExclusionItems = collectExclusionItems(
        componentSummaries,
        (c) => `${c.title} (\`${c.componentId}\`)`
      ).filter((i) => !sharedExcludedIds.has(i.id));

      allPackEntries.push({
        rootLabel,
        packsDir,
        packName,
        componentSummaries,
        collisionItems: packCollisionItems,
        duplicateItems: packDuplicateItems,
        exclusionItems: packExclusionItems,
      });
    }
  }

  // Detect slug collisions across packs from all roots; disambiguate with root label
  const slugCount = new Map();
  for (const { packName } of allPackEntries) {
    const slug = slugify(packName);
    slugCount.set(slug, (slugCount.get(slug) ?? 0) + 1);
  }
  for (const entry of allPackEntries) {
    const slug = slugify(entry.packName);
    entry.fileName = slugCount.get(slug) > 1
      ? `AI-Audit-${slug}-${slugify(entry.rootLabel)}.md`
      : `AI-Audit-${slug}.md`;
  }

  // --- 9. Summary totals ----------------------------------------------------
  const sharedTotals = summarize(sharedControls.flatMap((c) => c.rows));
  const coreTotals = summarize(coreComponents.flatMap((c) => c.rows));
  const hasCore = coreComponents.length > 0;
  const packsTotals = summarize(
    allPackEntries.flatMap(({ componentSummaries }) => componentSummaries.flatMap((c) => c.rows))
  );
  const totalPacksAcrossAdditional = allPackEntries.length;
  const totalComponentsAcrossAdditional = allPackEntries.reduce(
    (n, { componentSummaries }) => n + componentSummaries.length, 0
  );

  // Combined exclusion list for the index
  const allExclusionItems = [
    ...sharedControlExclusionItems,
    ...coreExclusionItems,
    ...allPackEntries.flatMap(({ exclusionItems }) => exclusionItems),
  ];

  // --- 10. Report header ----------------------------------------------------
  const generatedAt = new Date().toISOString();
  const revisions = [
    `rw-elements-tools @ ${gitRevision(__dirname)}`,
    ...allPacksRoots.map((r) => `${rootLabelFor(r)} @ ${gitRevision(r)}`),
  ];
  const rerunCommand = formatRerunCommand({
    cwd: process.cwd(),
    corePacksDir: resolvedCorePacksDir,
    auditPackRoots: resolvedPackRoots,
    auditOutDir,
  });
  const header = [
    `> Generated ${generatedAt} by [\`rw-build audit\`](https://github.com/realmacsoftware/RWElementsPacksTools).`,
    `> Source revisions: ${revisions.join(" · ")}.`,
    `> Re-run: \`${rerunCommand}\``,
  ].join("\n");

  // --- 11. Write output -----------------------------------------------------
  fs.mkdirSync(auditOutDir, { recursive: true });
  const packsOutDir = path.join(auditOutDir, "Packs");
  fs.mkdirSync(packsOutDir, { recursive: true });

  // AI-Audit-Report.md (shared controls + core packs)
  const reportHeading = hasCore
    ? "# AI Property Coverage — Shared Controls & Core Packs"
    : "# AI Property Coverage — Shared Controls";

  const coreReportCollisionItems = [
    ...sharedControlCollisionItems.collisionItems,
    ...coreCollisionItems.collisionItems,
  ];
  const coreReportDuplicateItems = [
    ...sharedControlCollisionItems.duplicateItems,
    ...coreCollisionItems.duplicateItems,
  ];

  const reportSections = [
    reportHeading,
    "",
    header,
    "",
    "> Part of the [AI Property Audit](./AI-Audit-Index.md). See that file for full methodology and cross-repo totals.",
    "",
    "---",
    "",
    renderCollisionsSection(coreReportCollisionItems, coreReportDuplicateItems),
    "",
    "---",
    "",
    renderSharedControlsSection(sharedControls, controlUsage, packsRootLabels),
  ];

  if (hasCore) {
    reportSections.push(
      "",
      "---",
      "",
      renderComponentsSection(
        "## Core Packs — Built-in Components",
        "Generated `properties.json` for every built-in component (including nested collections, e.g. accordion tags / table columns).",
        coreComponents
      )
    );
  }

  reportSections.push(
    "",
    "---",
    "",
    renderExclusionsSection([...sharedControlExclusionItems, ...coreExclusionItems]),
    ""
  );

  fs.writeFileSync(path.join(auditOutDir, "AI-Audit-Report.md"), reportSections.join("\n"), "utf-8");

  // Packs/AI-Audit-<PackName>.md (one per additional pack)
  const packLinks = [];
  for (const entry of allPackEntries) {
    const { packName, componentSummaries, collisionItems, duplicateItems, exclusionItems, fileName } = entry;
    const totals = summarize(componentSummaries.flatMap((c) => c.rows));
    packLinks.push({ packName, fileName, totals, componentCount: componentSummaries.length });

    const doc = [
      `# AI Property Coverage — ${packName}`,
      "",
      header,
      "",
      "> Part of the [AI Property Audit](../AI-Audit-Index.md). See that file for full methodology and cross-repo totals.",
      "",
      "---",
      "",
      renderCollisionsSection(collisionItems, duplicateItems),
      "",
      "---",
      "",
      renderComponentsSection(
        `## ${packName}`,
        `Generated \`properties.json\` for every component in the \`${packName}\` pack.`,
        componentSummaries
      ),
      "",
      "---",
      "",
      renderExclusionsSection(exclusionItems),
      "",
    ].join("\n");
    fs.writeFileSync(path.join(packsOutDir, fileName), doc, "utf-8");
  }

  // AI-Audit-Index.md (index)
  const mainReportCoverage = hasCore
    ? `${sharedTotals.curated + coreTotals.curated}/${sharedTotals.total + coreTotals.total} covered`
    : `${sharedTotals.curated}/${sharedTotals.total} covered`;

  const summaryRows = [
    `| Shared Controls | ${sharedControls.length} controls | ${sharedTotals.total} | ${sharedTotals.curated} | ${sharedTotals.gaps} | ${coverageBadge(sharedTotals.coverage)} ${pct(sharedTotals.coverage)} |`,
  ];
  if (hasCore) {
    summaryRows.push(
      `| Core Packs | ${coreComponents.length} components | ${coreTotals.total} | ${coreTotals.curated} | ${coreTotals.gaps} | ${coverageBadge(coreTotals.coverage)} ${pct(coreTotals.coverage)} |`
    );
  }
  if (totalPacksAcrossAdditional > 0) {
    summaryRows.push(
      `| Additional Packs | ${totalComponentsAcrossAdditional} components across ${totalPacksAcrossAdditional} pack${totalPacksAcrossAdditional === 1 ? "" : "s"} | ${packsTotals.total} | ${packsTotals.curated} | ${packsTotals.gaps} | ${coverageBadge(packsTotals.coverage)} ${pct(packsTotals.coverage)} |`
    );
  }

  const reportsSection = [
    `- [**Controls${hasCore ? " & Core Packs" : ""}**](./AI-Audit-Report.md) — shared controls (ranked by impact)${hasCore ? " + core pack built-in components" : ""}. ${mainReportCoverage}.`,
  ];
  if (packLinks.length > 0) {
    reportsSection.push(
      "- **Additional Packs** — one report per pack:",
      "",
      "  | Pack | Components | Covered | Gaps | Coverage |",
      "  |---|---|---|---|---|",
      ...packLinks.map(
        (p) =>
          `  | [${p.packName}](./Packs/${p.fileName}) | ${p.componentCount} | ${p.totals.curated} | ${p.totals.gaps} | ${coverageBadge(p.totals.coverage)} ${pct(p.totals.coverage)} |`
      )
    );
  }

  const indexDoc = [
    "# AI Property Audit",
    "",
    header,
    "",
    renderCollisionsSection(indexCollisionItems, indexDuplicateItems),
    "",
    "---",
    "",
    "## What this report is",
    "",
    METHODOLOGY,
    "",
    "---",
    "",
    "## Summary",
    "",
    "| Source | Components / Controls | Properties (addressable) | Covered | Gaps | Coverage |",
    "|---|---|---|---|---|---|",
    ...summaryRows,
    "",
    "---",
    "",
    "## Reports",
    "",
    ...reportsSection,
    "",
    "---",
    "",
    renderExclusionsSection(allExclusionItems),
    "",
  ].join("\n");
  fs.writeFileSync(path.join(auditOutDir, "AI-Audit-Index.md"), indexDoc, "utf-8");

  const coverageLog = [
    `Controls ${pct(sharedTotals.coverage)}`,
    ...(hasCore ? [`Core packs ${pct(coreTotals.coverage)}`] : []),
    ...(totalPacksAcrossAdditional > 0 ? [`Additional packs ${pct(packsTotals.coverage)}`] : []),
  ].join(" · ");
  console.log(`[audit-ai-properties] Report written to ${auditOutDir}`);
  console.log(`[audit-ai-properties] ${coverageLog}`);
}
