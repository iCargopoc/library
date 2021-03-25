// @flow
import React from "react";
import { useDrop } from "react-dnd";
import update from "immutability-helper";
import { ItemTypes } from "./ItemTypes";
import ColumnItem from "./ColumnItem";

const ColumnsList = (props: {
    onColumnReorder: Function,
    managedColumns: Array<Object>,
    onInnerCellChange: Function,
    isSubComponentColumn: boolean
}): React$Element<*> => {
    const {
        onColumnReorder,
        managedColumns,
        onInnerCellChange,
        isSubComponentColumn
    } = props;

    const findColumn = (movedColumnId: string): Object => {
        const column = managedColumns.filter((c: Object): boolean => {
            const { isColumnGrouped, columns } = c;
            const { columnId } =
                isColumnGrouped !== true && columns && columns.length > 0
                    ? columns[0]
                    : c;
            return columnId === movedColumnId;
        })[0];
        return {
            column,
            index: managedColumns.indexOf(column)
        };
    };

    const moveColumn = (columnId: string, atIndex: number) => {
        const { column, index } = findColumn(columnId);
        if (index >= 0) {
            onColumnReorder(
                update(managedColumns, {
                    $splice: [
                        [index, 1],
                        [atIndex, 0, column]
                    ]
                }),
                isSubComponentColumn
            );
        }
    };

    const [, drop] = useDrop({ accept: ItemTypes.COLUMN });

    const filteredManagedColumns = managedColumns.filter(
        (column: Object): boolean => {
            return column.display === true;
        }
    );

    return (
        <React.Fragment key="ColumnManageFragment">
            <div
                ref={drop}
                className="ng-popover--column__content"
                data-testid={
                    isSubComponentColumn
                        ? "sub-component-columns-list-box"
                        : "columns-list-box"
                }
            >
                {filteredManagedColumns.map((column: Object): Object => {
                    const { isColumnGrouped, columns } = column;
                    const {
                        columnId,
                        Header,
                        title,
                        isDisplayInExpandedRegion,
                        innerCells,
                        isGroupHeader
                    } =
                        isColumnGrouped !== true &&
                        columns &&
                        columns.length > 0
                            ? columns[0]
                            : column;
                    return (
                        <ColumnItem
                            key={columnId}
                            id={columnId}
                            moveColumn={moveColumn}
                            findColumn={findColumn}
                            columnHeader={Header}
                            columnTitle={title}
                            isadditionalcolumn={isDisplayInExpandedRegion}
                            isGroupHeader={isGroupHeader}
                            columns={columns}
                            innerCells={innerCells}
                            isSubComponentColumn={isSubComponentColumn}
                            onInnerCellChange={onInnerCellChange}
                        />
                    );
                })}
            </div>
        </React.Fragment>
    );
};
export default ColumnsList;
