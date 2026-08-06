const BackgroundOnlyColor = [
    {
        globalControl: "ControlType",
        id: "{{value}}Bg",
        ai: { name: "bg", description: "Background mode: 'none' disables, 'static' always applies, 'hover' styles start and hover states separately." },
        segmented: {
          default: "static",
        },
    },
    {
        enable: "false",
        visible: "false",
        ai: { exclude: true, reason: "Hidden control (enable/visible: false) hardcoded to 'color' for this color-only variant; not a real inspector choice." },
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
        ai: { exclude: true, reason: "Inspector UI toggle for editing the hover start/end state; the background values themselves are curated separately for each state." },
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