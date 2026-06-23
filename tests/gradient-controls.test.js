import assert from "node:assert/strict";
import test from "node:test";

import * as Controls from "../controls/index.js";
import * as Properties from "../properties/index.js";

function collectIds(control) {
  const ids = [];

  function visit(value) {
    if (Array.isArray(value)) {
      value.forEach(visit);
      return;
    }

    if (!value || typeof value !== "object") {
      return;
    }

    if (typeof value.id === "string") {
      ids.push(value.id);
    }

    Object.values(value).forEach(visit);
  }

  visit(control);
  return ids;
}

function findControlById(control, id) {
  if (Array.isArray(control)) {
    for (const item of control) {
      const match = findControlById(item, id);
      if (match) return match;
    }
    return null;
  }

  if (!control || typeof control !== "object") {
    return null;
  }

  if (control.id === id) {
    return control;
  }

  for (const value of Object.values(control)) {
    const match = findControlById(value, id);
    if (match) return match;
  }

  return null;
}

function assertIncludesInOrder(actual, expected) {
  let searchFrom = 0;

  for (const id of expected) {
    const index = actual.indexOf(id, searchFrom);
    assert.notEqual(index, -1, `Expected to find existing id "${id}"`);
    searchFrom = index + 1;
  }
}

test("global background gradient keeps existing property IDs", () => {
  const ids = collectIds(Controls.Background_Gradient);

  assertIncludesInOrder(ids, [
    "globalBgGradientDirection",
    "globalBgGradientFromColor",
    "globalBgGradientFromOpacity",
    "globalBgGradientFromPosition",
    "globalBgGradientViaEnabled",
    "globalBgGradientViaColor",
    "globalBgGradientViaOpacity",
    "globalBgGradientViaPosition",
    "globalBgGradientToColor",
    "globalBgGradientToOpacity",
    "globalBgGradientToPosition",
    "globalBgGradientDirectionEnd",
    "globalBgGradientFromColorEnd",
    "globalBgGradientFromOpacityEnd",
    "globalBgGradientViaEnabledEnd",
    "globalBgGradientViaColorEnd",
    "globalBgGradientViaOpacityEnd",
    "globalBgGradientToColorEnd",
    "globalBgGradientToOpacityEnd",
  ]);
});

test("container background gradient keeps existing property IDs", () => {
  const ids = collectIds(Controls.Background_Gradient_Container);

  assertIncludesInOrder(ids, [
    "globalBgGradientDirection",
    "globalBgGradientFromColor",
    "globalBgGradientFromOpacity",
    "globalBgGradientFromPosition",
    "globalBgGradientViaEnabled",
    "globalBgGradientViaColor",
    "globalBgGradientViaOpacity",
    "globalBgGradientViaPosition",
    "globalBgGradientToColor",
    "globalBgGradientToOpacity",
    "globalBgGradientToPosition",
    "globalBgGradientDirectionEnd",
    "globalBgGradientFromColorEnd",
    "globalBgGradientFromOpacityEnd",
    "globalBgGradientViaEnabledEnd",
    "globalBgGradientViaColorEnd",
    "globalBgGradientViaOpacityEnd",
    "globalBgGradientToColorEnd",
    "globalBgGradientToOpacityEnd",
  ]);
});

test("overlay gradient keeps existing property IDs", () => {
  const ids = collectIds(Controls.Overlay_Gradient);

  assertIncludesInOrder(ids, [
    "globalOverlayGradientDirection",
    "globalOverlayGradientFromColor",
    "globalOverlayGradientFromOpacity",
    "globalOverlayGradientFromPosition",
    "globalOverlayGradientViaEnabled",
    "globalOverlayGradientViaColor",
    "globalOverlayGradientViaOpacity",
    "globalOverlayGradientViaPosition",
    "globalOverlayGradientToColor",
    "globalOverlayGradientToOpacity",
    "globalOverlayGradientToPosition",
    "globalOverlayGradientDirectionEnd",
    "globalOverlayGradientFromColorEnd",
    "globalOverlayGradientFromOpacityEnd",
    "globalOverlayGradientFromPositionEnd",
    "globalOverlayGradientViaEnabledEnd",
    "globalOverlayGradientViaColorEnd",
    "globalOverlayGradientViaOpacityEnd",
    "globalOverlayGradientViaPositionEnd",
    "globalOverlayGradientToColorEnd",
    "globalOverlayGradientToOpacityEnd",
    "globalOverlayGradientToPositionEnd",
  ]);
});

test("standalone background gradient keeps existing property IDs", () => {
  const ids = collectIds(Controls.BackgroundGradient);

  assertIncludesInOrder(ids, [
    "bgGradientDirection",
    "gradientFromColor",
    "gradientFromOpacity",
    "gradientFromPosition",
    "wantsGradientVia",
    "gradientViaColor",
    "gradientViaOpacity",
    "gradientViaPosition",
    "gradientToColor",
    "gradientToOpacity",
    "gradientToPosition",
  ]);
});

test("gradient direction property exposes Tailwind 4 gradient image utilities", () => {
  const values = Properties.GradientDirection.items.map((item) => item.value);

  assert.equal(Properties.GradientDirection.default, "bg-linear-to-b");
  assert.ok(values.includes("bg-linear-to-r"));
  assert.ok(values.includes("bg-radial"));
  assert.ok(values.includes("bg-radial-[at_50%_75%]"));
  assert.ok(values.includes("bg-conic"));
  assert.ok(values.includes("bg-conic-180"));
});

test("gradient stop position formats use Tailwind 4 percentage syntax", () => {
  assert.equal(
    findControlById(Controls.Background_Gradient, "globalBgGradientFromPosition").format,
    "from-{{value}}%",
  );
  assert.equal(
    findControlById(Controls.Background_Gradient, "globalBgGradientViaPosition").format,
    "via-{{value}}%",
  );
  assert.equal(
    findControlById(Controls.Background_Gradient, "globalBgGradientToPosition").format,
    "to-{{value}}%",
  );
  assert.equal(
    findControlById(Controls.Overlay_Gradient, "globalOverlayGradientToPositionEnd").format,
    "to-{{value}}%",
  );
  assert.equal(
    findControlById(Controls.BackgroundGradient, "gradientFromPosition").format,
    "from-{{value}}%",
  );
});

test("background gradient color formats use Tailwind 4 CSS variable opacity shorthand", () => {
  assert.equal(
    findControlById(Controls.Background_Gradient, "globalBgGradientFromColor").format,
    "from-{{value}}/(--bgGradientFromOpacity)",
  );
  assert.equal(
    findControlById(Controls.Background_Gradient, "globalBgGradientViaColor").format,
    "via-{{value}}/(--bgGradientViaOpacity)",
  );
  assert.equal(
    findControlById(Controls.Background_Gradient, "globalBgGradientToColor").format,
    "to-{{value}}/(--bgGradientToOpacity)",
  );
  assert.equal(
    findControlById(Controls.Background_Gradient, "globalBgGradientFromColorEnd").format,
    "hover:from-{{value}}/(--bgGradientFromOpacityEnd)",
  );
  assert.equal(
    findControlById(Controls.Background_Gradient, "globalBgGradientViaColorEnd").format,
    "hover:via-{{value}}/(--bgGradientViaOpacityEnd)",
  );
  assert.equal(
    findControlById(Controls.Background_Gradient, "globalBgGradientToColorEnd").format,
    "hover:to-{{value}}/(--bgGradientToOpacityEnd)",
  );
});
