const Saturate = {
  title: "Saturate",
  id: "globalFiltersSaturate",
  ai: { name: "saturate", description: "Saturation filter, in percent." },
  format: "saturate-[{{value}}%]",
  number: {
    default: 100,
    subtitle: "In percent",
  },
};

export default Saturate;
