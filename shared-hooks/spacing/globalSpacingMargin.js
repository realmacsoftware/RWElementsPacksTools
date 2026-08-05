const globalSpacingMargin = (app) => {
  const {
    globalSpacingEnabled: enabled,
    globalMargin: margin,
  } = app.props;

  return switchToBool(enabled) === false
    ? false
    : margin;
}

