const Spacing = [
  {
    title: "Margin & Padding",
    heading: {}
  },
  {
    title: "Enable",
    id: "globalSpacingEnabled",
    ai: { name: "spacingEnabled", description: "Enable custom margin and padding for this element." },
    switch: {
      default: false
    }
  },
  {
    visible: "globalSpacingEnabled == true",
    globalControl: "Margin"
  },
  {
    visible: "globalSpacingEnabled == true",
    globalControl: "Padding"
  }
];

export default Spacing;
