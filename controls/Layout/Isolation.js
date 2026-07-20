const LayoutIsolation = [
  {
    title: "Isolation",
    id: "globalLayoutIsolation",
    ai: { name: "isolation", description: "CSS isolation: '' (none), isolate, or isolate-auto." },
    segmented: {
      default: "",
      items: [
        {
          title: "None",
          value: "",
        },
        {
          title: "Isolate",
          value: "isolate",
        },
        {
          title: "Auto",
          value: "isolate-auto",
        },
      ],
    },
  },
];

export default LayoutIsolation;
