const Width = [
  {
    title: "Width",
    id: "globalWidth",
    ai: { name: "widthSize", description: "Width theme-size token." },
    format: "w-{{value}}",
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

export default Width;
