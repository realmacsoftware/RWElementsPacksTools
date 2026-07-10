const BorderStyle = [
  {
    title: "Style",
    id: "globalBordersStyle",
    ai: { name: "borderStyle", description: "Border line style." },
    format: "border-{{value}}",
    segmented: {
      default: "solid",
      items: [
        {
          icon: "square",
          value: "solid",
        },
        {
          icon: "square.dashed",
          value: "dashed",
        },
        {
          icon: "square.dotted",
          value: "dotted",
        },
      ],
    },
  },
];

export default BorderStyle;
