import React, { memo } from "react";

const divStyle = {
    backgroundColor: "#ccc",
    height: "200px",
    width: "400px",
    marginLeft: "-850px"
};

const DeletePopUpOverLay = memo((props) => {
    const { deleteRow, closeDeleteOverlay } = props;

    return (
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
    );
});

export default DeletePopUpOverLay;
