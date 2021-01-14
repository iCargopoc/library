// @flow
import React, { useState, useEffect } from "react";
import memoize from "lodash.memoize";
import {
    extractColumns,
    extractAdditionalColumn
} from "./Utilities/ColumnsUtilities";
import Customgrid from "./Customgrid";
// Old method - eslint-disable-next-line import/no-unresolved
import "!style-loader!css-loader!sass-loader!./Styles/main.scss";
// lazy styles inclusion via styleloader
// import __cmpStyles from "./Styles/main.scss";

const processedData = (gridData: [Object], parentIdAttribute: String): ?[] => {
    if (gridData && gridData.length > 0) {
        const processedGridData = [];
        gridData.forEach((gridDataItem: Object) => {
            const updatedData = { ...gridDataItem };
            updatedData.isParent = true;
            delete updatedData.childData;
            processedGridData.push(updatedData);
            const { childData } = gridDataItem;
            if (childData && parentIdAttribute) {
                const parentId = gridDataItem[parentIdAttribute];
                const { data } = childData;
                if (
                    data &&
                    data.length > 0 &&
                    parentId !== null &&
                    parentId !== undefined
                ) {
                    const {
                        pageNum,
                        endCursor,
                        pageSize,
                        lastPage
                    } = childData;
                    data.forEach((dataItem: Object) => {
                        const updatedDataItem = dataItem;
                        updatedDataItem[parentIdAttribute] = parentId;
                        updatedDataItem.pageNum = pageNum;
                        updatedDataItem.endCursor = endCursor;
                        updatedDataItem.pageSize = pageSize;
                        updatedDataItem.lastPage = lastPage;
                        processedGridData.push(updatedDataItem);
                    });
                }
            }
        });
        return processedGridData;
    }
    return [];
};
const getProcessedData = memoize(processedData);

