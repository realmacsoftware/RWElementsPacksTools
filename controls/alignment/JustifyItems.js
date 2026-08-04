const JustifyItems = {
    title: "Items",
    format: "justify-items-{{value}}",
    id: "justifyItems",
    ai: {
        name: "justifyItems",
        description: "Default inline-axis alignment of each item within its area (CSS justify-items).",
    },
    select: {
        default: "normal",
        items: [
            {
                value: "[normal]",
                title: "Normal",
            },
            {
                value: "start",
                title: "Start",
            },
            {
                value: "end",
                title: "End",
            },
            {
                value: "center",
                title: "Center",
            },
            {
                value: "stretch",
                title: "Stretch",
            },
        ],
    },
};

export default JustifyItems;
