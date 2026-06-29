import assert from "node:assert/strict";
import test from "node:test";

import * as Controls from "../controls/index.js";
import * as Properties from "../properties/index.js";

const DEFAULT_REQUIRED_CONTROL_KEYS = [
  "number",
  "segmented",
  "select",
  "slider",
  "switch",
  "text",
  "textArea",
  "themeBorderRadius",
  "themeBorderWidth",
  "themeColor",
  "themeFont",
  "themeShadow",
  "themeSpacing",
  "themeTextStyle",
];

const CONTROL_KEYS = new Set([
  ...DEFAULT_REQUIRED_CONTROL_KEYS,
  "divider",
  "heading",
  "information",
  "link",
  "resource",
]);

function hasOwn(value, key) {
  return Object.prototype.hasOwnProperty.call(value, key);
}

function resolveUseReference(control) {
  const resolved = { ...control };

  for (const [key, value] of Object.entries(resolved)) {
    if (!value || typeof value !== "object" || !value.use) {
      continue;
    }

    const { use, ...localOverrides } = value;
    resolved[key] = { ...Properties[use], ...localOverrides };
  }

  return resolved;
}

function collectControlDefaults(control, path, missingDefaults) {
  if (Array.isArray(control)) {
    control.forEach((item, index) => {
      collectControlDefaults(item, `${path}[${index}]`, missingDefaults);
    });
    return;
  }

  if (!control || typeof control !== "object") {
    return;
  }

  const resolvedControl = resolveUseReference(control);

  for (const key of DEFAULT_REQUIRED_CONTROL_KEYS) {
    if (!resolvedControl[key]) {
      continue;
    }

    if (!hasOwn(resolvedControl[key], "default")) {
      missingDefaults.push(`${path} (${resolvedControl.id ?? "no id"}).${key}`);
    }
  }

  for (const [key, value] of Object.entries(control)) {
    if (CONTROL_KEYS.has(key)) {
      continue;
    }

    collectControlDefaults(value, `${path}.${key}`, missingDefaults);
  }
}

test("all value-bearing controls define a default", () => {
  const missingDefaults = [];

  for (const [name, control] of Object.entries(Controls)) {
    collectControlDefaults(control, name, missingDefaults);
  }

  assert.deepEqual(missingDefaults, []);
});
