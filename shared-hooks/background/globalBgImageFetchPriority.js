const escapeBgImageFetchPriorityAttribute = (value) =>
    String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/'/g, "&#39;");

const globalBgImageFetchPriority = (rw) => {
    const {
        globalControlTypeBg,
        globalBgImageFetchPriority,
        globalBgType,
        globalBgImageResource,
        globalBgImageResourceEnd,
    } = rw.props;

    if (globalControlTypeBg == "none" || globalBgType != "image") {
        return {
            globalBgImageFetchPriorityEnabled: false,
            globalBgImageFetchPriorityLinkElement: "",
            globalBgImageFetchPriorityLinkElementEnd: "",
        };
    }

    const globalBgImageFetchPriorityEnabled = globalBgImageFetchPriority != "auto";

    let globalBgImageFetchPriorityLinkElement = "";
    if (globalBgImageResource?.image) {
        globalBgImageFetchPriorityLinkElement = `<link rel='preload' href='${escapeBgImageFetchPriorityAttribute(globalBgImageResource.image)}' as='image' fetchpriority='${escapeBgImageFetchPriorityAttribute(globalBgImageFetchPriority)}' />`;
    }

    let globalBgImageFetchPriorityLinkElementEnd = "";
    if (globalControlTypeBg == "hover" && globalBgImageResourceEnd?.image) {
        globalBgImageFetchPriorityLinkElementEnd = `<link rel='preload' href='${escapeBgImageFetchPriorityAttribute(globalBgImageResourceEnd.image)}' as='image' fetchpriority='${escapeBgImageFetchPriorityAttribute(globalBgImageFetchPriority)}' />`;
    }

    return {
        globalBgImageFetchPriorityEnabled,
        globalBgImageFetchPriorityLinkElement,
        globalBgImageFetchPriorityLinkElementEnd,
    };
};
