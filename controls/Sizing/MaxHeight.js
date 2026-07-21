const MaxHeight = [{
  title: "Max Height",
  id: "globalMaxHeight",
  ai: { name: "maxHeight", description: "Maximum height theme-size token." },
  format: "max-h-{{value}}",
  themeSpacing: {
    mode: "single",
    default: {
      base: {
        custom: false,
        value: "auto"
      }
    }
  }
}
];

export default MaxHeight;
