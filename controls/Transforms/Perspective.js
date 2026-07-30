const Perspective = [
  {
    title: "Distance",
    id: "globalTransformPerspective",
    ai: {
      name: "perspective",
      description: "How much depth 3D transforms appear to have: dramatic (100px) is the most exaggerated, then near (300px), normal (500px), midrange (800px), distant (1200px) the most subtle. 'none' flattens the 3D effect.",
    },
    format: "perspective-{{value}}",
    select: {
      use: "Perspectives",
    },
  },
];

export default Perspective;
