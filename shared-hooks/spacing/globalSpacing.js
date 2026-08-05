const globalSpacing = (app) => {
  const {
    globalSpacingEnabled: enabled,
    globalMargin: margin,
    globalPadding: padding,
  } = app.props;

  if (switchToBool(enabled) === false) {
    return false;
  }

  return classnames([margin, padding]).toString();
}
