export const BordersTable = [
  {
    globalControl: "ControlType",
    id: "{{value}}Borders",
    ai: { name: "border", description: "Border mode: 'none' disables, 'static' always applies, 'hover' styles start and hover states separately." },
  },
  {
    visible: "globalControlTypeBorders == 'hover'",
    ai: { exclude: true, reason: "Inspector UI toggle for editing the hover start/end state; the border values themselves are curated separately for each state." },
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
    ai: { visible: "(border == 'static' || border == 'hover')" },
    globalControl: "BorderStyle",
  },
  {
    visible: "globalControlTypeBorders == 'static' || (globalControlTypeBorders == 'hover' && globalBordersState == 'start')",
    ai: { visible: "(border == 'static' || border == 'hover')" },
    globalControl: "BorderColor",
  },
  {
    visible: "globalControlTypeBorders == 'static' || (globalControlTypeBorders == 'hover' && globalBordersState == 'start')",
    ai: { visible: "(border == 'static' || border == 'hover')" },
    globalControl: "BorderWidth",
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
];

export default BordersTable;
