const AlignContent = {
    title: "Content",
    format: "content-{{value}}",
    id: "alignContent",
    ai: {
        name: "alignContent",
        description: "Distribute rows along the cross axis when the container has extra space. Requires wrap to be enabled on flex containers.",
    },
    select: {
        default: "normal",
        items: [
            {
                value: "normal",
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
                value: "between",
                title: "Between",
            },
            {
                value: "around",
                title: "Around",
            },
            {
                value: "evenly",
                title: "Evenly",
            },
            {
                value: "stretch",
                title: "Stretch",
            },
            {
                value: "baseline",
                title: "Baseline",
            },
        ],
    },
};

export default AlignContent;
