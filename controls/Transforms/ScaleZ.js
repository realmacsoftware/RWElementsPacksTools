const ScaleZ = [
  {
    title: "Scale Z",
    id: "globalTransformScaleZ",
    ai: {
      name: "scaleZ",
      description: "Depth scale along the Z axis, in percent (100 = no change). Only has a visible effect combined with rotateX or rotateY.",
    },
    format: "scale-z-[{{value}}%]",
    number: {
      default: 100,
      subtitle: "%",
    },
  },
];

export default ScaleZ;
