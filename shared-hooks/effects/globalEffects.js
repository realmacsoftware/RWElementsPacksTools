const globalEffects = (app, args = {}) => {
    const {
        globalEffectsApplyTo: applyTo,
        globalControlTypeEffects: type,
        globalHoverGroupEffects: hoverGroup,
        globalHoverGroupCustomIdEffects: customId,
        globalBoxShadow: boxShadow,
        globalBoxShadowColor: boxShadowColor,
        globalBoxShadowOpacity: boxShadowOpacity,
        globalOpacity: opacity,
        globalBoxShadowEnd: boxShadowEnd,
        globalBoxShadowColorEnd: boxShadowColorEnd,
        globalBoxShadowOpacityEnd: boxShadowOpacityEnd,
        globalOpacityEnd: opacityEnd,
    } = app.props;

    const { node } = app;

    node.isContainer = args.isContainer || false;
    const wantsActive = args.active || false;
    const wantsFocus = args.focus || false;
    const prefix = getHoverPrefix(node, applyTo, hoverGroup, customId);

    const classes = [];

    if (type != "none") {
        classes.push(boxShadow, boxShadowColor, boxShadowOpacity, opacity);
    }

    if (type == "hover") {
        classes.push(`${prefix}:${boxShadowEnd}`, `${prefix}:${boxShadowColorEnd}`, `${prefix}:${boxShadowOpacityEnd}`, `${prefix}:${opacityEnd}`);

        if (wantsActive) {
            classes.push(
                `data-[active=true]:${boxShadowEnd}`,
                `data-[active=true]:${boxShadowColorEnd}`,
                `data-[active=true]:${boxShadowOpacityEnd}`,
                `data-[active=true]:${opacityEnd}`
            );
        }

        if (wantsFocus) {
            classes.push(
                `${prefix.replace(/hover/g, "focus")}:${boxShadowEnd}`,
                `${prefix.replace(/hover/g, "focus")}:${boxShadowColorEnd}`,
                `${prefix.replace(/hover/g, "focus")}:${boxShadowOpacityEnd}`,
                `${prefix.replace(/hover/g, "focus")}:${opacityEnd}`
            );
        }
    }

    return classnames(classes).toString();
};
