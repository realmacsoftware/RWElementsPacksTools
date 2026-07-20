const LayoutVisibility = [
  {
    title: "Visibility",
    id: "globalLayoutVisibility",
    ai: { name: "visibility", description: "CSS visibility: '' (auto), visible, or invisible." },
    select: {
      default: "",
      items: [
        {
          title: "Auto",
          value: "",
        },
        {
          title: "Visible",
          value: "visible",
        },
        {
          title: "Invisible",
          value: "invisible",
        }
      ],
    },
  },
];

export default LayoutVisibility;
