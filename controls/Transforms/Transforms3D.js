const Transforms3D = [
    {
        globalControl: "ControlType",
        id: "{{value}}3D",
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
        globalControl: "HoverGroup",
        id: "{{value}}3D",
    },
    {
        visible:
            "(globalControlType3D == 'hover' || globalControlType3D == 'mouse') && globalHoverGroup3D == 'custom'",
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
        title: "Transforms follow the cursor over the element chosen above. Cursor X drives Rotate Y, cursor Y drives Rotate X, and Scale Z and Depth go from Start at the centre to End at the edges.",
        information: {},
    },
    {
        visible:
            "globalControlType3D != 'none' && globalControlType3D != 'static'",
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
        globalControl: "Rotate3D",
    },
    {
        visible:
            "globalControlType3D == 'static' || ((globalControlType3D == 'hover' || globalControlType3D == 'mouse') && globalTransforms3DState == 'start')",
        globalControl: "ScaleZ",
    },
    {
        visible:
            "globalControlType3D == 'static' || ((globalControlType3D == 'hover' || globalControlType3D == 'mouse') && globalTransforms3DState == 'start')",
        globalControl: "TranslateZ",
    },

    {
        visible:
            "((globalControlType3D == 'hover' || globalControlType3D == 'mouse') && globalTransforms3DState == 'end')",
        globalControl: "Rotate3D",
        id: "{{value}}End",
    },
    {
        visible:
            "((globalControlType3D == 'hover' || globalControlType3D == 'mouse') && globalTransforms3DState == 'end')",
        globalControl: "ScaleZ",
        id: "{{value}}End",
    },
    {
        visible:
            "((globalControlType3D == 'hover' || globalControlType3D == 'mouse') && globalTransforms3DState == 'end')",
        globalControl: "TranslateZ",
        id: "{{value}}End",
    },
];

export default Transforms3D;
