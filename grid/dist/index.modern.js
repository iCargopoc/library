import React, { memo, forwardRef, useState, useRef, useEffect, createRef, useMemo, useCallback } from 'react';
import { useAsyncDebounce, useTable, useFilters, useGlobalFilter, useSortBy, useExpanded, useRowSelect, useFlexLayout, useResizeColumns } from 'react-table';
import { VariableSizeList } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import InfiniteLoader from 'react-window-infinite-loader';
import 'react-click-away-listener';
import { useDrag, useDrop, DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';
import MultiBackend, { TouchTransition } from 'react-dnd-multi-backend';
import update from 'immutability-helper';

const RowSelector = memo(forwardRef(({
  indeterminate,
  ...rest
}, ref) => {
  const [checkValue, setCheckValue] = useState(indeterminate);
  const defaultRef = useRef();
  const resolvedRef = ref || defaultRef;

  const onChange = () => {
    setCheckValue(!indeterminate);
  };

  useEffect(() => {
    resolvedRef.current.indeterminate = indeterminate;
  }, [resolvedRef, indeterminate]);
  return /*#__PURE__*/React.createElement("div", {
    className: "check-wrap"
  }, /*#__PURE__*/React.createElement("input", Object.assign({
    type: "checkbox",
    checked: checkValue,
    onChange: onChange,
    ref: resolvedRef
  }, rest)));
}));

const DefaultColumnFilter = memo(({
  column: {
    filterValue,
    setFilter
  }
}) => {
  return /*#__PURE__*/React.createElement("input", {
    className: "txt",
    value: filterValue || "",
    onChange: e => {
      setFilter(e.target.value || undefined);
    },
    placeholder: "Search"
  });
});

const GlobalFilter = memo(({
  globalFilter,
  setGlobalFilter
}) => {
  const [value, setValue] = useState(globalFilter);
  const onChange = useAsyncDebounce(value => {
    setGlobalFilter(value || undefined);
  }, 200);
  return /*#__PURE__*/React.createElement("div", {
    className: "txt-wrap"
  }, /*#__PURE__*/React.createElement("input", {
    type: "text",
    value: value || "",
    onChange: e => {
      setValue(e.target.value);
      onChange(e.target.value);
    },
    className: "txt",
    placeholder: "Search"
  }), /*#__PURE__*/React.createElement("i", {
    className: "fa fa-search fa-6",
    "aria-hidden": "true"
  }));
});

var RowDelete = require("./RowDelete~RKolkpAF.svg");

var RowEdit = require("./RowEdit~BuKwAcSl.svg");

var RowPin = require("./RowPin~qQRdvcXq.png");

const RowOptions = memo(props => {
  const {
    row,
    DeletePopUpOverLay,
    deleteRowFromGrid
  } = props;
  const [isRowOptionsOpen, setRowOptionsOpen] = useState(false);
  const [isDeleteOverlayOpen, setDeleteOverlayOpen] = useState(false);

  const openRowOptionsOverlay = () => {
    setRowOptionsOpen(true);
  };

  const closeRowOptionsOverlay = () => {
    setRowOptionsOpen(false);
  };

  const openDeleteOverlay = () => {
    setRowOptionsOpen(false);
    setDeleteOverlayOpen(true);
  };

  const closeDeleteOverlay = () => {
    setDeleteOverlayOpen(false);
  };

  const deleteRow = () => {
    deleteRowFromGrid(row);
  };

  return /*#__PURE__*/React.createElement("div", {
    className: "row-options-edit-wrap"
  }, /*#__PURE__*/React.createElement("span", {
    className: "icon-row-options",
    onClick: openRowOptionsOverlay
  }, /*#__PURE__*/React.createElement("i", null), /*#__PURE__*/React.createElement("i", null), /*#__PURE__*/React.createElement("i", null)), isRowOptionsOpen ? /*#__PURE__*/React.createElement("div", {
    className: `row-options-edit ${isRowOptionsOpen ? "open" : "close"}`
  }, /*#__PURE__*/React.createElement("ul", null, /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("i", null, /*#__PURE__*/React.createElement("img", {
    src: RowEdit,
    alt: "cargo"
  })), /*#__PURE__*/React.createElement("span", null, "Edit"))), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("i", null, /*#__PURE__*/React.createElement("img", {
    src: RowPin,
    alt: "cargo",
    width: "15",
    height: "15"
  })), /*#__PURE__*/React.createElement("span", null, "Pin This row"))), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("span", {
    onClick: openDeleteOverlay
  }, /*#__PURE__*/React.createElement("i", null, /*#__PURE__*/React.createElement("img", {
    src: RowDelete,
    alt: "cargo"
  })), /*#__PURE__*/React.createElement("span", null, "Delete")))), /*#__PURE__*/React.createElement("span", {
    className: "close",
    onClick: closeRowOptionsOverlay
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa fa-close"
  }))) : null, isDeleteOverlayOpen ? /*#__PURE__*/React.createElement(DeletePopUpOverLay, {
    closeDeleteOverlay: closeDeleteOverlay,
    deleteRow: deleteRow
  }) : null);
});

