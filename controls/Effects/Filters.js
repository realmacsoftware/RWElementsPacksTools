const Filters = [
    {
        globalControl: "ControlType",
        id: "{{value}}Filters",
        ai: { name: "filters", description: "Enable/disable filters." },
    },
    {
        visible: "globalControlTypeFilters == 'hover'",
        ai: {
            name: "filtersHoverTrigger",
            description: "Which element's hover triggers the filters."
        },
        globalControl: "HoverGroup",
        id: "{{value}}Filters",
    },
    {
        visible:
            "globalControlTypeFilters == 'hover' && globalHoverGroupFilters == 'custom'",
        ai: {
            name: "filtersHoverTriggerId",
            description: "ID of the element that triggers the hover filters."
        },
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
        ai: { exclude: true, reason: "Inspector UI toggle for editing the hover start/end state; the filter values themselves are curated separately for each state." },
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
        ai: { visible: "filters != 'none'" },
        globalControl: "Blur",
    },
    {
        visible:
            "globalControlTypeFilters == 'static' || (globalControlTypeFilters == 'hover' && globalFiltersState == 'start')",
        ai: { visible: "filters != 'none'" },
        globalControl: "Brightness",
    },
    {
        visible:
            "globalControlTypeFilters == 'static' || (globalControlTypeFilters == 'hover' && globalFiltersState == 'start')",
        ai: { visible: "filters != 'none'" },
        globalControl: "Saturate",
    },
    {
        visible:
            "globalControlTypeFilters == 'static' || (globalControlTypeFilters == 'hover' && globalFiltersState == 'start')",
        ai: { visible: "filters != 'none'" },
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
        ai: { name: "{{value}}Hover", visible: "filters == 'hover'" },
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
        ai: { visible: "filters != 'none'" },
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
