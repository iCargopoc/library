import React, { useState } from "react";
import { useDrop } from "react-dnd";
import update from "immutability-helper";
import { ItemTypes } from "./ItemTypes";
import ColumnItem from "./columnItem";

const ColumnsList = (props) => {

    const moveColumn = (columnId, atIndex) => {
        const { column, index } = findColumn(columnId);
        props.updateColumnsInState(
            update(props.columnsToManage, {
                $splice: [
                    [index, 1],
                    [atIndex, 0, column]
                ]
            })
        );
    };

    const findColumn = (columnId) => {
        const column = props.columnsToManage.filter((c) => `${c.columnId}` === columnId)[0];
        return {
            column,
            index: props.columnsToManage.indexOf(column)
        };
    };

    const [, drop] = useDrop({ accept: ItemTypes.COLUMN });

    return (
        <React.Fragment>
            <div ref={drop} style={{ display: "flex", flexWrap: "wrap" }}>
                {props.columnsToManage.map((column, index) => {
                    return (
                        <ColumnItem
                            key={index}
                            id={`${column.columnId}`}
                            name={`${column.Header}`}
                            moveColumn={moveColumn}
                            findColumn={findColumn}
                            innerCells={column.innerCells}
                        />
                    );
                })}
            </div>
        </React.Fragment>
    );
};

export default ColumnsList;
