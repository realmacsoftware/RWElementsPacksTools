const JustifySelf = [
  {
    ai: {
      name: "justifySelf",
      description: "Alignment of this item on the parent's inline axis, overriding the parent's justify-items.",
      visible: "actAs == 'flex' || (actAs == 'grid' && itemSettings == 'advanced')",
    },
    title: "Justify Self",
    id: "globalGridOrFlexItemJustifySelf",
    format: "justify-self-{{value}}",
    select: {
      default: "auto",
      items: [
        {
          value: "auto",
          title: "Auto"
        },
        {
          value: "start",
          title: "Start"
        },
        {
          value: "end",
          title: "End"
        },
        {
          value: "center",
          title: "Center"
        },
        {
          value: "stretch",
          title: "Stretch"
        },
      ]
    }
  }
];

export default JustifySelf;
