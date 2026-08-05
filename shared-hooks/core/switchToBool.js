/**
 * Normalizes a switch prop to a boolean.
 *
 * Non-responsive switches deliver real booleans, but projects saved while a
 * switch was responsive deliver the flattened strings "true"/"false". If a
 * breakpoint-prefixed string like "true md:false" ever appears, the base
 * (first) token wins. Returns undefined for any other value so call sites
 * keep their own default behavior via strict comparison.
 */
const switchToBool = (value) => {
  if (value === true || value === false) {
    return value;
  }

  if (typeof value === "string") {
    const base = value.trim().split(/\s+/)[0];
    if (base === "true") return true;
    if (base === "false") return false;
  }

  return undefined;
};
