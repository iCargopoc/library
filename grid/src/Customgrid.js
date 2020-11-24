import React, {
    useCallback,
    useState,
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
import AutoSizer from "react-virtualized-auto-sizer";
import InfiniteLoader from "react-window-infinite-loader";
import PropTypes from "prop-types";
import RowSelector from "./Functions/RowSelector";
import DefaultColumnFilter from "./Functions/DefaultColumnFilter";
import GlobalFilter from "./Functions/GlobalFilter";
import RowOptions from "./Functions/RowOptions";
import RowsList from "./Functions/RowsList";
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
    IconRefresh
} from "./Utilities/SvgUtilities";
import {
    findSelectedRows,
    findSelectedRowIdAttributes,
    findSelectedRowIdFromIdAttribute,
    findDeSelectedRows,
    updatedActionsHeaderClass,
    convertToIndividualColumns,
    checkdisplayOfGroupedColumns,
    checkIfGroupsortIsApplicable
} from "./Utilities/GridUtilities";

const listRef = createRef(null);

const Customgrid = (props) => {
    const {
        isDesktop,
        theme,
        title,
        gridHeight,
        managableColumns,
        expandedRowData,
        parentColumn,
        parentIdAttribute,
        loadChildData,
        gridData,
        rowsToOverscan,
        idAttribute,
        isPaginationNeeded,
        totalRecordsCount,
        searchColumn,
        onRowSelect,
        getRowInfo,
        calculateRowHeight,
        expandableColumn,
        rowActions,
        hasNextPage,
        isNextPageLoading,
        loadNextPage,
        serverSideSorting,
        getSortedData,
        CustomPanel,
        multiRowSelection,
        gridHeader,
        rowSelector,
        globalSearch,
        columnFilter,
        groupSort,
        columnChooser,
        exportData,
        fileName,
        onGridRefresh,
        rowsToSelect,
        rowsToDeselect
    } = props;

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

    // Variables used for handling infinite loading
    const itemCount = hasNextPage ? gridData.length + 1 : gridData.length;
    const loadMoreItems = isNextPageLoading
        ? () => {}
        : loadNextPage || (() => {});
    const isItemLoaded = (index) => !hasNextPage || index < gridData.length;

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
    const applyGroupSort = (sortOptions) => {
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
    const updateColumnStructure = (updatedColumns, updatedAdditionalColumn) => {
        setGridColumns([...updatedColumns]);
        setAdditionalColumn(updatedAdditionalColumn);
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
        () => ({
            Filter: DefaultColumnFilter
        }),
        []
    );

    // Local state value for storing user expanded/collapsed row Id and expanded state
    const [userExpandedRowDetails, setUserExpandedRowDetails] = useState(null);

    // Update state value with the row id on which user has clicked the expand/collpase functionality
    const setExpandedRowDetails = (rowId, isRowExpanded) => {
        if (rowId) {
            setUserExpandedRowDetails({
                id: rowId,
                isExpanded: isRowExpanded
            });
        }
    };

    const [expandedParentRows, setExpandedParentRows] = useState([]);

    // Global Search Filter Logic - React table wants all parameters passed into useTable function to be memoized
    const globalFilterLogic = useCallback(
        (rowsToFilter, columnsToFilter, filterValue) => {
            // convert user searched text to lower case
            const searchText = filterValue ? filterValue.toLowerCase() : "";
            // Loop through all rows
            return rowsToFilter.filter((row) => {
                // Find original data value of each row
                const { original } = row;
                // Return value of the filter method
                let returnValue = false;
                // Loop through all column values for each row
                convertToIndividualColumns([...managableColumns]).forEach(
                    (column) => {
                        // Do search for each column
                        returnValue =
                            returnValue ||
                            searchColumn(column, original, searchText);
                    }
                );
                return returnValue;
            });
        },
        [managableColumns]
    );

    const isRowExpandEnabled = !!(
        expandedRowData &&
        Object.keys(expandedRowData).length > 0 &&
        expandedRowData.display === true &&
        expandedRowData.Cell &&
        typeof expandedRowData.Cell === "function"
    );
    const columns = useMemo(() => gridColumns);
    const data =
        serverSideSorting && typeof serverSideSorting === "function"
            ? useMemo(() => [...gridData])
            : useMemo(() => getSortedData([...gridData], groupSortOptions));

    // Initialize react-table instance with the values received through properties
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
        preFilteredRows,
        state: { globalFilter, selectedRowIds, filters, sortBy },
        setGlobalFilter,
        toggleRowSelected,
        toggleAllRowsSelected
    } = useTable(
        {
            columns,
            data,
            defaultColumn,
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
        (hooks) => {
            // Add checkbox for all rows in grid, with different properties for header row and body rows, only if required
            if (rowSelector !== false) {
                hooks.allColumns.push((hookColumns) => [
                    {
                        id: "selection",
                        columnId: "column_custom_0",
                        disableResizing: true,
                        disableFilters: true,
                        disableSortBy: true,
                        display: true,
                        isGroupHeader: false,
                        minWidth: 35,
                        width: 35,
                        maxWidth: 35,
                        Header: (headerSelectProps) => {
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
                                        onClick: (event) => {
                                            // Set state value to identify if checkbox has been selected or deselected
                                            const selectedType =
                                                event &&
                                                event.currentTarget &&
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
                        Cell: (cellSelectProps) => {
                            const { row } = cellSelectProps;
                            // Check if row selector is required for this row using the getRowInfo prop passed
                            let isRowSelectable = true;
                            if (
                                getRowInfo &&
                                typeof getRowInfo === "function"
                            ) {
                                const rowInfo = getRowInfo(row.original);
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
                                            onClick: (event) => {
                                                // Set state value to identify if checkbox has been selected or deselected
                                                const selectedType =
                                                    event &&
                                                    event.currentTarget &&
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
            const isRowActionsAvailable = !!(
                rowActions && typeof rowActions === "function"
            ); // If row actions are available
            const isRowExpandAvailable = isRowExpandEnabled || expandableColumn; // If row expand option is available
            if (isRowActionsAvailable || isRowExpandAvailable) {
                hooks.allColumns.push((hookColumns) => [
                    ...hookColumns,
                    {
                        id: "custom",
                        columnId: "column_custom_1",
                        disableResizing: true,
                        disableFilters: true,
                        disableSortBy: true,
                        display: true,
                        isGroupHeader: false,
                        minWidth: 35,
                        width: 35,
                        maxWidth: 35,
                        Cell: (cellCustomProps) => {
                            const { row } = cellCustomProps;
                            // Check if expand icon is required for this row using the getRowInfo prop passed
                            let isRowExpandable = true;
                            if (
                                getRowInfo &&
                                typeof getRowInfo === "function"
                            ) {
                                const rowInfo = getRowInfo(row.original);
                                if (
                                    rowInfo &&
                                    rowInfo.isRowExpandable === false
                                ) {
                                    isRowExpandable = false;
                                }
                            }
                            return (
                                <div className="action">
                                    {isRowActionsAvailable ? (
                                        <RowOptions
                                            row={row}
                                            rowActions={rowActions}
                                        />
                                    ) : null}
                                    {isRowExpandAvailable && isRowExpandable ? (
                                        <span
                                            className="expander"
                                            data-testid="rowExpanderIcon"
                                            {...row.getToggleRowExpandedProps({
                                                onClick: () => {
                                                    // Update local state value to identify row expand and rerender the row
                                                    setExpandedRowDetails(
                                                        row.id,
                                                        row.isExpanded
                                                    );
                                                    row.toggleRowExpanded();
                                                }
                                            })}
                                        >
                                            <i>
                                                <IconAngle
                                                    className={
                                                        row.isExpanded
                                                            ? "icon-arrow-up"
                                                            : "icon-arrow-down"
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

    // Finds the rows selected by users from selectedRowIds and updates the state value and triggers the callback function.
    // Also identify if checkbox is checked or unchecked and if unchecked, return runchecked row details too to the callback function.
    // This is used in useeffects for row selection and row deselection
    const updateSelectedRows = (rowsInGrid, selectedRowIdsInGrid) => {
        if (idAttribute) {
            const rowsSelectedByUser = findSelectedRows(
                rowsInGrid,
                selectedRowIdsInGrid
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

    const loadMoreChildData = (row) => {
        if (parentIdAttribute && typeof loadChildData === "function") {
            const { original } = row;
            if (original) {
                const rowParentIdAttribute = original[parentIdAttribute];
                if (
                    rowParentIdAttribute !== null &&
                    rowParentIdAttribute !== undefined
                ) {
                    loadChildData(rowParentIdAttribute);
                }
            }
        }
    };

    // Recalculate row height from index 50 less than the last rendered item index in the list
    const reRenderListData = (index, isForced) => {
        const numIndex = Number(index);
        let indexToReset = numIndex && numIndex >= 0 ? numIndex : 0;
        if (listRef && listRef.current) {
            const { current } = listRef;
            if (current) {
                if (isForced) {
                    current.resetAfterIndex(indexToReset, true);
                } else {
                    const { _instanceProps } = current;
                    if (_instanceProps && indexToReset === 0) {
                        const expectedItemsCount = overScanCount + 30;
                        const { lastMeasuredIndex } = _instanceProps;
                        if (lastMeasuredIndex > expectedItemsCount) {
                            indexToReset =
                                lastMeasuredIndex - expectedItemsCount;
                        }
                    }
                    current.resetAfterIndex(indexToReset, true);
                }
            }
        }
    };

    const toggleParentRow = (row) => {
        if (parentIdAttribute) {
            const { original, index } = row;
            if (original) {
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
                                (item) => item !== rowParentIdAttribute
                            )
                        );
                    } else {
                        setExpandedParentRows([
                            ...expandedParentRows,
                            rowParentIdAttribute
                        ]);
                    }

                    // Check if child rows are present for parent row
                    const childRow = rows.find((currentRow) => {
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
                        reRenderListData(index, true);
                    }
                }
            }
        }
    };

    // Make checkbox in header title selected if no: selected rows and total rows are same
    const isAllRowsSelected = () => {
        return (
            rows &&
            rows.length > 0 &&
            userSelectedRowIdentifiers &&
            userSelectedRowIdentifiers.length > 0 &&
            rows.length === userSelectedRowIdentifiers.length
        );
    };

    // Call method to select/de-select all rows based on the checkbox checked value
    const toggleAllRowsSelection = (event) => {
        if (event) {
            const { currentTarget } = event;
            if (currentTarget) {
                const { checked } = currentTarget;
                toggleAllRowsSelected(checked);
            }
        }
    };

    // Add class to last table column header (for actions) if table body is having scroll
    useEffect(() => {
        updatedActionsHeaderClass(isDesktop);
    });

    // Rerender list to calculate row height after doing column sort/filter and global search
    useEffect(() => {
        reRenderListData();
    }, [globalFilter, filters, sortBy]);

    // Update state, when user is updating columns configuration from outside Grid
    // Recalculate the row height from index 0 as columns config has been changed
    useEffect(() => {
        setGridColumns(managableColumns);
        reRenderListData();
    }, [managableColumns]);

    // Update state, when user is updating additional column configuration from outside Grid
    // Recalculate the row height from index 0 as additional columns config has been changed
    useEffect(() => {
        setAdditionalColumn(expandedRowData);
        reRenderListData();
    }, [expandedRowData]);

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
                (row) => !rowsToBeDeselected.includes(row)
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
                rowsToBeSelected.forEach((rowId) => {
                    const rowToSelect = preFilteredRows.find((row) => {
                        const { original } = row;
                        return original[idAttribute] === rowId;
                    });
                    if (rowToSelect) {
                        const { id } = rowToSelect;
                        toggleRowSelected(id, true);
                        updatedSelectedRowIds.push(id);
                    }
                });
            }
            if (rowsToBeDeselected && rowsToBeDeselected.length > 0) {
                rowsToBeDeselected.forEach((rowId) => {
                    const rowToDeselect = preFilteredRows.find((row) => {
                        const { original } = row;
                        return original[idAttribute] === rowId;
                    });
                    if (rowToDeselect) {
                        const { id } = rowToDeselect;
                        toggleRowSelected(id, false);
                    }
                });
            }
            // Loop through already selected rows and find row id that are not selected yet and update it to false
            Object.entries(selectedRowIds).forEach((objEntry) => {
                if (objEntry && objEntry.length > 0) {
                    const rowId = objEntry[0];
                    if (!updatedSelectedRowIds.includes(rowId)) {
                        toggleRowSelected(rowId, false);
                    }
                }
            });
        }
    }, [rowsToSelect, rowsToDeselect, gridData, groupSortOptions]);

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
                    rowIdToDeSelect &&
                    selectedRowKey &&
                    selectedRowKey.length > 1
                ) {
                    // Disable that existing row
                    const currentSelection = selectedRowKey.find(
                        (key) => key !== rowIdToDeSelect
                    );
                    if (rowIdToDeSelect && currentSelection) {
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

    // Recalculate the row height from expanded/collapsed row index
    useEffect(() => {
        if (userExpandedRowDetails) {
            const { id } = userExpandedRowDetails;
            if (id) {
                reRenderListData(id);
            }
        }
    }, [userExpandedRowDetails]);

    // Recalculate the row height from index 0 as data has been changed or group sort is applied
    useEffect(() => {
        reRenderListData();
    }, [gridData, groupSortOptions]);

    // Check if parent id attribute is present in the list of opened parent attributes.
    const isParentRowExpanded = (childRow) => {
        let isParentExpanded = true;
        if (childRow && parentIdAttribute) {
            const { original } = childRow;
            if (original) {
                const { isParent } = original;
                const rowParentIdAttribute = original[parentIdAttribute];
                if (
                    isParent !== true &&
                    rowParentIdAttribute !== null &&
                    rowParentIdAttribute !== undefined &&
                    !expandedParentRows.includes(rowParentIdAttribute)
                ) {
                    isParentExpanded = false;
                }
            }
        }
        return isParentExpanded;
    };

    const isParentRowsSelected = (row) => {
        if (row && parentIdAttribute && idAttribute) {
            const { original } = row;
            if (original) {
                const { isParent } = original;
                if (isParent === true) {
                    const rowParentIdAttribute = original[parentIdAttribute];
                    if (
                        rowParentIdAttribute !== null &&
                        rowParentIdAttribute !== undefined
                    ) {
                        const childRowsOfParent = preFilteredRows.filter(
                            (gridRow) => {
                                if (gridRow && gridRow.original) {
                                    const gridRowOriginal = gridRow.original;
                                    if (gridRowOriginal.isParent !== true) {
                                        return (
                                            gridRowOriginal[
                                                parentIdAttribute
                                            ] === rowParentIdAttribute
                                        );
                                    }
                                }
                                return false;
                            }
                        );
                        if (childRowsOfParent && childRowsOfParent.length > 0) {
                            let isAllChildrenSelected = true;
                            childRowsOfParent.forEach((childRow) => {
                                if (childRow && childRow.original) {
                                    const childRowIdAttr =
                                        childRow.original[idAttribute];
                                    if (
                                        childRowIdAttr !== null &&
                                        childRowIdAttr !== undefined &&
                                        !userSelectedRowIdentifiers.includes(
                                            childRowIdAttr
                                        )
                                    ) {
                                        isAllChildrenSelected = false;
                                    }
                                }
                            });
                            return isAllChildrenSelected;
                        }
                    }
                }
            }
        }
        return false;
    };

    const toggleParentRowSelection = (event, row) => {
        let selectionType = true;
        if (event) {
            const { currentTarget } = event;
            if (currentTarget) {
                const { checked } = currentTarget;
                if (checked === false) {
                    selectionType = false;
                }
            }
        }
        if (row && parentIdAttribute && idAttribute) {
            const { original } = row;
            if (original) {
                const { isParent } = original;
                if (isParent === true) {
                    const rowParentIdAttribute = original[parentIdAttribute];
                    if (
                        rowParentIdAttribute !== null &&
                        rowParentIdAttribute !== undefined
                    ) {
                        preFilteredRows.forEach((gridRow) => {
                            if (gridRow && gridRow.original) {
                                const gridRowOriginal = gridRow.original;
                                if (gridRowOriginal.isParent !== true) {
                                    if (
                                        gridRowOriginal[parentIdAttribute] ===
                                        rowParentIdAttribute
                                    ) {
                                        const { id } = gridRow;
                                        toggleRowSelected(id, selectionType);
                                        setIsRowSelectionCallbackNeeded(
                                            selectionType
                                                ? "select"
                                                : "deselect"
                                        );
                                    }
                                }
                            }
                        });
                    }
                }
            }
        }
    };

    // Render each row and cells in each row, using attributes from react window list.
    const RenderRow = useCallback(
        ({ index, style }) => {
            if (rows && rows.length > 0 && index >= 0) {
                // if (isItemLoaded(index)) - This check never became false during testing. Hence avoiding it to reach 100% code coverage in JEST test.
                const row = rows[index];
                prepareRow(row);

                if (row) {
                    const { original } = row;
                    if (original) {
                        const { isParent } = original;
                        if (isParent === true) {
                            return (
                                <div {...row.getRowProps({ style })}>
                                    <div className="form-check">
                                        <input
                                            type="checkbox"
                                            data-testid="rowSelector-parentRow"
                                            className="form-check-input custom-checkbox form-check-input"
                                            checked={isParentRowsSelected(row)}
                                            onChange={(event) =>
                                                toggleParentRowSelection(
                                                    event,
                                                    row
                                                )
                                            }
                                        />
                                    </div>
                                    <div style={{ width: "100%" }}>
                                        {parentColumn.displayCell(original)}
                                    </div>
                                    <p
                                        role="presentation"
                                        style={{
                                            color: "red",
                                            cursor: "pointer"
                                        }}
                                        onClick={() => toggleParentRow(row)}
                                    >
                                        Expand
                                    </p>
                                </div>
                            );
                        }

                        // Add classname passed by developer from getRowInfo prop to required rows
                        let rowClassName = "";
                        if (getRowInfo && typeof getRowInfo === "function") {
                            const rowInfo = getRowInfo(original);
                            if (rowInfo && rowInfo.className) {
                                rowClassName = rowInfo.className;
                            }
                        }

                        // Check if this row is the last child element of parent, to display the 'Load More' button
                        let isLastChild = index === rows.length - 1;
                        const nextRow = rows[index + 1];
                        if (nextRow) {
                            isLastChild =
                                nextRow &&
                                nextRow.original &&
                                nextRow.original.isParent === true;
                        }

                        // Check if parent row is expanded or not. If not expanded, do not render its child rows
                        if (!isParentRowExpanded(row)) {
                            return null;
                        }

                        return (
                            <div
                                {...row.getRowProps({ style })}
                                className={`table-row tr ${rowClassName}`}
                            >
                                <div
                                    className={`table-row-wrap ${
                                        isRowExpandEnabled && row.isExpanded
                                            ? "table-row-wrap-expand"
                                            : ""
                                    }`}
                                >
                                    {row.cells.map((cell) => {
                                        if (cell.column.display === true) {
                                            return (
                                                <div
                                                    {...cell.getCellProps()}
                                                    className="table-cell td"
                                                >
                                                    {cell.render("Cell")}
                                                </div>
                                            );
                                        }
                                        return null;
                                    })}
                                </div>
                                {/* Check if row eapand icon is clicked, and if yes, call function to bind content to the expanded region */}
                                {isRowExpandEnabled && row.isExpanded ? (
                                    <div
                                        className="expand"
                                        data-testid="rowExpandedRegion"
                                    >
                                        {additionalColumn.Cell(
                                            row,
                                            additionalColumn
                                        )}
                                    </div>
                                ) : null}
                                {isLastChild ? (
                                    <div className="expand">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                loadMoreChildData(row)
                                            }
                                        >
                                            Load more
                                        </button>
                                    </div>
                                ) : null}
                            </div>
                        );
                    }
                }
            }
            return null;
        },
        [rows, additionalColumn, expandedParentRows]
    );

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
            <div className="table-wrapper">
                <div
                    className={`neo-grid-header ${
                        gridHeader === false ? "neo-table__noBorder" : ""
                    }`}
                >
                    <div className="neo-grid-header__results">
                        {gridHeader === false && multiRowSelection !== false ? (
                            <div className="form-check">
                                <input
                                    type="checkbox"
                                    data-testid="rowSelector-allRows-fromHeaderTitle"
                                    className="form-check-input custom-checkbox form-check-input"
                                    checked={isAllRowsSelected()}
                                    onChange={toggleAllRowsSelection}
                                />
                            </div>
                        ) : null}
                        <strong>
                            {totalRecordsCount > 0 &&
                            rows.length === gridData.length
                                ? totalRecordsCount
                                : rows.length}
                        </strong>
                        <span>{title || "Rows"}</span>
                    </div>
                    {CustomPanel ? (
                        <div className="neo-grid-header__customPanel">
                            <CustomPanel />
                        </div>
                    ) : null}
                    <div className="neo-grid-header__utilities">
                        {globalSearch !== false ? (
                            <GlobalFilter
                                globalFilter={globalFilter}
                                setGlobalFilter={setGlobalFilter}
                            />
                        ) : null}
                        {gridHeader !== false && columnFilter !== false ? (
                            <div className="utilities-icon-container keyword-search-container">
                                <div
                                    className="utilities-icon keyword-search"
                                    role="presentation"
                                    data-testid="toggleColumnFilter"
                                    onClick={toggleColumnFilter}
                                >
                                    <i>
                                        <IconFilter />
                                    </i>
                                </div>
                            </div>
                        ) : null}
                        {isGroupSortNeeded !== false && groupSort !== false ? (
                            <div className="utilities-icon-container group-sort-container">
                                <div
                                    className="utilities-icon group-sort"
                                    role="presentation"
                                    data-testid="toggleGroupSortOverLay"
                                    onClick={toggleGroupSortOverLay}
                                >
                                    <i>
                                        <IconGroupSort />
                                    </i>
                                </div>
                                {isGroupSortOverLayOpen ? (
                                    <GroupSort
                                        toggleGroupSortOverLay={
                                            toggleGroupSortOverLay
                                        }
                                        groupSortOptions={groupSortOptions}
                                        gridColumns={managableColumns}
                                        applyGroupSort={applyGroupSort}
                                    />
                                ) : null}
                            </div>
                        ) : null}
                        {columnChooser !== false ? (
                            <div className="utilities-icon-container manage-columns-container">
                                <div
                                    className="utilities-icon manage-columns"
                                    role="presentation"
                                    data-testid="toggleManageColumnsOverlay"
                                    onClick={toggleManageColumnsOverlay}
                                >
                                    <i>
                                        <IconColumns />
                                    </i>
                                </div>
                                {isManageColumnOverlayOpen ? (
                                    <ColumnReordering
                                        toggleManageColumnsOverlay={
                                            toggleManageColumnsOverlay
                                        }
                                        columns={gridColumns}
                                        additionalColumn={additionalColumn}
                                        updateColumnStructure={
                                            updateColumnStructure
                                        }
                                    />
                                ) : null}
                            </div>
                        ) : null}
                        {exportData !== false ? (
                            <div className="utilities-icon-container manage-columns-container">
                                <div
                                    className="utilities-icon export-data"
                                    role="presentation"
                                    data-testid="toggleExportDataOverlay"
                                    onClick={toggleExportDataOverlay}
                                >
                                    <i>
                                        <IconShare />
                                    </i>
                                </div>
                                {isExportOverlayOpen ? (
                                    <ExportData
                                        toggleExportDataOverlay={
                                            toggleExportDataOverlay
                                        }
                                        rows={rows}
                                        columns={gridColumns}
                                        additionalColumn={additionalColumn}
                                        fileName={fileName}
                                    />
                                ) : null}
                            </div>
                        ) : null}
                        {typeof onGridRefresh === "function" ? (
                            <div className="utilities-icon-container refresh-data-container">
                                <div
                                    className="utilities-icon refresh-data"
                                    role="presentation"
                                    data-testid="refreshGrid"
                                    onClick={onGridRefresh}
                                >
                                    <i>
                                        <IconRefresh />
                                    </i>
                                </div>
                            </div>
                        ) : null}
                    </div>
                </div>

                <div
                    className="tableContainer table-outer neo-grid"
                    style={{
                        height: gridHeight || "50vh",
                        overflowX: "auto",
                        overflowY: "hidden"
                    }}
                >
                    <AutoSizer
                        disableWidth
                        className="tableContainer__AutoSizer"
                    >
                        {({ height }) => (
                            <div {...getTableProps()} className="table">
                                {gridHeader === false ? null : (
                                    <div className="thead table-row table-row--head">
                                        {headerGroups.map(
                                            (headerGroup, index) => {
                                                // If there are morthan 1 headerGroups, we consider 1st one as group header row
                                                const isGroupHeader =
                                                    headerGroups.length > 1
                                                        ? index === 0
                                                        : false;
                                                return (
                                                    <div
                                                        {...headerGroup.getHeaderGroupProps()}
                                                        className="tr"
                                                    >
                                                        {headerGroup.headers.map(
                                                            (column) => {
                                                                const {
                                                                    display,
                                                                    isSorted,
                                                                    isSortedDesc,
                                                                    filter,
                                                                    canResize
                                                                } = column;
                                                                if (
                                                                    checkdisplayOfGroupedColumns(
                                                                        column
                                                                    ) ||
                                                                    display ===
                                                                        true
                                                                ) {
                                                                    // If header is group header only render header value and not sort/filter/resize
                                                                    return (
                                                                        <div
                                                                            {...column.getHeaderProps()}
                                                                            className={`table-cell column-heading th ${
                                                                                isGroupHeader ===
                                                                                true
                                                                                    ? "group-column-heading"
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
                                                                                className="column-heading-title"
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
                                                                                            <i>
                                                                                                <IconSort
                                                                                                    className={
                                                                                                        isSortedDesc
                                                                                                            ? "sort-asc"
                                                                                                            : "sort-desc"
                                                                                                    }
                                                                                                />
                                                                                            </i>
                                                                                        ) : (
                                                                                            ""
                                                                                        )}
                                                                                    </span>
                                                                                ) : null}
                                                                            </div>
                                                                            {isGroupHeader ===
                                                                            false ? (
                                                                                <div
                                                                                    className={`txt-wrap column-filter ${
                                                                                        isFilterOpen
                                                                                            ? "open"
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
                                                                                        className="resizer"
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
                                        className={`tbody ${
                                            gridHeader === false
                                                ? "tbody-withoutHeading"
                                                : ""
                                        }`}
                                    >
                                        {isPaginationNeeded ? (
                                            <InfiniteLoader
                                                isItemLoaded={isItemLoaded}
                                                itemCount={itemCount}
                                                loadMoreItems={loadMoreItems}
                                            >
                                                {({ onItemsRendered, ref }) => (
                                                    <RowsList
                                                        onItemsRendered={
                                                            onItemsRendered
                                                        }
                                                        infiniteLoaderRef={ref}
                                                        listRef={listRef}
                                                        height={height}
                                                        isParentRowExpanded={
                                                            isParentRowExpanded
                                                        }
                                                        calculateRowHeight={
                                                            calculateRowHeight
                                                        }
                                                        rows={rows}
                                                        headerGroups={
                                                            headerGroups
                                                        }
                                                        theme={theme}
                                                        overScanCount={
                                                            overScanCount
                                                        }
                                                        RenderRow={RenderRow}
                                                    />
                                                )}
                                            </InfiniteLoader>
                                        ) : (
                                            <RowsList
                                                listRef={listRef}
                                                height={height}
                                                isParentRowExpanded={
                                                    isParentRowExpanded
                                                }
                                                calculateRowHeight={
                                                    calculateRowHeight
                                                }
                                                rows={rows}
                                                headerGroups={headerGroups}
                                                theme={theme}
                                                overScanCount={overScanCount}
                                                RenderRow={RenderRow}
                                            />
                                        )}
                                    </div>
                                ) : (
                                    <h2 className="error">No Records Found</h2>
                                )}
                            </div>
                        )}
                    </AutoSizer>
                </div>
            </div>
        );
    }
    return null;
};

Customgrid.propTypes = {
    isDesktop: PropTypes.bool,
    theme: PropTypes.string,
    title: PropTypes.string,
    gridHeight: PropTypes.string,
    managableColumns: PropTypes.arrayOf(PropTypes.object),
    parentColumn: PropTypes.object,
    parentIdAttribute: PropTypes.string,
    loadChildData: PropTypes.func,
    gridData: PropTypes.arrayOf(PropTypes.object),
    rowsToOverscan: PropTypes.number,
    idAttribute: PropTypes.string,
    isPaginationNeeded: PropTypes.bool,
    totalRecordsCount: PropTypes.number,
    searchColumn: PropTypes.func,
    onRowSelect: PropTypes.func,
    getRowInfo: PropTypes.func,
    calculateRowHeight: PropTypes.func,
    expandableColumn: PropTypes.bool,
    isExpandContentAvailable: PropTypes.bool,
    hasNextPage: PropTypes.bool,
    isNextPageLoading: PropTypes.bool,
    loadNextPage: PropTypes.func,
    serverSideSorting: PropTypes.func,
    getSortedData: PropTypes.func,
    getToggleAllRowsSelectedProps: PropTypes.func,
    row: PropTypes.arrayOf(PropTypes.object),
    expandedRowData: PropTypes.object,
    rowActions: PropTypes.any,
    CustomPanel: PropTypes.any,
    multiRowSelection: PropTypes.bool,
    gridHeader: PropTypes.bool,
    rowSelector: PropTypes.bool,
    globalSearch: PropTypes.bool,
    columnFilter: PropTypes.bool,
    groupSort: PropTypes.bool,
    columnChooser: PropTypes.bool,
    exportData: PropTypes.bool,
    fileName: PropTypes.string,
    onGridRefresh: PropTypes.func,
    rowsToSelect: PropTypes.array,
    rowsToDeselect: PropTypes.array
};

export default Customgrid;
