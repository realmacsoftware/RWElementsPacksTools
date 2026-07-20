const LayoutOverflow = [
  {
    title: "Overflow",
    id: "globalLayoutOverflow",
    ai: { name: "overflow", description: "CSS overflow: '' (none), overflow-visible, overflow-hidden, overflow-scroll, or overflow-auto." },
    select: {
      default: "",
      items: [
        {
          title: "None",
          value: "",
        },
        {
          title: "Visible",
          value: "overflow-visible",
        },
        {
          title: "Hidden",
          value: "overflow-hidden",
        },
        {
          title: "Scroll",
          value: "overflow-scroll",
        },
        {
          title: "Auto",
          value: "overflow-auto",
        },
      ],
    },
  },
];

export default LayoutOverflow;
