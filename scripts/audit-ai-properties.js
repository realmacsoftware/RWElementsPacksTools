#!/usr/bin/env node
/**
 * AI Property Coverage Audit
 *
 * Finds every component property across the shared control library and all element packs,
 * and reports which ones are NOT curated for the LLM/MCP assistant (i.e. have no `ai.name`,
 * or are explicitly `ai.exclude`d).
 *
 * "Curated" mirrors the exact rule used at runtime by `MCPCuratedCatalogCompiler.compile()`
 * (RapidWeaverElements/RapidWeaver/RWElements/MCPCuratedCatalogCompiler.swift):
 *
 *   a property is curated  <=>  property.ai?.name is a non-empty string AND property.ai?.exclude != true
 *
 * Scans three sources:
 *   1. RWElementsPacksTools/controls/*  — the shared control library. A gap here ripples into
 *      every component that references the control via `globalControl`, so it's the highest-
 *      leverage place to fix.
 *   2. RWElementsCorePack/packs/*.elementsdevpack/components/**\/properties.json — the generated,
 *      shipped source of truth for the Core pack.
 *   3. RWElementPacks/packs/*.elementsdevpack/components/**\/properties.json — same, for every
 *      additional element pack.
 *
 * Writes a report *directory* (not a single file — it gets large):
 *   <out-dir>/README.md              — methodology + summary + links to every report below
 *   <out-dir>/Core-Pack-Tools.md     — shared controls (RWElementsPacksTools) + RWElementsCorePack
 *   <out-dir>/Packs/<PackName>.md    — one file per additional pack in RWElementPacks
 *
 * Usage:
 *   node scripts/audit-ai-properties.js [options]
 *
 * Options:
 *   --core-pack-tools <dir>   Path to RWElementsPacksTools (default: this package's root)
 *   --core-pack <dir>         Path to RWElementsCorePack    (default: ../RWElementsCorePack)
 *   --element-packs <dir>     Path to RWElementPacks        (default: ../RWElementPacks)
 *   --out-dir <dir>           Report output directory (default: ../RapidWeaverElements/RapidWeaver/#Scratch/AI-Property-Coverage-Report)
 *   --help, -h                Show this help message
 *
 * Env var overrides: RW_CORE_PACK_TOOLS_DIR, RW_CORE_PACK_DIR, RW_ELEMENT_PACKS_DIR, RW_AUDIT_OUT_DIR
 */

import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { sync as globSync } from "glob";
import { fileURLToPath, pathToFileURL } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const TOOLS_ROOT = path.resolve(__dirname, "..");

// =============================================================================
// CONFIG
// =============================================================================

function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--help" || arg === "-h") out.help = true;
    else if (arg === "--core-pack-tools") out.corePackTools = argv[++i];
    else if (arg === "--core-pack") out.corePack = argv[++i];
    else if (arg === "--element-packs") out.elementPacks = argv[++i];
    else if (arg === "--out-dir") out.outDir = argv[++i];
  }
  return out;
}

