// @flow
import React from "react";
import CellDisplayAndEdit from "../Functions/CellDisplayAndEdit";
import { AdditionalColumnContext } from "./TagsContext";
import AdditionalColumnTag from "../Functions/AdditionalColumnTag";

export const extractColumns = (
    columns: any,
    searchColumn: Function,
    isDesktop: boolean,
    updateRowInGrid: Function,
    expandableColumn: any,
    isParentGrid: boolean,
    isSubComponentColumns: boolean
): [] => {
    if (columns && columns.length > 0) {
        // Remove iPad only columns from desktop and vice-versa
        const filteredColumns = columns.filter((column: Object): boolean => {
            return isDesktop ? !column.onlyInTablet : !column.onlyInDesktop;
        });

        const modifiedColumns = [];
        // Loop through the columns configuration and create required column structure
        filteredColumns.forEach((column: Object, index: number) => {
            const { innerCells, accessor, sortValue } = column;
            const isInnerCellsPresent = innerCells && innerCells.length > 0;
            const elem = column;

            // Add column Id
            elem.columnId =
                isSubComponentColumns === true
                    ? `subComponentColumn_${index}`
                    : `column_${index}`;

            // Add flag to identify if this is subcomponent column
            elem.isSubComponentColumn = isSubComponentColumns === true;

            // Set display flag to true if not present
            if (elem.display !== false) {
                elem.display = true;
            }

            // Loop through inner cells and set flag and Id
            if (isInnerCellsPresent) {
                // Set isSortable for column as false if that column is having innercells and none are sortable
                let isInnerCellSortable = false;

                innerCells.map((cell: Object, cellIndex: number): Object => {
                    const cellElem = cell;

                    // Add column Id
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

            // Add logic to filter column if column filter is not disabled
            if (!elem.disableFilters && isSubComponentColumns !== true) {
                elem.filter = (
                    rows: any,
                    id: String,
                    filterValue: String
                ): any => {
                    const searchText = filterValue
                        ? filterValue.toLowerCase()
                        : "";
                    return rows.filter((row: any): boolean => {
                        // Find original data value of each row
                        const { original } = row;
                        // Do search for the column
                        return searchColumn(column, original, searchText);
                    });
                };
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
                        columnId: `groupedColumn_${index}`,
                        isGroupHeader: true,
                        display: true,
                        columns: [modifiedColumn]
                    });
                } else {
                    existingGroupHeaderColumn.columns.push(modifiedColumn);
                }
            }
        });
        return updatedColumnStructure;
    }
    return [];
};

export const extractAdditionalColumn = (
    additionalColumn: Object,
    isDesktop: boolean,
    isSubComponentColumns: boolean
): ?Object => {
    if (additionalColumn) {
        const { innerCells } = additionalColumn;
        const isInnerCellsPresent = innerCells && innerCells.length > 0;
        const element = additionalColumn;

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

        // Remove iPad only columns from desktop and vice-versa
        if (isInnerCellsPresent) {
            const filteredInnerCells = innerCells.filter(
                (cell: Object): boolean => {
                    return isDesktop ? !cell.onlyInTablet : !cell.onlyInDesktop;
                }
            );

            // Loop through inner cells and set flag and Id
            filteredInnerCells.map(
                (cell: Object, cellIndex: number): Object => {
                    const cellElem = cell;

                    // Add column Id
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

            return element;
        }
        return null;
    }
    return null;
};
