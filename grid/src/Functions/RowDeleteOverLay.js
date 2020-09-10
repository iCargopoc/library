import React from "react";
import ClickAwayListener from "react-click-away-listener";
import PropTypes from "prop-types";

const RowDeleteOverLay = ({
    row,
    closeRowDeleteOverlay,
    deleteRowFromGrid
}) => {
    const deleteRow = () => {
        if (row) {
            deleteRowFromGrid(row);
        }
        closeRowDeleteOverlay();
    };

    return (
        <ClickAwayListener
            className="row-option-action-overlay delete"
            onClickAway={closeRowDeleteOverlay}
        >
            <div className="cancel-save-buttons-delete">
                <button
                    type="button"
                    className="delete-Button"
                    onClick={deleteRow}
                >
                    Delete
                </button>
                <button
                    type="button"
                    className="cancel-Button"
                    onClick={closeRowDeleteOverlay}
                >
                    Cancel
                </button>
            </div>
        </ClickAwayListener>
    );
};
RowDeleteOverLay.propTypes = {
    row: PropTypes.any,
    closeRowDeleteOverlay: PropTypes.any,
    deleteRowFromGrid: PropTypes.any
};

export default RowDeleteOverLay;
