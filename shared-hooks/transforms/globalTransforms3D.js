const globalTransforms3D = (app, args = {}) => {
    const {
        globalControlType3D: type,
        globalHoverGroup3D: hoverGroup,
        globalHoverGroupCustomId3D: customId,
        globalTransforms3DApplyTo: applyTo,
        globalTransformBackface: backface,
        globalTransformRotateX: rotateX,
        globalTransformRotateY: rotateY,
        globalTransformScaleZ: scaleZ,
        globalTransformTranslateZ: translateZ,
        globalTransformRotateXEnd: rotateXEnd,
        globalTransformRotateYEnd: rotateYEnd,
        globalTransformScaleZEnd: scaleZEnd,
        globalTransformTranslateZEnd: translateZEnd,
    } = app.props;

    const { node } = app;

    node.isContainer = args.isContainer || false;
    const wantsActive = args.active || false;
    const wantsFocus = args.focus || false;

    const prefix = getHoverPrefix(node, applyTo, hoverGroup, customId);
    const classes = classnames();

    if (type != "none") {
        classes.add([
            backface,
            rotateX,
            rotateY,
            scaleZ,
            translateZ,
        ]);
    }

    if (type == "hover") {
        classes.add([
            addPrefixToTailwindClasses(rotateXEnd, prefix),
            addPrefixToTailwindClasses(rotateYEnd, prefix),
            addPrefixToTailwindClasses(scaleZEnd, prefix),
            addPrefixToTailwindClasses(translateZEnd, prefix),
        ]);

        if (wantsActive) {
            classes.add([
                `data-[active=true]:${rotateXEnd}`,
                `data-[active=true]:${rotateYEnd}`,
                `data-[active=true]:${scaleZEnd}`,
                `data-[active=true]:${translateZEnd}`,
            ]);
        }

        if (wantsFocus) {
            classes.add([
                `${prefix.replace(/hover/g, "focus")}:${rotateXEnd}`,
                `${prefix.replace(/hover/g, "focus")}:${rotateYEnd}`,
                `${prefix.replace(/hover/g, "focus")}:${scaleZEnd}`,
                `${prefix.replace(/hover/g, "focus")}:${translateZEnd}`,
            ]);
        }
    }

    return classes.toString();
};
