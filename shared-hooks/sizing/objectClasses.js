const objectClasses = (rw) => {
    const { aspectRatio, objectFit, objectPosition } = rw.props;

    return classnames([
        aspectRatio !== "aspect-[auto]" ? objectFit : "",
        objectPosition,
    ]).toString();
};

