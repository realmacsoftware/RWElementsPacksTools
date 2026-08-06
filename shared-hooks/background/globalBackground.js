const globalBgColor = (app, args = {}) => {
    const {
        globalControlTypeBg: controlType,
        globalBgColor: color,
        globalBgColorOpacity: opacity,
        globalBgColorEnd: colorEnd,
        globalBgColorOpacityEnd: opacityEnd,
    } = app.props;

    const wantsPeer = args?.peer || false;
    const wantsActive = args?.active || false;
    const wantsFocus = args?.focus || false;

    const classes = classnames([color, opacity]);

    if (controlType == "hover") {
        if (wantsPeer) {
            classes.add([
                colorEnd.replace(/hover:/g, "peer-hover:"),
                opacityEnd.replace(/hover:/g, "peer-hover:"),
            ]);
        } else {
            classes.add([colorEnd, opacityEnd]);
        }

        if (wantsActive) {
            classes.add([
                colorEnd.replace(/hover:/g, "data-[active=true]:"),
                opacityEnd.replace(/hover:/g, "data-[active=true]:"),
            ]);
        }

        if (wantsFocus) {
            classes.add([
                colorEnd.replace(/hover:/g, "focus:"),
                opacityEnd.replace(/hover:/g, "focus:"),
            ]);
        }
    }

    return classes.toString();
};

