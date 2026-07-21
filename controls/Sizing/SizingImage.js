const Sizing = [
  {
    title: "Size",
    heading: {}
  },
  {
    globalControl: "Width",
    ai: { name: "widthSize", description: "Width theme-size token; arbitrary literals also accepted in brackets (e.g. '[640px]')." },
    themeSpacing: {
      mode: "single",
      default: {
        base: {
          value: "100%",
          custom: true
        }
      }
    }
  },
  {
    globalControl: "Height",
    ai: { name: "heightSize", description: "Height theme-size token; arbitrary literals also accepted in brackets (e.g. '[480px]')." }
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
    divider: {}
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

export default Sizing;
