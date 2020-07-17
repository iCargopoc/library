import React, { useCallback, useState, memo, useEffect, createRef, useMemo } from "react";
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
import RowSelector from "./Functions/RowSelector";
import DefaultColumnFilter from "./Functions/DefaultColumnFilter";
import GlobalFilter from "./Functions/GlobalFilter";
import RowOptions from "./Functions/RowOptions";
import ColumnReordering from "./Overlays/managecolumns";
import ExportData from "./Overlays/exportdata/ExportData";
import {
    faSortAmountDown,
    faColumns,
    faShareAlt,
    faSortDown,
  } from "@fortawesome/free-solid-svg-icons";
  import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const listRef = createRef(null);

const Customgrid = memo((props) => {
    const {
        title,
        gridHeight,
        gridWidth,
        managableColumns,
        originalColumns,
        data,
        rowEditOverlay,
        rowEditData,
        updateRowInGrid,
        deletePopUpOverLay,
        deleteRowFromGrid,
        globalSearchLogic,
        selectBulkData,
        calculateRowHeight,
        renderExpandedContent,
        hasNextPage,
        isNextPageLoading,
        loadNextPage
    } = props;

    //Local state value for holding columns configuration
    const [columns, setColumns] = useState(managableColumns);

    //Display error message if data or columns configuration is missing.
    if (!(data && data.length > 0) || !(columns && columns.length > 0)) {
        return <h2 style={{ marginTop: "50px", textAlign: "center" }}>Invalid Data or Columns Configuration</h2>;
    }

    //Variables used for handling infinite loading
    const itemCount = hasNextPage ? data.length + 1 : data.length;
    const loadMoreItems = isNextPageLoading ? () => {} : loadNextPage ? loadNextPage : () => {};
    const isItemLoaded = (index) => !hasNextPage || index < data.length;

    //Local state value for checking if column filter is open/closed
    const [isFilterOpen, setFilterOpen] = useState(false);

    //Toggle column filter state value based on UI clicks
    const toggleColumnFilter = () => {
        setFilterOpen(!isFilterOpen);
    };

    //Local state value for hiding/unhiding column management overlay
    const [isManageColumnOpen, setManageColumnOpen] = useState(false);

    //Toggle column manage overlay show/hide state value based on UI clicks
    const toggleManageColumns = () => {
        setManageColumnOpen(!isManageColumnOpen);
    };

    //Callback method from column manage overlay to update the column structure of the grid
    const updateColumnStructure = (newColumnStructure) => {
        setColumns(newColumnStructure);
        toggleManageColumns();
    };

    //Export Data Logic
    const [exportComponent, setExportComponent] = useState(null);
    const exportColumnData = () => {
        setExportComponent(
        <ExportData 
            rows={data} 
            columnsList={columns} 
            closeExport={closeExport} 
            managableColumns = {managableColumns}
            originalColumns = {originalColumns}
        />);
    };

    const closeExport = () => {
        setExportComponent(null);
    };

    //Column filter added for all columns by default
    const defaultColumn = useMemo(
        () => ({
            Filter: DefaultColumnFilter
        }),
        []
    );

    //Initialize react-table instance with the values received through properties
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
            globalFilter: (rows, columns, filterValue) => {
                //Call global search function defined in application, if it is present
                if (globalSearchLogic && typeof globalSearchLogic === "function") {
                    return globalSearchLogic(rows, columns, filterValue);
                } else {
                    return rows;
                }
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
            //Add checkbox for all rows in grid, with different properties for header row and body rows
            hooks.allColumns.push((columns) => [
                {
                    id: "selection",
                    columnId: "column_custom_0",
                    disableResizing: true,
                    disableFilters: true,
                    disableSortBy: true,
                    minWidth: 35,
                    width: 35,
                    maxWidth: 35,
                    Header: ({ getToggleAllRowsSelectedProps }) => <RowSelector {...getToggleAllRowsSelectedProps()} />,
                    Cell: ({ row }) => <RowSelector {...row.getToggleRowSelectedProps()} />
                },
                ...columns,
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
                                    DeletePopUpOverLay={deletePopUpOverLay}
                                    deleteRowFromGrid={deleteRowFromGrid}
                                    RowEditOverlay={rowEditOverlay}
                                    rowEditData={rowEditData}
                                    updateRowInGrid={updateRowInGrid}
                                />
                                <span className="expander" {...row.getToggleRowExpandedProps()}>
                                    {row.isExpanded ? (
                                        <i className="fa fa-angle-up" aria-hidden="true"></i>
                                    ) : (
                                        <i className="fa fa-angle-down" aria-hidden="true"></i>
                                    )}
                                </span>
                            </div>
                        );
                    }
                }
            ]);
        }
    );

    //Export selected row data and pass it to the callback method
    const bulkSelector = () => {
        if (selectBulkData) {
            selectBulkData(selectedFlatRows);
        }
    };

    //This code is to handle the row height calculation while expanding a row or resizing a column
    useEffect(() => {
        if (listRef && listRef.current) {
            listRef.current.resetAfterIndex(0, true);
        }
    });

    //Render each row and cells in each row, using attributes from react window list.
    const RenderRow = useCallback(
        ({ index, style }) => {
            if (isItemLoaded(index)) {
                const row = rows[index];
                prepareRow(row);
                return (
                    <div {...row.getRowProps({ style })} className="table-row tr">
                        <div className="table-row-wrap">
                            {row.cells.map((cell) => {
                                return (
                                    <div {...cell.getCellProps()} className="table-cell td">
                                        {cell.render("Cell")}
                                    </div>
                                );
                            })}
                        </div>
                        {/*Check if row eapand icon is clicked, and if yes, call function to bind content to the expanded region*/}
                        {row.isExpanded ? (
                            <div className="expand">{renderExpandedContent ? renderExpandedContent(row) : null}</div>
                        ) : null}
                    </div>
                );
            }
        },
        [prepareRow, rows, renderExpandedContent]
    );

    //Render table title, global search component, button to show/hide column filter, button to export selected row data & the grid
    //Use properties and methods provided by react-table
    //Autosizer used for calculating grid height (don't consider window width and column resizing value changes)
    //Infinite loader used for lazy loading, with the properties passed here and other values calculated at the top
    //React window list is used for implementing virtualization, specifying the item count in a frame and height of each rows in it.
    return (
        <div className="wrapper" style={{ width: gridWidth ? gridWidth : "100%" }}>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" />
            <div className="table-filter">
                <div className="results">
                    <div className="name">
                        <strong>{rows.length}</strong>
                        <span> {title ? title : "Rows"}</span>
                    </div>
                </div>
                <div className="filter-utilities">
                    <ColumnReordering
                        isManageColumnOpen={isManageColumnOpen}
                        toggleManageColumns={toggleManageColumns}
                        originalColumns={originalColumns}
                        updateColumnStructure={updateColumnStructure}
                    />
                    <GlobalFilter globalFilter={state.globalFilter} setGlobalFilter={setGlobalFilter} />
                    <div className="filter-icon keyword-search" onClick={toggleColumnFilter}>
                        <i className="fa fa-filter" aria-hidden="true"></i>
                    </div>
                    {/* <div className="filter-icon bulk-select" onClick={bulkSelector}>
                        <i className="fa fa-pencil-square-o" aria-hidden="true"></i>
                    </div> */}
                    <div className="filterIcons">
                        <FontAwesomeIcon title="Export" icon={faShareAlt} onClick={exportColumnData} />
                    </div>
                    {exportComponent}
                    <div className="filter-icon manage-columns" onClick={toggleManageColumns}>
                        <i className="fa fa-columns" aria-hidden="true"></i>
                    </div>
                </div>
            </div>
            <div
                className="tableContainer table-outer"
                style={{ height: gridHeight ? gridHeight : "50vh", overflowX: "auto", overflowY: "hidden" }}
            >
                <AutoSizer disableWidth disableResizing>
                    {({ height }) => (
                        <div {...getTableProps()} className="table">
                            <div className="thead table-row table-row--head">
                                {headerGroups.map((headerGroup) => (
                                    <div {...headerGroup.getHeaderGroupProps()} className="tr">
                                        {headerGroup.headers.map((column) => (
                                            <div {...column.getHeaderProps()} className="table-cell column-heading th">
                                                <div {...column.getSortByToggleProps()}>
                                                    {column.render("Header")}
                                                    <span>
                                                        {column.isSorted ? (
                                                            column.isSortedDesc ? (
                                                                <i className="fa fa-sort-desc" aria-hidden="true"></i>
                                                            ) : (
                                                                <i className="fa fa-sort-asc" aria-hidden="true"></i>
                                                            )
                                                        ) : (
                                                            ""
                                                        )}
                                                    </span>
                                                </div>
                                                <div className={`txt-wrap column-filter ${isFilterOpen ? "open" : ""}`}>
                                                    {!column.disableFilters ? column.render("Filter") : null}
                                                </div>
                                                {column.canResize && <div {...column.getResizerProps()} className="resizer" />}
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                            <div {...getTableBodyProps()} className="tbody">
                                <InfiniteLoader isItemLoaded={isItemLoaded} itemCount={itemCount} loadMoreItems={loadMoreItems}>
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
                                                if (calculateRowHeight && typeof calculateRowHeight === "function") {
                                                    return calculateRowHeight(rows, index, headerGroups);
                                                } else {
                                                    return 70;
                                                }
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

export default Customgrid;
