const BorderColor = [
  {
    title: "Color",
    id: "globalBordersColor",
    ai: { name: "borderColor", description: "Border theme color." },
    format: "border-{{value}}",
    themeColor: {
      default: {
        name: "surface",
        brightness: 500,
      },
    },
  },
  {
    title: "Opacity",
    id: "globalBordersColorOpacity",
    ai: { name: "borderColorOpacity", description: "Border color opacity, 0-100." },
    format: "[{{value}}%]",
    slider: {
      default: 100,
      use: "Slider",
      units: "%",
    },
  },
];

export default BorderColor;
