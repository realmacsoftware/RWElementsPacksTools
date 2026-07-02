const Effects = [
    {
        globalControl: "ControlType",
        id: "{{value}}Effects",
    },
    {
        visible: "globalControlTypeEffects == 'hover'",
        globalControl: "HoverGroup",
        id: "{{value}}Effects",
    },
    {
        visible:
            "globalControlTypeEffects == 'hover' && globalHoverGroupEffects == 'custom'",
        title: "ID",
        id: "globalHoverGroupCustomIdEffects",
        text: {
            default: "",
        },
    },
    {
        visible: "globalHoverGroupEffects == 'custom'",
        title: "The ID of the parent element to trigger the effects.",
        information: {},
    },
    {
        visible:
            "globalControlTypeEffects != 'none' && globalControlTypeEffects != 'static'",
        title: "State",
        id: "globalEffectsState",
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
            ],
        },
    },
    {
        visible: "globalControlTypeEffects != 'none'",
        divider: {},
    },
    {
        visible: "globalControlTypeEffects != 'none'",
        title: "Box Shadow",
        heading: {},
    },
    {
        visible:
            "globalControlTypeEffects == 'static' || (globalControlTypeEffects == 'hover' && globalEffectsState == 'start')",
        globalControl: "BoxShadow",
    },
    {
        visible:
            "(globalControlTypeEffects == 'hover' && globalEffectsState == 'end')",
        globalControl: "BoxShadow",
        id: "{{value}}End",
        format: "hover:{{value}}",
    },
    {
        visible: "globalControlTypeEffects != 'none'",
        divider: {},
    },
    {
        visible:
            "globalControlTypeEffects == 'static' || (globalControlTypeEffects == 'hover' && globalEffectsState == 'start')",
        globalControl: "Opacity",
    },
    {
        visible:
            "(globalControlTypeEffects == 'hover' && globalEffectsState == 'end')",
        globalControl: "Opacity",
        id: "{{value}}End",
        format: "hover:{{value}}",
    },
];

export default Effects;
