const BoxShadow = [
  {
    title: "Box Shadow",
    id: "globalBoxShadow",
    themeShadow: {
      default: {
        base: {
          name: "Default",
        },
      },
    },
  },
  {
    title: "Shadow Color",
    id: "globalBoxShadowColor",
    format: "shadow-{{value}}",
    themeColor: {
      default: {
        name: "surface",
        brightness: 950,
      },
    },
  },
  {
    title: "Shadow Opacity",
    id: "globalBoxShadowColorOpacity",
    format: "[{{value}}%]",
    slider: {
      default: 100,
      use: "Slider",
      units: "%",
    },
  },
];

export default BoxShadow;
