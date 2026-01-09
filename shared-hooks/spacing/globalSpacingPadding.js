const globalSpacingPadding = (app) => {
  const {
    globalSpacingEnabled: enabled,
    globalPadding: padding,
  } = app.props;

  return enabled == 'false'
    ? false
    : padding;
}

