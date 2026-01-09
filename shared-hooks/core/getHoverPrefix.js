const getHoverPrefix = (
    node = {},
    applyTo = "",
    hoverGroup = "self",
    customId = ""
) => {
    const needsPeerPrefix =
        node.isContainer && ["background", "content"].includes(applyTo);

    if (hoverGroup === "parent") return `group-hover/${node.parent.id}`;
    if (hoverGroup === "custom") return `group-hover/${customId}`;
    if (needsPeerPrefix && hoverGroup === "self")
        return `group-hover/${node.id}`;

    return hoverGroup === "self"
        ? needsPeerPrefix
            ? `peer-hover`
            : "hover"
        : `group-hover/${hoverGroup}`;
};

