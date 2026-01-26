const getOrderClasses = (orderByBreakpoint = {}, orderCustomByBreakpoint = {}) => {
  return Object.entries(orderByBreakpoint)
    .map(([breakpoint, value]) => {
      const prefix = breakpoint === "base" ? "" : `${breakpoint}:`;
      const orderValue = value === "custom" 
        ? `order-[${orderCustomByBreakpoint[breakpoint]}]`
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
        getOrderClasses(orderByBreakpoint, orderCustomByBreakpoint)
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
        getOrderClasses(orderByBreakpoint, orderCustomByBreakpoint)
      ] : [])
    );
  }

  return classnames(classes).toString();
}

