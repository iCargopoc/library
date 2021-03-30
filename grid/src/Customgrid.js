// @flow
import React, {
    useCallback,
    useState,
    useRef,
    useEffect,
    createRef,
    useMemo
} from "react";
import {
    useTable,
    useResizeColumns,
    useFlexLayout,
    useRowSelect,
    useSortBy,
    useFilters,
    useGlobalFilter,
    useExpanded
} from "react-table";
import { Scrollbars } from "rc-scrollbars";
import AutoSizer from "react-virtualized-auto-sizer";
import InfiniteLoader from "react-window-infinite-loader";
import { matchSorter } from "match-sorter";
import RowSelector from "./Functions/RowSelector";
import DefaultColumnFilter from "./Functions/DefaultColumnFilter";
import GlobalFilter from "./Functions/GlobalFilter";
import RowOptions from "./Functions/RowOptions";
import RowsList from "./List/RowsList";
import ColumnReordering from "./Overlays/managecolumns";
import GroupSort from "./Overlays/groupsort";
import ExportData from "./Overlays/exportdata";
import {
    IconColumns,
    IconAngle,
    IconFilter,
    IconShare,
    IconGroupSort,
    IconSort,
    IconRefresh,
    IconExpand,
    IconCollapse
} from "./Utilities/SvgUtilities";
import {
    setColumnWidths,
    findSelectedRows,
    findSelectedRowIdAttributes,
    findSelectedRowIdFromIdAttribute,
    findDeSelectedRows,
    checkdisplayOfGroupedColumns,
    checkIfGroupsortIsApplicable,
    findAllChildRows,
    hideColumns,
    getLeftOfColumn,
    isLastPinnedColumn
} from "./Utilities/GridUtilities";