const ItemTypes = {
  COLUMN: "column"
};

const ColumnItem = ({
  id,
  name,
  moveColumn,
  findColumn,
  innerCells
}) => {
  const originalIndex = findColumn(id).index;
  const [{
    isDragging
  }, drag] = useDrag({
    item: {
      type: ItemTypes.COLUMN,
      id,
      originalIndex
    },
    collect: monitor => ({
      isDragging: monitor.isDragging()
    }),
    end: (dropResult, monitor) => {
      const {
        id: droppedId,
        originalIndex
      } = monitor.getItem();
      const didDrop = monitor.didDrop();

      if (!didDrop) {
        moveColumn(droppedId, originalIndex);
      }
    }
  });
  const [, drop] = useDrop({
    accept: ItemTypes.COLUMN,
    canDrop: () => false,

    hover({
      id: draggedId
    }) {
      if (draggedId !== id) {
        const {
          index: overIndex
        } = findColumn(id);
        moveColumn(draggedId, overIndex);
      }
    }

  });
  const opacity = isDragging ? 0.1 : 1;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      opacity
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "column__reorder"
  }, /*#__PURE__*/React.createElement("div", {
    ref: node => drag(drop(node)),
    style: {
      cursor: "move"
    },
    className: ""
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa fa-align-justify",
    "aria-hidden": "true"
  })), /*#__PURE__*/React.createElement("div", {
    className: ""
  }, name)));
};

const ColumnsList = props => {
  const moveColumn = (columnId, atIndex) => {
    const {
      column,
      index
    } = findColumn(columnId);
    props.updateColumnsInState(update(props.columnsToManage, {
      $splice: [[index, 1], [atIndex, 0, column]]
    }));
  };

  const findColumn = columnId => {
    const column = props.columnsToManage.filter(c => `${c.columnId}` === columnId)[0];
    return {
      column,
      index: props.columnsToManage.indexOf(column)
    };
  };

  const [, drop] = useDrop({
    accept: ItemTypes.COLUMN
  });
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    ref: drop,
    style: {
      display: "flex",
      flexWrap: "wrap"
    }
  }, props.columnsToManage.map((column, index) => {
    return /*#__PURE__*/React.createElement(ColumnItem, {
      key: index,
      id: `${column.columnId}`,
      name: `${column.Header}`,
      moveColumn: moveColumn,
      findColumn: findColumn,
      innerCells: column.innerCells
    });
  })));
};

