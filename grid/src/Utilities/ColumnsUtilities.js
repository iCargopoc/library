import React from "react";
import CellDisplayAndEdit from "../Functions/CellDisplayAndEdit";

export const extractColumns = (
    columns,
    searchColumn,
    isDesktop,
    updateRowInGrid
) => {
    // Remove iPad only columns from desktop and vice-versa
    const filteredColumns = columns.filter((column) => {
        return isDesktop ? !column.onlyInTablet : !column.onlyInDesktop;
    });

    const modifiedColumns = [];
    // Loop through the columns configuration and create required column structure
    filteredColumns.forEach((column, index) => {
        const { originalInnerCells, innerCells, accessor, sortValue } = column;
        const isInnerCellsPresent = innerCells && innerCells.length > 0;
        const isOriginalInnerCellsPresent =
            originalInnerCells && originalInnerCells.length > 0;
        const elem = column;

        // Add column Id
        elem.columnId = `column_${index}`;

        // Add an indentifier that this is a column not for expanded region
        elem.displayInExpandedRegion = false;

        // If there are no copies of original Cells create a new copy from Inner cells
        if (!isOriginalInnerCellsPresent && isInnerCellsPresent) {
            elem.originalInnerCells = innerCells;
        }

        // Configure Cell function (which is used by react-table component), based on the user defined function displayCell
        if (!elem.Cell && elem.displayCell) {
            elem.Cell = (row) => {
                return (
                    <CellDisplayAndEdit
                        row={row}
                        columns={columns}
                        updateRowInGrid={updateRowInGrid}
                    />
                );
            };
        }

        // Add logic to sort column if sort is not disabled
        if (!elem.disableSortBy) {
            if (isInnerCellsPresent) {
                // If there are inner cells and a sort value specified, do sort on that value
                if (sortValue) {
                    elem.sortType = (rowA, rowB) => {
                        return rowA.original[accessor][sortValue] >
                            rowB.original[accessor][sortValue]
                            ? -1
                            : 1;
                    };
                } else {
                    elem.disableSortBy = true;
                }
            } else if (!innerCells) {
                // If no inner cells are there, just do sort on column value
                elem.sortType = (rowA, rowB) => {
                    return rowA.original[accessor] > rowB.original[accessor]
                        ? -1
                        : 1;
                };
            }
        }

        // Add logic to filter column if column filter is not disabled
        if (!elem.disableFilters) {
            elem.filter = (rows, id, filterValue) => {
                const searchText = filterValue ? filterValue.toLowerCase() : "";
                return rows.filter((row) => {
                    // Find original data value of each row
                    const { original } = row;
                    // Do search for the column
                    return searchColumn(column, original, searchText);
                });
            };
        }

        modifiedColumns.push(column);
    });
    return modifiedColumns;
};

export const extractAdditionalColumn = (additionalColumn, isDesktop) => {
    const { originalInnerCells, innerCells } = additionalColumn;
    const isInnerCellsPresent = innerCells && innerCells.length > 0;
    const isOriginalInnerCellsPresent =
        originalInnerCells && originalInnerCells.length > 0;
    const element = additionalColumn;

    // Add column Id
    element.columnId = `ExpandColumn`;

    // Add an indentifier that this is a column for expanded region
    element.displayInExpandedRegion = true;

    // Remove iPad only columns from desktop and vice-versa
    if (isInnerCellsPresent) {
        const filteredInnerCells = innerCells.filter((cell) => {
            return isDesktop ? !cell.onlyInTablet : !cell.onlyInDesktop;
        });
        element.innerCells = filteredInnerCells;
        // If there are no copies of original Cells create a new copy from Inner cells
        if (!isOriginalInnerCellsPresent) {
            element.originalInnerCells = filteredInnerCells;
        }
    }

    return additionalColumn;
};
