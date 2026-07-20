const LayoutZIndex = [
  {
    title: "Z-Index",
    id: "globalLayoutZIndexType",
    ai: { name: "zIndexType", description: "Z-index mode: '' (none), z-auto, or custom (use zIndex)." },
    responsive: false,
    segmented: {
      default: "",
      items: [
        {
          title: "None",
          value: "",
        },
        {
          title: "Auto",
          value: "z-auto",
        },
        {
          title: "Custom",
          value: "custom",
        },
      ],
    },
  },
  {
    visible: "globalLayoutZIndexType == 'custom'",
    title: "",
    id: "globalLayoutZIndex",
    ai: { name: "zIndex", description: "Custom z-index value, can be positive or negative.", visible: "zIndexType == 'custom'" },
    format: "z-[{{value}}]",
    number: {
      default: 0,
      subtitle: "Can be positive or negative.",
    },
  },
];

export default LayoutZIndex;
