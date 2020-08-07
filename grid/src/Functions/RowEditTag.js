import React, { useContext, Fragment } from "react";
import { RowEditContext } from "../Utilities/TagsContext";
import { checkInnerCells } from "../Utilities/TagUtilities";

const RowEditTag = (props) => {
    const contextVallues = useContext(RowEditContext);
    const { columns, additionalColumn, isRowExpandEnabled } = contextVallues;
    const { cellKey, columnKey } = props;

    if (columns && columnKey) {
        const selectedColumn = columns.find(
            (col) => col.accessor === columnKey
        );
        if (selectedColumn && cellKey) {
            if (checkInnerCells(selectedColumn, cellKey)) {
                return <Fragment> {props.children}</Fragment>;
            }
        } else if (!selectedColumn && isRowExpandEnabled && additionalColumn) {
            if (checkInnerCells(additionalColumn, columnKey)) {
                return <Fragment> {props.children}</Fragment>;
            }
        }
    }
    return null;
};

export default RowEditTag;
