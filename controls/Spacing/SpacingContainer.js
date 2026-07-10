const SpacingContainer = [
  {
    title: "Margin & Padding",
    heading: {}
  },
  {
    title: "Enable",
    id: "globalSpacingEnabled",
    ai: { name: "spacingEnabled", description: "Enable custom margin and padding for this element." },
    switch: {
      default: true
    }
  },
  {
    visible: "globalSpacingEnabled == true",
    globalControl: "Margin",
    default: {
      base: {
        top: "0",
        right: "auto",
        bottom: "0",
        left: "auto",
        linkHorizontal: true,
      }
    }
  },
  {
    visible: "globalSpacingEnabled == true",
    globalControl: "Padding"
  }
];

export default SpacingContainer;
