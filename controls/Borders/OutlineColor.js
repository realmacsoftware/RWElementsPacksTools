const OutlineColor = [
  {
    title: "Color",
    id: "globalOutlineColor",
    ai: { name: "outlineColor", description: "Outline theme color." },
    format: "outline-{{value}}",
    themeColor: {
      default: {
        name: "surface",
        brightness: 500,
      },
    },
  },
  {
    title: "Opacity",
    id: "globalOutlineColorOpacity",
    ai: { name: "outlineColorOpacity", description: "Outline color opacity, 0-100." },
    format: "[{{value}}%]",
    slider: {
      default: 100,
      use: "Slider",
      units: "%",
    },
  },
];

export default OutlineColor;
