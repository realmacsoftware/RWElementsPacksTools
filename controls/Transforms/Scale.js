const Scale = [
  {
    title: "Scale",
    id: "globalTransformScale",
    ai: { name: "scale", description: "Scale, in percent (100 = no change)." },
    // Single class only: Elements prepends responsive prefixes once per formatted
    // string, so a multi-class format would leave every class after the first
    // without its breakpoint modifier. globalTransforms mirrors each scale-x
    // class to a scale-y twin so uniform scale still composes with scale-z.
    format: "scale-x-[{{value}}%]",
    number: {
      default: 100,
      subtitle: "%",
    },
  },
];

export default Scale;
