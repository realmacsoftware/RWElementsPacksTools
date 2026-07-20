const Filters = [
    {
        globalControl: "ControlType",
        id: "{{value}}Filters",
        ai: { name: "filters", description: "Enable/disable filters.", values: ["none", "static", "hover"] },
    },
    {
        visible: "globalControlTypeFilters == 'hover'",
        globalControl: "HoverGroup",
        id: "{{value}}Filters",
    },
    {
        visible:
            "globalControlTypeFilters == 'hover' && globalHoverGroupFilters == 'custom'",
        title: "ID",
        id: "globalHoverGroupCustomIdFilters",
        text: {
            default: "",
        },
    },
    {
        visible: "globalHoverGroupFilters == 'custom'",
        title: "The ID of the parent element to trigger the filters.",
        information: {},
    },
    {
        visible:
            "globalControlTypeFilters != 'none' && globalControlTypeFilters != 'static'",
        title: "State",
        id: "globalFiltersState",
        responsive: false,
        segmented: {
            default: "start",
            items: [
                {
                    title: "Start",
                    value: "start",
                },
                {
                    title: "End",
                    value: "end",
                },
            ],
        },
    },
    {
        visible: "globalControlTypeFilters != 'none'",
        divider: {},
    },
    {
        visible: "globalControlTypeFilters != 'none'",
        title: "Filters",
        heading: {},
    },
    {
        visible:
            "globalControlTypeFilters == 'static' || (globalControlTypeFilters == 'hover' && globalFiltersState == 'start')",
        ai: { visible: "filters == 'static'" },
        globalControl: "Blur",
    },
    {
        visible:
            "globalControlTypeFilters == 'static' || (globalControlTypeFilters == 'hover' && globalFiltersState == 'start')",
        ai: { visible: "filters == 'static'" },
        globalControl: "Brightness",
    },
    {
        visible:
            "globalControlTypeFilters == 'static' || (globalControlTypeFilters == 'hover' && globalFiltersState == 'start')",
        ai: { visible: "filters == 'static'" },
        globalControl: "Saturate",
    },
    {
        visible:
            "globalControlTypeFilters == 'static' || (globalControlTypeFilters == 'hover' && globalFiltersState == 'start')",
        globalControl: "DropShadow",
    },
    {
        visible:
            "(globalControlTypeFilters == 'hover' && globalFiltersState == 'end')",
        ai: { name: "{{value}}Hover", visible: "filters == 'hover'" },
        globalControl: "Blur",
        id: "{{value}}End",
    },
    {
        visible:
            "(globalControlTypeFilters == 'hover' && globalFiltersState == 'end')",
        ai: { name: "{{value}}Hover", visible: "filters == 'hover'" },
        globalControl: "Brightness",
        id: "{{value}}End",
    },
    {
        visible:
            "(globalControlTypeFilters == 'hover' && globalFiltersState == 'end')",
        ai: { name: "{{value}}Hover", visible: "filters == 'hover'" },
        globalControl: "Saturate",
        id: "{{value}}End",
    },
    {
        visible:
            "(globalControlTypeFilters == 'hover' && globalFiltersState == 'end')",
        globalControl: "DropShadow",
        id: "{{value}}End",
    },
    {
        visible: "globalControlTypeFilters != 'none'",
        title: "Backdrop Filters",
        heading: {},
    },
    {
        visible:
            "globalControlTypeFilters == 'static' || (globalControlTypeFilters == 'hover' && globalFiltersState == 'start')",
        ai: { visible: "filters == 'static'" },
        globalControl: "BackdropBlur",
    },
    {
        visible:
            "(globalControlTypeFilters == 'hover' && globalFiltersState == 'end')",
        ai: { name: "{{value}}Hover", visible: "filters == 'hover'" },
        globalControl: "BackdropBlur",
        id: "{{value}}End",
    },
];

export default Filters;
