import React, {
    useCallback,
    useState,
    memo,
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
import { VariableSizeList as List } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import InfiniteLoader from "react-window-infinite-loader";
import PropTypes from "prop-types";
import RowSelector from "./Functions/RowSelector";
import DefaultColumnFilter from "./Functions/DefaultColumnFilter";
import GlobalFilter from "./Functions/GlobalFilter";
import RowOptions from "./Functions/RowOptions";
import RowEditOverlay from "./Functions/RowEditOverlay";
import RowDeleteOverLay from "./Functions/RowDeleteOverLay";
import ColumnReordering from "./Overlays/managecolumns";
import GroupSort from "./Overlays/groupsort";
import ExportData from "./Overlays/exportdata";

const listRef = createRef(null);

const Customgrid = memo((props) => {
    const {
        title,
        gridHeight,
        gridWidth,
        managableColumns,
        originalColumns,
        additionalColumn,
        data,
        getRowEditOverlay,
        updateRowInGrid,
        deleteRowFromGrid,
        globalSearchLogic,
        selectBulkData,
        calculateRowHeight,
        isExpandContentAvailable,
        displayExpandedContent,
        rowActions,
        rowActionCallback,
        hasNextPage,
        isNextPageLoading,
        loadNextPage,
        doGroupSort
    } = props;

    // Local state value for holding columns configuration
    const [columns, setColumns] = useState(managableColumns);
    // Local state value for holding the boolean value to check if row expand is available
    const [isRowExpandEnabled, setIsRowExpandEnabled] = useState(
        isExpandContentAvailable
    );

    // Variables used for handling infinite loading
    const itemCount = hasNextPage ? data.length + 1 : data.length;
    const loadMoreItems = isNextPageLoading
        ? () => {}
        : loadNextPage || (() => {});
    const isItemLoaded = (index) => !hasNextPage || index < data.length;

    // Local state value for checking if column filter is open/closed
    const [isFilterOpen, setFilterOpen] = useState(false);
    // Toggle column filter state value based on UI clicks
    const toggleColumnFilter = () => {
        setFilterOpen(!isFilterOpen);
    };

    // Local state value for checking if column filter is open/closed
    const [isRowEditOverlyOpen, setIsRowEditOverlyOpen] = useState(false);
    // Local state value to hold row data that is going to be edited
    const [editedRowData, setEditedRowData] = useState(null);
    // Bind the user defined row edit overlay into Grid
    const bindRowEditOverlay = (rowValue) => {
        setEditedRowData(rowValue);
        setIsRowEditOverlyOpen(true);
    };
    // Close the row edit overlay
    const closeRowEditOverlay = () => {
        setEditedRowData(null);
        setIsRowEditOverlyOpen(false);
    };

    // Local state value for checking if column filter is open/closed
    const [isRowDeleteOverlyOpen, setIsRowDeleteOverlyOpen] = useState(false);
    // Local state value to hold row data that is going to be deleted
    const [deletedRowData, setDeletedRowData] = useState(null);
    // Bind the user defined row delete overlay into Grid
    const bindRowDeleteOverlay = (rowValue) => {
        setDeletedRowData(rowValue);
        setIsRowDeleteOverlyOpen(true);
    };
    // Close the row edit overlay
    const closeRowDeleteOverlay = () => {
        setDeletedRowData(null);
        setIsRowDeleteOverlyOpen(false);
    };

    // Local state value for checking if group Sort Overlay is open/closed.
    const [isGroupSortOverLayOpen, setGroupSortOverLay] = useState(false);

    // Toggle group Sort state value based on UI clicks
    const toggleGroupSortOverLay = () => {
        setGroupSortOverLay(!isGroupSortOverLayOpen);
    };

    const applyGroupSort = (sortOptions) => {
        doGroupSort(sortOptions);
    };

    // Local state value for hiding/unhiding column management overlay
    const [isManageColumnOpen, setManageColumnOpen] = useState(false);

    // Toggle column manage overlay show/hide state value based on UI clicks
    const toggleManageColumns = () => {
        setManageColumnOpen(!isManageColumnOpen);
    };

    // Callback method from column manage overlay to update the column structure of the grid
    const updateColumnStructure = (newColumnStructure, remarksColumn) => {
        setColumns([...newColumnStructure]);
        setIsRowExpandEnabled(!!(remarksColumn && remarksColumn.length > 0));
    };

    // Local state value for hiding/unhiding export data overlay
    const [isExportOverlayOpen, setIsExportOverlayOpen] = useState(false);

    // Toggle export overlay show/hide state value based on UI clicks
    const toggleExportDataOverlay = () => {
        setIsExportOverlayOpen(!isExportOverlayOpen);
    };

    // Column filter added for all columns by default
    const defaultColumn = useMemo(
        () => ({
            Filter: DefaultColumnFilter
        }),
        []
    );

    // Initialize react-table instance with the values received through properties
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
        selectedFlatRows,
        state,
        setGlobalFilter
    } = useTable(
        {
            columns,
            data,
            defaultColumn,
            globalFilter: (rowsToFilter, columnsToFilter, filterValue) => {
                // Call global search function defined in application, if it is present
                if (
                    globalSearchLogic &&
                    typeof globalSearchLogic === "function"
                ) {
                    return globalSearchLogic(
                        rowsToFilter,
                        columnsToFilter,
                        filterValue
                    );
                }
                return rowsToFilter;
            },
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
            // Add checkbox for all rows in grid, with different properties for header row and body rows
            hooks.allColumns.push((hookColumns) => [
                {
                    id: "selection",
                    columnId: "column_custom_0",
                    disableResizing: true,
                    disableFilters: true,
                    disableSortBy: true,
                    minWidth: 35,
                    width: 35,
                    maxWidth: 35,
                    Header: ({ getToggleAllRowsSelectedProps }) => {
                        const headerSelectProps = {
                            ...getToggleAllRowsSelectedProps()
                        };
                        return (
                            <RowSelector
                                checked={headerSelectProps.checked}
                                indeterminate={headerSelectProps.indeterminate}
                                onChange={headerSelectProps.onChange}
                                style={headerSelectProps.style}
                                title={headerSelectProps.title}
                            />
                        );
                    },
                    Cell: ({ row }) => (
                        <RowSelector {...row.getToggleRowSelectedProps()} />
                    )
                },
                ...hookColumns,
                {
                    id: "custom",
                    columnId: "column_custom_1",
                    disableResizing: true,
                    disableFilters: true,
                    disableSortBy: true,
                    minWidth: 35,
                    width: 35,
                    maxWidth: 35,
                    Cell: ({ row }) => {
                        return (
                            <div className="action">
                                <RowOptions
                                    row={row}
                                    rowActions={rowActions}
                                    rowActionCallback={rowActionCallback}
                                    bindRowEditOverlay={bindRowEditOverlay}
                                    bindRowDeleteOverlay={bindRowDeleteOverlay}
                                />
                                {isRowExpandEnabled ? (
                                    <span
                                        className="expander"
                                        {...row.getToggleRowExpandedProps()}
                                    >
                                        {row.isExpanded ? (
                                            <i
                                                className="fa fa-angle-up"
                                                aria-hidden="true"
                                            />
                                        ) : (
                                            <i
                                                className="fa fa-angle-down"
                                                aria-hidden="true"
                                            />
                                        )}
                                    </span>
                                ) : null}
                            </div>
                        );
                    }
                }
            ]);
        }
    );

    // Export selected row data and pass it to the callback method
    const bulkSelector = () => {
        if (selectBulkData) {
            selectBulkData(selectedFlatRows);
        }
    };

    // This code is to handle the row height calculation while expanding a row or resizing a column
    useEffect(() => {
        if (listRef && listRef.current) {
            listRef.current.resetAfterIndex(0, true);
        }
    });

    // Render each row and cells in each row, using attributes from react window list.
    const RenderRow = useCallback(
        ({ index, style }) => {
            if (isItemLoaded(index)) {
                const row = rows[index];
                prepareRow(row);
                return (
                    <div
                        {...row.getRowProps({ style })}
                        className="table-row tr"
                    >
                        <div className="table-row-wrap">
                            {row.cells.map((cell) => {
                                return (
                                    <div
                                        {...cell.getCellProps()}
                                        className="table-cell td"
                                    >
                                        {cell.render("Cell")}
                                    </div>
                                );
                            })}
                        </div>
                        {/* Check if row eapand icon is clicked, and if yes, call function to bind content to the expanded region */}
                        {isRowExpandEnabled && row.isExpanded ? (
                            <div className="expand">
                                {displayExpandedContent
                                    ? displayExpandedContent(row)
                                    : null}
                            </div>
                        ) : null}
                    </div>
                );
            }
            return null; // Added due to lint error expected to return a value in arrow function
        },
        [prepareRow, rows, displayExpandedContent]
    );

    // Render table title, global search component, button to show/hide column filter, button to export selected row data & the grid
    // Use properties and methods provided by react-table
    // Autosizer used for calculating grid height (don't consider window width and column resizing value changes)
    // Infinite loader used for lazy loading, with the properties passed here and other values calculated at the top
    // React window list is used for implementing virtualization, specifying the item count in a frame and height of each rows in it.
    return (
        <div className="table-wrapper" style={{ width: gridWidth || "100%" }}>
            <link
                rel="stylesheet"
                href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
            />
            <div className="neo-grid-header">
                <div className="neo-grid-header__results">
                    <strong>{rows.length}</strong>
                    <span>{title || "Rows"}</span>
                </div>
                <div className="neo-grid-header__utilities">
                    <ColumnReordering
                        isManageColumnOpen={isManageColumnOpen}
                        toggleManageColumns={toggleManageColumns}
                        originalColumns={originalColumns}
                        isExpandContentAvailable={isExpandContentAvailable}
                        additionalColumn={[additionalColumn]}
                        updateColumnStructure={updateColumnStructure}
                    />
                    <GlobalFilter
                        globalFilter={state.globalFilter}
                        setGlobalFilter={setGlobalFilter}
                    />
                    <GroupSort
                        isGroupSortOverLayOpen={isGroupSortOverLayOpen}
                        toggleGroupSortOverLay={toggleGroupSortOverLay}
                        originalColumns={originalColumns}
                        applyGroupSort={applyGroupSort}
                    />
                    <ExportData
                        isExportOverlayOpen={isExportOverlayOpen}
                        toggleExportDataOverlay={toggleExportDataOverlay}
                        rows={rows}
                        originalColumns={originalColumns}
                        columns={columns} //Updated columns structure from manage columns overlay
                        isRowExpandEnabled={isRowExpandEnabled} //Updated additional column structure from manage columns overlay
                        isExpandContentAvailable={isExpandContentAvailable}
                        additionalColumn={[additionalColumn]}
                    />
                    <div
                        className="utilities-icon keyword-search"
                        role="presentation"
                        onClick={toggleColumnFilter}
                    >
                        <i className="fa fa-filter" aria-hidden="true" />
                    </div>
                    <div
                        className="utilities-icon bulk-select"
                        role="presentation"
                        onClick={bulkSelector}
                    >
                        <i
                            className="fa fa-pencil-square-o"
                            aria-hidden="true"
                        />
                    </div>
                    <div
                        className="utilities-icon bulk-select"
                        role="presentation"
                        onClick={toggleGroupSortOverLay}
                    >
                        <i
                            className="fa fa-sort-amount-desc"
                            aria-hidden="true"
                        />
                    </div>
                    <div
                        className="utilities-icon manage-columns"
                        role="presentation"
                        onClick={toggleManageColumns}
                    >
                        <i className="fa fa-columns" aria-hidden="true" />
                    </div>
                    <div
                        className="utilities-icon manage-columns"
                        role="presentation"
                        onClick={toggleExportDataOverlay}
                    >
                        <i className="fa fa-share-alt" aria-hidden="true" />
                    </div>
                </div>
            </div>

            <div className="table-popus">
                {isRowEditOverlyOpen ? (
                    <div className="overlay">
                        <RowEditOverlay
                            row={editedRowData}
                            columns={columns}
                            isRowExpandEnabled={isRowExpandEnabled}
                            additionalColumn={additionalColumn}
                            getRowEditOverlay={getRowEditOverlay}
                            closeRowEditOverlay={closeRowEditOverlay}
                            updateRowInGrid={updateRowInGrid}
                        />
                    </div>
                ) : null}
                {isRowDeleteOverlyOpen ? (
                    <div className="overlay">
                        <RowDeleteOverLay
                            row={deletedRowData}
                            closeRowDeleteOverlay={closeRowDeleteOverlay}
                            deleteRowFromGrid={deleteRowFromGrid}
                        />
                    </div>
                ) : null}
            </div>

            <div
                className="tableContainer table-outer neo-grid"
                style={{
                    height: gridHeight || "50vh",
                    overflowX: "auto",
                    overflowY: "hidden"
                }}
            >
                <AutoSizer disableWidth disableResizing>
                    {({ height }) => (
                        <div {...getTableProps()} className="table">
                            <div className="thead table-row table-row--head">
                                {headerGroups.map((headerGroup) => (
                                    <div
                                        {...headerGroup.getHeaderGroupProps()}
                                        className="tr"
                                    >
                                        {headerGroup.headers.map((column) => (
                                            <div
                                                {...column.getHeaderProps()}
                                                className="table-cell column-heading th"
                                            >
                                                <div
                                                    {...column.getSortByToggleProps()}
                                                >
                                                    {column.render("Header")}
                                                    <span>
                                                        {column.isSorted ? (
                                                            column.isSortedDesc ? (
                                                                <i
                                                                    className="fa fa-sort-desc"
                                                                    aria-hidden="true"
                                                                />
                                                            ) : (
                                                                <i
                                                                    className="fa fa-sort-asc"
                                                                    aria-hidden="true"
                                                                />
                                                            )
                                                        ) : (
                                                            ""
                                                        )}
                                                    </span>
                                                </div>
                                                <div
                                                    className={`txt-wrap column-filter ${
                                                        isFilterOpen
                                                            ? "open"
                                                            : ""
                                                    }`}
                                                >
                                                    {!column.disableFilters
                                                        ? column.render(
                                                              "Filter"
                                                          )
                                                        : null}
                                                </div>
                                                {column.canResize && (
                                                    <div
                                                        {...column.getResizerProps()}
                                                        className="resizer"
                                                    />
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                            <div {...getTableBodyProps()} className="tbody">
                                <InfiniteLoader
                                    isItemLoaded={isItemLoaded}
                                    itemCount={itemCount}
                                    loadMoreItems={loadMoreItems}
                                >
                                    {({ onItemsRendered, ref }) => (
                                        <List
                                            ref={(list) => {
                                                ref(list);
                                                listRef.current = list;
                                            }}
                                            style={{ overflowX: "hidden" }}
                                            height={height - 60}
                                            itemCount={rows.length}
                                            itemSize={(index) => {
                                                return calculateRowHeight(
                                                    rows[index],
                                                    headerGroups &&
                                                        headerGroups.length
                                                        ? headerGroups[0]
                                                              .headers
                                                        : []
                                                );
                                            }}
                                            onItemsRendered={onItemsRendered}
                                            overscanCount={20}
                                        >
                                            {RenderRow}
                                        </List>
                                    )}
                                </InfiniteLoader>
                            </div>
                        </div>
                    )}
                </AutoSizer>
            </div>
        </div>
    );
});

Customgrid.propTypes = {
    title: PropTypes.any,
    gridHeight: PropTypes.any,
    gridWidth: PropTypes.any,
    managableColumns: PropTypes.any,
    originalColumns: PropTypes.any,
    data: PropTypes.any,
    getRowEditOverlay: PropTypes.any,
    updateRowInGrid: PropTypes.any,
    deleteRowFromGrid: PropTypes.any,
    globalSearchLogic: PropTypes.any,
    selectBulkData: PropTypes.any,
    calculateRowHeight: PropTypes.any,
    isExpandContentAvailable: PropTypes.any,
    displayExpandedContent: PropTypes.any,
    hasNextPage: PropTypes.any,
    isNextPageLoading: PropTypes.any,
    loadNextPage: PropTypes.any,
    doGroupSort: PropTypes.any,
    getToggleAllRowsSelectedProps: PropTypes.any,
    row: PropTypes.any,
    additionalColumn: PropTypes.any
};

export default Customgrid;
