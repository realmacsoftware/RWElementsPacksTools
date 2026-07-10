const BackgroundGadient = [
    {
        visible: "bgType == 'gradient'",
        title: "Type",
        id: "bgGradientType",
        ai: {
            name: "bgGradientType",
            description: "Gradient type: linear, radial, or conic.",
            values: ["linear", "radial", "conic"],
            visible: "true",
        },
        responsive: false,
        segmented: {
            use: "GradientType",
            default: "linear",
        },
    },
    {
        visible: "bgType == 'gradient' && bgGradientType == 'linear'",
        title: "Direction",
        id: "bgGradientDirection",
        ai: {
            name: "bgGradientDirection",
            description: "Linear gradient direction.",
            visible: "bgGradientType == 'linear'",
        },
        responsive: false,
        select: {
            use: "GradientLinearDirection",
        },
    },
    {
        visible: "bgType == 'gradient' && bgGradientType == 'radial'",
        title: "Position",
        id: "bgGradientRadialPosition",
        ai: {
            name: "bgGradientRadialPosition",
            description: "Radial gradient center position.",
            visible: "bgGradientType == 'radial'",
        },
        responsive: false,
        select: {
            use: "GradientRadialPosition",
        },
    },
    {
        visible: "bgType == 'gradient' && bgGradientType == 'conic'",
        title: "Angle",
        id: "bgGradientConicAngle",
        ai: {
            name: "bgGradientConicAngle",
            description: "Conic gradient start angle.",
            visible: "bgGradientType == 'conic'",
        },
        responsive: false,
        select: {
            use: "GradientConicAngle",
        },
    },
    {
        visible: "bgType == 'gradient'",
        title: "Interpolation",
        id: "bgGradientInterpolation",
        ai: {
            name: "bgGradientInterpolation",
            description: "Gradient color interpolation mode.",
            visible: "true",
        },
        responsive: false,
        select: {
            use: "GradientInterpolation",
        },
    },
    {
        visible: "bgType == 'gradient'",
        heading: {},
        title: "From",
    },
    {
        visible: "bgType == 'gradient'",
        title: "Color",
        id: "gradientFromColor",
        ai: {
            name: "bgGradientFrom",
            description: "Gradient start theme color.",
            visible: "true",
        },
        format: "from-{{value}}",
        themeColor: {
            default: {
                name: "brand",
                brightness: 200,
            },
        },
    },
    {
        visible: "bgType == 'gradient'",
        title: "Opacity",
        id: "gradientFromOpacity",
        ai: {
            name: "bgGradientFromOpacity",
            description: "Gradient start color opacity, 0-100.",
            visible: "true",
        },
        format: "[{{value}}%]",
        responsive: false,
        slider: {
            use: "Slider",
            units: "%",
            default: 100,
        },
    },
    {
        visible: "bgType == 'gradient'",
        title: "Position",
        id: "gradientFromPosition",
        ai: {
            name: "bgGradientFromPosition",
            description: "Gradient start stop position, 0-100.",
            visible: "true",
        },
        format: "from-{{value}}%",
        responsive: false,
        slider: {
            use: "Slider",
            units: "%",
            default: 0,
        },
    },
    {
        visible: "bgType == 'gradient'",
        divider: {},
    },
    {
        visible: "bgType == 'gradient'",
        title: "Add Via",
        id: "wantsGradientVia",
        ai: {
            name: "bgGradientViaEnabled",
            description: "Add a mid-stop (via) color to the gradient.",
            visible: "true",
        },
        switch: {
            default: false,
        },
    },
    {
        visible: "bgType == 'gradient' && wantsGradientVia == 'true'",
        heading: {},
        title: "Via",
    },
    {
        visible: "bgType == 'gradient' && wantsGradientVia == 'true'",
        title: "Color",
        id: "gradientViaColor",
        ai: {
            name: "bgGradientVia",
            description: "Gradient mid-stop theme color.",
            visible: "bgGradientViaEnabled == true",
        },
        format: "via-{{value}}",
        themeColor: {
            default: {
                name: "brand",
                brightness: 400,
            },
        },
    },
    {
        visible: "bgType == 'gradient' && wantsGradientVia == 'true'",
        title: "Opacity",
        id: "gradientViaOpacity",
        ai: {
            name: "bgGradientViaOpacity",
            description: "Gradient mid-stop color opacity, 0-100.",
            visible: "bgGradientViaEnabled == true",
        },
        format: "[{{value}}%]",
        responsive: false,
        slider: {
            use: "Slider",
            units: "%",
            default: 100,
        },
    },
    {
        visible: "bgType == 'gradient' && wantsGradientVia == 'true'",
        title: "Position",
        id: "gradientViaPosition",
        ai: {
            name: "bgGradientViaPosition",
            description: "Gradient mid-stop position, 0-100.",
            visible: "bgGradientViaEnabled == true",
        },
        format: "via-{{value}}%",
        responsive: false,
        slider: {
            default: 50,
            use: "Slider",
            units: "%",
        },
    },
    {
        visible: "bgType == 'gradient'",
        divider: {},
    },
    {
        visible: "bgType == 'gradient'",
        heading: {},
        title: "To",
    },
    {
        visible: "bgType == 'gradient'",
        title: "Color",
        id: "gradientToColor",
        ai: {
            name: "bgGradientTo",
            description: "Gradient end theme color.",
            visible: "true",
        },
        format: "to-{{value}}",
        themeColor: {
            default: {
                name: "brand",
                brightness: 500,
            },
        },
    },
    {
        visible: "bgType == 'gradient'",
        title: "Opacity",
        id: "gradientToOpacity",
        ai: {
            name: "bgGradientToOpacity",
            description: "Gradient end color opacity, 0-100.",
            visible: "true",
        },
        format: "[{{value}}%]",
        responsive: false,
        slider: {
            use: "Slider",
            units: "%",
            default: 100,
        },
    },
    {
        visible: "bgType == 'gradient'",
        title: "Position",
        id: "gradientToPosition",
        ai: {
            name: "bgGradientToPosition",
            description: "Gradient end stop position, 0-100.",
            visible: "true",
        },
        format: "to-{{value}}%",
        responsive: false,
        slider: {
            use: "Slider",
            units: "%",
            default: 100,
        },
    },
];

export default BackgroundGadient;
