// @flow
import React from "react";
import { matchSorter } from "match-sorter";
import CellDisplayAndEdit from "../Functions/CellDisplayAndEdit";
import { AdditionalColumnContext } from "./TagsContext";
import AdditionalColumnTag from "../Functions/AdditionalColumnTag";

export const extractColumns = (
    columns: any,
    isDesktop: boolean,
    updateRowInGrid: Function,
    expandableColumn: any,
    isParentGrid: boolean,
    isSubComponentColumns: boolean
): Object => {
    if (columns && columns.length > 0) {
        // Create a list of search keys that has to be used for global filtering
        const columnsAccessorList = [];

        // Remove iPad only columns from desktop and vice-versa
        const filteredColumns = columns.filter((column: Object): boolean => {
            return isDesktop ? !column.onlyInTablet : !column.onlyInDesktop;
        });

        const modifiedColumns = [];
        // Loop through the columns configuration and create required column structure
        filteredColumns.forEach((column: Object, index: number) => {
            // Create a copy to modify
            const elem = { ...column };

            const {
                innerCells,
                accessor,
                sortValue,
                searchKeys,
                widthGrow
            } = column;

            // Check if inner cells are present
            const isInnerCellsPresent = innerCells && innerCells.length > 0;

            // Add column Id
            elem.columnId =
                isSubComponentColumns === true
                    ? `subComponentColumn_${index}`
                    : `column_${index}`;

            // Set Width grow value if not set
            if (!(typeof widthGrow === "number" && widthGrow >= 0)) {
                elem.widthGrow = 0;
            }

            // Set a copy of the column width
            elem.originalWidth = column.width;

            // Add flag to identify if this is subcomponent column
            elem.isSubComponentColumn = isSubComponentColumns === true;

            // Set display flag to true if not present
            if (elem.display !== false) {
                elem.display = true;
            }

            // Set pin column flag
            if (elem.pinLeft !== true) {
                elem.pinLeft = false;
            }

            // If innerCells are present, loop through inner cells and set flag and Id
            if (isInnerCellsPresent) {
                // Set isSortable for column as false if that column is having innercells and none are sortable
                let isInnerCellSortable = false;

                innerCells.map((cell: Object, cellIndex: number): Object => {
                    const cellElem = cell;

                    // Add cell Id
                    cellElem.cellId =
                        isSubComponentColumns === true
                            ? `subComponentColumn_${index}_cell_${cellIndex}`
                            : `column_${index}_cell_${cellIndex}`;

                    // Add flag to identify if this is subcomponent column
                    cellElem.isSubComponentColumn =
                        isSubComponentColumns === true;

                    // Set the display flag to true if not present
                    if (cellElem.display !== false) {
                        cellElem.display = true;
                    }

                    // Update isInnerCellSortable to true if any of the inner cells are sortable
                    if (cellElem.isSortable === true) {
                        isInnerCellSortable = true;
                    }

                    return cellElem;
                });

                // Update isSortable prop of column based on the value of isInnerCellSortable
                elem.isSortable = isInnerCellSortable;
            }

            // Add an indentifier that this is a column not for expanded region
            elem.isDisplayInExpandedRegion = false;

            // Add an indentifier that this is not a group header item
            elem.isGroupHeader = false;

            // Configure Cell function (which is used by react-table component), based on the user defined function displayCell
            if (!elem.Cell && elem.displayCell) {
                elem.Cell = (row: Object): React$Element<*> => {
                    return (
                        <CellDisplayAndEdit
                            row={row}
                            updateRowInGrid={updateRowInGrid}
                            expandableColumn={expandableColumn}
                            isDesktop={isDesktop}
                            isSubComponentColumns={isSubComponentColumns}
                        />
                    );
                };
            }

            // Add logic to sort column if sort is not disabled
            if (
                !elem.disableSortBy &&
                isParentGrid !== true &&
                isSubComponentColumns !== true
            ) {
                if (isInnerCellsPresent) {
                    // If there are inner cells and a sort value specified, do sort on that value
                    if (sortValue) {
                        elem.sortType = (
                            rowA: Object,
                            rowB: Object
                        ): number => {
                            let rowAValue = 0;
                            if (
                                rowA &&
                                rowA.original &&
                                rowA.original[accessor] !== null &&
                                rowA.original[accessor] !== undefined
                            ) {
                                rowAValue = rowA.original[accessor][sortValue];
                            }
                            let rowBValue = 0;
                            if (
                                rowB &&
                                rowB.original &&
                                rowB.original[accessor] !== null &&
                                rowB.original[accessor] !== undefined
                            ) {
                                rowBValue = rowB.original[accessor][sortValue];
                            }
                            return rowAValue > rowBValue ? -1 : 1;
                        };
                    } else {
                        elem.disableSortBy = true;
                    }
                } else {
                    // If no inner cells are there, just do sort on column value
                    elem.sortType = (rowA: Object, rowB: Object): number => {
                        const rowAValue = rowA.original[accessor] || null;
                        const rowBValue = rowB.original[accessor] || null;
                        return rowAValue > rowBValue ? -1 : 1;
                    };
                }
            } else {
                elem.disableSortBy = true;
            }

            // If searchKeys is provided, use it for column filtering and global filtering
            if (searchKeys && searchKeys.length > 0) {
                // Create a list of search keys to be used for column filtering
                const columnSearchKeys = [];
                // Loop through searchKeys
                searchKeys.forEach((item: string) => {
                    // Create matchSorter search key object
                    const searchKey = {
                        threshold: matchSorter.rankings.CONTAINS,
                        key: isSubComponentColumns
                            ? `original.subComponentData.*.${item}`
                            : `original.${item}`
                    };
                    // Push it to both column filtering and global filtering search keys list
                    columnSearchKeys.push(searchKey);
                    columnsAccessorList.push(searchKey);
                });
                // Set column filter logic using list created
                elem.filter = (
                    rows: any,
                    id: string,
                    filterValue: string
                ): any =>
                    matchSorter(rows, filterValue, {
                        keys: columnSearchKeys,
                        sorter: (rankedItems: Object): Object => rankedItems // To avoid automatic sorting based on match
                    });
            } else {
                elem.disableFilters = true;
            }

            modifiedColumns.push(elem);
        });

        const updatedColumnStructure = [];
        modifiedColumns.forEach((modifiedColumn: Object, index: number) => {
            if (!modifiedColumn.groupHeader) {
                updatedColumnStructure.push(modifiedColumn);
            } else {
                const existingGroupHeaderColumn = updatedColumnStructure.find(
                    (colStructure: Object): boolean => {
                        return (
                            colStructure.Header === modifiedColumn.groupHeader
                        );
                    }
                );
                if (!existingGroupHeaderColumn) {
                    updatedColumnStructure.push({
                        Header: modifiedColumn.groupHeader,
                        columnId:
                            isSubComponentColumns === true
                                ? `subComponentGroupedColumn_${index}`
                                : `groupedColumn_${index}`,
                        isGroupHeader: true,
                        display: true,
                        pinLeft: false,
                        columns: [modifiedColumn]
                    });
                } else {
                    existingGroupHeaderColumn.columns.push(modifiedColumn);
                }
            }
        });
        return {
            updatedColumnStructure,
            columnsAccessorList
        };
    }
    return { updatedColumnStructure: [], columnsAccessorList: [] };
};

