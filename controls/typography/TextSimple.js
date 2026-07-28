const TextSimple = [
    {
        title: "Align",
        id: "textSimpleTextAlign",
        ai: { name: "align", description: "Horizontal text alignment." },
        segmented: {
            use: "TextAlign",
        },
    },
    {
        title: "Color",
        id: "textSimpleTextColor",
        ai: { name: "color", description: "Text theme color." },
        format: "text-{{value}}",
        themeColor: {
            default: {
                name: "text",
                brightness: 100,
            },
        },
    },
    {
        title: "Opacity",
        id: "textSimpleTextColorOpacity",
        ai: { name: "colorOpacity", description: "Text color opacity, 0-100." },
        format: "[{{value}}%]",
        responsive: false,
        slider: {
            default: 100,
            use: "Slider",
            units: "%",
        },
    },
    {
        title: "Font Family",
        id: "textSimpleFonts",
        ai: { name: "family", description: "Font family theme token." },
        themeFont: {
            default: {
                base: {
                    name: "body",
                },
            },
        },
    },
    {
        title: "Text Style",
        id: "textSimpleTextStyles",
        ai: { name: "size", description: "Font size theme text-style token." },
        themeTextStyle: {
            default: {
                base: {
                    name: "base",
                },
            },
        },
    },
];

export default TextSimple;
