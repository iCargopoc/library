export const processedData = (
    gridData: [Object],
    parentIdAttribute: string
): ?[] => {
    if (gridData && gridData.length > 0) {
        const processedGridData = [];
        gridData.forEach((gridDataItem: Object) => {
            const updatedData = { ...gridDataItem };
            updatedData.isParent = true;
            if (!("parentIdAttrForGrid" in updatedData)) {
                updatedData.parentIdAttrForGrid = parentIdAttribute;
            }
            delete updatedData.childData;
            processedGridData.push(updatedData);
            const { childData } = gridDataItem;
            if (childData && parentIdAttribute) {
                const parentId = gridDataItem[parentIdAttribute];
                const updatedChildData = { ...childData };
                const { data } = updatedChildData;
                if (
                    data &&
                    data.length > 0 &&
                    parentId !== null &&
                    parentId !== undefined
                ) {
                    const {
                        pageNum,
                        endCursor,
                        pageSize,
                        lastPage
                    } = childData;
                    data.forEach((dataItem: Object) => {
                        const updatedDataItem = { ...dataItem };
                        if (!(parentIdAttribute in updatedDataItem)) {
                            updatedDataItem[parentIdAttribute] = parentId;
                        }
                        updatedDataItem.pageNum = pageNum;
                        updatedDataItem.endCursor = endCursor;
                        updatedDataItem.pageSize = pageSize;
                        updatedDataItem.lastPage = lastPage;
                        processedGridData.push(updatedDataItem);
                    });
                }
            }
        });
        return processedGridData;
    }
    return [];
};
