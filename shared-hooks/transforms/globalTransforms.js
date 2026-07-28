/**
 * The Scale control emits scale-x classes only: Elements prepends responsive
 * prefixes once per formatted string, so a two-class format would leave the
 * second class without its breakpoint modifier (e.g. "md:scale-x-[300%]
 * scale-y-[300%]"). Mirror each scale-x class to a scale-y twin so uniform
 * scale still composes with scale-z, with all modifiers preserved.
 */
function mirrorScaleXToY(classString) {
    if (!classString) return "";
    return classString
        .split(/\s+/)
        .filter(Boolean)
        .map((cls) =>
            cls.includes("scale-x-")
                ? `${cls} ${cls.replace("scale-x-", "scale-y-")}`
                : cls
        )
        .join(" ");
}

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

    const scaleMirrored = mirrorScaleXToY(scale);
    const scaleEndMirrored = mirrorScaleXToY(scaleEnd);

    if (type != "none") {
        classes.add([
            "transform",
            origin,
            scaleMirrored,
            rotate,
            skewX,
            skewY,
            translateX,
            translateY,
        ]);
    }

    if (type == "hover") {
        classes.add([
            addPrefixToTailwindClasses(scaleEndMirrored, prefix),
            addPrefixToTailwindClasses(rotateEnd, prefix),
            addPrefixToTailwindClasses(skewXEnd, prefix),
            addPrefixToTailwindClasses(skewYEnd, prefix),
            addPrefixToTailwindClasses(translateXEnd, prefix),
            addPrefixToTailwindClasses(translateYEnd, prefix),
        ]);

        if (wantsActive) {
            classes.add([
                addPrefixToTailwindClasses(scaleEndMirrored, "data-[active=true]"),
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
                addPrefixToTailwindClasses(scaleEndMirrored, focusPrefix),
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
