// @flow
import React, { useState, useEffect, createRef, useRef } from "react";
import memoize from "lodash.memoize";
import {
    extractColumns,
    extractAdditionalColumn
} from "./Utilities/ColumnsUtilities";
import { processedData } from "./Utilities/DataUtilities";
import Customgrid from "./Customgrid";
import Loader from "./Common/Loader";
// Old method - eslint-disable-next-line import/no-unresolved
// import "!style-loader!css-loader!sass-loader!./Styles/main.scss";
// lazy styles inclusion via styleloader
import __cmpStyles from "./Styles/main.scss";

// Memoize the function that is used to convert the structure of developer passed gridData to the structure required by Grid.
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

    // This is used to find Grid component from the screen, and use it to find other elements from the grid.
    const gridRef = createRef();

    const {
        className,
        theme,
        title,
        gridWidth,
        gridData,
        estimatedRowHeight,
        rowsToOverscan,
        idAttribute,
        paginationType,
        pageInfo,
        loadMoreData,
        serverSideSorting,
        serverSideExporting,
        columns,
        columnToExpand,
        parentColumn,
        parentIdAttribute,
        parentRowExpandable,
        parentRowsToExpand,
        subComponentColumns,
        subComponentColumnToExpand,
        subComponentIdAttribute,
        onSubComponentRowSelect,
        subComponentHeader,
        rowActions,
        onRowUpdate,
        onRowSelect,
        onSearch,
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
        rowsToPin,
        rowsToDeselect,
        fixedRowHeight,
        fileName,
        pdfPaperSize,
        enablePinColumn,
        enablePinRow,
        displayLoader
    } = props;

    // Check if device is desktop
    const isDesktop = window.innerWidth > 1024;

    // Set state value for variable to check if the loading process is going on
    const [isNextPageLoading, setIsNextPageLoading] = useState(false);

    // Set state value to check if loader has to be displayed or not
    const [shouldDisplayLoader, setShouldDisplayLoader] = useState(false);

    // Set state value for holding the count of page reloads
    const [pageReloadCount, setPageReloadCount] = useState(0);

    // To check if useEffect Call is completed or not
    const [isLoaded, setIsLoaded] = useState(false);

    // To check if total records count has been changed
    const [totalRecordsCount, setTotalRecordsCount] = useState(0);

    // Local state value for holding grid columns configuration
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

    // Local state value for holding sub components columns configuration
    const [gridSubComponentColumns, setGridSubComponentColumns] = useState([]);

    // Local state value for holding sub component columns filter accessor configurations
    const [
        gridSubComponentColumnsAccessorList,
        setGridSubComponentColumnsAccessorList
    ] = useState([]);

    // Local state value for holding sub components additional column configuration
    const [
        gridSubComponentAdditionalColumn,
        setGridSubComponentAdditionalColumn
    ] = useState(null);

    // Local state value for holding sub component additional column filter accessor configurations
    const [
        gridSubComponentAdditionalColumnAccessorList,
        setGridSubComponentAdditionalColumnAccessorList
    ] = useState([]);

    // To hold total records count of each parent row
    const totalRecordsOfParentRows = useRef({});

    // Check if rendered Grid is tree view grid or not.
    const isParentGrid = parentColumn !== null && parentColumn !== undefined;

    // Gets triggered when one row item is updated
    const updateRowInGrid = (
        original: Object,
        updatedRow: Object,
        isSubComponentRow: boolean
    ): Function => {
        if (onRowUpdate && typeof onRowUpdate === "function") {
            onRowUpdate(original, updatedRow, isSubComponentRow);
        }
    };

    // #region - Group sorting logic
    // Sorting logic
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
    // Return sorted data based on original grid data and user selected sort options
    const getSortedData = (
        originalData: any[],
        groupSortOptions: any[]
    ): any[] => {
        // If original grid data and user selected sort options are present
        if (
            originalData &&
            originalData.length > 0 &&
            groupSortOptions &&
            groupSortOptions.length > 0
        ) {
            // Filter sort options to be applied on Grid data (not on sub component grid data)
            const gridSortOptions = groupSortOptions.filter(
                (option: Object): boolean =>
                    option.isSubComponentColumn !== true
            );
            // If Grid is tree view grid
            if (
                isParentGrid &&
                parentIdAttribute !== null &&
                parentIdAttribute !== undefined
            ) {
                // New result array to hold sorted data
                let sortedTreeData = [];
                // Filter out all parent rows. This is to maintain the order of parent rows even if sorting is applied.
                // Only need to sort child data under each parent.
                const parentDataFromOriginalData = [...originalData].filter(
                    (dataToFilter: Object): boolean => {
                        const { isParent } = dataToFilter;
                        return isParent === true;
                    }
                );
                // Loop through parent rows
                parentDataFromOriginalData.forEach((dataFromGrid: Object) => {
                    // Push parent row to result array
                    sortedTreeData.push(dataFromGrid);
                    // If id attribute is present and it has a valid value
                    const parentIdentifier = dataFromGrid[parentIdAttribute];
                    if (
                        parentIdentifier !== null &&
                        parentIdentifier !== undefined
                    ) {
                        // Find all child rows of that parent
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
                        // If chilkd rows are present
                        if (childRowsOfParent && childRowsOfParent.length > 0) {
                            // Sort child data based on user selected sorting options
                            const sortedChildData = [...childRowsOfParent].sort(
                                (x: Object, y: Object): number => {
                                    let compareResult = 0;
                                    // Do sorting logic for each selected sorting option
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
                            // Push sorted child data into result array.
                            sortedTreeData = [
                                ...sortedTreeData,
                                ...sortedChildData
                            ];
                        }
                    }
                });
                // After sorting child data of all parents return the sorted data.
                return sortedTreeData;
            }
            // Filter sort options to be applied on sub component Grid data (not on main grid data)
            const subComponentSortOptions = groupSortOptions.filter(
                (option: Object): boolean =>
                    option.isSubComponentColumn === true
            );
            // Sort main rows based on user selected sort options for main grid
            let sortedOriginalData = [...originalData].sort(
                (x: Object, y: Object): number => {
                    let compareResult = 0;
                    // Do sorting based on each user slected sort options
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
            // After sorting main rows, check if this Grid is sub component grid.
            // If yes and user has selected sort options for subcomponent grid, apply sort for each sub component data under each main row.
            if (subComponentSortOptions && subComponentSortOptions.length > 0) {
                // Loop through each row
                sortedOriginalData = [...sortedOriginalData].map(
                    (data: Object): any[] => {
                        const sortedData = { ...data };
                        // Check if sub component data is present in the main row.
                        if (
                            sortedData.subComponentData &&
                            sortedData.subComponentData.length > 0
                        ) {
                            // Sort sub component data based on user slected sub component sort options
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

    // Load child data under a parent row, in case of tree view grid
    const loadChildData = (row: Object, isReload: boolean): Function => {
        // If parent row & id attribute are present for parent data, and load more function is defined by developer
        if (
            row &&
            parentIdAttribute &&
            loadMoreData &&
            typeof loadMoreData === "function"
        ) {
            const { lastPage, pageNum, pageSize, endCursor } = row;
            // If page Info data are not present, we consider it as the first page load under this parent.
            const isIntialLoad =
                lastPage === undefined &&
                pageNum === undefined &&
                pageSize === undefined &&
                endCursor === undefined;
            // Get parent id attribute value
            const parentId = row[parentIdAttribute];
            // Check if last page is true for that parent and if it is not, then trigger callback function with parentId value and updated pageInfo.
            if (
                (lastPage === false || isIntialLoad) &&
                parentId !== null &&
                parentId !== undefined
            ) {
                let pageInfoObj = null;
                if (paginationType === "cursor") {
                    if (
                        isReload !== true &&
                        endCursor !== null &&
                        endCursor !== undefined
                    ) {
                        pageInfoObj = {
                            endCursor, // send back same endCursor
                            pageSize
                        };
                    }
                    loadMoreData(pageInfoObj, parentId);
                } else {
                    if (
                        isReload !== true &&
                        pageNum !== null &&
                        pageNum !== undefined &&
                        typeof pageNum === "number"
                    ) {
                        pageInfoObj = {
                            pageNum: pageNum + 1, // Update page number to next page
                            pageSize
                        };
                    }
                    loadMoreData(pageInfoObj, parentId, isReload);
                }
            }
        }
    };

    // Gets called when page scroll reaches the bottom of the grid, in case if pagination is enabled.
    const loadNextPage = (
        returnedPageInfo: Object,
        isReload: boolean
    ): Function => {
        const { pageNum, pageSize, endCursor, lastPage } = returnedPageInfo;
        // If lastPage is not true, trigger call back with updated pageInfo.
        if (
            lastPage !== true &&
            loadMoreData &&
            typeof loadMoreData === "function"
        ) {
            // If this is a reload functionality (when toalRecords property gets changed)
            if (isReload) {
                // Keep the incremental number of pages that are being reloaded. This will be decremented when ever gridData is updated.
                setPageReloadCount(pageReloadCount + 1);
            } else {
                // Set loader display value as true. This will be set to false when gridData is updated.
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
        if (isParentGrid && gridData && gridData.length > 0) {
            let totalChangedParentId = null;
            let oldTotalValue = null;
            gridData.forEach((dataItem: Object) => {
                const { childData } = dataItem;
                const parentRowIdValue = dataItem[parentIdAttribute];
                if (childData !== null && childData !== undefined) {
                    const { total } = childData;
                    const { current } = totalRecordsOfParentRows;
                    const existingTotal = current[parentRowIdValue];
                    if (existingTotal !== total) {
                        totalChangedParentId = parentRowIdValue;
                        oldTotalValue = existingTotal;
                        totalRecordsOfParentRows.current = {
                            ...current,
                            [parentRowIdValue]: total
                        };
                    }
                }
            });
            if (
                totalChangedParentId !== null &&
                totalChangedParentId !== undefined &&
                oldTotalValue !== null &&
                oldTotalValue !== undefined
            ) {
                loadChildData(
                    { [parentIdAttribute]: totalChangedParentId },
                    true
                );
            }
        } else {
            // Set next page loader display value to false
            setIsNextPageLoading(false);
            // Decrement page reload tracked numbers
            const newPageReloadCount = pageReloadCount - 1;
            setPageReloadCount(newPageReloadCount < 0 ? 0 : newPageReloadCount);
            // Check if totalRecordsCount is changed in pageInfo, and if yes store the updated value
            if (pageInfo) {
                const { total } = pageInfo;
                if (typeof total === "number" && total !== totalRecordsCount) {
                    setTotalRecordsCount(total);
                }
            }
        }
    }, [gridData, pageInfo]);

    useEffect(() => {
        // Convert grid columns configuration to required structure & get the accessor list to be used for filtering, and store it.
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

        // Convert grid additional column configuration to required structure & get the accessor list to be used for filtering, and store it.
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
        // Convert sub component columns configuration to required structure & get the accessor list to be used for filtering, and store it.
        const columnsConfigData = extractColumns(
            subComponentColumns,
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

        // Convert sub component additional column configuration to required structure & get the accessor list to be used for filtering, and store it.
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
    }, [subComponentColumns, subComponentColumnToExpand]);

    // To see if initial loading is completed or not
    useEffect(() => {
        setIsLoaded(true);
    }, []);

    // If grid is tree view grid, update grid data structure
    let processedGridData = gridData && gridData.length > 0 ? gridData : [];
    if (isParentGrid) {
        processedGridData = getProcessedData(gridData, parentIdAttribute);
    }

    if (isLoaded) {
        if (!(gridColumns && gridColumns.length > 0)) {
            return (
                <div
                    ref={gridRef}
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
                ref={gridRef}
                data-testid="gridComponent"
                className={`neo-grid ${className || ""} ${
                    theme === "portal" ? "neo-grid--portal" : ""
                }`}
                style={{ width: gridWidth || "100%" }}
            >
                <Customgrid
                    gridRef={gridRef}
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
                    subComponentIdAttribute={subComponentIdAttribute}
                    onSubComponentRowSelect={onSubComponentRowSelect}
                    subComponentHeader={subComponentHeader}
                    loadChildData={loadChildData}
                    isParentGrid={isParentGrid}
                    gridData={processedGridData}
                    estimatedRowHeight={estimatedRowHeight}
                    rowsToOverscan={rowsToOverscan}
                    idAttribute={idAttribute}
                    pageInfo={pageInfo}
                    paginationType={paginationType}
                    totalRecordsCount={totalRecordsCount}
                    updateRowInGrid={updateRowInGrid}
                    onRowSelect={onRowSelect}
                    onSearch={onSearch}
                    getRowInfo={getRowInfo}
                    expandableColumn={expandableColumn}
                    rowActions={rowActions}
                    isNextPageLoading={isNextPageLoading}
                    loadNextPage={loadNextPage}
                    serverSideSorting={serverSideSorting}
                    serverSideExporting={serverSideExporting}
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
                    rowsToPin={rowsToPin}
                    rowsToDeselect={rowsToDeselect}
                    fixedRowHeight={fixedRowHeight}
                    pdfPaperSize={pdfPaperSize}
                    enablePinColumn={enablePinColumn}
                    enablePinRow={
                        enablePinRow === true && isParentGrid !== true // Enable only if grid is not tree view grid
                    }
                    shouldDisplayLoader={shouldDisplayLoader}
                    setShouldDisplayLoader={setShouldDisplayLoader}
                />
                {displayLoader === true ||
                shouldDisplayLoader ||
                pageReloadCount > 0 ? (
                    <>
                        <Loader classNameValue="ng-loader--overlay" />
                        <div className="ng-overlay" />
                    </>
                ) : null}
            </div>
        );
    }
    return null;
};

export default Grid;