const ColumnReordering = memo(props => {
  const {
    isManageColumnOpen,
    toggleManageColumns,
    originalColumns
  } = props;
  const [managedColumns, setManagedColumns] = useState(originalColumns);
  const HTML5toTouch = {
    backends: [{
      backend: HTML5Backend
    }, {
      backend: TouchBackend,
      options: {
        enableMouseEvents: true
      },
      preview: true,
      transition: TouchTransition
    }]
  };

  const updateColumnsInState = columns => {
    setManagedColumns(columns);
  };

  const isCheckboxSelected = header => {
    if (header === "Select All") {
      return managedColumns.length === originalColumns.length;
    } else {
      const selectedColumn = managedColumns.filter(column => {
        return column.Header === header;
      });
      return selectedColumn && selectedColumn.length > 0;
    }
  };

  const selectAllColumns = event => {
    if (event.currentTarget.checked) {
      setManagedColumns(originalColumns);
    } else {
      setManagedColumns([]);
    }
  };

  const selectSingleColumn = event => {
    const {
      currentTarget
    } = event;
    const {
      checked,
      value
    } = currentTarget;

    if (checked) {
      let indexOfColumnToAdd = originalColumns.findIndex(column => {
        return column.Header == value;
      });
      const itemToAdd = originalColumns[indexOfColumnToAdd];
      let prevItemIndex = -1;

      while (indexOfColumnToAdd > 0 && prevItemIndex === -1) {
        prevItemIndex = managedColumns.findIndex(column => {
          return column.Header == originalColumns[indexOfColumnToAdd - 1].Header;
        });
        indexOfColumnToAdd = indexOfColumnToAdd - 1;
      }

      const newColumnsList = managedColumns.slice(0);
      newColumnsList.splice(prevItemIndex + 1, 0, itemToAdd);
      setManagedColumns(newColumnsList);
    } else {
      setManagedColumns(managedColumns.filter(column => {
        return column.Header !== value;
      }));
    }
  };

  const doColumnUpdate = () => {
    props.updateColumnStructure(managedColumns);
  };

  const resetColumnUpdate = () => {
    setManagedColumns(originalColumns);
    props.updateColumnStructure(originalColumns);
  };

  if (isManageColumnOpen) {
    return /*#__PURE__*/React.createElement("div", {
      className: "columns--grid"
    }, /*#__PURE__*/React.createElement("div", {
      className: "column__grid"
    }, /*#__PURE__*/React.createElement("div", {
      className: "column__chooser"
    }, /*#__PURE__*/React.createElement("div", {
      className: "column__header"
    }, /*#__PURE__*/React.createElement("div", {
      className: ""
    }, /*#__PURE__*/React.createElement("strong", null, "Column Chooser"))), /*#__PURE__*/React.createElement("div", {
      className: "column__body"
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("input", {
      type: "text",
      placeholder: "Search column",
      className: "custom__ctrl"
    })), /*#__PURE__*/React.createElement("div", {
      className: "column__selectAll"
    }, /*#__PURE__*/React.createElement("div", {
      className: "column__checkbox"
    }, /*#__PURE__*/React.createElement("input", {
      type: "checkbox",
      value: "Select All",
      checked: isCheckboxSelected("Select All"),
      onChange: selectAllColumns
    })), /*#__PURE__*/React.createElement("div", {
      className: "column__selectTxt"
    }, "Select All")), originalColumns.map((column, index) => {
      return /*#__PURE__*/React.createElement("div", {
        className: "column__wrap",
        key: index
      }, /*#__PURE__*/React.createElement("div", {
        className: "column__checkbox"
      }, /*#__PURE__*/React.createElement("input", {
        type: "checkbox",
        value: column.Header,
        checked: isCheckboxSelected(column.Header),
        onChange: selectSingleColumn
      })), /*#__PURE__*/React.createElement("div", {
        className: "column__txt"
      }, column.Header));
    }))), /*#__PURE__*/React.createElement("div", {
      className: "column__settings"
    }, /*#__PURE__*/React.createElement("div", {
      className: "column__header"
    }, /*#__PURE__*/React.createElement("div", {
      className: "column__headerTxt"
    }, /*#__PURE__*/React.createElement("strong", null, "Column Setting")), /*#__PURE__*/React.createElement("div", {
      className: "column__close",
      onClick: toggleManageColumns
    }, /*#__PURE__*/React.createElement("i", {
      className: "fa fa-times",
      "aria-hidden": "true"
    }))), /*#__PURE__*/React.createElement("div", {
      className: "column__body"
    }, /*#__PURE__*/React.createElement(DndProvider, {
      backend: MultiBackend,
      options: HTML5toTouch
    }, /*#__PURE__*/React.createElement(ColumnsList, {
      columnsToManage: managedColumns,
      updateColumnsInState: updateColumnsInState
    }))), /*#__PURE__*/React.createElement("div", {
      className: "column__footer"
    }, /*#__PURE__*/React.createElement("div", {
      className: "column__btns"
    }, /*#__PURE__*/React.createElement("button", {
      className: "btns",
      onClick: resetColumnUpdate
    }, "Reset"), /*#__PURE__*/React.createElement("button", {
      className: "btns",
      onClick: toggleManageColumns
    }, "Cancel"), /*#__PURE__*/React.createElement("button", {
      className: "btns btns__save",
      onClick: doColumnUpdate
    }, "Save"))))));
  } else {
    return /*#__PURE__*/React.createElement("div", null);
  }
});

