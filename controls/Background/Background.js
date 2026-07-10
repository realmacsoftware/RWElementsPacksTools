const Background = [
  {
    globalControl: "ControlType",
    id: "{{value}}Bg",
    ai: { name: "bg", description: "Enable/disable background.", values: ["none", "static"] },
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
