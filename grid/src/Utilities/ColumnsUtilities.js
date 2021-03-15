// @flow
import React from "react";
import { matchSorter } from "match-sorter";
import CellDisplayAndEdit from "../Functions/CellDisplayAndEdit";
import { AdditionalColumnContext } from "./TagsContext";
import AdditionalColumnTag from "../Functions/AdditionalColumnTag";

// Create Accessor List from Inner cells
const createAccessorListFromInnerCells = (
    currentAccessorList: any,
    accessorPart: String,
    innerCells: Array<Object>,
    isArray: boolean,
    isSubComponent: boolean
): any => {
    innerCells.forEach((innerCell: Object): Object => {
        const { isSearchable, accessor } = innerCell;
        if (isSearchable === true) {
            const cellInnerCells = innerCell.innerCells;
            const newAccessorPart =
                isArray === true
                    ? `${accessorPart}.*.${accessor}`
                    : `${accessorPart}.${accessor}`;
            if (cellInnerCells && cellInnerCells.length > 0) {
                createAccessorListFromInnerCells(
                    currentAccessorList,
                    newAccessorPart,
                    cellInnerCells,
                    innerCell.isArray,
                    isSubComponent
                );
            } else {
                currentAccessorList.push({
                    threshold: matchSorter.rankings.CONTAINS,
                    key: newAccessorPart
                });
            }
        }
    });
};

export const extractColumns = (
    columns: any,
    isDesktop: boolean,
    updateRowInGrid: Function,
    expandableColumn: any,
    isParentGrid: boolean,
    isSubComponentColumns: boolean
): Array<Object> => {
    if (columns && columns.length > 0) {
        // Create a list of accessors that has to be used for global filtering
        const columnsAccessorList = [];

        // Remove iPad only columns from desktop and vice-versa
        const filteredColumns = columns.filter((column: Object): boolean => {
            return isDesktop ? !column.onlyInTablet : !column.onlyInDesktop;
        });

        const modifiedColumns = [];
        // Loop through the columns configuration and create required column structure
        filteredColumns.forEach((column: Object, index: number) => {
            const {
                disableFilters,
                innerCells,
                accessor,
                sortValue,
                widthGrow,
                isArray,
                isSearchable
            } = column;
            const isInnerCellsPresent = innerCells && innerCells.length > 0;
            const isColumnFilterEnabled =
                disableFilters !== true && isSubComponentColumns !== true;
            const elem = { ...column };

            // To be used to create accessors list of all columns which can be used for global filtering
            const accessorPart =
                isSubComponentColumns === true
                    ? `original.subComponentData.*.${accessor}`
                    : `original.${accessor}`;

            // Variables for column filter section
            const accessorList = [];

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

            // Loop through inner cells and set flag and Id
            if (isInnerCellsPresent) {
                // Set isSortable for column as false if that column is having innercells and none are sortable
                let isInnerCellSortable = false;

                // Update accessor list for global search with innerCells
                createAccessorListFromInnerCells(
                    columnsAccessorList,
                    accessorPart,
                    innerCells,
                    isArray,
                    isSubComponentColumns
                );

                // Update accessor list for column search with innerCells
                if (isColumnFilterEnabled) {
                    createAccessorListFromInnerCells(
                        accessorList,
                        accessorPart,
                        innerCells,
                        isArray,
                        isSubComponentColumns
                    );
                }

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

            // If innercells not present add filter logic with column accessor
            if (!isInnerCellsPresent) {
                // Filter object for match-sorter
                const filterObj = {
                    threshold: matchSorter.rankings.CONTAINS,
                    key: accessorPart
                };

                // For column filter
                if (isColumnFilterEnabled) {
                    accessorList.push(filterObj);
                }
                // For global filter
                if (isSearchable) {
                    columnsAccessorList.push(filterObj);
                }

                // Set column filter logic
                elem.filter = (
                    rows: any,
                    id: String,
                    filterValue: String
                ): any =>
                    matchSorter(rows, filterValue, {
                        keys: accessorList,
                        sorter: (rankedItems: Object): Object => rankedItems // To avoid automatic sorting based on match
                    });
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
