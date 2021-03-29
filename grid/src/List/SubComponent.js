// @flow
import React, { useMemo, useEffect } from "react";
import {
    useTable,
    useFlexLayout,
    useRowSelect,
    useExpanded
} from "react-table";
import RowSelector from "../Functions/RowSelector";
import RowOptions from "../Functions/RowOptions";
import { IconAngle } from "../Utilities/SvgUtilities";
import {
    checkdisplayOfGroupedColumns,
    hideColumns,
    getLeftOfColumn,
    isLastPinnedColumn,
    getTotalWidthOfPinnedColumns
} from "../Utilities/GridUtilities";

const SubComponent = (props: {
    gridRef: any,
    subComponentData: Array<Object>,
    subComponentColumnns: Array<Object>,
    subComponentAdditionalColumn: Object,
    getRowInfo: Function,
    rowActions: Function,
    expandableColumn: boolean,
    rowSelector: boolean,
    multiRowSelection: boolean
}): React$Element<*> => {
    const {
        gridRef,
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

    const columns = useMemo((): Object => subComponentColumnns);
    const data = useMemo((): Object => [...subComponentData]);

    let isAtleastOneColumnPinned = false;
    subComponentColumnns.forEach((col: Object) => {
        const { pinColumn } = col;
        if (pinColumn === true) {
            isAtleastOneColumnPinned = true;
        }
    });

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
        allColumns
    } = useTable(
        {
            columns,
            data,
            isAtleastOneColumnPinned,
            autoResetExpanded: false,
            autoResetSelectedRows: false
        },
        useExpanded,
        useRowSelect,
        useFlexLayout,
        (hooks: Object): Object => {
            // Add checkbox for all rows in grid, with different properties for header row and body rows, only if required
            if (rowSelector !== false) {
                hooks.allColumns.push((hookColumns: Object): Object => [
                    {
                        id: "subcomponent_selection",
                        columnId: "subComponentColumn_custom_0",
                        disableResizing: true,
                        disableFilters: true,
                        disableSortBy: true,
                        display: true,
                        pinColumn: isAtleastOneColumnPinned,
                        isGroupHeader: false,
                        minWidth: 62,
                        width: 62,
                        maxWidth: 62,
                        Header: (headerSelectProps: Object): Object => {
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
                        Cell: (cellSelectProps: Object): Object => {
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
                hooks.allColumns.push((hookColumns: Object): Object => [
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
                        Cell: (cellCustomProps: Object): Object => {
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

    useEffect(() => {
        hideColumns(allColumns, subComponentColumnns);
    }, [subComponentColumnns]);

    return (
        <div
            {...getTableProps()}
            className="neo-grid__content neo-grid__content--sub"
            data-testid="subcomponent-content"
        >
            <div className="neo-grid__thead">
                {headerGroups.map(
                    (headerGroup: Object, index: number): Object => {
                        // If there are morthan 1 headerGroups, we consider 1st one as group header row
                        const isGroupHeader =
                            headerGroups.length > 1 ? index === 0 : false;
                        return (
                            <div
                                {...headerGroup.getHeaderGroupProps()}
                                className="neo-grid__tr"
                            >
                                {headerGroup.headers.map(
                                    (
                                        column: Object,
                                        headerIndex: number
                                    ): Object => {
                                        const {
                                            display,
                                            pinColumn,
                                            headers
                                        } = column;
                                        let isColumnPinned = pinColumn === true;
                                        if (
                                            isGroupHeader &&
                                            headers &&
                                            headers.length > 0
                                        ) {
                                            isColumnPinned =
                                                headers[0].pinColumn === true;
                                        }
                                        if (
                                            display === true ||
                                            checkdisplayOfGroupedColumns(column)
                                        ) {
                                            return (
                                                <div
                                                    {...column.getHeaderProps(
                                                        isColumnPinned
                                                            ? {
                                                                  style: {
                                                                      position:
                                                                          "sticky",
                                                                      left: getLeftOfColumn(
                                                                          gridRef,
                                                                          headerIndex,
                                                                          true,
                                                                          isGroupHeader
                                                                      )
                                                                  }
                                                              }
                                                            : {}
                                                    )}
                                                    className={`neo-grid__th ${
                                                        isGroupHeader === true
                                                            ? "neo-grid__th-group"
                                                            : ""
                                                    } ${
                                                        isColumnPinned
                                                            ? "sticky"
                                                            : ""
                                                    } ${
                                                        isColumnPinned &&
                                                        isLastPinnedColumn(
                                                            gridRef,
                                                            headerIndex,
                                                            true,
                                                            isGroupHeader
                                                        )
                                                            ? "sticky-last"
                                                            : ""
                                                    }`}
                                                    data-testid={
                                                        isGroupHeader === true
                                                            ? "subCompGrid-group-header"
                                                            : "subCompGrid-header"
                                                    }
                                                >
                                                    <div className="neo-grid__th-title">
                                                        {column.render(
                                                            "Header"
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        }
                                        return null;
                                    }
                                )}
                            </div>
                        );
                    }
                )}
            </div>
            <div {...getTableBodyProps()} className="neo-grid__tbody">
                {rows.map((row: Object): Object => {
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
                                    {cells.map(
                                        (
                                            cell: Object,
                                            cellIndex: number
                                        ): Object => {
                                            const { column } = cell;
                                            const {
                                                display,
                                                pinColumn
                                            } = column;
                                            if (display === true) {
                                                return (
                                                    <div
                                                        {...cell.getCellProps(
                                                            pinColumn === true
                                                                ? {
                                                                      style: {
                                                                          position:
                                                                              "sticky",
                                                                          left: getLeftOfColumn(
                                                                              gridRef,
                                                                              cellIndex,
                                                                              true,
                                                                              false
                                                                          )
                                                                      }
                                                                  }
                                                                : {}
                                                        )}
                                                        className={`neo-grid__td ${
                                                            pinColumn
                                                                ? "sticky"
                                                                : ""
                                                        } ${
                                                            pinColumn &&
                                                            isLastPinnedColumn(
                                                                gridRef,
                                                                cellIndex,
                                                                true,
                                                                false
                                                            )
                                                                ? "sticky-last"
                                                                : ""
                                                        }`}
                                                        data-testid="subcontentrow_cell"
                                                    >
                                                        {cell.render("Cell")}
                                                    </div>
                                                );
                                            }
                                            return null;
                                        }
                                    )}
                                </div>

                                {isExpanded ? (
                                    <div
                                        className="neo-grid__row-expand"
                                        data-testid="subcontentrow_expandedregion"
                                    >
                                        {isAtleastOneColumnPinned ? (
                                            <div
                                                className="sticky sticky-last"
                                                style={{
                                                    width: getTotalWidthOfPinnedColumns(
                                                        gridRef,
                                                        true,
                                                        false
                                                    )
                                                }}
                                            />
                                        ) : null}
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
