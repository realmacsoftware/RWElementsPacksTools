const FlexItem = [
  {
    title: "Alignment",
    heading: {},
    visible: "globalGridOrFlexDisplayAs == 'flex'"
  },
  {
    visible: "globalGridOrFlexDisplayAs == 'flex'",
    globalControl: "AlignSelf"
  },
  {
    visible: "globalGridOrFlexDisplayAs == 'flex'",
    globalControl: "JustifySelf"
  },
  {
    globalControl: "Order"
  },
  {
    title: "Advanced Settings",
    heading: {},
    visible: "globalGridOrFlexDisplayAs == 'flex' && globalGridOrFlexItemSettings == 'advanced'"
  },
  {
    visible: "globalGridOrFlexDisplayAs == 'flex' && globalGridOrFlexItemSettings == 'advanced'",
    ai: { name: "flex", description: "CSS flex shorthand: auto, none, 1, or initial.", visible: "actAs == 'flex'" },
    title: "Flex",
    id: "globalFlexItemFlex",
    format: "flex-{{value}}",
    segmented: {
      default: "none",
      items: [
        {
          value: "auto",
          title: "Auto"
        },
        {
          title: "None",
          value: "none"
        },
        {
          title: "1",
          value: "1"
        },
        {
          title: "Initial",
          value: "initial"
        }
      ]
    }
  },
  {
    visible: "globalGridOrFlexDisplayAs == 'flex' && globalGridOrFlexItemSettings == 'advanced'",
    ai: { name: "flexGrow", description: "Whether the item grows to fill free space.", visible: "actAs == 'flex'" },
    title: "Grow",
    id: "globalFlexItemGrow",
    segmented: {
      default: "",
      items: [
        {
          value: "",
          title: "Auto"
        },
        {
          title: "Grow",
          value: "grow"
        },
        {
          title: "No Grow",
          value: "grow-0"
        }
      ]
    }
  },
  {
    visible: "globalGridOrFlexDisplayAs == 'flex' && globalGridOrFlexItemSettings == 'advanced'",
    ai: { name: "flexShrink", description: "Whether the item can shrink below its basis.", visible: "actAs == 'flex'" },
    title: "Shrink",
    id: "globalFlexItemShrink",
    segmented: {
      default: "",
      items: [
        {
          value: "",
          title: "Auto"
        },
        {
          title: "Shrink",
          value: "shrink"
        },
        {
          title: "No Shrink",
          value: "shrink-0"
        }
      ]
    }
  },
  {
    visible: "globalGridOrFlexDisplayAs == 'flex' && globalGridOrFlexItemSettings == 'advanced'",
    ai: { name: "flexBasis", description: "Initial main-axis size (flex-basis), theme-size token.", visible: "actAs == 'flex'" },
    title: "Basis",
    id: "globalFlexItemBasis",
    format: "basis-{{value}}",
    themeSpacing: {
      mode: "single",
      default: {
        base: {
          value: "auto"
        }
      }
    }
  },
]

export default FlexItem;
