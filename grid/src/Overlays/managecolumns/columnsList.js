import React from "react";
import { useDrop } from "react-dnd";
import update from "immutability-helper";
import PropTypes from "prop-types";
import { ItemTypes } from "./ItemTypes";
import ColumnItem from "./columnItem";

const ColumnsList = (props) => {
    const {
        updateColumnsInState,
        columnsToManage,
        isInnerCellSelected,
        selectInnerCells
    } = props;

    const findColumn = (columnId) => {
        const column = columnsToManage.filter(
            (c) => `${c.columnId}` === columnId
        )[0];
        return {
            column,
            index: columnsToManage.indexOf(column)
        };
    };

    const moveColumn = (columnId, atIndex) => {
        const { column, index } = findColumn(columnId);
        updateColumnsInState(
            update(columnsToManage, {
                $splice: [
                    [index, 1],
                    [atIndex, 0, column]
                ]
            })
        );
    };

    const [, drop] = useDrop({ accept: ItemTypes.COLUMN });

    return (
        <>
            <div ref={drop} style={{ display: "flex", flexWrap: "wrap" }}>
                {columnsToManage.map((column, index) => {
                    return (
                        <ColumnItem
                            key={index}
                            id={`${column.columnId}`}
                            Header={`${column.Header}`}
                            moveColumn={moveColumn}
                            findColumn={findColumn}
                            originalInnerCells={column.originalInnerCells}
                            isInnerCellSelected={isInnerCellSelected}
                            selectInnerCells={selectInnerCells}
                        />
                    );
                })}
            </div>
        </>
    );
};

ColumnsList.propTypes = {
    updateColumnsInState: PropTypes.any,
    columnsToManage: PropTypes.any,
    isInnerCellSelected: PropTypes.any,
    selectInnerCells: PropTypes.any
};

export default ColumnsList;
