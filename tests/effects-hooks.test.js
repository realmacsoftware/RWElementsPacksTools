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

const globalEffects = loadHook("globalEffects", [
  "../shared-hooks/core/classnames.js",
  "../shared-hooks/core/getHoverPrefix.js",
  "../shared-hooks/core/addPrefixToTailwindClasses.js",
  "../shared-hooks/effects/globalEffects.js",
]);

function baseEffectsProps(overrides = {}) {
  return {
    globalEffectsApplyTo: "",
    globalControlTypeEffects: "hover",
    globalHoverGroupEffects: "self",
    globalHoverGroupCustomIdEffects: "",
    globalBoxShadow: "shadow",
    globalBoxShadowColor: "shadow-surface-200/(--box-shadow-opacity)",
    globalBoxShadowOpacity: "[--box-shadow-opacity:100%]",
    globalOpacity: "opacity-[100%]",
    globalBoxShadowEnd: "shadow-lg",
    globalBoxShadowColorEnd: "hover:shadow-surface-200/(--box-shadow-opacity)",
    globalBoxShadowOpacityEnd: "hover:[--box-shadow-opacity:100%]",
    globalOpacityEnd: "hover:opacity-[100%]",
    ...overrides,
  };
}

function makeApp(overrides = {}) {
  return {
    props: baseEffectsProps(overrides),
    node: { id: "el1", parent: { id: "parent1" } },
  };
}

test("hover effects prefix the end shadow size even when the value has no baked prefix", () => {
  const classes = globalEffects(makeApp());

  assert.equal(
    classes,
    "shadow shadow-surface-200/(--box-shadow-opacity) [--box-shadow-opacity:100%] opacity-[100%] hover:shadow-lg hover:shadow-surface-200/(--box-shadow-opacity) hover:[--box-shadow-opacity:100%] hover:opacity-[100%]"
  );
  assert.doesNotMatch(classes, /(?:^|\s)shadow-lg(?:\s|$)/);
});

test("hover effects do not double-prefix values with a baked hover modifier", () => {
  const classes = globalEffects(makeApp());

  assert.doesNotMatch(classes, /hover:hover:/);
});

test("custom hover groups rewrite baked and unbaked end values to the group prefix", () => {
  const classes = globalEffects(
    makeApp({
      globalHoverGroupEffects: "custom",
      globalHoverGroupCustomIdEffects: "trigger",
    })
  );

  assert.match(classes, /group-hover\/trigger:shadow-lg/);
  assert.match(classes, /group-hover\/trigger:shadow-surface-200\/\(--box-shadow-opacity\)/);
  assert.match(classes, /group-hover\/trigger:\[--box-shadow-opacity:100%\]/);
  assert.match(classes, /group-hover\/trigger:opacity-\[100%\]/);
  assert.doesNotMatch(classes, /(?:^|\s)hover:/);
});

test("active variants replace rather than stack the hover modifier", () => {
  const classes = globalEffects(makeApp(), { active: true });

  assert.match(classes, /data-\[active=true\]:shadow-lg/);
  assert.match(classes, /data-\[active=true\]:shadow-surface-200\/\(--box-shadow-opacity\)/);
  assert.doesNotMatch(classes, /data-\[active=true\]:hover:/);
});

test("focus variants replace rather than stack the hover modifier", () => {
  const classes = globalEffects(makeApp(), { focus: true });

  assert.match(classes, /focus:shadow-lg/);
  assert.match(classes, /focus:shadow-surface-200\/\(--box-shadow-opacity\)/);
  assert.doesNotMatch(classes, /focus:hover:/);
});

test("static effects emit only start-state classes", () => {
  const classes = globalEffects(makeApp({ globalControlTypeEffects: "static" }));

  assert.equal(
    classes,
    "shadow shadow-surface-200/(--box-shadow-opacity) [--box-shadow-opacity:100%] opacity-[100%]"
  );
});
