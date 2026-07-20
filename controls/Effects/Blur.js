const Blur = {
  title: "Blur",
  id: "globalFiltersBlur",
  ai: { name: "blur", description: "Blur filter, in pixels." },
  format: "blur-[{{value}}px]",
  number: {
    default: 0,
    subtitle: "In pixels",
  },
};

export default Blur;
