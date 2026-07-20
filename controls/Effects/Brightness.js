const Brightness = {
  title: "Brightness",
  id: "globalFiltersBrightness",
  ai: { name: "brightness", description: "Brightness filter, in percent." },
  format: "brightness-[{{value}}%]",
  number: {
    default: 100,
    subtitle: "In percent",
  },
};

export default Brightness;
