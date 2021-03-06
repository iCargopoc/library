// @flow
import React, { useState, useEffect } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";
import MultiBackend, { TouchTransition } from "react-dnd-multi-backend";
import ClickAwayListener from "react-click-away-listener";
import update from "immutability-helper";
import ColumnsSearch from "../common/ColumnsSearch";
import ColumnsList from "./ColumnsList";
import { IconCancel } from "../../Utilities/SvgUtilities";
import { updateColumnsDisplay } from "../../Utilities/OverlayUtilities";

const ColumnReordering = (props: any): any => {
    const {
        toggleManageColumnsOverlay,
        columns,
        originalColumns,
        additionalColumn,
        originalAdditionalColumn,
        isSubComponentGrid,
        subComponentColumns,
        originalSubComponentColumns,
        subComponentAdditionalColumn,
        originalSubComponentAdditionalColumn,
        updateColumnStructure,
        enablePinColumn
    } = props;

    // D&D code
    const HTML5toTouch = {
        backends: [
            {
                backend: HTML5Backend
            },
            {
                backend: TouchBackend,
                options: { enableMouseEvents: true },
                preview: true,
                transition: TouchTransition
            }
        ]
    };

    // Check if additional Column is present or not
    const isAdditionalColumnPresent =
        additionalColumn !== null && additionalColumn !== undefined;

    // Check if sub component additional Column is present or not
    const isSubComponentAdditionalColumnPresent =
        isSubComponentGrid &&
        subComponentAdditionalColumn !== null &&
        subComponentAdditionalColumn !== undefined;

    // Set state variables for:
    // managedColumns - main columns displayed in colum setting region
    // managedAdditionalColumn - additional column displayed in colum setting region
    // managedSubComponentColumns - sub component columns displayed in colum setting region
    // managedSubComponentAdditionalColumn - sub component additional column displayed in colum setting region
    // warning - error message to be displayed
    const [managedColumns, setManagedColumns] = useState([]);
    const [managedAdditionalColumn, setManagedAdditionalColumn] = useState(
        null
    );
    const [
        managedSubComponentColumns,
        setManagedSubComponentColumns
    ] = useState([]);
    const [
        managedSubComponentAdditionalColumn,
        setManagedSubComponentAdditionalColumn
    ] = useState(null);
    const [warning, setWarning] = useState("");

    // #region - Column chooser region
    // Update display value of inner cells based on columnId & cellId
    const updatedDisplayOfInnerCells = (
        innerCells: Object,
        cellid: string,
        flag: boolean
    ): Object => {
        return [...innerCells].map((cell: Object): any => {
            const updatedCell = { ...cell };
            const { cellId } = cell;
            if (cellId === cellid || cellid === "all") {
                updatedCell.display = flag;
            }
            return updatedCell;
        });
    };

    // update the display flag value of column or all columns in managedColumns and managedAdditionalColumn state, based on the selection
    const updateColumns = (
        columnid: string,
        isadditionalcolumn: boolean,
        checked: boolean,
        isSubComponentColumn: boolean
    ): any => {
        updateColumnsDisplay(
            columnid,
            isadditionalcolumn,
            checked,
            isSubComponentColumn,
            isAdditionalColumnPresent,
            update,
            setManagedColumns,
            managedColumns,
            setManagedSubComponentColumns,
            managedSubComponentColumns,
            setManagedAdditionalColumn,
            managedAdditionalColumn,
            setManagedSubComponentAdditionalColumn,
            managedSubComponentAdditionalColumn
        );
    };
    // #endregion

    // #region - Column settings region
    // Updates the order of columns in managedColumns state
    const onColumnReorder = (
        reorderedColumns: Object,
        isSubComponentColumn: boolean
    ) => {
        if (isSubComponentColumn) {
            setManagedSubComponentColumns(
                update(managedSubComponentColumns, {
                    $set: reorderedColumns
                })
            );
        } else {
            setManagedColumns(
                update(managedColumns, {
                    $set: reorderedColumns
                })
            );
        }
    };

    // Update 'pinLeft value of column based on columnId
    const updatedPinOfColumn = (
        column: Object,
        columnidToUpdate: string,
        flag: boolean
    ): Object => {
        const updatedColumn = { ...column };
        const { isGroupHeader, columnId } = column;
        if (columnidToUpdate === columnId) {
            const groupedColumns = column.columns;
            if (
                isGroupHeader === true &&
                groupedColumns &&
                groupedColumns.length > 0
            ) {
                const updatedColumns = [...groupedColumns].map(
                    (col: Object): any => {
                        const updatedCol = { ...col };
                        updatedCol.pinLeft = flag;
                        return updatedCol;
                    }
                );
                updatedColumn.columns = updatedColumns;
            }
            updatedColumn.pinLeft = flag;
        }
        return updatedColumn;
    };

    // update the display flag value of column or all columns in managedColumns and managedAdditionalColumn state, based on the selection
    const onPinColumnChange = (
        event: Object,
        isSubComponentColumn: boolean,
        columnid: string
    ): any => {
        const { checked } = event.currentTarget;
        // Update columns 'pinLeft' state based on selection and columnid
        const columnToUpdate = isSubComponentColumn
            ? [...managedSubComponentColumns]
            : [...managedColumns];
        const updatedManagedColumns = columnToUpdate.map(
            (column: Object): any => {
                return updatedPinOfColumn(column, columnid, checked);
            }
        );
        if (isSubComponentColumn) {
            setManagedSubComponentColumns(
                update(managedSubComponentColumns, {
                    $set: updatedManagedColumns
                })
            );
        } else {
            setManagedColumns(
                update(managedColumns, {
                    $set: updatedManagedColumns
                })
            );
        }
    };

    // Updates the inner cell display value accordingly
    const changeInnerCellSelection = (
        innerCells: Array<Object>,
        cellid: string,
        flag: boolean
    ): any => {
        const indexOfCell = innerCells.findIndex((cell: Object): any => {
            return cell.cellId === cellid;
        });
        return update(innerCells, {
            [indexOfCell]: {
                $set: update(innerCells[indexOfCell], {
                    display: { $set: flag }
                })
            }
        });
    };

    // Update the display flag value of inner cell in managedColumns state, based on the selection
    const onInnerCellChange = (
        event: Object,
        isSubComponentColumn: boolean,
        columnid: string,
        cellid: string,
        isadditionalcolumn: boolean
    ) => {
        const { checked } = event.currentTarget;
        if (isadditionalcolumn === false && isSubComponentColumn) {
            setManagedSubComponentColumns((): Object => {
                return [...managedSubComponentColumns].map(
                    (column: Object): any => {
                        const updatedColumn = { ...column };
                        const {
                            columnId,
                            innerCells,
                            isGroupHeader
                        } = updatedColumn;
                        const groupedColumns = updatedColumn.columns;
                        if (
                            columnId === columnid &&
                            innerCells &&
                            innerCells.length > 0
                        ) {
                            updatedColumn.innerCells = updatedDisplayOfInnerCells(
                                [...innerCells],
                                cellid,
                                checked
                            );
                        } else if (
                            isGroupHeader === true &&
                            groupedColumns &&
                            groupedColumns.length > 0
                        ) {
                            const updatedColumns = [...groupedColumns].map(
                                (col: Object): any => {
                                    const updatedCol = { ...col };
                                    if (
                                        col.columnId === columnid &&
                                        col.innerCells &&
                                        col.innerCells.length > 0
                                    ) {
                                        updatedCol.innerCells = updatedDisplayOfInnerCells(
                                            [...col.innerCells],
                                            cellid,
                                            checked
                                        );
                                    }
                                    return updatedCol;
                                }
                            );
                            updatedColumn.columns = updatedColumns;
                        }
                        return updatedColumn;
                    }
                );
            });
        } else if (isadditionalcolumn === false && !isSubComponentColumn) {
            setManagedColumns((): any => {
                return [...managedColumns].map((column: Object): any => {
                    const updatedColumn = { ...column };
                    const {
                        columnId,
                        innerCells,
                        isGroupHeader
                    } = updatedColumn;
                    const groupedColumns = updatedColumn.columns;
                    if (
                        columnId === columnid &&
                        innerCells &&
                        innerCells.length > 0
                    ) {
                        updatedColumn.innerCells = updatedDisplayOfInnerCells(
                            [...innerCells],
                            cellid,
                            checked
                        );
                    } else if (
                        isGroupHeader === true &&
                        groupedColumns &&
                        groupedColumns.length > 0
                    ) {
                        const updatedColumns = [...groupedColumns].map(
                            (col: Object): any => {
                                const updatedCol = { ...col };
                                if (
                                    col.columnId === columnid &&
                                    col.innerCells &&
                                    col.innerCells.length > 0
                                ) {
                                    updatedCol.innerCells = updatedDisplayOfInnerCells(
                                        [...col.innerCells],
                                        cellid,
                                        checked
                                    );
                                }
                                return updatedCol;
                            }
                        );
                        updatedColumn.columns = updatedColumns;
                    }
                    return updatedColumn;
                });
            });
        } else if (
            isSubComponentColumn &&
            managedSubComponentAdditionalColumn
        ) {
            setManagedSubComponentAdditionalColumn(
                update(managedSubComponentAdditionalColumn, {
                    innerCells: {
                        $set: changeInnerCellSelection(
                            managedSubComponentAdditionalColumn.innerCells,
                            cellid,
                            checked
                        )
                    }
                })
            );
        } else if (managedAdditionalColumn) {
            setManagedAdditionalColumn(
                update(managedAdditionalColumn, {
                    innerCells: {
                        $set: changeInnerCellSelection(
                            managedAdditionalColumn.innerCells,
                            cellid,
                            checked
                        )
                    }
                })
            );
        }
    };

    // #endregion

    const resetColumnUpdate = () => {
        setWarning("");
        setManagedColumns(
            update(managedColumns, {
                $set: originalColumns
            })
        );
        setManagedAdditionalColumn(
            update(managedAdditionalColumn, {
                $set: originalAdditionalColumn
            })
        );
        if (isSubComponentGrid) {
            setManagedSubComponentColumns(
                update(managedSubComponentColumns, {
                    $set: originalSubComponentColumns
                })
            );
            setManagedSubComponentAdditionalColumn(
                update(managedSubComponentAdditionalColumn, {
                    $set: originalSubComponentAdditionalColumn
                })
            );
        }
        updateColumnStructure(
            originalColumns,
            originalAdditionalColumn,
            originalSubComponentColumns,
            originalSubComponentAdditionalColumn
        );
    };

    const onColumnChooserSave = () => {
        setWarning("");
        const filteredManagedColumns = managedColumns.filter(
            (column: Object): any => {
                return column.display === true;
            }
        );
        const filteredManagedSubComponentColumns = managedSubComponentColumns.filter(
            (column: Object): any => {
                return column.display === true;
            }
        );
        if (!(filteredManagedColumns && filteredManagedColumns.length > 0)) {
            setWarning("Select at least one parent column");
        } else if (
            isSubComponentGrid &&
            !(
                filteredManagedSubComponentColumns &&
                filteredManagedSubComponentColumns.length > 0
            )
        ) {
            setWarning("Select at least one sub component column");
        } else {
            const pinnedManagedColumns = managedColumns.filter(
                (column: Object): any => {
                    return column.pinLeft === true;
                }
            );
            const unpinnedManagedColumns = managedColumns.filter(
                (column: Object): any => {
                    return column.pinLeft !== true;
                }
            );
            const pinnedManagedSubComponentColumns = managedSubComponentColumns.filter(
                (column: Object): any => {
                    return column.pinLeft === true;
                }
            );
            const unpinnedManagedSubComponentColumns = managedSubComponentColumns.filter(
                (column: Object): any => {
                    return column.pinLeft !== true;
                }
            );
            updateColumnStructure(
                [...pinnedManagedColumns, ...unpinnedManagedColumns],
                managedAdditionalColumn,
                [
                    ...pinnedManagedSubComponentColumns,
                    ...unpinnedManagedSubComponentColumns
                ],
                managedSubComponentAdditionalColumn
            );
            toggleManageColumnsOverlay();
        }
    };

    useEffect(() => {
        setManagedColumns([...columns]);
        if (isAdditionalColumnPresent) {
            setManagedAdditionalColumn({ ...additionalColumn });
        }
        if (isSubComponentGrid) {
            setManagedSubComponentColumns([...subComponentColumns]);
            if (isSubComponentAdditionalColumnPresent) {
                setManagedSubComponentAdditionalColumn({
                    ...subComponentAdditionalColumn
                });
            }
        }
    }, []);

    if (managedColumns && managedColumns.length > 0) {
        const isAdditionalColumnSelected =
            managedAdditionalColumn !== null &&
            managedAdditionalColumn.display === true;
        const additionalColumnHeader = isAdditionalColumnPresent
            ? additionalColumn.Header
            : "";
        const managedAdditionalColumnInnercells =
            isAdditionalColumnSelected && managedAdditionalColumn != null
                ? managedAdditionalColumn.innerCells
                : [];
        const managedAdditionalColumnColumnId =
            isAdditionalColumnSelected && managedAdditionalColumn != null
                ? managedAdditionalColumn.columnId
                : "";
        const managedAdditionalColumnDisplayType =
            isAdditionalColumnSelected && managedAdditionalColumn != null
                ? managedAdditionalColumn.isDisplayInExpandedRegion
                : true;

        const isSubComponentAdditionalColumnSelected =
            isSubComponentGrid &&
            managedSubComponentAdditionalColumn !== null &&
            managedSubComponentAdditionalColumn.display === true;
        const subComponentAdditionalColumnHeader = isSubComponentAdditionalColumnPresent
            ? subComponentAdditionalColumn.Header
            : "";
        const managedSubComponentAdditionalColumnInnercells =
            isSubComponentAdditionalColumnSelected &&
            managedSubComponentAdditionalColumn != null
                ? managedSubComponentAdditionalColumn.innerCells
                : [];
        const managedSubComponentAdditionalColumnColumnId =
            isSubComponentAdditionalColumnSelected &&
            managedSubComponentAdditionalColumn != null
                ? managedSubComponentAdditionalColumn.columnId
                : "";
        const managedSubComponentAdditionalColumnDisplayType =
            isSubComponentAdditionalColumnSelected &&
            managedSubComponentAdditionalColumn != null
                ? managedSubComponentAdditionalColumn.isDisplayInExpandedRegion
                : true;

        return (
            <ClickAwayListener
                onClickAway={toggleManageColumnsOverlay}
                className="ng-popover ng-popover--column"
                data-testid="managecolumnoverlay"
            >
                <div className="ng-popover__chooser">
                    <div className="ng-popover__header">
                        <span>Column Chooser</span>
                    </div>
                    <ColumnsSearch
                        columns={[...columns]}
                        additionalColumn={additionalColumn}
                        managedColumns={managedColumns}
                        managedAdditionalColumn={managedAdditionalColumn}
                        isSubComponentGrid={isSubComponentGrid}
                        subComponentColumns={[...subComponentColumns]}
                        subComponentAdditionalColumn={
                            subComponentAdditionalColumn
                        }
                        managedSubComponentColumns={managedSubComponentColumns}
                        managedSubComponentAdditionalColumn={
                            managedSubComponentAdditionalColumn
                        }
                        updateColumns={updateColumns}
                    />
                </div>
                <div className="ng-popover__settings">
                    <div className="ng-popover__header">
                        <div>
                            <span>Column Settings</span>
                            {warning !== "" ? (
                                <strong
                                    className="ng-popover--column__warning"
                                    data-testid="column-chooser-error"
                                >
                                    {warning}
                                </strong>
                            ) : null}
                        </div>
                        <div
                            className="ng-popover--column__close"
                            role="presentation"
                            onClick={toggleManageColumnsOverlay}
                        >
                            <i>
                                <IconCancel className="ng-icon" />
                            </i>
                        </div>
                    </div>
                    <div className="ng-popover--column__body">
                        <div className="ng-popover--column__head">
                            Parent Column
                        </div>
                        <DndProvider
                            backend={MultiBackend}
                            options={HTML5toTouch}
                        >
                            <ColumnsList
                                managedColumns={managedColumns}
                                onColumnReorder={onColumnReorder}
                                onPinColumnChange={onPinColumnChange}
                                onInnerCellChange={onInnerCellChange}
                                isSubComponentColumn={false}
                                enablePinColumn={enablePinColumn}
                            />
                        </DndProvider>
                        {isAdditionalColumnSelected ? (
                            <>
                                <div className="ng-popover--column__head">
                                    Additional Data ( Expand View)
                                </div>
                                <div
                                    className="ng-popover--column__reorder is-full-width"
                                    data-testid="additional-column-box"
                                >
                                    <div className="ng-popover--column__reorder-head">
                                        {additionalColumnHeader}
                                    </div>
                                    <div className="ng-popover--column__list">
                                        {managedAdditionalColumnInnercells.map(
                                            (cell: Object): Object => {
                                                const {
                                                    cellId,
                                                    Header,
                                                    display
                                                } = cell;
                                                return (
                                                    <div
                                                        className="ng-popover--column__wrap"
                                                        key={`${cellId}`}
                                                    >
                                                        <div className="ng-popover--column__check">
                                                            <div className="neo-form-check">
                                                                <input
                                                                    type="checkbox"
                                                                    id={`chk_selectInnerCell_${cellId}`}
                                                                    className="neo-checkbox"
                                                                    data-testid={`selectInnerCell_${managedAdditionalColumnColumnId}_${cellId}`}
                                                                    checked={
                                                                        display
                                                                    }
                                                                    onChange={(
                                                                        event: any
                                                                    ): any =>
                                                                        onInnerCellChange(
                                                                            event,
                                                                            false,
                                                                            managedAdditionalColumnColumnId,
                                                                            cellId,
                                                                            managedAdditionalColumnDisplayType
                                                                        )
                                                                    }
                                                                />
                                                                <label
                                                                    htmlFor={`chk_selectInnerCell_${cellId}`}
                                                                    className="neo-form-check__label"
                                                                >
                                                                    {Header}
                                                                </label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            }
                                        )}
                                    </div>
                                </div>
                            </>
                        ) : null}
                        {isSubComponentGrid ? (
                            <>
                                <div className="ng-popover--column__head">
                                    Child Column
                                </div>
                                <DndProvider
                                    backend={MultiBackend}
                                    options={HTML5toTouch}
                                >
                                    <ColumnsList
                                        managedColumns={
                                            managedSubComponentColumns
                                        }
                                        onColumnReorder={onColumnReorder}
                                        onPinColumnChange={onPinColumnChange}
                                        onInnerCellChange={onInnerCellChange}
                                        isSubComponentColumn
                                        enablePinColumn={enablePinColumn}
                                    />
                                </DndProvider>
                                {isSubComponentAdditionalColumnSelected ? (
                                    <>
                                        <div className="ng-popover--column__head">
                                            Additional Data ( Expand View)
                                        </div>
                                        <div
                                            className="ng-popover--column__reorder is-full-width"
                                            data-testid="sub-component-additional-column-box"
                                        >
                                            <div className="ng-popover--column__reorder-head">
                                                {
                                                    subComponentAdditionalColumnHeader
                                                }
                                            </div>
                                            <div className="ng-popover--column__list">
                                                {managedSubComponentAdditionalColumnInnercells.map(
                                                    (cell: Object): any => {
                                                        const {
                                                            cellId,
                                                            Header,
                                                            display
                                                        } = cell;
                                                        return (
                                                            <div
                                                                className="ng-popover--column__wrap"
                                                                key={`${cellId}`}
                                                            >
                                                                <div className="ng-popover--column__check">
                                                                    <div className="neo-form-check">
                                                                        <input
                                                                            type="checkbox"
                                                                            id={`chk_selectSubComponentInnerCell_${cellId}`}
                                                                            className="neo-checkbox"
                                                                            data-testid={`selectSubComponentInnerCell_${managedSubComponentAdditionalColumnColumnId}_${cellId}`}
                                                                            checked={
                                                                                display
                                                                            }
                                                                            onChange={(
                                                                                event: any
                                                                            ): any =>
                                                                                onInnerCellChange(
                                                                                    event,
                                                                                    true,
                                                                                    managedSubComponentAdditionalColumnColumnId,
                                                                                    cellId,
                                                                                    managedSubComponentAdditionalColumnDisplayType
                                                                                )
                                                                            }
                                                                        />
                                                                        <label
                                                                            htmlFor={`chk_selectSubComponentInnerCell_${cellId}`}
                                                                            className="neo-form-check__label"
                                                                        >
                                                                            {
                                                                                Header
                                                                            }
                                                                        </label>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        );
                                                    }
                                                )}
                                            </div>
                                        </div>
                                    </>
                                ) : null}
                            </>
                        ) : null}
                    </div>
                    <div className="ng-popover__footer">
                        <button
                            type="button"
                            className="neo-btn neo-btn-default btn btn-secondary"
                            data-testid="reset_columnsManage"
                            onClick={resetColumnUpdate}
                        >
                            Reset
                        </button>
                        <button
                            type="button"
                            className="neo-btn neo-btn-default btn btn-secondary"
                            data-testid="cancel_columnsManage"
                            onClick={toggleManageColumnsOverlay}
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            className="neo-btn neo-btn-primary btn btn-secondary"
                            data-testid="save_columnsManage"
                            onClick={onColumnChooserSave}
                        >
                            Save
                        </button>
                    </div>
                </div>
            </ClickAwayListener>
        );
    }
    return null;
};

export default ColumnReordering;