const globalBgGradient = (app, args) => {
    const {
        globalControlTypeBg: controlType,
        globalBgGradientType: gradientType,
        globalBgGradientDirection: direction,
        globalBgGradientRadialPosition: radialPosition,
        globalBgGradientConicAngle: conicAngle,
        globalBgGradientInterpolation: interpolation,
        globalBgGradientTypeEnd: gradientTypeEnd,
        globalBgGradientDirectionEnd: directionEnd,
        globalBgGradientRadialPositionEnd: radialPositionEnd,
        globalBgGradientConicAngleEnd: conicAngleEnd,
        globalBgGradientInterpolationEnd: interpolationEnd,

        globalBgGradientFromColor: fromColor,
        globalBgGradientFromOpacity: fromOpacity,
        globalBgGradientFromPosition: fromPosition,

        globalBgGradientViaEnabled: viaEnabled,
        globalBgGradientViaColor: viaColor,
        globalBgGradientViaOpacity: viaOpacity,
        globalBgGradientViaPosition: viaPosition,

        globalBgGradientToColor: toColor,
        globalBgGradientToOpacity: toOpacity,
        globalBgGradientToPosition: toPosition,

        globalBgGradientFromColorEnd: fromColorEnd,
        globalBgGradientFromOpacityEnd: fromOpacityEnd,

        globalBgGradientViaEnabledEnd: viaEnabledEnd,
        globalBgGradientViaColorEnd: viaColorEnd,
        globalBgGradientViaOpacityEnd: viaOpacityEnd,

        globalBgGradientToColorEnd: toColorEnd,
        globalBgGradientToOpacityEnd: toOpacityEnd,
    } = app.props;

    const wantsPeer = args?.peer || false;
    const wantsActive = args?.active || false;
    const wantsFocus = args?.focus || false;
    const hasPrefix = (args?.prefix && args?.prefixCallback) || false;
    const prefixCallback = args?.prefixCallback || (() => {});

    const directionClass = resolveGradientImageClass(
        gradientType,
        direction,
        radialPosition,
        conicAngle,
        interpolation
    );
    const directionEndClass = resolveGradientImageClass(
        gradientTypeEnd,
        directionEnd,
        radialPositionEnd,
        conicAngleEnd,
        interpolationEnd
    );

    const classes = classnames([
        directionClass,
        fromColor,
        fromOpacity,
        fromPosition,
        toColor,
        toOpacity,
        toPosition,
    ]);

    if (switchToBool(viaEnabled) === true) {
        classes.add([viaColor, viaOpacity, viaPosition]);
    }

    if (controlType == "hover") {
        if (wantsPeer) {
            classes.add([
                directionEndClass.replace(/hover:/g, "peer-hover:"),
                fromColorEnd.replace(/hover:/g, "peer-hover:"),
                fromOpacityEnd.replace(/hover:/g, "peer-hover:"),
                toColorEnd.replace(/hover:/g, "peer-hover:"),
                toOpacityEnd.replace(/hover:/g, "peer-hover:"),
            ]);
        } else if (hasPrefix) {
            classes.add([
                prefixCallback(
                    directionEndClass.replace(/hover:/g, ""),
                    args.prefix
                ),
                prefixCallback(
                    fromColorEnd.replace(/hover:/g, ""),
                    args.prefix
                ),
                prefixCallback(
                    fromOpacityEnd.replace(/hover:/g, ""),
                    args.prefix
                ),
                prefixCallback(toColorEnd.replace(/hover:/g, ""), args.prefix),
                prefixCallback(
                    toOpacityEnd.replace(/hover:/g, ""),
                    args.prefix
                ),
            ]);
        } else {
            classes.add([
                directionEndClass,
                fromColorEnd,
                fromOpacityEnd,
                toColorEnd,
                toOpacityEnd,
            ]);
        }

        if (wantsActive) {
            classes.add([
                directionEndClass.replace(/hover:/g, "data-[active=true]:"),
                fromColorEnd.replace(/hover:/g, "data-[active=true]:"),
                fromOpacityEnd.replace(/hover:/g, "data-[active=true]:"),
                toColorEnd.replace(/hover:/g, "data-[active=true]:"),
                toOpacityEnd.replace(/hover:/g, "data-[active=true]:"),
            ]);
        }

        if (wantsFocus) {
            classes.add([
                directionEndClass.replace(/hover:/g, "focus:"),
                fromColorEnd.replace(/hover:/g, "focus:"),
                fromOpacityEnd.replace(/hover:/g, "focus:"),
                toColorEnd.replace(/hover:/g, "focus:"),
                toOpacityEnd.replace(/hover:/g, "focus:"),
            ]);
        }

        if (switchToBool(viaEnabledEnd) === true) {
            if (wantsPeer) {
                classes.add([
                    viaColorEnd.replace(/hover:/g, "peer-hover:"),
                    viaOpacityEnd.replace(/hover:/g, "peer-hover:"),
                ]);
            } else if (hasPrefix) {
                classes.add([
                    prefixCallback(
                        viaColorEnd.replace(/hover:/g, ""),
                        args.prefix
                    ),
                    prefixCallback(
                        viaOpacityEnd.replace(/hover:/g, ""),
                        args.prefix
                    ),
                ]);
            } else {
                classes.add([viaColorEnd, viaOpacityEnd]);
            }

            if (wantsActive) {
                classes.add([
                    viaColorEnd.replace(/hover:/g, "data-[active=true]:"),
                    viaOpacityEnd.replace(/hover:/g, "data-[active=true]:"),
                ]);
            }

            if (wantsFocus) {
                classes.add([
                    viaColorEnd.replace(/hover:/g, "focus:"),
                    viaOpacityEnd.replace(/hover:/g, "focus:"),
                ]);
            }
        }
    }

    return classes.toString();
};

/**
 * A resource path lands inside a bg-[url(...)] arbitrary value: a raw space
 * splits the class token, and a raw quote or parenthesis ends the CSS url()
 * early — percent-encode exactly those characters. "%" is left alone so
 * already-encoded paths are not double-encoded.
 */
const encodeBgImageUrl = (url) =>
    String(url).replace(/[ '"()]/g, (char) => ({
        " ": "%20",
        "'": "%27",
        '"': "%22",
        "(": "%28",
        ")": "%29",
    })[char]);

