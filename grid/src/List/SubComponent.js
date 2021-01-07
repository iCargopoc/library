import React, { useMemo } from "react";
import {
    useTable,
    useFlexLayout,
    useRowSelect,
    useExpanded
} from "react-table";
import PropTypes from "prop-types";
import RowSelector from "../Functions/RowSelector";
import RowOptions from "../Functions/RowOptions";
import { IconAngle } from "../Utilities/SvgUtilities";

const SubComponent = (props) => {
    const {
        subComponentData,
        subComponentColumnns,
        subComponentAdditionalColumn,
        getRowInfo,
        rowActions,
        expandableColumn,
        rowSelector,
        multiRowSelection
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
            autoResetExpanded: false,
            autoResetSelectedRows: false
        },
        useExpanded,
        useRowSelect,
        useFlexLayout,
        (hooks) => {
            // Add checkbox for all rows in grid, with different properties for header row and body rows, only if required
            if (rowSelector !== false) {
                hooks.allColumns.push((hookColumns) => [
                    {
                        id: "subcomponent_selection",
                        columnId: "subComponentColumn_custom_0",
                        disableResizing: true,
                        disableFilters: true,
                        disableSortBy: true,
                        display: true,
                        isGroupHeader: false,
                        minWidth: 62,
                        width: 62,
                        maxWidth: 62,
                        Header: (headerSelectProps) => {
                            const {
                                getToggleAllRowsSelectedProps
                            } = headerSelectProps;
                            if (multiRowSelection === false) {
                                return null;
                            }
                            return (
                                <RowSelector
                                    data-testid="subcomponent-rowSelector-allRows"
                                    {...getToggleAllRowsSelectedProps()}
                                />
                            );
                        },
                        Cell: (cellSelectProps) => {
                            const { row } = cellSelectProps;
                            // Check if row selector is required for this row using the getRowInfo prop passed
                            let isRowSelectable = true;
                            if (
                                getRowInfo &&
                                typeof getRowInfo === "function"
                            ) {
                                const rowInfo = getRowInfo(row.original, true);
                                if (
                                    rowInfo &&
                                    rowInfo.isRowSelectable === false
                                ) {
                                    isRowSelectable = false;
                                }
                            }
                            if (isRowSelectable) {
                                return (
                                    <RowSelector
                                        data-testid="subcomponent-rowSelector-singleRow"
                                        {...row.getToggleRowSelectedProps()}
                                    />
                                );
                            }
                            return null;
                        }
                    },
                    ...hookColumns
                ]);
            }

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
                                            data-testid="subcontentrow_expandericon"
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
        <div
            {...getTableProps()}
            className="neo-grid__content neo-grid__content--sub"
            data-testid="subcomponent-content"
        >
            <div className="neo-grid__thead">
                {headerGroups.map((headerGroup) => {
                    return (
                        <div
                            {...headerGroup.getHeaderGroupProps()}
                            className="neo-grid__tr"
                        >
                            {headerGroup.headers.map((column) => {
                                const { display } = column;
                                if (display === true) {
                                    return (
                                        <div
                                            {...column.getHeaderProps()}
                                            className="neo-grid__th"
                                        >
                                            <div className="neo-grid__th-title">
                                                {column.render("Header")}
                                            </div>
                                        </div>
                                    );
                                }
                                return null;
                            })}
                        </div>
                    );
                })}
            </div>
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
                            data-testid="subcontentrow"
                            className={`neo-grid__tr ${rowClassName}`}
                        >
                            <div className="neo-grid__row-container">
                                <div
                                    data-testid="subcontentrow_wrap"
                                    className="neo-grid__row-wrap"
                                >
                                    {cells.map((cell) => {
                                        if (cell.column.display === true) {
                                            return (
                                                <div
                                                    {...cell.getCellProps()}
                                                    className="neo-grid__td"
                                                    data-testid="subcontentrow_cell"
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
                                        data-testid="subcontentrow_expandedregion"
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
    expandableColumn: PropTypes.bool,
    rowSelector: PropTypes.bool,
    multiRowSelection: PropTypes.bool
};
