import React, { useState } from "react";
import ClickAwayListener from "react-click-away-listener";
import PropTypes from "prop-types";
import { RowDelete, RowEdit, IconCancel } from "../Utilities/SvgUtilities";

const RowOptions = ({
    row,
    rowActions,
    rowActionCallback,
    bindRowEditOverlay,
    bindRowDeleteOverlay
}) => {
    const { original } = row;

    // Check if Edit row option is required or not
    const editOptionIndex = rowActions.findIndex((action) => {
        return action.label.toLowerCase() === "edit";
    });
    const isRowEditOptionNeeded = editOptionIndex > -1;

    // Check if Delete row option is required or not
    const deleteOptionIndex = rowActions.findIndex((action) => {
        return action.label.toLowerCase() === "delete";
    });
    const isRowDeleteOptionNeeded = deleteOptionIndex > -1;

    // Find the additional row actions required
    const additionalRowOptions = rowActions.filter((action) => {
        return (
            action.label.toLowerCase() !== "edit" &&
            action.label.toLowerCase() !== "delete"
        );
    });

    const isAdditionalRowOptionsPresent =
        additionalRowOptions &&
        additionalRowOptions.length > 0 &&
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
        closeRowOptionsOverlay();
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
                                {isRowEditOptionNeeded ? (
                                    <li>
                                        <span
                                            role="presentation"
                                            onClick={openRowEditOverlay}
                                        >
                                            <i>
                                                <RowEdit />
                                            </i>
                                            <span>Edit</span>
                                        </span>
                                    </li>
                                ) : null}
                                {isRowDeleteOptionNeeded ? (
                                    <li>
                                        <span
                                            role="presentation"
                                            onClick={openDeleteOverlay}
                                        >
                                            <i>
                                                <RowDelete />
                                            </i>
                                            <span>Delete</span>
                                        </span>
                                    </li>
                                ) : null}
                                {isAdditionalRowOptionsPresent
                                    ? additionalRowOptions.map((action) => {
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
                                    <IconCancel />
                                </i>
                            </span>
                        </div>
                    </ClickAwayListener>
                ) : null}
            </div>
        </div>
    );
};
RowOptions.propTypes = {
    row: PropTypes.any,
    rowActions: PropTypes.any,
    rowActionCallback: PropTypes.any,
    bindRowEditOverlay: PropTypes.any,
    bindRowDeleteOverlay: PropTypes.any
};

export default RowOptions;
