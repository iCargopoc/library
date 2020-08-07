import React, { memo } from "react";
import ClickAwayListener from "react-click-away-listener";

const RowDeleteOverLay = memo(
    ({ row, closeRowDeleteOverlay, deleteRowFromGrid }) => {
        const deleteRow = () => {
            if (row) {
                deleteRowFromGrid(row);
            }
            closeRowDeleteOverlay();
        };

        return (
            <ClickAwayListener onClickAway={closeRowDeleteOverlay}>
                <div className="row-option-action-overlay delete">
                    <div className="cancel-save-buttons-delete">
                        <button className="delete-Button" onClick={deleteRow}>
                            Delete
                        </button>
                        <button
                            className="cancel-Button"
                            onClick={closeRowDeleteOverlay}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </ClickAwayListener>
        );
    }
);

export default RowDeleteOverLay;
