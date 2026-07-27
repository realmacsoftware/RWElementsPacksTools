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
        classes.push(
            addPrefixToTailwindClasses(boxShadowEnd, prefix),
            addPrefixToTailwindClasses(boxShadowColorEnd, prefix),
            addPrefixToTailwindClasses(boxShadowOpacityEnd, prefix),
            addPrefixToTailwindClasses(opacityEnd, prefix)
        );

        if (wantsActive) {
            classes.push(
                addPrefixToTailwindClasses(boxShadowEnd, "data-[active=true]"),
                addPrefixToTailwindClasses(boxShadowColorEnd, "data-[active=true]"),
                addPrefixToTailwindClasses(boxShadowOpacityEnd, "data-[active=true]"),
                addPrefixToTailwindClasses(opacityEnd, "data-[active=true]")
            );
        }

        if (wantsFocus) {
            const focusPrefix = prefix.replace(/hover/g, "focus");
            classes.push(
                addPrefixToTailwindClasses(boxShadowEnd, focusPrefix),
                addPrefixToTailwindClasses(boxShadowColorEnd, focusPrefix),
                addPrefixToTailwindClasses(boxShadowOpacityEnd, focusPrefix),
                addPrefixToTailwindClasses(opacityEnd, focusPrefix)
            );
        }
    }

    return classnames(classes).toString();
};
