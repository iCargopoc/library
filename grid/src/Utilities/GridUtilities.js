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
                            !(
                                rowInfo &&
                                (rowInfo.isRowSelectable === false ||
                                    rowInfo.className === "disabled")
                            ) && id === rowId
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

const checkAndPushRows = (
    gridRows: any,
    rowId: any,
    identifiersList: any,
    idAttribute: string,
    subComponentIdAttribute: string,
    getRowInfo: any,
    arrayToPush: any
) => {
    const selectedMainRow = gridRows.find((mainRow: Object): boolean => {
        const { original } = mainRow;
        return original[idAttribute] === rowId;
    });
    if (selectedMainRow !== null && selectedMainRow !== undefined) {
        const { subComponentData } = selectedMainRow.original;
        identifiersList.forEach((identifierValue: any) => {
            const selectedSubCompRow = subComponentData.find(
                (subCompRow: Object): boolean => {
                    return (
                        subCompRow[subComponentIdAttribute] === identifierValue
                    );
                }
            );
            if (
                selectedSubCompRow !== null &&
                selectedSubCompRow !== undefined
            ) {
                let isSelectable = true;
                if (getRowInfo && typeof getRowInfo === "function") {
                    const rowInfo = getRowInfo(selectedSubCompRow, true);
                    isSelectable =
                        rowInfo.isRowSelectable &&
                        rowInfo.className !== "disabled";
                }
                if (isSelectable !== false) {
                    arrayToPush.push(selectedSubCompRow);
                }
            }
        });
    }
};

