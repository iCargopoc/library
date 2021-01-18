// @flow
export const findSelectedColumn = (
    columnsToSearch: Object,
    columnKey: Object
): Object => {
    let selectedColumn = null;
    columnsToSearch.forEach((col: Object) => {
        const { isGroupHeader, display, id, accessor, columns } = col;
        if (!selectedColumn) {
            if (
                isGroupHeader === false &&
                display === true &&
                (id === columnKey || accessor === columnKey)
            ) {
                selectedColumn = col;
            } else if (columns && columns.length > 0) {
                const selectedGroupedColumn = columns.find(
                    (groupedCol: Object): Object => {
                        return (
                            groupedCol.id === columnKey &&
                            groupedCol.display === true
                        );
                    }
                );
                if (selectedGroupedColumn) {
                    selectedColumn = selectedGroupedColumn;
                }
            }
        }
    });
    return selectedColumn;
};
export const checkInnerCells = (column: Object, cellKey: String): boolean => {
    if (column) {
        const { innerCells } = column;
        if (innerCells && innerCells.length > 0) {
            const innerCellData = innerCells.find((cell: Object): Object => {
                return cell.accessor === cellKey && cell.display === true;
            });
            if (innerCellData) {
                return true;
            }
        }
    }
    return false;
};
