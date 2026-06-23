const globalPerspective3D = (app, args = {}) => {
    const {
        globalControlType3D: type,
        globalTransformStyle3D: transformStyle,
        globalTransformPerspective: perspective,
        globalTransformPerspectiveOrigin: perspectiveOrigin,
    } = app.props;

    const classes = classnames();

    if (type != "none") {
        classes.add([
            transformStyle,
            perspective,
            perspectiveOrigin,
        ]);
    }

    return classes.toString();
};
