import React, { useContext } from "react";
import PropTypes from "prop-types";
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
            return (
                <React.Fragment key="CellDisplayAndEditFragment">
                    {props.children}
                </React.Fragment>
            );
        }
    } else if (cellKey) {
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

CellDisplayAndEditTag.propTypes = {
    cellKey: PropTypes.any,
    columnKey: PropTypes.any,
    children: PropTypes.any
};

export default CellDisplayAndEditTag;
