const Duration = [
  {
    visible: "globalTransitionsProperty != 'none'",
    title: "Duration",
    id: "globalTransitionsDuration",
    ai: { name: "transitionDuration", description: "Transition duration in milliseconds.", visible: "transitionProperty != 'none'" },
    format: "duration-[{{value}}ms]",
    number: {
      default: 300,
    },
  },
];

export default Duration;
