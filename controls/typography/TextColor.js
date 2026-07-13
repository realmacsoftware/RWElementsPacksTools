const TextColor = [
  {
    title: "Color",
    id: "globalTextColor",
    ai: { name: "color", description: "Text theme color." },
    format: "text-{{value}}/(--textColorOpacity)",
    themeColor: {
      default: {
        name: "text",
        brightness: 100,
      },
    },
  },
  {
    title: "Opacity",
    id: "globalTextColorOpacity",
    ai: { name: "colorOpacity", description: "Text color opacity, 0-100." },
    responsive: false,
    format: "[--textColorOpacity:{{value}}%]",
    slider: {
      default: 100,
      use: "Slider",
      units: "%",
    },
  },
];

export const TextColorHover = [
  {
    title: "Color",
    id: "globalTextColorHover",
    format: "hover:text-{{value}}/(--textColorOpacityHover)",
    themeColor: {
      default: {
        name: "text",
        brightness: 300,
      },
    },
  },
  {
    title: "Opacity",
    id: "globalTextColorOpacityHover",
    responsive: false,
    format: "hover:[--textColorOpacityHover:{{value}}%]",
    slider: {
      default: 100,
      use: "Slider",
      units: "%",
    },
  },
];

export default TextColor;
