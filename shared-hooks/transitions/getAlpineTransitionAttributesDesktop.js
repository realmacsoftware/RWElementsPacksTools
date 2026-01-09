const alpineTransitionsDesktop = {
    fade: {
        enter: "transition ease-out",
        enterStart: "opacity-0",
        enterEnd: "opacity-100",
        leave: "transition ease-in",
        leaveStart: "opacity-100",
        leaveEnd: "opacity-0",
    },
    slideDown: {
        enter: "transition ease-out duration-300",
        enterStart: "opacity-0 -translate-y-3",
        enterEnd: "opacity-100 translate-y-0",
        leave: "transition ease-in duration-300",
        leaveStart: "opacity-100 translate-y-0",
        leaveEnd: "opacity-0 -translate-y-3",
    },
    slideDownShort: {
        enter: "transition ease-out",
        enterStart: "opacity-0 -translate-y-3",
        enterEnd: "opacity-100 translate-y-0",
        leave: "transition ease-in",
        leaveStart: "opacity-100 translate-y-0",
        leaveEnd: "opacity-0 -translate-y-3",
    },
    slideUp: {
        enter: "transition ease-out duration-300",
        enterStart: "opacity-0 translate-y-3",
        enterEnd: "opacity-100 translate-y-0",
        leave: "transition ease-in duration-300",
        leaveStart: "opacity-100 translate-y-0",
        leaveEnd: "opacity-0 translate-y-3",
    },
    slideUpShort: {
        enter: "transition ease-out",
        enterStart: "opacity-0 translate-y-3",
        enterEnd: "opacity-100 translate-y-0",
        leave: "transition ease-in",
        leaveStart: "opacity-100 translate-y-0",
        leaveEnd: "opacity-0 translate-y-3",
    },
    slideLeft: {
        enter: "transition ease-out duration-300",
        enterStart: "opacity-0 -translate-x-3",
        enterEnd: "opacity-100 translate-x-0",
        leave: "transition ease-in duration-300",
        leaveStart: "opacity-100 translate-x-0",
        leaveEnd: "opacity-0 -translate-x-3",
    },
    slideLeftShort: {
        enter: "transition ease-out",
        enterStart: "opacity-0 translate-x-3",
        enterEnd: "opacity-100 translate-x-0",
        leave: "transition ease-in",
        leaveStart: "opacity-100 translate-x-0",
        leaveEnd: "opacity-0 translate-x-3",
    },
    slideRight: {
        enter: "transition ease-out duration-300",
        enterStart: "opacity-0 -translate-x-3",
        enterEnd: "opacity-100 translate-x-0",
        leave: "transition ease-in duration-300",
        leaveStart: "opacity-100 translate-x-0",
        leaveEnd: "opacity-0 -translate-x-3",
    },
    slideRightShort: {
        enter: "transition ease-out",
        enterStart: "opacity-0 -translate-x-3",
        enterEnd: "opacity-100 translate-x-0",
        leave: "transition ease-in",
        leaveStart: "opacity-100 translate-x-0",
        leaveEnd: "opacity-0 -translate-x-3",
    },
    zoom: {
        enter: "transition ease-out",
        enterStart: "opacity-0 scale-95",
        enterEnd: "opacity-100 scale-100",
        leave: "transition ease-in",
        leaveStart: "opacity-100 scale-100",
        leaveEnd: "opacity-0 scale-95",
    },
    none: {
        enter: "duration-0",
        enterStart: "",
        enterEnd: "",
        leave: "duration-0",
        leaveStart: "",
        leaveEnd: "",
    },
};

const getAlpineTransitionAttributesDesktop = (transitionName) => {
    const { enter, enterStart, enterEnd, leave, leaveStart, leaveEnd } =
        alpineTransitionsDesktop[transitionName] ||
        alpineTransitionsDesktop.fade;

    const attributes = {
        "x-transition:enter": enter,
        "x-transition:enter-start": enterStart,
        "x-transition:enter-end": enterEnd,
        "x-transition:leave": leave,
        "x-transition:leave-start": leaveStart,
        "x-transition:leave-end": leaveEnd,
    };

    return Object.entries(attributes)
        .filter(([key, value]) => value)
        .map(([key, value]) => `${key}="${value}"`)
        .join(" ");
};

