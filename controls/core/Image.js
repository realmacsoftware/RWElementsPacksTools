export const Image = [
    {
        title: "Type",
        id: "imageType",
        ai: { name: "imageType", description: "Image source mode: 'resource' (picked asset), 'custom' (URL/path string), or 'cms' (CMS field binding)." },
        segmented: {
            default: "resource",
            items: [
                {
                    title: "Resource",
                    value: "resource",
                },
                {
                    title: "Custom",
                    value: "custom",
                },
                {
                    title: "CMS",
                    value: "cms",
                },
            ],
        },
    },
    {
        title: "Mode",
        id: "imageMode",
        ai: { name: "imageMode", description: "Light or dark mode variant being edited: 'light' or 'dark'." },
        segmented: {
            default: "light",
            items: [
                {
                    icon: "sun.max",
                    value: "light",
                },
                {
                    icon: "moon",
                    value: "dark",
                },
            ],
        },
    },
    {
        visible: "imageType == 'custom' && imageMode == 'light'",
        ai: { name: "customSource", description: "Custom image source for 'custom' mode: an absolute URL (https://...) or a site-relative path, used directly as the img src." },
        title: "Source",
        id: "imageCustomSource",
        text: {
            default: "",
        },
    },
    {
        visible: "imageType == 'custom' && imageMode == 'dark'",
        ai: { name: "customSourceDark", description: "Dark-mode custom image source for 'custom' mode: absolute URL or site-relative path." },
        title: "Source",
        id: "imageCustomSourceDark",
        text: {
            default: "",
        },
    },
    {
        visible: "imageType == 'cms' && imageMode == 'light'",
        ai: { name: "cmsField", description: "CMS image binding for 'cms' mode: a Twig expression resolving to an image URL (e.g. {{item.image.src}}), NOT a bare frontmatter key." },
        title: "Field",
        id: "imageCmsField",
        text: {
            default: "{{item.image.src}}"
        },
    },
    {
        visible: "imageType == 'cms' && imageMode == 'dark'",
        ai: { name: "cmsFieldDark", description: "Dark-mode CMS image binding: a Twig expression resolving to an image URL (e.g. {{item.image.src}})." },
        title: "Field",
        id: "imageCmsFieldDark",
        text: {
            default: "{{item.image.src}}"
        },
    },
    {
        visible: "imageType == 'resource' && imageMode == 'light'",
        title: "Image",
        id: "image",
        ai: { name: "image", description: "Light-mode image resource ID (from listResources/addResource)." },
        resource: { accepts: "image/*", excludes: ".svg" },
    },
    {
        visible: "imageType == 'resource' && imageMode == 'dark'",
        title: "Image",
        id: "imageDark",
        ai: { name: "imageDark", description: "Dark-mode image resource ID (from listResources/addResource)." },
        resource: { accepts: "image/*", excludes: ".svg" },
    },
    {
        visible: "imageType == 'cms' || imageType == 'custom'",
        title: "Alt",
        id: "imageAlt",
        responsive: false,
        text: {
            subtitle: "Used for SEO and accessibility",
            default: "",
        },
    },
];

export default Image;