function resolveConfig() {
  const cli = parseArgs(process.argv.slice(2));

  if (cli.help) {
    console.log(fs.readFileSync(__filename, "utf-8").match(/\/\*\*([\s\S]*?)\*\//)[1]);
    process.exit(0);
  }

  const siblingsRoot = path.resolve(TOOLS_ROOT, "..");

  const corePackTools = path.resolve(
    cli.corePackTools || process.env.RW_CORE_PACK_TOOLS_DIR || TOOLS_ROOT
  );
  const corePack = path.resolve(
    cli.corePack || process.env.RW_CORE_PACK_DIR || path.join(siblingsRoot, "RWElementsCorePack")
  );
  const elementPacks = path.resolve(
    cli.elementPacks || process.env.RW_ELEMENT_PACKS_DIR || path.join(siblingsRoot, "RWElementPacks")
  );
  const outDir = path.resolve(
    cli.outDir ||
      process.env.RW_AUDIT_OUT_DIR ||
      path.join(siblingsRoot, "RapidWeaverElements", "RapidWeaver", "#Scratch", "AI-Property-Coverage-Report")
  );

  return { corePackTools, corePack, elementPacks, outDir };
}

// =============================================================================
// SHARED CLASSIFICATION RULES (mirrors MCPCuratedCatalogCompiler.swift)
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

function isDisplayOnly(prop) {
  return DISPLAY_ONLY_KEYS.some((key) => prop[key] !== undefined);
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
// `MCPCuratedCatalogCompiler.compile()` processes one component's (or one collection
// item's) properties in file order and rejects any `ai.name` it has already seen
// (`seenAliases`), regardless of which property declared it — see the compiler's
// pass 1 loop. That rejection is silent at the schema level (only a console `Issue` is
// logged): the LLM keeps working, it just permanently loses access to whichever property
// lost the race. This scans the same rows this report already collects for exactly that
// failure mode, splitting it into two buckets:
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
 * embedded control's `id`/`ai.name` with a literal `"{{value}}"` template (see e.g.
 * `controls/Borders/Borders.js`'s `id: "{{value}}End"` on each of its 4 embedded border
 * sub-controls) — `build-properties.js` substitutes each embedding's own id into that
 * placeholder, but a shared control's *raw*, unexpanded item array can't resolve that
 * substitution, so several genuinely-distinct embeddings look identical (same literal
 * `"{{value}}..."` string) until expansion. Real per-component collisions are already caught
 * accurately by the (fully expanded) `properties.json` scan in `auditPacksTree` — so at the
 * shared-control level, only compare rows whose id/alias are template-free.
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
  const duplicateDeclarations = [];
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
    if (rows.length === 0) continue; // export carries no addressable properties (e.g. pure composition of other controls)
    const { collisions, duplicateDeclarations } = findAliasIssues(rows);
    controls.push({ name, rows, collisions, duplicateDeclarations, ...summarize(rows) });
  }

  controls.sort((a, b) => a.coverage - b.coverage || a.name.localeCompare(b.name));
  return controls;
}

// =============================================================================
// SHARED CONTROL USAGE — how many times each control's properties actually end up expanded
// into a generated properties.json, across RWElementsCorePack + RWElementPacks. This is the
// "impact" signal: a control expanded 50 times is a much higher-leverage fix than one expanded
// 4 times, regardless of how many properties it defines.
//
// Controls can reference each other via `globalControl` (e.g. `Borders` embeds `BorderStyle`,
// `BorderColor`, etc. — see `controls/Borders/Borders.js`), and `build-properties.js` expands
// these recursively. So a control's true usage isn't just its direct `globalControl` references
// from component `properties.config.json` files — it also inherits usage transitively through
// every other control that embeds it, each such embedding activated once per usage of its parent.
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
 * across the given pack roots — following `globalControl` composition transitively.
 */
