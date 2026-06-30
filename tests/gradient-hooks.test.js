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

function baseBackgroundProps(overrides = {}) {
  return {
    globalControlTypeBg: "static",
    globalBgGradientDirection: "bg-linear-to-b",
    globalBgGradientInterpolation: "",
    globalBgGradientFromColor: "from-brand-200/(--bgGradientFromOpacity)",
    globalBgGradientFromOpacity: "[--bgGradientFromOpacity:100%]",
    globalBgGradientFromPosition: "from-0%",
    globalBgGradientViaEnabled: "false",
    globalBgGradientViaColor: "via-brand-400/(--bgGradientViaOpacity)",
    globalBgGradientViaOpacity: "[--bgGradientViaOpacity:100%]",
    globalBgGradientViaPosition: "via-50%",
    globalBgGradientToColor: "to-brand-500/(--bgGradientToOpacity)",
    globalBgGradientToOpacity: "[--bgGradientToOpacity:100%]",
    globalBgGradientToPosition: "to-100%",
    globalBgGradientDirectionEnd: "hover:bg-linear-to-t",
    globalBgGradientInterpolationEnd: "",
    globalBgGradientFromColorEnd: "hover:from-brand-200/(--bgGradientFromOpacityEnd)",
    globalBgGradientFromOpacityEnd: "hover:[--bgGradientFromOpacityEnd:100%]",
    globalBgGradientViaEnabledEnd: "false",
    globalBgGradientViaColorEnd: "hover:via-brand-400/(--bgGradientViaOpacityEnd)",
    globalBgGradientViaOpacityEnd: "hover:[--bgGradientViaOpacityEnd:100%]",
    globalBgGradientToColorEnd: "hover:to-brand-500/(--bgGradientToOpacityEnd)",
    globalBgGradientToOpacityEnd: "hover:[--bgGradientToOpacityEnd:100%]",
    ...overrides,
  };
}

function baseOverlayProps(overrides = {}) {
  return {
    globalControlTypeOverlay: "static",
    globalOverlayGradientDirection: "bg-linear-to-b",
    globalOverlayGradientInterpolation: "",
    globalOverlayGradientFromColor: "from-brand-200",
    globalOverlayGradientFromOpacity: "[100%]",
    globalOverlayGradientFromPosition: "from-0%",
    globalOverlayGradientViaEnabled: "false",
    globalOverlayGradientViaColor: "via-brand-400",
    globalOverlayGradientViaOpacity: "[100%]",
    globalOverlayGradientViaPosition: "via-50%",
    globalOverlayGradientToColor: "to-brand-500",
    globalOverlayGradientToOpacity: "[100%]",
    globalOverlayGradientToPosition: "to-100%",
    globalOverlayGradientDirectionEnd: "bg-linear-to-t",
    globalOverlayGradientInterpolationEnd: "",
    globalOverlayGradientFromColorEnd: "from-brand-200",
    globalOverlayGradientFromOpacityEnd: "[100%]",
    globalOverlayGradientFromPositionEnd: "from-0%",
    globalOverlayGradientViaEnabledEnd: "false",
    globalOverlayGradientViaColorEnd: "via-brand-400",
    globalOverlayGradientViaOpacityEnd: "[100%]",
    globalOverlayGradientViaPositionEnd: "via-50%",
    globalOverlayGradientToColorEnd: "to-brand-500",
    globalOverlayGradientToOpacityEnd: "[100%]",
    globalOverlayGradientToPositionEnd: "to-100%",
    ...overrides,
  };
}

const { globalBgGradient } = loadHook(
  "({ globalBgGradient })",
  [
    "../shared-hooks/core/classnames.js",
    "../shared-hooks/core/gradientClasses.js",
    "../shared-hooks/background/globalBackground.js",
  ],
);

const { globalOverlayGradient } = loadHook(
  "({ globalOverlayGradient })",
  [
    "../shared-hooks/core/classnames.js",
    "../shared-hooks/core/gradientClasses.js",
    "../shared-hooks/effects/globalOverlay.js",
  ],
);

test("global background gradients normalize legacy saved linear direction values", () => {
  const classes = globalBgGradient({
    props: baseBackgroundProps({
      globalBgGradientDirection: "bg-gradient-to-r",
    }),
  });

  assert.match(classes, /\bbg-linear-to-r\b/);
  assert.doesNotMatch(classes, /\bbg-gradient-to-r\b/);
});

