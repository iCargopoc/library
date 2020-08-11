import React, { memo, useState } from "react";
import ClickAwayListener from "react-click-away-listener";
import PropTypes from "prop-types";
import CellDisplayAndEditTag from "./CellDisplayAndEditTag";
import { CellDisplayAndEditContext } from "../Utilities/TagsContext";
import IconPencil from "../Images/icon-pencil.svg";
import IconTick from "../Images/icon-tick.svg";
import IconCancel from "../Images/icon-cancel.svg";

const CellDisplayAndEdit = memo(({ row, columns, updateRowInGrid }) => {
    const { column } = row;
    if (column && row.row) {
        const [isEditOpen, setIsEditOpen] = useState(false);
        const [editedRowValue, setEditedRowValue] = useState(null);

        const { id } = column;

        const closeEdit = () => {
            setIsEditOpen(false);
        };

        const openEdit = () => {
            setIsEditOpen(true);
        };

        const getUpdatedRowValue = (value) => {
            if (value) {
                setEditedRowValue(value);
            }
        };

        const saveEdit = () => {
            if (editedRowValue) {
                updateRowInGrid(row.row.original, editedRowValue);
            }
            closeEdit();
        };

        const originalRowValue = { ...row.row.original };
        const cellDisplayContent = column.displayCell(
            originalRowValue,
            CellDisplayAndEditTag
        );
        const cellEditContent = column.editCell
            ? column.editCell(
                  originalRowValue,
                  CellDisplayAndEditTag,
                  getUpdatedRowValue
              )
            : null;
        const columnsToPass = columns;
        const columnToPass = column;
        return (
            <CellDisplayAndEditContext.Provider
                value={{ columns: columnsToPass, column: columnToPass }}
            >
                <ClickAwayListener onClickAway={closeEdit}>
                    <div
                        className={`table-cell--content table-cell--content__${id}`}
                    >
                        {cellEditContent ? (
                            <div
                                className="cell-edit"
                                role="presentation"
                                onClick={openEdit}
                            >
                                <i>
                                    <img
                                        src={IconPencil}
                                        alt="Cell Edit Icon"
                                    />
                                </i>
                            </div>
                        ) : null}
                        {cellDisplayContent}
                        {isEditOpen ? (
                            <div className="table-cell--content-edit">
                                {cellEditContent}
                                <button
                                    type="button"
                                    aria-label="Cell Edit Save Button"
                                    className="ok"
                                    data-testid="ok"
                                    onClick={saveEdit}
                                >
                                    <img
                                        src={IconTick}
                                        alt="Cell Edit Save Icon"
                                    />
                                </button>
                                <button
                                    type="button"
                                    aria-label="Cell Edit Cancel Button"
                                    className="cancel"
                                    data-testid="cancel"
                                    onClick={closeEdit}
                                >
                                    <img
                                        src={IconCancel}
                                        alt="Cell Edit Cancel Icon"
                                    />
                                </button>
                            </div>
                        ) : null}
                    </div>
                </ClickAwayListener>
            </CellDisplayAndEditContext.Provider>
        );
    }
    return null;
});

CellDisplayAndEdit.propTypes = {
    row: PropTypes.any,
    columns: PropTypes.any,
    updateRowInGrid: PropTypes.any
};

export default CellDisplayAndEdit;
