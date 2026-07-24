const OutlineStyle = [
  {
    title: "Style",
    id: "globalOutlineStyle",
    ai: { name: "outlineStyle", description: "Outline line style." },
    segmented: {
      default: "outline",
      items: [
        {
          icon: "square",
          value: "outline",
        },
        {
          icon: "square.dashed",
          value: "outline-dashed",
        },
        {
          icon: "square.dotted",
          value: "outline-dotted",
        },
      ],
    },
  },
];

export default OutlineStyle;
