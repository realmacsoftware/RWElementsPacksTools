const globalPerspective3D = (app, args = {}) => {
    const {
        globalControlType3D: type,
        globalTransformPerspective: perspective,
        globalTransformPerspectiveOrigin: perspectiveOrigin,
    } = app.props;

    const classes = classnames();

    if (type != "none") {
        classes.add([
            perspective,
            perspectiveOrigin,
        ]);
    }

    return classes.toString();
};
