const MinWidth = [
  {
  title: "Min Width",
  id: "globalMinWidth",
  ai: { name: "minWidth", description: "Minimum width theme-size token." },
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
