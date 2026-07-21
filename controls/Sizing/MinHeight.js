const MinHeight = [
  {
    title: "Min Height",
    id: "globalMinHeight",
    ai: { name: "minHeight", description: "Minimum height theme-size token." },
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
