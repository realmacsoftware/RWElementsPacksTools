const Gradient = [
  {
    visible: "globalControlTypeOverlay == 'static' && globalOverlayType == 'gradient' || (globalControlTypeOverlay == 'hover' && globalOverlayState == 'start' && globalOverlayType == 'gradient')",
    ai: { name: "overlayGradientType", description: "Gradient type: linear, radial, or conic.", values: ["linear", "radial", "conic"], visible: "overlay == 'static' && overlayStyle == 'gradient'" },
    title: "Type",
    id: "globalOverlayGradientType",
    responsive: false,
    segmented: {
      use: "GradientType",
      default: "linear",
    },
  },
  {
    visible: "((globalControlTypeOverlay == 'static' && globalOverlayType == 'gradient') || (globalControlTypeOverlay == 'hover' && globalOverlayState == 'start' && globalOverlayType == 'gradient')) && globalOverlayGradientType == 'linear'",
    ai: { name: "overlayGradientDirection", description: "Linear gradient direction.", visible: "overlay == 'static' && overlayStyle == 'gradient'" },
    title: "Direction",
    id: "globalOverlayGradientDirection",
    responsive: false,
    select: {
      use: "GradientLinearDirection",
    },
  },
  {
    visible: "((globalControlTypeOverlay == 'static' && globalOverlayType == 'gradient') || (globalControlTypeOverlay == 'hover' && globalOverlayState == 'start' && globalOverlayType == 'gradient')) && globalOverlayGradientType == 'radial'",
    ai: { name: "overlayGradientRadialPosition", description: "Radial gradient center position.", visible: "overlay == 'static' && overlayStyle == 'gradient' && overlayGradientType == 'radial'" },
    title: "Position",
    id: "globalOverlayGradientRadialPosition",
    responsive: false,
    select: {
      use: "GradientRadialPosition",
    },
  },
  {
    visible: "((globalControlTypeOverlay == 'static' && globalOverlayType == 'gradient') || (globalControlTypeOverlay == 'hover' && globalOverlayState == 'start' && globalOverlayType == 'gradient')) && globalOverlayGradientType == 'conic'",
    ai: { name: "overlayGradientConicAngle", description: "Conic gradient start angle.", visible: "overlay == 'static' && overlayStyle == 'gradient' && overlayGradientType == 'conic'" },
    title: "Angle",
    id: "globalOverlayGradientConicAngle",
    responsive: false,
    select: {
      use: "GradientConicAngle",
    },
  },
  {
    visible: "globalControlTypeOverlay == 'static' && globalOverlayType == 'gradient' || (globalControlTypeOverlay == 'hover' && globalOverlayState == 'start' && globalOverlayType == 'gradient')",
    ai: { name: "overlayGradientInterpolation", description: "Gradient color interpolation mode.", visible: "overlay == 'static' && overlayStyle == 'gradient'" },
    title: "Interpolation",
    id: "globalOverlayGradientInterpolation",
    responsive: false,
    select: {
      use: "GradientInterpolation",
    },
  },
  {
    visible: "globalControlTypeOverlay == 'static' && globalOverlayType == 'gradient' || (globalControlTypeOverlay == 'hover' && globalOverlayState == 'start' && globalOverlayType == 'gradient')",
    heading: {},
    title: "From",
  },
  {
    visible: "globalControlTypeOverlay == 'static' && globalOverlayType == 'gradient' || (globalControlTypeOverlay == 'hover' && globalOverlayState == 'start' && globalOverlayType == 'gradient')",
    ai: { name: "overlayGradientFrom", description: "Gradient start theme color.", visible: "overlay == 'static' && overlayStyle == 'gradient'" },
    title: "Color",
    id: "globalOverlayGradientFromColor",
    format: "from-{{value}}",
    themeColor: {
      default: {
        name: "brand",
        brightness: 200,
      },
    },
  },
  {
    visible: "globalControlTypeOverlay == 'static' && globalOverlayType == 'gradient' || (globalControlTypeOverlay == 'hover' && globalOverlayState == 'start' && globalOverlayType == 'gradient')",
    ai: { name: "overlayGradientFromOpacity", description: "Gradient start color opacity, 0-100.", visible: "overlay == 'static' && overlayStyle == 'gradient'" },
    title: "Opacity",
    id: "globalOverlayGradientFromOpacity",
    format: "[{{value}}%]",
    responsive: false,
    slider: {
      use: "Slider",
      units: "%",
      default: 100,
    },
  },
  {
    visible: "globalControlTypeOverlay == 'static' && globalOverlayType == 'gradient' || (globalControlTypeOverlay == 'hover' && globalOverlayState == 'start' && globalOverlayType == 'gradient')",
    ai: { name: "overlayGradientFromPosition", description: "Gradient start stop position, 0-100.", visible: "overlay == 'static' && overlayStyle == 'gradient'" },
    title: "Position",
    id: "globalOverlayGradientFromPosition",
    format: "from-{{value}}%",
    responsive: false,
    slider: {
      use: "Slider",
      units: "%",
      default: 0,
    },
  },
  {
    visible: "globalControlTypeOverlay == 'static' && globalOverlayType == 'gradient' || (globalControlTypeOverlay == 'hover' && globalOverlayState == 'start' && globalOverlayType == 'gradient')",
    divider: {},
  },
  {
    visible: "globalControlTypeOverlay == 'static' && globalOverlayType == 'gradient' || (globalControlTypeOverlay == 'hover' && globalOverlayState == 'start' && globalOverlayType == 'gradient')",
    ai: { name: "overlayGradientViaEnabled", description: "Add a mid-stop (via) color to the gradient.", visible: "overlay == 'static' && overlayStyle == 'gradient'" },
    title: "Add Via",
    id: "globalOverlayGradientViaEnabled",
    switch: {
      default: false,
    },
  },
  {
    visible: "globalControlTypeOverlay == 'static' && globalOverlayType == 'gradient' || (globalControlTypeOverlay == 'hover' && globalOverlayState == 'start' && globalOverlayType == 'gradient') && globalOverlayGradientViaEnabled == true",
    heading: {},
    title: "Via",
  },
  {
    visible: "globalControlTypeOverlay == 'static' && globalOverlayType == 'gradient' || (globalControlTypeOverlay == 'hover' && globalOverlayState == 'start' && globalOverlayType == 'gradient') && globalOverlayGradientViaEnabled == true",
    ai: { name: "overlayGradientVia", description: "Gradient mid-stop theme color.", visible: "overlay == 'static' && overlayStyle == 'gradient' && overlayGradientViaEnabled == true" },
    title: "Color",
    id: "globalOverlayGradientViaColor",
    format: "via-{{value}}",
    themeColor: {
      default: {
        name: "brand",
        brightness: 400,
      },
    },
  },
  {
    visible: "globalControlTypeOverlay == 'static' && globalOverlayType == 'gradient' || (globalControlTypeOverlay == 'hover' && globalOverlayState == 'start' && globalOverlayType == 'gradient') && globalOverlayGradientViaEnabled == true",
    ai: { name: "overlayGradientViaOpacity", description: "Gradient mid-stop color opacity, 0-100.", visible: "overlay == 'static' && overlayStyle == 'gradient' && overlayGradientViaEnabled == true" },
    title: "Opacity",
    id: "globalOverlayGradientViaOpacity",
    format: "[{{value}}%]",
    responsive: false,
    slider: {
      use: "Slider",
      units: "%",
      default: 100,
    },
  },
  {
    visible: "globalControlTypeOverlay == 'static' && globalOverlayType == 'gradient' || (globalControlTypeOverlay == 'hover' && globalOverlayState == 'start' && globalOverlayType == 'gradient') && globalOverlayGradientViaEnabled == true",
    ai: { name: "overlayGradientViaPosition", description: "Gradient mid-stop position, 0-100.", visible: "overlay == 'static' && overlayStyle == 'gradient' && overlayGradientViaEnabled == true" },
    title: "Position",
    id: "globalOverlayGradientViaPosition",
    format: "via-{{value}}%",
    responsive: false,
    slider: {
      default: 50,
      use: "Slider",
      units: "%",
    },
  },
  {
    visible: "globalControlTypeOverlay == 'static' && globalOverlayType == 'gradient' || (globalControlTypeOverlay == 'hover' && globalOverlayState == 'start' && globalOverlayType == 'gradient')",
    divider: {},
  },
  {
    visible: "globalControlTypeOverlay == 'static' && globalOverlayType == 'gradient' || (globalControlTypeOverlay == 'hover' && globalOverlayState == 'start' && globalOverlayType == 'gradient')",
    heading: {},
    title: "To",
  },
  {
    visible: "globalControlTypeOverlay == 'static' && globalOverlayType == 'gradient' || (globalControlTypeOverlay == 'hover' && globalOverlayState == 'start' && globalOverlayType == 'gradient')",
    ai: { name: "overlayGradientTo", description: "Gradient end theme color.", visible: "overlay == 'static' && overlayStyle == 'gradient'" },
    title: "Color",
    id: "globalOverlayGradientToColor",
    format: "to-{{value}}",
    themeColor: {
      default: {
        name: "brand",
        brightness: 500,
      },
    },
  },
  {
    visible: "globalControlTypeOverlay == 'static' && globalOverlayType == 'gradient' || (globalControlTypeOverlay == 'hover' && globalOverlayState == 'start' && globalOverlayType == 'gradient')",
    ai: { name: "overlayGradientToOpacity", description: "Gradient end color opacity, 0-100.", visible: "overlay == 'static' && overlayStyle == 'gradient'" },
    title: "Opacity",
    id: "globalOverlayGradientToOpacity",
    format: "[{{value}}%]",
    responsive: false,
    slider: {
      use: "Slider",
      units: "%",
      default: 100,
    },
  },
  {
    visible: "globalControlTypeOverlay == 'static' && globalOverlayType == 'gradient' || (globalControlTypeOverlay == 'hover' && globalOverlayState == 'start' && globalOverlayType == 'gradient')",
    ai: { name: "overlayGradientToPosition", description: "Gradient end stop position, 0-100.", visible: "overlay == 'static' && overlayStyle == 'gradient'" },
    title: "Position",
    id: "globalOverlayGradientToPosition",
    format: "to-{{value}}%",
    responsive: false,
    slider: {
      use: "Slider",
      units: "%",
      default: 100,
    },
  },
  {
    visible: "(globalControlTypeOverlay == 'hover' && globalOverlayState == 'end' && globalOverlayType == 'gradient')",
    ai: { name: "overlayGradientTypeHover", description: "Hover-state gradient type: linear, radial, or conic.", values: ["linear", "radial", "conic"], visible: "overlay == 'hover' && overlayStyle == 'gradient'" },
    title: "Type",
    id: "globalOverlayGradientTypeEnd",
    responsive: false,
    segmented: {
      use: "GradientType",
      default: "linear",
    },
  },
  {
    visible: "(globalControlTypeOverlay == 'hover' && globalOverlayState == 'end' && globalOverlayType == 'gradient') && globalOverlayGradientTypeEnd == 'linear'",
    ai: { name: "overlayGradientDirectionHover", description: "Hover-state linear gradient direction.", visible: "overlay == 'hover' && overlayStyle == 'gradient' && overlayGradientTypeHover == 'linear'" },
    title: "Direction",
    id: "globalOverlayGradientDirectionEnd",
    responsive: false,
    select: {
      use: "GradientLinearDirection",
    },
  },
  {
    visible: "(globalControlTypeOverlay == 'hover' && globalOverlayState == 'end' && globalOverlayType == 'gradient') && globalOverlayGradientTypeEnd == 'radial'",
    ai: { name: "overlayGradientRadialPositionHover", description: "Hover-state radial gradient center position.", visible: "overlay == 'hover' && overlayStyle == 'gradient' && overlayGradientTypeHover == 'radial'" },
    title: "Position",
    id: "globalOverlayGradientRadialPositionEnd",
    responsive: false,
    select: {
      use: "GradientRadialPosition",
    },
  },
  {
    visible: "(globalControlTypeOverlay == 'hover' && globalOverlayState == 'end' && globalOverlayType == 'gradient') && globalOverlayGradientTypeEnd == 'conic'",
    ai: { name: "overlayGradientConicAngleHover", description: "Hover-state conic gradient start angle.", visible: "overlay == 'hover' && overlayStyle == 'gradient' && overlayGradientTypeHover == 'conic'" },
    title: "Angle",
    id: "globalOverlayGradientConicAngleEnd",
    responsive: false,
    select: {
      use: "GradientConicAngle",
    },
  },
  {
    visible: "(globalControlTypeOverlay == 'hover' && globalOverlayState == 'end' && globalOverlayType == 'gradient')",
    ai: { name: "overlayGradientInterpolationHover", description: "Hover-state gradient color interpolation mode.", visible: "overlay == 'hover' && overlayStyle == 'gradient'" },
    title: "Interpolation",
    id: "globalOverlayGradientInterpolationEnd",
    responsive: false,
    select: {
      use: "GradientInterpolation",
    },
  },
  {
    visible: "(globalControlTypeOverlay == 'hover' && globalOverlayState == 'end' && globalOverlayType == 'gradient')",
    title: "From",
    heading: {}
  },
  {
    visible: "(globalControlTypeOverlay == 'hover' && globalOverlayState == 'end' && globalOverlayType == 'gradient')",
    ai: { name: "overlayGradientFromHover", description: "Hover-state gradient start theme color.", visible: "overlay == 'hover' && overlayStyle == 'gradient'" },
    title: "Color",
    id: "globalOverlayGradientFromColorEnd",
    format: "from-{{value}}",
    themeColor: {
      default: {
        name: "brand",
        brightness: 200,
      },
    },
  },
  {
    visible: "(globalControlTypeOverlay == 'hover' && globalOverlayState == 'end' && globalOverlayType == 'gradient')",
    ai: { name: "overlayGradientFromOpacityHover", description: "Hover-state gradient start color opacity, 0-100.", visible: "overlay == 'hover' && overlayStyle == 'gradient'" },
    title: "Opacity",
    id: "globalOverlayGradientFromOpacityEnd",
    format: "[{{value}}%]",
    responsive: false,
    slider: {
      use: "Slider",
      units: "%",
      default: 100,
    },
  },
  {
    visible: "(globalControlTypeOverlay == 'hover' && globalOverlayState == 'end' && globalOverlayType == 'gradient')",
    ai: { name: "overlayGradientFromPositionHover", description: "Hover-state gradient start stop position, 0-100.", visible: "overlay == 'hover' && overlayStyle == 'gradient'" },
    title: "Position",
    id: "globalOverlayGradientFromPositionEnd",
    format: "from-{{value}}%",
    responsive: false,
    slider: {
      use: "Slider",
      units: "%",
      default: 0,
    },
  },
  {
    visible: "(globalControlTypeOverlay == 'hover' && globalOverlayState == 'end' && globalOverlayType == 'gradient')",
    divider: {},
  },
  {
    visible: "(globalControlTypeOverlay == 'hover' && globalOverlayState == 'end' && globalOverlayType == 'gradient')",
    ai: { name: "overlayGradientViaEnabledHover", description: "Add a mid-stop (via) color to the hover-state gradient.", visible: "overlay == 'hover' && overlayStyle == 'gradient'" },
    title: "Add Via",
    id: "globalOverlayGradientViaEnabledEnd",
    switch: {
      default: false,
    },
  },
  {
    visible: "(globalControlTypeOverlay == 'hover' && globalOverlayState == 'end' && globalOverlayType == 'gradient') && globalOverlayGradientViaEnabledEnd == true",
    heading: {},
    title: "Via",
  },
  {
    visible: "(globalControlTypeOverlay == 'hover' && globalOverlayState == 'end' && globalOverlayType == 'gradient') && globalOverlayGradientViaEnabledEnd == true",
    ai: { name: "overlayGradientViaHover", description: "Hover-state gradient mid-stop theme color.", visible: "overlay == 'hover' && overlayStyle == 'gradient' && overlayGradientViaEnabledHover == true" },
    title: "Color",
    id: "globalOverlayGradientViaColorEnd",
    format: "via-{{value}}",
    themeColor: {
      default: {
        name: "brand",
        brightness: 400,
      },
    },
  },
  {
    visible: "(globalControlTypeOverlay == 'hover' && globalOverlayState == 'end' && globalOverlayType == 'gradient') && globalOverlayGradientViaEnabledEnd == true",
    ai: { name: "overlayGradientViaOpacityHover", description: "Hover-state gradient mid-stop color opacity, 0-100.", visible: "overlay == 'hover' && overlayStyle == 'gradient' && overlayGradientViaEnabledHover == true" },
    title: "Opacity",
    id: "globalOverlayGradientViaOpacityEnd",
    format: "[{{value}}%]",
    responsive: false,
    slider: {
      use: "Slider",
      units: "%",
      default: 100,
    },
  },
  {
    visible: "(globalControlTypeOverlay == 'hover' && globalOverlayState == 'end' && globalOverlayType == 'gradient') && globalOverlayGradientViaEnabledEnd == true",
    ai: { name: "overlayGradientViaPositionHover", description: "Hover-state gradient mid-stop position, 0-100.", visible: "overlay == 'hover' && overlayStyle == 'gradient' && overlayGradientViaEnabledHover == true" },
    title: "Position",
    id: "globalOverlayGradientViaPositionEnd",
    format: "via-{{value}}%",
    responsive: false,
    slider: {
      default: 50,
      use: "Slider",
      units: "%",
    },
  },
  {
    visible: "(globalControlTypeOverlay == 'hover' && globalOverlayState == 'end' && globalOverlayType == 'gradient')",
    divider: {},
  },
  {
    visible: "(globalControlTypeOverlay == 'hover' && globalOverlayState == 'end' && globalOverlayType == 'gradient')",
    heading: {},
    title: "To",
  },
  {
    visible: "(globalControlTypeOverlay == 'hover' && globalOverlayState == 'end' && globalOverlayType == 'gradient')",
    ai: { name: "overlayGradientToHover", description: "Hover-state gradient end theme color.", visible: "overlay == 'hover' && overlayStyle == 'gradient'" },
    title: "Color",
    id: "globalOverlayGradientToColorEnd",
    format: "to-{{value}}",
    themeColor: {
      default: {
        name: "brand",
        brightness: 500,
      },
    },
  },
  {
    visible: "(globalControlTypeOverlay == 'hover' && globalOverlayState == 'end' && globalOverlayType == 'gradient')",
    ai: { name: "overlayGradientToOpacityHover", description: "Hover-state gradient end color opacity, 0-100.", visible: "overlay == 'hover' && overlayStyle == 'gradient'" },
    title: "Opacity",
    id: "globalOverlayGradientToOpacityEnd",
    format: "[{{value}}%]",
    responsive: false,
    slider: {
      use: "Slider",
      units: "%",
      default: 100,
    },
  },
  {
    visible: "(globalControlTypeOverlay == 'hover' && globalOverlayState == 'end' && globalOverlayType == 'gradient')",
    ai: { name: "overlayGradientToPositionHover", description: "Hover-state gradient end stop position, 0-100.", visible: "overlay == 'hover' && overlayStyle == 'gradient'" },
    title: "Position",
    id: "globalOverlayGradientToPositionEnd",
    format: "to-{{value}}%",
    responsive: false,
    slider: {
      use: "Slider",
      units: "%",
      default: 100,
    },
  },
];

export default Gradient;
