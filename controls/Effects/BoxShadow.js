const BoxShadow = [
  {
    title: "Box Shadow",
    id: "globalBoxShadow",
    responsive: false,
    themeShadow: {
      default: {
        base: {
          name: "Default",
        },
      },
    },
  },
  {
    title: "Color",
    id: "globalBoxShadowColor",
    format: "shadow-{{value}}/[var(--box-shadow-opacity)]",
    themeColor: {
      default: {
        name: "surface",
        brightness: 50
      }
    },
  },
  {
    title: "Opacity",
    id: "globalBoxShadowOpacity",
    format: "[--box-shadow-opacity:{{value}}%]",
    responsive: false,
    slider: {
      default: 100,
      use: "Slider",
      units: "%",
    },
  },
];

export default BoxShadow;
