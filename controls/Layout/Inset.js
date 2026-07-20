const LayoutInset = [
  {
    title: "Inset",
    id: "globalLayoutInset",
    ai: { name: "inset", description: "Uniform top/right/bottom/left inset theme spacing value.", visible: "insetType == 'uniform'" },
    format: "inset-{{value}}",
    themeSpacing: {
      mode: "single",
      default: {
        base: "0"
      },
    }
  },
];

export default LayoutInset;
