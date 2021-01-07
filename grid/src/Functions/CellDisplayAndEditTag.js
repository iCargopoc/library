// @flow
import React, { useContext } from "react";
import { CellDisplayAndEditContext } from "../Utilities/TagsContext";
import { findSelectedColumn, checkInnerCells } from "../Utilities/TagUtilities";

const CellDisplayAndEditTag = (props: Object): ?React$Element<*> => {
    const contextVallues = useContext(CellDisplayAndEditContext);
    const { column, columns } = contextVallues;
    const { cellKey, columnKey } = props;

    if (columns && columnKey) {
        const selectedColumn = findSelectedColumn(columns, columnKey);
        if (checkInnerCells(selectedColumn, cellKey)) {
            return (
                <React.Fragment key="CellDisplayAndEditFragment">
                    {props.children}
                </React.Fragment>
            );
        }
    } else if (column.display === true && cellKey) {
        if (checkInnerCells(column, cellKey)) {
            return (
                <React.Fragment key="CellDisplayAndEditFragment">
                    {props.children}
                </React.Fragment>
            );
        }
    }
    return null;
};

export default CellDisplayAndEditTag;
