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
            wantsFetchPriority: false,
            linkElement: "",
            linkElementEnd: "",
        };
    }

    const globalBgImageFetchPriorityEnabled = globalBgImageFetchPriority != "auto";

    let globalBgImageFetchPriorityLinkElement = "";
    if (globalBgImageResource?.image) {
        globalBgImageFetchPriorityLinkElement = `<link rel='preload' href='${globalBgImageResource?.image}' as='image' fetchpriority='${globalBgImageFetchPriority}' />`;
    }

    let globalBgImageFetchPriorityLinkElementEnd = "";
    if (globalControlTypeBg == "hover" && globalBgImageResourceEnd?.image) {
        globalBgImageFetchPriorityLinkElementEnd = `<link rel='preload' href='${globalBgImageResourceEnd?.image}' as='image' fetchpriority='${globalBgImageFetchPriority}' />`;
    }

    return {
        globalBgImageFetchPriorityEnabled,
        globalBgImageFetchPriorityLinkElement,
        globalBgImageFetchPriorityLinkElementEnd,
    };
};