function countControlActivations(modules, packsRoots) {
  // Root activations: one per `globalControl` reference in a real component's properties.config.json.
  const rootCounts = new Map(); // controlName -> count
  for (const packsRoot of packsRoots) {
    const pattern = path.join(packsRoot, "packs", "*.elementsdevpack", "components", "**", "properties.config.json");
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
  // control can embed the same child more than once, e.g. Borders embeds BorderStyle for both
  // its base and hover-end states — each is a distinct expansion site).
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
// SOURCE 2 & 3: generated properties.json across a packs/ tree
// =============================================================================

/**
 * Walks `<packsRoot>/packs/*.elementsdevpack/components/**\/properties.json`, grouping results
 * by pack -> component -> (optional collection sub-path).
 *
 * Also returns `collisionReports`: one entry per `properties.json` file that has an alias
 * collision or duplicate declaration (see `findAliasIssues`) — each file is its own compile
 * unit, so this mirrors exactly what `MCPCuratedCatalogCompiler.compile()` would flag at runtime.
 */
function auditPacksTree(packsRoot) {
  const pattern = path.join(packsRoot, "packs", "*.elementsdevpack", "components", "**", "properties.json");
  const files = globSync(pattern, { windowsPathsNoEscape: true }).sort();

  const packs = new Map(); // packName -> Map(componentId -> { title, entries: [{ subPath, rows }] })
  const collisionReports = [];

  for (const file of files) {
    const rel = path.relative(path.join(packsRoot, "packs"), file);
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
      const infoPath = path.join(packsRoot, "packs", packDirName, "components", componentId, "info.json");
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

/** Flattens a single pack's `Map(componentId -> component)` into a sorted, summarized list. */
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

function renderNotCuratedTable(rows) {
  // Deliberate `ai.exclude: true` opt-outs are not gaps — they're covered separately in the
  // Exclusions Review section — so they're left out of this table entirely.
  const gaps = rows.filter((r) => r.status === "uncurated" || r.status === "ai-incomplete");
  if (gaps.length === 0) return "_All addressable properties are curated (aside from deliberate exclusions — see the Exclusions Review section)._\n";
  const lines = [
    "| Property ID | Title | Control Type | Group | Status |",
    "|---|---|---|---|---|",
  ];
  for (const r of gaps) {
    const status = { uncurated: "Not curated", "ai-incomplete": "`ai` block missing `name`" }[r.status] ?? r.status;
    lines.push(`| \`${r.id}\` | ${r.title ?? "—"} | ${r.controlType} | ${r.groupTitle ?? "—"} | ${status} |`);
  }
  return lines.join("\n") + "\n";
}

function renderExclusionsSection(items) {
  const lines = ["## Explicit Exclusions Review", ""];
  lines.push(
    "Properties whose `ai` block sets `exclude: true` are a deliberate opt-out (e.g. a hover/end-state variant that ",
    "would collide with its base alias) — not a coverage gap, so they're left out of the *Not Curated* / *Gaps* tables ",
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
 * Flattens an array of `{ componentTitle, componentId, subPath, collisions, duplicateDeclarations }`
 * reports (as produced by `auditPacksTree`) into the flat `{ location, name, ids }` /
 * `{ location, name, id, count }` shape `renderCollisionsSection` expects.
 * @param {(report: object) => string} locationFor - builds the human-readable location label for one report.
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
 * Flattens a list of `{ rows, ... }` entries (a shared control or a component summary) into
 * the flat `{ location, id, title, reason }` items `renderExclusionsSection` expects — one row
 * per property that's a deliberate `ai.exclude: true` opt-out (not a coverage gap).
 * @param {(entry: object) => string} locationFor - builds the human-readable location label for one entry.
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
    "Each component — and each shared control, and each nested collection item — is curated independently ",
    "(mirrors [`MCPCuratedCatalogCompiler.compile()`](../../RWElements/MCPCuratedCatalogCompiler.swift), which runs once per `properties.json`). ",
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
  "**Curated rule** (mirrors [`MCPCuratedCatalogCompiler.compile()`](../../RWElements/MCPCuratedCatalogCompiler.swift) in the app):",
  "",
  "```",
  "curated  <=>  property.ai?.name is a non-empty string  AND  property.ai?.exclude != true",
  "```",
  "",
  "| Status | Meaning |",
  "|---|---|",
  "| **Not curated** | No `ai` block at all — the common gap. Add `ai: { name, description }` to expose it. |",
  "| **Explicitly excluded** | `ai: { exclude: true }` — a deliberate opt-out (e.g. a hover/end-state variant that would collide with its base alias). Not a gap, so it's kept out of the *Not Curated* / *Gaps* tables entirely and surfaced instead in the dedicated **Explicit Exclusions Review** section, alongside its `ai.reason` (when authored), for human sanity-checking. |",
  "| **`ai` block missing `name`** | Malformed — an `ai` object exists but has no `name`, so it contributes nothing. Likely a mistake. |",
  "",
  "Display-only inspector rows (`heading`, `divider`, `information`, `description`) carry no `id` and can never be curated — they're excluded from every count in this report.",
].join("\n");

function renderSharedControlsSection(controls, usage) {
  const lines = ["## Shared Controls — `RWElementsPacksTools/controls`", ""];
  lines.push(
    "Each shared control is referenced via `globalControl` from one or more components across every pack. ",
    "A gap here is the highest-leverage fix: annotating one control's `ai` metadata propagates to every component that uses it (after a rebuild).",
    "",
    "**Usage** = number of times this control is actually expanded into a generated `properties.json`, across every component in `RWElementsCorePack` + `RWElementPacks` combined — ",
    "following `globalControl` composition transitively (e.g. `Borders` embeds `BorderStyle`/`BorderColor`/etc., so their usage includes every component that uses `Borders`, not just direct references). ",
    "**Impact** = `Usage × Not Curated` — a rough proxy for how many exposed-property opportunities a fix to this control would unlock; sort by this to prioritize.",
    ""
  );

  const withUsage = controls.map((c) => {
    const usageCount = usage.get(c.name) ?? 0;
    return { ...c, usage: usageCount, impact: usageCount * c.gaps };
  });

  const totals = summarize(controls.flatMap((c) => c.rows));
  lines.push(`**Totals:** ${totals.curated}/${totals.total} properties curated (${pct(totals.coverage)}).`, "");

  const byImpact = [...withUsage].sort((a, b) => b.impact - a.impact || a.name.localeCompare(b.name));
  lines.push("### Ranked by impact (usage × not-curated)", "");
  lines.push("| Control | Usage | Properties | Curated | Not Curated | Coverage | Impact |", "|---|---|---|---|---|---|---|");
  for (const c of byImpact) {
    lines.push(`| \`${c.name}\` | ${c.usage} | ${c.total} | ${c.curated} | ${c.gaps} | ${coverageBadge(c.coverage)} ${pct(c.coverage)} | ${c.impact} |`);
  }
  lines.push("");

  const gappy = byImpact.filter((c) => c.gaps > 0);
  lines.push(`### Gaps by control (${gappy.length} of ${controls.length} controls have at least one non-curated property, ordered by impact)`, "");
  for (const c of gappy) {
    lines.push(`<details><summary><code>${c.name}</code> — used ${c.usage}× — ${c.curated}/${c.total} curated (${pct(c.coverage)}) — impact ${c.impact}</summary>`, "");
    lines.push(renderNotCuratedTable(c.rows));
    lines.push("</details>", "");
  }

  return lines.join("\n");
}

function renderComponentsSection(heading, intro, componentSummaries) {
  const lines = [heading, "", intro, ""];

  const totals = summarize(componentSummaries.flatMap((c) => c.rows));
  lines.push(`**Totals:** ${componentSummaries.length} components, ${totals.curated}/${totals.total} properties curated (${pct(totals.coverage)}).`, "");

  lines.push("| Component | Properties | Curated | Not Curated | Coverage |", "|---|---|---|---|---|");
  for (const c of componentSummaries) {
    lines.push(`| ${c.title} (\`${c.componentId}\`) | ${c.total} | ${c.curated} | ${c.gaps} | ${coverageBadge(c.coverage)} ${pct(c.coverage)} |`);
  }
  lines.push("");

  const gappy = componentSummaries.filter((c) => c.gaps > 0);
  lines.push(`### Gaps by component (${gappy.length} of ${componentSummaries.length} components have at least one non-curated property)`, "");
  for (const c of gappy) {
    lines.push(`<details><summary><b>${c.title}</b> (<code>${c.componentId}</code>) — ${c.curated}/${c.total} curated (${pct(c.coverage)})</summary>`, "");
    lines.push(renderNotCuratedTable(c.rows));
    lines.push("</details>", "");
  }

  return lines.join("\n");
}

// =============================================================================
// MAIN
// =============================================================================

async function main() {
  const config = resolveConfig();

  for (const [label, dir] of [
    ["RWElementsPacksTools", config.corePackTools],
    ["RWElementsCorePack", config.corePack],
    ["RWElementPacks", config.elementPacks],
  ]) {
    if (!fs.existsSync(dir)) {
      console.error(`[audit-ai-properties] ${label} not found at ${dir}`);
      process.exit(1);
    }
  }

  console.log("[audit-ai-properties] Auditing shared controls…");
  const controlModules = await loadControlModules(config.corePackTools);
  const sharedControls = auditSharedControls(controlModules);
  const controlUsage = countControlActivations(controlModules, [config.corePack, config.elementPacks]);

  console.log("[audit-ai-properties] Auditing RWElementsCorePack…");
  const { packs: corePackTree, collisionReports: coreCollisionReports } = auditPacksTree(config.corePack);

  console.log("[audit-ai-properties] Auditing RWElementPacks…");
  const { packs: elementPacksTree, collisionReports: elementPacksCollisionReports } = auditPacksTree(config.elementPacks);

  const sharedTotals = summarize(sharedControls.flatMap((c) => c.rows));

  // ---- Alias collision items, per source (used at the top of every generated doc) ------
  const sharedControlCollisionItems = collisionItemsFromReports(
    sharedControls.filter((c) => c.collisions.length > 0 || c.duplicateDeclarations.length > 0),
    (c) => `Shared Control → \`${c.name}\``
  );
  const coreCollisionItems = collisionItemsFromReports(
    coreCollisionReports,
    (r) => `RWElementsCorePack → ${r.componentTitle} (\`${r.componentId}\`${r.subPath ? ` → ${r.subPath}` : ""})`
  );
  const elementPacksCollisionItems = collisionItemsFromReports(
    elementPacksCollisionReports,
    (r) => `RWElementPacks → ${r.packName} → ${r.componentTitle} (\`${r.componentId}\`${r.subPath ? ` → ${r.subPath}` : ""})`
  );
  const allCollisionItems = [
    ...sharedControlCollisionItems.collisionItems,
    ...coreCollisionItems.collisionItems,
    ...elementPacksCollisionItems.collisionItems,
  ];
  const allDuplicateItems = [
    ...sharedControlCollisionItems.duplicateItems,
    ...coreCollisionItems.duplicateItems,
    ...elementPacksCollisionItems.duplicateItems,
  ];

  // ---- Explicit exclusions, per source ------------------------------------
  // A shared control's excluded property (e.g. `Transforms`'s `globalTransformsState`) gets
  // expanded, via `globalControl`, into every component that embeds it — so it'd otherwise show
  // up dozens of times over, once per component, drowning out the exclusions a component actually
  // owns itself. It's fully documented once at the shared-control level, so `sharedExcludedIds`
  // is used below to strip those inherited duplicates back out of the pack-level lists.
  const sharedControlExclusionItems = collectExclusionItems(sharedControls, (c) => `Shared Control → \`${c.name}\``);
  const sharedExcludedIds = new Set(sharedControlExclusionItems.map((i) => i.id));

  const coreComponentsByPack = [...corePackTree.entries()].map(([packName, components]) => [packName, summarizeComponents(components)]);
  const coreComponents = coreComponentsByPack.flatMap(([, list]) => list);
  const coreTotals = summarize(coreComponents.flatMap((c) => c.rows));
  const coreExclusionItems = collectExclusionItems(coreComponents, (c) => `RWElementsCorePack → ${c.title} (\`${c.componentId}\`)`).filter(
    (i) => !sharedExcludedIds.has(i.id)
  );

  const elementPacksByPack = [...elementPacksTree.entries()]
    .map(([packName, components]) => [packName, summarizeComponents(components)])
    .sort((a, b) => a[0].localeCompare(b[0]));
  const packsRows = elementPacksByPack.flatMap(([, list]) => list.flatMap((c) => c.rows));
  const packsTotals = summarize(packsRows);
  const elementPacksExclusionItems = elementPacksByPack
    .flatMap(([packName, list]) => collectExclusionItems(list, (c) => `RWElementPacks → ${packName} → ${c.title} (\`${c.componentId}\`)`))
    .filter((i) => !sharedExcludedIds.has(i.id));
  const allExclusionItems = [...sharedControlExclusionItems, ...coreExclusionItems, ...elementPacksExclusionItems];

  const generatedAt = new Date().toISOString();
  const revisions = [
    `RWElementsPacksTools @ ${gitRevision(config.corePackTools)}`,
    `RWElementsCorePack @ ${gitRevision(config.corePack)}`,
    `RWElementPacks @ ${gitRevision(config.elementPacks)}`,
  ];

  const header = [
    `> Generated ${generatedAt} by [\`RWElementsPacksTools/scripts/audit-ai-properties.js\`](https://github.com/realmacsoftware/RWElementsPacksTools/blob/main/scripts/audit-ai-properties.js).`,
    `> Source revisions: ${revisions.join(" · ")}.`,
  ].join("\n");

  fs.mkdirSync(config.outDir, { recursive: true });
  const packsDir = path.join(config.outDir, "Packs");
  fs.mkdirSync(packsDir, { recursive: true });

  // ---- Core-Pack-Tools.md ------------------------------------------------
  const corePackToolsDoc = [
    "# AI Property Coverage — Core Pack & Tools",
    "",
    header,
    "",
    "> Part of the [AI Property Coverage Report](./README.md). See that file for full methodology and cross-repo totals.",
    "",
    "---",
    "",
    renderCollisionsSection(
      [...sharedControlCollisionItems.collisionItems, ...coreCollisionItems.collisionItems],
      [...sharedControlCollisionItems.duplicateItems, ...coreCollisionItems.duplicateItems]
    ),
    "",
    "---",
    "",
    renderSharedControlsSection(sharedControls, controlUsage),
    "",
    "---",
    "",
    renderComponentsSection(
      "## `RWElementsCorePack` — Built-in Components",
      "Generated `properties.json` for every built-in component (including nested collections, e.g. accordion tags / table columns).",
      coreComponents
    ),
    "",
    "---",
    "",
    renderExclusionsSection([...sharedControlExclusionItems, ...coreExclusionItems]),
    "",
  ].join("\n");
  fs.writeFileSync(path.join(config.outDir, "Core-Pack-Tools.md"), corePackToolsDoc, "utf-8");

  // ---- Packs/<PackName>.md, one per additional pack ----------------------
  const packLinks = [];
  for (const [packName, componentSummaries] of elementPacksByPack) {
    const totals = summarize(componentSummaries.flatMap((c) => c.rows));
    const slug = slugify(packName);
    const fileName = `${slug}.md`;
    packLinks.push({ packName, fileName, totals, componentCount: componentSummaries.length });

    const { collisionItems: packCollisionItems, duplicateItems: packDuplicateItems } = collisionItemsFromReports(
      elementPacksCollisionReports.filter((r) => r.packName === packName),
      (r) => `${r.componentTitle} (\`${r.componentId}\`${r.subPath ? ` → ${r.subPath}` : ""})`
    );
    const packExclusionItems = collectExclusionItems(componentSummaries, (c) => `${c.title} (\`${c.componentId}\`)`).filter(
      (i) => !sharedExcludedIds.has(i.id)
    );

    const doc = [
      `# AI Property Coverage — ${packName}`,
      "",
      header,
      "",
      "> Part of the [AI Property Coverage Report](../README.md). See that file for full methodology and cross-repo totals.",
      "",
      "---",
      "",
      renderCollisionsSection(packCollisionItems, packDuplicateItems),
      "",
      "---",
      "",
      renderComponentsSection(
        `## ${packName}`,
        `Generated \`properties.json\` for every component in the \`${packName}\` pack (\`RWElementPacks\`).`,
        componentSummaries
      ),
      "",
      "---",
      "",
      renderExclusionsSection(packExclusionItems),
      "",
    ].join("\n");
    fs.writeFileSync(path.join(packsDir, fileName), doc, "utf-8");
  }

  // ---- README.md (index) --------------------------------------------------
  const readme = [
    "# AI Property Coverage Report",
    "",
    header,
    "",
    renderCollisionsSection(allCollisionItems, allDuplicateItems),
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
    "| Source | Components / Controls | Properties (addressable) | Curated | Not Curated | Coverage |",
    "|---|---|---|---|---|---|",
    `| Shared Controls (\`RWElementsPacksTools\`) | ${sharedControls.length} controls | ${sharedTotals.total} | ${sharedTotals.curated} | ${sharedTotals.gaps} | ${coverageBadge(sharedTotals.coverage)} ${pct(sharedTotals.coverage)} |`,
    `| \`RWElementsCorePack\` | ${coreComponents.length} components | ${coreTotals.total} | ${coreTotals.curated} | ${coreTotals.gaps} | ${coverageBadge(coreTotals.coverage)} ${pct(coreTotals.coverage)} |`,
    `| \`RWElementPacks\` | ${elementPacksByPack.reduce((n, [, list]) => n + list.length, 0)} components across ${elementPacksByPack.length} packs | ${packsTotals.total} | ${packsTotals.curated} | ${packsTotals.gaps} | ${coverageBadge(packsTotals.coverage)} ${pct(packsTotals.coverage)} |`,
    "",
    "---",
    "",
    "## Reports",
    "",
    `- [**Core Pack & Tools**](./Core-Pack-Tools.md) — shared controls (\`RWElementsPacksTools\`, ranked by impact) + \`RWElementsCorePack\` built-in components. ${sharedTotals.curated + coreTotals.curated}/${sharedTotals.total + coreTotals.total} curated.`,
    "- **Additional Packs** (`RWElementPacks`) — one report per pack:",
    "",
    "  | Pack | Components | Curated | Not Curated | Coverage |",
    "  |---|---|---|---|---|",
    ...packLinks.map(
      (p) =>
        `  | [${p.packName}](./Packs/${p.fileName}) | ${p.componentCount} | ${p.totals.curated} | ${p.totals.gaps} | ${coverageBadge(p.totals.coverage)} ${pct(p.totals.coverage)} |`
    ),
    "",
    "---",
    "",
    renderExclusionsSection(allExclusionItems),
    "",
  ].join("\n");
  fs.writeFileSync(path.join(config.outDir, "README.md"), readme, "utf-8");

  console.log(`[audit-ai-properties] Report written to ${config.outDir}`);
  console.log(
    `[audit-ai-properties] Shared controls ${pct(sharedTotals.coverage)} · Core pack ${pct(coreTotals.coverage)} · Element packs ${pct(packsTotals.coverage)}`
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
