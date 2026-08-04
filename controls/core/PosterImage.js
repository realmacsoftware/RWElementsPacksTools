import pkg from "lodash";
const { cloneDeep } = pkg;
import Image from "./Image.js";

/**
 * Image control tuned for video poster/thumbnail usage.
 * Same inspector as Image; LLM-facing copy names the poster role.
 */
const PosterImage = cloneDeep(Image);

const imageType = PosterImage.find((p) => p.id === "imageType");
if (imageType?.ai) {
  imageType.ai.description =
    "Thumbnail/poster source mode: 'resource' (picked asset), 'custom' (URL/path string), or 'cms' (CMS field binding).";
}

const imageAlt = PosterImage.find((p) => p.id === "imageAlt");
if (imageAlt?.ai) {
  imageAlt.ai.description = "Thumbnail alt text for accessibility/SEO.";
}

const imageMode = PosterImage.find((p) => p.id === "imageMode");
if (imageMode) {
  imageMode.ai = {
    exclude: true,
    reason:
      "Inspector-only light/dark editing toggle for the thumbnail sources; light and dark thumbnail properties are curated separately.",
  };
}

export default PosterImage;
