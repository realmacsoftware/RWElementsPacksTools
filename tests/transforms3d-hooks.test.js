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

const { globalTransforms3D, globalMouse3D } = loadHook(
  "({ globalTransforms3D, globalMouse3D })",
  [
    "../shared-hooks/core/classnames.js",
    "../shared-hooks/core/addPrefixToTailwindClasses.js",
    "../shared-hooks/core/getHoverPrefix.js",
    "../shared-hooks/transforms/globalTransforms3D.js",
    "../shared-hooks/transforms/globalMouse3D.js",
  ]
);

function makeApp({ props = {}, responsiveProps = {}, node = {} } = {}) {
  return {
    props: {
      globalControlType3D: "none",
      globalHoverGroup3D: "self",
      globalHoverGroupCustomId3D: "",
      globalTransforms3DApplyTo: "",
      globalTransformBackface: "",
      globalTransformRotateX: "rotate-x-[10deg]",
      globalTransformRotateY: "rotate-y-[0deg]",
      globalTransformScaleZ: "scale-z-[100%]",
      globalTransformTranslateZ: "translate-z-[0px]",
      globalTransformRotateXEnd: "rotate-x-[25deg]",
      globalTransformRotateYEnd: "rotate-y-[0deg]",
      globalTransformScaleZEnd: "scale-z-[100%]",
      globalTransformTranslateZEnd: "translate-z-[0px]",
      ...props,
    },
    responsiveProps,
    node: { id: "node-1", parent: { id: "parent-1" }, ...node },
    theme: {
      breakpoints: {
        names: ["base", "sm", "md", "lg", "xl", "2xl"],
        screens: {},
      },
    },
  };
}

test("static mode emits formatted start classes unchanged", () => {
  const app = makeApp({ props: { globalControlType3D: "static" } });
  const result = globalTransforms3D(app);

  assert.match(result, /rotate-x-\[10deg\]/);
  assert.match(result, /scale-z-\[100%\]/);
  assert.doesNotMatch(result, /hover:/);
  assert.doesNotMatch(result, /calc/);
});

test("hover mode emits start classes plus hover-prefixed end classes", () => {
  const app = makeApp({ props: { globalControlType3D: "hover" } });
  const result = globalTransforms3D(app);

  assert.match(result, /(^|\s)rotate-x-\[10deg\]/);
  assert.match(result, /hover:rotate-x-\[25deg\]/);
  assert.doesNotMatch(result, /calc/);
});

test("mouse mode emits calc-mix classes instead of bare start classes", () => {
  const app = makeApp({
    props: { globalControlType3D: "mouse", globalTransformBackface: "backface-hidden" },
    responsiveProps: {
      globalTransformRotateX: { base: 10 },
      globalTransformRotateXEnd: { base: 25 },
    },
  });
  const result = globalTransforms3D(app);

  assert.match(
    result,
    /rotate-x-\[calc\(10deg\*\(1_-_var\(--rw-m3d-y,0\)\)_\+_25deg\*var\(--rw-m3d-y,0\)\)\]/
  );
  assert.doesNotMatch(result, /(^|\s)rotate-x-\[10deg\]/);
  assert.doesNotMatch(result, /hover:/);
  assert.doesNotMatch(result, /group-hover/);
  assert.match(result, /backface-hidden/);
});

test("mouse mode maps channels to the right progress variables", () => {
  const app = makeApp({
    props: { globalControlType3D: "mouse" },
    responsiveProps: {
      globalTransformRotateX: { base: 10 },
      globalTransformRotateXEnd: { base: 25 },
      globalTransformRotateY: { base: -5 },
      globalTransformRotateYEnd: { base: 5 },
      globalTransformScaleZ: { base: 100 },
      globalTransformScaleZEnd: { base: 150 },
      globalTransformTranslateZ: { base: "0px" },
      globalTransformTranslateZEnd: { base: "50px" },
    },
  });
  const result = globalTransforms3D(app);

  assert.match(result, /rotate-x-\[calc\(10deg[^\]]*--rw-m3d-y[^\]]*\)\]/);
  assert.match(result, /rotate-y-\[calc\(-5deg[^\]]*--rw-m3d-x[^\]]*\)\]/);
  assert.match(result, /scale-z-\[calc\(100%[^\]]*--rw-m3d-r[^\]]*\)\]/);
  assert.match(result, /translate-z-\[calc\(0px[^\]]*--rw-m3d-r[^\]]*\)\]/);
});

