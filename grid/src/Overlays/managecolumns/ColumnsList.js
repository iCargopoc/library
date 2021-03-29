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
    onPinColumnChange: Function,
    isSubComponentColumn: boolean,
    enablePinLeft: boolean
}): React$Element<*> => {
    const {
        onColumnReorder,
        managedColumns,
        onInnerCellChange,
        onPinColumnChange,
        isSubComponentColumn,
        enablePinLeft
    } = props;

    const findColumn = (columnId: string): Object => {
        const column = managedColumns.filter(
            (c: Object): boolean => `${c.columnId}` === columnId
        )[0];
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
                    const {
                        columnId,
                        Header,
                        title,
                        isDisplayInExpandedRegion,
                        innerCells,
                        isGroupHeader,
                        pinLeft,
                        columns
                    } = column;
                    return (
                        <ColumnItem
                            key={columnId}
                            id={columnId}
                            moveColumn={moveColumn}
                            findColumn={findColumn}
                            columnHeader={Header}
                            columnTitle={title}
                            pinLeft={pinLeft}
                            isadditionalcolumn={isDisplayInExpandedRegion}
                            isGroupHeader={isGroupHeader}
                            columns={columns}
                            innerCells={innerCells}
                            isSubComponentColumn={isSubComponentColumn}
                            onPinColumnChange={onPinColumnChange}
                            onInnerCellChange={onInnerCellChange}
                            enablePinLeft={enablePinLeft}
                        />
                    );
                })}
            </div>
        </React.Fragment>
    );
};
export default ColumnsList;
