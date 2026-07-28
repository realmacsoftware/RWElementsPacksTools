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
  "../shared-hooks/core/getHoverPrefix.js",
  "../shared-hooks/transforms/globalTransforms.js",
]);

function makeApp({ props = {}, node = {} } = {}) {
  return {
    props: {
      globalControlTypeTransforms: "hover",
      globalHoverGroupTransforms: "self",
      globalHoverGroupCustomIdTransforms: "",
      globalTransformsApplyTo: "",
      globalTransformOrigin: "origin-center",
      globalTransformScale: "scale-x-[100%] scale-y-[100%]",
      globalTransformRotate: "rotate-[0deg]",
      globalTransformSkewX: "skew-x-[0deg]",
      globalTransformSkewY: "skew-y-[0deg]",
      globalTransformTranslateX: "translate-x-[0px]",
      globalTransformTranslateY: "translate-y-[0px]",
      globalTransformScaleEnd:
        "scale-x-[105%] scale-y-[105%] md:scale-x-[125%] md:scale-y-[125%]",
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

test("static mode emits formatted start classes unchanged", () => {
  const app = makeApp({ props: { globalControlTypeTransforms: "static" } });
  const result = globalTransforms(app);

  assert.match(result, /(?:^|\s)transform(?:\s|$)/);
  assert.match(result, /(?:^|\s)scale-x-\[100%\] scale-y-\[100%\](?:\s|$)/);
  assert.doesNotMatch(result, /hover:/);
});

test("hover distributes the prefix across every class of a responsive multi-class end value", () => {
  const result = globalTransforms(makeApp());

  assert.match(result, /(?:^|\s)hover:scale-x-\[105%\]/);
  assert.match(result, /(?:^|\s)hover:scale-y-\[105%\]/);
  assert.match(result, /(?:^|\s)md:hover:scale-x-\[125%\]/);
  assert.match(result, /(?:^|\s)md:hover:scale-y-\[125%\]/);
  // no end-state class may leak without the hover modifier
  assert.doesNotMatch(result, /(?:^|\s)scale-y-\[105%\](?:\s|$)/);
  assert.doesNotMatch(result, /(?:^|\s)md:scale-x-\[125%\]/);
  assert.doesNotMatch(result, /(?:^|\s)md:scale-y-\[125%\]/);
});

test("active branch prefixes every class, including breakpointed ones", () => {
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

test("focus branch prefixes every class, including breakpointed ones", () => {
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
  assert.match(result, /(?:^|\s)md:group-hover\/parent1:scale-y-\[125%\]/);
  assert.match(result, /(?:^|\s)group-focus\/parent1:scale-x-\[105%\]/);
  assert.match(result, /(?:^|\s)md:group-focus\/parent1:scale-x-\[125%\]/);
  assert.doesNotMatch(result, /(?:^|\s)hover:/);
});

test("empty end values emit no stray prefix tokens", () => {
  const app = makeApp({ props: { globalTransformSkewXEnd: "" } });
  const result = globalTransforms(app, { active: true, focus: true });

  assert.doesNotMatch(result, /(?:^|\s)hover:(?:\s|$)/);
  assert.doesNotMatch(result, /(?:^|\s)focus:(?:\s|$)/);
  assert.doesNotMatch(result, /(?:^|\s)data-\[active=true\]:(?:\s|$)/);
});