test("global background gradients bake interpolation into arbitrary radial utilities", () => {
  const classes = globalBgGradient({
    props: baseBackgroundProps({
      globalBgGradientDirection: "bg-radial-[at_50%_75%]",
      globalBgGradientInterpolation: "srgb",
    }),
  });

  assert.match(classes, /\bbg-radial-\[at_50%_75%_in_srgb\]/);
  assert.doesNotMatch(classes, /\bbg-radial-\[at_50%_75%\]\/srgb\b/);
});

test("global background gradients bake hue interpolation into arbitrary radial utilities", () => {
  const classes = globalBgGradient({
    props: baseBackgroundProps({
      globalBgGradientDirection: "bg-radial-[at_top_left]",
      globalBgGradientInterpolation: "longer",
    }),
  });

  assert.match(classes, /\bbg-radial-\[at_top_left_in_oklch_longer_hue\]/);
  assert.doesNotMatch(classes, /\bbg-radial-\[at_top_left\]\/longer\b/);
});

test("global background gradients keep slash interpolation for non-arbitrary radial center", () => {
  const classes = globalBgGradient({
    props: baseBackgroundProps({
      globalBgGradientType: "radial",
      globalBgGradientDirection: "bg-linear-to-b",
      globalBgGradientRadialPosition: "bg-radial",
      globalBgGradientInterpolation: "longer",
    }),
  });

  assert.match(classes, /\bbg-radial\/longer\b/);
  assert.doesNotMatch(classes, /\bbg-linear-to-b\b/);
});

test("global background gradients use selected type-specific radial direction values", () => {
  const classes = globalBgGradient({
    props: baseBackgroundProps({
      globalBgGradientType: "radial",
      globalBgGradientDirection: "bg-linear-to-b",
      globalBgGradientRadialPosition: "bg-radial-[at_50%_75%]",
      globalBgGradientInterpolation: "srgb",
    }),
  });

  assert.match(classes, /\bbg-radial-\[at_50%_75%_in_srgb\]/);
  assert.doesNotMatch(classes, /\bbg-linear-to-b\b/);
});

test("global background hover gradients normalize legacy values before replacing variants", () => {
  const classes = globalBgGradient(
    {
      props: baseBackgroundProps({
        globalControlTypeBg: "hover",
        globalBgGradientDirectionEnd: "hover:bg-gradient-to-t",
        globalBgGradientInterpolationEnd: "decreasing",
      }),
    },
    { peer: true },
  );

  assert.match(classes, /\bpeer-hover:bg-linear-to-t\/decreasing\b/);
  assert.doesNotMatch(classes, /\bpeer-hover:bg-gradient-to-t\b/);
});

test("global background hover gradients use selected type-specific conic end values", () => {
  const classes = globalBgGradient(
    {
      props: baseBackgroundProps({
        globalControlTypeBg: "hover",
        globalBgGradientTypeEnd: "conic",
        globalBgGradientDirectionEnd: "hover:bg-linear-to-t",
        globalBgGradientConicAngleEnd: "hover:bg-conic-180",
        globalBgGradientInterpolationEnd: "longer",
      }),
    },
    { peer: true },
  );

  assert.match(classes, /\bpeer-hover:bg-conic-180\/longer\b/);
  assert.doesNotMatch(classes, /\bpeer-hover:bg-linear-to-t\b/);
});

test("overlay gradients normalize prefixed legacy hover values with interpolation", () => {
  const classes = globalOverlayGradient(
    {
      props: baseOverlayProps({
        globalControlTypeOverlay: "hover",
        globalOverlayGradientDirectionEnd: "bg-gradient-to-bl",
        globalOverlayGradientInterpolationEnd: "shorter",
      }),
    },
    "group-hover",
  );

  assert.match(classes, /\bgroup-hover:bg-linear-to-bl\/shorter\b/);
  assert.doesNotMatch(classes, /\bgroup-hover:bg-gradient-to-bl\b/);
});

test("overlay gradients use selected type-specific conic direction values", () => {
  const classes = globalOverlayGradient(
    {
      props: baseOverlayProps({
        globalOverlayGradientType: "conic",
        globalOverlayGradientDirection: "bg-linear-to-b",
        globalOverlayGradientConicAngle: "bg-conic-180",
        globalOverlayGradientInterpolation: "shorter",
      }),
    },
    "group-hover",
  );

  assert.match(classes, /\bbg-conic-180\/shorter\b/);
  assert.doesNotMatch(classes, /\bbg-linear-to-b\b/);
});
