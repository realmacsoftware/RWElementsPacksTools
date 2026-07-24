const Transforms = [
    {
        globalControl: "ControlType",
        id: "{{value}}Transforms",
        ai: { name: "transforms", description: "Enable/disable transforms.", values: ["none", "static", "hover"] },
    },
    {
        visible: "globalControlTypeTransforms == 'hover'",
        ai: {
            name: "transformsHoverTrigger",
            description: "Which element's hover triggers the transforms.",
            values: ["self", "parent", "container", "grid", "flex", "custom"],
            visible: "transforms == 'hover'",
        },
        globalControl: "HoverGroup",
        id: "{{value}}Transforms",
    },
    {
        visible:
            "globalControlTypeTransforms == 'hover' && globalHoverGroupTransforms == 'custom'",
        ai: {
            name: "transformsHoverTriggerId",
            description: "ID of the element that triggers the hover transforms (when trigger is 'custom').",
            visible: "transforms == 'hover' && transformsHoverTrigger == 'custom'",
        },
        title: "ID",
        id: "globalHoverGroupCustomIdTransforms",
        text: {
            default: "",
        },
    },
    {
        visible: "globalHoverGroupTransforms == 'custom'",
        title: "The ID of the parent element to trigger the transforms.",
        information: {},
    },
    {
        visible:
            "globalControlTypeTransforms != 'none' && globalControlTypeTransforms != 'static'",
        ai: { exclude: true },
        title: "State",
        id: "globalTransformsState",
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
        visible: "globalControlTypeTransforms != 'none'",
        divider: {},
    },
    {
        visible: "globalControlTypeTransforms != 'none'",
        globalControl: "TransformOrigin",
    },
    {
        visible:
            "globalControlTypeTransforms == 'static' || (globalControlTypeTransforms == 'hover' && globalTransformsState == 'start')",
        ai: { visible: "transforms == 'static'" },
        globalControl: "Scale",
    },
    {
        visible:
            "globalControlTypeTransforms == 'static' || (globalControlTypeTransforms == 'hover' && globalTransformsState == 'start')",
        ai: { visible: "transforms == 'static'" },
        globalControl: "Rotate",
    },
    {
        visible:
            "globalControlTypeTransforms == 'static' || (globalControlTypeTransforms == 'hover' && globalTransformsState == 'start')",
        ai: { visible: "transforms == 'static'" },
        globalControl: "Translate",
    },
    {
        visible:
            "globalControlTypeTransforms == 'static' || (globalControlTypeTransforms == 'hover' && globalTransformsState == 'start')",
        ai: { visible: "transforms == 'static'" },
        globalControl: "Skew",
    },

    {
        visible:
            "(globalControlTypeTransforms == 'hover' && globalTransformsState == 'end')",
        ai: { name: "{{value}}Hover", visible: "transforms == 'hover'" },
        globalControl: "Scale",
        id: "{{value}}End",
    },
    {
        visible:
            "(globalControlTypeTransforms == 'hover' && globalTransformsState == 'end')",
        ai: { name: "{{value}}Hover", visible: "transforms == 'hover'" },
        globalControl: "Rotate",
        id: "{{value}}End",
    },
    {
        visible:
            "(globalControlTypeTransforms == 'hover' && globalTransformsState == 'end')",
        ai: { name: "{{value}}Hover", visible: "transforms == 'hover'" },
        globalControl: "Translate",
        id: "{{value}}End",
    },
    {
        visible:
            "(globalControlTypeTransforms == 'hover' && globalTransformsState == 'end')",
        ai: { name: "{{value}}Hover", visible: "transforms == 'hover'" },
        globalControl: "Skew",
        id: "{{value}}End",
    },
];

export default Transforms;
