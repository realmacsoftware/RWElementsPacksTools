const Skew = [
  {
    title: "Skew",
    heading: {},
    ai: { exclude: true, reason: "Inspector-only heading; not a settable property." },
  },
  {
    title: "Horizontal",
    id: "globalTransformSkewX",
    ai: { name: "skewX", description: "Horizontal skew, in degrees.", visible: "transforms != 'none'" },
    format: "skew-x-[{{value}}deg]",
    number: {
      default: 0,
    },
  },
  {
    title: "Vertical",
    id: "globalTransformSkewY",
    ai: { name: "skewY", description: "Vertical skew, in degrees.", visible: "transforms != 'none'" },
    format: "skew-y-[{{value}}deg]",
    number: {
      default: 0,
      subtitle: "in degrees",
    },
  },
];

export default Skew;
