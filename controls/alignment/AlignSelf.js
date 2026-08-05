const AlignSelf = [
  {
    ai: {
      name: "alignSelf",
      description: "Alignment of this item on the parent's block axis (grid) or cross axis (flex), overriding the parent's align-items.",
      visible: "actAs == 'flex' || (actAs == 'grid' && itemSettings == 'advanced')",
    },
    title: "Align",
    id: "globalGridOrFlexItemAlignSelf",
    format: "self-{{value}}",
    select: {
      "default": "auto",
      "items": [
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

export default AlignSelf;