export const getSelectedAndDeselectedSubCompRows = (
    gridRows: Array<Object>,
    getRowInfo: any,
    currentRowIdAttrs: any,
    oldRowIdAttrs: any,
    idAttribute: string,
    subComponentIdAttribute: string
): Object => {
    const selectedRows = [];
    const deselectedRows = [];
    if (
        idAttribute &&
        subComponentIdAttribute &&
        gridRows &&
        gridRows.length > 0
    ) {
        if (currentRowIdAttrs && currentRowIdAttrs.length > 0) {
            // Add selected rows
            currentRowIdAttrs.forEach((rowIdAttr: Object) => {
                const { rowId, rowIdentifiers } = rowIdAttr;
                if (rowIdentifiers && rowIdentifiers.length > 0) {
                    checkAndPushRows(
                        gridRows,
                        rowId,
                        rowIdentifiers,
                        idAttribute,
                        subComponentIdAttribute,
                        getRowInfo,
                        selectedRows
                    );
                }
            });
        }
        if (oldRowIdAttrs && oldRowIdAttrs.length > 0) {
            // Add deselected rows
            oldRowIdAttrs.forEach((rowIdAttr: Object) => {
                const { rowIdentifiers } = rowIdAttr;
                // Check if this Row Id is present in the current collection
                const valueInCurrentAttrs = currentRowIdAttrs.find(
                    (currentRowIdAttr: Object): boolean => {
                        const { rowId } = currentRowIdAttr;
                        return rowIdAttr.rowId === rowId;
                    }
                );
                if (
                    valueInCurrentAttrs !== null &&
                    valueInCurrentAttrs !== undefined
                ) {
                    const filteredRowIdentifiers = rowIdentifiers.filter(
                        (value: any): boolean => {
                            return !valueInCurrentAttrs.rowIdentifiers.includes(
                                value
                            );
                        }
                    );
                    if (
                        filteredRowIdentifiers &&
                        filteredRowIdentifiers.length > 0
                    ) {
                        checkAndPushRows(
                            gridRows,
                            rowIdAttr.rowId,
                            filteredRowIdentifiers,
                            idAttribute,
                            subComponentIdAttribute,
                            getRowInfo,
                            deselectedRows
                        );
                    }
                } else {
                    checkAndPushRows(
                        gridRows,
                        rowIdAttr.rowId,
                        rowIdentifiers,
                        idAttribute,
                        subComponentIdAttribute,
                        getRowInfo,
                        deselectedRows
                    );
                }
            });
        }
    }
    return {
        selectedRows,
        deselectedRows
    };
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

export const getColumnElementsForPinColumn = (
    gridRef: any,
    isSubComponent: boolean,
    isGroupHeader: boolean
): any => {
    let columnElements = [];

    const gridElement = gridRef && gridRef.current ? gridRef.current : document;
    const subCompElement =
        gridElement.querySelector("[data-testid='subcomponent-content']") ||
        document;
    if (isSubComponent) {
        columnElements = isGroupHeader
            ? subCompElement.querySelectorAll(
                  "[data-testid='subCompGrid-group-header']"
              )
            : subCompElement.querySelectorAll(
                  "[data-testid='subCompGrid-header']"
              );
    } else {
        columnElements = isGroupHeader
            ? gridElement.querySelectorAll("[data-testid='grid-group-header']")
            : gridElement.querySelectorAll("[data-testid='grid-header']");
    }
    if (columnElements.length === 0) {
        let rowElement = null;
        if (isSubComponent) {
            rowElement = subCompElement.querySelector(
                "[data-testid='subcontentrow_wrap']"
            );
        } else {
            rowElement = gridElement.querySelector(
                "[data-testid='gridrowWrap']"
            );
        }
        if (rowElement !== null && rowElement !== undefined) {
            columnElements = isSubComponent
                ? rowElement.querySelectorAll(
                      "[data-testid='subcontentrow_cell']"
                  )
                : rowElement.querySelectorAll("[data-testid='gridrowcell']");
        }
    }
    return columnElements;
};

export const getLeftOfColumn = (
    gridRef: any,
    index: number,
    isSubComponent: boolean,
    isGroupHeader: boolean
): number => {
    let leftToPass = 0;
    if (index > 0) {
        const columnElements = getColumnElementsForPinColumn(
            gridRef,
            isSubComponent,
            isGroupHeader
        );
        columnElements.forEach((elem: Object, elemIndex: number) => {
            if (elemIndex < index) {
                const { offsetWidth } = elem;
                leftToPass += offsetWidth;
            }
        });
    }
    return leftToPass;
};

export const getTotalWidthOfPinnedColumns = (
    type: string,
    gridRef: any,
    isSubComponent: boolean,
    isGroupHeader: boolean
): number => {
    let totalWidth = 0;
    const columnElements = getColumnElementsForPinColumn(
        gridRef,
        isSubComponent,
        isGroupHeader
    );
    columnElements.forEach((elem: Object) => {
        const { classList, offsetWidth } = elem;
        if (
            (type === "left" && classList.contains("ng-sticky--left")) ||
            (type === "right" && classList.contains("ng-sticky--right"))
        ) {
            totalWidth += offsetWidth;
        }
    });
    return totalWidth;
};

export const isLastPinnedColumn = (
    gridRef: any,
    index: number,
    isSubComponent: boolean,
    isGroupHeader: boolean
): boolean => {
    let isLast = true;
    const columnElements = getColumnElementsForPinColumn(
        gridRef,
        isSubComponent,
        isGroupHeader
    );
    columnElements.forEach((elem: Object, elemIndex: number) => {
        if (elemIndex > index) {
            const { classList } = elem;
            if (classList.contains("ng-sticky--left")) {
                isLast = false;
            }
        }
    });
    return isLast;
};

export const updateAccessorList = (currentList: any): any => {
    return [...currentList].map((item: Object): Object => {
        const updatedItem = { ...item };
        const { key } = item;
        const updatedKey = key.split("original.subComponentData.*.").pop();
        updatedItem.key = `original.${updatedKey}`;
        return updatedItem;
    });
};

export const getParentRowsFromList = (rows: any): any => {
    const parentRows = rows.filter((row: Object): boolean => {
        const { original } = row;
        const { isParent } = original;
        return isParent === true;
    });
    return parentRows;
};

export const getChildRowsFromParentId = (
    rows: any,
    parentIdValue: any,
    parentIdAttribute: string
): any => {
    const childRowsOfParent = rows.filter((row: Object): boolean => {
        const { original } = row;
        const { isParent } = original;
        return (
            isParent !== true && original[parentIdAttribute] === parentIdValue
        );
    });
    return childRowsOfParent;
};

export const extractGridDataFromRows = (rows: any): any => {
    const rowsToReturn = [];
    rows.forEach((row: Object): Object => {
        const { original } = row;
        const { isParent } = original;
        if (!isParent) {
            rowsToReturn.push(original);
        }
    });
    return rowsToReturn;
};
