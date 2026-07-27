import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import test from "node:test";

import * as Controls from "../controls/index.js";

function loadHook(exportsExpression, files) {
  const source = files
    .map((file) => fs.readFileSync(new URL(file, import.meta.url), "utf8"))
    .join("\n\n");
  const context = { console };

  vm.runInNewContext(`${source}\n\nglobalThis.__exports = ${exportsExpression};`, context);

  return context.__exports;
}

const globalBorders = loadHook("globalBorders", [
  "../shared-hooks/core/classnames.js",
  "../shared-hooks/core/getHoverPrefix.js",
  "../shared-hooks/borders/globalBorders.js",
]);

function findEndEntry(control, globalControl) {
  return control.find(
    (entry) => entry.globalControl === globalControl && entry.id === "{{value}}End"
  );
}

test("container BorderWidth end entry bakes the same hover format as its Radius sibling", () => {
  const widthEnd = findEndEntry(Controls.BordersContainer, "BorderWidth");
  const radiusEnd = Controls.BordersContainer.find(
    (entry) => entry.id === "globalBordersRadiusEnd"
  );

  assert.ok(widthEnd, "Expected BordersContainer BorderWidth end entry to exist");
  assert.equal(widthEnd.format, "peer-hover:{{value}} hover:{{value}}");
  assert.equal(widthEnd.format, radiusEnd.format);
});

test("plain Borders BorderWidth end entry keeps its hover format", () => {
  const widthEnd = findEndEntry(Controls.Borders, "BorderWidth");

  assert.ok(widthEnd, "Expected Borders BorderWidth end entry to exist");
  assert.equal(widthEnd.format, "hover:{{value}}");
});

function baseBordersProps(overrides = {}) {
  return {
    globalControlTypeBorders: "hover",
    globalBordersWidth: "border-t",
    globalBordersStyle: "border-solid",
    globalBordersRadius: "rounded-lg",
    globalBordersColor: "border-surface-500",
    globalBordersColorOpacity: "[100%]",
    globalBordersWidthEnd: "peer-hover:border-t-2 hover:border-t-2",
    globalBordersRadiusEnd: "peer-hover:rounded-xl hover:rounded-xl",
    globalBordersStyleEnd: "border-dashed",
    globalBordersColorEnd: "border-brand-500",
    globalBordersColorOpacityEnd: "[80%]",
    ...overrides,
  };
}

function makeApp(overrides = {}) {
  return {
    props: baseBordersProps(overrides),
    node: { id: "el1", parent: { id: "parent1" } },
  };
}

test("container hover borders keep the baked peer-hover/hover width prefixes", () => {
  const classes = globalBorders(makeApp(), { isContainer: true });

  assert.match(classes, /peer-hover:border-t-2/);
  assert.match(classes, /(?:^|\s)hover:border-t-2/);
  assert.doesNotMatch(classes, /(?:^|\s)border-t-2(?:\s|$)/);
  assert.match(classes, /group-hover\/el1:border-dashed/);
  assert.match(classes, /group-hover\/el1:border-brand-500\/\[80%\]/);
});

test("container active borders rewrite hover variants instead of stacking them", () => {
  const classes = globalBorders(makeApp(), { isContainer: true, active: true });

  assert.match(classes, /peer-data-\[active=true\]:border-t-2/);
  assert.match(classes, /(?:^|\s)data-\[active=true\]:border-t-2/);
  assert.match(classes, /peer-data-\[active=true\]:rounded-xl/);
  assert.doesNotMatch(classes, /data-\[active=true\]:hover:/);
  assert.doesNotMatch(classes, /hover:data-\[active=true\]:/);
});

test("container focus borders rewrite hover variants instead of stacking them", () => {
  const classes = globalBorders(makeApp(), { isContainer: true, focus: true });

  assert.match(classes, /peer-focus:border-t-2/);
  assert.match(classes, /(?:^|\s)focus:border-t-2/);
  assert.match(classes, /group-focus\/el1:border-dashed/);
  assert.doesNotMatch(classes, /focus:hover:/);
  assert.doesNotMatch(classes, /hover:focus:/);
});

test("static borders emit no hover variants", () => {
  const classes = globalBorders(
    makeApp({ globalControlTypeBorders: "static" }),
    { isContainer: true }
  );

  assert.match(classes, /(?:^|\s)border-t(?:\s|$)/);
  assert.match(classes, /border-surface-500\/\[100%\]/);
  assert.doesNotMatch(classes, /hover:/);
});
