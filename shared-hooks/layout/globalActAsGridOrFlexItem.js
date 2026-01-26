const getOrderClasses = (orderByBreakpoint = {}, orderCustomByBreakpoint = {}, breakpointNames = []) => {
  const allBreakpoints = ["base", ...breakpointNames];

  // Find custom value by cascading back through previous breakpoints
  const getCustomValue = (currentBreakpoint) => {
    const currentIndex = allBreakpoints.indexOf(currentBreakpoint);
    for (let i = currentIndex; i >= 0; i--) {
      const bp = allBreakpoints[i];
      if (orderCustomByBreakpoint[bp] !== undefined) {
        return orderCustomByBreakpoint[bp];
      }
    }
    return undefined;
  };

  return allBreakpoints
    .filter(bp => orderByBreakpoint[bp] !== undefined)
    .map((breakpoint) => {
      const value = orderByBreakpoint[breakpoint];
      const prefix = breakpoint === "base" ? "" : `${breakpoint}:`;
      const orderValue = value === "custom"
        ? `order-[${getCustomValue(breakpoint)}]`
        : `order-${value}`;
      return `${prefix}${orderValue}`;
    })
    .join(" ");
};

const globalActAsGridOrFlexItem = (app) => {
  const {
    globalGridOrFlexDisplayAs: displayAs,
    globalGridOrFlexItemSettings: settingsType,

    // Grid Item
    globalGridItemColSpan: colSpan,
    globlaGridItemColStart: colStart,
    globalGridItemColEnd: colEnd,
    globalGridItemRowSpan: rowSpan,
    globalGridItemRowStart: rowStart,
    globalGridItemRowEnd: rowEnd,

    // Flex Item
    globalFlexItemFlex: flex,
    globalFlexItemShrink: shrink,
    globalFlexItemGrow: grow,
    globalFlexItemBasis: basis,
    globalFlexItemBasisCustom: basisCustom,

    // General
    globalGridOrFlexItemAlignSelf: alignSelf,
    globalGridOrFlexItemJustifySelf: justifySelf,
  } = app.props;

  const {
    globalGridOrFlexItemOrder: orderByBreakpoint,
    globalGridOrFlexItemOrderCustom: orderCustomByBreakpoint,
  } = app.responsiveProps;

  const { names: breakpointNames } = app.theme.breakpoints;

  if (displayAs == "default") {
    return false;
  }

  const classes = [];

  if (displayAs == "flex") {
    classes.push(
      alignSelf,
      justifySelf,
      ...(settingsType === "advanced" ? [
        flex,
        shrink,
        grow,
        basis == "custom" ? basisCustom : basis,
        getOrderClasses(orderByBreakpoint, orderCustomByBreakpoint, breakpointNames)
      ] : [])
    );
  }

  if (displayAs == "grid") {
    classes.push(
      colSpan,
      rowSpan,
      ...(settingsType === "advanced" ? [
        colStart !== "col-start-auto" ? colStart : undefined,
        colEnd !== "col-end-auto" ? colEnd : undefined,
        rowStart !== "row-start-auto" ? rowStart : undefined,
        rowEnd !== "row-end-auto" ? rowEnd : undefined,
        alignSelf,
        justifySelf,
        getOrderClasses(orderByBreakpoint, orderCustomByBreakpoint, breakpointNames)
      ] : [])
    );
  }

  return classnames(classes).toString();
}

