const DeepSearchLabel = (filterData, key) => {
    let label = "";
    filterData.filter.forEach((item) => {
        if (!item.isSubFilter && key === item.name) label = item.label;
        if (item.isSubFilter) {
            item.subFilters.forEach((subItem) => {
                if (subItem.name === key) label = subItem.label;
                if (subItem.isGroupFilter) {
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

const DeepSearchName = (filterData, key) => {
    let name = "";
    filterData.filter.forEach((item) => {
        if (!item.isSubFilter && key === item.label) name = item.name;
        if (item.isSubFilter) {
            item.subFilters.forEach((subItem) => {
                if (subItem.label === key) name = subItem.name;
                if (subItem.isGroupFilter) {
                    subItem.groupFilter.forEach((groupItem) => {
                        if (groupItem.label === key) name = groupItem.name;
                    });
                }
            });
        }
        if (item.isGroupFilter) {
            item.groupFilter.forEach((groupItem) => {
                if (groupItem.label === key) name = groupItem.name;
            });
        }
    });
    return name;
};

export { DeepSearchLabel, DeepSearchName };
