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

const globalFilters = loadHook("globalFilters", [
  "../shared-hooks/core/classnames.js",
  "../shared-hooks/core/addPrefixToTailwindClasses.js",
  "../shared-hooks/core/getHoverPrefix.js",
  "../shared-hooks/effects/globalFilters.js",
]);

function makeApp({ props = {}, node = {} } = {}) {
  return {
    props: {
      globalControlTypeFilters: "hover",
      globalHoverGroupFilters: "self",
      globalHoverGroupCustomIdFilters: "",
      globalFiltersApplyTo: "",
      globalFiltersBlur: "blur-[0px]",
      globalFiltersBrightness: "brightness-[100%]",
      globalFiltersDropShadow: "drop-shadow-md",
      globalFiltersSaturate: "saturate-[100%]",
      globalFiltersBackdropBlur: "backdrop-blur-[0px]",
      globalFiltersBlurEnd: "blur-[2px] md:blur-[5px]",
      globalFiltersBrightnessEnd: "brightness-[110%]",
      globalFiltersDropShadowEnd: "drop-shadow-lg",
      globalFiltersSaturateEnd: "saturate-[100%]",
      globalFiltersBackdropBlurEnd: "backdrop-blur-[0px]",
      ...props,
    },
    node: { id: "el1", parent: { id: "parent1" }, ...node },
  };
}

test("none returns an empty string", () => {
  const app = makeApp({ props: { globalControlTypeFilters: "none" } });
  assert.equal(globalFilters(app), "");
});

test("static mode emits start classes only", () => {
  const app = makeApp({ props: { globalControlTypeFilters: "static" } });
  const result = globalFilters(app);

  assert.match(result, /(?:^|\s)brightness-\[100%\]/);
  assert.doesNotMatch(result, /hover:|data-\[active/);
});

test("hover distributes the prefix across a responsive end value", () => {
  const result = globalFilters(makeApp());

  assert.match(result, /(?:^|\s)hover:blur-\[2px\]/);
  assert.match(result, /(?:^|\s)md:hover:blur-\[5px\]/);
  assert.match(result, /(?:^|\s)hover:brightness-\[110%\]/);
  // the md end class must not leak without the hover modifier
  assert.doesNotMatch(result, /(?:^|\s)md:blur-\[5px\]/);
  // backdrop blur is fully zero, so no backdrop classes at all
  assert.doesNotMatch(result, /backdrop-blur/);
});

test("fully-zero blur emits no blur classes in any state branch", () => {
  const app = makeApp({ props: { globalFiltersBlurEnd: "blur-[0px]" } });
  const result = globalFilters(app, { active: true, focus: true });

  assert.doesNotMatch(result, /blur-\[0px\]/);
});

test("active branch prefixes every class, including breakpointed ones", () => {
  const result = globalFilters(makeApp(), { active: true });

  assert.match(result, /(?:^|\s)data-\[active=true\]:blur-\[2px\]/);
  assert.match(result, /(?:^|\s)md:data-\[active=true\]:blur-\[5px\]/);
  assert.match(result, /(?:^|\s)data-\[active=true\]:brightness-\[110%\]/);
  assert.doesNotMatch(result, /data-\[active=true\]:hover:/);
  assert.doesNotMatch(result, /(?:^|\s)md:blur-\[5px\]/);
});

test("focus branch prefixes every class, including breakpointed ones", () => {
  const result = globalFilters(makeApp(), { focus: true });

  assert.match(result, /(?:^|\s)focus:blur-\[2px\]/);
  assert.match(result, /(?:^|\s)md:focus:blur-\[5px\]/);
  assert.doesNotMatch(result, /focus:hover:/);
  assert.doesNotMatch(result, /(?:^|\s)md:blur-\[5px\]/);
});

test("custom hover group rewrites hover and focus prefixes", () => {
  const app = makeApp({
    props: {
      globalHoverGroupFilters: "custom",
      globalHoverGroupCustomIdFilters: "trigger",
    },
  });
  const result = globalFilters(app, { focus: true });

  assert.match(result, /(?:^|\s)group-hover\/trigger:blur-\[2px\]/);
  assert.match(result, /(?:^|\s)md:group-hover\/trigger:blur-\[5px\]/);
  assert.match(result, /(?:^|\s)group-focus\/trigger:blur-\[2px\]/);
  assert.doesNotMatch(result, /(?:^|\s)hover:/);
});
