const DropShadow = {
    title: "Drop Shadow",
    id: "globalFiltersDropShadow",
    ai: { name: "dropShadow", description: "Drop-shadow filter, a theme shadow token. Follows the rendered shape (respects transparency), unlike boxShadow." },
    themeShadow: {
        mode: "drop",
        default: {
            base: {
                name: "none",
            },
        },
    },
};

export default DropShadow;
