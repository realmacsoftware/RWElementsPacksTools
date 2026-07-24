const BoxShadow = [
  {
    title: "Size",
    id: "globalBoxShadow",
    ai: { name: "boxShadow", description: "Box shadow size, a theme shadow token. Pair with boxShadowColor and boxShadowOpacity." },
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
    ai: { name: "boxShadowColor", description: "Box shadow theme color." },
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
    ai: { name: "boxShadowOpacity", description: "Box shadow opacity, 0-100." },
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