const listRef = createRef(null);
const Customgrid = memo(props => {
  const {
    title,
    gridHeight,
    gridWidth,
    managableColumns,
    originalColumns,
    data,
    deletePopUpOverLay,
    deleteRowFromGrid,
    globalSearchLogic,
    updateCellData,
    selectBulkData,
    calculateRowHeight,
    renderExpandedContent,
    hasNextPage,
    isNextPageLoading,
    loadNextPage
  } = props;
  const [columns, setColumns] = useState(managableColumns);

  if (!(data && data.length > 0) || !(columns && columns.length > 0)) {
    return /*#__PURE__*/React.createElement("h2", {
      style: {
        marginTop: "50px",
        textAlign: "center"
      }
    }, "Invalid Data or Columns Configuration");
  }

  const itemCount = hasNextPage ? data.length + 1 : data.length;
  const loadMoreItems = isNextPageLoading ? () => {} : loadNextPage ? loadNextPage : () => {};

  const isItemLoaded = index => !hasNextPage || index < data.length;

  const [isFilterOpen, setFilterOpen] = useState(false);

  const toggleColumnFilter = () => {
    setFilterOpen(!isFilterOpen);
  };

  const [isManageColumnOpen, setManageColumnOpen] = useState(false);

  const toggleManageColumns = () => {
    setManageColumnOpen(!isManageColumnOpen);
  };

  const updateColumnStructure = newColumnStructure => {
    setColumns(newColumnStructure);
    toggleManageColumns();
  };

  const defaultColumn = useMemo(() => ({
    Filter: DefaultColumnFilter
  }), []);
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    selectedFlatRows,
    state,
    setGlobalFilter
  } = useTable({
    columns,
    data,
    defaultColumn,
    updateCellData,
    globalFilter: (rows, columns, filterValue) => {
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
  }, useFilters, useGlobalFilter, useSortBy, useExpanded, useRowSelect, useFlexLayout, useResizeColumns, hooks => {
    hooks.allColumns.push(columns => [{
      id: "selection",
      columnId: "column_custom_0",
      disableResizing: true,
      disableFilters: true,
      disableSortBy: true,
      minWidth: 35,
      width: 35,
      maxWidth: 35,
      Header: ({
        getToggleAllRowsSelectedProps
      }) => /*#__PURE__*/React.createElement(RowSelector, getToggleAllRowsSelectedProps()),
      Cell: ({
        row
      }) => /*#__PURE__*/React.createElement(RowSelector, row.getToggleRowSelectedProps())
    }, ...columns, {
      id: "custom",
      columnId: "column_custom_1",
      disableResizing: true,
      disableFilters: true,
      disableSortBy: true,
      minWidth: 35,
      width: 35,
      maxWidth: 35,
      Cell: ({
        row
      }) => {
        return /*#__PURE__*/React.createElement("div", {
          className: "action"
        }, /*#__PURE__*/React.createElement(RowOptions, {
          row: row,
          DeletePopUpOverLay: deletePopUpOverLay,
          deleteRowFromGrid: deleteRowFromGrid
        }), /*#__PURE__*/React.createElement("span", Object.assign({
          className: "expander"
        }, row.getToggleRowExpandedProps()), row.isExpanded ? /*#__PURE__*/React.createElement("i", {
          className: "fa fa-angle-up",
          "aria-hidden": "true"
        }) : /*#__PURE__*/React.createElement("i", {
          className: "fa fa-angle-down",
          "aria-hidden": "true"
        })));
      }
    }]);
  });

  const bulkSelector = () => {
    if (selectBulkData) {
      selectBulkData(selectedFlatRows);
    }
  };

  useEffect(() => {
    if (listRef && listRef.current) {
      listRef.current.resetAfterIndex(0, true);
    }
  });
  const RenderRow = useCallback(({
    index,
    style
  }) => {
    if (isItemLoaded(index)) {
      const row = rows[index];
      prepareRow(row);
      return /*#__PURE__*/React.createElement("div", Object.assign({}, row.getRowProps({
        style
      }), {
        className: "table-row tr"
      }), /*#__PURE__*/React.createElement("div", {
        className: "table-row-wrap"
      }, row.cells.map(cell => {
        return /*#__PURE__*/React.createElement("div", Object.assign({}, cell.getCellProps(), {
          className: "table-cell td"
        }), cell.render("Cell"));
      })), row.isExpanded ? /*#__PURE__*/React.createElement("div", {
        className: "expand"
      }, renderExpandedContent ? renderExpandedContent(row) : null) : null);
    }
  }, [prepareRow, rows, renderExpandedContent]);
  return /*#__PURE__*/React.createElement("div", {
    className: "wrapper",
    style: {
      width: gridWidth ? gridWidth : "100%"
    }
  }, /*#__PURE__*/React.createElement("link", {
    rel: "stylesheet",
    href: "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
  }), /*#__PURE__*/React.createElement("div", {
    className: "table-filter"
  }, /*#__PURE__*/React.createElement("div", {
    className: "results"
  }, /*#__PURE__*/React.createElement("div", {
    className: "name"
  }, /*#__PURE__*/React.createElement("strong", null, rows.length), /*#__PURE__*/React.createElement("span", null, " ", title ? title : "Rows"))), /*#__PURE__*/React.createElement("div", {
    className: "filter-utilities"
  }, /*#__PURE__*/React.createElement(ColumnReordering, {
    isManageColumnOpen: isManageColumnOpen,
    toggleManageColumns: toggleManageColumns,
    originalColumns: originalColumns,
    updateColumnStructure: updateColumnStructure
  }), /*#__PURE__*/React.createElement(GlobalFilter, {
    globalFilter: state.globalFilter,
    setGlobalFilter: setGlobalFilter
  }), /*#__PURE__*/React.createElement("div", {
    className: "filter-icon keyword-search",
    onClick: toggleColumnFilter
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa fa-filter",
    "aria-hidden": "true"
  })), /*#__PURE__*/React.createElement("div", {
    className: "filter-icon bulk-select",
    onClick: bulkSelector
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa fa-pencil-square-o",
    "aria-hidden": "true"
  })), /*#__PURE__*/React.createElement("div", {
    className: "filter-icon manage-columns",
    onClick: toggleManageColumns
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa fa-columns",
    "aria-hidden": "true"
  })))), /*#__PURE__*/React.createElement("div", {
    className: "tableContainer table-outer",
    style: {
      height: gridHeight ? gridHeight : "50vh",
      overflowX: "auto",
      overflowY: "hidden"
    }
  }, /*#__PURE__*/React.createElement(AutoSizer, {
    disableWidth: true,
    disableResizing: true
  }, ({
    height
  }) => /*#__PURE__*/React.createElement("div", Object.assign({}, getTableProps(), {
    className: "table"
  }), /*#__PURE__*/React.createElement("div", {
    className: "thead table-row table-row--head"
  }, headerGroups.map(headerGroup => /*#__PURE__*/React.createElement("div", Object.assign({}, headerGroup.getHeaderGroupProps(), {
    className: "tr"
  }), headerGroup.headers.map(column => /*#__PURE__*/React.createElement("div", Object.assign({}, column.getHeaderProps(), {
    className: "table-cell column-heading th"
  }), /*#__PURE__*/React.createElement("div", column.getSortByToggleProps(), column.render("Header"), /*#__PURE__*/React.createElement("span", null, column.isSorted ? column.isSortedDesc ? /*#__PURE__*/React.createElement("i", {
    className: "fa fa-sort-desc",
    "aria-hidden": "true"
  }) : /*#__PURE__*/React.createElement("i", {
    className: "fa fa-sort-asc",
    "aria-hidden": "true"
  }) : "")), /*#__PURE__*/React.createElement("div", {
    className: `txt-wrap column-filter ${isFilterOpen ? "open" : ""}`
  }, !column.disableFilters ? column.render("Filter") : null), column.canResize && /*#__PURE__*/React.createElement("div", Object.assign({}, column.getResizerProps(), {
    className: "resizer"
  }))))))), /*#__PURE__*/React.createElement("div", Object.assign({}, getTableBodyProps(), {
    className: "tbody"
  }), /*#__PURE__*/React.createElement(InfiniteLoader, {
    isItemLoaded: isItemLoaded,
    itemCount: itemCount,
    loadMoreItems: loadMoreItems
  }, ({
    onItemsRendered,
    ref
  }) => /*#__PURE__*/React.createElement(VariableSizeList, {
    ref: list => {
      ref(list);
      listRef.current = list;
    },
    style: {
      overflowX: "hidden"
    },
    height: height - 60,
    itemCount: rows.length,
    itemSize: index => {
      if (calculateRowHeight && typeof calculateRowHeight === "function") {
        return calculateRowHeight(rows, index, headerGroups);
      } else {
        return 70;
      }
    },
    onItemsRendered: onItemsRendered,
    overscanCount: 20
  }, RenderRow)))))));
});

