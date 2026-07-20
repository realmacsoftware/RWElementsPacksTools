const Delay = [
  {
    visible: "globalTransitionsProperty != 'none'",
    title: "Delay",
    id: "globalTransitionsDelay",
    ai: { name: "transitionDelay", description: "Transition delay in milliseconds.", visible: "transitionProperty != 'none'" },
    format: "delay-[{{value}}ms]",
    number: {
      default: 0,
    },
  },
];

export default Delay;
