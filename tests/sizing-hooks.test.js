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

function baseSizingProps(overrides = {}) {
  return {
    globalWidth: "w-64",
    globalHeight: "h-32",
    globalMinWidth: "min-w-10",
    globalMaxWidth: "max-w-96",
    globalMinHeight: "min-h-10",
    globalMaxHeight: "max-h-96",
    ...overrides,
  };
}

function baseSizingContainerProps(overrides = {}) {
  return baseSizingProps({
    globalWidthType: "theme",
    globalHeightType: "theme",
    ...overrides,
  });
}

const { globalSizing, globalSizingContainer } = loadHook(
  "({ globalSizing, globalSizingContainer })",
  [
    "../shared-hooks/core/classnames.js",
    "../shared-hooks/core/switchToBool.js",
    "../shared-hooks/sizing/globalSizing.js",
    "../shared-hooks/sizing/globalSizingContainer.js",
  ],
);

test("global sizing includes min/max classes when the boolean switch is on", () => {
  const classes = globalSizing({
    props: baseSizingProps({ globalSizingMinMaxEnabled: true }),
  });

  assert.match(classes, /\bmin-w-10\b/);
  assert.match(classes, /\bmax-w-96\b/);
  assert.match(classes, /\bmin-h-10\b/);
  assert.match(classes, /\bmax-h-96\b/);
});

test("global sizing includes min/max classes for the legacy string on value", () => {
  const classes = globalSizing({
    props: baseSizingProps({ globalSizingMinMaxEnabled: "true" }),
  });

  assert.match(classes, /\bmin-w-10\b/);
  assert.match(classes, /\bmax-h-96\b/);
});

test("global sizing omits min/max classes when the switch is off or absent", () => {
  for (const value of [false, "false", undefined]) {
    const classes = globalSizing({
      props: baseSizingProps({ globalSizingMinMaxEnabled: value }),
    });

    assert.match(classes, /\bw-64\b/);
    assert.match(classes, /\bh-32\b/);
    assert.doesNotMatch(classes, /\bmin-w-10\b/);
    assert.doesNotMatch(classes, /\bmax-w-96\b/);
  }
});

test("global sizing container includes min/max classes for boolean and legacy string on values", () => {
  for (const value of [true, "true"]) {
    const classes = globalSizingContainer({
      props: baseSizingContainerProps({ globalSizingMinMaxEnabled: value }),
    });

    assert.match(classes, /\bw-64\b/);
    assert.match(classes, /\bh-32\b/);
    assert.match(classes, /\bmin-w-10\b/);
    assert.match(classes, /\bmax-h-96\b/);
  }
});

test("global sizing container omits min/max classes when the switch is off or absent", () => {
  for (const value of [false, "false", undefined]) {
    const classes = globalSizingContainer({
      props: baseSizingContainerProps({ globalSizingMinMaxEnabled: value }),
    });

    assert.match(classes, /\bw-64\b/);
    assert.match(classes, /\bh-32\b/);
    assert.doesNotMatch(classes, /\bmin-w-10\b/);
    assert.doesNotMatch(classes, /\bmax-w-96\b/);
  }
});
