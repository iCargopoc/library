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
    width,
    setSize,
    isRowExpandEnabled,
    additionalColumn,
    isLoadMoreChildRowsRequiredForRow,
    lastPage,
    loadMoreChildData,
    isParentGrid,
    fixedRowHeight,
    isLoadMoreRequiredForNormalRow,
    subComponentColumns,
    subComponentHeader,
    subComponentAdditionalColumn,
    subComponentColumnsAccessorList,
    subComponentAdditionalColumnAccessorList,
    subComponentIdAttribute,
    userSelectedSubCompRowIdentifiers,
    updateSubCompRowIdentifiers,
    isSubComponentGrid,
    rowsWithExpandedSubComponents,
    getRowInfo,
    rowActions,
    expandableColumn,
    rowSelector,
    multiRowSelection,
    isRowActionsColumnNeeded,
    enablePinColumn,
    gridGlobalFilterValue
}: {
    gridRef: any,
    row: Object,
    isAtleastOneColumnPinned: boolean,
    idAttribute: string,
    theme: string,
    index: number,
    width: number,
    setSize: Function,
    isRowExpandEnabled: boolean,
    additionalColumn: Object,
    isLoadMoreChildRowsRequiredForRow: Function,
    lastPage: boolean,
    loadMoreChildData: Function,
    isParentGrid: boolean,
    fixedRowHeight: boolean,
    isLoadMoreRequiredForNormalRow: Function,
    subComponentColumns: Array<Object>,
    subComponentAdditionalColumn: Object,
    subComponentColumnsAccessorList: any,
    subComponentAdditionalColumnAccessorList: any,
    subComponentIdAttribute: string,
    userSelectedSubCompRowIdentifiers: any,
    updateSubCompRowIdentifiers: Function,
    isSubComponentGrid: boolean,
    subComponentHeader: boolean,
    rowsWithExpandedSubComponents: Array<Object>,
    getRowInfo: Function,
    rowActions: Function,
    expandableColumn: boolean,
    rowSelector: boolean,
    multiRowSelection: boolean,
    isRowActionsColumnNeeded: boolean,
    enablePinColumn: boolean,
    gridGlobalFilterValue: any
}): React$Element<*> => {
    const { isExpanded, cells, original } = row;
    const { subComponentData } = original;
    const rowIdAttrValue = original[idAttribute];
    const isSubComponentRowsPresent =
        isSubComponentGrid &&
        subComponentData !== null &&
        subComponentData !== undefined &&
        subComponentData.length > 0 &&
        rowsWithExpandedSubComponents.includes(rowIdAttrValue);

    const existingRowIdentifierValue = userSelectedSubCompRowIdentifiers.find(
        (identifier: Object): boolean => {
            const { rowId } = identifier;
            return rowId === rowIdAttrValue;
        }
    );
    const userSelectedCurrentRowSubCompRows =
        existingRowIdentifierValue !== null &&
        existingRowIdentifierValue !== undefined
            ? existingRowIdentifierValue.rowIdentifiers
            : [];
    const userSelectedCurrentRowSubCompRowIds =
        existingRowIdentifierValue !== null &&
        existingRowIdentifierValue !== undefined
            ? existingRowIdentifierValue.rowIds
            : {};

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
                                                pinLeft
                                                    ? "ng-sticky ng-sticky--left"
                                                    : ""
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
                    {isSubComponentRowsPresent ? (
                        <SubComponent
                            gridRef={gridRef}
                            subComponentData={subComponentData}
                            subComponentColumns={subComponentColumns}
                            subComponentAdditionalColumn={
                                subComponentAdditionalColumn
                            }
                            subComponentColumnsAccessorList={
                                subComponentColumnsAccessorList
                            }
                            subComponentAdditionalColumnAccessorList={
                                subComponentAdditionalColumnAccessorList
                            }
                            subComponentIdAttribute={subComponentIdAttribute}
                            rowIdAttrValue={rowIdAttrValue}
                            userSelectedCurrentRowSubCompRows={
                                userSelectedCurrentRowSubCompRows
                            }
                            userSelectedCurrentRowSubCompRowIds={
                                userSelectedCurrentRowSubCompRowIds
                            }
                            updateSubCompRowIdentifiers={
                                updateSubCompRowIdentifiers
                            }
                            subComponentHeader={subComponentHeader}
                            getRowInfo={getRowInfo}
                            rowActions={rowActions}
                            expandableColumn={expandableColumn}
                            rowSelector={rowSelector}
                            multiRowSelection={multiRowSelection}
                            enablePinColumn={enablePinColumn}
                            gridGlobalFilterValue={gridGlobalFilterValue}
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
                        <div className="ng-loadmore" style={{ width }}>
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
