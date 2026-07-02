const BackgroundColor = [
    {
        visible: "bgType == 'color'",
        title: "Color",
        id: "bgColor",
        format: "bg-{{value}}/(--bgColorOpacity)",
        themeColor: {
            default: {
                name: "surface",
                brightness: 900,
            },
        },
    },
    {
        visible: "bgType == 'color'",
        title: "Opacity",
        id: "bgColorOpacity",
        format: "[--bgColorOpacity:{{value}}%]",
        responsive: false,
        slider: {
            default: 100,
            use: "Slider",
            units: "%",
        },
    },
];

export default BackgroundColor;
