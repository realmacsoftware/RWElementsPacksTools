const ObjectFit = {
    title: "Object Fit",
    id: "objectFit",
    ai: { name: "objectFit", description: "How the image fills its box when cropped by aspect ratio." },
    format: "object-{{value}}",
    select: {
        default: "cover",
        items: [
            {
                title: "Fill",
                value: "fill",
            },
            {
                title: "Contain",
                value: "contain",
            },
            {
                title: "Cover",
                value: "cover",
            },
            {
                title: "None",
                value: "none",
            },
            {
                title: "Scale Down",
                value: "scale-down",
            },
        ],
    },
};

export default ObjectFit;
