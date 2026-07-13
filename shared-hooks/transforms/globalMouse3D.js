const globalMouse3D = (app) => {
    const {
        globalControlType3D: type,
        globalHoverGroup3D: hoverGroup,
        globalHoverGroupCustomId3D: customId,
    } = app.props;

    if (type != "mouse") return {};

    // Resolve the tracking surface to the group/{name} class token the
    // runtime looks up, mirroring how getHoverPrefix targets hover groups.
    let over = hoverGroup || "self";
    if (over == "parent") over = (app.node.parent && app.node.parent.id) || "self";
    if (over == "custom") over = (customId || "").trim() || "self";

    return { "data-m3d-over": over };
};
