import React, { useState } from "react";
import { useDrop } from "react-dnd";
import update from "immutability-helper";
import PropTypes from "prop-types";
import { ItemTypes } from "./itemTypes";
import ColumnItem from "./columnItem";

const ColumnsList = (props) => {
    const { columnsArray } = props;
    const [columns, setColumns] = useState([...columnsArray]);

    const findColumn = (id) => {
        const column = columns.filter((c) => `${c.id}` === id)[0];
        return {
            column,
            index: columns.indexOf(column)
        };
    };

    const moveColumn = (id, atIndex) => {
        const { column, index } = findColumn(id);
        setColumns(
            update(columns, {
                $splice: [
                    [index, 1],
                    [atIndex, 0, column]
                ]
            })
        );
        const values = [];
        let temp = [];
        temp = update(columns, {
            $splice: [
                [index, 1],
                [atIndex, 0, column]
            ]
        });
        temp.forEach((item) => {
            values.push(item.id);
        });
        props.handleReorderList(values);
    };

    const [, drop] = useDrop({ accept: ItemTypes.COLUMN });

    React.useEffect(() => {
        setColumns(props.columnsArray);
    }, [columnsArray]);
    return (
        <div
            ref={drop}
            className="ng-popover--column__content"
            style={{ display: "flex", flexWrap: "wrap" }}
        >
            {columns.map((column) => (
                <ColumnItem
                    key={column.id}
                    id={`${column.id}`}
                    text={column.text}
                    moveColumn={moveColumn}
                    findColumn={findColumn}
                />
            ))}
        </div>
    );
};

ColumnsList.propTypes = {
    columnsArray: PropTypes.any,
    handleReorderList: PropTypes.any
};

export default ColumnsList;
