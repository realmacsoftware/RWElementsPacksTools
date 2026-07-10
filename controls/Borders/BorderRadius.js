const BorderRadius = [
  {
    title: "Radius",
    id: "globalBordersRadius",
    ai: { name: "borderRadius", description: "Border radius theme token per corner." },
    format: "{{value}}",
    themeBorderRadius: {
      default: {
        base: {
          topLeft: "Default",
          topRight: "Default",
          bottomLeft: "Default",
          bottomRight: "Default",
        },
      },
    },
  },
];

export default BorderRadius;
