const globalTransforms = (app, args = {}) => {
    const {
        globalControlTypeTransforms: type,
        globalHoverGroupTransforms: hoverGroup,
        globalHoverGroupCustomIdTransforms: customId,
        globalTransformsApplyTo: applyTo,
        globalTransformOrigin: origin,
        globalTransformScale: scale,
        globalTransformRotate: rotate,
        globalTransformSkewX: skewX,
        globalTransformSkewY: skewY,
        globalTransformTranslateX: translateX,
        globalTransformTranslateY: translateY,
        globalTransformScaleEnd: scaleEnd,
        globalTransformRotateEnd: rotateEnd,
        globalTransformSkewXEnd: skewXEnd,
        globalTransformSkewYEnd: skewYEnd,
        globalTransformTranslateXEnd: translateXEnd,
        globalTransformTranslateYEnd: translateYEnd,
    } = app.props;

    const { node } = app;

    node.isContainer = args.isContainer || false;
    const wantsActive = args.active || false;
    const wantsFocus = args.focus || false;

    const prefix = getHoverPrefix(node, applyTo, hoverGroup, customId);
    const classes = classnames();

    if (type != "none") {
        classes.add([
            "transform",
            origin,
            scale,
            rotate,
            skewX,
            skewY,
            translateX,
            translateY,
        ]);
    }

    if (type == "hover") {
        classes.add([
            addPrefixToTailwindClasses(scaleEnd, prefix),
            addPrefixToTailwindClasses(rotateEnd, prefix),
            addPrefixToTailwindClasses(skewXEnd, prefix),
            addPrefixToTailwindClasses(skewYEnd, prefix),
            addPrefixToTailwindClasses(translateXEnd, prefix),
            addPrefixToTailwindClasses(translateYEnd, prefix),
        ]);

        if (wantsActive) {
            classes.add([
                addPrefixToTailwindClasses(scaleEnd, "data-[active=true]"),
                addPrefixToTailwindClasses(rotateEnd, "data-[active=true]"),
                addPrefixToTailwindClasses(skewXEnd, "data-[active=true]"),
                addPrefixToTailwindClasses(skewYEnd, "data-[active=true]"),
                addPrefixToTailwindClasses(translateXEnd, "data-[active=true]"),
                addPrefixToTailwindClasses(translateYEnd, "data-[active=true]"),
            ]);
        }

        if (wantsFocus) {
            const focusPrefix = prefix.replace(/hover/g, "focus");
            classes.add([
                addPrefixToTailwindClasses(scaleEnd, focusPrefix),
                addPrefixToTailwindClasses(rotateEnd, focusPrefix),
                addPrefixToTailwindClasses(skewXEnd, focusPrefix),
                addPrefixToTailwindClasses(skewYEnd, focusPrefix),
                addPrefixToTailwindClasses(translateXEnd, focusPrefix),
                addPrefixToTailwindClasses(translateYEnd, focusPrefix),
            ]);
        }
    }

    return classes.toString();
};
