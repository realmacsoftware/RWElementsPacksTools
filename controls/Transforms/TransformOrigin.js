const TransformOrigin = [
  {
    title: "Origin",
    id: "globalTransformOrigin",
    ai: {
      name: "transformOrigin",
      description: "Anchor point that scale, rotate and skew pivot around.",
    },
    format: "origin-{{value}}",
    select: {
      use: "TransformOrigins",
    }
  }
];

export default TransformOrigin;
