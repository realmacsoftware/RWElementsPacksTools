const PerspectiveOrigin = [
  {
    title: "Origin",
    id: "globalTransformPerspectiveOrigin",
    ai: {
      name: "perspectiveOrigin",
      description: "Vanishing point the 3D scene is viewed from. Different from transformOrigin, which is the point the element pivots around.",
    },
    format: "perspective-origin-{{value}}",
    select: {
      use: "TransformOrigins",
    },
  },
];

export default PerspectiveOrigin;