const Customgrid = (props: {
    gridRef: any,
    isDesktop: boolean,
    title: string,
    theme: string,
    managableColumns: Array<Object>,
    columnsAccessorList: any,
    expandedRowData: Object,
    expandedRowDataAccessorList: any,
    parentColumn: Object,
    parentIdAttribute: string,
    parentRowExpandable: boolean,
    parentRowsToExpand: Array<Object>,
    managableSubComponentColumnns: Array<Object>,
    subComponentColumnsAccessorList: any,
    managableSubComponentAdditionalColumn: Object,
    subComponentAdditionalColumnAccessorList: any,
    loadChildData: Function,
    isParentGrid: boolean,
    gridData: Array<Object>,
    rowsToOverscan: number,
    idAttribute: string,
    pageInfo: Object,
    paginationType: string,
    totalRecordsCount: number,
    onRowSelect: Function,
    getRowInfo: Function,
    expandableColumn: boolean,
    isExpandContentAvailable?: boolean,
    isNextPageLoading: boolean,
    loadNextPage: Function,
    serverSideSorting: Function,
    getSortedData: Function,
    getToggleAllRowsSelectedProps?: Function,
    row?: Array<Object>,
    rowActions: any,
    CustomPanel: any,
    multiRowSelection: boolean,
    gridHeader: boolean,
    showTitle: boolean,
    rowSelector: boolean,
    globalSearch: boolean,
    columnFilter: boolean,
    groupSort: boolean,
    columnChooser: boolean,
    exportData: boolean,
    fileName: string,
    onGridRefresh: Function,
    rowsToSelect: Array<Object>,
    rowsToDeselect: Array<Object>,
    fixedRowHeight: boolean,
    pdfPaperSize: string,
    enablePinColumn: boolean
}): any => {
    const {
        gridRef,
        isDesktop,
        title,
        theme,
        managableColumns,
        columnsAccessorList,
        expandedRowData,
        expandedRowDataAccessorList,
        parentColumn,
        parentIdAttribute,
        parentRowExpandable,
        parentRowsToExpand,
        managableSubComponentColumnns,
        subComponentColumnsAccessorList,
        managableSubComponentAdditionalColumn,
        subComponentAdditionalColumnAccessorList,
        loadChildData,
        isParentGrid,
        gridData,
        rowsToOverscan,
        idAttribute,
        pageInfo,
        paginationType,
        totalRecordsCount,
        onRowSelect,
        getRowInfo,
        expandableColumn,
        rowActions,
        isNextPageLoading,
        loadNextPage,
        serverSideSorting,
        getSortedData,
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
        fileName,
        pdfPaperSize,
        onGridRefresh,
        rowsToSelect,
        rowsToDeselect,
        fixedRowHeight,
        enablePinColumn
    } = props;

    const listRef = createRef();

    // Over scan count for react-window list
    const overScanCount =
        rowsToOverscan && typeof rowsToOverscan === "number"
            ? rowsToOverscan
            : 5;

    // Local state to check if this is the first rendering of the Grid. Default value is true
    // This will be set as false in useEffect - [].
    // Selectedrows data will be passed to parent only if isFirstRendering is false
    const [isFirstRendering, setIsFirstRendering] = useState(true);

    // Local state value for holding columns configuration
    const [gridColumns, setGridColumns] = useState([]);

    // Local state value for holding the additional column configuration
    const [additionalColumn, setAdditionalColumn] = useState(null);

    // Local state value for holding sub component columns
    const [subComponentColumnns, setSubComponentColumnns] = useState([]);

    // Local state value for holding whether grid has sub component structure
    const [isSubComponentGrid, setIsSubComponentGrid] = useState(false);

    // Local state value for holding the sub component additional column configuration
    const [
        subComponentAdditionalColumn,
        setSubComponentAdditionalColumn
    ] = useState(null);

    // Local state value for holding row ids that have sub components expanded
    const [
        rowsWithExpandedSubComponents,
        setRowsWithExpandedSubComponents
    ] = useState([]);

    const gridDataLength = gridData.length;

    // Variables and functions used for handling infinite loading
    const invalidPages = useRef([]);
    const pagesToReload = useRef([]);
    const currentPageNumber = useRef(-1);
    const currentEndCursor = useRef(-1);
    const isPaginationNeeded = pageInfo !== undefined && pageInfo !== null;
    const itemCount = gridDataLength + 1;
    const loadMoreItems = (): Object => {
        if (loadNextPage && typeof loadNextPage === "function") {
            const { pageSize, lastPage } = pageInfo;
            let pageInfoToReturn = { pageSize, lastPage };
            const pageNumsToReturn = pagesToReload.current;
            if (
                pageNumsToReturn &&
                pageNumsToReturn.length > 0 &&
                paginationType !== "cursor"
            ) {
                const firstPageToReload = pageNumsToReturn[0];
                pageInfoToReturn = {
                    pageNum: firstPageToReload,
                    ...pageInfoToReturn
                };
                pagesToReload.current = pageNumsToReturn.filter(
                    (num: number): boolean => num !== firstPageToReload
                );
                return loadNextPage(pageInfoToReturn, true);
            }
            if (isNextPageLoading) {
                return Promise.resolve();
            }
            const { pageNum, endCursor } = pageInfo;
            if (paginationType === "cursor") {
                let calculatedEndCursor = endCursor;
                if (currentEndCursor.current === -1) {
                    currentEndCursor.current = endCursor;
                } else {
                    calculatedEndCursor = currentEndCursor.current + pageSize;
                    currentEndCursor.current = calculatedEndCursor;
                }
                pageInfoToReturn = {
                    endCursor: calculatedEndCursor,
                    ...pageInfoToReturn
                };
            } else {
                let calculatedPageNumber = pageNum;
                if (currentPageNumber.current === -1) {
                    currentPageNumber.current = pageNum;
                } else {
                    calculatedPageNumber = currentPageNumber.current + 1;
                    currentPageNumber.current = calculatedPageNumber;
                }
                pageInfoToReturn = {
                    pageNum: calculatedPageNumber + 1,
                    ...pageInfoToReturn
                };
            }
            return loadNextPage(pageInfoToReturn, false);
        }
        return Promise.resolve();
    };
    const isItemLoaded = (index: number): Object => {
        let isReloadRequired = false;
        if (paginationType !== "cursor") {
            const invalidPagesArray = invalidPages.current;
            if (invalidPagesArray && invalidPagesArray.length > 0) {
                const { pageSize } = pageInfo;
                invalidPagesArray.forEach((page: number) => {
                    const pageLastIndex = page * pageSize - 1;
                    const pageFirstIndex = (page - 1) * pageSize;
                    if (index >= pageFirstIndex && index <= pageLastIndex) {
                        isReloadRequired = true;
                        invalidPages.current = invalidPagesArray.filter(
                            (val: number): boolean => val !== page
                        );
                        pagesToReload.current.push(page);
                    }
                });
            }
        }
        return isReloadRequired === false && index < gridDataLength;
    };

    // Local state value for checking if column filter is open/closed
    const [isFilterOpen, setFilterOpen] = useState(false);
    // Toggle column filter state value based on UI clicks
    const toggleColumnFilter = () => {
        setFilterOpen(!isFilterOpen);
    };

    // Local state value for checking if group Sort Overlay is open/closed.
    const [isGroupSortOverLayOpen, setGroupSortOverLay] = useState(false);
    // Local state for group sort options
    const [groupSortOptions, setGroupSortOptions] = useState([]);
    // Local state value for hiding/unhiding column management overlay
    const [isManageColumnOverlayOpen, setManageColumnOpen] = useState(false);

    // Toggle group Sort state value based on UI clicks
    const toggleGroupSortOverLay = () => {
        // Make sure manage column overlay is closed whenever user opens/hides group sort overlay.
        // This is to avoid conflicts of 2 components being rendered that uses DnD library.
        setManageColumnOpen(false);
        setGroupSortOverLay(!isGroupSortOverLayOpen);
    };
    // Call apply group sort function from parent
    const applyGroupSort = (sortOptions: Object) => {
        setGroupSortOptions(sortOptions);
        if (serverSideSorting && typeof serverSideSorting === "function") {
            serverSideSorting(sortOptions);
        }
    };

    // Toggle column manage overlay show/hide state value based on UI clicks
    const toggleManageColumnsOverlay = () => {
        // Make sure group sort overlay is closed whenever user opens/hides manage column overlay.
        // This is to avoid conflicts of 2 components being rendered that uses DnD library.
        setGroupSortOverLay(false);
        setManageColumnOpen(!isManageColumnOverlayOpen);
    };
    // Callback method from column manage overlay to update the column structure of the grid
    const updateColumnStructure = (
        updatedColumns: Object,
        updatedAdditionalColumn: Object,
        updatedSubComponentColumns: Object,
        updatedSubComponentAdditionalColumn: Object
    ) => {
        setGridColumns([...setColumnWidths([...updatedColumns])]);
        setAdditionalColumn(updatedAdditionalColumn);
        if (isSubComponentGrid) {
            setSubComponentColumnns([
                ...setColumnWidths([...updatedSubComponentColumns])
            ]);
            setSubComponentAdditionalColumn(
                updatedSubComponentAdditionalColumn
            );
        }
    };

    // Local state value for hiding/unhiding export data overlay
    const [isExportOverlayOpen, setIsExportOverlayOpen] = useState(false);
    // Toggle export overlay show/hide state value based on UI clicks
    const toggleExportDataOverlay = () => {
        setIsExportOverlayOpen(!isExportOverlayOpen);
    };

    // Local state value for storing user selected rows - identifier values (idAttribute)
    const [
        userSelectedRowIdentifiers,
        setUserSelectedRowIdentifiers
    ] = useState([]);
    // Local state to identify if row selection call back has to be given or not
    const [
        isRowSelectionCallbackNeeded,
        setIsRowSelectionCallbackNeeded
    ] = useState(null);

    // Column filter added for all columns by default
    const defaultColumn = useMemo(
        (): Object => ({
            Filter: DefaultColumnFilter
        }),
        []
    );

    const [expandedParentRows, setExpandedParentRows] = useState([]);

    // Create a list of accessors to be searched from columns array
    let accessorList = [...columnsAccessorList, ...expandedRowDataAccessorList];

    // Append accessors if sub component is present
    if (
        isSubComponentGrid &&
        managableSubComponentColumnns &&
        managableSubComponentColumnns.length > 0
    ) {
        accessorList = [
            ...accessorList,
            ...subComponentColumnsAccessorList,
            ...subComponentAdditionalColumnAccessorList
        ];
    }

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
        [managableColumns, managableSubComponentColumnns, isSubComponentGrid]
    );

    const isRowExpandEnabled = !!(
        expandedRowData &&
        Object.keys(expandedRowData).length > 0 &&
        expandedRowData.display === true &&
        expandedRowData.Cell &&
        typeof expandedRowData.Cell === "function"
    );
    const isRowActionsAvailable = !!(
        rowActions && typeof rowActions === "function"
    ); // If row actions are available
    const isRowExpandAvailable = isRowExpandEnabled || expandableColumn; // If row expand option is available
    const isRowActionsColumnNeeded =
        isRowActionsAvailable || isRowExpandAvailable;

    const columns = useMemo((): Object => gridColumns);
    const data =
        serverSideSorting && typeof serverSideSorting === "function"
            ? useMemo((): Object => [...gridData])
            : useMemo((): Object =>
                  getSortedData([...gridData], groupSortOptions)
              );

    let isAtleastOneColumnPinned = false;
    gridColumns.forEach((col: Object) => {
        const { pinLeft } = col;
        if (pinLeft === true) {
            isAtleastOneColumnPinned = true;
        }
    });

    // Initialize react-table instance with the values received through properties
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
        allColumns,
        preFilteredRows,
        state: { globalFilter, selectedRowIds },
        setGlobalFilter,
        toggleRowSelected,
        toggleAllRowsSelected
    } = useTable(
        {
            columns,
            data,
            defaultColumn,
            isSubComponentGrid,
            enablePinColumn,
            isAtleastOneColumnPinned,
            rowsWithExpandedSubComponents,
            globalFilter: globalFilterLogic,
            autoResetFilters: false,
            autoResetGlobalFilter: false,
            autoResetSortBy: false,
            autoResetExpanded: false,
            autoResetSelectedRows: false
        },
        useFilters,
        useGlobalFilter,
        useSortBy,
        useExpanded,
        useRowSelect,
        useFlexLayout,
        useResizeColumns,
        (hooks: Object): Object => {
            if (isSubComponentGrid) {
                hooks.allColumns.push(
                    (hookColumns: Object, instanceObj: Object): Object => [
                        {
                            id: "expand_collapse",
                            columnId: "column_custom_2", // *** Never change this id. It is used in other places ***
                            disableResizing: true,
                            disableFilters: true,
                            disableSortBy: true,
                            display: true,
                            pinLeft: isAtleastOneColumnPinned,
                            isGroupHeader: false,
                            minWidth: 35,
                            width: 35,
                            maxWidth: 35,
                            Header: (headerSelectProps: Object): Object => {
                                const { instance } = instanceObj;
                                const expandedRowIds = [
                                    ...instance.rowsWithExpandedSubComponents
                                ];
                                const totalRowIds = findSelectedRowIdAttributes(
                                    // eslint-disable-next-line react/destructuring-assignment
                                    headerSelectProps.data,
                                    idAttribute
                                );
                                const isAllRowsExpanded =
                                    expandedRowIds.length ===
                                    totalRowIds.length;
                                return (
                                    <i
                                        role="presentation"
                                        className="ng-accordion__icon"
                                        onClick={() => {
                                            if (isAllRowsExpanded) {
                                                setRowsWithExpandedSubComponents(
                                                    []
                                                );
                                            } else {
                                                setRowsWithExpandedSubComponents(
                                                    totalRowIds
                                                );
                                            }
                                        }}
                                        data-testid="subComponent-header-expand-collapse-all"
                                    >
                                        {isAllRowsExpanded ? (
                                            <IconCollapse className="ng-icon" />
                                        ) : (
                                            <IconExpand className="ng-icon" />
                                        )}
                                    </i>
                                );
                            },
                            Cell: (cellSelectProps: Object): Object => {
                                const { row } = cellSelectProps;
                                const { original } = row;
                                const { subComponentData } = original;
                                const isSubComponentRowsPresent =
                                    subComponentData !== null &&
                                    subComponentData !== undefined &&
                                    subComponentData.length > 0;
                                if (isSubComponentRowsPresent) {
                                    const { instance } = instanceObj;
                                    const rowIdAttr = original[idAttribute];
                                    const expandedRows =
                                        instance.rowsWithExpandedSubComponents;
                                    const isSubComponentsExpanded = expandedRows.includes(
                                        rowIdAttr
                                    );
                                    return (
                                        <i
                                            role="presentation"
                                            className="ng-accordion__icon"
                                            onClick={() => {
                                                let currentRowsWithExpandedSubComponents = [
                                                    ...expandedRows
                                                ];
                                                if (isSubComponentsExpanded) {
                                                    currentRowsWithExpandedSubComponents = currentRowsWithExpandedSubComponents.filter(
                                                        (
                                                            rowId: string
                                                        ): Object =>
                                                            rowId !== rowIdAttr
                                                    );
                                                } else {
                                                    currentRowsWithExpandedSubComponents.push(
                                                        rowIdAttr
                                                    );
                                                }
                                                setRowsWithExpandedSubComponents(
                                                    currentRowsWithExpandedSubComponents
                                                );
                                            }}
                                            data-testid="subComponent-header-expand-collapse"
                                        >
                                            {isSubComponentsExpanded ? (
                                                <IconCollapse className="ng-icon" />
                                            ) : (
                                                <IconExpand className="ng-icon" />
                                            )}
                                        </i>
                                    );
                                }
                                return null;
                            }
                        },
                        ...hookColumns
                    ]
                );
            }

            // Add checkbox for all rows in grid, with different properties for header row and body rows, only if required
            if (rowSelector !== false) {
                hooks.allColumns.push((hookColumns: Object): Object => [
                    {
                        id: "selection",
                        columnId: "column_custom_0",
                        disableResizing: true,
                        disableFilters: true,
                        disableSortBy: true,
                        display: true,
                        pinLeft: isAtleastOneColumnPinned,
                        isGroupHeader: false,
                        minWidth: isParentGrid ? 65 : 35,
                        width: isParentGrid ? 65 : 35,
                        maxWidth: isParentGrid ? 65 : 35,
                        Header: (headerSelectProps: Object): Object => {
                            const {
                                getToggleAllRowsSelectedProps
                            } = headerSelectProps;
                            if (multiRowSelection === false) {
                                return null;
                            }
                            return (
                                <RowSelector
                                    data-testid="rowSelector-allRows"
                                    {...getToggleAllRowsSelectedProps({
                                        onClick: (event: Object): Object => {
                                            // Set state value to identify if checkbox has been selected or deselected
                                            const selectedType =
                                                event.currentTarget.checked ===
                                                false
                                                    ? "deselect"
                                                    : "select";
                                            setIsRowSelectionCallbackNeeded(
                                                selectedType
                                            );
                                            toggleAllRowsSelected();
                                        }
                                    })}
                                />
                            );
                        },
                        Cell: (cellSelectProps: Object): Object => {
                            const { row } = cellSelectProps;
                            // Check if row selector is required for this row using the getRowInfo prop passed
                            let isRowSelectable = true;
                            if (
                                getRowInfo &&
                                typeof getRowInfo === "function"
                            ) {
                                const rowInfo = getRowInfo(row.original, false);
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
                                        data-testid="rowSelector-singleRow"
                                        {...row.getToggleRowSelectedProps({
                                            onClick: (
                                                event: Object
                                            ): Object => {
                                                // Set state value to identify if checkbox has been selected or deselected
                                                const selectedType =
                                                    event.currentTarget
                                                        .checked === false
                                                        ? "deselect"
                                                        : "select";
                                                setIsRowSelectionCallbackNeeded(
                                                    selectedType
                                                );
                                                row.toggleRowSelected();
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
                        id: "custom",
                        columnId: "column_custom_1",
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
                            // Check if expand icon is required for this row using the getRowInfo prop passed
                            let isRowExpandable = true;
                            if (
                                getRowInfo &&
                                typeof getRowInfo === "function"
                            ) {
                                const rowInfo = getRowInfo(row.original, false);
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
                                            isSubComponentRow={false}
                                        />
                                    ) : null}
                                    {isRowExpandAvailable && isRowExpandable ? (
                                        <span
                                            className="ng-action__expander"
                                            data-testid="rowExpanderIcon"
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

    // Finds the rows (avoids if not isSelectable from getRowInfo) selected by users from selectedRowIds and updates the state value and triggers the callback function.
    // Also identify if checkbox is checked or unchecked and if unchecked, return runchecked row details too to the callback function.
    // This is used in useeffects for row selection and row deselection
    const updateSelectedRows = (
        rowsInGrid: string,
        selectedRowIdsInGrid: Array<Object>
    ) => {
        if (idAttribute) {
            const rowsSelectedByUser = findSelectedRows(
                rowsInGrid,
                selectedRowIdsInGrid,
                getRowInfo,
                false
            );
            const rowIdentifiers = findSelectedRowIdAttributes(
                rowsSelectedByUser,
                idAttribute
            );
            setUserSelectedRowIdentifiers(rowIdentifiers);
            if (onRowSelect && isRowSelectionCallbackNeeded !== null) {
                setIsRowSelectionCallbackNeeded(null);
                onRowSelect(
                    rowsSelectedByUser,
                    isRowSelectionCallbackNeeded === "deselect"
                        ? findDeSelectedRows(
                              preFilteredRows,
                              userSelectedRowIdentifiers,
                              rowIdentifiers,
                              idAttribute
                          )
                        : null
                );
            }
        }
    };

    // Recalculate row height from index passed as parameter. If not passed 50 less than the last rendered item index in the list
    const reRenderListData = (index?: number): Object => {
        if (listRef) {
            const { current } = listRef;
            if (current) {
                let indexToReset = 0;
                if (index !== null && index !== undefined && index >= 0) {
                    indexToReset = index;
                } else {
                    const { _instanceProps } = current;
                    if (_instanceProps) {
                        const expectedItemsCount = overScanCount + 30;
                        const { lastMeasuredIndex } = _instanceProps;
                        const difference =
                            lastMeasuredIndex - expectedItemsCount;
                        indexToReset = difference >= 0 ? difference : 0;
                    }
                }
                current.resetAfterIndex(indexToReset, true);
            }
        }
    };

    const loadMoreChildData = (row: Object): Object => {
        if (row) {
            const { original } = row;
            loadChildData(original);
        }
    };

    const isParentRowOpen = (row: Object): Object => {
        let returnValue = false;
        if (parentIdAttribute && row) {
            const { original } = row;
            const rowParentIdAttribute = original[parentIdAttribute];
            if (
                rowParentIdAttribute !== null &&
                rowParentIdAttribute !== undefined
            ) {
                // Check if parent row is present in state.
                returnValue = expandedParentRows.includes(rowParentIdAttribute);
            }
        }
        return returnValue;
    };

    const toggleParentRow = (row: Object): Object => {
        if (parentIdAttribute && row) {
            const { original, index } = row;
            const rowParentIdAttribute = original[parentIdAttribute];
            if (
                rowParentIdAttribute !== null &&
                rowParentIdAttribute !== undefined
            ) {
                // Check if parent row is present in state.
                // If present, remove it and if not present add it.
                if (expandedParentRows.includes(rowParentIdAttribute)) {
                    setExpandedParentRows(
                        expandedParentRows.filter(
                            (item: Object): Object =>
                                item !== rowParentIdAttribute
                        )
                    );
                } else {
                    setExpandedParentRows([
                        ...expandedParentRows,
                        rowParentIdAttribute
                    ]);
                }

                // Check if child rows are present for parent row
                const childRow = rows.find((currentRow: Object): boolean => {
                    return (
                        currentRow &&
                        currentRow.original &&
                        currentRow.original.isParent !== true &&
                        currentRow.original[parentIdAttribute] ===
                            rowParentIdAttribute
                    );
                });
                if (!childRow) {
                    loadMoreChildData(row);
                } else {
                    reRenderListData(index);
                }
            }
        }
    };

    // Make checkbox in header title selected if no: selected rows and total rows are same
    const isAllRowsSelected = (): boolean => {
        return (
            rows &&
            rows.length > 0 &&
            userSelectedRowIdentifiers &&
            userSelectedRowIdentifiers.length > 0 &&
            rows.length === userSelectedRowIdentifiers.length
        );
    };

    // Call method to select/de-select all rows based on the checkbox checked value
    const toggleAllRowsSelection = (event: Object): Object => {
        const { checked } = event.currentTarget;
        setIsRowSelectionCallbackNeeded(
            checked === true ? "select" : "deselect"
        );
        toggleAllRowsSelected(checked);
    };

    // Update state, when user is updating columns configuration from outside Grid
    useEffect(() => {
        if (managableColumns && managableColumns.length > 0) {
            setGridColumns(managableColumns);
        }
    }, [managableColumns]);

    useEffect(() => {
        if (!isFirstRendering) {
            hideColumns(allColumns, gridColumns);
        }
    }, [gridColumns]);

    // Update state, when user is updating additional column configuration from outside Grid
    useEffect(() => {
        setAdditionalColumn(expandedRowData);
    }, [expandedRowData]);

    // Update state, when user is updating sub component columns configuration from outside Grid
    useEffect(() => {
        if (
            managableSubComponentColumnns &&
            managableSubComponentColumnns.length > 0
        ) {
            setIsSubComponentGrid(true);
            setSubComponentColumnns(managableSubComponentColumnns);
        }
    }, [managableSubComponentColumnns]);

    // Update state, when user is updating sub component additional column configuration from outside Grid
    useEffect(() => {
        setSubComponentAdditionalColumn(managableSubComponentAdditionalColumn);
    }, [managableSubComponentAdditionalColumn]);

    // Update the boolean value used to identify if this is the first time render of Grid
    useEffect(() => {
        setIsFirstRendering(false);
    }, []);

    // Update the select state of row in Grid using the hook provided by useTable method
    // Find the row Id using the key - value passed from props and use toggleRowSelected method to select the checkboxes
    // Consider rowsToSelect, rowsToDeselect and already made selections and then select wanted rows and deselect unwanted rows.
    // This should hapen whenever data changes or group sort is applied
    useEffect(() => {
        if (idAttribute) {
            let rowsToBeSelected =
                rowsToSelect && rowsToSelect.length > 0 ? rowsToSelect : [];
            rowsToBeSelected =
                !isFirstRendering &&
                userSelectedRowIdentifiers &&
                userSelectedRowIdentifiers.length > 0
                    ? [...userSelectedRowIdentifiers, ...rowsToBeSelected]
                    : rowsToBeSelected;
            let rowsToBeDeselected =
                rowsToDeselect && rowsToDeselect.length > 0
                    ? rowsToDeselect
                    : [];
            // Romove rows from selection if the same row is present in the rowsToDeselect array
            rowsToBeSelected = rowsToBeSelected.filter(
                (row: Object): boolean => !rowsToBeDeselected.includes(row)
            );
            // If Grid selection is single selection consider only the first item in array
            if (multiRowSelection === false) {
                rowsToBeSelected =
                    rowsToBeSelected.length > 0 ? [rowsToBeSelected[0]] : [];
                rowsToBeDeselected =
                    rowsToBeDeselected.length > 0
                        ? [rowsToBeDeselected[0]]
                        : [];
            }
            const updatedSelectedRowIds = [];
            if (rowsToBeSelected && rowsToBeSelected.length > 0) {
                rowsToBeSelected.forEach((rowId: string): Object => {
                    const rowToSelect = preFilteredRows.find(
                        (row: Object): Object => {
                            const { original } = row;
                            return original[idAttribute] === rowId;
                        }
                    );
                    if (rowToSelect) {
                        const { id } = rowToSelect;
                        toggleRowSelected(id, true);
                        updatedSelectedRowIds.push(id);
                    }
                });
            }
            if (rowsToBeDeselected && rowsToBeDeselected.length > 0) {
                rowsToBeDeselected.forEach((rowId: string): Object => {
                    const rowToDeselect = preFilteredRows.find(
                        (row: Object): Object => {
                            const { original } = row;
                            return original[idAttribute] === rowId;
                        }
                    );
                    if (rowToDeselect) {
                        const { id } = rowToDeselect;
                        toggleRowSelected(id, false);
                    }
                });
            }
            // Loop through already selected rows and find row id that are not selected yet and update it to false
            Object.entries(selectedRowIds).forEach(
                (objEntry: Object): Object => {
                    if (objEntry && objEntry.length > 0) {
                        const rowId = objEntry[0];
                        if (!updatedSelectedRowIds.includes(rowId)) {
                            toggleRowSelected(rowId, false);
                        }
                    }
                }
            );
        }
    }, [rowsToSelect, rowsToDeselect, gridData, groupSortOptions]);

    useEffect(() => {
        if (!isFirstRendering) {
            reRenderListData();
        }
    }, [rows]);

    useEffect(() => {
        if (!isFirstRendering && paginationType !== "cursor") {
            const { pageNum, pageSize } = pageInfo;
            const totalPageSize = Math.ceil(gridData.length / pageSize);
            if (pageSize > 1) {
                const pagesArray = [];
                for (let i = 1; i <= totalPageSize; i++) {
                    if (i !== pageNum) {
                        pagesArray.push(i);
                    }
                }
                invalidPages.current = pagesArray;
            }
        }
    }, [totalRecordsCount]);

    useEffect(() => {
        if (parentRowsToExpand && parentRowsToExpand.length > 0) {
            setExpandedParentRows(parentRowsToExpand);
        }
    }, [parentRowsToExpand]);

    // Trigger call back when user makes a row selection using checkbox
    // And store the rows that are selected by user for making them selected when data changes after groupsort
    // Call back method will not be triggered if this is the first render of Grid
    // If multiRowSelection is disabled in Grid, deselect the existing row selection
    useEffect(() => {
        if (!isFirstRendering) {
            if (multiRowSelection === false) {
                // If multiRowSelection is disabled in Grid, find row id of existing row selection
                const rowIdToDeSelect = findSelectedRowIdFromIdAttribute(
                    preFilteredRows,
                    idAttribute,
                    userSelectedRowIdentifiers
                );
                // If selectedRowIds length is 2, means user has selected a row when there is already a row selection made
                const selectedRowKey = Object.keys(selectedRowIds);
                if (
                    rowIdToDeSelect !== "" &&
                    selectedRowKey &&
                    selectedRowKey.length > 1
                ) {
                    // Disable that existing row
                    const currentSelection = selectedRowKey.find(
                        (key: string): boolean => key !== rowIdToDeSelect
                    );
                    if (currentSelection) {
                        toggleRowSelected(rowIdToDeSelect, false);
                    }
                } else {
                    // This method will be called twice. 1 for deselection and other for user selection
                    // So need to trigger the save changes only once
                    updateSelectedRows(preFilteredRows, selectedRowIds);
                }
            } else {
                // Trigger save changes if multiRowSelection is enabled
                updateSelectedRows(preFilteredRows, selectedRowIds);
            }
        }
    }, [selectedRowIds]);

    // Check if parent id attribute is present in the list of opened parent attributes.
    const isParentRowCollapsed = (childRow: Object): boolean => {
        let isParentCollpased = false;
        if (
            childRow &&
            parentIdAttribute &&
            parentRowExpandable !== false &&
            isParentGrid
        ) {
            const { original } = childRow;
            const { isParent } = original;
            if (isParent !== true) {
                const rowParentIdAttribute = original[parentIdAttribute];
                if (
                    rowParentIdAttribute !== null &&
                    rowParentIdAttribute !== undefined &&
                    !expandedParentRows.includes(rowParentIdAttribute)
                ) {
                    isParentCollpased = true;
                }
            }
        }
        return isParentCollpased;
    };

    const isParentRowSelected = (row: Object): boolean => {
        let returnValue = false;
        if (row && parentIdAttribute && idAttribute) {
            const { original } = row;
            const rowParentIdAttribute = original[parentIdAttribute];
            if (
                rowParentIdAttribute !== null &&
                rowParentIdAttribute !== undefined
            ) {
                let isAtleastOneChildUnselected = false;
                let isChildRowsAvailable = false;
                preFilteredRows.forEach((gridRow: Object): Object => {
                    const gridRowOriginal = gridRow.original;
                    if (gridRowOriginal && gridRowOriginal.isParent !== true) {
                        const parentIdOfChildRow =
                            gridRowOriginal[parentIdAttribute];
                        if (
                            parentIdOfChildRow !== null &&
                            parentIdOfChildRow !== undefined &&
                            rowParentIdAttribute === parentIdOfChildRow
                        ) {
                            isChildRowsAvailable = true;
                            const rowIdAttribute = gridRowOriginal[idAttribute];
                            let isRowSelectable = true;
                            if (
                                getRowInfo &&
                                typeof getRowInfo === "function"
                            ) {
                                const rowInfo = getRowInfo(
                                    gridRowOriginal,
                                    false
                                );
                                if (
                                    rowInfo &&
                                    rowInfo.isRowSelectable === false
                                ) {
                                    isRowSelectable = false;
                                }
                            }

                            if (
                                isRowSelectable &&
                                !userSelectedRowIdentifiers.includes(
                                    rowIdAttribute
                                )
                            ) {
                                isAtleastOneChildUnselected = true;
                            }
                        }
                    }
                });
                returnValue =
                    isChildRowsAvailable && !isAtleastOneChildUnselected;
            }
        }
        return returnValue;
    };

    const toggleParentRowSelection = (event: Object, row: Object) => {
        let selectionType = true;
        const { checked } = event.currentTarget;
        if (checked === false) {
            selectionType = false;
        }
        if (row && parentIdAttribute && idAttribute) {
            const { original } = row;
            const { isParent } = original;
            if (isParent === true) {
                const rowParentIdAttribute = original[parentIdAttribute];
                if (
                    rowParentIdAttribute !== null &&
                    rowParentIdAttribute !== undefined
                ) {
                    preFilteredRows.forEach((gridRow: Object): Object => {
                        const gridRowOriginal = gridRow.original;
                        if (
                            gridRowOriginal &&
                            gridRowOriginal.isParent !== true
                        ) {
                            if (
                                gridRowOriginal[parentIdAttribute] ===
                                rowParentIdAttribute
                            ) {
                                const { id } = gridRow;
                                setIsRowSelectionCallbackNeeded(
                                    selectionType ? "select" : "deselect"
                                );
                                toggleRowSelected(id, selectionType);
                            }
                        }
                    });
                }
            }
        }
    };

    const isLoadMoreChildRowsRequiredForRow = (
        index: number,
        lastPage: boolean
    ): boolean => {
        let isLoadMoreChildNeeded = false;
        if (isParentGrid && lastPage === false) {
            if (index === rows.length - 1) {
                isLoadMoreChildNeeded = true;
            } else {
                const nextRow = rows[index + 1];
                if (nextRow) {
                    isLoadMoreChildNeeded =
                        nextRow.original && nextRow.original.isParent === true;
                }
            }
        }
        return isLoadMoreChildNeeded;
    };

    const isLoadMoreRequiredForNormalRow = (index: number): boolean => {
        return index === rows.length - 1 && isNextPageLoading;
    };

    const handleScroll = ({ target }: Object) => {
        if (listRef && listRef.current && listRef.current.scrollTo) {
            const { scrollTop } = target || {};
            listRef.current.scrollTo(scrollTop);
        }
    };

    if (!isFirstRendering && gridColumns && gridColumns.length > 0) {
        // Check if atleast 1 column has group sort option enabled, and display group sort icon only if there is atleast 1.
        const isGroupSortNeeded = checkIfGroupsortIsApplicable(
            managableColumns
        );

        // Render table and other components as required
        // Use properties and methods provided by react-table
        // Autosizer used for calculating grid height (don't consider window width and column resizing value changes)
        // Infinite loader used for lazy loading, with the properties passed here and other values calculated at the top
        // React window list is used for implementing virtualization, specifying the item count in a frame and height of each rows in it.
        return (
            <div className="neo-grid__wrapper">
                <div
                    className={`neo-grid__header ${
                        gridHeader === false
                            ? "neo-grid__header--borderless"
                            : ""
                    }`}
                >
                    {gridHeader === false &&
                    multiRowSelection !== false &&
                    rowSelector !== false ? (
                        <div className="neo-form-check ng-header-results__check">
                            <input
                                type="checkbox"
                                data-testid="rowSelector-allRows-fromHeaderTitle"
                                className="neo-checkbox form-check-input"
                                checked={isAllRowsSelected()}
                                onChange={toggleAllRowsSelection}
                            />
                        </div>
                    ) : null}
                    {showTitle !== false ? (
                        <div
                            className="ng-header-results"
                            data-testid="grid-title-container"
                        >
                            <span className="ng-header-results__count">
                                {totalRecordsCount > 0 &&
                                rows.length === gridDataLength
                                    ? totalRecordsCount
                                    : findAllChildRows(rows).length}
                            </span>
                            <span className="ng-header-results__title">
                                {title || "Rows"}
                            </span>
                        </div>
                    ) : null}
                    {CustomPanel ? (
                        <div className="neo-grid__customPanel">
                            <CustomPanel />
                        </div>
                    ) : null}
                    <div className="ng-header-utils">
                        {globalSearch !== false ? (
                            <GlobalFilter
                                globalFilter={globalFilter}
                                setGlobalFilter={setGlobalFilter}
                            />
                        ) : null}
                        {gridHeader !== false && columnFilter !== false ? (
                            <div className="ng-header-utils__items keyword-search-container">
                                <div
                                    className="ng-header-utils__icons keyword-search"
                                    role="presentation"
                                    data-testid="toggleColumnFilter"
                                    onClick={toggleColumnFilter}
                                >
                                    <i className="ng-icon-block">
                                        <IconFilter className="ng-icon ng-icon--filter" />
                                    </i>
                                </div>
                            </div>
                        ) : null}
                        {isGroupSortNeeded !== false && groupSort !== false ? (
                            <div className="ng-header-utils__items group-sort-container">
                                <div
                                    className="ng-header-utils__icons group-sort"
                                    role="presentation"
                                    data-testid="toggleGroupSortOverLay"
                                    onClick={toggleGroupSortOverLay}
                                >
                                    <i className="ng-icon-block">
                                        <IconGroupSort className="ng-icon" />
                                    </i>
                                </div>
                                {isGroupSortOverLayOpen ? (
                                    <GroupSort
                                        toggleGroupSortOverLay={
                                            toggleGroupSortOverLay
                                        }
                                        groupSortOptions={groupSortOptions}
                                        gridColumns={managableColumns}
                                        gridSubComponentColumns={
                                            managableSubComponentColumnns
                                        }
                                        applyGroupSort={applyGroupSort}
                                    />
                                ) : null}
                            </div>
                        ) : null}
                        {columnChooser !== false ? (
                            <div className="ng-header-utils__items">
                                <div
                                    className="ng-header-utils__icons"
                                    role="presentation"
                                    data-testid="toggleManageColumnsOverlay"
                                    onClick={toggleManageColumnsOverlay}
                                >
                                    <i className="ng-icon-block">
                                        <IconColumns className="ng-icon" />
                                    </i>
                                </div>
                                {isManageColumnOverlayOpen ? (
                                    <ColumnReordering
                                        toggleManageColumnsOverlay={
                                            toggleManageColumnsOverlay
                                        }
                                        columns={gridColumns}
                                        originalColumns={managableColumns}
                                        additionalColumn={additionalColumn}
                                        originalAdditionalColumn={
                                            expandedRowData
                                        }
                                        isSubComponentGrid={isSubComponentGrid}
                                        subComponentColumnns={
                                            subComponentColumnns
                                        }
                                        originalSubComponentColumns={
                                            managableSubComponentColumnns
                                        }
                                        subComponentAdditionalColumn={
                                            subComponentAdditionalColumn
                                        }
                                        originalSubComponentAdditionalColumn={
                                            managableSubComponentAdditionalColumn
                                        }
                                        updateColumnStructure={
                                            updateColumnStructure
                                        }
                                        enablePinColumn={enablePinColumn}
                                    />
                                ) : null}
                            </div>
                        ) : null}
                        {exportData !== false ? (
                            <div className="ng-header-utils__items">
                                <div
                                    className="ng-header-utils__icons export-data"
                                    role="presentation"
                                    data-testid="toggleExportDataOverlay"
                                    onClick={toggleExportDataOverlay}
                                >
                                    <i className="ng-icon-block">
                                        <IconShare className="ng-icon" />
                                    </i>
                                </div>
                                {isExportOverlayOpen ? (
                                    <ExportData
                                        gridRef={gridRef}
                                        toggleExportDataOverlay={
                                            toggleExportDataOverlay
                                        }
                                        rows={rows}
                                        columns={gridColumns}
                                        additionalColumn={additionalColumn}
                                        isParentGrid={isParentGrid}
                                        parentColumn={parentColumn}
                                        isSubComponentGrid={isSubComponentGrid}
                                        subComponentColumnns={
                                            subComponentColumnns
                                        }
                                        subComponentAdditionalColumn={
                                            subComponentAdditionalColumn
                                        }
                                        fileName={fileName}
                                        pdfPaperSize={pdfPaperSize}
                                        isDesktop={isDesktop}
                                    />
                                ) : null}
                            </div>
                        ) : null}
                        {typeof onGridRefresh === "function" ? (
                            <div className="ng-header-utils__items">
                                <div
                                    className="ng-header-utils__icons"
                                    role="presentation"
                                    data-testid="refreshGrid"
                                    onClick={onGridRefresh}
                                >
                                    <i className="ng-icon-block">
                                        <IconRefresh className="ng-icon" />
                                    </i>
                                </div>
                            </div>
                        ) : null}
                    </div>
                </div>

                <div
                    className={`neo-grid__table ${
                        isParentGrid === true ? "neo-grid__table--parent" : ""
                    }`}
                >
                    <AutoSizer disableWidth className="neo-grid__autosizer">
                        {({ height }: Object): Object => (
                            <Scrollbars
                                autoHeight
                                autoHeightMin={height}
                                autoHeightMax={height}
                                classes={{
                                    view: "neo-grid__scrollView",
                                    trackHorizontal:
                                        "ng-scrolltrack ng-scrolltrack--horizontal",
                                    trackVertical:
                                        "ng-scrolltrack ng-scrolltrack--vertical",
                                    thumbHorizontal:
                                        "ng-scrollthumb ng-scrollthumb--horizontal",
                                    thumbVertical:
                                        "ng-scrollthumb ng-scrollthumb--vertical"
                                }}
                                onScroll={handleScroll}
                            >
                                <div
                                    {...getTableProps()}
                                    className="neo-grid__content"
                                >
                                    {gridHeader === false ? null : (
                                        <div className="neo-grid__thead">
                                            {headerGroups.map(
                                                (
                                                    headerGroup: Object,
                                                    index: number
                                                ): Object => {
                                                    // If there are morthan 1 headerGroups, we consider 1st one as group header row
                                                    const isGroupHeader =
                                                        headerGroups.length > 1
                                                            ? index === 0
                                                            : false;
                                                    return (
                                                        <div
                                                            {...headerGroup.getHeaderGroupProps()}
                                                            className="neo-grid__tr"
                                                            data-testid={
                                                                isGroupHeader
                                                                    ? "grid-groupHeadersList"
                                                                    : "grid-headersList"
                                                            }
                                                        >
                                                            {headerGroup.headers.map(
                                                                (
                                                                    column: Object,
                                                                    headerIndex: number
                                                                ): Object => {
                                                                    const {
                                                                        display,
                                                                        isSorted,
                                                                        isSortedDesc,
                                                                        filter,
                                                                        canResize,
                                                                        pinLeft,
                                                                        pinRight,
                                                                        headers
                                                                    } = column;
                                                                    let isColumnPinnedLeft =
                                                                        pinLeft ===
                                                                        true;
                                                                    let isColumnPinnedRight =
                                                                        !isColumnPinnedLeft &&
                                                                        pinRight ===
                                                                            true;
                                                                    if (
                                                                        isGroupHeader &&
                                                                        headers &&
                                                                        headers.length >
                                                                            0
                                                                    ) {
                                                                        isColumnPinnedLeft =
                                                                            headers[0]
                                                                                .pinLeft ===
                                                                            true;
                                                                        isColumnPinnedRight =
                                                                            !isColumnPinnedLeft &&
                                                                            headers[0]
                                                                                .pinRight ===
                                                                                true;
                                                                    }
                                                                    if (
                                                                        display ===
                                                                            true ||
                                                                        checkdisplayOfGroupedColumns(
                                                                            column
                                                                        )
                                                                    ) {
                                                                        // If header is group header only render header value and not sort/filter/resize
                                                                        return (
                                                                            <div
                                                                                {...column.getHeaderProps(
                                                                                    isColumnPinnedLeft
                                                                                        ? {
                                                                                              style: {
                                                                                                  left: getLeftOfColumn(
                                                                                                      gridRef,
                                                                                                      headerIndex,
                                                                                                      false,
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
                                                                                }  ${
                                                                                    isColumnPinnedLeft &&
                                                                                    isLastPinnedColumn(
                                                                                        gridRef,
                                                                                        headerIndex,
                                                                                        false,
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
                                                                                        ? "grid-group-header"
                                                                                        : "grid-header"
                                                                                }
                                                                            >
                                                                                <div
                                                                                    className="neo-grid__th-title"
                                                                                    data-testid="column-header-sort"
                                                                                    {...column.getSortByToggleProps()}
                                                                                >
                                                                                    {column.render(
                                                                                        "Header"
                                                                                    )}
                                                                                    {isGroupHeader ===
                                                                                    false ? (
                                                                                        <span>
                                                                                            {isSorted ? (
                                                                                                <i className="neo-grid__th-icon">
                                                                                                    <IconSort
                                                                                                        className={`ng-icon neo-grid__sort-desc ${
                                                                                                            isSortedDesc
                                                                                                                ? "is-active"
                                                                                                                : ""
                                                                                                        }`}
                                                                                                    />
                                                                                                    <IconSort
                                                                                                        className={`ng-icon neo-grid__sort-asc ${
                                                                                                            isSortedDesc
                                                                                                                ? ""
                                                                                                                : "is-active"
                                                                                                        }`}
                                                                                                    />
                                                                                                </i>
                                                                                            ) : (
                                                                                                ""
                                                                                            )}
                                                                                        </span>
                                                                                    ) : null}
                                                                                </div>
                                                                                {/* Don't render filter if header is group header or if column filter is disabled */}
                                                                                {/* If atleast 1 column filter is present, below div wrap has to be present, to maintain the alignment of header text in header cell */}
                                                                                {isGroupHeader ===
                                                                                    false &&
                                                                                columnFilter !==
                                                                                    false ? (
                                                                                    <div
                                                                                        className={`ng-txt-wrap ${
                                                                                            isFilterOpen
                                                                                                ? "ng-txt-wrap__open"
                                                                                                : ""
                                                                                        }`}
                                                                                    >
                                                                                        {/* column.canFilter - should be used to identify if column is filterable */}
                                                                                        {/* But bug of react-table will set canFilter to true (even if it is false) after doing a global search */}
                                                                                        {/* Hence checking if filter logic is present as a function for a column */}
                                                                                        {typeof filter ===
                                                                                        "function"
                                                                                            ? column.render(
                                                                                                  "Filter"
                                                                                              )
                                                                                            : null}
                                                                                    </div>
                                                                                ) : null}
                                                                                {isGroupHeader ===
                                                                                    false &&
                                                                                    canResize && (
                                                                                        <div
                                                                                            className="neo-grid__th-resizer"
                                                                                            {...column.getResizerProps()}
                                                                                        />
                                                                                    )}
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
                                    {rows && rows.length > 0 ? (
                                        <div
                                            {...getTableBodyProps()}
                                            className={`neo-grid__tbody ${
                                                gridHeader === false
                                                    ? "neo-grid__tbody--nohead"
                                                    : ""
                                            }`}
                                        >
                                            {isPaginationNeeded &&
                                            !isParentGrid ? (
                                                <InfiniteLoader
                                                    isItemLoaded={isItemLoaded}
                                                    itemCount={itemCount}
                                                    loadMoreItems={
                                                        loadMoreItems
                                                    }
                                                >
                                                    {({
                                                        onItemsRendered,
                                                        ref
                                                    }: Object): Object => (
                                                        <RowsList
                                                            gridRef={gridRef}
                                                            onItemsRendered={
                                                                onItemsRendered
                                                            }
                                                            infiniteLoaderRef={
                                                                ref
                                                            }
                                                            listRef={listRef}
                                                            height={height}
                                                            theme={theme}
                                                            rows={rows}
                                                            isAtleastOneColumnPinned={
                                                                isAtleastOneColumnPinned
                                                            }
                                                            idAttribute={
                                                                idAttribute
                                                            }
                                                            overScanCount={
                                                                overScanCount
                                                            }
                                                            prepareRow={
                                                                prepareRow
                                                            }
                                                            isParentGrid={
                                                                isParentGrid
                                                            }
                                                            multiRowSelection={
                                                                multiRowSelection
                                                            }
                                                            parentRowExpandable={
                                                                parentRowExpandable
                                                            }
                                                            isRowExpandEnabled={
                                                                isRowExpandEnabled
                                                            }
                                                            subComponentColumnns={
                                                                subComponentColumnns
                                                            }
                                                            subComponentAdditionalColumn={
                                                                subComponentAdditionalColumn
                                                            }
                                                            isSubComponentGrid={
                                                                isSubComponentGrid
                                                            }
                                                            rowsWithExpandedSubComponents={
                                                                rowsWithExpandedSubComponents
                                                            }
                                                            isParentRowSelected={
                                                                isParentRowSelected
                                                            }
                                                            isParentRowCollapsed={
                                                                isParentRowCollapsed
                                                            }
                                                            toggleParentRowSelection={
                                                                toggleParentRowSelection
                                                            }
                                                            toggleParentRow={
                                                                toggleParentRow
                                                            }
                                                            isParentRowOpen={
                                                                isParentRowOpen
                                                            }
                                                            isLoadMoreChildRowsRequiredForRow={
                                                                isLoadMoreChildRowsRequiredForRow
                                                            }
                                                            loadMoreChildData={
                                                                loadMoreChildData
                                                            }
                                                            parentColumn={
                                                                parentColumn
                                                            }
                                                            additionalColumn={
                                                                additionalColumn
                                                            }
                                                            getRowInfo={
                                                                getRowInfo
                                                            }
                                                            expandedParentRows={
                                                                expandedParentRows
                                                            }
                                                            reRenderListData={
                                                                reRenderListData
                                                            }
                                                            fixedRowHeight={
                                                                fixedRowHeight
                                                            }
                                                            isLoadMoreRequiredForNormalRow={
                                                                isLoadMoreRequiredForNormalRow
                                                            }
                                                            rowSelector={
                                                                rowSelector
                                                            }
                                                            rowActions={
                                                                rowActions
                                                            }
                                                            expandableColumn={
                                                                expandableColumn
                                                            }
                                                            isRowActionsColumnNeeded={
                                                                isRowActionsColumnNeeded
                                                            }
                                                            enablePinColumn={
                                                                enablePinColumn
                                                            }
                                                        />
                                                    )}
                                                </InfiniteLoader>
                                            ) : (
                                                <RowsList
                                                    gridRef={gridRef}
                                                    listRef={listRef}
                                                    height={height}
                                                    theme={theme}
                                                    rows={rows}
                                                    isAtleastOneColumnPinned={
                                                        isAtleastOneColumnPinned
                                                    }
                                                    idAttribute={idAttribute}
                                                    overScanCount={
                                                        overScanCount
                                                    }
                                                    prepareRow={prepareRow}
                                                    isParentGrid={isParentGrid}
                                                    multiRowSelection={
                                                        multiRowSelection
                                                    }
                                                    parentRowExpandable={
                                                        parentRowExpandable
                                                    }
                                                    isRowExpandEnabled={
                                                        isRowExpandEnabled
                                                    }
                                                    isParentRowSelected={
                                                        isParentRowSelected
                                                    }
                                                    isParentRowCollapsed={
                                                        isParentRowCollapsed
                                                    }
                                                    subComponentColumnns={
                                                        subComponentColumnns
                                                    }
                                                    subComponentAdditionalColumn={
                                                        subComponentAdditionalColumn
                                                    }
                                                    isSubComponentGrid={
                                                        isSubComponentGrid
                                                    }
                                                    rowsWithExpandedSubComponents={
                                                        rowsWithExpandedSubComponents
                                                    }
                                                    toggleParentRowSelection={
                                                        toggleParentRowSelection
                                                    }
                                                    toggleParentRow={
                                                        toggleParentRow
                                                    }
                                                    isParentRowOpen={
                                                        isParentRowOpen
                                                    }
                                                    isLoadMoreChildRowsRequiredForRow={
                                                        isLoadMoreChildRowsRequiredForRow
                                                    }
                                                    loadMoreChildData={
                                                        loadMoreChildData
                                                    }
                                                    parentColumn={parentColumn}
                                                    additionalColumn={
                                                        additionalColumn
                                                    }
                                                    getRowInfo={getRowInfo}
                                                    expandedParentRows={
                                                        expandedParentRows
                                                    }
                                                    reRenderListData={
                                                        reRenderListData
                                                    }
                                                    fixedRowHeight={
                                                        fixedRowHeight
                                                    }
                                                    isLoadMoreRequiredForNormalRow={
                                                        isLoadMoreRequiredForNormalRow
                                                    }
                                                    rowSelector={rowSelector}
                                                    rowActions={rowActions}
                                                    expandableColumn={
                                                        expandableColumn
                                                    }
                                                    isRowActionsColumnNeeded={
                                                        isRowActionsColumnNeeded
                                                    }
                                                    enablePinColumn={
                                                        enablePinColumn
                                                    }
                                                />
                                            )}
                                        </div>
                                    ) : (
                                        <h2
                                            data-testid="nodataerror"
                                            className="ng-error"
                                        >
                                            No Records Found
                                        </h2>
                                    )}
                                </div>
                            </Scrollbars>
                        )}
                    </AutoSizer>
                </div>
            </div>
        );
    }
    return null;
};
export default Customgrid;
