const Scale = [
  {
    title: "Scale",
    id: "globalTransformScale",
    ai: { name: "scale", description: "Scale, in percent (100 = no change)." },
    format: "scale-x-[{{value}}%] scale-y-[{{value}}%]",
    number: {
      default: 100,
      subtitle: "%",
    },
  },
];

export default Scale;
