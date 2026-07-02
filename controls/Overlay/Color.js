const Color = [
  {
    visible: "globalControlTypeOverlay == 'static' && globalOverlayType == 'color' || (globalControlTypeOverlay == 'hover' && globalOverlayState == 'start' && globalOverlayType == 'color')",
    title: "Color",
    id: "globalOverlayColor",
    format: "bg-{{value}}/(--overlayColorOpacity)",
    themeColor: {
      default: {
        name: "surface",
        brightness: 50,
      },
    },
  },
  {
    visible: "globalControlTypeOverlay == 'static' && globalOverlayType == 'color' || (globalControlTypeOverlay == 'hover' && globalOverlayState == 'start' && globalOverlayType == 'color')",
    title: "Opacity",
    id: "globalOverlayColorOpacity",
    format: "[--overlayColorOpacity:{{value}}%]",
    responsive: false,
    slider: {
      default: 100,
      use: "Slider",
      units: "%",
    },
  },
  {
    visible: "(globalControlTypeOverlay == 'hover' && globalOverlayState == 'end' && globalOverlayType == 'color')",
    title: "Color",
    id: "globalOverlayColorEnd",
    format: "bg-{{value}}/(--overlayColorOpacityEnd)",
    themeColor: {
      default: {
        name: "surface",
        brightness: 50,
      },
    },
  },
  {
    visible: "(globalControlTypeOverlay == 'hover' && globalOverlayState == 'end' && globalOverlayType == 'color')",
    title: "Opacity",
    id: "globalOverlayColorOpacityEnd",
    format: "[--overlayColorOpacityEnd:{{value}}%]",
    responsive: false,
    slider: {
      default: 100,
      use: "Slider",
      units: "%",
    },
  },
];

export default Color;
