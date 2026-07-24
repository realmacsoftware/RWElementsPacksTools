export const Video = [
  {
    visible: "globalBgType == 'video'",
    ai: { name: "bgVideo", description: "Background video resource ID.", visible: "bgStyle == 'video'" },
    title: "Video",
    id: "globalBgVideo",
    resource: { accepts: "video/*" },
  },
  {
    visible: "globalBgType == 'video'",
    title: "Aspect Ratio",
    heading: {}
  },
  {
    visible: "globalBgType == 'video'",
    ai: { name: "bgVideoAspectRatio", description: "Force a 16:9 aspect ratio on the container.", visible: "bgStyle == 'video'" },
    title: "Enable",
    responsive: false,
    id: "globalBgVideoAspectRatio",
    switch: {
      default: true,
    }
  },
  {
    visible: "globalBgType == 'video'",
    title: "This will force an aspect ratio of 16:9 on the Container.",
    information: {},
  },
];

export default Video;
