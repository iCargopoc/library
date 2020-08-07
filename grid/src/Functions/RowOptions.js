import React, { useState, memo } from "react";
import ClickAwayListener from "react-click-away-listener";
import RowDelete from "../Images/RowDelete.svg";
import RowEdit from "../Images/RowEdit.svg";
import RowPin from "../Images/RowPin.png";

const RowOptions = memo(({ row, bindRowEditOverlay, bindRowDeleteOverlay }) => {
    const { original } = row;

    const [isRowOptionsOpen, setRowOptionsOpen] = useState(false);

    const openRowOptionsOverlay = () => {
        setRowOptionsOpen(true);
    };

    const closeRowOptionsOverlay = () => {
        setRowOptionsOpen(false);
    };

    const openRowEditOverlay = () => {
        bindRowEditOverlay(original);
        closeRowOptionsOverlay();
    };

    const openDeleteOverlay = () => {
        bindRowDeleteOverlay(original);
        closeRowOptionsOverlay();
    };

    return (
        <div>
            <div className="row-options-wrap">
                <span
                    className="icon-row-options"
                    onClick={openRowOptionsOverlay}
                >
                    <i></i>
                    <i></i>
                    <i></i>
                </span>
                {isRowOptionsOpen ? (
                    <ClickAwayListener onClickAway={closeRowOptionsOverlay}>
                        <div className="row-options-overlay">
                            <ul>
                                <li>
                                    <span onClick={openRowEditOverlay}>
                                        <i>
                                            <img src={RowEdit} alt="cargo" />
                                        </i>
                                        <span>Edit</span>
                                    </span>
                                </li>
                                <li>
                                    <span>
                                        <i>
                                            <img
                                                src={RowPin}
                                                alt="cargo"
                                                width="15"
                                                height="15"
                                            />
                                        </i>
                                        <span>Pin This row</span>
                                    </span>
                                </li>
                                <li>
                                    <span onClick={openDeleteOverlay}>
                                        <i>
                                            <img src={RowDelete} alt="cargo" />
                                        </i>
                                        <span>Delete</span>
                                    </span>
                                </li>
                            </ul>
                            <span
                                className="close"
                                onClick={closeRowOptionsOverlay}
                            >
                                <i className="fa fa-close"></i>
                            </span>
                        </div>
                    </ClickAwayListener>
                ) : null}
            </div>
        </div>
    );
});

export default RowOptions;
