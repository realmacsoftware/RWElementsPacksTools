const BoxShadow = [
  {
    title: "Size",
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
    format: "shadow-{{value}}/(--box-shadow-opacity)",
    themeColor: {
      default: {
        name: "none",
        brightness: 500
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