const globalBgImage = (app, args) => {
    const {
        globalControlTypeBg: controlType,
        globalBgImageType: type,
        globalBgImageCmsField: cmsField,
        globalBgImageResource: resource,
        globalBgImagePosition: position,
        globalBgImageSize: size,
        globalBgImageRepeat: repeat,

        globalBgImageResourceEnd: resourceEnd,
        globalBgImagePositionEnd: positionEnd,
        globalBgImageSizeEnd: sizeEnd,
        globalBgImageRepeatEnd: repeatEnd,
    } = app.props;

    const isCms = type === "cms";
    if (isCms) {
        return classnames([size, repeat, position]).toString();
    }

    const wantsPeer = args?.peer || false;
    const wantsActive = args?.active || false;
    const wantsFocus = args?.focus || false;
    const hasPrefix = (args?.prefix && args?.prefixCallback) || false;
    const prefixCallback = args?.prefixCallback || (() => {});

    const hasImage = Boolean(resource?.image);
    const hasImageEnd = Boolean(resourceEnd?.image);

    const classes = classnames().add([
        hasImage ? `bg-[url(${encodeBgImageUrl(resource.image)})]` : "",
        size,
        repeat,
        position,
    ]);

    if (controlType == "hover") {
        if (wantsPeer) {
            classes.add([
                hasImageEnd ? `peer-hover:bg-[url(${encodeBgImageUrl(resourceEnd.image)})]` : "",
                sizeEnd.replace(/hover:/g, "peer-hover:"),
                repeatEnd.replace(/hover:/g, "peer-hover:"),
                positionEnd.replace(/hover:/g, "peer-hover:"),
            ]);
        } else if (hasPrefix) {
            classes.add([
                hasImageEnd
                    ? prefixCallback(`bg-[url(${encodeBgImageUrl(resourceEnd.image)})]`, args.prefix)
                    : "",
                prefixCallback(sizeEnd.replace(/hover:/g, ""), args.prefix),
                prefixCallback(repeatEnd.replace(/hover:/g, ""), args.prefix),
                prefixCallback(positionEnd.replace(/hover:/g, ""), args.prefix),
            ]);
        } else {
            classes.add([
                hasImageEnd ? `hover:bg-[url(${encodeBgImageUrl(resourceEnd.image)})]` : "",
                sizeEnd,
                repeatEnd,
                positionEnd,
            ]);
        }

        if (wantsActive) {
            classes.add([
                hasImageEnd ? `data-[active=true]:bg-[url(${encodeBgImageUrl(resourceEnd.image)})]` : "",
                sizeEnd.replace(/hover:/g, "data-[active=true]:"),
                repeatEnd.replace(/hover:/g, "data-[active=true]:"),
                positionEnd.replace(/hover:/g, "data-[active=true]:"),
            ]);
        }

        if (wantsFocus) {
            classes.add([
                hasImageEnd ? `focus:bg-[url(${encodeBgImageUrl(resourceEnd.image)})]` : "",
                sizeEnd.replace(/hover:/g, "focus:"),
                repeatEnd.replace(/hover:/g, "focus:"),
                positionEnd.replace(/hover:/g, "focus:"),
            ]);
        }
    }

    return classes.toString();
};

const globalBgVideoThumbnail = (app, args) => {
    const { globalBgVideo: video } = app.props;

    return classnames([
        `bg-[url(${encodeBgImageUrl(video?.image)})] bg-cover bg-center`,
    ]).toString();
};

const globalBackground = (app, args = {}) => {
    const { globalControlTypeBg: controlType, globalBgType: type } = app.props;

    if (controlType == "none") {
        return "";
    }

    switch (type) {
        case "color":
            return globalBgColor(app, args);
        case "gradient":
            return globalBgGradient(app, args);
        case "image":
            return globalBgImage(app, args);
        case "video":
            return globalBgVideoThumbnail(app, args);
        case "none":
            return "";
        default:
            console.error("Invalid background type:", type);
            return "";
    }
};
