const Transforms3D = [
    {
        globalControl: "ControlType",
        id: "{{value}}3D",
        ai: { name: "transforms3d", description: "Enable/disable 3D transforms." },
        segmented: {
            default: "none",
            items: [
                {
                    title: "None",
                    value: "none",
                },
                {
                    title: "Static",
                    value: "static",
                },
                {
                    title: "Hover",
                    value: "hover",
                },
                {
                    title: "Mouse",
                    value: "mouse",
                },
            ],
        },
    },
    {
        visible:
            "globalControlType3D == 'hover' || globalControlType3D == 'mouse'",
        ai: {
            name: "transforms3dHoverTrigger",
            description: "Which element's hover or mouse movement triggers the 3D transforms."
        },
        globalControl: "HoverGroup",
        id: "{{value}}3D",
    },
    {
        visible:
            "(globalControlType3D == 'hover' || globalControlType3D == 'mouse') && globalHoverGroup3D == 'custom'",
        ai: {
            name: "transforms3dHoverTriggerId",
            description: "ID of the element that triggers the 3D transforms."
        },
        title: "ID",
        id: "globalHoverGroupCustomId3D",
        text: {
            default: "",
        },
    },
    {
        visible: "globalHoverGroup3D == 'custom'",
        title: "The ID of the parent element to trigger the transforms.",
        information: {},
    },
    {
        visible: "globalControlType3D == 'mouse'",
        title: "Move your cursor over the component in the browser.",
        information: {},
    },
    {
        visible:
            "globalControlType3D != 'none' && globalControlType3D != 'static'",
        ai: { exclude: true, reason: "Inspector UI toggle for editing the hover/mouse start and end state; the 3D transform values themselves are curated separately for each state." },
        title: "State",
        id: "globalTransforms3DState",
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
        visible: "globalControlType3D != 'none'",
        divider: {},
    },

    {
        visible: "globalControlType3D != 'none'",
        title: "Perspective",
        heading: {},
    },
    {
        visible: "globalControlType3D != 'none'",
        globalControl: "Perspective",
    },
    {
        visible: "globalControlType3D != 'none'",
        globalControl: "PerspectiveOrigin",
    },

    {
        visible: "globalControlType3D != 'none'",
        title: "Backface",
        heading: {},
    },
    {
        visible: "globalControlType3D != 'none'",
        globalControl: "Backface",
    },
    {
        visible:
            "globalControlType3D == 'static' || ((globalControlType3D == 'hover' || globalControlType3D == 'mouse') && globalTransforms3DState == 'start')",
        ai: { visible: "transforms3d != 'none'" },
        globalControl: "Rotate3D",
    },
    {
        visible:
            "globalControlType3D == 'static' || ((globalControlType3D == 'hover' || globalControlType3D == 'mouse') && globalTransforms3DState == 'start')",
        ai: { visible: "transforms3d != 'none'" },
        globalControl: "ScaleZ",
    },
    {
        visible:
            "globalControlType3D == 'static' || ((globalControlType3D == 'hover' || globalControlType3D == 'mouse') && globalTransforms3DState == 'start')",
        ai: { visible: "transforms3d != 'none'" },
        globalControl: "TranslateZ",
    },

    {
        visible:
            "((globalControlType3D == 'hover' || globalControlType3D == 'mouse') && globalTransforms3DState == 'end')",
        ai: { name: "{{value}}End", visible: "transforms3d == 'hover' || transforms3d == 'mouse'" },
        globalControl: "Rotate3D",
        id: "{{value}}End",
    },
    {
        visible:
            "((globalControlType3D == 'hover' || globalControlType3D == 'mouse') && globalTransforms3DState == 'end')",
        ai: { name: "{{value}}End", visible: "transforms3d == 'hover' || transforms3d == 'mouse'" },
        globalControl: "ScaleZ",
        id: "{{value}}End",
    },
    {
        visible:
            "((globalControlType3D == 'hover' || globalControlType3D == 'mouse') && globalTransforms3DState == 'end')",
        ai: { name: "{{value}}End", visible: "transforms3d == 'hover' || transforms3d == 'mouse'" },
        globalControl: "TranslateZ",
        id: "{{value}}End",
    },
];

export default Transforms3D;
