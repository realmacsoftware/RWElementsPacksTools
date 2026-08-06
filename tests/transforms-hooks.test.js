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

const globalTransforms = loadHook("globalTransforms", [
  "../shared-hooks/core/classnames.js",
  "../shared-hooks/core/addPrefixToTailwindClasses.js",
  "../shared-hooks/core/escapeArbitraryWhitespace.js",
  "../shared-hooks/core/getHoverPrefix.js",
  "../shared-hooks/transforms/globalTransforms.js",
]);

// The Scale control emits scale-x classes only (single class per breakpoint —
// Elements prepends responsive prefixes once per formatted string); the hook
// mirrors each scale-x class to a scale-y twin.
function makeApp({ props = {}, node = {} } = {}) {
  return {
    props: {
      globalControlTypeTransforms: "hover",
      globalHoverGroupTransforms: "self",
      globalHoverGroupCustomIdTransforms: "",
      globalTransformsApplyTo: "",
      globalTransformOrigin: "origin-center",
      globalTransformScale: "scale-x-[100%]",
      globalTransformRotate: "rotate-[0deg]",
      globalTransformSkewX: "skew-x-[0deg]",
      globalTransformSkewY: "skew-y-[0deg]",
      globalTransformTranslateX: "translate-x-[0px]",
      globalTransformTranslateY: "translate-y-[0px]",
      globalTransformScaleEnd: "scale-x-[105%] md:scale-x-[125%]",
      globalTransformRotateEnd: "rotate-[5deg]",
      globalTransformSkewXEnd: "skew-x-[0deg]",
      globalTransformSkewYEnd: "skew-y-[0deg]",
      globalTransformTranslateXEnd: "translate-x-[0px]",
      globalTransformTranslateYEnd: "translate-y-[0px]",
      ...props,
    },
    node: { id: "el1", parent: { id: "parent1" }, ...node },
  };
}

test("none emits no classes", () => {
  const app = makeApp({ props: { globalControlTypeTransforms: "none" } });
  assert.equal(globalTransforms(app), "");
});

test("static mode mirrors scale-x classes to scale-y with modifiers intact", () => {
  const app = makeApp({
    props: {
      globalControlTypeTransforms: "static",
      globalTransformScale: "scale-x-[100%] md:scale-x-[110%]",
    },
  });
  const result = globalTransforms(app);

  assert.match(result, /(?:^|\s)transform(?:\s|$)/);
  assert.match(result, /(?:^|\s)scale-x-\[100%\]/);
  assert.match(result, /(?:^|\s)scale-y-\[100%\]/);
  assert.match(result, /(?:^|\s)md:scale-x-\[110%\]/);
  assert.match(result, /(?:^|\s)md:scale-y-\[110%\]/);
  assert.doesNotMatch(result, /hover:/);
});

test("hover end scale carries both hover and breakpoint modifiers on x and y", () => {
  // Regression: a Button with End scale md=300 emitted
  // "md:hover:scale-x-[300%] hover:scale-y-[300%]" — the y class lost md:
  // because the old two-class format only got the breakpoint prefix once.
  const app = makeApp({
    props: { globalTransformScaleEnd: "scale-x-[100%] md:scale-x-[300%]" },
  });
  const result = globalTransforms(app);

  assert.match(result, /(?:^|\s)hover:scale-x-\[100%\]/);
  assert.match(result, /(?:^|\s)hover:scale-y-\[100%\]/);
  assert.match(result, /(?:^|\s)md:hover:scale-x-\[300%\]/);
  assert.match(result, /(?:^|\s)md:hover:scale-y-\[300%\]/);
  // no scale class may appear without the hover modifier or without md: pairing
  assert.doesNotMatch(result, /(?:^|\s)hover:scale-y-\[300%\]/);
  assert.doesNotMatch(result, /(?:^|\s)scale-y-\[300%\]/);
  assert.doesNotMatch(result, /(?:^|\s)md:scale-x-\[300%\]/);
});

