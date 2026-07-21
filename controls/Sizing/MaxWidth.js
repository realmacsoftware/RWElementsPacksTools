const MaxWidth = [{
  title: "Max Width",
  id: "globalMaxWidth",
  ai: { name: "maxWidth", description: "Maximum width theme-size token." },
  format: "max-w-{{value}}",
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

export default MaxWidth;
