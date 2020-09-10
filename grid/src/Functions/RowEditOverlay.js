import React, { useState } from "react";
import ClickAwayListener from "react-click-away-listener";
import PropTypes from "prop-types";
import { RowEditContext } from "../Utilities/TagsContext";
import RowEditTag from "./RowEditTag";

const RowEditOverLay = ({
    row,
    columns,
    isRowExpandEnabled,
    additionalColumn,
    getRowEditOverlay,
    closeRowEditOverlay,
    updateRowInGrid
}) => {
    const [editedRowValue, setEditedRowValue] = useState(null);

    const getUpdatedRowValue = (value) => {
        if (value) {
            setEditedRowValue(value);
        }
    };

    const saveRowEdit = () => {
        if (editedRowValue) {
            updateRowInGrid(row, editedRowValue);
        }
        closeRowEditOverlay();
    };

    const originalRowValue = { ...row };
    const rowEditContent = getRowEditOverlay(
        originalRowValue,
        RowEditTag,
        getUpdatedRowValue
    );
    return (
        <RowEditContext.Provider
            value={{
                columns,
                additionalColumn,
                isRowExpandEnabled
            }}
        >
            <ClickAwayListener
                className="row-option-action-overlay"
                onClickAway={closeRowEditOverlay}
            >
                {rowEditContent}
                <div className="cancel-save-buttons">
                    <button
                        type="button"
                        className="save-Button"
                        onClick={saveRowEdit}
                    >
                        Save
                    </button>
                    <button
                        type="button"
                        className="cancel-Button"
                        onClick={closeRowEditOverlay}
                    >
                        Cancel
                    </button>
                </div>
            </ClickAwayListener>
        </RowEditContext.Provider>
    );
};
RowEditOverLay.propTypes = {
    row: PropTypes.any,
    columns: PropTypes.any,
    isRowExpandEnabled: PropTypes.any,
    additionalColumn: PropTypes.any,
    getRowEditOverlay: PropTypes.any,
    closeRowEditOverlay: PropTypes.any,
    updateRowInGrid: PropTypes.any
};

export default RowEditOverLay;
