import React from "react";
import PropTypes from "prop-types";
import Measure from "react-measure";
import SubComponent from "./SubComponent";

const RowItem = ({
    row,
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
    multiRowSelection
}) => {
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
            onResize={(contentRect) => {
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
            {({ measureRef }) => (
                <div ref={measureRef} className="neo-grid__row-container">
                    <div
                        data-testid="gridrowWrap"
                        className={`neo-grid__row-wrap ${
                            isRowExpandEnabled && isExpanded
                                ? "neo-grid__row-wrap--expand"
                                : ""
                        }`}
                    >
                        {cells.map((cell) => {
                            if (
                                (cell.column.columnId === "column_custom_2" &&
                                    isSubComponentGrid) ||
                                (cell.column.columnId !== "column_custom_2" &&
                                    cell.column.display === true)
                            ) {
                                return (
                                    <div
                                        {...cell.getCellProps()}
                                        className="neo-grid__td"
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
                            {additionalColumn.Cell(row, additionalColumn)}
                        </div>
                    ) : null}
                    {isSubComponentRowsPresent ? (
                        <SubComponent
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
                        <div
                            className="ng-loadmore"
                            data-testid="loadMoreChild"
                        >
                            <button
                                type="button"
                                className="neo-btn neo-btn-default btn btn-secondary"
                                data-testid="load-more-childdata"
                                onClick={() => loadMoreChildData(row)}
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

RowItem.propTypes = {
    row: PropTypes.object,
    idAttribute: PropTypes.string,
    theme: PropTypes.string,
    index: PropTypes.number,
    setSize: PropTypes.func,
    isRowExpandEnabled: PropTypes.bool,
    additionalColumn: PropTypes.object,
    isLoadMoreChildRowsRequiredForRow: PropTypes.func,
    lastPage: PropTypes.bool,
    loadMoreChildData: PropTypes.func,
    isParentGrid: PropTypes.bool,
    fixedRowHeight: PropTypes.bool,
    isNextPageLoading: PropTypes.bool,
    isLoadMoreRequiredForNormalRow: PropTypes.func,
    subComponentColumnns: PropTypes.arrayOf(PropTypes.object),
    subComponentAdditionalColumn: PropTypes.object,
    isSubComponentGrid: PropTypes.bool,
    rowsWithExpandedSubComponents: PropTypes.array,
    getRowInfo: PropTypes.func,
    rowActions: PropTypes.any,
    expandableColumn: PropTypes.bool,
    rowSelector: PropTypes.bool,
    multiRowSelection: PropTypes.bool
};

export default RowItem;
