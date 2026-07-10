const FlexDirection = {
    title: "Direction",
    id: "flexDirection",
    ai: { name: "direction", description: "Flex direction: column or row (optionally reversed)." },
    select: {
        default: "flex-col",
        items: [
            {
                value: "flex-col",
                title: "Column",
            },
            {
                value: "flex-col-reverse",
                title: "Column Reverse",
            },
            {
                value: "flex-row",
                title: "Row",
            },
            {
                value: "flex-row-reverse",
                title: "Row Reverse",
            },
        ],
    },
};

export default FlexDirection;