test("mouse mode with equal start and end emits a plain static class", () => {
  const app = makeApp({
    props: { globalControlType3D: "mouse" },
    responsiveProps: {
      globalTransformRotateX: { base: 15 },
      globalTransformRotateXEnd: { base: 15 },
    },
  });
  const result = globalTransforms3D(app);

  assert.match(result, /(^|\s)rotate-x-\[15deg\]/);
  assert.doesNotMatch(result, /rotate-x-\[calc/);
});

test("mouse mode falls back to control defaults when nothing is set", () => {
  const app = makeApp({ props: { globalControlType3D: "mouse" }, responsiveProps: {} });
  const result = globalTransforms3D(app);

  assert.match(result, /(^|\s)rotate-x-\[0deg\]/);
  assert.match(result, /(^|\s)rotate-y-\[0deg\]/);
  assert.match(result, /(^|\s)scale-z-\[100%\]/);
  assert.match(result, /(^|\s)translate-z-\[0px\]/);
  assert.doesNotMatch(result, /calc/);
});

test("mouse mode emits breakpoint-prefixed calc classes only where values change", () => {
  const app = makeApp({
    props: { globalControlType3D: "mouse" },
    responsiveProps: {
      globalTransformRotateX: { base: 10 },
      globalTransformRotateXEnd: { base: 25, md: 40 },
    },
  });
  const result = globalTransforms3D(app);

  assert.match(result, /(^|\s)rotate-x-\[calc\(10deg[^\]]*25deg[^\]]*\)\]/);
  assert.match(result, /(^|\s)md:rotate-x-\[calc\(10deg[^\]]*40deg[^\]]*\)\]/);
  assert.doesNotMatch(result, /sm:rotate-x/);
  assert.doesNotMatch(result, /lg:rotate-x/);
});

test("mouse mode uses the fallback for a missing base value", () => {
  const app = makeApp({
    props: { globalControlType3D: "mouse" },
    responsiveProps: {
      globalTransformRotateX: { md: 5 },
      globalTransformRotateXEnd: { base: 25 },
    },
  });
  const result = globalTransforms3D(app);

  assert.match(result, /(^|\s)rotate-x-\[calc\(0deg[^\]]*25deg[^\]]*\)\]/);
  assert.match(result, /(^|\s)md:rotate-x-\[calc\(5deg[^\]]*25deg[^\]]*\)\]/);
});

test("mouse mode interpolates translate-z across mixed units", () => {
  const app = makeApp({
    props: { globalControlType3D: "mouse" },
    responsiveProps: {
      globalTransformTranslateZ: { base: "10px" },
      globalTransformTranslateZEnd: { base: "2rem" },
    },
  });
  const result = globalTransforms3D(app);

  assert.match(
    result,
    /translate-z-\[calc\(10px\*\(1_-_var\(--rw-m3d-r,0\)\)_\+_2rem\*var\(--rw-m3d-r,0\)\)\]/
  );
});

test("globalMouse3D returns nothing for non-mouse types", () => {
  for (const type of ["none", "static", "hover"]) {
    const app = makeApp({ props: { globalControlType3D: type } });
    assert.deepEqual({ ...globalMouse3D(app) }, {});
  }
});

test("globalMouse3D resolves the tracking surface name", () => {
  const cases = [
    [{ globalHoverGroup3D: "self" }, "self"],
    [{ globalHoverGroup3D: "container" }, "container"],
    [{ globalHoverGroup3D: "grid" }, "grid"],
    [{ globalHoverGroup3D: "flex" }, "flex"],
    [{ globalHoverGroup3D: "parent" }, "parent-1"],
    [{ globalHoverGroup3D: "custom", globalHoverGroupCustomId3D: "hero" }, "hero"],
    [{ globalHoverGroup3D: "custom", globalHoverGroupCustomId3D: "  " }, "self"],
  ];

  for (const [props, expected] of cases) {
    const app = makeApp({ props: { globalControlType3D: "mouse", ...props } });
    assert.deepEqual({ ...globalMouse3D(app) }, { "data-m3d-over": expected });
  }
});
