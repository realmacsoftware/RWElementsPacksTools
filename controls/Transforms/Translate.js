const Translate = [
  {
    title: "Translate",
    heading: {},
  },
  {
    title: "Horizontal",
    id: "globalTransformTranslateX",
    ai: { name: "translateX", description: "Horizontal offset. CSS length (e.g. 10px, 50%, 10vw)." },
    format: "translate-x-[{{value}}]",
    text: {
      default: "0px",
      base: "0px",
    },
  },
  {
    title: "Vertical",
    id: "globalTransformTranslateY",
    ai: { name: "translateY", description: "Vertical offset. CSS length (e.g. 10px, 50%, 10vw)." },
    format: "translate-y-[{{value}}]",
    text: {
      default: "0px",
      subtitle: "Use valid CSS values. 10px, 50%, 10vw.",
    }
  },
];

export default Translate;
