const DeepSearchLabel = (filterData, key) => {
    let label = "";
    filterData.filter.forEach((item) => {
        if (!item.isSubFilter && !item.isGroupFilter && key === item.name)
            label = item.label;
        if (item.isSubFilter) {
            item.subFilters.forEach((subItem) => {
                if (subItem.name === key) label = subItem.label;
                if (subItem.isGroupFilter && subItem.groupFilter) {
                    subItem.groupFilter.forEach((groupItem) => {
                        if (groupItem.name === key) label = groupItem.label;
                    });
                }
            });
        }
        if (item.isGroupFilter) {
            item.groupFilter.forEach((groupItem) => {
                if (groupItem.name === key) label = groupItem.label;
            });
        }
    });
    return label;
};

export { DeepSearchLabel };
