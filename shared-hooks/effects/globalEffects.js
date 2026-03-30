const globalEffects = (app, args = {}) => {
    const {
        globalEffectsApplyTo: applyTo,
        globalControlTypeEffects: type,
        globalHoverGroupEffects: hoverGroup,
        globalHoverGroupCustomIdEffects: customId,
        globalBoxShadow: boxShadow,
        globalBoxShadowColor: boxShadowColor,
        globalBoxShadowColorOpacity: boxShadowColorOpacity,
        globalOpacity: opacity,
        globalBoxShadowEnd: boxShadowEnd,
        globalBoxShadowColorEnd: boxShadowColorEnd,
        globalBoxShadowColorOpacityEnd: boxShadowColorOpacityEnd,
        globalOpacityEnd: opacityEnd,
    } = app.props;

    const { node } = app;

    node.isContainer = args.isContainer || false;
    const wantsActive = args.active || false;
    const wantsFocus = args.focus || false;
    const prefix = getHoverPrefix(node, applyTo, hoverGroup, customId);

    const classes = [];

    // Helper to build shadow color classes with opacity
    const buildShadowColorClasses = (color, colorOpacity, hoverPrefix) => {
        if (!color) return "";
        return color
            .split(" ")
            .filter(Boolean)
            .map((c) => {
                const colorClass = hoverPrefix
                    ? `${hoverPrefix}:${c.trim()}/${colorOpacity}`
                    : `${c.trim()}/${colorOpacity}`;
                return colorClass;
            })
            .join(" ");
    };

    if (type != "none") {
        classes.push(boxShadow, opacity);
        classes.push(buildShadowColorClasses(boxShadowColor, boxShadowColorOpacity));
    }

    if (type == "hover") {
        classes.push(`${prefix}:${boxShadowEnd}`, `${prefix}:${opacityEnd}`);
        classes.push(
            buildShadowColorClasses(boxShadowColorEnd, boxShadowColorOpacityEnd, prefix)
        );

        if (wantsActive) {
            classes.push(
                `data-[active=true]:${boxShadowEnd}`,
                `data-[active=true]:${opacityEnd}`
            );
            classes.push(
                buildShadowColorClasses(
                    boxShadowColorEnd,
                    boxShadowColorOpacityEnd,
                    "data-[active=true]"
                )
            );
        }

        if (wantsFocus) {
            classes.push(
                `${prefix.replace(/hover/g, "focus")}:${boxShadowEnd}`,
                `${prefix.replace(/hover/g, "focus")}:${opacityEnd}`
            );
            classes.push(
                buildShadowColorClasses(
                    boxShadowColorEnd,
                    boxShadowColorOpacityEnd,
                    prefix.replace(/hover/g, "focus")
                )
            );
        }
    }

    return classnames(classes).toString();
};
