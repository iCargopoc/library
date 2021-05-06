// @flow
import React, { useState } from "react";
import ClickAwayListener from "react-click-away-listener";
import {
    IconCancel,
    IconKebab,
    IconPinColumn
} from "../Utilities/SvgUtilities";

const RowOptions = ({
    row,
    rowActions,
    isRowActionsAvailable,
    idAttribute,
    enablePinRow,
    updatePinnedRows,
    isRowPinned,
    isSubComponentRow
}: {
    row: Object,
    rowActions: Function,
    isRowActionsAvailable: boolean,
    idAttribute: string,
    enablePinRow: boolean,
    updatePinnedRows: Function,
    isRowPinned: Function,
    isSubComponentRow: boolean
}): React$Element<*> => {
    const { original } = row;
    const rowId = original[idAttribute];

    const [isRowOptionsOpen, setRowOptionsOpen] = useState(false);

    const openRowOptionsOverlay = () => {
        setRowOptionsOpen(true);
    };

    const closeRowOptionsOverlay = () => {
        setRowOptionsOpen(false);
    };

    const rowActionsOverlayContent = isRowActionsAvailable
        ? rowActions(original, closeRowOptionsOverlay, isSubComponentRow)
        : null;

    const setPinValue = () => {
        updatePinnedRows(rowId);
    };

    return (
        <div className="ng-action__utils">
            <span
                className="ng-action__utils-block"
                data-testid="rowActions-open-link"
                role="presentation"
                onClick={openRowOptionsOverlay}
            >
                <IconKebab className="ng-icon ng-action__kebab" />
            </span>
            {isRowOptionsOpen ? (
                <ClickAwayListener
                    onClickAway={closeRowOptionsOverlay}
                    className="ng-action__popover"
                    data-testid="rowActions-kebab-overlay"
                >
                    {rowActionsOverlayContent}
                    {enablePinRow === true ? (
                        <ul className="ng-action__popover--pincontainer">
                            <li
                                role="presentation"
                                className="ng-action__popover--pin"
                                onClick={setPinValue}
                            >
                                <span>
                                    <i className="ng-action__popover--icon">
                                        <IconPinColumn className="ng-icon ng-action__pin" />
                                    </i>
                                    <span>
                                        {isRowPinned(rowId)
                                            ? "Unpin Row"
                                            : "Pin Row"}
                                    </span>
                                </span>
                            </li>
                        </ul>
                    ) : null}
                    <span
                        role="presentation"
                        className="ng-action__close"
                        data-testid="close-rowActions-kebab-overlay"
                        onClick={closeRowOptionsOverlay}
                    >
                        <i>
                            <IconCancel className="ng-icon" />
                        </i>
                    </span>
                </ClickAwayListener>
            ) : null}
        </div>
    );
};

export default RowOptions;
