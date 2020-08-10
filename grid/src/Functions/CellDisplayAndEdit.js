import React, { memo, useState } from "react";
import ClickAwayListener from "react-click-away-listener";
import CellDisplayAndEditTag from "./CellDisplayAndEditTag";
import { CellDisplayAndEditContext } from "../Utilities/TagsContext";
import PropTypes from "prop-types";

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
        return (
            <CellDisplayAndEditContext.Provider
                value={{ columns: columns, column: column }}
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
                                <i
                                    className="fa fa-pencil"
                                    aria-hidden="true"
                                />
                            </div>
                        ) : null}
                        {cellDisplayContent}
                        {isEditOpen ? (
                            <div className="table-cell--content-edit">
                                {cellEditContent}
                                <button
                                    type="button"
                                    aria-label="Mute volume"
                                    className="ok"
                                    data-testid="ok"
                                    onClick={saveEdit}
                                />
                                <button
                                    type="button"
                                    aria-label="Mute volume"
                                    className="cancel"
                                    data-testid="cancel"
                                    onClick={closeEdit}
                                />
                            </div>
                        ) : null}
                    </div>
                </ClickAwayListener>
            </CellDisplayAndEditContext.Provider>
        );
    }
});

CellDisplayAndEdit.propTypes = {
    row: PropTypes.any,
    columns: PropTypes.any,
    updateRowInGrid: PropTypes.any,
    cellKey: PropTypes.any,
    columnKey: PropTypes.any,
    children: PropTypes.any
};

export default CellDisplayAndEdit;
