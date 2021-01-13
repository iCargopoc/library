// @flow
export const updatedActionsHeaderClass = (isDesktop: boolean) => {
    if (isDesktop) {
        const tableContainerList = document.getElementsByClassName(
            "neo-grid__tbody-list"
        );
        if (tableContainerList && tableContainerList.length > 0) {
            const tableContainer = tableContainerList[0];
            const tableHeaders = document.getElementsByClassName(
                "neo-grid__thead"
            );
            const tableHeader = tableHeaders[0];
            if (tableContainer.offsetHeight < tableContainer.scrollHeight) {
                tableHeader.classList.add("withScroll");
            } else {
                tableHeader.classList.remove("withScroll");
            }
        }
    }
};

export const findSelectedRows = (
    rows: any,
    selectedRowIds: any[],
    getRowInfo: any,
    isSubComponentRow: boolean
): any[] => {
    const rowsSelectedByUser = [];
    if (rows && rows.length > 0 && selectedRowIds) {
        Object.entries(selectedRowIds).forEach((objEntry: Object) => {
            const rowId = objEntry[0];
            const isSelected = objEntry[1];
            if (isSelected) {
                const selectedRow = rows.find((flatRow: Object): Object => {
                    const { id } = flatRow;
                    if (getRowInfo && typeof getRowInfo === "function") {
                        const { original } = flatRow;
                        const rowInfo = getRowInfo(original, isSubComponentRow);
                        return (
                            !(rowInfo && rowInfo.isRowSelectable === false) &&
                            id === rowId
                        );
                    }
                    return id === rowId;
                });
                if (selectedRow) {
                    const { original } = selectedRow;
                    const { isParent } = original;
                    if (isParent !== true) {
                        rowsSelectedByUser.push(original);
                    }
                }
            }
        });
    }
    return rowsSelectedByUser;
};

export const findSelectedRowIdAttributes = (
    selectedRows: Object,
    idAttribute: Object
): any[] => {
    const rowIdentifiers = [];
    if (selectedRows && selectedRows.length > 0 && idAttribute) {
        selectedRows.forEach((row: Object) => {
            const rowIdValue = row[idAttribute];
            if (rowIdValue !== null && rowIdValue !== undefined) {
                rowIdentifiers.push(rowIdValue);
            }
        });
    }
    return rowIdentifiers;
};

export const findSelectedRowIdFromIdAttribute = (
    selectedRows: any,
    idAttribute: any,
    userSelectedRowIdentifiers: any[]
): ?String => {
    if (
        selectedRows &&
        selectedRows.length > 0 &&
        userSelectedRowIdentifiers &&
        userSelectedRowIdentifiers.length > 0 &&
        idAttribute
    ) {
        const idAttributeValue = userSelectedRowIdentifiers[0];
        const selectedRow = selectedRows.find((row: Object): Object => {
            return row.original[idAttribute] === idAttributeValue;
        });
        if (selectedRow) {
            return selectedRow.id;
        }
    }
    return null;
};

export const findDeSelectedRows = (
    selectedRows: any,
    oldUserSelectedRowIdentifiers: any[],
    currentUserSelectedRowIdentifiers: any[],
    idAttribute: any
): any[] => {
    const deSelectedRows = [];
    if (
        selectedRows &&
        selectedRows.length > 0 &&
        oldUserSelectedRowIdentifiers &&
        oldUserSelectedRowIdentifiers.length > 0 &&
        idAttribute
    ) {
        oldUserSelectedRowIdentifiers.forEach((oldAttr: Object) => {
            if (!currentUserSelectedRowIdentifiers.includes(oldAttr)) {
                const deSelectedRow = selectedRows.find(
                    (row: Object): Object => {
                        return row.original[idAttribute] === oldAttr;
                    }
                );
                if (deSelectedRow && deSelectedRow.original) {
                    deSelectedRows.push(deSelectedRow.original);
                }
            }
        });
    }
    return deSelectedRows;
};

export const convertToIndividualColumns = (managableColumns: any): any[] => {
    let modifiedColumns = [];
    if (managableColumns && managableColumns.length > 0) {
        managableColumns.forEach((item: Object) => {
            const { columns } = item;
            if (columns && columns.length > 0) {
                modifiedColumns = [...modifiedColumns, ...columns];
            } else {
                modifiedColumns.push(item);
            }
        });
    }
    return [...modifiedColumns];
};

export const checkdisplayOfGroupedColumns = (groupedColumn: any): boolean => {
    const { headers } = groupedColumn;
    if (headers && headers.length > 0) {
        const headerToDisplay = headers.find((header: Object): boolean => {
            return header.display === true;
        });
        if (headerToDisplay) {
            return true;
        }
    }
    return false;
};

export const checkIfGroupsortIsApplicable = (columns: any): boolean => {
    const individualColumns = convertToIndividualColumns(columns);
    const sortableColumn = individualColumns.find(
        (col: Object): boolean => col.isSortable === true
    );
    if (sortableColumn) {
        return true;
    }
    return false;
};

export const findAllChildRows = (allRows: [Object]): any[] => {
    if (allRows && allRows.length > 0) {
        return allRows.filter((row: Object): Object => {
            let returnValue = false;
            const { original } = row;
            const { isParent } = original;
            returnValue = isParent !== true;
            return returnValue;
        });
    }
    return [];
};

export const checkIfGridHasGroupedColumns = (gridColumns: any): boolean => {
    let isGroupedColumns = false;
    gridColumns.forEach((col: Object) => {
        if (col && col.isGroupHeader === true) {
            isGroupedColumns = true;
        }
    });
    return isGroupedColumns;
};
