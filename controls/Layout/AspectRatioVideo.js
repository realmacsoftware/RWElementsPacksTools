import pkg from "lodash";
const { cloneDeep } = pkg;
import AspectRatio from "./AspectRatio.js";

/**
 * AspectRatio for Video: ObjectFit/ObjectPosition copy refers to the video/poster box.
 */
const AspectRatioVideo = cloneDeep(AspectRatio);

const objectFit = AspectRatioVideo.find((p) => p.globalControl === "ObjectFit");
if (objectFit) {
  objectFit.ai = {
    description: "How the video/poster is resized within its box (CSS object-fit).",
  };
}

const objectPosition = AspectRatioVideo.find((p) => p.globalControl === "ObjectPosition");
if (objectPosition) {
  objectPosition.ai = {
    description: "Focal point of the video/poster within its box when cropped.",
  };
}

export default AspectRatioVideo;
