const Filter = [
    {
      title: "Filtering",
      heading: {}
    },
    {
        title: "Enable",
        id: "globalFilterEnable",
        ai: { name: "filterable", description: "Makes this element a filterable item, so a Filter or Filter Tags element in the same group can show or hide it." },
        responsive: false,
        switch: {
            default: false,
        }
    },
    {
        visible: "globalFilterEnable == true",
        title: "Group",
        id: "globalFilterGroup",
        ai: { name: "filterGroupMode", description: "How this item finds the filter group it belongs to: 'parent' uses its containing element, 'custom' uses filterGroupId." },
        responsive: false,
        segmented: {
            default: "parent",
            items: [
                {
                    title: "Parent",
                    value: "parent"
                },
                {
                    title: "Custom",
                    value: "custom"
                }
            ]
        }
    },
    {
        visible: "globalFilterEnable == true && globalFilterGroup == 'custom'",
        title: "Group ID",
        id: "globalFilterCustomGroupId",
        ai: { name: "filterGroupId", description: "Shared identifier linking this item to the Filter or Filter Tags element that controls it." },
        responsive: false,
        text: {
            default: "unique-group-id"
        }
    },
    {
        visible: "globalFilterEnable == true",
        title: "Transition",
        id: "globalFilterTransition",
        ai: { name: "filterTransition", description: "Animation played when this item is filtered in or out." },
        responsive: false,
        select: {
            use: "TransitionNames"
        }
    }
  ];
  
  export default Filter;
  