import React, { useContext, Fragment } from "react";
import { CellDisplayAndEditContext } from "../Utilities/TagsContext";
import { checkInnerCells } from "../Utilities/TagUtilities";

const CellDisplayAndEditTag = (props) => {
    const contextVallues = useContext(CellDisplayAndEditContext);
    const { column, columns } = contextVallues;
    const { cellKey, columnKey } = props;

    if (columns && columnKey) {
        const selectedColumn = columns.find(
            (col) => col.accessor === columnKey
        );
        if (checkInnerCells(selectedColumn, cellKey)) {
            return <Fragment> {props.children}</Fragment>;
        }
    } else if (cellKey) {
        if (checkInnerCells(column, cellKey)) {
            return <Fragment> {props.children}</Fragment>;
        }
    }
    return null;
};

export default CellDisplayAndEditTag;
