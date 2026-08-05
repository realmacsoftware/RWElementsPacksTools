const Effects = [
    {
        globalControl: "ControlType",
        id: "{{value}}Effects",
        ai: { name: "effects", description: "Enable/disable effects." },
    },
    {
        visible: "globalControlTypeEffects == 'hover'",
        ai: {
            name: "effectsHoverTrigger",
            description: "Which element's hover triggers the effects."
        },
        globalControl: "HoverGroup",
        id: "{{value}}Effects",
    },
    {
        visible:
            "globalControlTypeEffects == 'hover' && globalHoverGroupEffects == 'custom'",
        ai: {
            name: "effectsHoverTriggerId",
            description: "ID of the element that triggers the hover effects."
        },
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
        ai: { exclude: true, reason: "Inspector UI toggle for editing the hover start/end state; the effect values themselves are curated separately for each state." },
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
        ai: { visible: "effects != 'none'" },
        globalControl: "BoxShadow",
    },
    {
        visible:
            "(globalControlTypeEffects == 'hover' && globalEffectsState == 'end')",
        ai: {
            name: "{{value}}Hover",
            description: "Hover-state box shadow size, a theme shadow token. Pair with boxShadowColorHover and boxShadowOpacityHover.",
            visible: "effects == 'hover'"
        },
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
        ai: { visible: "effects != 'none'" },
        globalControl: "Opacity",
    },
    {
        visible:
            "(globalControlTypeEffects == 'hover' && globalEffectsState == 'end')",
        ai: { name: "{{value}}Hover", visible: "effects == 'hover'" },
        globalControl: "Opacity",
        id: "{{value}}End",
        format: "hover:{{value}}",
    },
];

export default Effects;
