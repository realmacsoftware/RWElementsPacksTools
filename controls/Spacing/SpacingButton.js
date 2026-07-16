const SpacingButton = [
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
    ai: {
      description:
        "Margin (outer spacing) — theme spacing token per side. Defaults to horizontal 'auto', which overrides the parent's justify/gap. Set all sides to '0' when this button is inside a Flex or Grid so the parent controls spacing and alignment. Setting padding does not reset margin.",
    },
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
    globalControl: "Padding",
    default: {
      base: {
        top: "2",
        right: "3.5",
        bottom: "2",
        left: "3.5",
        linkHorizontal: true,
        linkVertical: true,
      }
    }
  }
];

export default SpacingButton;
