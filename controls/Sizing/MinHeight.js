const MinHeight = [
  {
    title: "Min Height",
    id: "globalMinHeight",
    ai: { name: "minHeight", description: "Minimum height theme-size token (e.g. 'auto', '0', '24', 'full')." },
    format: "min-h-{{value}}",
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

export default MinHeight;
