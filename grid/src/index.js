import React, { memo, useMemo, useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
    extractColumns,
    extractAdditionalColumn
} from "./Utilities/ColumnsUtilities";
import { AdditionalColumnContext } from "./Utilities/TagsContext";
import AdditionalColumnTag from "./Functions/AdditionalColumnTag";
import Customgrid from "./Customgrid";
// eslint-disable-next-line import/no-unresolved
import "!style-loader!css-loader!sass-loader!./Styles/main.scss";

const Grid = memo((props) => {
    const {
        title,
        gridHeight,
        gridWidth,
        loadData,
        columns,
        columnToExpand,
        rowActions,
        rowActionCallback,
        getRowEditOverlay,
        updateRowData,
        deleteRowData,
        selectBulkData,
        calculateRowHeight
    } = props;

    // Check if device is desktop
    const isDesktop = window.innerWidth > 1024;

    // Set state value for variable to check if there is anext page available
    const [hasNextPage, setHasNextPage] = useState(true);
    // Set state value for variable to check if the loading process is going on
    const [isNextPageLoading, setIsNextPageLoading] = useState(false);
    // Local state value for checking if data is being loaded from API
    const [isLoading, setIsLoading] = useState(false);
    // Set state value for variable to hold grid data
    const [items, setItems] = useState([]);
    // Local state for group sort options
    const [groupSortOptions, setGroupSortOptions] = useState([]);

    // Logic for searching in each column
    const searchColumn = (column, original, searchText) => {
        // Return value
        let isValuePresent = false;
        // Find the accessor node and inner cells array of each column
        const { accessor, innerCells } = column;
        // Find accessor value of a column
        const rowAccessorValue = original[accessor];
        // Check if inner cells are available and save value to boolean var
        const isInnerCellsPresent = innerCells && innerCells.length > 0;
        // Enter if cell value is object or array
        if (typeof rowAccessorValue === "object" && isInnerCellsPresent) {
            // Enter if cell value is array
            if (rowAccessorValue.length > 0) {
                // Loop through cell array value and check if searched text is present
                rowAccessorValue.forEach((value) => {
                    innerCells.forEach((cell) => {
                        const dataAccessor = value[cell.accessor];
                        if (
                            dataAccessor &&
                            dataAccessor
                                .toString()
                                .toLowerCase()
                                .includes(searchText)
                        ) {
                            isValuePresent = true;
                        }
                    });
                });
            } else {
                // If cell value is an object, loop through inner cells and check if searched text is present
                innerCells.forEach((cell) => {
                    const dataAccessor = original[accessor][cell.accessor];
                    if (
                        dataAccessor &&
                        dataAccessor
                            .toString()
                            .toLowerCase()
                            .includes(searchText)
                    ) {
                        isValuePresent = true;
                    }
                });
            }
        } else {
            // If cell value is not an object or array, convert it to text and check if searched text is present
            const dataAccessor = original[accessor];
            if (
                dataAccessor &&
                dataAccessor.toString().toLowerCase().includes(searchText)
            ) {
                isValuePresent = true;
            }
        }
        return isValuePresent;
    };

    // Gets triggered when one row item is updated
    const updateRowInGrid = (original, updatedRow) => {
        setItems((old) =>
            old.map((row) => {
                if (
                    Object.entries(row).toString() ===
                    Object.entries(original).toString()
                ) {
                    row = updatedRow;
                }
                return row;
            })
        );
        if (updateRowData) {
            updateRowData(updatedRow);
        }
    };

    // Gets triggered when one row item is deleted
    const deleteRowFromGrid = (original) => {
        setItems((old) =>
            old.filter((row) => {
                return row !== original;
            })
        );
        if (deleteRowData) {
            deleteRowData(original);
        }
    };

    // Extract/add and modify required data from user configured columns and expand columns
    const processedColumns = extractColumns(
        columns,
        searchColumn,
        isDesktop,
        updateRowInGrid
    );
    const additionalColumn = extractAdditionalColumn(
        columnToExpand,
        isDesktop,
        updateRowInGrid
    );

    // Create memoized column, to be used by grid component
    const gridColumns = useMemo(() => processedColumns, []);

    // Local variable for keeping the expanded row rendering method
    const renderExpandedContent = additionalColumn
        ? additionalColumn.displayCell
        : null;

    // #region - Check if data is hidden or not and display data in rendered section

    // Process data to be rendered to expanded view and return that data to the render function
    const displayExpandedContent = (row) => {
        const { original } = row;
        if (original) {
            return (
                <AdditionalColumnContext.Provider
                    value={{ additionalColumn: additionalColumn }}
                >
                    {renderExpandedContent(original, AdditionalColumnTag)}
                </AdditionalColumnContext.Provider>
            );
        }
    };
    // #endregion

    // Add logic for doing global search in the grid
    const globalSearchLogic = (rows, filterValue) => {
        // Enter search logic only if rows and columns are available
        if (filterValue && processedColumns.length > 0) {
            // convert user searched text to lower case
            const searchText = filterValue.toLowerCase();
            // Loop through all rows
            return rows.filter((row) => {
                // Find original data value of each row
                const { original } = row;
                // Return value of the filter method
                let returnValue = false;
                // Loop through all column values for each row
                processedColumns.map((column) => {
                    // Do search for each column
                    returnValue =
                        returnValue ||
                        searchColumn(column, original, searchText);
                });
                return returnValue;
            });
        }
        return rows;
    };

    // Add logic to calculate height of each row, based on the content of  or more columns
    // This can be used only if developer using the component has not passed a function to calculate row height
    const calculateDefaultRowHeight = (row, gridColumns) => {
        // Minimum height for each row
        let rowHeight = 50;
        if (gridColumns && gridColumns.length > 0 && row) {
            // Get properties of a row
            const { original, isExpanded } = row;
            // Find the column with maximum width configured, from grid columns list
            const columnWithMaxWidth = [...gridColumns].sort((a, b) => {
                return b.width - a.width;
            })[0];
            // Get column properties including the user resized column width (totalFlexWidth)
            const { id, width, totalFlexWidth } = columnWithMaxWidth;
            // Get row value of that column
            const rowValue = original[id];
            if (rowValue) {
                // Find the length of text of data in that column
                const textLength = Object.values(rowValue).join(",").length;
                // This is a formula that was created for the test data used.
                rowHeight += Math.ceil((80 * textLength) / totalFlexWidth);
                const widthVariable =
                    totalFlexWidth > width
                        ? totalFlexWidth - width
                        : width - totalFlexWidth;
                rowHeight += widthVariable / 1000;
            }
            // Add logic to increase row height if row is expanded
            if (isExpanded && additionalColumn) {
                // Increase height based on the number of inner cells in additional columns
                rowHeight +=
                    additionalColumn.innerCells &&
                    additionalColumn.innerCells.length > 0
                        ? additionalColumn.innerCells.length * 35
                        : 35;
            }
        }
        return rowHeight;
    };

    // #region - Group sorting logic
    // Function to return sorting logic based on the user selected order of sort
    const compareValues = (compareOrder, v1, v2) => {
        if (compareOrder === "Ascending") {
            return v1 > v2 ? 1 : v1 < v2 ? -1 : 0;
        }
        return v1 < v2 ? 1 : v1 > v2 ? -1 : 0;
    };
    // Function to return sorted data
    const getSortedData = (originalData) => {
        return originalData.sort(function (x, y) {
            let compareResult = 0;
            groupSortOptions.forEach((option) => {
                const { sortBy, sortOn, order } = option;
                const newResult =
                    sortOn === "value"
                        ? compareValues(order, x[sortBy], y[sortBy])
                        : compareValues(
                              order,
                              x[sortBy][sortOn],
                              y[sortBy][sortOn]
                          );
                compareResult = compareResult || newResult;
            });
            return compareResult;
        });
    };
    // #endregion

    // Gets called when group sort is applied or cleared
    const doGroupSort = (sortOptions) => {
        setGroupSortOptions(sortOptions);
    };

    // Gets called when page scroll reaches the bottom of the grid.
    // Fetch the next set of data and append it to the variable holding grid data and update the state value.
    // Also update the hasNextPage state value to False once API response is empty, to avoid unwanted API calls.
    const loadNextPage = (...args) => {
        if (hasNextPage) {
            setIsLoading(true);
            setIsNextPageLoading(true);
            loadData().then((data) => {
                setIsLoading(false);
                setHasNextPage(data && data.length > 0);
                setIsNextPageLoading(false);
                setItems(items.concat(data));
            });
        }
    };

    useEffect(() => {
        // Add duplicate copy of inner cells to be used for data chooser
        processedColumns.map((column) => {
            if (column.innerCells) {
                column.originalInnerCells = column.innerCells;
            }
            return column;
        });
        if (additionalColumn) {
            const { innerCells } = additionalColumn;
            if (innerCells) {
                additionalColumn.originalInnerCells = innerCells;
            }
        }

        // Make API call to fetch initial set of data.
        setIsLoading(true);
        loadData().then((data) => {
            setIsLoading(false);
            setItems(data);
        });
    }, []);

    // Sort the data based on the user selected group sort optipons
    const data = getSortedData([...items]);

    return (
        <div className="grid-component-container">
            {data &&
            data.length > 0 &&
            processedColumns &&
            processedColumns.length > 0 ? (
                <div>
                    <Customgrid
                        title={title}
                        gridHeight={gridHeight}
                        gridWidth={gridWidth}
                        managableColumns={gridColumns}
                        originalColumns={gridColumns}
                        additionalColumn={additionalColumn}
                        data={data}
                        getRowEditOverlay={getRowEditOverlay}
                        updateRowInGrid={updateRowInGrid}
                        deleteRowFromGrid={deleteRowFromGrid}
                        globalSearchLogic={globalSearchLogic}
                        selectBulkData={selectBulkData}
                        calculateRowHeight={
                            calculateRowHeight &&
                            typeof calculateRowHeight === "function"
                                ? calculateRowHeight
                                : calculateDefaultRowHeight
                        }
                        isExpandContentAvailable={
                            typeof renderExpandedContent === "function"
                        }
                        displayExpandedContent={displayExpandedContent}
                        rowActions={rowActions}
                        rowActionCallback={rowActionCallback}
                        hasNextPage={hasNextPage}
                        isNextPageLoading={isNextPageLoading}
                        loadNextPage={loadNextPage}
                        doGroupSort={doGroupSort}
                    />
                    {isNextPageLoading ? (
                        <div id="loader" className="background">
                            <div className="dots container">
                                <span />
                                <span />
                                <span />
                            </div>
                        </div>
                    ) : null}
                </div>
            ) : (
                <h2 style={{ textAlign: "center", marginTop: "70px" }}>
                    {isLoading ? (
                        "Initializing Grid..."
                    ) : (
                        <span className="error">
                            Invalid Data or Column Configurations
                        </span>
                    )}
                </h2>
            )}
        </div>
    );
});

Grid.propTypes = {
    title: PropTypes.any,
    gridHeight: PropTypes.any,
    gridWidth: PropTypes.any,
    columns: PropTypes.any,
    columnToExpand: PropTypes.any,
    loadData: PropTypes.any,
    getRowEditOverlay: PropTypes.any,
    updateRowData: PropTypes.any,
    deleteRowData: PropTypes.any,
    selectBulkData: PropTypes.any,
    calculateRowHeight: PropTypes.any,
    rowActions: PropTypes.any,
    rowActionCallback: PropTypes.any
};

export default Grid;
