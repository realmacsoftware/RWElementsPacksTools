const globalSpacing = (app) => {
  const {
    globalSpacingEnabled: enabled,
    globalMargin: margin,
    globalPadding: padding,
  } = app.props;

  if (enabled == 'false') {
    return false;
  }

  return classnames([margin, padding]).toString();
}
