import React, { useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { IconExpand, IconCollapse } from "../Utilities/SvgUtilities";

const RowsListItem = ({
    row,
    style,
    index,
    setSize,
    isParentGrid,
    multiRowSelection,
    parentRowExpandable,
    isRowExpandEnabled,
    isParentRowSelected,
    isParentRowCollapsed,
    toggleParentRowSelection,
    toggleParentRow,
    isParentRowOpen,
    isLoadMoreChildRowsRequiredForRow,
    loadMoreChildData,
    parentColumn,
    additionalColumn,
    getRowInfo
}) => {
    const rowItemRef = useRef();

    useEffect(() => {
        let rowHeight = 50;
        const rowElement = rowItemRef.current;
        if (rowElement) {
            const rowWrap = rowElement.querySelector(
                "[data-testid='gridrowWrap']"
            );
            const expandRegion = rowElement.querySelector(
                "[data-testid='rowExpandedRegion']"
            );
            if (rowWrap) {
                rowHeight = rowWrap.getBoundingClientRect().height;
                if (expandRegion) {
                    rowHeight += expandRegion.getBoundingClientRect().height;
                }
            }
        }
        setSize(index, rowHeight);
    });

    const { original } = row;
    if (original) {
        const { isParent, lastPage } = original;
        if (isParent === true && isParentGrid) {
            return (
                <div ref={rowItemRef} className="ng-accordion" style={style}>
                    <div className="ng-accordion__block">
                        {multiRowSelection !== false ? (
                            <div className="neo-form-check">
                                <input
                                    type="checkbox"
                                    data-testid="rowSelector-parentRow"
                                    className="neo-checkbox form-check-input"
                                    checked={isParentRowSelected(row)}
                                    onChange={(event) =>
                                        toggleParentRowSelection(event, row)
                                    }
                                />
                            </div>
                        ) : null}
                        {parentRowExpandable !== false ? (
                            <i
                                role="presentation"
                                className="ng-accordion__icon"
                                onClick={() => toggleParentRow(row, index)}
                                data-testid="acccordion-expand-collapse"
                            >
                                {isParentRowOpen(row) ? (
                                    <IconCollapse />
                                ) : (
                                    <IconExpand />
                                )}
                            </i>
                        ) : null}
                    </div>
                    <div className="ng-accordion__content">
                        {parentColumn.displayCell(original)}
                    </div>
                </div>
            );
        }

        // Add classname passed by developer from getRowInfo prop to required rows
        let rowClassName = "";
        if (getRowInfo && typeof getRowInfo === "function") {
            const rowInfo = getRowInfo(original);
            if (rowInfo && rowInfo.className) {
                rowClassName = rowInfo.className;
            }
        }

        // Check if this is a tree grid, and if parent row is in collapsed state. If yes, do not render its child rows
        if (isParentRowCollapsed(row)) {
            return null;
        }

        return (
            <div
                ref={rowItemRef}
                {...row.getRowProps({ style })}
                data-testid="gridrow"
                className={`neo-grid__tr ${rowClassName}`}
            >
                <div
                    data-testid="gridrowWrap"
                    className={`neo-grid__row-wrap ${
                        isRowExpandEnabled && row.isExpanded
                            ? "neo-grid__row-wrap--expand"
                            : ""
                    }`}
                >
                    {row.cells.map((cell) => {
                        if (cell.column.display === true) {
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
                {isRowExpandEnabled && row.isExpanded ? (
                    <div
                        className="neo-grid__row-expand"
                        data-testid="rowExpandedRegion"
                    >
                        {additionalColumn.Cell(row, additionalColumn)}
                    </div>
                ) : null}
                {isLoadMoreChildRowsRequiredForRow(index, lastPage) ? (
                    <div className="ng-loadmore">
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
        );
    }
    return null;
};

RowsListItem.propTypes = {
    row: PropTypes.object,
    style: PropTypes.object,
    index: PropTypes.number,
    setSize: PropTypes.func,
    isParentGrid: PropTypes.bool,
    multiRowSelection: PropTypes.bool,
    parentRowExpandable: PropTypes.bool,
    isRowExpandEnabled: PropTypes.bool,
    isParentRowSelected: PropTypes.func,
    isParentRowCollapsed: PropTypes.func,
    toggleParentRowSelection: PropTypes.func,
    toggleParentRow: PropTypes.func,
    isParentRowOpen: PropTypes.func,
    isLoadMoreChildRowsRequiredForRow: PropTypes.func,
    loadMoreChildData: PropTypes.func,
    parentColumn: PropTypes.object,
    additionalColumn: PropTypes.object,
    getRowInfo: PropTypes.func
};

export default RowsListItem;
