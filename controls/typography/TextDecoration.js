const TextDecoration = [
    {
        title: "Underline",
        id: "textDecoration",
        ai: { name: "decoration", description: "Text decoration (underline/overline/line-through)." },
        select: {
            default: "no-underline",
            items: [
                {
                    value: "no-underline",
                    title: "No Underline",
                },
                {
                    value: "underline",
                    title: "Underline",
                },
                {
                    value: "overline",
                    title: "Overline",
                },
                {
                    value: "line-through",
                    title: "Line Through",
                },
            ],
        },
    },
    {
        visible: "textDecoration != 'no-underline'",
        title: "Thickness",
        id: "textDecorationThickness",
        ai: { name: "decorationThickness", description: "Text decoration thickness in pixels, 0-30. Applied in preview only." },
        format: "decoration-[{{value}}px]",
        slider: {
            default: 1,
            use: "Slider",
            max: 30,
        },
    },
    {
        visible: "textDecoration == 'underline'",
        information: {},
        title: "Thickness is currently applied in preview only.",
    },
    {
        visible: "textDecoration == 'underline'",
        title: "Offset",
        id: "textDecorationOffset",
        ai: { name: "decorationOffset", description: "Underline offset in pixels, 0-30." },
        format: "underline-offset-[{{value}}px]",
        slider: {
            default: 1,
            use: "Slider",
            max: 30,
        },
    },
    {
        visible: "textDecoration != 'no-underline'",
        title: "Style",
        id: "textDecorationStyle",
        ai: { name: "decorationStyle", description: "Line style for the text decoration." },
        format: "decoration-{{value}}",
        select: {
            default: "solid",
            items: [
                {
                    value: "solid",
                    title: "Solid",
                },
                {
                    value: "double",
                    title: "Double",
                },
                {
                    value: "dotted",
                    title: "Dotted",
                },
                {
                    value: "dashed",
                    title: "Dashed",
                },
                {
                    value: "wavy",
                    title: "Wavy",
                },
            ],
        },
    },
    {
        visible: "textDecoration != 'no-underline'",
        title: "Color",
        id: "textDecorationColor",
        ai: { name: "decorationColor", description: "Text decoration theme color." },
        format: "decoration-{{value}}",
        themeColor: {
            default: {
                name: "gray",
                brightness: 800,
            },
        },
    },
];

export default TextDecoration;
