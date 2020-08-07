import React, { memo, useState } from "react";
import { RowEditContext } from "../Utilities/TagsContext";
import RowEditTag from "./RowEditTag";
import ClickAwayListener from "react-click-away-listener";

const RowEditOverLay = memo(
    ({
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
                    columns: columns,
                    additionalColumn: additionalColumn,
                    isRowExpandEnabled: isRowExpandEnabled
                }}
            >
                <ClickAwayListener onClickAway={closeRowEditOverlay}>
                    <div className="row-option-action-overlay">
                        {rowEditContent}
                        <div className="cancel-save-buttons">
                            <button
                                className="save-Button"
                                onClick={saveRowEdit}
                            >
                                Save
                            </button>
                            <button
                                className="cancel-Button"
                                onClick={closeRowEditOverlay}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </ClickAwayListener>
            </RowEditContext.Provider>
        );
    }
);

export default RowEditOverLay;
