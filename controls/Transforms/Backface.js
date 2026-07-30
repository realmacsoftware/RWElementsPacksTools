const Backface = [
  {
    ai: {
      name: "hideBackface",
      description: "Hide the element's reverse side when it is rotated away from the viewer (backface-visibility).",
    },
    title: "Hide",
    id: "globalTransformBackface",
    switch: {
      default: false,
      trueValue: "backface-hidden",
      falseValue: "",
    },
  },
];

export default Backface;
