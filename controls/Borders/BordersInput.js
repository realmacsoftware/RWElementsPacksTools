export const BordersInput = [
  {
    globalControl: "ControlType",
    id: "{{value}}Borders",
    ai: { name: "border", description: "Enable/disable borders.", values: ["none", "static", "hover"] },
    segmented: {
      default: "static",
    }
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
    default: {
      name: "surface",
      brightness: 900,
    }
  },
  {
    visible: "globalControlTypeBorders == 'static' || (globalControlTypeBorders == 'hover' && globalBordersState == 'start')",
    ai: { visible: "border == 'static'" },
    globalControl: "BorderWidth",
    default: {
      base: {
        top: "Default",
        right: "Default",
        bottom: "Default",
        left: "Default",
      }
    }
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
    format: "hover:{{value}}",
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
    ai: { name: "borderRadiusHover", description: "Hover-state border radius theme token per corner.", visible: "border == 'hover'" },
    title: "Radius",
    id: "globalBordersRadiusEnd",
    format: "hover:{{value}}",
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

export default BordersInput;
