const ActAsGridOrFlexItem = [
  {
    title: "Act As",
    heading: {}
  },
  {
    visible: "globalGridOrFlexDisplayAs == 'grid'",
    information: {},
    title: "Component must be inside a Grid for settings to apply.",
  },
  {
    visible: "globalGridOrFlexDisplayAs == 'flex'",
    information: {},
    title: "Component must be inside a Flex for settings to apply.",
  },
  {
    ai: { name: "actAs", description: "Act as a grid or flex item: default, grid, or flex." },
    title: "Type",
    id: "globalGridOrFlexDisplayAs",
    responsive: false,
    segmented: {
      default: "default",
      items: [
        { value: "default", title: "Default" },
        { value: "grid", title: "Grid Item" },
        { value: "flex", title: "Flex Item" },
      ]
    },
  },
  {
    visible: "globalGridOrFlexDisplayAs != 'default'",
    ai: {
      name: "itemSettings",
      description: "Grid/flex item controls: 'basic' (span only on grid) or 'advanced' (placement lines, flex grow/shrink/basis, order, self-alignment on grid).",
    },
    title: "Settings",
    id: "globalGridOrFlexItemSettings",
    responsive: false,
    segmented: {
      default: "basic",
      items: [
        { value: "basic", title: "Standard" },
        { value: "advanced", title: "Advanced" },
      ],
    },
  },
  {
    visible: "globalGridOrFlexDisplayAs != 'default'",
    divider: {}
  },
  {
    globalControl: "GridItem"
  },
  {
    globalControl: "FlexItem"
  }
]

export default ActAsGridOrFlexItem;
