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
    baseClass = `${baseClass}/${interpolation}`;
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