const Grid = memo(props => {
  const {
    title,
    gridHeight,
    gridWidth,
    columns,
    fetchData,
    deletePopUpOverLay,
    deleteRowData,
    globalSearchLogic,
    updateCellData,
    selectBulkData,
    calculateRowHeight,
    renderExpandedContent
  } = props;
  const [hasNextPage, setHasNextPage] = useState(true);
  const [isNextPageLoading, setIsNextPageLoading] = useState(false);
  const [items, setItems] = useState([]);
  let processedColumns = [];
  columns.forEach((column, index) => {
    column.columnId = `column_${index}`;
    processedColumns.push(column);
  });
  const gridColumns = useMemo(() => processedColumns, []);

  const deleteRowFromGrid = row => {
    const {
      index,
      original
    } = row;
    const rowIndexToBeDeleted = index;
    setItems(old => old.filter((row, index) => {
      return index !== rowIndexToBeDeleted;
    }));
    deleteRowData(original);
  };

  const loadNextPage = (...args) => {
    const newIndex = args && args.length > 0 ? args[0] : -1;

    if (newIndex >= 0 && hasNextPage) {
      setIsNextPageLoading(true);
      fetchData(newIndex).then(data => {
        setHasNextPage(data && data.length > 0);
        setIsNextPageLoading(false);
        setItems(items.concat(data));
      });
    }
  };

  useEffect(() => {
    fetchData(0).then(data => {
      setItems(data);
    });
  }, []);

  if (items && items.length > 0) {
    return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Customgrid, {
      title: title,
      gridHeight: gridHeight,
      gridWidth: gridWidth,
      managableColumns: gridColumns,
      originalColumns: gridColumns,
      data: items,
      deletePopUpOverLay: deletePopUpOverLay,
      deleteRowFromGrid: deleteRowFromGrid,
      globalSearchLogic: globalSearchLogic,
      updateCellData: updateCellData,
      selectBulkData: selectBulkData,
      calculateRowHeight: calculateRowHeight,
      renderExpandedContent: renderExpandedContent,
      hasNextPage: hasNextPage,
      isNextPageLoading: isNextPageLoading,
      loadNextPage: loadNextPage
    }), isNextPageLoading ? /*#__PURE__*/React.createElement("h2", {
      style: {
        textAlign: "center"
      }
    }, "Loading...") : null);
  } else {
    return /*#__PURE__*/React.createElement("h2", {
      style: {
        textAlign: "center",
        marginTop: "70px"
      }
    }, "Initializing Grid...");
  }
});

export default Grid;
//# sourceMappingURL=index.modern.js.map
