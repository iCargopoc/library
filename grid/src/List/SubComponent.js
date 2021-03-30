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
    subComponentHeader: boolean,
    getRowInfo: Function,
    rowActions: Function,
    expandableColumn: boolean,
    rowSelector: boolean,
    multiRowSelection: boolean,
    enablePinColumn: boolean
}): React$Element<*> => {
    const {
        gridRef,
        subComponentData,
        subComponentColumnns,
        subComponentAdditionalColumn,
        subComponentHeader,
        getRowInfo,
        rowActions,
        expandableColumn,
        rowSelector,
        multiRowSelection,
        enablePinColumn
    } = props;

    const isRowExpandEnabled = !!(
        subComponentAdditionalColumn &&
        Object.keys(subComponentAdditionalColumn).length > 0 &&
        subComponentAdditionalColumn.display === true &&
        subComponentAdditionalColumn.Cell &&
        typeof subComponentAdditionalColumn.Cell === "function"
    );
    const isRowActionsAvailable = !!(
        rowActions && typeof rowActions === "function"
    ); // If row actions are available
    const isRowExpandAvailable = isRowExpandEnabled || expandableColumn; // If row expand option is available
    const isRowActionsColumnNeeded =
        isRowActionsAvailable || isRowExpandAvailable;

    const columns = useMemo((): Object => subComponentColumnns);
    const data = useMemo((): Object => [...subComponentData]);

    let isAtleastOneColumnPinned = false;
    subComponentColumnns.forEach((col: Object) => {
        const { pinLeft } = col;
        if (pinLeft === true) {
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
            enablePinColumn,
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
                        pinLeft: isAtleastOneColumnPinned,
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
            if (isRowActionsColumnNeeded) {
                hooks.allColumns.push((hookColumns: Object): Object => [
                    ...hookColumns,
                    {
                        id: "subComponentCustom",
                        columnId: "subComponentColumn_custom_1",
                        disableResizing: true,
                        disableFilters: true,
                        disableSortBy: true,
                        display: true,
                        pinRight: enablePinColumn === true,
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
            {subComponentHeader === false ? null : (
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
                                    data-testid={
                                        isGroupHeader
                                            ? "subcompgrid-groupHeadersList"
                                            : "subcompgrid-headersList"
                                    }
                                >
                                    {headerGroup.headers.map(
                                        (
                                            column: Object,
                                            headerIndex: number
                                        ): Object => {
                                            const {
                                                display,
                                                pinLeft,
                                                pinRight,
                                                headers
                                            } = column;
                                            let isColumnPinnedLeft =
                                                pinLeft === true;
                                            let isColumnPinnedRight =
                                                !isColumnPinnedLeft &&
                                                pinRight === true;
                                            if (
                                                isGroupHeader &&
                                                headers &&
                                                headers.length > 0
                                            ) {
                                                isColumnPinnedLeft =
                                                    headers[0].pinLeft === true;
                                                isColumnPinnedRight =
                                                    !isColumnPinnedLeft &&
                                                    headers[0].pinRight ===
                                                        true;
                                            }
                                            if (
                                                display === true ||
                                                checkdisplayOfGroupedColumns(
                                                    column
                                                )
                                            ) {
                                                return (
                                                    <div
                                                        {...column.getHeaderProps(
                                                            isColumnPinnedLeft
                                                                ? {
                                                                      style: {
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
                                                            isGroupHeader ===
                                                            true
                                                                ? "neo-grid__th-group"
                                                                : ""
                                                        } ${
                                                            isColumnPinnedLeft
                                                                ? "ng-sticky ng-sticky--left"
                                                                : ""
                                                        } ${
                                                            isColumnPinnedLeft &&
                                                            isLastPinnedColumn(
                                                                gridRef,
                                                                headerIndex,
                                                                true,
                                                                isGroupHeader
                                                            )
                                                                ? "ng-sticky--left__last"
                                                                : ""
                                                        } ${
                                                            isColumnPinnedRight
                                                                ? "ng-sticky ng-sticky--right"
                                                                : ""
                                                        }`}
                                                        data-testid={
                                                            isGroupHeader ===
                                                            true
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
            )}
            <div
                {...getTableBodyProps()}
                className={`neo-grid__tbody ${
                    subComponentHeader === false
                        ? "neo-grid__tbody--nohead"
                        : ""
                }`}
            >
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
                                                pinLeft,
                                                pinRight
                                            } = column;
                                            const isColumnPinnedRight =
                                                pinLeft !== true &&
                                                pinRight === true;
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
                                                                              true,
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
                                                                true,
                                                                false
                                                            )
                                                                ? "ng-sticky--left__last"
                                                                : ""
                                                        } ${
                                                            isColumnPinnedRight
                                                                ? "ng-sticky ng-sticky--right"
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
                                                className="ng-sticky ng-sticky--left ng-sticky--left__last"
                                                style={{
                                                    width: getTotalWidthOfPinnedColumns(
                                                        "left",
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
                                        {enablePinColumn &&
                                        isRowActionsColumnNeeded ? (
                                            <div
                                                className="ng-sticky ng-sticky--right"
                                                style={{
                                                    width: getTotalWidthOfPinnedColumns(
                                                        "right",
                                                        gridRef,
                                                        true,
                                                        false
                                                    )
                                                }}
                                            />
                                        ) : null}
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
