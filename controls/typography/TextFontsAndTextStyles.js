const TextFontsAndTextStyles = [
    {
        title: "Font",
        id: "globalTextFontFamily",
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
        title: "Size",
        id: "globalTextFontSize",
        ai: { name: "size", description: "Font size theme text-style token." },
        themeTextStyle: {
            default: {
                base: {
                    name: "base",
                },
            },
        },
    },
    {
        title: "Weight",
        id: "globalTextFontWeight",
        ai: { name: "weight", description: "Font weight, 100-900." },
        format: "font-[{{value}}]",
        slider: {
            default: "400",
            items: [
                { value: "100", title: "Thin" },
                { value: "200", title: "Extra Light" },
                { value: "300", title: "Light" },
                { value: "400", title: "Normal" },
                { value: "500", title: "Medium" },
                { value: "600", title: "Semi Bold" },
                { value: "700", title: "Bold" },
                { value: "800", title: "Extra Bold" },
                { value: "900", title: "Black" },
            ],
        },
    },
    {
        title: "Spacing",
        id: "globalTextLetterSpacing",
        ai: { name: "letterSpacing", description: "Letter spacing (tracking) token." },
        format: "tracking-{{value}}",
        slider: {
            default: "normal",
            items: [
                { value: "tighter", title: "Tighter" },
                { value: "tight", title: "Tight" },
                { value: "normal", title: "Normal" },
                { value: "wide", title: "Wide" },
                { value: "wider", title: "Wider" },
                { value: "widest", title: "Widest" },
            ],
        },
    },
    {
        title: "Line Height",
        id: "globalTextLineHeight",
        ai: { name: "lineHeight", description: "Line height (leading) token." },
        format: "leading-{{value}}",
        slider: {
            default: "normal",
            items: [
                { value: "none", title: "None" },
                { value: "tight", title: "Tight" },
                { value: "snug", title: "Snug" },
                { value: "normal", title: "Normal" },
                { value: "relaxed", title: "Relaxed" },
                { value: "loose", title: "Loose" },
            ],
        },
    },
    {
        divider: {},
    },
    {
        title: "Italic",
        id: "globalTextItalic",
        ai: { name: "italic", description: "Italicize the text." },
        switch: {
            falseValue: "not-italic",
            trueValue: "italic",
            default: false,
        },
    },
    {
        title: "Text Shadow",
        id: "globalTextTextShadow",
        ai: { name: "textShadow", description: "Text shadow theme token." },
        disabled: {
            id: "bgType",
            value: "image",
        },
        themeShadow: {
            mode: "text",
            default: {
                name: "none",
            },
        },
    },
    {
        title: "Case",
        id: "globalTextTextTransform",
        ai: { name: "case", description: "Text case transform." },
        select: {
            default: "normal-case",
            items: [
                {
                    value: "normal-case",
                    title: "None",
                },
                {
                    value: "uppercase",
                    title: "Uppercase",
                },
                {
                    value: "lowercase",
                    title: "Lowercase",
                },
                {
                    value: "capitalize",
                    title: "Capitalize",
                },
                {
                    title: "Small Caps",
                    value: "[font-variant-caps:small-caps]",
                },
            ],
        },
    },
    {
        title: "Whitespace",
        id: "globalTextWhiteSpace",
        ai: { name: "whitespace", description: "CSS white-space handling." },
        format: "whitespace-{{value}}",
        select: {
            default: "none",
            items: [
                { value: "none", title: "None" },
                { value: "normal", title: "Normal" },
                { value: "nowrap", title: "Nowrap" },
                { value: "pre", title: "Pre" },
                { value: "pre-line", title: "Pre Line" },
                { value: "pre-wrap", title: "Pre Wrap" },
                { value: "break-spaces", title: "Break Spaces" },
            ],
        },
    },
    {
        divider: {},
    },
    {
        title: "Underline",
        id: "globalTextTextDecoration",
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
        visible: "globalTextTextDecoration != 'no-underline'",
        title: "Style",
        id: "globalTextTextDecorationStyle",
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
        visible: "globalTextTextDecoration == 'underline'",
        title: "Offset",
        id: "globalTextTextDecorationOffset",
        format: "underline-offset-[{{value}}px]",
        slider: {
            default: 1,
            use: "Slider",
            max: 30,
        },
    },
    {
        visible: "globalTextTextDecoration != 'no-underline'",
        title: "Color",
        id: "globalTextTextDecorationColor",
        format: "decoration-{{value}}",
        themeColor: {
            default: {
                name: "text",
                brightness: 100,
            },
        },
    },
    {
        visible: "globalTextTextDecoration != 'no-underline'",
        title: "Opacity",
        id: "globalTextTextDecorationOpacity",
        format: "[{{value}}%]",
        responsive: false,
        slider: {
            default: 100,
            use: "Slider",
            units: "%",
        },
    },
];

export default TextFontsAndTextStyles;
