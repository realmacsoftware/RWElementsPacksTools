const SizingContainer = [
  {
    title: "Size",
    heading: {}
  },
  {
    title: "Width",
    id: "globalWidthType",
    ai: { name: "width", description: "Width mode: 'auto', 'full', 'screen', 'container' (breakpoint), or 'theme' (use widthSize)." },
    responsive: false,
    select: {
      default: "full",
      items: [
        {
          title: "Auto",
          value: "auto"
        },
        {
          title: "Full",
          value: "full"
        },
        {
          title: "Screen",
          value: "screen"
        },
        {
          title: "Breakpoint",
          value: "container"
        },
        {
          title: "Theme Spacing",
          value: "theme"
        }
      ]
    }
  },
  {
    visible: "globalWidthType == 'theme'",
    globalControl: "Width",
    title: "",
    ai: { name: "widthSize", description: "Width theme-size token, used when width is 'theme'." }
  },
  {
    title: "Height",
    id: "globalHeightType",
    ai: { name: "height", description: "Height mode: 'auto', 'full', 'screen', or 'theme' (use heightSize)." },
    responsive: false,
    select: {
      default: "auto",
      items: [
        {
          title: "Auto",
          value: "auto"
        },
        {
          title: "Full",
          value: "full"
        },
        {
          title: "Screen",
          value: "screen"
        },
        {
          title: "Theme",
          value: "theme"
        }
      ]
    }
  },
  {
    visible: "globalHeightType == 'theme'",
    globalControl: "Height",
    title: "",
    ai: { name: "heightSize", description: "Height theme-size token, used when height is 'theme'." }
  },
  {
    divider: {}
  },
  {
    title: "Min & Max Settings",
    heading: {}
  },
  {
    information: {},
    title: "Enable this to set both min and max height and width settings."
  },
  {
    title: "Enable",
    id: "globalSizingMinMaxEnabled",
    ai: { name: "minMaxEnabled", description: "Enable explicit min/max width and height constraints." },
    switch: {
      default: false
    }
  },
  {
    visible: "globalSizingMinMaxEnabled == true",
    title: "Width",
    heading: {}
  },
  {
    visible: "globalSizingMinMaxEnabled == true",
    title: "Min",
    globalControl: "MinWidth"
  },
  {
    visible: "globalSizingMinMaxEnabled == true",
    title: "Max",
    globalControl: "MaxWidth"
  },
  {
    visible: "globalSizingMinMaxEnabled == true",
    title: "Height",
    heading: {}
  },
  {
    visible: "globalSizingMinMaxEnabled == true",
    title: "Min",
    globalControl: "MinHeight"
  },
  {
    visible: "globalSizingMinMaxEnabled == true",
    title: "Max",
    globalControl: "MaxHeight"
  }
]

export default SizingContainer;
