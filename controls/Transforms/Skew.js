const Skew = [
  {
    title: "Skew",
    heading: {}
  },
  {
    title: "Horizontal",
    id: "globalTransformSkewX",
    ai: { name: "skewX", description: "Horizontal skew, in degrees." },
    format: "skew-x-[{{value}}deg]",
    number: {
      default: 0,
    },
  },
  {
    title: "Vertical",
    id: "globalTransformSkewY",
    ai: { name: "skewY", description: "Vertical skew, in degrees." },
    format: "skew-y-[{{value}}deg]",
    number: {
      default: 0,
      subtitle: "in degrees",
    },
  },
];

export default Skew;
