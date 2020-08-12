import React, { useContext } from "react";
import PropTypes from "prop-types";
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
                return (
                    <React.Fragment key="RowEditFragment">
                        {props.children}
                    </React.Fragment>
                );
            }
        } else if (!selectedColumn && isRowExpandEnabled && additionalColumn) {
            if (checkInnerCells(additionalColumn, columnKey)) {
                return (
                    <React.Fragment key="RowEditFragment">
                        {props.children}
                    </React.Fragment>
                );
            }
        }
    }
    return null;
};

RowEditTag.propTypes = {
    cellKey: PropTypes.any,
    columnKey: PropTypes.any,
    children: PropTypes.any
};

export default RowEditTag;
