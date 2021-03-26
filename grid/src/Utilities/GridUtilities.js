// @flow
export const setColumnWidths = (gridColumns: any[]): any[] => {
    let updatedColumns = [...gridColumns];

    // Get total width of hidden columns and total width grow of displayed columns, including grouped columns
    let totalHiddenColumnsWidth = 0;
    let totalDisplayColumnsWidthGrow = 0;
    gridColumns.forEach((gridCol: Object) => {
        const { columns } = gridCol;
        if (columns && columns.length > 0) {
            columns.forEach((col: Object) => {
                const { display, originalWidth, widthGrow } = col;
                if (
                    display === false &&
                    typeof originalWidth === "number" &&
                    originalWidth > 0
                ) {
                    totalHiddenColumnsWidth += originalWidth;
                } else if (display !== false) {
                    totalDisplayColumnsWidthGrow += widthGrow;
                }
            });
        } else {
            const { display, originalWidth, widthGrow } = gridCol;
            if (
                display === false &&
                typeof originalWidth === "number" &&
                originalWidth > 0
            ) {
                totalHiddenColumnsWidth += originalWidth;
            } else if (display !== false) {
                totalDisplayColumnsWidthGrow += widthGrow;
            }
        }
    });

    // If width grow is specified for atleast 1 column
    if (totalDisplayColumnsWidthGrow > 0) {
        // Loop through all columns that are not hidden, and divide totalHiddenColumnsWidth based on the ration widthGrow:totalDisplayColumnsWidthGrow
        updatedColumns = [...gridColumns].map((gridCol: Object): Object => {
            const updatedCol = { ...gridCol };
            const { columns } = updatedCol;
            if (columns && columns.length > 0) {
                updatedCol.columns = [...columns].map((col: Object): Object => {
                    const modifiedCol = { ...col };
                    const { originalWidth, widthGrow, display } = modifiedCol;
                    if (totalHiddenColumnsWidth > 0 && display !== false) {
                        modifiedCol.width =
                            originalWidth +
                            (widthGrow / totalDisplayColumnsWidthGrow) *
                                totalHiddenColumnsWidth;
                    } else {
                        modifiedCol.width = originalWidth;
                    }
                    return modifiedCol;
                });
            } else {
                const { originalWidth, widthGrow, display } = updatedCol;
                if (totalHiddenColumnsWidth > 0 && display !== false) {
                    updatedCol.width =
                        originalWidth +
                        (widthGrow / totalDisplayColumnsWidthGrow) *
                            totalHiddenColumnsWidth;
                } else {
                    updatedCol.width = originalWidth;
                }
            }
            return updatedCol;
        });
    }
    return updatedColumns;
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
): ?string => {
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
    return "";
};

export const findDeSelectedRows = (
    selectedRows: any,
    oldUserSelectedRowIdentifiers: any[],
    currentUserSelectedRowIdentifiers: any[],
    idAttribute: any
): any => {
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

export const convertToIndividualColumns = (managableColumns: any): any => {
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

export const hideColumns = (allColumns: any, gridColumns: any) => {
    const currentColumns = convertToIndividualColumns(gridColumns);
    allColumns.forEach((column: Object) => {
        const { columnId } = column;
        const hiddenColumn = currentColumns.find((col: Object): boolean => {
            const { display } = col;
            return columnId === col.columnId && display === false;
        });
        if (hiddenColumn !== null && hiddenColumn !== undefined) {
            column.toggleHidden(true);
        } else {
            column.toggleHidden(false);
        }
    });
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

export const getLeftOfColumn = (
    gridRef: any,
    index: number,
    isSubComponent: boolean,
    isGroupHeader: boolean
): number => {
    let leftToPass = 0;
    if (index > 0) {
        const gridElement =
            gridRef && gridRef.current ? gridRef.current : document;
        let columnElements = [];
        if (isSubComponent) {
            columnElements = isGroupHeader
                ? gridElement.querySelectorAll(
                      "[data-testid='subCompGrid-group-header']"
                  )
                : gridElement.querySelectorAll(
                      "[data-testid='subCompGrid-header']"
                  );
        } else {
            columnElements = isGroupHeader
                ? gridElement.querySelectorAll(
                      "[data-testid='grid-group-header']"
                  )
                : gridElement.querySelectorAll("[data-testid='grid-header']");
        }
        if (columnElements.length === 0) {
            const rowElement = isSubComponent
                ? gridElement.querySelector(
                      "[data-testid='subcontentrow_wrap']"
                  )
                : gridElement.querySelector("[data-testid='gridrowWrap']");
            if (rowElement !== null && rowElement !== undefined) {
                columnElements = isSubComponent
                    ? rowElement.querySelectorAll(
                          "[data-testid='subcontentrow_cell']"
                      )
                    : rowElement.querySelectorAll(
                          "[data-testid='gridrowcell']"
                      );
            }
        }
        if (columnElements.length > 0) {
            columnElements.forEach((elem: Object, elemIndex: number) => {
                if (elemIndex < index) {
                    const { offsetWidth } = elem;
                    leftToPass += offsetWidth || 0;
                }
            });
        }
    }
    return leftToPass;
};
