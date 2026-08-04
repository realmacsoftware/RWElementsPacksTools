const Overlay = [
  {
    globalControl: "ControlType",
    id: "{{value}}Overlay",
    ai: { name: "overlay", description: "Enable/disable overlay." },
    segmented: {
      default: "none",
    },
  },
  {
    visible: "globalControlTypeOverlay != 'none'",
    ai: { name: "overlayStyle", description: "Overlay style: color, image, or gradient." },
    title: "Style",
    id: "globalOverlayType",
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
    visible: "globalControlTypeOverlay != 'none' && globalControlTypeOverlay != 'static'",
    ai: { exclude: true, reason: "Inspector UI toggle for editing the hover start/end state; the overlay values themselves are curated separately for each state." },
    title: "State",
    id: "globalOverlayState",
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
    visible: "globalControlTypeOverlay != 'none'",
    divider: {},
  },
  {
    globalControl: "Overlay_Color",
  },
  {
    globalControl: "Overlay_Gradient",
  },
  {
    globalControl: "Overlay_Image",
  }
];

export default Overlay;
