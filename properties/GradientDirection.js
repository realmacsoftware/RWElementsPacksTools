import GradientConicAngle from "./GradientConicAngle.js";
import GradientLinearDirection from "./GradientLinearDirection.js";
import GradientRadialPosition from "./GradientRadialPosition.js";

const GradientDirection = {
    default: GradientLinearDirection.default,
    items: [
        ...GradientLinearDirection.items,
        ...GradientRadialPosition.items,
        ...GradientConicAngle.items,
    ],
};

export default GradientDirection;
