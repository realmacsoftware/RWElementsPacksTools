const Translate = [
  {
    title: "Translate",
    heading: {},
    ai: { exclude: true, reason: "Inspector-only heading; not a settable property." },
  },
  {
    title: "Horizontal",
    id: "globalTransformTranslateX",
    ai: { name: "translateX", description: "Horizontal offset. CSS length (e.g. 10px, 50%, 10vw).", visible: "transforms != 'none'" },
    format: "translate-x-[{{value}}]",
    text: {
      default: "0px",
      base: "0px",
    },
  },
  {
    title: "Vertical",
    id: "globalTransformTranslateY",
    ai: { name: "translateY", description: "Vertical offset. CSS length (e.g. 10px, 50%, 10vw).", visible: "transforms != 'none'" },
    format: "translate-y-[{{value}}]",
    text: {
      default: "0px",
      subtitle: "Use valid CSS values. 10px, 50%, 10vw.",
    }
  },
];

export default Translate;
