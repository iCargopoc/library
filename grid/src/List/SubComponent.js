import React, { useMemo } from "react";
import { useTable, useFlexLayout, useExpanded } from "react-table";
import PropTypes from "prop-types";
import RowOptions from "../Functions/RowOptions";
import { IconAngle } from "../Utilities/SvgUtilities";

const SubComponent = (props) => {
    const {
        subComponentData,
        subComponentColumnns,
        subComponentAdditionalColumn,
        getRowInfo,
        rowActions,
        expandableColumn
    } = props;

    const isRowExpandEnabled = !!(
        subComponentAdditionalColumn &&
        Object.keys(subComponentAdditionalColumn).length > 0 &&
        subComponentAdditionalColumn.display === true &&
        subComponentAdditionalColumn.Cell &&
        typeof subComponentAdditionalColumn.Cell === "function"
    );

    const columns = useMemo(() => subComponentColumnns);
    const data = useMemo(() => [...subComponentData]);

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow
    } = useTable(
        {
            columns,
            data,
            autoResetExpanded: false
        },
        useFlexLayout,
        useExpanded,
        (hooks) => {
            // Add last column only if required
            const isRowActionsAvailable = !!(
                rowActions && typeof rowActions === "function"
            ); // If row actions are available
            const isRowExpandAvailable = isRowExpandEnabled || expandableColumn; // If row expand option is available
            if (isRowActionsAvailable || isRowExpandAvailable) {
                hooks.allColumns.push((hookColumns) => [
                    ...hookColumns,
                    {
                        id: "subComponentCustom",
                        columnId: "subComponentColumn_custom_1",
                        disableResizing: true,
                        disableFilters: true,
                        disableSortBy: true,
                        display: true,
                        isGroupHeader: false,
                        minWidth: 35,
                        width: 35,
                        maxWidth: 35,
                        Cell: (cellCustomProps) => {
                            const { row } = cellCustomProps;
                            // Check if expand icon is required for this row using the getRowInfo prop passed
                            let isRowExpandable = true;
                            if (
                                getRowInfo &&
                                typeof getRowInfo === "function"
                            ) {
                                const rowInfo = getRowInfo(row.original, true);
                                if (
                                    rowInfo &&
                                    rowInfo.isRowExpandable === false
                                ) {
                                    isRowExpandable = false;
                                }
                            }
                            return (
                                <div className="ng-action">
                                    {isRowActionsAvailable ? (
                                        <RowOptions
                                            row={row}
                                            rowActions={rowActions}
                                            isSubComponentRow
                                        />
                                    ) : null}
                                    {isRowExpandAvailable && isRowExpandable ? (
                                        <span
                                            className="ng-action__expander"
                                            data-testid="rowExpanderIcon"
                                            {...row.getToggleRowExpandedProps()}
                                        >
                                            <i>
                                                <IconAngle
                                                    className={
                                                        row.isExpanded
                                                            ? "ng-icon ng-action__arrow-up"
                                                            : "ng-icon ng-action__arrow-down"
                                                    }
                                                />
                                            </i>
                                        </span>
                                    ) : null}
                                </div>
                            );
                        }
                    }
                ]);
            }
        }
    );
    return (
        <div {...getTableProps()} className="neo-grid__content">
            <div className="neo-grid__thead">
                {headerGroups.map((headerGroup) => {
                    return (
                        <div
                            {...headerGroup.getHeaderGroupProps()}
                            className="neo-grid__tr"
                        >
                            {headerGroup.headers.map((column) => {
                                // If header is group header only render header value and not sort/filter/resize
                                return (
                                    <div
                                        {...column.getHeaderProps()}
                                        className="neo-grid__th"
                                    >
                                        <div
                                            className="neo-grid__th-title"
                                            data-testid="column-header-sort"
                                        >
                                            {column.render("Header")}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    );
                })}
            </div>
            {rows && rows.length > 0 ? (
                <div {...getTableBodyProps()} className="neo-grid__tbody">
                    {rows.map((row) => {
                        prepareRow(row);

                        const { original, cells, isExpanded } = row;
                        // Add classname passed by developer from getRowInfo prop to required rows
                        let rowClassName = "";
                        if (getRowInfo && typeof getRowInfo === "function") {
                            const rowInfo = getRowInfo(original, true);
                            if (rowInfo && rowInfo.className) {
                                rowClassName = rowInfo.className;
                            }
                        }
                        return (
                            <div
                                {...row.getRowProps()}
                                data-testid="gridrow"
                                className={`neo-grid__tr ${rowClassName}`}
                            >
                                <div className="neo-grid__row-container">
                                    <div
                                        data-testid="gridrowWrap"
                                        className="neo-grid__row-wrap"
                                    >
                                        {cells.map((cell) => {
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

                                    {isExpanded ? (
                                        <div
                                            className="neo-grid__row-expand"
                                            data-testid="rowExpandedRegion"
                                        >
                                            {subComponentAdditionalColumn.Cell(
                                                row,
                                                subComponentAdditionalColumn
                                            )}
                                        </div>
                                    ) : null}
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <h2 data-testid="nodataerror" className="ng-error">
                    No Records Found
                </h2>
            )}
        </div>
    );
};

export default SubComponent;

SubComponent.propTypes = {
    subComponentData: PropTypes.arrayOf(PropTypes.object),
    subComponentColumnns: PropTypes.arrayOf(PropTypes.object),
    subComponentAdditionalColumn: PropTypes.object,
    getRowInfo: PropTypes.func,
    rowActions: PropTypes.any,
    expandableColumn: PropTypes.bool
};
