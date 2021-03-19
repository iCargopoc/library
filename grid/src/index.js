// @flow
import React, { useState, useEffect } from "react";
import memoize from "lodash.memoize";
import {
    extractColumns,
    extractAdditionalColumn
} from "./Utilities/ColumnsUtilities";
import Customgrid from "./Customgrid";
// Old method - eslint-disable-next-line import/no-unresolved
// import "!style-loader!css-loader!sass-loader!./Styles/main.scss";
// lazy styles inclusion via styleloader
import __cmpStyles from "./Styles/main.scss";

const processedData = (gridData: [Object], parentIdAttribute: string): ?[] => {
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
    useEffect((): Function => {
        if (__cmpStyles.use) {
            __cmpStyles.use();
        }
        return () => {
            if (__cmpStyles.unuse) {
                __cmpStyles.unuse();
            }
        };
    }, []);

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
        showTitle,
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
        fileName,
        pdfPaperSize
    } = props;

    // Check if device is desktop
    const isDesktop = window.innerWidth > 1024;

    // Set state value for variable to check if the loading process is going on
    const [isNextPageLoading, setIsNextPageLoading] = useState(false);

    // Set state value for holding the count of page reloads
    const [pageReloadCount, setPageReloadCount] = useState(0);

    // To check if useEffect Call is completed or not
    const [isLoaded, setIsLoaded] = useState(false);

    // To check if total records count has been changed
    const [totalRecordsCount, setTotalRecordsCount] = useState(0);

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

    // Local state value for holding columns filter accessor configurations
    const [gridColumnsAccessorList, setGridColumnsAccessorList] = useState([]);

    // Local state value for holding the additional column configuration
    const [additionalColumn, setAdditionalColumn] = useState(null);

    // Local state value for holding additional column filter accessor configurations
    const [
        additionalColumnAccessorList,
        setAdditionalColumnAccessorList
    ] = useState([]);

    const isParentGrid = parentColumn !== null && parentColumn !== undefined;

    const [gridSubComponentColumns, setGridSubComponentColumns] = useState([]);

    // Local state value for holding sub component columns filter accessor configurations
    const [
        gridSubComponentColumnsAccessorList,
        setGridSubComponentColumnsAccessorList
    ] = useState([]);

    const [
        gridSubComponentAdditionalColumn,
        setGridSubComponentAdditionalColumn
    ] = useState(null);

    // Local state value for holding sub component additional column filter accessor configurations
    const [
        gridSubComponentAdditionalColumnAccessorList,
        setGridSubComponentAdditionalColumnAccessorList
    ] = useState([]);

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
                                const sortedChildData = [
                                    ...childRowsOfParent
                                ].sort((x: Object, y: Object): number => {
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
                                });
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
    const loadNextPage = (
        returnedPageInfo: Object,
        isReload: boolean
    ): Function => {
        const { pageNum, pageSize, endCursor, lastPage } = returnedPageInfo;
        if (lastPage !== true) {
            if (isReload) {
                setPageReloadCount(pageReloadCount + 1);
            } else {
                setIsNextPageLoading(true);
            }
            if (paginationType === "cursor") {
                loadMoreData({
                    endCursor,
                    pageSize
                });
            } else {
                loadMoreData({
                    pageNum,
                    pageSize
                });
            }
        }
    };

    useEffect(() => {
        setIsNextPageLoading(false);
        const newPageReloadCount = pageReloadCount - 1;
        setPageReloadCount(newPageReloadCount < 0 ? 0 : newPageReloadCount);
        if (pageInfo) {
            const { total } = pageInfo;
            if (typeof total === "number" && total !== totalRecordsCount) {
                setTotalRecordsCount(total);
            }
        }
    }, [gridData, pageInfo]);

    useEffect(() => {
        // Columns Config
        const columnsConfigData = extractColumns(
            columns,
            isDesktop,
            updateRowInGrid,
            expandableColumn,
            isParentGrid,
            false
        );
        const {
            updatedColumnStructure,
            columnsAccessorList
        } = columnsConfigData;
        setGridColumns(updatedColumnStructure);
        setGridColumnsAccessorList(columnsAccessorList);

        // Column To Expand config
        const columnToExpandConfigData = extractAdditionalColumn(
            columnToExpand,
            isDesktop,
            false
        );
        const {
            updatedColumnToExpandStructure,
            columnToExpandAccessorList
        } = columnToExpandConfigData;
        setAdditionalColumn(updatedColumnToExpandStructure);
        setAdditionalColumnAccessorList(columnToExpandAccessorList);
    }, [columns, columnToExpand]);

    useEffect(() => {
        // Sub Component Columns Config
        const columnsConfigData = extractColumns(
            subComponentColumnns,
            isDesktop,
            updateRowInGrid,
            expandableColumn,
            isParentGrid,
            true
        );
        const {
            updatedColumnStructure,
            columnsAccessorList
        } = columnsConfigData;
        setGridSubComponentColumns(updatedColumnStructure);
        setGridSubComponentColumnsAccessorList(columnsAccessorList);

        // Sub Component Column To Expand config
        const columnToExpandConfigData = extractAdditionalColumn(
            subComponentColumnToExpand,
            isDesktop,
            true
        );
        const {
            updatedColumnToExpandStructure,
            columnToExpandAccessorList
        } = columnToExpandConfigData;
        setGridSubComponentAdditionalColumn(updatedColumnToExpandStructure);
        setGridSubComponentAdditionalColumnAccessorList(
            columnToExpandAccessorList
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
                    columnsAccessorList={gridColumnsAccessorList}
                    expandedRowData={additionalColumn}
                    expandedRowDataAccessorList={additionalColumnAccessorList}
                    parentColumn={parentColumn}
                    parentIdAttribute={parentIdAttribute}
                    parentRowExpandable={parentRowExpandable}
                    parentRowsToExpand={parentRowsToExpand}
                    managableSubComponentColumnns={gridSubComponentColumns}
                    subComponentColumnsAccessorList={
                        gridSubComponentColumnsAccessorList
                    }
                    managableSubComponentAdditionalColumn={
                        gridSubComponentAdditionalColumn
                    }
                    subComponentAdditionalColumnAccessorList={
                        gridSubComponentAdditionalColumnAccessorList
                    }
                    loadChildData={loadChildData}
                    isParentGrid={isParentGrid}
                    gridData={processedGridData}
                    rowsToOverscan={rowsToOverscan}
                    idAttribute={idAttribute}
                    pageInfo={pageInfo}
                    paginationType={paginationType}
                    totalRecordsCount={totalRecordsCount}
                    updateRowInGrid={updateRowInGrid}
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
                    showTitle={showTitle}
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
                    pdfPaperSize={pdfPaperSize}
                />
                {pageReloadCount > 0 ? (
                    <>
                        <div className="ng-loader ng-loader--overlay">
                            <div className="ng-loader__block">
                                <div className="ng-loader__item" />
                                <div className="ng-loader__item" />
                                <div className="ng-loader__item" />
                                <div className="ng-loader__item" />
                            </div>
                        </div>
                        <div className="ng-overlay" />
                    </>
                ) : null}
            </div>
        );
    }
    return null;
};

export default Grid;
