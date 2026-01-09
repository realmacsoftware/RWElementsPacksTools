const injectPrefixOnDarkModeColors = (prefix, classes) => {
    // give a string like `bg-surface-50 dark:bg-surface-400`
    // make sure all dark: prefixed colors get the prefix prepended to them
    return classes.replace(/dark:(.*)/g, `dark:${prefix}:$1`);
};

