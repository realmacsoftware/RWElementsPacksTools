const Rotate3D = [
  {
    title: "Rotate",
    heading: {},
  },
  {
    title: "X",
    id: "globalTransformRotateX",
    ai: {
      name: "rotateX",
      description: "3D rotation about the X axis, in degrees: tilts the top and bottom edges toward or away from the viewer. In hover and mouse modes rotateX is the start value and rotateXEnd the end value.",
    },
    format: "rotate-x-[{{value}}deg]",
    number: {
      default: 0,
      subtitle: "in degrees",
    },
  },
  {
    title: "Y",
    id: "globalTransformRotateY",
    ai: {
      name: "rotateY",
      description: "3D rotation about the Y axis, in degrees: swings the left and right edges toward or away from the viewer. In hover and mouse modes rotateY is the start value and rotateYEnd the end value.",
    },
    format: "rotate-y-[{{value}}deg]",
    number: {
      default: 0,
      subtitle: "in degrees",
    },
  },
];

export default Rotate3D;
