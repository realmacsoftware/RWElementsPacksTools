const globalFilters = (app, args = {}) => {
    const {
        globalControlTypeFilters: type,
        globalHoverGroupFilters: hoverGroup,
        globalHoverGroupCustomIdFilters: customId,
        globalFiltersApplyTo: applyTo,
        // filters
        globalFiltersBlur: blur,
        globalFiltersBrightness: brightness,
        globalFiltersDropShadow: dropShadow,
        globalFiltersSaturate: saturate,

        // backdrop filters
        globalFiltersBackdropBlur: backdropBlur,

        // end filters
        globalFiltersBlurEnd: blurEnd,
        globalFiltersBrightnessEnd: brightnessEnd,
        globalFiltersDropShadowEnd: dropShadowEnd,
        globalFiltersSaturateEnd: saturateEnd,

        // end backdrop filters
        globalFiltersBackdropBlurEnd: backdropBlurEnd,
    } = app.props;

    const { node } = app;

    node.isContainer = args.isContainer || false;
    const wantsActive = args.active || false;
    const wantsFocus = args.focus || false;
    const prefix = getHoverPrefix(node, applyTo, hoverGroup, customId);

    if (type == "none") {
        return "";
    }

    const wantsBlur = !blur.endsWith("[0px]") || !blurEnd.endsWith("[0px]");
    const wantsBackdropBlur =
        !backdropBlur.endsWith("[0px]") || !backdropBlurEnd.endsWith("[0px]");

    const classes = [
        wantsBlur ? blur : "",
        brightness,
        dropShadow,
        saturate,
        wantsBackdropBlur ? backdropBlur : "",
    ];

    if (type == "hover") {
        classes.push(
            wantsBlur ? addPrefixToTailwindClasses(blurEnd, prefix) : "",
            addPrefixToTailwindClasses(brightnessEnd, prefix),
            addPrefixToTailwindClasses(dropShadowEnd, prefix),
            addPrefixToTailwindClasses(saturateEnd, prefix),
            wantsBackdropBlur
                ? addPrefixToTailwindClasses(backdropBlurEnd, prefix)
                : ""
        );

        if (wantsActive) {
            classes.push(
                wantsBlur
                    ? addPrefixToTailwindClasses(blurEnd, "data-[active=true]")
                    : "",
                addPrefixToTailwindClasses(brightnessEnd, "data-[active=true]"),
                addPrefixToTailwindClasses(dropShadowEnd, "data-[active=true]"),
                addPrefixToTailwindClasses(saturateEnd, "data-[active=true]"),
                wantsBackdropBlur
                    ? addPrefixToTailwindClasses(backdropBlurEnd, "data-[active=true]")
                    : ""
            );
        }

        if (wantsFocus) {
            const focusPrefix = prefix.replace(/hover/g, "focus");
            classes.push(
                wantsBlur ? addPrefixToTailwindClasses(blurEnd, focusPrefix) : "",
                addPrefixToTailwindClasses(brightnessEnd, focusPrefix),
                addPrefixToTailwindClasses(dropShadowEnd, focusPrefix),
                addPrefixToTailwindClasses(saturateEnd, focusPrefix),
                wantsBackdropBlur
                    ? addPrefixToTailwindClasses(backdropBlurEnd, focusPrefix)
                    : ""
            );
        }
    }

    return classnames(classes).toString();
};
