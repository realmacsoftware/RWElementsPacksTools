const MaxWidth = [{
  title: "Max Width",
  id: "globalMaxWidth",
  ai: { name: "maxWidth", description: "Maximum width theme-size token (e.g. 'auto', '0', '24', 'full')." },
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