test("active branch prefixes every mirrored class, including breakpointed ones", () => {
  const result = globalTransforms(makeApp(), { active: true });

  assert.match(result, /(?:^|\s)data-\[active=true\]:scale-x-\[105%\]/);
  assert.match(result, /(?:^|\s)data-\[active=true\]:scale-y-\[105%\]/);
  assert.match(result, /(?:^|\s)md:data-\[active=true\]:scale-x-\[125%\]/);
  assert.match(result, /(?:^|\s)md:data-\[active=true\]:scale-y-\[125%\]/);
  assert.doesNotMatch(result, /data-\[active=true\]:hover:/);
  assert.doesNotMatch(result, /(?:^|\s)scale-y-\[105%\](?:\s|$)/);
  assert.doesNotMatch(result, /(?:^|\s)md:scale-x-\[125%\]/);
  assert.doesNotMatch(result, /(?:^|\s)md:scale-y-\[125%\]/);
});

test("focus branch prefixes every mirrored class, including breakpointed ones", () => {
  const result = globalTransforms(makeApp(), { focus: true });

  assert.match(result, /(?:^|\s)focus:scale-x-\[105%\]/);
  assert.match(result, /(?:^|\s)focus:scale-y-\[105%\]/);
  assert.match(result, /(?:^|\s)md:focus:scale-x-\[125%\]/);
  assert.match(result, /(?:^|\s)md:focus:scale-y-\[125%\]/);
  assert.doesNotMatch(result, /focus:hover:/);
  assert.doesNotMatch(result, /(?:^|\s)scale-y-\[105%\](?:\s|$)/);
  assert.doesNotMatch(result, /(?:^|\s)md:scale-x-\[125%\]/);
});

test("parent hover group rewrites hover and focus prefixes", () => {
  const app = makeApp({ props: { globalHoverGroupTransforms: "parent" } });
  const result = globalTransforms(app, { focus: true });

  assert.match(result, /(?:^|\s)group-hover\/parent1:scale-x-\[105%\]/);
  assert.match(result, /(?:^|\s)group-hover\/parent1:scale-y-\[105%\]/);
  assert.match(result, /(?:^|\s)md:group-hover\/parent1:scale-y-\[125%\]/);
  assert.match(result, /(?:^|\s)group-focus\/parent1:scale-x-\[105%\]/);
  assert.match(result, /(?:^|\s)md:group-focus\/parent1:scale-x-\[125%\]/);
  assert.doesNotMatch(result, /(?:^|\s)hover:/);
});

test("non-scale end values pass through the mirror untouched", () => {
  const app = makeApp({
    props: { globalTransformRotateEnd: "rotate-[5deg] md:rotate-[60deg]" },
  });
  const result = globalTransforms(app);

  assert.match(result, /(?:^|\s)hover:rotate-\[5deg\]/);
  assert.match(result, /(?:^|\s)md:hover:rotate-\[60deg\]/);
  assert.doesNotMatch(result, /rotate-y/);
});

test("whitespace inside translate arbitrary values is escaped to underscores", () => {
  const app = makeApp({
    props: {
      globalControlTypeTransforms: "static",
      globalTransformTranslateX: "translate-x-[calc(100% - 10px)]",
    },
  });
  const result = globalTransforms(app);

  assert.match(result, /(?:^|\s)translate-x-\[calc\(100%_-_10px\)\](?:\s|$)/);
  assert.doesNotMatch(result, /calc\(100% /);
});

test("escaping keeps responsive translate variants as separate classes", () => {
  const app = makeApp({
    props: {
      globalTransformTranslateXEnd:
        "translate-x-[10px] md:translate-x-[calc(100% - 10px)]",
    },
  });
  const result = globalTransforms(app);

  assert.match(result, /(?:^|\s)hover:translate-x-\[10px\]/);
  assert.match(result, /(?:^|\s)md:hover:translate-x-\[calc\(100%_-_10px\)\]/);
  assert.doesNotMatch(result, /\]_md:/);
});

test("empty end values emit no stray prefix tokens", () => {
  const app = makeApp({
    props: { globalTransformSkewXEnd: "", globalTransformScaleEnd: "" },
  });
  const result = globalTransforms(app, { active: true, focus: true });

  assert.doesNotMatch(result, /(?:^|\s)hover:(?:\s|$)/);
  assert.doesNotMatch(result, /(?:^|\s)focus:(?:\s|$)/);
  assert.doesNotMatch(result, /(?:^|\s)data-\[active=true\]:(?:\s|$)/);
});
