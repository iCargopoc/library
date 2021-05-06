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
import RowOptions from "./Functions/RowOptions";
import ColumnHeaders from "./Common/ColumnHeaders";
import GridHeader from "./Common/GridHeader";
import PinnedRowsList from "./List/PinnedRowsList";
import RowsList from "./List/RowsList";
import { IconAngle, IconExpand, IconCollapse } from "./Utilities/SvgUtilities";
import {
    getParentRowsFromList,
    getChildRowsFromParentId,
    setColumnWidths,
    isRowSelectionDisabled,
    isRowExpandDisabled,
    findSelectedRows,
    findSelectedRowIdAttributes,
    findSelectedRowIdFromIdAttribute,
    findDeSelectedRows,
    getSelectedAndDeselectedSubCompRows,
    hideColumns,
    extractGridDataFromRows
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
    subComponentIdAttribute: string,
    onSubComponentRowSelect: Function,
    subComponentHeader: boolean,
    loadChildData: Function,
    isParentGrid: boolean,
    gridData: Array<Object>,
    estimatedRowHeight: number,
    rowsToOverscan: number,
    idAttribute: string,
    pageInfo: Object,
    paginationType: string,
    totalRecordsCount: number,
    onRowSelect: Function,
    onSearch: Function,
    getRowInfo: Function,
    expandableColumn: boolean,
    isExpandContentAvailable?: boolean,
    isNextPageLoading: boolean,
    loadNextPage: Function,
    serverSideSorting: Function,
    serverSideExporting: Function,
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
    rowsToPin: Array<Object>,
    rowsToDeselect: Array<Object>,
    fixedRowHeight: boolean,
    pdfPaperSize: string,
    enablePinColumn: boolean,
    enablePinRow: boolean,
    shouldDisplayLoader: boolean,
    setShouldDisplayLoader: Function
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
        subComponentIdAttribute,
        onSubComponentRowSelect,
        subComponentHeader,
        loadChildData,
        isParentGrid,
        gridData,
        estimatedRowHeight,
        rowsToOverscan,
        idAttribute,
        pageInfo,
        paginationType,
        totalRecordsCount,
        onRowSelect,
        onSearch,
        getRowInfo,
        expandableColumn,
        rowActions,
        isNextPageLoading,
        loadNextPage,
        serverSideSorting,
        serverSideExporting,
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
        rowsToPin,
        rowsToDeselect,
        fixedRowHeight,
        enablePinColumn,
        enablePinRow,
        shouldDisplayLoader,
        setShouldDisplayLoader
    } = props;

    const listRef = createRef();
    const scrollRef = useRef();
    const resetRef = useRef();

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
    const [subComponentColumns, setSubComponentColumns] = useState([]);

    // Local ref value for holding whether grid has sub component structure
    const isSubComponentGrid = useRef(false);

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

    // Local state value for storing user selected sub component rows corresponding to each main row- identifier values (idAttribute)
    const [
        userSelectedSubCompRowIdentifiers,
        setUserSelectedSubCompRowIdentifiers
    ] = useState([]);

    // Local ref value for storing user selected rows - identifier values (idAttribute)
    const userSelectedRowIdentifiers = useRef([]);

    // Local state to identify if row selection call back has to be given or not
    const [
        isRowSelectionCallbackNeeded,
        setIsRowSelectionCallbackNeeded
    ] = useState(null);

    // Local state to store expanded parent rows
    const [expandedParentRows, setExpandedParentRows] = useState([]);

    // Local state value for checking if column filter is open/closed
    const [isFilterOpen, setFilterOpen] = useState(false);
    // Toggle column filter state value based on UI clicks
    const toggleColumnFilter = () => {
        setFilterOpen(!isFilterOpen);
    };

    // Local state for group sort options
    const [groupSortOptions, setGroupSortOptions] = useState([]);
    // Call apply group sort function from parent
    const applyGroupSort = (sortOptions: Object) => {
        setGroupSortOptions(sortOptions);
        if (serverSideSorting && typeof serverSideSorting === "function") {
            resetRef.current = true;
            if (scrollRef && scrollRef.current) {
                scrollRef.current.scrollTop(0);
            }
            setRowsWithExpandedSubComponents([]);
            setUserSelectedSubCompRowIdentifiers([]);
            userSelectedRowIdentifiers.current = [];
            setExpandedParentRows([]);
            serverSideSorting(sortOptions);
        }
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
        if (isSubComponentGrid.current) {
            setSubComponentColumns([
                ...setColumnWidths([...updatedSubComponentColumns])
            ]);
            setSubComponentAdditionalColumn(
                updatedSubComponentAdditionalColumn
            );
        }
    };

    // To hold row Ids of pinned rows
    const [userSelectedRowsToPin, setUserSelectedRowsToPin] = useState([]);
    // Check if a row Id is in pinned state or not
    const isRowPinned = (rowId: any): boolean => {
        return userSelectedRowsToPin.includes(rowId);
    };
    // Update pinned rows list
    const updatePinnedRows = (rowId: any) => {
        let updatedList = [...userSelectedRowsToPin];
        if (isRowPinned(rowId)) {
            updatedList = updatedList.filter(
                (item: any): boolean => item !== rowId
            );
        } else {
            updatedList.push(rowId);
        }
        setUserSelectedRowsToPin(updatedList);
    };

    // Local Ref value to identify if column/global filter has been applied, and give a call back
    const filterEventRef = useRef(false);

    const gridDataLength = gridData.length;

    // Variables and functions used for handling infinite loading
    const invalidPages = useRef([]);
    const pagesToReload = useRef([]);
    const currentPageNumber = useRef(-1);
    const currentEndCursor = useRef(-1);
    const isPaginationNeeded = pageInfo !== undefined && pageInfo !== null;
    const itemCount = gridDataLength + 1;
    const loadMoreItems = (): Object => {
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
        return isReloadRequired === false && !!gridData[index];
    };

    // Column filter added for all columns by default
    const defaultColumn = useMemo(
        (): Object => ({
            Filter: DefaultColumnFilter
        }),
        []
    );

    // Create a list of accessors to be searched from columns array
    let accessorList = [...columnsAccessorList, ...expandedRowDataAccessorList];

    // Append accessors if sub component is present
    if (subComponentColumnsAccessorList.length > 0) {
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
            if (isParentGrid) {
                let filteredRows = [];
                // Filter and group rows by parents
                const parentRows = getParentRowsFromList(rowsToFilter);
                parentRows.forEach((row: Object) => {
                    const { original } = row;
                    filteredRows.push(row);
                    const parentIdValue = original[parentIdAttribute];
                    const childRowsOfParent = getChildRowsFromParentId(
                        rowsToFilter,
                        parentIdValue,
                        parentIdAttribute
                    );
                    if (childRowsOfParent && childRowsOfParent.length > 0) {
                        const filteredChildRows = matchSorter(
                            childRowsOfParent,
                            filterValue,
                            {
                                keys: accessorList,
                                sorter: (rankedItems: Object): Object =>
                                    rankedItems // To avoid automatic sorting based on match
                            }
                        );
                        filteredRows = [...filteredRows, ...filteredChildRows];
                    }
                });
                return filteredRows;
            }
            // Do match-sorter and return results
            return matchSorter(rowsToFilter, filterValue, {
                keys: accessorList,
                sorter: (rankedItems: Object): Object => rankedItems // To avoid automatic sorting based on match
            });
        },
        [
            gridData,
            groupSortOptions,
            managableColumns,
            expandedRowData,
            managableSubComponentColumnns,
            managableSubComponentAdditionalColumn
        ]
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
        isRowActionsAvailable || isRowExpandAvailable || enablePinRow;

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
        totalColumnsWidth,
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
        allColumns,
        preFilteredRows,
        state: { globalFilter, filters, selectedRowIds },
        setGlobalFilter,
        toggleRowSelected,
        toggleAllRowsSelected
    } = useTable(
        {
            columns,
            data,
            defaultColumn,
            filterEventRef,
            isSubComponentGrid,
            enablePinColumn,
            isRowActionsAvailable,
            idAttribute,
            enablePinRow,
            updatePinnedRows,
            isRowPinned,
            isAtleastOneColumnPinned,
            isRowActionsColumnNeeded,
            rowsWithExpandedSubComponents,
            globalFilter: globalFilterLogic,
            autoResetFilters: resetRef.current,
            autoResetGlobalFilter: resetRef.current,
            autoResetSortBy: resetRef.current,
            autoResetExpanded: resetRef.current,
            autoResetSelectedRows: resetRef.current
        },
        useFilters,
        useGlobalFilter,
        useSortBy,
        useExpanded,
        useRowSelect,
        useFlexLayout,
        useResizeColumns,
        (hooks: Object): Object => {
            if (isSubComponentGrid.current) {
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
                            isAutoPinned: true,
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
                        isAutoPinned: true,
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
                            const { original } = row;
                            // Check if row selector is required for this row using the getRowInfo prop passed
                            if (
                                !isRowSelectionDisabled(
                                    getRowInfo,
                                    original,
                                    false
                                )
                            ) {
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
                hooks.allColumns.push(
                    (hookColumns: Object, instanceObj: Object): Object => [
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
                                const { instance } = instanceObj;
                                const enablePinRowObj = instance.enablePinRow;
                                const updatePinnedRowsObj =
                                    instance.updatePinnedRows;
                                const isRowActionsAvailableObj =
                                    instance.isRowActionsAvailable;
                                const idAttributeObj = instance.idAttribute;
                                const isRowPinnedObj = instance.isRowPinned;
                                const { row } = cellCustomProps;
                                const { original } = row;
                                return (
                                    <div className="ng-action">
                                        {isRowActionsAvailableObj ||
                                        enablePinRowObj === true ? (
                                            <RowOptions
                                                row={row}
                                                rowActions={rowActions}
                                                isRowActionsAvailable={
                                                    isRowActionsAvailableObj
                                                }
                                                idAttribute={idAttributeObj}
                                                enablePinRow={enablePinRowObj}
                                                updatePinnedRows={
                                                    updatePinnedRowsObj
                                                }
                                                isRowPinned={isRowPinnedObj}
                                                isSubComponentRow={false}
                                            />
                                        ) : null}
                                        {/* Also check if expand icon is required for this row using the getRowInfo prop passed */}
                                        {isRowExpandAvailable &&
                                        !isRowExpandDisabled(
                                            getRowInfo,
                                            original,
                                            false
                                        ) ? (
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
                    ]
                );
            }
        }
    );

    const updateSubCompRowIdentifiers = (
        mainRowId: any,
        subCompRowIdentifiers: any,
        subCompRowIds: any,
        selectionType: string
    ) => {
        let updatedUserSelectedSubCompRowIdentifiers =
            multiRowSelection === false
                ? []
                : [...userSelectedSubCompRowIdentifiers];
        const existingValue = updatedUserSelectedSubCompRowIdentifiers.find(
            (identifier: Object): boolean => {
                const { rowId } = identifier;
                return rowId === mainRowId;
            }
        );
        if (existingValue !== null && existingValue !== undefined) {
            updatedUserSelectedSubCompRowIdentifiers = updatedUserSelectedSubCompRowIdentifiers.map(
                (identifier: Object): Object => {
                    const updatedIdentifier = { ...identifier };
                    const { rowId } = identifier;
                    if (rowId === mainRowId) {
                        updatedIdentifier.rowIdentifiers = subCompRowIdentifiers;
                        updatedIdentifier.rowIds = subCompRowIds;
                    }
                    return updatedIdentifier;
                }
            );
        } else {
            updatedUserSelectedSubCompRowIdentifiers.push({
                rowId: mainRowId,
                rowIdentifiers: subCompRowIdentifiers,
                rowIds: subCompRowIds
            });
        }
        setUserSelectedSubCompRowIdentifiers(
            updatedUserSelectedSubCompRowIdentifiers
        );

        if (onSubComponentRowSelect) {
            const rowsToReturn = getSelectedAndDeselectedSubCompRows(
                preFilteredRows,
                getRowInfo,
                updatedUserSelectedSubCompRowIdentifiers,
                userSelectedSubCompRowIdentifiers,
                idAttribute,
                subComponentIdAttribute
            );
            const { selectedRows, deselectedRows } = rowsToReturn;
            onSubComponentRowSelect(
                selectedRows,
                selectionType === "deselect" ? deselectedRows : null
            );
        }
    };

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
            const oldUserSelectedRowIdentifiers = [
                ...userSelectedRowIdentifiers.current
            ];
            userSelectedRowIdentifiers.current = rowIdentifiers;
            if (onRowSelect && isRowSelectionCallbackNeeded !== null) {
                setIsRowSelectionCallbackNeeded(null);
                onRowSelect(
                    rowsSelectedByUser,
                    isRowSelectionCallbackNeeded === "deselect"
                        ? findDeSelectedRows(
                              preFilteredRows,
                              oldUserSelectedRowIdentifiers,
                              rowIdentifiers,
                              idAttribute
                          )
                        : null
                );
            }
        }
    };

    const findFirstOpenParentIndex = (): number => {
        let firstOpenParentIndex = -1;
        const parentRows = getParentRowsFromList(rows);
        parentRows.forEach((row: Object) => {
            if (firstOpenParentIndex === -1) {
                const { original, index } = row;
                const parentIdValue = original[parentIdAttribute];
                if (expandedParentRows.includes(parentIdValue)) {
                    firstOpenParentIndex = index;
                }
            }
        });
        return firstOpenParentIndex;
    };

    // Recalculate row height from index passed as parameter. If not passed 50 less than the last rendered item index in the list
    const reRenderListData = (index?: number): Object => {
        if (listRef) {
            const { current } = listRef;
            if (current) {
                let indexToReset = 0;
                if (index !== null && index !== undefined && index >= 0) {
                    indexToReset = index;
                } else if (isParentGrid) {
                    indexToReset = findFirstOpenParentIndex();
                } else {
                    const { _instanceProps } = current;
                    const expectedItemsCount = overScanCount + 30;
                    const { lastMeasuredIndex } = _instanceProps;
                    const difference = lastMeasuredIndex - expectedItemsCount;
                    indexToReset = difference >= 0 ? difference : 0;
                }
                current.resetAfterIndex(indexToReset, true);
            }
        }
    };

    const loadMoreChildData = (row: Object): Object => {
        const { original } = row;
        loadChildData(original);
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
            // Check if parent row is present in state.
            // If present, remove it and if not present add it.
            if (expandedParentRows.includes(rowParentIdAttribute)) {
                setExpandedParentRows(
                    expandedParentRows.filter(
                        (item: Object): Object => item !== rowParentIdAttribute
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
    };

    // Make checkbox in header title selected if no: selected rows and total rows are same
    const isAllRowsSelected = (): boolean => {
        const selectableRows = rows.filter((row: Object): boolean => {
            const { original } = row;
            return !isRowSelectionDisabled(getRowInfo, original, false);
        });
        return (
            selectableRows &&
            selectableRows.length > 0 &&
            userSelectedRowIdentifiers &&
            userSelectedRowIdentifiers.current &&
            userSelectedRowIdentifiers.current.length > 0 &&
            selectableRows.length === userSelectedRowIdentifiers.current.length
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
        setGridColumns(managableColumns);
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
            isSubComponentGrid.current = true;
            setSubComponentColumns(managableSubComponentColumnns);
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
                userSelectedRowIdentifiers.current.length > 0
                    ? [
                          ...userSelectedRowIdentifiers.current,
                          ...rowsToBeSelected
                      ]
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
                    const rowId = objEntry[0];
                    if (!updatedSelectedRowIds.includes(rowId)) {
                        toggleRowSelected(rowId, false);
                    }
                }
            );
        }
    }, [rowsToSelect, rowsToDeselect, gridData, groupSortOptions]);

    useEffect(() => {
        if (enablePinRow === true && rowsToPin && rowsToPin.length > 0) {
            setUserSelectedRowsToPin(rowsToPin);
        }
    }, [rowsToPin]);

    useEffect(() => {
        resetRef.current = false;
    }, [gridData, groupSortOptions]);

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
                    userSelectedRowIdentifiers.current
                );
                // If selectedRowIds length is 2, means user has selected a row when there is already a row selection made
                const selectedRowKey = Object.keys(selectedRowIds);
                if (
                    rowIdToDeSelect !== "" &&
                    selectedRowKey &&
                    selectedRowKey.length > 1
                ) {
                    // Disable that existing row
                    toggleRowSelected(rowIdToDeSelect, false);
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

    useEffect(() => {
        if (
            filterEventRef.current === true &&
            onSearch &&
            typeof onSearch === "function"
        ) {
            filterEventRef.current = false;
            onSearch(extractGridDataFromRows(rows));
        }
    }, [globalFilter, filters]);

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

                            if (
                                !isRowSelectionDisabled(
                                    getRowInfo,
                                    gridRowOriginal,
                                    false
                                ) &&
                                !userSelectedRowIdentifiers.current.includes(
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
            const rowParentIdAttribute = row.original[parentIdAttribute];
            preFilteredRows.forEach((gridRow: Object): Object => {
                const { original } = gridRow;
                const { isParent } = original;
                if (
                    isParent !== true &&
                    original[parentIdAttribute] === rowParentIdAttribute
                ) {
                    const { id } = gridRow;
                    setIsRowSelectionCallbackNeeded(
                        selectionType ? "select" : "deselect"
                    );
                    toggleRowSelected(id, selectionType);
                }
            });
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
                const { original } = nextRow;
                const { isParent } = original;
                isLoadMoreChildNeeded = isParent === true;
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
        const pinnedRows = rows.filter((row: Object): boolean => {
            const { original } = row;
            return userSelectedRowsToPin.includes(original[idAttribute]);
        });
        const unPinnedRows = rows.filter((row: Object): boolean => {
            const { original } = row;
            return !userSelectedRowsToPin.includes(original[idAttribute]);
        });

        // Render table and other components as required
        // Use properties and methods provided by react-table
        // Autosizer used for calculating grid height (don't consider window width and column resizing value changes)
        // Infinite loader used for lazy loading, with the properties passed here and other values calculated at the top
        // React window list is used for implementing virtualization, specifying the item count in a frame and height of each rows in it.
        return (
            <div className="neo-grid__wrapper">
                <GridHeader
                    gridHeader={gridHeader}
                    multiRowSelection={multiRowSelection}
                    rowSelector={rowSelector}
                    isAllRowsSelected={isAllRowsSelected}
                    toggleAllRowsSelection={toggleAllRowsSelection}
                    showTitle={showTitle}
                    totalRecordsCount={totalRecordsCount}
                    rows={rows}
                    gridDataLength={gridDataLength}
                    title={title}
                    CustomPanel={CustomPanel}
                    globalSearch={globalSearch}
                    globalFilter={globalFilter}
                    setGlobalFilter={setGlobalFilter}
                    filterEventRef={filterEventRef}
                    columnFilter={columnFilter}
                    toggleColumnFilter={toggleColumnFilter}
                    groupSort={groupSort}
                    groupSortOptions={groupSortOptions}
                    managableColumns={managableColumns}
                    managableSubComponentColumnns={
                        managableSubComponentColumnns
                    }
                    applyGroupSort={applyGroupSort}
                    columnChooser={columnChooser}
                    gridColumns={gridColumns}
                    additionalColumn={additionalColumn}
                    expandedRowData={expandedRowData}
                    isSubComponentGrid={isSubComponentGrid.current}
                    subComponentColumns={subComponentColumns}
                    subComponentAdditionalColumn={subComponentAdditionalColumn}
                    managableSubComponentAdditionalColumn={
                        managableSubComponentAdditionalColumn
                    }
                    updateColumnStructure={updateColumnStructure}
                    enablePinColumn={enablePinColumn}
                    exportData={exportData}
                    gridRef={gridRef}
                    isParentGrid={isParentGrid}
                    parentIdAttribute={parentIdAttribute}
                    parentColumn={parentColumn}
                    fileName={fileName}
                    pdfPaperSize={pdfPaperSize}
                    isDesktop={isDesktop}
                    onGridRefresh={onGridRefresh}
                    shouldDisplayLoader={shouldDisplayLoader}
                    setShouldDisplayLoader={setShouldDisplayLoader}
                    serverSideExporting={serverSideExporting}
                    paginationType={paginationType}
                />
                <div
                    className={`neo-grid__table ${
                        isParentGrid === true ? "neo-grid__table--parent" : ""
                    }`}
                >
                    <AutoSizer className="neo-grid__autosizer">
                        {({ height, width }: Object): Object => (
                            <Scrollbars
                                ref={scrollRef}
                                autoHeight
                                autoHeightMin={height}
                                autoHeightMax={height}
                                style={{
                                    width
                                }}
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
                                        <ColumnHeaders
                                            headerGroups={headerGroups}
                                            gridRef={gridRef}
                                            columnFilter={columnFilter}
                                            isFilterOpen={isFilterOpen}
                                        />
                                    )}
                                    {rows && rows.length > 0 ? (
                                        <div
                                            {...getTableBodyProps()}
                                            style={{
                                                width:
                                                    totalColumnsWidth > width
                                                        ? totalColumnsWidth
                                                        : width
                                            }}
                                            className={`neo-grid__tbody ${
                                                isParentGrid === true
                                                    ? "neo-grid__tbody--parent"
                                                    : ""
                                            } ${
                                                gridHeader === false
                                                    ? "neo-grid__tbody--nohead"
                                                    : ""
                                            }`}
                                        >
                                            {pinnedRows &&
                                            pinnedRows.length > 0 ? (
                                                <PinnedRowsList
                                                    gridRef={gridRef}
                                                    width={width}
                                                    theme={theme}
                                                    pinnedRows={pinnedRows}
                                                    prepareRow={prepareRow}
                                                    getRowInfo={getRowInfo}
                                                    isRowExpandEnabled={
                                                        isRowExpandEnabled
                                                    }
                                                    isAtleastOneColumnPinned={
                                                        isAtleastOneColumnPinned
                                                    }
                                                    additionalColumn={
                                                        additionalColumn
                                                    }
                                                    enablePinColumn={
                                                        enablePinColumn
                                                    }
                                                    isRowActionsColumnNeeded={
                                                        isRowActionsColumnNeeded
                                                    }
                                                    idAttribute={idAttribute}
                                                    isLoadMoreChildRowsRequiredForRow={
                                                        isLoadMoreChildRowsRequiredForRow
                                                    }
                                                    subComponentColumns={
                                                        subComponentColumns
                                                    }
                                                    subComponentAdditionalColumn={
                                                        subComponentAdditionalColumn
                                                    }
                                                    subComponentColumnsAccessorList={
                                                        subComponentColumnsAccessorList
                                                    }
                                                    subComponentAdditionalColumnAccessorList={
                                                        subComponentAdditionalColumnAccessorList
                                                    }
                                                    subComponentIdAttribute={
                                                        subComponentIdAttribute
                                                    }
                                                    userSelectedSubCompRowIdentifiers={
                                                        userSelectedSubCompRowIdentifiers
                                                    }
                                                    updateSubCompRowIdentifiers={
                                                        updateSubCompRowIdentifiers
                                                    }
                                                    isSubComponentGrid={
                                                        isSubComponentGrid.current
                                                    }
                                                    subComponentHeader={
                                                        subComponentHeader
                                                    }
                                                    rowsWithExpandedSubComponents={
                                                        rowsWithExpandedSubComponents
                                                    }
                                                    loadMoreChildData={
                                                        loadMoreChildData
                                                    }
                                                    isParentGrid={isParentGrid}
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
                                                    multiRowSelection={
                                                        multiRowSelection
                                                    }
                                                    gridGlobalFilterValue={
                                                        globalFilter
                                                    }
                                                />
                                            ) : null}
                                            {isPaginationNeeded &&
                                            !isParentGrid ? (
                                                <InfiniteLoader
                                                    isItemLoaded={isItemLoaded}
                                                    itemCount={itemCount}
                                                    threshold={overScanCount}
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
                                                            width={width}
                                                            theme={theme}
                                                            rows={unPinnedRows}
                                                            estimatedRowHeight={
                                                                estimatedRowHeight
                                                            }
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
                                                            subComponentColumns={
                                                                subComponentColumns
                                                            }
                                                            subComponentAdditionalColumn={
                                                                subComponentAdditionalColumn
                                                            }
                                                            subComponentColumnsAccessorList={
                                                                subComponentColumnsAccessorList
                                                            }
                                                            subComponentAdditionalColumnAccessorList={
                                                                subComponentAdditionalColumnAccessorList
                                                            }
                                                            subComponentIdAttribute={
                                                                subComponentIdAttribute
                                                            }
                                                            userSelectedSubCompRowIdentifiers={
                                                                userSelectedSubCompRowIdentifiers
                                                            }
                                                            updateSubCompRowIdentifiers={
                                                                updateSubCompRowIdentifiers
                                                            }
                                                            isSubComponentGrid={
                                                                isSubComponentGrid.current
                                                            }
                                                            subComponentHeader={
                                                                subComponentHeader
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
                                                            gridGlobalFilterValue={
                                                                globalFilter
                                                            }
                                                        />
                                                    )}
                                                </InfiniteLoader>
                                            ) : (
                                                <RowsList
                                                    gridRef={gridRef}
                                                    listRef={listRef}
                                                    height={height}
                                                    width={width}
                                                    theme={theme}
                                                    rows={unPinnedRows}
                                                    estimatedRowHeight={
                                                        estimatedRowHeight
                                                    }
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
                                                    subComponentColumns={
                                                        subComponentColumns
                                                    }
                                                    subComponentAdditionalColumn={
                                                        subComponentAdditionalColumn
                                                    }
                                                    subComponentColumnsAccessorList={
                                                        subComponentColumnsAccessorList
                                                    }
                                                    subComponentAdditionalColumnAccessorList={
                                                        subComponentAdditionalColumnAccessorList
                                                    }
                                                    isSubComponentGrid={
                                                        isSubComponentGrid.current
                                                    }
                                                    subComponentIdAttribute={
                                                        subComponentIdAttribute
                                                    }
                                                    userSelectedSubCompRowIdentifiers={
                                                        userSelectedSubCompRowIdentifiers
                                                    }
                                                    updateSubCompRowIdentifiers={
                                                        updateSubCompRowIdentifiers
                                                    }
                                                    subComponentHeader={
                                                        subComponentHeader
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
                                                    gridGlobalFilterValue={
                                                        globalFilter
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
