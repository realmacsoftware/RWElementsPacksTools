/**
 * Escapes whitespace inside [...] arbitrary-value segments so a formatted value
 * containing spaces (e.g. translate-x-[calc(100% - 10px)] or a cubic-bezier with
 * spaced arguments) stays one class token — Tailwind reads "_" as a space inside
 * arbitrary values. Whitespace outside brackets is left alone: Elements joins
 * responsive breakpoint variants with spaces, and those separators must survive.
 */
const escapeArbitraryWhitespace = (classString) => {
    if (!classString) return classString;
    return String(classString).replace(/\[[^\]]*\]/g, (segment) =>
        segment.replace(/\s+/g, "_")
    );
};
