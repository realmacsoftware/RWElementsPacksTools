import pkg from "lodash";
const { cloneDeep } = pkg;
import AspectRatio from "./AspectRatio.js";

/**
 * AspectRatio for Video: ObjectFit copy refers to the video/poster box.
 */
const AspectRatioVideo = cloneDeep(AspectRatio);

const objectFit = AspectRatioVideo.find((p) => p.globalControl === "ObjectFit");
if (objectFit) {
  objectFit.ai = {
    description: "How the video/poster is resized within its box (CSS object-fit).",
  };
}

export default AspectRatioVideo;
