// @flow

// Update display value of column based on columnId
const updatedDisplayOfColumn = (
    column: Object,
    columnid: string,
    flag: boolean
): Object => {
    const updatedColumn = { ...column };
    const { isGroupHeader, columnId } = column;
    const groupedColumns = column.columns;
    if (isGroupHeader === true && groupedColumns && groupedColumns.length > 0) {
        let atleastOneColumnDisplayed = false;
        const updatedColumns = [...groupedColumns].map(
            (col: Object): Object => {
                const updatedCol = { ...col };
                if (
                    (columnid &&
                        (columnid === "all" || columnid === col.columnId)) ||
                    columnid === undefined
                ) {
                    updatedCol.display = flag;
                }
                atleastOneColumnDisplayed =
                    atleastOneColumnDisplayed || updatedCol.display;
                return updatedCol;
            }
        );
        updatedColumn.display = atleastOneColumnDisplayed;
        updatedColumn.columns = updatedColumns;
    } else if (
        (columnid && (columnid === "all" || columnid === columnId)) ||
        columnid === undefined
    ) {
        updatedColumn.display = flag;
    }
    return updatedColumn;
};

// Update display value of managedAdditionalColumn state with given value
const updatedDisplayOfAdditionalColumn = (
    flag: boolean,
    isSubComponentColumn: boolean,
    update: Function,
    setManagedAdditionalColumn: Function,
    managedAdditionalColumn: Function,
    setManagedSubComponentAdditionalColumn: Function,
    managedSubComponentAdditionalColumn: Function
) => {
    if (isSubComponentColumn) {
        setManagedSubComponentAdditionalColumn(
            update(managedSubComponentAdditionalColumn, {
                display: { $set: flag }
            })
        );
    } else {
        setManagedAdditionalColumn(
            update(managedAdditionalColumn, {
                display: { $set: flag }
            })
        );
    }
};

// update the display flag value of column or all columns in managedColumns and managedAdditionalColumn state, based on the selection
export const updateColumnsDisplay = (
    columnid: string,
    isadditionalcolumn: boolean,
    checked: boolean,
    isSubComponentColumn: boolean,
    isAdditionalColumnPresent: boolean,
    update: Function,
    setManagedColumns: any,
    managedColumns: any,
    setManagedSubComponentColumns: any,
    managedSubComponentColumns: any,
    setManagedAdditionalColumn: any,
    managedAdditionalColumn: any,
    setManagedSubComponentAdditionalColumn: any,
    managedSubComponentAdditionalColumn: any
): any => {
    if (
        isAdditionalColumnPresent &&
        (columnid === "all" || isadditionalcolumn === true)
    ) {
        // Update additional column state if columnid is "all" or selected column has "isadditionalcolumn"
        updatedDisplayOfAdditionalColumn(
            checked,
            isSubComponentColumn,
            update,
            setManagedAdditionalColumn,
            managedAdditionalColumn,
            setManagedSubComponentAdditionalColumn,
            managedSubComponentAdditionalColumn
        );
    }
    if (isadditionalcolumn !== true) {
        // Update main columns state based on selection and columnid, if selected column doesn't have "isadditionalcolumn"
        if (isSubComponentColumn) {
            const updatedManagedColumns = [...managedSubComponentColumns].map(
                (column: Object): any => {
                    return updatedDisplayOfColumn(column, columnid, checked);
                }
            );
            setManagedSubComponentColumns(
                update(managedSubComponentColumns, {
                    $set: updatedManagedColumns
                })
            );
        } else {
            const updatedManagedColumns = [...managedColumns].map(
                (column: Object): any => {
                    return updatedDisplayOfColumn(column, columnid, checked);
                }
            );
            setManagedColumns(
                update(managedColumns, {
                    $set: updatedManagedColumns
                })
            );
        }
    }
};
