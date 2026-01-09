const globalSpacingMargin = (app) => {
  const {
    globalSpacingEnabled: enabled,
    globalMargin: margin,
  } = app.props;

  return enabled == 'false'
    ? false
    : margin;
}

