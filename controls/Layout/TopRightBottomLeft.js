const LayoutTopRightBottomLeft = [
  {
    title: "Top / Right / Bottom / Left",
    heading: {}
  },
  {
    title: "Type",
    id: "globalLayoutTopRightBottomLeftType",
    ai: { name: "insetType", description: "Top/right/bottom/left mode: none, uniform (use inset), or individual (use top/right/bottom/left)." },
    segmented: {
      default: "none",
      items: [
        {
          title: "None",
          value: "none",
        },
        {
          title: "Uniform",
          value: "uniform",
        },
        {
          title: "Individual",
          value: "individual",
        },
      ],
    },
  },
  {
    visible: "globalLayoutTopRightBottomLeftType == 'uniform'",
    title: "Inset",
    globalControl: "Inset",
  },
  {
    visible: "globalLayoutTopRightBottomLeftType == 'individual'",
    title: "Top",
    id: "globalLayoutTop",
    ai: { name: "top", description: "Top inset theme spacing value.", visible: "insetType == 'individual'" },
    format: "top-{{value}}",
    themeSpacing: {
      mode: "single",
      default: {
        base: {
          value: 0,
        }
      },
    }
  },
  {
    visible: "globalLayoutTopRightBottomLeftType == 'individual'",
    title: "Right",
    id: "globalLayoutRight",
    ai: { name: "right", description: "Right inset theme spacing value.", visible: "insetType == 'individual'" },
    format: "right-{{value}}",
    themeSpacing: {
      mode: "single",
      default: {
        base: {
          value: 0,
        }
      },
    }
  },
  {
    visible: "globalLayoutTopRightBottomLeftType == 'individual'",
    title: "Bottom",
    id: "globalLayoutBottom",
    ai: { name: "bottom", description: "Bottom inset theme spacing value.", visible: "insetType == 'individual'" },
    format: "bottom-{{value}}",
    themeSpacing: {
      mode: "single",
      default: {
        base: {
          value: 0,
        }
      },
    }
  },
  {
    visible: "globalLayoutTopRightBottomLeftType == 'individual'",
    title: "Left",
    id: "globalLayoutLeft",
    ai: { name: "left", description: "Left inset theme spacing value.", visible: "insetType == 'individual'" },
    format: "left-{{value}}",
    themeSpacing: {
      mode: "single",
      default: {
        base: {
          value: 0,
        }
      },
    }
  },
];

export default LayoutTopRightBottomLeft;
