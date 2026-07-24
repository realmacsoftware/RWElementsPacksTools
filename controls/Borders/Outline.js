export const Outline = [
  {
    title: "Type",
    id: "globalControlTypeOutline",
    ai: { name: "outline", description: "Enable/disable outline. 'static' always shows it; 'focus' styles the unfocused and focused states separately.", values: ["none", "static", "focus"] },
    responsive: false,
    segmented: {
      default: "none",
      items: [
        {
          title: "None",
          value: "none",
        },
        {
          title: "Static",
          value: "static",
        },
        {
          title: "Focus",
          value: "focus",
        },
      ]
    }
  },
  {
    visible: "globalControlTypeOutline != 'none'",
    ai: { visible: "outline != 'none'" },
    globalControl: "OutlineStyle",
  },
  {
    visible: "globalControlTypeOutline == 'focus'",
    ai: { exclude: true },
    title: "State",
    id: "globalOutlineState",
    responsive: false,
    segmented: {
      default: "unfocused",
      items: [
        {
          title: "Unfocused",
          value: "unfocused",
        },
        {
          title: "Focused",
          value: "focused",
        },
      ]
    }
  },
  {
    divider: {},
    visible: "globalControlTypeOutline != 'none'",
  },
  {
    visible: "globalControlTypeOutline == 'static' || (globalControlTypeOutline == 'focus' && globalOutlineState == 'unfocused')",
    ai: { visible: "outline != 'none'" },
    globalControl: "OutlineColor",
  },
  {
    visible: "globalControlTypeOutline == 'static' || (globalControlTypeOutline == 'focus' && globalOutlineState == 'unfocused')",
    ai: { visible: "outline != 'none'" },
    globalControl: "OutlineWidth",
  },
  {
    visible: "globalControlTypeOutline == 'static' || (globalControlTypeOutline == 'focus' && globalOutlineState == 'unfocused')",
    ai: { visible: "outline != 'none'" },
    globalControl: "OutlineOffset",
  },
  {
    visible: "(globalControlTypeOutline == 'focus' && globalOutlineState == 'focused')",
    ai: { name: "outlineColorFocus", description: "Outline theme color when focused.", visible: "outline == 'focus'" },
    title: "Color",
    id: "globalOutlineColorFocus",
    format: "focus:outline-{{value}}",
    themeColor: {
      default: {
        name: "surface",
        brightness: 500,
      },
    },
  },
  {
    visible: "(globalControlTypeOutline == 'focus' && globalOutlineState == 'focused')",
    ai: { name: "outlineColorOpacityFocus", description: "Focused outline color opacity, 0-100.", visible: "outline == 'focus'" },
    title: "Opacity",
    id: "globalOutlineColorOpacityFocus",
    format: "[{{value}}%]",
    slider: {
      default: 100,
      use: "Slider",
      units: "%",
    },
  },
  {
    visible: "(globalControlTypeOutline == 'focus' && globalOutlineState == 'focused')",
    ai: { name: "{{value}}Focus", visible: "outline == 'focus'" },
    globalControl: "OutlineWidth",
    id: "{{value}}Focus",
    format: "focus:outline-[{{value}}px]",
  },
  {
    visible: "(globalControlTypeOutline == 'focus' && globalOutlineState == 'focused')",
    ai: { name: "{{value}}Focus", visible: "outline == 'focus'" },
    globalControl: "OutlineOffset",
    format: "focus:outline-offset-[{{value}}px]",
    id: "{{value}}Focus",
  },
];

export default Outline;
