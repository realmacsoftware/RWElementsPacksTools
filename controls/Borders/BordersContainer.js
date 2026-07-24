export const BordersContainer = [
  {
    globalControl: "ControlType",
    id: "{{value}}Borders",
    ai: { name: "border", description: "Enable/disable borders.", values: ["none", "static", "hover"] },
  },
  {
    visible: "globalControlTypeBorders == 'hover'",
    ai: { exclude: true },
    title: "State",
    id: "globalBordersState",
    responsive: false,
    segmented: {
      default: "start",
      items: [
        {
          title: "Start",
          value: "start",
        },
        {
          title: "End",
          value: "end",
        },
      ]
    }
  },
  {
    divider: {},
    visible: "globalControlTypeBorders != 'none'",
  },
  {
    visible: "globalControlTypeBorders == 'static' || (globalControlTypeBorders == 'hover' && globalBordersState == 'start')",
    ai: { visible: "border == 'static'" },
    globalControl: "BorderStyle",
  },
  {
    visible: "globalControlTypeBorders == 'static' || (globalControlTypeBorders == 'hover' && globalBordersState == 'start')",
    ai: { visible: "border == 'static'" },
    globalControl: "BorderColor",
  },
  {
    visible: "globalControlTypeBorders == 'static' || (globalControlTypeBorders == 'hover' && globalBordersState == 'start')",
    ai: { visible: "border == 'static'" },
    globalControl: "BorderWidth",
  },
  {
    visible: "globalControlTypeBorders == 'static' || (globalControlTypeBorders == 'hover' && globalBordersState == 'start')",
    ai: { name: "borderRadius", description: "Border radius theme token per corner.", visible: "border == 'static'" },
    title: "Radius",
    id: "globalBordersRadius",
    format: "{{value}}",
    themeBorderRadius: {
      default: {
        base: {
          topLeft: "none",
          topRight: "none",
          bottomLeft: "none",
          bottomRight: "none",
        },
      },
    },
  },
  {
    visible: "(globalControlTypeBorders == 'hover' && globalBordersState == 'end')",
    ai: { name: "{{value}}Hover", visible: "border == 'hover'" },
    globalControl: "BorderStyle",
    id: "{{value}}End",
  },
  {
    visible: "(globalControlTypeBorders == 'hover' && globalBordersState == 'end')",
    ai: { name: "{{value}}Hover", visible: "border == 'hover'" },
    globalControl: "BorderColor",
    id: "{{value}}End",
  },
  {
    visible: "(globalControlTypeBorders == 'hover' && globalBordersState == 'end')",
    ai: { name: "{{value}}Hover", visible: "border == 'hover'" },
    globalControl: "BorderWidth",
    id: "{{value}}End",
  },
  {
    visible: "(globalControlTypeBorders == 'hover' && globalBordersState == 'end')",
    ai: { name: "borderRadiusHover", description: "Hover-state border radius theme token per corner.", visible: "border == 'hover'" },
    title: "Radius",
    id: "globalBordersRadiusEnd",
    format: "peer-hover:{{value}} hover:{{value}}",
    themeBorderRadius: {
      default: {
        base: {
          topLeft: "none",
          topRight: "none",
          bottomLeft: "none",
          bottomRight: "none",
        },
      },
    },
  },
];

export default BordersContainer;
