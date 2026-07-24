const GradientContainer = [
  {
    visible: "globalControlTypeBg == 'static' && globalBgType == 'gradient' || (globalControlTypeBg == 'hover' && globalBgState == 'start' && globalBgType == 'gradient')",
    ai: { name: "bgGradientType", description: "Gradient type: linear, radial, or conic.", values: ["linear", "radial", "conic"], visible: "bg == 'static' && bgStyle == 'gradient'" },
    title: "Type",
    id: "globalBgGradientType",
    responsive: false,
    segmented: {
      use: "GradientType",
      default: "linear",
    },
  },
  {
    visible: "((globalControlTypeBg == 'static' && globalBgType == 'gradient') || (globalControlTypeBg == 'hover' && globalBgState == 'start' && globalBgType == 'gradient')) && globalBgGradientType == 'linear'",
    ai: { name: "bgGradientDirection", description: "Linear gradient direction.", visible: "bg == 'static' && bgStyle == 'gradient'" },
    title: "Direction",
    id: "globalBgGradientDirection",
    responsive: false,
    select: {
      use: "GradientLinearDirection",
    },
  },
  {
    visible: "((globalControlTypeBg == 'static' && globalBgType == 'gradient') || (globalControlTypeBg == 'hover' && globalBgState == 'start' && globalBgType == 'gradient')) && globalBgGradientType == 'radial'",
    ai: { name: "bgGradientRadialPosition", description: "Radial gradient center position.", visible: "bg == 'static' && bgStyle == 'gradient' && bgGradientType == 'radial'" },
    title: "Position",
    id: "globalBgGradientRadialPosition",
    responsive: false,
    select: {
      use: "GradientRadialPosition",
    },
  },
  {
    visible: "((globalControlTypeBg == 'static' && globalBgType == 'gradient') || (globalControlTypeBg == 'hover' && globalBgState == 'start' && globalBgType == 'gradient')) && globalBgGradientType == 'conic'",
    ai: { name: "bgGradientConicAngle", description: "Conic gradient start angle.", visible: "bg == 'static' && bgStyle == 'gradient' && bgGradientType == 'conic'" },
    title: "Angle",
    id: "globalBgGradientConicAngle",
    responsive: false,
    select: {
      use: "GradientConicAngle",
    },
  },
  {
    visible: "globalControlTypeBg == 'static' && globalBgType == 'gradient' || (globalControlTypeBg == 'hover' && globalBgState == 'start' && globalBgType == 'gradient')",
    ai: { name: "bgGradientInterpolation", description: "Gradient color interpolation mode.", visible: "bg == 'static' && bgStyle == 'gradient'" },
    title: "Interpolation",
    id: "globalBgGradientInterpolation",
    responsive: false,
    select: {
      use: "GradientInterpolation",
    },
  },
  {
    visible: "globalControlTypeBg == 'static' && globalBgType == 'gradient' || (globalControlTypeBg == 'hover' && globalBgState == 'start' && globalBgType == 'gradient')",
    heading: {},
    title: "From",
  },
  {
    visible: "globalControlTypeBg == 'static' && globalBgType == 'gradient' || (globalControlTypeBg == 'hover' && globalBgState == 'start' && globalBgType == 'gradient')",
    ai: { name: "bgGradientFrom", description: "Gradient start theme color.", visible: "bg == 'static' && bgStyle == 'gradient'" },
    title: "Color",
    id: "globalBgGradientFromColor",
    format: "from-{{value}}/(--bgGradientFromOpacity)",
    themeColor: {
      default: {
        name: "brand",
        brightness: 200,
      },
    },
  },
  {
    visible: "globalControlTypeBg == 'static' && globalBgType == 'gradient' || (globalControlTypeBg == 'hover' && globalBgState == 'start' && globalBgType == 'gradient')",
    ai: { name: "bgGradientFromOpacity", description: "Gradient start color opacity, 0-100.", visible: "bg == 'static' && bgStyle == 'gradient'" },
    title: "Opacity",
    id: "globalBgGradientFromOpacity",
    format: "[--bgGradientFromOpacity:{{value}}%]",
    responsive: false,
    slider: {
      use: "Slider",
      units: "%",
      default: 100,
    },
  },
  {
    visible: "globalControlTypeBg == 'static' && globalBgType == 'gradient' || (globalControlTypeBg == 'hover' && globalBgState == 'start' && globalBgType == 'gradient')",
    ai: { name: "bgGradientFromPosition", description: "Gradient start stop position, 0-100.", visible: "bg == 'static' && bgStyle == 'gradient'" },
    title: "Position",
    id: "globalBgGradientFromPosition",
    format: "from-{{value}}%",
    responsive: false,
    slider: {
      use: "Slider",
      units: "%",
      default: 0,
    },
  },
  {
    visible: "globalControlTypeBg == 'static' && globalBgType == 'gradient' || (globalControlTypeBg == 'hover' && globalBgState == 'start' && globalBgType == 'gradient')",
    divider: {},
  },
  {
    visible: "globalControlTypeBg == 'static' && globalBgType == 'gradient' || (globalControlTypeBg == 'hover' && globalBgState == 'start' && globalBgType == 'gradient')",
    ai: { name: "bgGradientViaEnabled", description: "Add a mid-stop (via) color to the gradient.", visible: "bg == 'static' && bgStyle == 'gradient'" },
    title: "Add Via",
    id: "globalBgGradientViaEnabled",
    switch: {
      default: false,
    },
  },
  {
    visible: "globalControlTypeBg == 'static' && globalBgType == 'gradient' || (globalControlTypeBg == 'hover' && globalBgState == 'start' && globalBgType == 'gradient') && globalBgGradientViaEnabled == true",
    heading: {},
    title: "Via",
  },
  {
    visible: "globalControlTypeBg == 'static' && globalBgType == 'gradient' || (globalControlTypeBg == 'hover' && globalBgState == 'start' && globalBgType == 'gradient') && globalBgGradientViaEnabled == true",
    ai: { name: "bgGradientVia", description: "Gradient mid-stop theme color.", visible: "bg == 'static' && bgStyle == 'gradient' && bgGradientViaEnabled == true" },
    title: "Color",
    id: "globalBgGradientViaColor",
    format: "via-{{value}}/(--bgGradientViaOpacity)",
    themeColor: {
      default: {
        name: "brand",
        brightness: 400,
      },
    },
  },
  {
    visible: "globalControlTypeBg == 'static' && globalBgType == 'gradient' || (globalControlTypeBg == 'hover' && globalBgState == 'start' && globalBgType == 'gradient') && globalBgGradientViaEnabled == true",
    ai: { name: "bgGradientViaOpacity", description: "Gradient mid-stop color opacity, 0-100.", visible: "bg == 'static' && bgStyle == 'gradient' && bgGradientViaEnabled == true" },
    title: "Opacity",
    id: "globalBgGradientViaOpacity",
    format: "[--bgGradientViaOpacity:{{value}}%]",
    responsive: false,
    slider: {
      use: "Slider",
      units: "%",
      default: 100,
    },
  },
  {
    visible: "globalControlTypeBg == 'static' && globalBgType == 'gradient' || (globalControlTypeBg == 'hover' && globalBgState == 'start' && globalBgType == 'gradient') && globalBgGradientViaEnabled == true",
    ai: { name: "bgGradientViaPosition", description: "Gradient mid-stop position, 0-100.", visible: "bg == 'static' && bgStyle == 'gradient' && bgGradientViaEnabled == true" },
    title: "Position",
    id: "globalBgGradientViaPosition",
    format: "via-{{value}}%",
    responsive: false,
    slider: {
      default: 50,
      use: "Slider",
      units: "%",
    },
  },
  {
    visible: "globalControlTypeBg == 'static' && globalBgType == 'gradient' || (globalControlTypeBg == 'hover' && globalBgState == 'start' && globalBgType == 'gradient')",
    divider: {},
  },
  {
    visible: "globalControlTypeBg == 'static' && globalBgType == 'gradient' || (globalControlTypeBg == 'hover' && globalBgState == 'start' && globalBgType == 'gradient')",
    heading: {},
    title: "To",
  },
  {
    visible: "globalControlTypeBg == 'static' && globalBgType == 'gradient' || (globalControlTypeBg == 'hover' && globalBgState == 'start' && globalBgType == 'gradient')",
    ai: { name: "bgGradientTo", description: "Gradient end theme color.", visible: "bg == 'static' && bgStyle == 'gradient'" },
    title: "Color",
    id: "globalBgGradientToColor",
    format: "to-{{value}}/(--bgGradientToOpacity)",
    themeColor: {
      default: {
        name: "brand",
        brightness: 500,
      },
    },
  },
  {
    visible: "globalControlTypeBg == 'static' && globalBgType == 'gradient' || (globalControlTypeBg == 'hover' && globalBgState == 'start' && globalBgType == 'gradient')",
    ai: { name: "bgGradientToOpacity", description: "Gradient end color opacity, 0-100.", visible: "bg == 'static' && bgStyle == 'gradient'" },
    title: "Opacity",
    id: "globalBgGradientToOpacity",
    format: "[--bgGradientToOpacity:{{value}}%]",
    responsive: false,
    slider: {
      use: "Slider",
      units: "%",
      default: 100,
    },
  },
  {
    visible: "globalControlTypeBg == 'static' && globalBgType == 'gradient' || (globalControlTypeBg == 'hover' && globalBgState == 'start' && globalBgType == 'gradient')",
    ai: { name: "bgGradientToPosition", description: "Gradient end stop position, 0-100.", visible: "bg == 'static' && bgStyle == 'gradient'" },
    title: "Position",
    id: "globalBgGradientToPosition",
    format: "to-{{value}}%",
    responsive: false,
    slider: {
      use: "Slider",
      units: "%",
      default: 100,
    },
  },
  {
    visible: "(globalControlTypeBg == 'hover' && globalBgState == 'end' && globalBgType == 'gradient')",
    ai: { name: "bgGradientTypeHover", description: "Hover-state gradient type: linear, radial, or conic.", values: ["linear", "radial", "conic"], visible: "bg == 'hover' && bgStyle == 'gradient'" },
    title: "Type",
    id: "globalBgGradientTypeEnd",
    responsive: false,
    segmented: {
      use: "GradientType",
      default: "linear",
    },
  },
  {
    visible: "(globalControlTypeBg == 'hover' && globalBgState == 'end' && globalBgType == 'gradient') && globalBgGradientTypeEnd == 'linear'",
    ai: { name: "bgGradientDirectionHover", description: "Hover-state linear gradient direction.", visible: "bg == 'hover' && bgStyle == 'gradient'" },
    title: "Direction",
    id: "globalBgGradientDirectionEnd",
    responsive: false,
    format: "hover:{{value}}",
    select: {
      use: "GradientLinearDirection",
    },
  },
  {
    visible: "(globalControlTypeBg == 'hover' && globalBgState == 'end' && globalBgType == 'gradient') && globalBgGradientTypeEnd == 'radial'",
    ai: { name: "bgGradientRadialPositionHover", description: "Hover-state radial gradient center position.", visible: "bg == 'hover' && bgStyle == 'gradient' && bgGradientTypeHover == 'radial'" },
    title: "Position",
    id: "globalBgGradientRadialPositionEnd",
    responsive: false,
    format: "hover:{{value}}",
    select: {
      use: "GradientRadialPosition",
    },
  },
  {
    visible: "(globalControlTypeBg == 'hover' && globalBgState == 'end' && globalBgType == 'gradient') && globalBgGradientTypeEnd == 'conic'",
    ai: { name: "bgGradientConicAngleHover", description: "Hover-state conic gradient start angle.", visible: "bg == 'hover' && bgStyle == 'gradient' && bgGradientTypeHover == 'conic'" },
    title: "Angle",
    id: "globalBgGradientConicAngleEnd",
    responsive: false,
    format: "hover:{{value}}",
    select: {
      use: "GradientConicAngle",
    },
  },
  {
    visible: "(globalControlTypeBg == 'hover' && globalBgState == 'end' && globalBgType == 'gradient')",
    ai: { name: "bgGradientInterpolationHover", description: "Hover-state gradient color interpolation mode.", visible: "bg == 'hover' && bgStyle == 'gradient'" },
    title: "Interpolation",
    id: "globalBgGradientInterpolationEnd",
    responsive: false,
    select: {
      use: "GradientInterpolation",
    },
  },
  {
    visible: "(globalControlTypeBg == 'hover' && globalBgState == 'end' && globalBgType == 'gradient')",
    title: "From",
    heading: {}
  },
  {
    visible: "(globalControlTypeBg == 'hover' && globalBgState == 'end' && globalBgType == 'gradient')",
    ai: { name: "bgGradientFromHover", description: "Hover-state gradient start theme color.", visible: "bg == 'hover' && bgStyle == 'gradient'" },
    title: "Color",
    id: "globalBgGradientFromColorEnd",
    format: "hover:from-{{value}}/(--bgGradientFromOpacityEnd)",
    themeColor: {
      default: {
        name: "brand",
        brightness: 200,
      },
    },
  },
  {
    visible: "(globalControlTypeBg == 'hover' && globalBgState == 'end' && globalBgType == 'gradient')",
    ai: { name: "bgGradientFromOpacityHover", description: "Hover-state gradient start color opacity, 0-100.", visible: "bg == 'hover' && bgStyle == 'gradient'" },
    title: "Opacity",
    id: "globalBgGradientFromOpacityEnd",
    format: "hover:[--bgGradientFromOpacityEnd:{{value}}%]",
    responsive: false,
    slider: {
      use: "Slider",
      units: "%",
      default: 100,
    },
  },
  {
    visible: "(globalControlTypeBg == 'hover' && globalBgState == 'end' && globalBgType == 'gradient')",
    divider: {},
  },
  {
    visible: "(globalControlTypeBg == 'hover' && globalBgState == 'end' && globalBgType == 'gradient')",
    ai: { name: "bgGradientViaEnabledHover", description: "Add a mid-stop (via) color to the hover-state gradient.", visible: "bg == 'hover' && bgStyle == 'gradient'" },
    title: "Add Via",
    id: "globalBgGradientViaEnabledEnd",
    switch: {
      default: false,
    },
  },
  {
    visible: "(globalControlTypeBg == 'hover' && globalBgState == 'end' && globalBgType == 'gradient') && globalBgGradientViaEnabledEnd == true",
    heading: {},
    title: "Via",
  },
  {
    visible: "(globalControlTypeBg == 'hover' && globalBgState == 'end' && globalBgType == 'gradient') && globalBgGradientViaEnabledEnd == true",
    ai: { name: "bgGradientViaHover", description: "Hover-state gradient mid-stop theme color.", visible: "bg == 'hover' && bgStyle == 'gradient' && bgGradientViaEnabledHover == true" },
    title: "Color",
    id: "globalBgGradientViaColorEnd",
    format: "hover:via-{{value}}/(--bgGradientViaOpacityEnd)",
    themeColor: {
      default: {
        name: "brand",
        brightness: 400,
      },
    },
  },
  {
    visible: "(globalControlTypeBg == 'hover' && globalBgState == 'end' && globalBgType == 'gradient') && globalBgGradientViaEnabledEnd == true",
    ai: { name: "bgGradientViaOpacityHover", description: "Hover-state gradient mid-stop color opacity, 0-100.", visible: "bg == 'hover' && bgStyle == 'gradient' && bgGradientViaEnabledHover == true" },
    title: "Opacity",
    id: "globalBgGradientViaOpacityEnd",
    format: "hover:[--bgGradientViaOpacityEnd:{{value}}%]",
    responsive: false,
    slider: {
      use: "Slider",
      units: "%",
      default: 100,
    },
  },
  {
    visible: "(globalControlTypeBg == 'hover' && globalBgState == 'end' && globalBgType == 'gradient')",
    divider: {},
  },
  {
    visible: "(globalControlTypeBg == 'hover' && globalBgState == 'end' && globalBgType == 'gradient')",
    heading: {},
    title: "To",
  },
  {
    visible: "(globalControlTypeBg == 'hover' && globalBgState == 'end' && globalBgType == 'gradient')",
    ai: { name: "bgGradientToHover", description: "Hover-state gradient end theme color.", visible: "bg == 'hover' && bgStyle == 'gradient'" },
    title: "Color",
    id: "globalBgGradientToColorEnd",
    format: "hover:to-{{value}}/(--bgGradientToOpacityEnd)",
    themeColor: {
      default: {
        name: "brand",
        brightness: 500,
      },
    },
  },
  {
    visible: "(globalControlTypeBg == 'hover' && globalBgState == 'end' && globalBgType == 'gradient')",
    ai: { name: "bgGradientToOpacityHover", description: "Hover-state gradient end color opacity, 0-100.", visible: "bg == 'hover' && bgStyle == 'gradient'" },
    title: "Opacity",
    id: "globalBgGradientToOpacityEnd",
    format: "hover:[--bgGradientToOpacityEnd:{{value}}%]",
    responsive: false,
    slider: {
      use: "Slider",
      units: "%",
      default: 100,
    },
  },
];

export default GradientContainer;