export const extractAdditionalColumn = (
    additionalColumn: Object,
    isDesktop: boolean,
    isSubComponentColumns: boolean
): Object => {
    const { innerCells } = additionalColumn || {};

    // If innerCells are defined
    if (innerCells && innerCells.length > 0) {
        // Remove iPad only inner cells from desktop and vice-versa
        const filteredInnerCells = innerCells.filter(
            (cell: Object): boolean => {
                return isDesktop ? !cell.onlyInTablet : !cell.onlyInDesktop;
            }
        );

        // If valid inner cells are present
        if (filteredInnerCells && filteredInnerCells.length > 0) {
            const element = additionalColumn;

            // Create a list of search keys that has to be used for global filtering
            const columnToExpandAccessorList = [];

            // Add column Id
            element.columnId =
                isSubComponentColumns === true
                    ? "subComponentRowExpand"
                    : `rowExpand`;

            // Add flag to identify if this is subcomponent column
            element.isSubComponentColumn = isSubComponentColumns === true;

            // Set display flag to true if not present
            if (element.display !== false) {
                element.display = true;
            }

            // Add an indentifier that this is a column for expanded region
            element.isDisplayInExpandedRegion = true;

            // Loop through inner cells and set flag and Id
            filteredInnerCells.map(
                (cell: Object, cellIndex: number): Object => {
                    const cellElem = cell;

                    // Add cell Id
                    cellElem.cellId =
                        isSubComponentColumns === true
                            ? `subComponentRowExpand_cell_${cellIndex}`
                            : `rowExpand_cell_${cellIndex}`;

                    // Add flag to identify if this is subcomponent column
                    cellElem.isSubComponentColumn =
                        isSubComponentColumns === true;

                    // Set the display flag to true if not present
                    if (cellElem.display !== false) {
                        cellElem.display = true;
                    }

                    // If searchKeys is provided, use it for global filtering
                    const { searchKeys } = cell;
                    if (searchKeys && searchKeys.length > 0) {
                        // Loop through searchKeys
                        searchKeys.forEach((item: string) => {
                            // Create matchSorter search key object
                            const searchKey = {
                                threshold: matchSorter.rankings.CONTAINS,
                                key: isSubComponentColumns
                                    ? `original.subComponentData.*.${item}`
                                    : `original.${item}`
                            };
                            // Push it to global filtering search keys list
                            columnToExpandAccessorList.push(searchKey);
                        });
                    }

                    return cellElem;
                }
            );

            // Configure Cell function (which is custom function), to bind data into expanded region
            if (!element.Cell && element.displayCell) {
                element.Cell = (
                    row: Object,
                    updatedAdditionalColumn: Object
                ): any => {
                    const { original } = row;
                    return (
                        <AdditionalColumnContext.Provider
                            value={{
                                additionalColumn: updatedAdditionalColumn
                            }}
                        >
                            {element.displayCell(
                                original,
                                AdditionalColumnTag,
                                isDesktop
                            )}
                        </AdditionalColumnContext.Provider>
                    );
                };
            }

            element.innerCells = filteredInnerCells;

            return {
                updatedColumnToExpandStructure: element,
                columnToExpandAccessorList
            };
        }
    }
    return {
        updatedColumnToExpandStructure: null,
        columnToExpandAccessorList: []
    };
};
