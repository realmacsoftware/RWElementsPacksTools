const Opacity = [
  {
    title: "Opacity",
    id: "globalOpacity",
    ai: { name: "opacity", description: "Element opacity, 0-100." },
    format: "opacity-[{{value}}%]",
    slider: {
      use: "Slider",
      default: 100,
      units: "%",
    },
  },
];

export default Opacity;
