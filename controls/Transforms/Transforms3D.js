const Transforms3D = [
    {
        globalControl: "ControlType",
        id: "{{value}}3D",
    },
    {
        visible: "globalControlType3D == 'hover'",
        globalControl: "HoverGroup",
        id: "{{value}}3D",
    },
    {
        visible:
            "globalControlType3D == 'hover' && globalHoverGroup3D == 'custom'",
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
            "globalControlType3D == 'static' || (globalControlType3D == 'hover' && globalTransforms3DState == 'start')",
        globalControl: "Rotate3D",
    },
    {
        visible:
            "globalControlType3D == 'static' || (globalControlType3D == 'hover' && globalTransforms3DState == 'start')",
        globalControl: "ScaleZ",
    },
    {
        visible:
            "globalControlType3D == 'static' || (globalControlType3D == 'hover' && globalTransforms3DState == 'start')",
        globalControl: "TranslateZ",
    },

    {
        visible:
            "(globalControlType3D == 'hover' && globalTransforms3DState == 'end')",
        globalControl: "Rotate3D",
        id: "{{value}}End",
    },
    {
        visible:
            "(globalControlType3D == 'hover' && globalTransforms3DState == 'end')",
        globalControl: "ScaleZ",
        id: "{{value}}End",
    },
    {
        visible:
            "(globalControlType3D == 'hover' && globalTransforms3DState == 'end')",
        globalControl: "TranslateZ",
        id: "{{value}}End",
    },
];

export default Transforms3D;
