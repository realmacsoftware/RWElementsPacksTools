const mouse3DDeviceOrder = ["base", "sm", "md", "lg", "xl", "2xl"];

const buildMouse3DClass = (utility, start, end, cssVar, prefix = "") => {
    if (start === end) return `${prefix}${utility}-[${start}]`;
    return `${prefix}${utility}-[calc(${start}*(1_-_var(${cssVar},0))_+_${end}*var(${cssVar},0))]`;
};

const mouse3DChannel = (app, { utility, unit, cssVar, startId, endId, fallback }) => {
    const responsiveProps = app.responsiveProps || {};
    const startValues = responsiveProps[startId] || {};
    const endValues = responsiveProps[endId] || {};

    const pick = (value, previous) =>
        value == null || value === "" ? previous : `${value}${unit}`;

    let start = pick(startValues.base, fallback);
    let end = pick(endValues.base, fallback);
    const classes = [buildMouse3DClass(utility, start, end, cssVar)];

    mouse3DDeviceOrder.slice(1).forEach((device) => {
        const nextStart = pick(startValues[device], start);
        const nextEnd = pick(endValues[device], end);
        if (nextStart === start && nextEnd === end) return;
        start = nextStart;
        end = nextEnd;
        classes.push(
            buildMouse3DClass(utility, start, end, cssVar, `${device}:`)
        );
    });

    return classes;
};

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

    if (type != "none" && type != "mouse") {
        classes.add([
            backface,
            rotateX,
            rotateY,
            scaleZ,
            translateZ,
        ]);
    }

    if (type == "mouse") {
        classes.add([
            backface,
            // Cursor Y drives Rotate X, cursor X drives Rotate Y,
            // distance-from-centre drives Scale Z and Depth.
            ...mouse3DChannel(app, {
                utility: "rotate-x",
                unit: "deg",
                cssVar: "--rw-m3d-y",
                startId: "globalTransformRotateX",
                endId: "globalTransformRotateXEnd",
                fallback: "0deg",
            }),
            ...mouse3DChannel(app, {
                utility: "rotate-y",
                unit: "deg",
                cssVar: "--rw-m3d-x",
                startId: "globalTransformRotateY",
                endId: "globalTransformRotateYEnd",
                fallback: "0deg",
            }),
            ...mouse3DChannel(app, {
                utility: "scale-z",
                unit: "%",
                cssVar: "--rw-m3d-r",
                startId: "globalTransformScaleZ",
                endId: "globalTransformScaleZEnd",
                fallback: "100%",
            }),
            ...mouse3DChannel(app, {
                utility: "translate-z",
                unit: "",
                cssVar: "--rw-m3d-r",
                startId: "globalTransformTranslateZ",
                endId: "globalTransformTranslateZEnd",
                fallback: "0px",
            }),
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
