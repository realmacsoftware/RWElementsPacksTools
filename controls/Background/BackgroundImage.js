export const BackgroundImage = [
    {
        title: "Image",
        id: "bgImage",
        ai: { name: "bgImage", description: "Background image resource reference." },
        resource: {},
    },
    {
        title: "Position",
        heading: {},
    },
    {
        title: "Horizontal",
        id: "bgImagePositionX",
        ai: { name: "bgImagePositionX", description: "Background image horizontal position.", values: ["left", "center", "right"] },
        segmented: {
            default: "center",
            items: [
                {
                    value: "left",
                    title: "Left",
                },
                {
                    value: "center",
                    title: "Center",
                    default: true,
                },
                {
                    value: "right",
                    title: "Right",
                },
            ],
        },
    },
    {
        title: "Vertical",
        id: "bgImagePositionY",
        ai: { name: "bgImagePositionY", description: "Background image vertical position.", values: ["top", "center", "bottom"] },
        segmented: {
            default: "center",
            items: [
                {
                    value: "top",
                    title: "Top",
                },
                {
                    value: "center",
                    title: "Middle",
                    default: true,
                },
                {
                    value: "bottom",
                    title: "Bottom",
                },
            ],
        },
    },
    {
        title: "Sizing",
        heading: {},
    },
    {
        title: "Size",
        id: "bgImageSize",
        ai: { name: "bgImageSize", description: "Background image size (auto/cover/contain)." },
        select: {
            default: "cover",
            items: [
                {
                    title: "Auto",
                    value: "auto",
                },
                {
                    title: "Cover",
                    value: "cover",
                },
                {
                    title: "Contain",
                    value: "contain",
                },
            ],
        },
    },
    {
        title: "Repeat",
        id: "bgImageRepeat",
        ai: { name: "bgImageRepeat", description: "Background image repeat mode." },
        format: "bg-{{value}}",
        select: {
            default: "no-repeat",
            items: [
                {
                    title: "No Repeat",
                    value: "no-repeat",
                },
                {
                    title: "Repeat",
                    value: "repeat",
                },
                {
                    title: "Repeat Horizontal",
                    value: "repeat-x",
                },
                {
                    title: "Repeat Vertical",
                    value: "repeat-y",
                },
            ],
        },
    },
];

export default BackgroundImage;
