const ControlType =
{
  title: "Type",
  id: "globalControlType",
  ai: { name: "styling", description: "Styling mode: 'none' disables, 'static' always applies, 'hover' styles start and hover states separately.", values: ["none", "static", "hover"] },
  responsive: false,
  segmented: {
    default: "none",
    items: [
      {
        title: "None",
        value: "none",
      },
      {
        title: "Static",
        value: "static",
      },
      {
        title: "Hover",
        value: "hover",
      },
    ]
  }
}

export default ControlType;
