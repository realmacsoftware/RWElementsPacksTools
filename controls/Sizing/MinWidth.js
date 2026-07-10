const MinWidth = [
  {
  title: "Min Width",
  id: "globalMinWidth",
  ai: { name: "minWidth", description: "Minimum width theme-size token (e.g. 'auto', '0', '24', 'full')." },
  format: "min-w-{{value}}",
    themeSpacing: {
      mode: "single",
      default: {
        base: {
          custom: false,
          value: "0"
        }
      }
    }
  }
];

export default MinWidth;
