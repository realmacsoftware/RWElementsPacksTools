const DropShadow = [
    {
        title: "Drop Shadow",
        id: "globalFiltersDropShadow",
        themeShadow: {
            mode: "drop",
            default: {
                base: {
                    name: "none",
                },
            },
        },
    },
    {
        title: "Shadow Color",
        id: "globalFiltersDropShadowColor",
        format: "drop-shadow-{{value}}",
        themeColor: {
            default: {
                name: "surface",
                brightness: 950,
            },
        },
    },
    {
        title: "Shadow Opacity",
        id: "globalFiltersDropShadowColorOpacity",
        format: "[{{value}}%]",
        slider: {
            default: 100,
            use: "Slider",
            units: "%",
        },
    },
];

export default DropShadow;
