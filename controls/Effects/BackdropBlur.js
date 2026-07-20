const BackdropBlur = {
  title: "Blur",
  id: "globalFiltersBackdropBlur",
  ai: { name: "backdropBlur", description: "Backdrop blur filter, in pixels." },
  format: "backdrop-blur-[{{value}}px]",
  number: {
    default: 0,
    subtitle: "In pixels",
  },
};

export default BackdropBlur;
