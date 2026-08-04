const Reveals = [
  {
    title: "Mode",
    id: "revealScrub",
    ai: { name: "scrub", description: "Playback mode: false plays the animation when triggered; true ties animation progress to scroll position between triggerStart and triggerEnd." },
    responsive: false,
    segmented: {
      default: false,
      items: [
        { title: "Smooth", value: false },
        { title: "Scrub", value: true },
      ]
    }
  },
  {
    title: "Animation",
    id: "revealAnimationName",
    ai: { name: "animation", description: "Reveal animation: fade, slide, zoom, lightSpeed, or rotate." },
    responsive: false,
    select: {
      use: "RevealAnimations"
    }
  },
  {
    title: "Direction",
    id: "revealAnimationDirection",
    ai: { name: "direction", description: "Direction the reveal animation travels: up, down, left, or right." },
    responsive: false,
    segmented: {
      default: "up",
      items: [
        { icon: "arrow.up", value: "up" },
        { icon: "arrow.down", value: "down" },
        { icon: "arrow.left", value: "left" },
        { icon: "arrow.right", value: "right" }
      ]
    }
  },
  {
    title: "Distance",
    id: "revealDistance",
    ai: { name: "distance", description: "How far the element travels during the animation, as a CSS length (e.g. '200px')." },
    responsive: false,
    text: {
      default: "200px"
    }
  },
  {
    visible: "revealAnimationName == 'rotate'",
    title: "Degrees",
    id: "revealDegrees",
    ai: { name: "degrees", description: "Rotation amount in degrees." },
    responsive: false,
    number: {
      default: "90"
    }
  },
  {
    divider: {}
  },
  {
    title: "Trigger",
    heading: {}
  },
  {
    title: "Play",
    id: "revealPlay",
    ai: { name: "play", description: "When the animation plays: 'enter-once' the first time it enters the viewport, 'enter-always' every time it enters, 'enter-exit' on enter and reversed on exit." },
    responsive: false,
    select: {
      default: "enter-exit",
      items: [
        { title: "Once on enter", value: "enter-once" },
        { title: "Always on enter", value: "enter-always" },
        { title: "Enter and exit", value: "enter-exit" },
      ]
    }
  },
  {
    title: "Start",
    id: "revealStart",
    ai: { name: "triggerStart", description: "Scroll position where the reveal starts: 'entering-screen' as the element enters the viewport, 'middle-of-screen' at the viewport centre, 'exiting-screen' as it leaves the top." },
    responsive: false,
    segmented: {
      default: "entering-screen",
      items: [
        { icon: "align.vertical.bottom.fill", value: "entering-screen" },
        { icon: "align.vertical.center.fill", value: "middle-of-screen" },
        { icon: "align.vertical.top.fill", value: "exiting-screen" }
      ]
    }
  },
  {
    title: "End",
    id: "revealEnd",
    ai: { name: "triggerEnd", description: "Scroll position where the reveal ends: 'entering-screen' as the element enters the viewport, 'middle-of-screen' at the viewport centre, 'exiting-screen' as it leaves the top." },
    responsive: false,
    segmented: {
      default: "exiting-screen",
      items: [
        { icon: "align.vertical.bottom.fill", value: "entering-screen" },
        { icon: "align.vertical.center.fill", value: "middle-of-screen" },
        { icon: "align.vertical.top.fill", value: "exiting-screen" }
      ]
    }
  },
  {
    divider: {}
  },
  {
    title: "Timing",
    heading: {}
  },
  {
    title: "Easing",
    id: "revealEasing",
    ai: { name: "easing", description: "Easing curve: linear, power0-power4, sine.out, circ.out, expo.out, back.out, elastic.out, or bounce.out." },
    responsive: false,
    select: {
      default: "power1",
      items: [
        { title: "Linear", value: "linear" },
        { title: "Power0", value: "power0" },
        { title: "Power1", value: "power1" },
        { title: "Power2", value: "power2" },
        { title: "Power3", value: "power3" },
        { title: "Power4", value: "power4" },
        { title: "Sine", value: "sine.out" },
        { title: "Circ", value: "circ.out" },
        { title: "Expo", value: "expo.out" },
        { title: "Back", value: "back.out" },
        { title: "Elastic", value: "elastic.out" },
        { title: "Bounce", value: "bounce.out" }
      ]
    }
  },
  {
    visible: "revealScrub == false",
    title: "Duration",
    id: "revealDuration",
    ai: { name: "duration", description: "Animation duration in milliseconds." },
    responsive: false,
    number: {
      default: 500
    }
  },
  {
    visible: "revealScrub == false",
    title: "Delay",
    id: "revealDelay",
    ai: { name: "delay", description: "Delay before the animation starts, in milliseconds." },
    responsive: false,
    number: {
      default: 0,
      subtitle: "in milliseconds"
    }
  },
  {
    divider: {}
  },
  {
    title: "Debug",
    heading: {}
  },
  {
    title: "Markers",
    id: "revealDebug",
    ai: { name: "debugMarkers", description: "Show scroll trigger start/end markers for debugging. Leave off for published sites." },
    responsive: false,
    switch: {
      default: false
    }
  },
  {
    information: {},
    title: "Visualize animation start and end points."
  },
];

export default Reveals;
