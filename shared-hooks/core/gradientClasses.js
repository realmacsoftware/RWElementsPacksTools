const HUE_INTERPOLATION_KEYWORDS = [
  "longer",
  "shorter",
  "increasing",
  "decreasing",
];

const resolveArbitraryInterpolation = (interpolation) => {
  if (HUE_INTERPOLATION_KEYWORDS.includes(interpolation)) {
    return `in_oklch_${interpolation}_hue`;
  }

  return `in_${interpolation}`;
};

const normalizeGradientImageClass = (className, interpolation = "") => {
  if (!className) {
    return "";
  }

  const parts = String(className).split(":");
  let baseClass = parts.pop();
  const prefix = parts.length ? `${parts.join(":")}:` : "";

  baseClass = baseClass.replace(/^bg-gradient-to-/, "bg-linear-to-");

  if (
    interpolation &&
    !baseClass.includes("/") &&
    /^-?bg-(linear|radial|conic)(-|$|\[|\()/.test(baseClass)
  ) {
    if (baseClass.includes("[")) {
      // Tailwind v4 does not support the `/interpolation` modifier on arbitrary
      // gradient values; the method must be baked into the bracket instead.
      baseClass = baseClass.replace(
        /\]$/,
        `_${resolveArbitraryInterpolation(interpolation)}]`
      );
    } else {
      baseClass = `${baseClass}/${interpolation}`;
    }
  }

  return `${prefix}${baseClass}`;
};

const resolveGradientImageClass = (
  type,
  linearDirection,
  radialPosition,
  conicAngle,
  interpolation = ""
) => {
  let selectedDirection = linearDirection;

  if (type === "radial") {
    selectedDirection = radialPosition || linearDirection;
  } else if (type === "conic") {
    selectedDirection = conicAngle || linearDirection;
  }

  return normalizeGradientImageClass(selectedDirection, interpolation);
};
