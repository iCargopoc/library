import React, { memo } from "react";
import ClickAwayListener from "react-click-away-listener";

const divStyle = {
    backgroundColor: "#ccc",
    height: "200px",
    width: "400px",
    marginLeft: "-850px"
};

const DeletePopUpOverLay = memo(({ deleteRow, closeDeleteOverlay }) => {
    return (
        <ClickAwayListener onClickAway={closeDeleteOverlay}>
            <div className="main-div-delete-overlay" style={divStyle}>
                <div className="cancel-save-buttons-delete">
                    <button className="delete-Button" onClick={deleteRow}>
                        Delete
                    </button>
                    &nbsp;&nbsp;&nbsp;
                    <button className="cancel-Button" onClick={closeDeleteOverlay}>
                        Cancel
                    </button>
                </div>
            </div>
        </ClickAwayListener>
    );
});

export default DeletePopUpOverLay;
