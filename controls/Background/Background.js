const Background = [
  {
    globalControl: "ControlType",
    id: "{{value}}Bg",
    ai: { name: "bg", description: "Background mode: 'none' disables, 'static' always applies, 'hover' styles start and hover states separately." },
    segmented: {
      default: "static",
    },
  },
  {
    visible: "globalControlTypeBg != 'none'",
    ai: { name: "bgStyle", description: "Background style: color, image, or gradient." },
    title: "Style",
    id: "globalBgType",
    responsive: false,
    segmented: {
      default: "color",
      items: [
        {
          icon: "paintbrush",
          value: "color",
        },
        {
          icon: "photo",
          value: "image",
        },
        {
          icon: "swatchpalette",
          value: "gradient",
        },
      ],
    },
  },
  {
    visible: "globalControlTypeBg != 'none' && globalControlTypeBg != 'static'",
    ai: { exclude: true, reason: "Inspector UI toggle for editing the hover start/end state; the background values themselves are curated separately for each state." },
    title: "State",
    id: "globalBgState",
    responsive: false,
    segmented: {
      default: "start",
      items: [
        {
          title: "Start",
          value: "start",
        },
        {
          title: "End",
          value: "end",
        },
      ]
    }
  },
  {
    visible: "globalControlTypeBg != 'none'",
    divider: {},
  },
  {
    globalControl: "Background_Color",
  },
  {
    globalControl: "Background_Gradient",
  },
  {
    globalControl: "Background_Image",
  },
];

export default Background;