const Grid = (props: Object): ?React$Element<*> => {
    // useEffect((): Function => {
    //     if (__cmpStyles.use) {
    //         __cmpStyles.use();
    //     }
    //     return () => {
    //         if (__cmpStyles.unuse) {
    //             __cmpStyles.unuse();
    //         }
    //     };
    // }, []);

    const {
        className,
        theme,
        title,
        gridWidth,
        gridData,
        rowsToOverscan,
        idAttribute,
        paginationType,
        pageInfo,
        loadMoreData,
        serverSideSorting,
        columns,
        columnToExpand,
        parentColumn,
        parentIdAttribute,
        parentRowExpandable,
        parentRowsToExpand,
        subComponentColumnns,
        subComponentColumnToExpand,
        rowActions,
        onRowUpdate,
        onRowSelect,
        getRowInfo,
        expandableColumn,
        CustomPanel,
        multiRowSelection,
        gridHeader,
        rowSelector,
        globalSearch,
        columnFilter,
        groupSort,
        columnChooser,
        exportData,
        onGridRefresh,
        rowsToSelect,
        rowsToDeselect,
        fixedRowHeight,
        fileName
    } = props;

    // Check if device is desktop
    const isDesktop = window.innerWidth > 1024;

    // Set state value for variable to check if the loading process is going on
    const [isNextPageLoading, setIsNextPageLoading] = useState(false);

    // To check if useEffect Call is completed or not
    const [isLoaded, setIsLoaded] = useState(false);

    // To check if total records count has been changed
    const [totalRecordsCount, setTotalRecordsCount] = useState(0);

    // Logic for searching in each column
    const searchColumn = (
        column: Object,
        original: Object,
        searchText: string
    ): boolean => {
        // Check if row is parent row
        const { isParent } = original;
        // Return value
        let isValuePresent = isParent === true;
        // Find the accessor node and inner cells array of each column
        const { accessor, innerCells } = column;
        // Find accessor value of a column
        const rowAccessorValue = original[accessor];
        if (rowAccessorValue !== null && rowAccessorValue !== undefined) {
            // Check if inner cells are available and save value to boolean var
            const isInnerCellsPresent = innerCells && innerCells.length > 0;
            // Check if the column needs to be skipped from search
            if (column.isSearchable) {
                // Enter if cell value is object or array
                if (
                    typeof rowAccessorValue === "object" &&
                    isInnerCellsPresent
                ) {
                    // Enter if cell value is array
                    if (rowAccessorValue.length > 0) {
                        // Loop through cell array value and check if searched text is present
                        rowAccessorValue.forEach((value: Object) => {
                            innerCells.forEach((cell: Object) => {
                                const dataAccessor = value[cell.accessor];
                                const isSearchEnabled = cell.isSearchable;
                                if (
                                    dataAccessor &&
                                    isSearchEnabled &&
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
                        innerCells.forEach((cell: Object) => {
                            const dataAccessor =
                                original[accessor][cell.accessor];
                            const isSearchEnabled = cell.isSearchable;
                            if (
                                dataAccessor &&
                                isSearchEnabled &&
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
                        dataAccessor
                            .toString()
                            .toLowerCase()
                            .includes(searchText)
                    ) {
                        isValuePresent = true;
                    }
                }
            }
        }
        return isValuePresent;
    };

    // Gets triggered when one row item is updated
    const updateRowInGrid = (
        original: Object,
        updatedRow: Object,
        isSubComponentRow: boolean
    ): Function => {
        if (onRowUpdate) {
            onRowUpdate(original, updatedRow, isSubComponentRow);
        }
    };

    // Local state value for holding columns configuration
    const [gridColumns, setGridColumns] = useState([]);

    // Local state value for holding the additional column configuration
    const [additionalColumn, setAdditionalColumn] = useState(null);

    const isParentGrid = parentColumn !== null && parentColumn !== undefined;

    const [gridSubComponentColumns, setGridSubComponentColumns] = useState([]);

    const [
        gridSubComponentAdditionalColumn,
        setGridSubComponentAdditionalColumn
    ] = useState(null);

    // #region - Group sorting logic
    // Function to return sorting logic based on the user selected order of sort
    const compareValues = (
        compareOrder: string,
        v1: Object,
        v2: Object
    ): number => {
        let returnValue = 0;
        if (compareOrder === "Ascending") {
            if (v1 > v2) {
                returnValue = 1;
            } else if (v1 < v2) {
                returnValue = -1;
            }
            return returnValue;
        }
        if (v1 < v2) {
            returnValue = 1;
        } else if (v1 > v2) {
            returnValue = -1;
        }
        return returnValue;
    };
    // Function to return sorted data
    const getSortedData = (
        originalData: any[],
        groupSortOptions: any[]
    ): any[] => {
        if (
            originalData &&
            originalData.length > 0 &&
            groupSortOptions &&
            groupSortOptions.length > 0
        ) {
            const gridSortOptions = groupSortOptions.filter(
                (option: Object): boolean =>
                    option.isSubComponentColumn !== true
            );
            if (
                isParentGrid &&
                parentIdAttribute !== null &&
                parentIdAttribute !== undefined
            ) {
                let sortedTreeData = [];
                const parentDataFromOriginalData = [...originalData].filter(
                    (dataToFilter: Object): boolean => {
                        let returnValue = false;
                        if (dataToFilter) {
                            const { isParent } = dataToFilter;
                            returnValue = isParent === true;
                        }
                        return returnValue;
                    }
                );
                parentDataFromOriginalData.forEach((dataFromGrid: Object) => {
                    if (dataFromGrid) {
                        sortedTreeData.push(dataFromGrid);
                        const parentIdentifier =
                            dataFromGrid[parentIdAttribute];
                        if (
                            parentIdentifier !== null &&
                            parentIdentifier !== undefined
                        ) {
                            const childRowsOfParent = [...originalData].filter(
                                (origData: Object): boolean => {
                                    return (
                                        origData &&
                                        origData.isParent !== true &&
                                        origData[parentIdAttribute] ===
                                            parentIdentifier
                                    );
                                }
                            );
                            if (
                                childRowsOfParent &&
                                childRowsOfParent.length > 0
                            ) {
                                const sortedChildData = childRowsOfParent.sort(
                                    (x: Object, y: Object): number => {
                                        let compareResult = 0;
                                        gridSortOptions.forEach(
                                            (option: Object) => {
                                                const {
                                                    sortBy,
                                                    sortOn,
                                                    order
                                                } = option;
                                                const xSortBy = x[sortBy];
                                                const ySortBy = y[sortBy];
                                                let xSortOn = null;
                                                let ySortOn = null;
                                                if (
                                                    xSortBy !== null &&
                                                    xSortBy !== undefined
                                                ) {
                                                    xSortOn = xSortBy[sortOn];
                                                }
                                                if (
                                                    ySortBy !== null &&
                                                    ySortBy !== undefined
                                                ) {
                                                    ySortOn = ySortBy[sortOn];
                                                }
                                                const newResult =
                                                    sortOn === "value"
                                                        ? compareValues(
                                                              order,
                                                              xSortBy,
                                                              ySortBy
                                                          )
                                                        : compareValues(
                                                              order,
                                                              xSortOn,
                                                              ySortOn
                                                          );
                                                compareResult =
                                                    compareResult || newResult;
                                            }
                                        );
                                        return compareResult;
                                    }
                                );
                                sortedTreeData = [
                                    ...sortedTreeData,
                                    ...sortedChildData
                                ];
                            }
                        }
                    }
                });
                return sortedTreeData;
            }
            const subComponentSortOptions = groupSortOptions.filter(
                (option: Object): boolean =>
                    option.isSubComponentColumn === true
            );
            let sortedOriginalData = [...originalData].sort(
                (x: Object, y: Object): number => {
                    let compareResult = 0;
                    if (
                        x !== null &&
                        x !== undefined &&
                        y !== null &&
                        y !== undefined
                    )
                        gridSortOptions.forEach((option: Object) => {
                            const { sortBy, sortOn, order } = option;
                            const xSortBy = x[sortBy];
                            const ySortBy = y[sortBy];
                            let xSortOn = null;
                            let ySortOn = null;
                            if (xSortBy !== null && xSortBy !== undefined) {
                                xSortOn = xSortBy[sortOn];
                            }
                            if (ySortBy !== null && ySortBy !== undefined) {
                                ySortOn = ySortBy[sortOn];
                            }
                            const newResult =
                                sortOn === "value"
                                    ? compareValues(order, xSortBy, ySortBy)
                                    : compareValues(order, xSortOn, ySortOn);
                            compareResult = compareResult || newResult;
                        });
                    return compareResult;
                }
            );
            if (subComponentSortOptions && subComponentSortOptions.length > 0) {
                sortedOriginalData = [...sortedOriginalData].map(
                    (data: Object): any[] => {
                        const sortedData = { ...data };
                        if (
                            sortedData.subComponentData &&
                            sortedData.subComponentData.length > 0
                        ) {
                            const sortedSubComponentData = [
                                ...sortedData.subComponentData
                            ].sort((x: Object, y: Object): number => {
                                let compareResult = 0;
                                if (
                                    x !== null &&
                                    x !== undefined &&
                                    y !== null &&
                                    y !== undefined
                                )
                                    subComponentSortOptions.forEach(
                                        (option: Object) => {
                                            const {
                                                sortBy,
                                                sortOn,
                                                order
                                            } = option;
                                            const xSortBy = x[sortBy];
                                            const ySortBy = y[sortBy];
                                            let xSortOn = null;
                                            let ySortOn = null;
                                            if (
                                                xSortBy !== null &&
                                                xSortBy !== undefined
                                            ) {
                                                xSortOn = xSortBy[sortOn];
                                            }
                                            if (
                                                ySortBy !== null &&
                                                ySortBy !== undefined
                                            ) {
                                                ySortOn = ySortBy[sortOn];
                                            }
                                            const newResult =
                                                sortOn === "value"
                                                    ? compareValues(
                                                          order,
                                                          xSortBy,
                                                          ySortBy
                                                      )
                                                    : compareValues(
                                                          order,
                                                          xSortOn,
                                                          ySortOn
                                                      );
                                            compareResult =
                                                compareResult || newResult;
                                        }
                                    );
                                return compareResult;
                            });
                            sortedData.subComponentData = sortedSubComponentData;
                        }
                        return sortedData;
                    }
                );
            }
            return sortedOriginalData;
        }
        return originalData;
    };
    // #endregion

    const loadChildData = (row: Object): Function => {
        if (row && parentIdAttribute) {
            const { lastPage, pageNum, pageSize, endCursor } = row;
            const isIntialLoad =
                lastPage === undefined &&
                pageNum === undefined &&
                pageSize === undefined &&
                endCursor === undefined;
            const parentId = row[parentIdAttribute];
            if (
                (lastPage === false || isIntialLoad) &&
                parentId !== null &&
                parentId !== undefined
            ) {
                let pageInfoObj = null;
                if (paginationType === "cursor") {
                    if (endCursor !== null && endCursor !== undefined) {
                        pageInfoObj = {
                            endCursor,
                            pageSize
                        };
                    }
                    loadMoreData(pageInfoObj, parentId);
                } else {
                    if (
                        pageNum !== null &&
                        pageNum !== undefined &&
                        typeof pageNum === "number"
                    ) {
                        pageInfoObj = {
                            pageNum: pageNum + 1,
                            pageSize
                        };
                    }
                    loadMoreData(pageInfoObj, parentId);
                }
            }
        }
    };

    // Gets called when page scroll reaches the bottom of the grid.
    // Trigger call back and get the grid data updated.
    const loadNextPage = (returnedPageInfo: Object): Function => {
        const { pageNum, pageSize, endCursor } = returnedPageInfo;
        setIsNextPageLoading(true);
        if (paginationType === "cursor") {
            loadMoreData({
                endCursor,
                pageSize
            });
        } else {
            loadMoreData({
                pageNum: pageNum + 1,
                pageSize
            });

        }
    };

    useEffect(() => {
        setIsNextPageLoading(false);
        if (pageInfo) {
            const { total } = pageInfo;
            if (typeof total === "number" && total !== totalRecordsCount) {
                setTotalRecordsCount(total);
            }
        }
    }, [gridData, pageInfo]);

    useEffect(() => {
        setGridColumns(
            extractColumns(
                columns,
                searchColumn,
                isDesktop,
                updateRowInGrid,
                expandableColumn,
                isParentGrid,
                false
            )
        );
        setAdditionalColumn(
            extractAdditionalColumn(columnToExpand, isDesktop, false)
        );
    }, [columns, columnToExpand]);

    useEffect(() => {
        setGridSubComponentColumns(
            extractColumns(
                subComponentColumnns,
                searchColumn,
                isDesktop,
                updateRowInGrid,
                expandableColumn,
                isParentGrid,
                true
            )
        );
        setGridSubComponentAdditionalColumn(
            extractAdditionalColumn(subComponentColumnToExpand, isDesktop, true)
        );
    }, [subComponentColumnns, subComponentColumnToExpand]);

    useEffect(() => {
        setIsLoaded(true);
    }, []);

    let processedGridData = gridData && gridData.length > 0 ? gridData : [];
    if (isParentGrid) {
        processedGridData = getProcessedData(gridData, parentIdAttribute);
    }

    if (isLoaded) {
        if (!(gridColumns && gridColumns.length > 0)) {
            return (
                <div
                    data-testid="gridComponent"
                    className={`neo-grid ${className || ""}`}
                >
                    <h2 data-testid="nocolumnserror" className="ng-error">
                        Invalid Column Configuration
                    </h2>
                </div>
            );
        }
        return (
            <div
                data-testid="gridComponent"
                className={`neo-grid ${className || ""} ${
                    theme === "portal" ? "neo-grid--portal" : ""
                }`}
                style={{ width: gridWidth || "100%" }}
            >
                <Customgrid
                    isDesktop={isDesktop}
                    title={title}
                    theme={theme}
                    managableColumns={gridColumns}
                    expandedRowData={additionalColumn}
                    parentColumn={parentColumn}
                    parentIdAttribute={parentIdAttribute}
                    parentRowExpandable={parentRowExpandable}
                    parentRowsToExpand={parentRowsToExpand}
                    managableSubComponentColumnns={gridSubComponentColumns}
                    managableSubComponentAdditionalColumn={
                        gridSubComponentAdditionalColumn
                    }
                    loadChildData={loadChildData}
                    isParentGrid={isParentGrid}
                    gridData={processedGridData}
                    rowsToOverscan={rowsToOverscan}
                    idAttribute={idAttribute}
                    pageInfo={pageInfo}
                    totalRecordsCount={totalRecordsCount}
                    updateRowInGrid={updateRowInGrid}
                    searchColumn={searchColumn}
                    onRowSelect={onRowSelect}
                    getRowInfo={getRowInfo}
                    expandableColumn={expandableColumn}
                    rowActions={rowActions}
                    isNextPageLoading={isNextPageLoading}
                    loadNextPage={loadNextPage}
                    serverSideSorting={serverSideSorting}
                    getSortedData={getSortedData}
                    CustomPanel={CustomPanel}
                    multiRowSelection={multiRowSelection}
                    gridHeader={gridHeader}
                    rowSelector={rowSelector}
                    globalSearch={globalSearch}
                    columnFilter={columnFilter}
                    groupSort={groupSort}
                    columnChooser={columnChooser}
                    exportData={exportData}
                    fileName={fileName}
                    onGridRefresh={onGridRefresh}
                    rowsToSelect={rowsToSelect}
                    rowsToDeselect={rowsToDeselect}
                    fixedRowHeight={fixedRowHeight}
                />
            </div>
        );
    }
    return null;
};

export default Grid;
