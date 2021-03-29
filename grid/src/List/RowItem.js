// @flow
import React from "react";
import Measure from "react-measure";
import SubComponent from "./SubComponent";
import {
    getLeftOfColumn,
    isLastPinnedColumn,
    getTotalWidthOfPinnedColumns
} from "../Utilities/GridUtilities";

const RowItem = ({
    gridRef,
    row,
    isAtleastOneColumnPinned,
    idAttribute,
    theme,
    index,
    setSize,
    isRowExpandEnabled,
    additionalColumn,
    isLoadMoreChildRowsRequiredForRow,
    lastPage,
    loadMoreChildData,
    isParentGrid,
    fixedRowHeight,
    isLoadMoreRequiredForNormalRow,
    subComponentColumnns,
    subComponentAdditionalColumn,
    isSubComponentGrid,
    rowsWithExpandedSubComponents,
    getRowInfo,
    rowActions,
    expandableColumn,
    rowSelector,
    multiRowSelection,
    isRowActionsColumnNeeded,
    enablePinRight
}: {
    gridRef: any,
    row: Object,
    isAtleastOneColumnPinned: boolean,
    idAttribute: string,
    theme: string,
    index: number,
    setSize: Function,
    isRowExpandEnabled: boolean,
    additionalColumn: Object,
    isLoadMoreChildRowsRequiredForRow: Function,
    lastPage: boolean,
    loadMoreChildData: Function,
    isParentGrid: boolean,
    fixedRowHeight: boolean,
    isLoadMoreRequiredForNormalRow: Function,
    subComponentColumnns: Array<Object>,
    subComponentAdditionalColumn: Object,
    isSubComponentGrid: boolean,
    rowsWithExpandedSubComponents: Array<Object>,
    getRowInfo: Function,
    rowActions: Function,
    expandableColumn: boolean,
    rowSelector: boolean,
    multiRowSelection: boolean,
    isRowActionsColumnNeeded: boolean,
    enablePinRight: boolean
}): React$Element<*> => {
    const { isExpanded, cells, original } = row;
    const { subComponentData } = original;
    const isSubComponentRowsPresent =
        isSubComponentGrid &&
        subComponentData !== null &&
        subComponentData !== undefined &&
        subComponentData.length > 0 &&
        rowsWithExpandedSubComponents.includes(original[idAttribute]);

    return (
        <Measure
            bounds
            onResize={(contentRect: Object) => {
                if (
                    fixedRowHeight !== true || // Calcualte if not fixedRowHeight
                    (!isParentGrid && index === 0) || // calculate if fixedRowHeight and index is 0 of normal Grid
                    (isParentGrid && index === 1) // calculate if fixedRowHeight and index is 1 of parent Grid
                ) {
                    let rowItemHeight = contentRect.bounds.height;
                    if (theme === "portal") {
                        rowItemHeight += 10;
                    }
                    setSize(index, rowItemHeight);
                }
            }}
        >
            {({ measureRef }: Object): Object => (
                <div ref={measureRef} className="neo-grid__row-container">
                    <div
                        data-testid="gridrowWrap"
                        className={`neo-grid__row-wrap ${
                            isRowExpandEnabled && isExpanded
                                ? "neo-grid__row-wrap--expand"
                                : ""
                        }`}
                    >
                        {cells.map(
                            (cell: Object, cellIndex: number): Object => {
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
                                                              position:
                                                                  "sticky",
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
                                                pinLeft ? "sticky" : ""
                                            } ${
                                                pinLeft &&
                                                isLastPinnedColumn(
                                                    gridRef,
                                                    cellIndex,
                                                    false,
                                                    false
                                                )
                                                    ? "sticky-last"
                                                    : ""
                                            } ${
                                                isColumnPinnedRight
                                                    ? "stickyRight"
                                                    : ""
                                            }`}
                                            data-testid="gridrowcell"
                                        >
                                            {cell.render("Cell")}
                                        </div>
                                    );
                                }
                                return null;
                            }
                        )}
                    </div>

                    {/* Check if row eapand icon is clicked, and if yes, call function to bind content to the expanded region */}
                    {isRowExpandEnabled && isExpanded ? (
                        <div
                            className="neo-grid__row-expand"
                            data-testid="rowExpandedRegion"
                        >
                            {isAtleastOneColumnPinned ? (
                                <div
                                    className="sticky sticky-last"
                                    style={{
                                        width: getTotalWidthOfPinnedColumns(
                                            "left",
                                            gridRef,
                                            false,
                                            false
                                        )
                                    }}
                                />
                            ) : null}
                            {additionalColumn.Cell(row, additionalColumn)}
                            {enablePinRight && isRowActionsColumnNeeded ? (
                                <div
                                    className="stickyRight"
                                    style={{
                                        width: getTotalWidthOfPinnedColumns(
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
                    {isSubComponentRowsPresent ? (
                        <SubComponent
                            gridRef={gridRef}
                            subComponentData={subComponentData}
                            subComponentColumnns={subComponentColumnns}
                            subComponentAdditionalColumn={
                                subComponentAdditionalColumn
                            }
                            getRowInfo={getRowInfo}
                            rowActions={rowActions}
                            expandableColumn={expandableColumn}
                            rowSelector={rowSelector}
                            multiRowSelection={multiRowSelection}
                            enablePinRight={enablePinRight}
                        />
                    ) : null}
                    {isLoadMoreRequiredForNormalRow(index) ? (
                        <div className="ng-loader">
                            <div className="ng-loader__block">
                                <div className="ng-loader__item" />
                                <div className="ng-loader__item" />
                                <div className="ng-loader__item" />
                                <div className="ng-loader__item" />
                            </div>
                        </div>
                    ) : null}
                    {isLoadMoreChildRowsRequiredForRow(index, lastPage) ? (
                        <div className="ng-loadmore">
                            <button
                                type="button"
                                className="neo-btn neo-btn-default btn btn-secondary"
                                data-testid="load-more-childdata"
                                onClick={(): Object => loadMoreChildData(row)}
                            >
                                Load more....
                            </button>
                        </div>
                    ) : null}
                </div>
            )}
        </Measure>
    );
};
export default RowItem;
