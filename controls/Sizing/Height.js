const Height = [
  {
    title: "Height",
    id: "globalHeight",
    ai: { name: "heightSize", description: "Height theme-size token." },
    format: "h-{{value}}",
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

export default Height;
