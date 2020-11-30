import React, { useState, useEffect } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";
import MultiBackend, { TouchTransition } from "react-dnd-multi-backend";
import ClickAwayListener from "react-click-away-listener";
import PropTypes from "prop-types";
import update from "immutability-helper";
import ColumnSearch from "../common/columnsSearch";
import ColumnsList from "./columnsList";
import { IconClose } from "../../Utilities/SvgUtilities";

const ColumnReordering = (props) => {
    const {
        toggleManageColumnsOverlay,
        columns,
        additionalColumn,
        updateColumnStructure
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
        additionalColumn &&
        Object.keys(additionalColumn).length > 0 &&
        additionalColumn.innerCells &&
        additionalColumn.innerCells.length > 0;

    // Set state variables for:
    // managedColumns - main columns displayed in colum setting region
    // managedAdditionalColumn - additional column displayed in colum setting region
    // isErrorDisplayed - to see if error message has to be displayed or not
    const [managedColumns, setManagedColumns] = useState([]);
    const [managedAdditionalColumn, setManagedAdditionalColumn] = useState(
        null
    );
    const [isErrorDisplayed, setIsErrorDisplayed] = useState(false);

    // Update display value of column based on columnId
    const updatedDisplayOfColumn = (column, columnid, flag) => {
        const updatedColumn = { ...column };
        const { isGroupHeader, columnId } = column;
        const groupedColumns = column.columns;
        if (
            isGroupHeader === true &&
            groupedColumns &&
            groupedColumns.length > 0
        ) {
            let atleastOneColumnDisplayed = false;
            const updatedColumns = [...groupedColumns].map((col) => {
                const updatedCol = col;
                if (
                    (columnid &&
                        (columnid === "all" || columnid === col.columnId)) ||
                    columnid === undefined
                ) {
                    updatedCol.display = flag;
                }
                atleastOneColumnDisplayed =
                    atleastOneColumnDisplayed || updatedCol.display;
                return updatedCol;
            });
            updatedColumn.display = atleastOneColumnDisplayed;
            updatedColumn.columns = updatedColumns;
        } else if (
            (columnid && (columnid === "all" || columnid === columnId)) ||
            columnid === undefined
        ) {
            updatedColumn.display = flag;
        }
        return updatedColumn;
    };

    // Update display value of inner cells based on columnId & cellId
    const updatedDisplayOfInnerCells = (innerCells, cellid, flag) => {
        return [...innerCells].map((cell) => {
            const updatedCell = { ...cell };
            const { cellId } = cell;
            if (cellId === cellid || cellid === "all") {
                updatedCell.display = flag;
            }
            return updatedCell;
        });
    };

    // Update display value of managedAdditionalColumn state with given value
    const updatedDisplayOfAdditionalColumn = (flag) => {
        setManagedAdditionalColumn(
            update(managedAdditionalColumn, {
                display: { $set: flag }
            })
        );
    };

    // #region - Column chooser region
    // update the display flag value of column or all columns in managedColumns and managedAdditionalColumn state, based on the selection
    const updateColumns = (columnid, isadditionalcolumn, checked) => {
        if (
            columnid === "all" ||
            (isAdditionalColumnPresent && isadditionalcolumn === "true")
        ) {
            // Update additional column state if columnid is "all" or selected column has "isadditionalcolumn"
            updatedDisplayOfAdditionalColumn(checked);
        }
        if (isadditionalcolumn !== "true") {
            // Update main columns state based on selection and columnid, if selected column doesn't have "isadditionalcolumn"
            const updatedManagedColumns = [...managedColumns].map((column) => {
                return updatedDisplayOfColumn(column, columnid, checked);
            });
            setManagedColumns(
                update(managedColumns, {
                    $set: updatedManagedColumns
                })
            );
        }
    };
    // #endregion

    // #region - Column settings region
    // Updates the order of columns in managedColumns state
    const onColumnReorder = (reorderedColumns) => {
        setManagedColumns(
            update(managedColumns, {
                $set: reorderedColumns
            })
        );
    };

    // Updates the inner cell display value accordingly
    const changeInnerCellSelection = (innerCells, cellid, flag) => {
        const indexOfCell = innerCells.findIndex((cell) => {
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
    const onInnerCellChange = (event) => {
        if (event && event.currentTarget) {
            const { checked, dataset } = event.currentTarget;
            if (dataset) {
                const { columnid, cellid, isadditionalcolumn } = dataset;
                if (isadditionalcolumn === "false") {
                    setManagedColumns(() => {
                        return [...managedColumns].map((column) => {
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
                                    (col) => {
                                        const updatedCol = col;
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
                    isAdditionalColumnPresent &&
                    managedAdditionalColumn &&
                    managedAdditionalColumn.innerCells &&
                    managedAdditionalColumn.innerCells.length > 0
                ) {
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
            }
        }
    };

    // #endregion

    const resetColumnUpdate = () => {
        const columnsToReset = [...columns].map((column) => {
            const colToReset = column;
            const { isGroupHeader, innerCells } = column;
            const groupedColumns = column.columns;
            colToReset.display = true;
            if (
                isGroupHeader === true &&
                groupedColumns &&
                groupedColumns.length > 0
            ) {
                const updatedColumns = [...groupedColumns].map((col) => {
                    const updatedCol = col;
                    const groupedColInnerCells = col.innerCells;
                    updatedCol.display = true;
                    if (
                        groupedColInnerCells &&
                        groupedColInnerCells.length > 0
                    ) {
                        updatedCol.innerCells = updatedDisplayOfInnerCells(
                            [...groupedColInnerCells],
                            "all",
                            true
                        );
                    }
                    return updatedCol;
                });
                colToReset.columns = updatedColumns;
            }
            if (innerCells && innerCells.length > 0) {
                colToReset.innerCells = updatedDisplayOfInnerCells(
                    [...innerCells],
                    "all",
                    true
                );
            }
            return colToReset;
        });
        setManagedColumns(
            update(managedColumns, {
                $set: columnsToReset
            })
        );
        const additionalColumnToReset = { ...additionalColumn };
        additionalColumnToReset.display = true;
        if (
            additionalColumnToReset.innerCells &&
            additionalColumnToReset.innerCells.length > 0
        ) {
            const additionalInnerCellsToReset = [
                ...additionalColumnToReset.innerCells
            ].map((cell) => {
                const additionalCellToReset = cell;
                additionalCellToReset.display = true;
                return additionalCellToReset;
            });
            additionalColumnToReset.innerCells = additionalInnerCellsToReset;
        }
        setManagedAdditionalColumn(
            update(managedAdditionalColumn, {
                $set: additionalColumnToReset
            })
        );
        updateColumnStructure(columnsToReset, additionalColumnToReset);
    };

    const onColumnChooserSave = () => {
        setIsErrorDisplayed(false);
        const filteredManagedColumns = managedColumns.filter((column) => {
            return column.display === true;
        });
        if (filteredManagedColumns && filteredManagedColumns.length > 0) {
            updateColumnStructure(managedColumns, managedAdditionalColumn);
            toggleManageColumnsOverlay();
        } else {
            setIsErrorDisplayed(true);
        }
    };

    useEffect(() => {
        setManagedColumns([...columns]);
        setManagedAdditionalColumn(
            isAdditionalColumnPresent ? { ...additionalColumn } : null
        );
    }, []);

    if (managedColumns && managedColumns.length > 0) {
        const isAdditionalColumnSelected =
            managedAdditionalColumn !== null &&
            managedAdditionalColumn.innerCells &&
            managedAdditionalColumn.innerCells.length > 0 &&
            managedAdditionalColumn.display === true;
        const additionalColumnHeader = isAdditionalColumnPresent
            ? additionalColumn.Header
            : "";
        const managedAdditionalColumnInnercells = isAdditionalColumnSelected
            ? managedAdditionalColumn.innerCells
            : [];
        const managedAdditionalColumnColumnId = isAdditionalColumnSelected
            ? managedAdditionalColumn.columnId
            : "";
        const managedAdditionalColumnDisplayType = isAdditionalColumnSelected
            ? managedAdditionalColumn.isDisplayInExpandedRegion
            : "true";

        return (
            <ClickAwayListener
                onClickAway={toggleManageColumnsOverlay}
                className="ng-popover ng-popover--column"
            >
                <div className="ng-popover__chooser">
                    <div className="ng-popover__header">
                        <strong>Column Chooser</strong>
                    </div>
                    <ColumnSearch
                        columns={[...columns]}
                        additionalColumn={additionalColumn}
                        managedColumns={managedColumns}
                        managedAdditionalColumn={managedAdditionalColumn}
                        updateColumns={updateColumns}
                    />
                </div>
                <div className="ng-popover__settings">
                    <div className="ng-popover__header">
                        <div className="column__headerTxt">
                            <strong>Column Settings</strong>
                            {isErrorDisplayed ? (
                                <strong className="ng-popover--column__warning">
                                    Select at least one column
                                    {isAdditionalColumnPresent
                                        ? `(other than
                                        ${additionalColumnHeader})`
                                        : null}
                                </strong>
                            ) : null}
                        </div>
                        <div
                            className="ng-popover--column__close"
                            role="presentation"
                            onClick={toggleManageColumnsOverlay}
                        >
                            <i>
                                <IconClose />
                            </i>
                        </div>
                    </div>
                    <div className="ng-popover--column__body">
                        <DndProvider
                            backend={MultiBackend}
                            options={HTML5toTouch}
                        >
                            <ColumnsList
                                managedColumns={managedColumns}
                                onColumnReorder={onColumnReorder}
                                onInnerCellChange={onInnerCellChange}
                            />
                        </DndProvider>
                        {isAdditionalColumnSelected ? (
                            <div className="ng-popover--column__reorder is-full-width">
                                <div className="ng-popover--column__reorder-head">
                                    {additionalColumnHeader}
                                </div>
                                <div className="ng-popover--column__list">
                                    {managedAdditionalColumnInnercells.length >
                                    0
                                        ? managedAdditionalColumnInnercells.map(
                                              (cell) => {
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
                                                          <div className="column__checkbox">
                                                              <div className="form-check">
                                                                  <input
                                                                      type="checkbox"
                                                                      id={`chk_selectInnerCell_${cellId}`}
                                                                      className="form-check-input custom-checkbox form-check-input"
                                                                      data-testid={`selectInnerCell_${managedAdditionalColumnColumnId}_${cellId}`}
                                                                      data-columnid={
                                                                          managedAdditionalColumnColumnId
                                                                      }
                                                                      data-cellid={
                                                                          cellId
                                                                      }
                                                                      data-isadditionalcolumn={
                                                                          managedAdditionalColumnDisplayType
                                                                      }
                                                                      checked={
                                                                          display
                                                                      }
                                                                      onChange={
                                                                          onInnerCellChange
                                                                      }
                                                                  />
                                                                  <label
                                                                      htmlFor={`chk_selectInnerCell_${cellId}`}
                                                                      className="form-check-label"
                                                                  >
                                                                      {Header}
                                                                  </label>
                                                              </div>
                                                          </div>
                                                      </div>
                                                  );
                                              }
                                          )
                                        : null}
                                </div>
                            </div>
                        ) : null}
                    </div>
                    <div className="ng-popover--column__footer">
                        <div className="ng-popover--column__btns">
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
                </div>
            </ClickAwayListener>
        );
    }
    return null;
};

ColumnReordering.propTypes = {
    toggleManageColumnsOverlay: PropTypes.func,
    columns: PropTypes.arrayOf(PropTypes.object),
    additionalColumn: PropTypes.object,
    updateColumnStructure: PropTypes.func
};

export default ColumnReordering;
