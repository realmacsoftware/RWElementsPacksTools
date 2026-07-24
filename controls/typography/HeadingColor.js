const HeadingColor = [
  {
    globalControl: "ControlType",
    id: "{{value}}Bg",
    ai: { name: "bg", description: "Text color styling state: 'static' or 'hover'.", values: ["static", "hover"] },
    segmented: {
      default: "static",
      items: [
        {
          title: "Static",
          value: "static",
        },
        {
          title: "Hover",
          value: "hover",
        },
      ],
    },
  },
  {
    ai: { name: "bgStyle", description: "Text fill style: color, image, or gradient." },
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
    visible: "globalControlTypeBg != 'none'",
    divider: {},
  },
  {
    visible: "globalControlTypeBg == 'hover'",
    globalControl: "HoverGroup",
    id: "{{value}}Bg",
},
  {
    visible: "globalControlTypeBg != 'none' && globalControlTypeBg != 'static'",
    ai: { exclude: true },
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
    visible: "globalControlTypeBg == 'static' && globalBgType == 'color' || (globalControlTypeBg == 'hover' && globalBgState == 'start' && globalBgType == 'color')",
    ai: { visible: "bg == 'static'" },
    globalControl: "TextColor",
    default: {
      name: "text",
      brightness: 50,
    }
  },
  {
    visible: "globalControlTypeBg == 'hover' && globalBgState == 'end' && globalBgType == 'color'",
    ai: { name: "colorHover", description: "Text hover-state theme color.", visible: "bg == 'hover'" },
    title: "Color",
    id: "globalTextColorHover",
    format: "text-{{value}}/(--textColorOpacityHover)",
    themeColor: {
      default: {
        name: "text",
        brightness: 200
      }
    },
  },
  {
    visible: "globalControlTypeBg == 'hover' && globalBgState == 'end' && globalBgType == 'color'",
    ai: { name: "colorOpacityHover", description: "Text hover-state color opacity, 0-100.", visible: "bg == 'hover'" },
    title: "Opacity",
    id: "globalTextColorOpacityHover",
    responsive: false,
    format: "[--textColorOpacityHover:{{value}}%]",
    slider: {
      default: 100,
      min: 0,
      max: 100,
      round: true,
      snap: true,
      units: "%"
    },
  },
  {
    globalControl: "Background_Gradient",
  },
  {
    globalControl: "Background_Image",
  },
];

export default HeadingColor;
