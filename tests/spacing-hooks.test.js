import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import test from "node:test";

function loadHook(exportsExpression, files) {
  const source = files
    .map((file) => fs.readFileSync(new URL(file, import.meta.url), "utf8"))
    .join("\n\n");
  const context = { console };

  vm.runInNewContext(`${source}\n\nglobalThis.__exports = ${exportsExpression};`, context);

  return context.__exports;
}

function baseSpacingProps(overrides = {}) {
  return {
    globalMargin: "m-4",
    globalPadding: "p-4",
    ...overrides,
  };
}

const { globalSpacing, globalSpacingMargin, globalSpacingPadding } = loadHook(
  "({ globalSpacing, globalSpacingMargin, globalSpacingPadding })",
  [
    "../shared-hooks/core/classnames.js",
    "../shared-hooks/core/switchToBool.js",
    "../shared-hooks/spacing/globalSpacing.js",
    "../shared-hooks/spacing/globalSpacingMargin.js",
    "../shared-hooks/spacing/globalSpacingPadding.js",
  ],
);

test("global spacing returns classes when the boolean switch is on", () => {
  const classes = globalSpacing({
    props: baseSpacingProps({ globalSpacingEnabled: true }),
  });

  assert.match(classes, /\bm-4\b/);
  assert.match(classes, /\bp-4\b/);
});

test("global spacing returns false when the boolean switch is off", () => {
  assert.equal(
    globalSpacing({ props: baseSpacingProps({ globalSpacingEnabled: false }) }),
    false,
  );
});

test("global spacing returns classes for the legacy string on value", () => {
  const classes = globalSpacing({
    props: baseSpacingProps({ globalSpacingEnabled: "true" }),
  });

  assert.match(classes, /\bm-4\b/);
  assert.match(classes, /\bp-4\b/);
});

test("global spacing returns false for the legacy string off value", () => {
  assert.equal(
    globalSpacing({ props: baseSpacingProps({ globalSpacingEnabled: "false" }) }),
    false,
  );
});

test("global spacing defaults to enabled when the switch prop is absent", () => {
  const classes = globalSpacing({ props: baseSpacingProps() });

  assert.match(classes, /\bm-4\b/);
  assert.match(classes, /\bp-4\b/);
});

test("global spacing margin respects boolean and legacy string switch values", () => {
  assert.equal(
    globalSpacingMargin({ props: baseSpacingProps({ globalSpacingEnabled: true }) }),
    "m-4",
  );
  assert.equal(
    globalSpacingMargin({ props: baseSpacingProps({ globalSpacingEnabled: "true" }) }),
    "m-4",
  );
  assert.equal(
    globalSpacingMargin({ props: baseSpacingProps({ globalSpacingEnabled: false }) }),
    false,
  );
  assert.equal(
    globalSpacingMargin({ props: baseSpacingProps({ globalSpacingEnabled: "false" }) }),
    false,
  );
  assert.equal(globalSpacingMargin({ props: baseSpacingProps() }), "m-4");
});

test("global spacing padding respects boolean and legacy string switch values", () => {
  assert.equal(
    globalSpacingPadding({ props: baseSpacingProps({ globalSpacingEnabled: true }) }),
    "p-4",
  );
  assert.equal(
    globalSpacingPadding({ props: baseSpacingProps({ globalSpacingEnabled: "true" }) }),
    "p-4",
  );
  assert.equal(
    globalSpacingPadding({ props: baseSpacingProps({ globalSpacingEnabled: false }) }),
    false,
  );
  assert.equal(
    globalSpacingPadding({ props: baseSpacingProps({ globalSpacingEnabled: "false" }) }),
    false,
  );
  assert.equal(globalSpacingPadding({ props: baseSpacingProps() }), "p-4");
});
