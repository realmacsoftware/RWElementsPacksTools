const Color = [
  {
    visible: "globalControlTypeBg == 'static' && globalBgType == 'color' || (globalControlTypeBg == 'hover' && globalBgState == 'start' && globalBgType == 'color')",
    ai: { name: "bgColor", description: "Background theme color.", visible: "bg == 'static' && bgStyle == 'color'" },
    title: "Color",
    id: "globalBgColor",
    format: "bg-{{value}}/(--bgColorOpacity)",
    themeColor: {
      default: {
        name: "surface",
        brightness: 50,
      },
    },
  },
  {
    visible: "globalControlTypeBg == 'static' && globalBgType == 'color' || (globalControlTypeBg == 'hover' && globalBgState == 'start' && globalBgType == 'color')",
    ai: { name: "bgColorOpacity", description: "Background color opacity, 0-100.", visible: "bg == 'static' && bgStyle == 'color'" },
    title: "Opacity",
    id: "globalBgColorOpacity",
    format: "[--bgColorOpacity:{{value}}%]",
    responsive: false,
    slider: {
      default: 100,
      use: "Slider",
      units: "%",
    },
  },
  {
    visible: "(globalControlTypeBg == 'hover' && globalBgState == 'end' && globalBgType == 'color')",
    title: "Color",
    id: "globalBgColorEnd",
    format: "hover:bg-{{value}}/(--bgColorOpacityEnd)",
    themeColor: {
      default: {
        name: "surface",
        brightness: 50,
      },
    },
  },
  {
    visible: "(globalControlTypeBg == 'hover' && globalBgState == 'end' && globalBgType == 'color')",
    title: "Opacity",
    id: "globalBgColorOpacityEnd",
    format: "hover:[--bgColorOpacityEnd:{{value}}%]",
    responsive: false,
    slider: {
      default: 100,
      use: "Slider",
      units: "%",
    },
  },
];

export default Color;
