const LayoutPosition = [
  {
    title: "Position",
    id: "globalLayoutPosition",
    ai: { name: "position", description: "CSS position: '' (none), static, relative, absolute, fixed, or sticky." },
    select: {
      default: "",
      items: [
        {
          title: "None",
          value: "",
        },
        {
          title: "Static",
          value: "static",
        },
        {
          title: "Relative",
          value: "relative",
        },
        {
          title: "Absolute",
          value: "absolute",
        },
        {
          title: "Fixed",
          value: "fixed",
        },
        {
          title: "Sticky",
          value: "sticky",
        },
      ],
    },
  },
];

export default LayoutPosition;
