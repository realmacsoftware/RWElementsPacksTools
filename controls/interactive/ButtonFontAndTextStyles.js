const ButtonFontAndTextStyles = [
  {
    title: "State",
    id: "globalButtonFontAndTextStylesState",
    ai: {
      name: "textState",
      description: "Label styling state: 'normal' or 'hover'.",
      values: ["normal", "hover"],
    },
    segmented: {
      default: "normal",
      items: [
        {
          title: "Normal",
          value: "normal",
        },
        {
          title: "Hover",
          value: "hover",
        },
      ],
    }
  },
  {
    visible: "globalButtonFontAndTextStylesState == 'normal'",
    title: "Color",
    id: "globalButtonFontAndTextStylesColor",
    ai: {
      name: "textColor",
      description: "Button label text theme color (e.g. 'text,900' on light backgrounds, 'surface,50' on dark). Set whenever bgColor changes.",
    },
    format: "text-{{value}}/(--buttonFontAndTextStylesColorOpacity)",
    themeColor: {
      default: {
        name: "surface",
        brightness: 50
      }
    }
  },
  {
    visible: "globalButtonFontAndTextStylesState == 'normal'",
    title: "Opacity",
    id: "globalButtonFontAndTextStylesColorOpacity",
    ai: {
      name: "textColorOpacity",
      description: "Button label text color opacity, 0-100.",
    },
    format: "[--buttonFontAndTextStylesColorOpacity:{{value}}%]",
    slider: {
      use: "Slider",
      default: 100,
      units: "%",
    }
  },
  {
    visible: "globalButtonFontAndTextStylesState == 'hover'",
    title: "Color",
    id: "globalButtonFontAndTextStylesColorHover",
    format: "hover:text-{{value}}/(--buttonFontAndTextStylesColorOpacityHover)",
    themeColor: {
      default: {
        name: "surface",
        brightness: 50
      }
    }
  },
  {
    visible: "globalButtonFontAndTextStylesState == 'hover'",
    title: "Opacity",
    id: "globalButtonFontAndTextStylesColorOpacityHover",
    format: "hover:[--buttonFontAndTextStylesColorOpacityHover:{{value}}%]",
    slider: {
      use: "Slider",
      default: 100,
      units: "%",
    }
  },
  {
    visible: "globalButtonFontAndTextStylesState == 'normal'",
    title: "Text Shadow",
    id: "globalButtonFontAndTextStylesTextShadow",
    themeShadow: {
      mode: "text",
      default: {
        name: "none",
      }
    }
  },
  {
    visible: "globalButtonFontAndTextStylesState == 'hover'",
    title: "Text Shadow",
    id: "globalButtonFontAndTextStylesTextShadowHover",
    format: "hover:{{value}}",
    themeShadow: {
      mode: "text",
      default: {
        name: "none",
      }
    }
  },
  {
    divider: {},
  },
  {
    title: "General",
    heading: {}
  },
  {
    title: "Align",
    id: "globalButtonFontAndTextStylesTextAlign",
    ai: { name: "align", description: "Label alignment within the button.", values: ["start", "center", "end"] },
    format: "justify-{{value}}",
    segmented: {
      default: "center",
      items: [
        {
          value: "start",
          icon: "text.alignleft",
        },
        {
          value: "center",
          icon: "text.aligncenter"
        },
        {
          value: "end",
          icon: "text.alignright"
        },
      ]
    },
  },
  {
    title: "Family",
    id: "globalButtonFontAndTextStylesFont",
    ai: { name: "family", description: "Font family theme token." },
    themeFont: {
      default: {
        base: "body"
      }
    }
  },
  {
    title: "Size",
    id: "globalButtonFontAndTextStylesFontSize",
    ai: { name: "size", description: "Font size theme text-style token." },
    themeTextStyle: {
      default: {
        base: { name: "base" }
      }
    }
  },
  {
    title: "Font Settings",
    heading: {}
  },
  {
    title: "Weight",
    id: "globalButtonFontAndTextStylesFontWeight",
    ai: { name: "weight", description: "Font weight, 100-900." },
    format: "font-[{{value}}]",
    slider: {
      use: "FontWeight",
    }
  },
  {
    title: "Spacing",
    id: "globalButtonFontAndTextStylesLetterSpacing",
    ai: { name: "letterSpacing", description: "Letter spacing (tracking) token." },
    format: "tracking-{{value}}",
    slider: {
      use: "LetterSpacing",
    }
  },
  {
    title: "Line Height",
    id: "globalButtonFontAndTextStylesLineHeight",
    ai: { name: "lineHeight", description: "Line height (leading) token." },
    format: "leading-{{value}}",
    slider: {
      use: "LineHeight",
    }
  },
  {
    title: "Case",
    id: "globalButtonFontAndTextStylesTextTransform",
    ai: { name: "case", description: "Text case transform." },
    select: {
      default: "normal-case",
      items: [
        {
          value: "normal-case",
          title: "None",
        },
        {
          value: "uppercase",
          title: "Uppercase",
        },
        {
          value: "lowercase",
          title: "Lowercase",
        },
        {
          value: "capitalize",
          title: "Capitalize",
        },
      ],
    },
  },
  {
    title: "Italic",
    id: "globalButtonFontAndTextStylesItalic",
    ai: { name: "italic", description: "Italicize the label text." },
    switch: {
      default: false,
      trueValue: "italic",
      falseValue: "",
    }
  },
  {
    title: "Underline",
    id: "globalButtonFontAndTextStylesUnderline",
    ai: { name: "underline", description: "Underline the label text." },
    switch: {
      default: false,
      trueValue: "underline",
      falseValue: "",
    }
  },
];

export default ButtonFontAndTextStyles;
