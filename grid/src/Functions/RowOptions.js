import React, { useState, memo } from "react";
import ClickAwayListener from "react-click-away-listener";
import PropTypes from "prop-types";
import RowDelete from "../Images/RowDelete.svg";
import RowEdit from "../Images/RowEdit.svg";
import RowPin from "../Images/RowPin.png";
import IconCancel from "../Images/icon-cancel.svg";

const RowOptions = memo(
    ({
        row,
        rowActions,
        rowActionCallback,
        bindRowEditOverlay,
        bindRowDeleteOverlay
    }) => {
        const { original } = row;
        const isAdditionalRowOptionsPresent =
            rowActions &&
            rowActions.length > 0 &&
            typeof rowActionCallback === "function";

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

        const additionalActionClicked = (actionValue) => {
            return rowActionCallback(original, actionValue);
        };

        return (
            <div>
                <div className="row-options-wrap">
                    <span
                        className="icon-row-options"
                        role="presentation"
                        onClick={openRowOptionsOverlay}
                    >
                        <i />
                        <i />
                        <i />
                    </span>
                    {isRowOptionsOpen ? (
                        <ClickAwayListener onClickAway={closeRowOptionsOverlay}>
                            <div className="row-options-overlay">
                                <ul>
                                    <li>
                                        <span
                                            role="presentation"
                                            onClick={openRowEditOverlay}
                                        >
                                            <i>
                                                <img
                                                    src={RowEdit}
                                                    alt="cargo"
                                                />
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
                                        <span
                                            role="presentation"
                                            onClick={openDeleteOverlay}
                                        >
                                            <i>
                                                <img
                                                    src={RowDelete}
                                                    alt="cargo"
                                                />
                                            </i>
                                            <span>Delete</span>
                                        </span>
                                    </li>
                                    {isAdditionalRowOptionsPresent
                                        ? rowActions.map((action) => {
                                              const { value, label } = action;
                                              return (
                                                  <li key={value}>
                                                      <span
                                                          role="presentation"
                                                          onClick={() => {
                                                              return additionalActionClicked(
                                                                  value
                                                              );
                                                          }}
                                                      >
                                                          <i className="default" />
                                                          <span>{label}</span>
                                                      </span>
                                                  </li>
                                              );
                                          })
                                        : null}
                                </ul>
                                <span
                                    role="presentation"
                                    className="close"
                                    onClick={closeRowOptionsOverlay}
                                >
                                    <i>
                                        <img
                                            src={IconCancel}
                                            alt="Row options Overlay Close Icon"
                                        />
                                    </i>
                                </span>
                            </div>
                        </ClickAwayListener>
                    ) : null}
                </div>
            </div>
        );
    }
);

RowOptions.propTypes = {
    row: PropTypes.any,
    rowActions: PropTypes.any,
    rowActionCallback: PropTypes.any,
    bindRowEditOverlay: PropTypes.any,
    bindRowDeleteOverlay: PropTypes.any
};

export default RowOptions;
