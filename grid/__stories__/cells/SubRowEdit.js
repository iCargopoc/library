import React, { useState } from "react";
import ClickAwayListener from "react-click-away-listener";

const SubRowEdit = ({ rowData, onRowUpdate, unbindRowEditOverlay }) => {
    const [updatedRowData, setUpdatedRowData] = useState(rowData);

    const saveRowEdit = () => {
        onRowUpdate(rowData, updatedRowData, true);
        unbindRowEditOverlay();
    };

    const closeRowEditOverlay = () => {
        unbindRowEditOverlay();
    };

    const updateRowData = (updatedNumValue) => {
        const updatedRow = {
            ...updatedRowData
        };
        if (updatedNumValue) {
            updatedRow.scr.num = updatedNumValue;
        }
        setUpdatedRowData(updatedRow);
    };

    const updateNumValue = (e) => {
        updateRowData(e.target.value);
    };

    const { num } = updatedRowData.scr;

    return (
        <ClickAwayListener
            className="row-option-action-overlay"
            data-testid="rowEditOverlay-container"
            onClickAway={closeRowEditOverlay}
        >
            <div className="row-edit">
                <div className="edit-sr">
                    <label>SCR Number</label>
                    <input type="text" value={num} onChange={updateNumValue} />
                </div>
            </div>
            <div className="btn-wrap">
                <button
                    type="button"
                    className="neo-btn neo-btn-primary btn btn-secondary"
                    data-testid="rowEditOverlay-save"
                    onClick={saveRowEdit}
                >
                    Save
                </button>
                <button
                    type="button"
                    className="neo-btn neo-btn-default btn btn-secondary"
                    data-testid="rowEditOverlay-cancel"
                    onClick={closeRowEditOverlay}
                >
                    Cancel
                </button>
            </div>
        </ClickAwayListener>
    );
};

export default SubRowEdit;
