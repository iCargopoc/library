// @flow
import React from "react";
import {
    getLeftOfColumn,
    isLastPinnedColumn,
    getTotalWidthOfPinnedColumns
} from "../Utilities/GridUtilities";

const GridRow = ({
    gridRef,
    isRowExpandEnabled,
    row,
    isAtleastOneColumnPinned,
    additionalColumn,
    enablePinColumn,
    isRowActionsColumnNeeded
}: Object): React$Element<*> => {
    const { isExpanded, cells } = row;
    return (
        <>
            <div
                data-testid="gridrowWrap"
                className={`neo-grid__row-wrap ${
                    isRowExpandEnabled && isExpanded
                        ? "neo-grid__row-wrap--expand"
                        : ""
                }`}
            >
                {cells.map((cell: Object, cellIndex: number): Object => {
                    const { column } = cell;
                    const { display, pinLeft, pinRight } = column;
                    const isColumnPinnedRight =
                        pinLeft !== true && pinRight === true;
                    if (display === true) {
                        return (
                            <div
                                {...cell.getCellProps(
                                    pinLeft === true
                                        ? {
                                              style: {
                                                  left: getLeftOfColumn(
                                                      gridRef,
                                                      cellIndex,
                                                      false,
                                                      false
                                                  )
                                              }
                                          }
                                        : {}
                                )}
                                className={`neo-grid__td ${
                                    pinLeft ? "ng-sticky ng-sticky--left" : ""
                                } ${
                                    pinLeft &&
                                    isLastPinnedColumn(
                                        gridRef,
                                        cellIndex,
                                        false,
                                        false
                                    )
                                        ? "ng-sticky--left__last"
                                        : ""
                                } ${
                                    isColumnPinnedRight
                                        ? "ng-sticky ng-sticky--right"
                                        : ""
                                }`}
                                data-testid="gridrowcell"
                            >
                                {cell.render("Cell")}
                            </div>
                        );
                    }
                    return null;
                })}
            </div>

            {/* Check if row eapand icon is clicked, and if yes, call function to bind content to the expanded region */}
            {isRowExpandEnabled && isExpanded ? (
                <div
                    className="neo-grid__row-expand"
                    data-testid="rowExpandedRegion"
                >
                    {isAtleastOneColumnPinned ? (
                        <div
                            className="ng-sticky ng-sticky--left ng-sticky--left__last"
                            style={{
                                width: getTotalWidthOfPinnedColumns(
                                    "left",
                                    gridRef,
                                    false,
                                    false
                                ),
                                minWidth: getTotalWidthOfPinnedColumns(
                                    "left",
                                    gridRef,
                                    false,
                                    false
                                ),
                                maxWidth: getTotalWidthOfPinnedColumns(
                                    "left",
                                    gridRef,
                                    false,
                                    false
                                )
                            }}
                        />
                    ) : null}
                    {additionalColumn.Cell(row, additionalColumn)}
                    {enablePinColumn && isRowActionsColumnNeeded ? (
                        <div
                            className="ng-sticky ng-sticky--right"
                            style={{
                                width: getTotalWidthOfPinnedColumns(
                                    "right",
                                    gridRef,
                                    false,
                                    false
                                ),
                                minWidth: getTotalWidthOfPinnedColumns(
                                    "right",
                                    gridRef,
                                    false,
                                    false
                                ),
                                maxWidth: getTotalWidthOfPinnedColumns(
                                    "right",
                                    gridRef,
                                    false,
                                    false
                                )
                            }}
                        />
                    ) : null}
                </div>
            ) : null}
        </>
    );
};
export default GridRow;
