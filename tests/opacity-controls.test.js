import assert from "node:assert/strict";
import test from "node:test";

import * as Controls from "../controls/index.js";

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

const EXPECTED_FORMATS = {
  Background_Color: {
    globalBgColor: "bg-{{value}}/(--bgColorOpacity)",
    globalBgColorOpacity: "[--bgColorOpacity:{{value}}%]",
    globalBgColorEnd: "hover:bg-{{value}}/(--bgColorOpacityEnd)",
    globalBgColorOpacityEnd: "hover:[--bgColorOpacityEnd:{{value}}%]",
  },
  BackgroundColor: {
    bgColor: "bg-{{value}}/(--bgColorOpacity)",
    bgColorOpacity: "[--bgColorOpacity:{{value}}%]",
  },
  TextColor: {
    globalTextColor: "text-{{value}}/(--textColorOpacity)",
    globalTextColorOpacity: "[--textColorOpacity:{{value}}%]",
  },
  TextColorHover: {
    globalTextColorHover: "hover:text-{{value}}/(--textColorOpacityHover)",
    globalTextColorOpacityHover: "hover:[--textColorOpacityHover:{{value}}%]",
  },
  HeadingColor: {
    globalTextColorHover: "text-{{value}}/(--textColorOpacityHover)",
    globalTextColorOpacityHover: "[--textColorOpacityHover:{{value}}%]",
  },
  ButtonFontAndTextStyles: {
    globalButtonFontAndTextStylesColor:
      "text-{{value}}/(--buttonFontAndTextStylesColorOpacity)",
    globalButtonFontAndTextStylesColorOpacity:
      "[--buttonFontAndTextStylesColorOpacity:{{value}}%]",
    globalButtonFontAndTextStylesColorHover:
      "hover:text-{{value}}/(--buttonFontAndTextStylesColorOpacityHover)",
    globalButtonFontAndTextStylesColorOpacityHover:
      "hover:[--buttonFontAndTextStylesColorOpacityHover:{{value}}%]",
  },
  InputFontAndTextStyles: {
    globalInputFontAndTextStylesColor:
      "text-{{value}}/(--inputFontAndTextStylesColorOpacity)",
    globalInputFontAndTextStylesColorOpacity:
      "[--inputFontAndTextStylesColorOpacity:{{value}}%]",
  },
  Overlay_Color: {
    globalOverlayColor: "bg-{{value}}/(--overlayColorOpacity)",
    globalOverlayColorOpacity: "[--overlayColorOpacity:{{value}}%]",
    globalOverlayColorEnd: "bg-{{value}}/(--overlayColorOpacityEnd)",
    globalOverlayColorOpacityEnd: "[--overlayColorOpacityEnd:{{value}}%]",
  },
};

for (const [exportName, formats] of Object.entries(EXPECTED_FORMATS)) {
  test(`${exportName} uses opacity modifier custom properties`, () => {
    for (const [id, format] of Object.entries(formats)) {
      const control = findControlById(Controls[exportName], id);
      assert.ok(control, `${exportName} is missing control "${id}"`);
      assert.equal(control.format, format);
    }
  });
}

test("no control uses deprecated Tailwind opacity utilities", () => {
  const deprecated = /(?:^|[\s:])(?:bg|text|border|divide|ring|placeholder)-opacity-/;

  function visit(value, path) {
    if (Array.isArray(value)) {
      value.forEach((item, index) => visit(item, `${path}[${index}]`));
      return;
    }

    if (!value || typeof value !== "object") {
      return;
    }

    if (typeof value.format === "string") {
      assert.ok(
        !deprecated.test(value.format),
        `${path} (id: ${value.id}) uses a deprecated opacity utility: ${value.format}`,
      );
    }

    Object.values(value).forEach((child) => visit(child, path));
  }

  for (const [exportName, control] of Object.entries(Controls)) {
    visit(control, exportName);
  }
});

test("color formats reference the variable set by their paired opacity control", () => {
  const pairs = [
    [Controls.Background_Color, "globalBgColor", "globalBgColorOpacity"],
    [Controls.Background_Color, "globalBgColorEnd", "globalBgColorOpacityEnd"],
    [Controls.BackgroundColor, "bgColor", "bgColorOpacity"],
    [Controls.TextColor, "globalTextColor", "globalTextColorOpacity"],
    [Controls.TextColorHover, "globalTextColorHover", "globalTextColorOpacityHover"],
    [Controls.HeadingColor, "globalTextColorHover", "globalTextColorOpacityHover"],
    [
      Controls.ButtonFontAndTextStyles,
      "globalButtonFontAndTextStylesColor",
      "globalButtonFontAndTextStylesColorOpacity",
    ],
    [
      Controls.ButtonFontAndTextStyles,
      "globalButtonFontAndTextStylesColorHover",
      "globalButtonFontAndTextStylesColorOpacityHover",
    ],
    [
      Controls.InputFontAndTextStyles,
      "globalInputFontAndTextStylesColor",
      "globalInputFontAndTextStylesColorOpacity",
    ],
    [Controls.Overlay_Color, "globalOverlayColor", "globalOverlayColorOpacity"],
    [Controls.Overlay_Color, "globalOverlayColorEnd", "globalOverlayColorOpacityEnd"],
  ];

  for (const [control, colorId, opacityId] of pairs) {
    const colorFormat = findControlById(control, colorId).format;
    const opacityFormat = findControlById(control, opacityId).format;

    const referenced = colorFormat.match(/\/\((--[a-zA-Z]+)\)/)?.[1];
    const defined = opacityFormat.match(/\[(--[a-zA-Z]+):/)?.[1];

    assert.ok(referenced, `${colorId} does not reference an opacity variable`);
    assert.equal(
      referenced,
      defined,
      `${colorId} references ${referenced} but ${opacityId} sets ${defined}`,
    );
  }
});
