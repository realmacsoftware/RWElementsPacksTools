const Order = [
  {
    visible: "globalGridOrFlexDisplayAs != 'default' && globalGridOrFlexItemSettings == 'advanced'",
    ai: {
      name: "order",
      description: "Position of this item among its siblings: 'none' (source order), 'first', 'last', or 'custom' (use orderCustom).",
      visible: "actAs != 'default'",
    },
    title: "Order",
    id: "globalGridOrFlexItemOrder",
    format: "order-{{value}}",
    segmented: {
      default: "none",
      items: [
        {
          value: "none",
          title: "Auto"
        },
        {
          value: "first",
          title: "First"
        },
        {
          value: "last",
          title: "Last"
        },
        {
          value: "custom",
          title: "Custom"
        }
      ]
    }
  },
  {
    visible: "globalGridOrFlexDisplayAs != 'default' && globalGridOrFlexItemSettings == 'advanced' && globalGridOrFlexItemOrder == 'custom'",
    ai: {
      name: "orderCustom",
      description: "Explicit CSS order value, used when order is 'custom'. Lower numbers come first; sibling items must also set an order for it to have an effect.",
      visible: "actAs != 'default' && order == 'custom'",
    },
    title: "Custom",
    id: "globalGridOrFlexItemOrderCustom",
    format: "order-[{{value}}]",
    number: {
      default: 1
    }
  },
  {
    title: "Requires other grid items to have an order value set.",
    information: {},
    visible: "globalGridOrFlexDisplayAs != 'default' && globalGridOrFlexItemSettings == 'advanced' && globalGridOrFlexItemOrder == 'custom'"
  }
]

export default Order;
