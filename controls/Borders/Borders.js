export const Borders = [
  {
    globalControl: "ControlType",
    id: "{{value}}Borders",
    ai: { name: "border", description: "Enable/disable borders.", values: ["none", "static", "hover"] },
  },
  {
    visible: "globalControlTypeBorders == 'hover'",
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
    ai: { visible: "border == 'static'" },
    globalControl: "BorderRadius",
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
    format: "hover:{{value}}",
  },
  {
    visible: "(globalControlTypeBorders == 'hover' && globalBordersState == 'end')",
    ai: { name: "{{value}}Hover", visible: "border == 'hover'" },
    globalControl: "BorderRadius",
    format: "hover:{{value}}",
    id: "{{value}}End",
  },
];

export default Borders;
