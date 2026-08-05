const globalSpacingPadding = (app) => {
  const {
    globalSpacingEnabled: enabled,
    globalPadding: padding,
  } = app.props;

  return switchToBool(enabled) === false
    ? false
    : padding;
}

