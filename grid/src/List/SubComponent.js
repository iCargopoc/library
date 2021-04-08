/* eslint-disable no-use-before-define */
// @flow
import React, { useMemo, useCallback, useEffect } from "react";
import { matchSorter } from "match-sorter";
import {
    useTable,
    useGlobalFilter,
    useFlexLayout,
    useRowSelect,
    useExpanded
} from "react-table";
import RowSelector from "../Functions/RowSelector";
import RowOptions from "../Functions/RowOptions";
import { IconAngle, IconPinColumn } from "../Utilities/SvgUtilities";
import {
    checkdisplayOfGroupedColumns,
    hideColumns,
    getLeftOfColumn,
    isLastPinnedColumn,
    getTotalWidthOfPinnedColumns,
    updateAccessorList
} from "../Utilities/GridUtilities";

const SubComponent = (props: {
    gridRef: any,
    subComponentData: Array<Object>,
    subComponentColumns: Array<Object>,
    subComponentAdditionalColumn: Object,
    subComponentColumnsAccessorList: any,
    subComponentAdditionalColumnAccessorList: any,
    subComponentIdAttribute: string,
    rowIdAttrValue: any,
    userSelectedCurrentRowSubCompRows: any,
    userSelectedCurrentRowSubCompRowIds: any,
    updateSubCompRowIdentifiers: Function,
    subComponentHeader: boolean,
    getRowInfo: Function,
    rowActions: Function,
    expandableColumn: boolean,
    rowSelector: boolean,
    multiRowSelection: boolean,
    enablePinColumn: boolean,
    gridGlobalFilterValue: any
}): React$Element<*> => {
    const {
        gridRef,
        subComponentData,
        subComponentColumns,
        subComponentAdditionalColumn,
        subComponentIdAttribute,
        rowIdAttrValue,
        userSelectedCurrentRowSubCompRows,
        userSelectedCurrentRowSubCompRowIds,
        updateSubCompRowIdentifiers,
        subComponentHeader,
        getRowInfo,
        rowActions,
        expandableColumn,
        subComponentColumnsAccessorList,
        subComponentAdditionalColumnAccessorList,
        rowSelector,
        multiRowSelection,
        enablePinColumn,
        gridGlobalFilterValue
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

    const columns = useMemo((): Object => subComponentColumns);
    const data = useMemo((): Object => [...subComponentData]);

    let isAtleastOneColumnPinned = false;
    subComponentColumns.forEach((col: Object) => {
        const { pinLeft } = col;
        if (pinLeft === true) {
            isAtleastOneColumnPinned = true;
        }
    });

    const onGridRowSelect = (
        rowsIdAttrsList: any,
        rowsIdsList: any,
        selectionType: string
    ) => {
        let copyUserSelectedCurrentRowSubCompRows = [
            ...userSelectedCurrentRowSubCompRows
        ];
        let copyUserSelectedCurrentRowSubCompRowIds = {
            ...userSelectedCurrentRowSubCompRowIds
        };

        rowsIdAttrsList.forEach((value: any) => {
            const existingValueIndex = copyUserSelectedCurrentRowSubCompRows.findIndex(
                (item: any): boolean => {
                    return item === value;
                }
            );
            if (existingValueIndex >= 0 && selectionType === "deselect") {
                copyUserSelectedCurrentRowSubCompRows.splice(
                    existingValueIndex,
                    1
                );
            } else if (
                existingValueIndex === -1 &&
                selectionType === "select"
            ) {
                if (multiRowSelection === false) {
                    copyUserSelectedCurrentRowSubCompRows = [value];
                } else {
                    copyUserSelectedCurrentRowSubCompRows.push(value);
                }
            }
        });

        rowsIdsList.forEach((idValue: any) => {
            if (selectionType === "deselect") {
                delete copyUserSelectedCurrentRowSubCompRowIds[idValue];
            } else {
                if (multiRowSelection === false) {
                    copyUserSelectedCurrentRowSubCompRowIds = {};
                }
                copyUserSelectedCurrentRowSubCompRowIds[idValue] = true;
            }
        });

        updateSubCompRowIdentifiers(
            rowIdAttrValue,
            copyUserSelectedCurrentRowSubCompRows,
            copyUserSelectedCurrentRowSubCompRowIds,
            selectionType
        );
    };

    // Create a list of updated accessors to be searched from columns array
    const accessorList = [
        ...updateAccessorList(subComponentColumnsAccessorList),
        ...updateAccessorList(subComponentAdditionalColumnAccessorList)
    ];

    // Global Search Filter Logic - React table wants all parameters passed into useTable function to be memoized
    const globalFilterLogic = useCallback(
        (
            rowsToFilter: Array<Object>,
            columnsToFilter: Object,
            filterValue: string
        ): Object => {
            // Do match-sorter and return results
            return matchSorter(rowsToFilter, filterValue, {
                keys: accessorList,
                sorter: (rankedItems: Object): Object => rankedItems // To avoid automatic sorting based on match
            });
        },
        [subComponentColumns, subComponentAdditionalColumn]
    );

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
        allColumns,
        setGlobalFilter,
        toggleRowSelected,
        toggleAllRowsSelected
    } = useTable(
        {
            columns,
            data,
            initialState: {
                globalFilter: gridGlobalFilterValue,
                selectedRowIds: userSelectedCurrentRowSubCompRowIds
            },
            isAtleastOneColumnPinned,
            isRowActionsColumnNeeded,
            enablePinColumn,
            globalFilter: globalFilterLogic,
            autoResetGlobalFilter: false,
            autoResetExpanded: false,
            autoResetSelectedRows: false
        },
        useGlobalFilter,
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
                        isAutoPinned: true,
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
                                    {...getToggleAllRowsSelectedProps({
                                        onClick: (event: Object): Object => {
                                            if (subComponentIdAttribute) {
                                                // Set state value to identify if checkbox has been selected or deselected
                                                const selectedType =
                                                    event.currentTarget
                                                        .checked === false
                                                        ? "deselect"
                                                        : "select";
                                                toggleAllRowsSelected();
                                                const rowsIds = [];
                                                const rowsIdAttr = [];
                                                rows.forEach((row: Object) => {
                                                    const {
                                                        original,
                                                        id
                                                    } = row;
                                                    rowsIds.push(id);
                                                    rowsIdAttr.push(
                                                        original[
                                                            subComponentIdAttribute
                                                        ]
                                                    );
                                                });
                                                onGridRowSelect(
                                                    rowsIdAttr,
                                                    rowsIds,
                                                    selectedType
                                                );
                                            }
                                        }
                                    })}
                                />
                            );
                        },
                        Cell: (cellSelectProps: Object): Object => {
                            const { row } = cellSelectProps;
                            const { original, id } = row;
                            // Check if row selector is required for this row using the getRowInfo prop passed
                            let isRowSelectable = true;
                            if (
                                getRowInfo &&
                                typeof getRowInfo === "function"
                            ) {
                                const rowInfo = getRowInfo(original, true);
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
                                        {...row.getToggleRowSelectedProps({
                                            onClick: (
                                                event: Object
                                            ): Object => {
                                                if (subComponentIdAttribute) {
                                                    // Set state value to identify if checkbox has been selected or deselected
                                                    const selectedType =
                                                        event.currentTarget
                                                            .checked === false
                                                            ? "deselect"
                                                            : "select";
                                                    row.toggleRowSelected();
                                                    const rowIdAttr =
                                                        original[
                                                            subComponentIdAttribute
                                                        ];
                                                    onGridRowSelect(
                                                        [rowIdAttr],
                                                        [id],
                                                        selectedType
                                                    );
                                                }
                                            }
                                        })}
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
                            const { original } = row;
                            // Check if expand icon is required for this row using the getRowInfo prop passed
                            let isRowExpandable = true;
                            if (
                                getRowInfo &&
                                typeof getRowInfo === "function"
                            ) {
                                const rowInfo = getRowInfo(original, true);
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
        hideColumns(allColumns, subComponentColumns);
    }, [subComponentColumns]);

    useEffect(() => {
        setGlobalFilter(gridGlobalFilterValue || undefined);
    }, [gridGlobalFilterValue]);

    // Update the select state of row in Grid using the hook provided by useTable method
    // Find the row Id using the key - value passed from props and use toggleRowSelected method to select the checkboxes
    // Consider rowsToSelect, rowsToDeselect and already made selections and then select wanted rows and deselect unwanted rows.
    // This should hapen whenever data changes or group sort is applied
    useEffect(() => {
        if (subComponentIdAttribute) {
            let rowsToBeSelected =
                userSelectedCurrentRowSubCompRows &&
                userSelectedCurrentRowSubCompRows.length > 0
                    ? [...userSelectedCurrentRowSubCompRows]
                    : [];
            // If Grid selection is single selection consider only the first item in array
            if (multiRowSelection === false) {
                rowsToBeSelected =
                    rowsToBeSelected.length > 0 ? [rowsToBeSelected[0]] : [];
            }
            if (rowsToBeSelected && rowsToBeSelected.length > 0) {
                rowsToBeSelected.forEach((rowId: string): Object => {
                    const rowToSelect = rows.find((row: Object): Object => {
                        const { original } = row;
                        return original[subComponentIdAttribute] === rowId;
                    });
                    if (rowToSelect) {
                        const { id } = rowToSelect;
                        toggleRowSelected(id, true);
                    }
                });
            }
        }
    }, [userSelectedCurrentRowSubCompRows]);

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
                                                isAutoPinned,
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
                                                            {isGroupHeader ===
                                                            false ? (
                                                                <div className="neo-grid__th-iconblock">
                                                                    {!isAutoPinned &&
                                                                    (isColumnPinnedLeft ||
                                                                        isColumnPinnedRight) ? (
                                                                        <i className="neo-grid__th-icon">
                                                                            <IconPinColumn className="ng-icon neo-grid__pin" />
                                                                        </i>
                                                                    ) : null}
                                                                </div>
                                                            ) : null}
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
                                                    ),
                                                    minWidth: getTotalWidthOfPinnedColumns(
                                                        "left",
                                                        gridRef,
                                                        true,
                                                        false
                                                    ),
                                                    maxWidth: getTotalWidthOfPinnedColumns(
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
                                                    ),
                                                    minWidth: getTotalWidthOfPinnedColumns(
                                                        "right",
                                                        gridRef,
                                                        true,
                                                        false
                                                    ),
                                                    maxWidth: getTotalWidthOfPinnedColumns(
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
