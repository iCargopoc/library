import React, { forwardRef, useImperativeHandle, useMemo, useState, useEffect } from "react";
import Customgrid from "./Customgrid";

const Grid = forwardRef((props, ref) => {
    const {
        title,
        gridHeight,
        gridWidth,
        columns,
        fetchData,
        rowEditOverlay,
        rowEditData,
        updateRowData,
        deletePopUpOverLay,
        deleteRowData,
        globalSearchLogic,
        selectBulkData,
        calculateRowHeight,
        renderExpandedContent
    } = props;

    //Set state value for variable to check if there is anext page available
    const [hasNextPage, setHasNextPage] = useState(true);
    //Set state value for variable to check if the loading process is going on
    const [isNextPageLoading, setIsNextPageLoading] = useState(false);
    //Set state value for variable to hold grid data
    const [items, setItems] = useState([]);

    let processedColumns = [];
    columns.forEach((column, index) => {
        const { innerCells, accessor, sortValue } = column;
        const isInnerCellsPresent = innerCells && innerCells.length > 0;

        //Add column Id
        column.columnId = `column_${index}`;

        //Add logic to sort column if sort is not disabled
        if (!column.disableSortBy) {
            if (isInnerCellsPresent) {
                //If there are inner cells and a sort value specified, do sort on that value
                if (sortValue) {
                    column.sortType = (rowA, rowB) => {
                        return rowA.original[accessor][sortValue] > rowB.original[accessor][sortValue] ? -1 : 1;
                    };
                } else {
                    column.disableSortBy = true;
                }
            } else if (!innerCells) {
                //If no inner cells are there, just do sort on column value
                column.sortType = (rowA, rowB) => {
                    return rowA.original[accessor] > rowB.original[accessor] ? -1 : 1;
                };
            }
        }

        //Add logic to filter column if column filter is not disabled
        if (!column.disableFilters) {
            if (isInnerCellsPresent) {
                column.filter = (rows, id, filterValue) => {
                    const filterText = filterValue ? filterValue.toLowerCase() : "";
                    return rows.filter((row) => {
                        const rowValue = row.values[id];
                        const filterCols = innerCells.filter((cell) => {
                            const cellValue = rowValue[cell.accessor] ? rowValue[cell.accessor].toString().toLowerCase() : "";
                            return cellValue.includes(filterText);
                        });
                        return filterCols && filterCols.length > 0;
                    });
                };
            }
        }

        processedColumns.push(column);
    });
    const gridColumns = useMemo(() => processedColumns, []);

    //Gets triggered when a cell in grid is updated
    useImperativeHandle(ref, () => ({
        updateCellInGrid(rowIndex, columnId, value) {
            setItems((old) =>
                old.map((row, index) => {
                    if (index === rowIndex) {
                        return {
                            ...old[rowIndex],
                            [columnId]: value
                        };
                    }
                    return row;
                })
            );
        }
    }));

    //Gets triggered when one row item is updated
    const updateRowInGrid = (rowIndex, updatedRow) => {
        setItems((old) =>
            old.map((row, index) => {
                if (index === rowIndex) {
                    row = updatedRow;
                }
                return row;
            })
        );
        updateRowData(updatedRow);
    };

    //Gets triggered when one row item is deleted
    const deleteRowFromGrid = (rowIndexToBeDeleted, deletedRow) => {
        setItems((old) =>
            old.filter((row, index) => {
                return index !== rowIndexToBeDeleted;
            })
        );
        deleteRowData(deletedRow);
    };

    //Gets called when page scroll reaches the bottom of the grid.
    //Fetch the next set of data and append it to the variable holding grid data and update the state value.
    //Also update the hasNextPage state value to False once API response is empty, to avoid unwanted API calls.
    const loadNextPage = (...args) => {
        const newIndex = args && args.length > 0 ? args[0] : -1;
        if (newIndex >= 0 && hasNextPage) {
            setIsNextPageLoading(true);
            fetchData(newIndex).then((data) => {
                setHasNextPage(data && data.length > 0);
                setIsNextPageLoading(false);
                setItems(items.concat(data));
            });
        }
    };

    useEffect(() => {
        //Make API call to fetch initial set of data.
        fetchData(0).then((data) => {
            setItems(data);
        });
    }, []);

    if (items && items.length > 0) {
        return (
            <div>
                <Customgrid
                    title={title}
                    gridHeight={gridHeight}
                    gridWidth={gridWidth}
                    managableColumns={gridColumns}
                    originalColumns={gridColumns}
                    data={items}
                    rowEditOverlay={rowEditOverlay}
                    rowEditData={rowEditData}
                    updateRowInGrid={updateRowInGrid}
                    deletePopUpOverLay={deletePopUpOverLay}
                    deleteRowFromGrid={deleteRowFromGrid}
                    globalSearchLogic={globalSearchLogic}
                    selectBulkData={selectBulkData}
                    calculateRowHeight={calculateRowHeight}
                    renderExpandedContent={renderExpandedContent}
                    hasNextPage={hasNextPage}
                    isNextPageLoading={isNextPageLoading}
                    loadNextPage={loadNextPage}
                />
                {isNextPageLoading ? <h2 style={{ textAlign: "center" }}>Loading...</h2> : null}
            </div>
        );
    } else {
        return <h2 style={{ textAlign: "center", marginTop: "70px" }}>Initializing Grid...</h2>;
    }
});

export default Grid;
