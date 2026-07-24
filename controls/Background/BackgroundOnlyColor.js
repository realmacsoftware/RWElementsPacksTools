const BackgroundOnlyColor = [
    {
        globalControl: "ControlType",
        id: "{{value}}Bg",
        ai: { name: "bg", description: "Enable/disable background.", values: ["none", "static", "hover"] },
        segmented: {
          default: "static",
        },
    },
    {
        enable: "false",
        visible: "false",
        ai: { exclude: true },
        title: "Style",
        id: "globalBgType",
        responsive: false,
        segmented: {
          default: "color",
          items: [
            {
              icon: "paintbrush",
              value: "color",
            }
          ],
        },
    },
    {
        visible: "globalControlTypeBg != 'none' && globalControlTypeBg != 'static'",
        ai: { exclude: true },
        title: "State",
        id: "globalBgState",
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
        visible: "globalControlTypeBg != 'none'",
        divider: {},
    },
    {
        globalControl: "Background_Color",
    },
];

export default BackgroundOnlyColor;