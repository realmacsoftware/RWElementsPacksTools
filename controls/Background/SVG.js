export const SVG = [
    {
        visible:
            "globalControlTypeBg == 'static' && globalBgType == 'svg' || (globalControlTypeBg == 'hover' && globalBgState == 'start' && globalBgType == 'svg')",
        ai: { name: "bgSvg", description: "Background SVG resource ID.", visible: "bg == 'static' && bgStyle == 'svg'" },
        title: "SVG",
        id: "globalBgSVGResource",
        resource: { accepts: ".svg" },
    },
    {
        visible:
            "(globalControlTypeBg == 'hover' && globalBgState == 'end' && globalBgType == 'svg')",
        ai: { name: "bgSvgHover", description: "Hover-state background SVG resource ID.", visible: "bg == 'hover' && bgStyle == 'svg'" },
        title: "SVG",
        id: "globalBgSVGResourceEnd",
        resource: { accepts: ".svg" },
    },
    {
        visible: "globalBgType == 'svg'",
        ai: { name: "bgSvgColor", description: "SVG fill theme color." },
        title: "Color",
        id: "globalBgSVGColor",
        format: "text-{{value}} [&>svg]:fill-current",
        themeColor: {
            default: {
                name: "surface",
                brightness: 500,
            },
        },
    },
    {
        visible: "globalBgType == 'svg'",
        ai: { name: "bgSvgOpacity", description: "SVG opacity, 0-100." },
        title: "Opacity",
        id: "globalBgSVGOpacity",
        format: "opacity-[{{value}}%]",
        slider: {
            use: "Slider",
            units: "%",
            default: 100,
        },
    },
    {
        visible: "globalBgType == 'svg'",
        title: "Width",
        heading: {},
    },
    {
        visible: "globalBgType == 'svg'",
        ai: { name: "bgSvgWidth", description: "SVG fixed width theme-size token." },
        title: "Fixed",
        id: "globalBgSVGFixedWidth",
        format: "[&>svg]:w-{{value}}",
        themeSpacing: {
            mode: "single",
            default: {
                base: {
                    custom: true,
                    value: "100%",
                },
            },
        },
    },
    {
        visible: "globalBgType == 'svg'",
        ai: { name: "bgSvgMaxWidth", description: "SVG max width theme-size token." },
        title: "Max",
        id: "globalBgSVGMaxWidth",
        format: "[&>svg]:max-w-{{value}}",
        themeSpacing: {
            mode: "single",
            default: {
                base: {
                    custom: true,
                    value: "100%",
                },
            },
        },
    },
    {
        visible: "globalBgType == 'svg'",
        ai: { name: "bgSvgMinWidth", description: "SVG min width theme-size token." },
        title: "Min",
        id: "globalBgSVGMinWidth",
        format: "[&>svg]:min-w-{{value}}",
        themeSpacing: {
            mode: "single",
            default: {
                base: {
                    value: "auto",
                },
            },
        },
    },
    {
        visible: "globalBgType == 'svg'",
        title: "Height",
        heading: {},
    },
    {
        visible: "globalBgType == 'svg'",
        ai: { name: "bgSvgHeight", description: "SVG fixed height theme-size token." },
        title: "Fixed",
        id: "globalBgSVGFixedHeight",
        format: "[&>svg]:h-{{value}}",
        themeSpacing: {
            mode: "single",
            default: {
                base: {
                    value: "auto",
                },
            },
        },
    },
    {
        visible: "globalBgType == 'svg'",
        ai: { name: "bgSvgMaxHeight", description: "SVG max height theme-size token." },
        title: "Max",
        id: "globalBgSVGMaxHeight",
        format: "[&>svg]:max-h-{{value}}",
        themeSpacing: {
            mode: "single",
            default: {
                base: {
                    value: "auto",
                },
            },
        },
    },
    {
        visible: "globalBgType == 'svg'",
        ai: { name: "bgSvgMinHeight", description: "SVG min height theme-size token." },
        title: "Min",
        id: "globalBgSVGMinHeight",
        format: "[&>svg]:min-h-{{value}}",
        themeSpacing: {
            mode: "single",
            default: {
                base: {
                    value: "auto",
                },
            },
        },
    },
    {
        visible: "globalBgType == 'svg'",
        divider: {},
    },
    {
        visible: "globalBgType == 'svg'",
        title: "Position",
        heading: {},
    },
    {
        visible: "globalBgType == 'svg'",
        ai: { name: "bgSvgTop", description: "SVG offset from top." },
        title: "Top",
        id: "globalBgSVGPositionTop",
        format: "[&>svg]:top-{{value}}",
        themeSpacing: {
            mode: "single",
            default: {
                base: {
                    value: "0",
                },
            },
        },
    },
    {
        visible: "globalBgType == 'svg'",
        ai: { name: "bgSvgRight", description: "SVG offset from right." },
        title: "Right",
        id: "globalBgSVGPositionRight",
        format: "[&>svg]:right-{{value}}",
        themeSpacing: {
            mode: "single",
            default: {
                base: {
                    value: "auto",
                },
            },
        },
    },
    {
        visible: "globalBgType == 'svg'",
        ai: { name: "bgSvgBottom", description: "SVG offset from bottom." },
        title: "Bottom",
        id: "globalBgSVGPositionBottom",
        format: "[&>svg]:bottom-{{value}}",
        themeSpacing: {
            mode: "single",
            default: {
                base: {
                    value: "auto",
                },
            },
        },
    },
    {
        visible: "globalBgType == 'svg'",
        ai: { name: "bgSvgLeft", description: "SVG offset from left." },
        title: "Left",
        id: "globalBgSVGPositionLeft",
        format: "[&>svg]:left-{{value}}",
        themeSpacing: {
            mode: "single",
            default: {
                base: {
                    value: "0",
                },
            },
        },
    },
    {
        visible: "globalBgType == 'svg'",
        title: "Translate",
        heading: {},
    },
    {
        visible: "globalBgType == 'svg'",
        ai: { name: "bgSvgTranslateX", description: "SVG horizontal translate offset." },
        title: "X",
        id: "globalBgSVGTranslateX",
        format: "[&>svg]:translate-x-{{value}}",
        themeSpacing: {
            mode: "single",
            default: {
                base: {
                    value: "0",
                },
            },
        },
    },
    {
        visible: "globalBgType == 'svg'",
        ai: { name: "bgSvgTranslateY", description: "SVG vertical translate offset." },
        title: "Y",
        id: "globalBgSVGTranslateY",
        format: "[&>svg]:translate-y-{{value}}",
        themeSpacing: {
            mode: "single",
            default: {
                base: {
                    value: "0",
                },
            },
        },
    },
];

export default SVG;
