import React__default, { createContext, useContext, Fragment, memo, useState, forwardRef, useRef, useEffect, useMemo, useCallback, createRef } from 'react';
import ClickAwayListener from 'react-click-away-listener';
import PropTypes from 'prop-types';
import { useAsyncDebounce, useTable, useFilters, useGlobalFilter, useSortBy, useExpanded, useRowSelect, useFlexLayout, useResizeColumns } from 'react-table';
import { VariableSizeList } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import InfiniteLoader from 'react-window-infinite-loader';
import { useDrag, useDrop, DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';
import MultiBackend, { TouchTransition } from 'react-dnd-multi-backend';
import update from 'immutability-helper';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { saveAs } from 'file-saver';
import { utils, write } from 'xlsx';
import '!style-loader!css-loader!sass-loader!./Styles/main.scss';

function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }

  return target;
}

var CellDisplayAndEditContext = /*#__PURE__*/createContext({});
var RowEditContext = /*#__PURE__*/createContext({});
var AdditionalColumnContext = /*#__PURE__*/createContext({});

var checkInnerCells = function checkInnerCells(column, cellKey) {
  if (column) {
    var innerCells = column.innerCells;

    if (innerCells) {
      var innerCellData = innerCells.find(function (cell) {
        return cell.accessor === cellKey;
      });

      if (innerCellData) {
        return true;
      }
    }
  }

  return false;
};

var CellDisplayAndEditTag = function CellDisplayAndEditTag(props) {
  var contextVallues = useContext(CellDisplayAndEditContext);
  var column = contextVallues.column,
      columns = contextVallues.columns;
  var cellKey = props.cellKey,
      columnKey = props.columnKey;

  if (columns && columnKey) {
    var selectedColumn = columns.find(function (col) {
      return col.accessor === columnKey;
    });

    if (checkInnerCells(selectedColumn, cellKey)) {
      return /*#__PURE__*/React__default.createElement(Fragment, null, " ", props.children);
    }
  } else if (cellKey) {
    if (checkInnerCells(column, cellKey)) {
      return /*#__PURE__*/React__default.createElement(Fragment, null, " ", props.children);
    }
  }

  return null;
};

var CellDisplayAndEdit = /*#__PURE__*/memo(function (_ref) {
  var row = _ref.row,
      columns = _ref.columns,
      updateRowInGrid = _ref.updateRowInGrid;
  var column = row.column;

  if (column && row.row) {
    var _useState = useState(false),
        isEditOpen = _useState[0],
        setIsEditOpen = _useState[1];

    var _useState2 = useState(null),
        editedRowValue = _useState2[0],
        setEditedRowValue = _useState2[1];

    var id = column.id;

    var closeEdit = function closeEdit() {
      setIsEditOpen(false);
    };

    var openEdit = function openEdit() {
      setIsEditOpen(true);
    };

    var getUpdatedRowValue = function getUpdatedRowValue(value) {
      if (value) {
        setEditedRowValue(value);
      }
    };

    var saveEdit = function saveEdit() {
      if (editedRowValue) {
        updateRowInGrid(row.row.original, editedRowValue);
      }

      closeEdit();
    };

    var originalRowValue = _extends({}, row.row.original);

    var cellDisplayContent = column.displayCell(originalRowValue, CellDisplayAndEditTag);
    var cellEditContent = column.editCell ? column.editCell(originalRowValue, CellDisplayAndEditTag, getUpdatedRowValue) : null;
    return /*#__PURE__*/React__default.createElement(CellDisplayAndEditContext.Provider, {
      value: {
        columns: columns,
        column: column
      }
    }, /*#__PURE__*/React__default.createElement(ClickAwayListener, {
      onClickAway: closeEdit
    }, /*#__PURE__*/React__default.createElement("div", {
      className: "table-cell--content table-cell--content__" + id
    }, cellEditContent ? /*#__PURE__*/React__default.createElement("div", {
      className: "cell-edit",
      role: "presentation",
      onClick: openEdit
    }, /*#__PURE__*/React__default.createElement("i", {
      className: "fa fa-pencil",
      "aria-hidden": "true"
    })) : null, cellDisplayContent, isEditOpen ? /*#__PURE__*/React__default.createElement("div", {
      className: "table-cell--content-edit"
    }, cellEditContent, /*#__PURE__*/React__default.createElement("button", {
      type: "button",
      "aria-label": "Mute volume",
      className: "ok",
      "data-testid": "ok",
      onClick: saveEdit
    }), /*#__PURE__*/React__default.createElement("button", {
      type: "button",
      "aria-label": "Mute volume",
      className: "cancel",
      "data-testid": "cancel",
      onClick: closeEdit
    })) : null)));
  }
});
CellDisplayAndEdit.propTypes = {
  row: PropTypes.any,
  columns: PropTypes.any,
  updateRowInGrid: PropTypes.any,
  cellKey: PropTypes.any,
  columnKey: PropTypes.any,
  children: PropTypes.any
};

var extractColumns = function extractColumns(columns, searchColumn, isDesktop, updateRowInGrid) {
  var filteredColumns = columns.filter(function (column) {
    return isDesktop ? !column.onlyInTablet : !column.onlyInDesktop;
  });
  var modifiedColumns = [];
  filteredColumns.forEach(function (column, index) {
    var innerCells = column.innerCells,
        accessor = column.accessor,
        sortValue = column.sortValue;
    var isInnerCellsPresent = innerCells && innerCells.length > 0;
    var elem = column;
    elem.columnId = "column_" + index;
    elem.displayInExpandedRegion = false;

    if (!elem.Cell && elem.displayCell) {
      elem.Cell = function (row) {
        return /*#__PURE__*/React__default.createElement(CellDisplayAndEdit, {
          row: row,
          columns: columns,
          updateRowInGrid: updateRowInGrid
        });
      };
    }

    if (!elem.disableSortBy) {
      if (isInnerCellsPresent) {
        if (sortValue) {
          elem.sortType = function (rowA, rowB) {
            return rowA.original[accessor][sortValue] > rowB.original[accessor][sortValue] ? -1 : 1;
          };
        } else {
          elem.disableSortBy = true;
        }
      } else if (!innerCells) {
        elem.sortType = function (rowA, rowB) {
          return rowA.original[accessor] > rowB.original[accessor] ? -1 : 1;
        };
      }
    }

    if (!elem.disableFilters) {
      elem.filter = function (rows, id, filterValue) {
        var searchText = filterValue ? filterValue.toLowerCase() : "";
        return rows.filter(function (row) {
          var original = row.original;
          return searchColumn(column, original, searchText);
        });
      };
    }

    modifiedColumns.push(column);
  });
  return modifiedColumns;
};
var extractAdditionalColumn = function extractAdditionalColumn(additionalColumn, isDesktop) {
  var innerCells = additionalColumn.innerCells;
  var isInnerCellsPresent = innerCells && innerCells.length > 0;
  var element = additionalColumn;
  element.columnId = "ExpandColumn";
  element.displayInExpandedRegion = true;

  if (isInnerCellsPresent) {
    element.innerCells = innerCells.filter(function (cell) {
      return isDesktop ? !cell.onlyInTablet : !cell.onlyInDesktop;
    });
  }

  return additionalColumn;
};

var AdditionalColumnTag = function AdditionalColumnTag(props) {
  var contextVallues = useContext(AdditionalColumnContext);
  var additionalColumn = contextVallues.additionalColumn;
  var cellKey = props.cellKey;

  if (additionalColumn && cellKey) {
    if (checkInnerCells(additionalColumn, cellKey)) {
      return /*#__PURE__*/React__default.createElement(Fragment, null, " ", props.children);
    }
  }

  return null;
};

var RowSelector = /*#__PURE__*/memo( /*#__PURE__*/forwardRef(function (_ref, ref) {
  var indeterminate = _ref.indeterminate,
      rest = _objectWithoutPropertiesLoose(_ref, ["indeterminate"]);

  var _useState = useState(indeterminate),
      checkValue = _useState[0],
      setCheckValue = _useState[1];

  var defaultRef = useRef();
  var resolvedRef = ref || defaultRef;

  var onChange = function onChange() {
    setCheckValue(!indeterminate);
  };

  useEffect(function () {
    resolvedRef.current.indeterminate = indeterminate;
  }, [resolvedRef, indeterminate]);
  return /*#__PURE__*/React__default.createElement("div", {
    className: "check-wrap"
  }, /*#__PURE__*/React__default.createElement("input", _extends({
    type: "checkbox",
    checked: checkValue,
    onChange: onChange,
    ref: resolvedRef
  }, rest)));
}));
RowSelector.propTypes = {
  indeterminate: PropTypes.any
};

var DefaultColumnFilter = /*#__PURE__*/memo(function (_ref) {
  var _ref$column = _ref.column,
      filterValue = _ref$column.filterValue,
      setFilter = _ref$column.setFilter;
  return /*#__PURE__*/React__default.createElement("input", {
    className: "txt",
    value: filterValue || "",
    onChange: function onChange(e) {
      setFilter(e.target.value || undefined);
    },
    placeholder: "Search"
  });
});
DefaultColumnFilter.propTypes = {
  column: PropTypes.any
};

var IconSearch = require("./icon-search~PApihVHT.svg");

var GlobalFilter = /*#__PURE__*/memo(function (_ref) {
  var globalFilter = _ref.globalFilter,
      setGlobalFilter = _ref.setGlobalFilter;

  var _useState = useState(globalFilter),
      value = _useState[0],
      setValue = _useState[1];

  var _onChange = useAsyncDebounce(function (value) {
    setGlobalFilter(value || undefined);
  }, 200);

  return /*#__PURE__*/React__default.createElement("div", {
    className: "txt-wrap"
  }, /*#__PURE__*/React__default.createElement("input", {
    type: "text",
    value: value || "",
    onChange: function onChange(e) {
      setValue(e.target.value);

      _onChange(e.target.value);
    },
    className: "txt",
    placeholder: "Search"
  }), /*#__PURE__*/React__default.createElement("i", null, /*#__PURE__*/React__default.createElement("img", {
    src: IconSearch
  })));
});
GlobalFilter.propTypes = {
  globalFilter: PropTypes.any,
  setGlobalFilter: PropTypes.any
};

var RowDelete = require("./RowDelete~RKolkpAF.svg");

var RowEdit = require("./RowEdit~BuKwAcSl.svg");

var RowPin = require("./RowPin~qQRdvcXq.png");

var RowOptions = /*#__PURE__*/memo(function (_ref) {
  var row = _ref.row,
      rowActions = _ref.rowActions,
      rowActionCallback = _ref.rowActionCallback,
      bindRowEditOverlay = _ref.bindRowEditOverlay,
      bindRowDeleteOverlay = _ref.bindRowDeleteOverlay;
  var original = row.original;
  var isAdditionalRowOptionsPresent = rowActions && rowActions.length > 0 && typeof rowActionCallback === "function";

  var _useState = useState(false),
      isRowOptionsOpen = _useState[0],
      setRowOptionsOpen = _useState[1];

  var openRowOptionsOverlay = function openRowOptionsOverlay() {
    setRowOptionsOpen(true);
  };

  var closeRowOptionsOverlay = function closeRowOptionsOverlay() {
    setRowOptionsOpen(false);
  };

  var openRowEditOverlay = function openRowEditOverlay() {
    bindRowEditOverlay(original);
    closeRowOptionsOverlay();
  };

  var openDeleteOverlay = function openDeleteOverlay() {
    bindRowDeleteOverlay(original);
    closeRowOptionsOverlay();
  };

  var additionalActionClicked = function additionalActionClicked(actionValue) {
    return rowActionCallback(original, actionValue);
  };

  return /*#__PURE__*/React__default.createElement("div", null, /*#__PURE__*/React__default.createElement("div", {
    className: "row-options-wrap"
  }, /*#__PURE__*/React__default.createElement("span", {
    className: "icon-row-options",
    role: "presentation",
    onClick: openRowOptionsOverlay
  }, /*#__PURE__*/React__default.createElement("i", null), /*#__PURE__*/React__default.createElement("i", null), /*#__PURE__*/React__default.createElement("i", null)), isRowOptionsOpen ? /*#__PURE__*/React__default.createElement(ClickAwayListener, {
    onClickAway: closeRowOptionsOverlay
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "row-options-overlay"
  }, /*#__PURE__*/React__default.createElement("ul", null, /*#__PURE__*/React__default.createElement("li", null, /*#__PURE__*/React__default.createElement("span", {
    role: "presentation",
    onClick: openRowEditOverlay
  }, /*#__PURE__*/React__default.createElement("i", null, /*#__PURE__*/React__default.createElement("img", {
    src: RowEdit,
    alt: "cargo"
  })), /*#__PURE__*/React__default.createElement("span", null, "Edit"))), /*#__PURE__*/React__default.createElement("li", null, /*#__PURE__*/React__default.createElement("span", null, /*#__PURE__*/React__default.createElement("i", null, /*#__PURE__*/React__default.createElement("img", {
    src: RowPin,
    alt: "cargo",
    width: "15",
    height: "15"
  })), /*#__PURE__*/React__default.createElement("span", null, "Pin This row"))), /*#__PURE__*/React__default.createElement("li", null, /*#__PURE__*/React__default.createElement("span", {
    role: "presentation",
    onClick: openDeleteOverlay
  }, /*#__PURE__*/React__default.createElement("i", null, /*#__PURE__*/React__default.createElement("img", {
    src: RowDelete,
    alt: "cargo"
  })), /*#__PURE__*/React__default.createElement("span", null, "Delete"))), isAdditionalRowOptionsPresent ? rowActions.map(function (action) {
    var value = action.value,
        label = action.label;
    return /*#__PURE__*/React__default.createElement("li", {
      key: value
    }, /*#__PURE__*/React__default.createElement("span", {
      role: "presentation",
      onClick: function onClick() {
        return additionalActionClicked(value);
      }
    }, /*#__PURE__*/React__default.createElement("span", null, label)));
  }) : null), /*#__PURE__*/React__default.createElement("span", {
    role: "presentation",
    className: "close",
    onClick: closeRowOptionsOverlay
  }, /*#__PURE__*/React__default.createElement("i", {
    className: "fa fa-close"
  })))) : null));
});
RowOptions.propTypes = {
  row: PropTypes.any,
  bindRowEditOverlay: PropTypes.any,
  bindRowDeleteOverlay: PropTypes.any
};

var RowEditTag = function RowEditTag(props) {
  var contextVallues = useContext(RowEditContext);
  var columns = contextVallues.columns,
      additionalColumn = contextVallues.additionalColumn,
      isRowExpandEnabled = contextVallues.isRowExpandEnabled;
  var cellKey = props.cellKey,
      columnKey = props.columnKey;

  if (columns && columnKey) {
    var selectedColumn = columns.find(function (col) {
      return col.accessor === columnKey;
    });

    if (selectedColumn && cellKey) {
      if (checkInnerCells(selectedColumn, cellKey)) {
        return /*#__PURE__*/React__default.createElement(Fragment, null, " ", props.children);
      }
    } else if (!selectedColumn && isRowExpandEnabled && additionalColumn) {
      if (checkInnerCells(additionalColumn, columnKey)) {
        return /*#__PURE__*/React__default.createElement(Fragment, null, " ", props.children);
      }
    }
  }

  return null;
};

var RowEditOverLay = /*#__PURE__*/memo(function (_ref) {
  var row = _ref.row,
      columns = _ref.columns,
      isRowExpandEnabled = _ref.isRowExpandEnabled,
      additionalColumn = _ref.additionalColumn,
      getRowEditOverlay = _ref.getRowEditOverlay,
      closeRowEditOverlay = _ref.closeRowEditOverlay,
      updateRowInGrid = _ref.updateRowInGrid;

  var _useState = useState(null),
      editedRowValue = _useState[0],
      setEditedRowValue = _useState[1];

  var getUpdatedRowValue = function getUpdatedRowValue(value) {
    if (value) {
      setEditedRowValue(value);
    }
  };

  var saveRowEdit = function saveRowEdit() {
    if (editedRowValue) {
      updateRowInGrid(row, editedRowValue);
    }

    closeRowEditOverlay();
  };

  var originalRowValue = _extends({}, row);

  var rowEditContent = getRowEditOverlay(originalRowValue, RowEditTag, getUpdatedRowValue);
  return /*#__PURE__*/React__default.createElement(RowEditContext.Provider, {
    value: {
      columns: columns,
      additionalColumn: additionalColumn,
      isRowExpandEnabled: isRowExpandEnabled
    }
  }, /*#__PURE__*/React__default.createElement(ClickAwayListener, {
    className: "row-option-action-overlay",
    onClickAway: closeRowEditOverlay
  }, rowEditContent, /*#__PURE__*/React__default.createElement("div", {
    className: "cancel-save-buttons"
  }, /*#__PURE__*/React__default.createElement("button", {
    type: "button",
    className: "save-Button",
    onClick: saveRowEdit
  }, "Save"), /*#__PURE__*/React__default.createElement("button", {
    type: "button",
    className: "cancel-Button",
    onClick: closeRowEditOverlay
  }, "Cancel"))));
});
RowEditOverLay.propTypes = {
  row: PropTypes.any,
  columns: PropTypes.any,
  isRowExpandEnabled: PropTypes.any,
  additionalColumn: PropTypes.any,
  getRowEditOverlay: PropTypes.any,
  closeRowEditOverlay: PropTypes.any,
  updateRowInGrid: PropTypes.any,
  cellKey: PropTypes.any,
  columnKey: PropTypes.any,
  children: PropTypes.any
};

var RowDeleteOverLay = /*#__PURE__*/memo(function (_ref) {
  var row = _ref.row,
      closeRowDeleteOverlay = _ref.closeRowDeleteOverlay,
      deleteRowFromGrid = _ref.deleteRowFromGrid;

  var deleteRow = function deleteRow() {
    if (row) {
      deleteRowFromGrid(row);
    }

    closeRowDeleteOverlay();
  };

  return /*#__PURE__*/React__default.createElement(ClickAwayListener, {
    className: "row-option-action-overlay delete",
    onClickAway: closeRowDeleteOverlay
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "cancel-save-buttons-delete"
  }, /*#__PURE__*/React__default.createElement("button", {
    type: "button",
    className: "delete-Button",
    onClick: deleteRow
  }, "Delete"), /*#__PURE__*/React__default.createElement("button", {
    type: "button",
    className: "cancel-Button",
    onClick: closeRowDeleteOverlay
  }, "Cancel")));
});
RowDeleteOverLay.propTypes = {
  row: PropTypes.any,
  closeRowDeleteOverlay: PropTypes.any,
  deleteRowFromGrid: PropTypes.any
};

var ItemTypes = {
  COLUMN: "column"
};

var ColumnItem = function ColumnItem(_ref) {
  var id = _ref.id,
      Header = _ref.Header,
      moveColumn = _ref.moveColumn,
      findColumn = _ref.findColumn,
      originalInnerCells = _ref.originalInnerCells,
      isInnerCellSelected = _ref.isInnerCellSelected,
      selectInnerCells = _ref.selectInnerCells;
  var originalIndex = findColumn(id).index;

  var _useDrag = useDrag({
    item: {
      type: ItemTypes.COLUMN,
      id: id,
      originalIndex: originalIndex
    },
    collect: function collect(monitor) {
      return {
        isDragging: monitor.isDragging()
      };
    },
    end: function end(dropResult, monitor) {
      var _monitor$getItem = monitor.getItem(),
          droppedId = _monitor$getItem.id,
          originalIndex = _monitor$getItem.originalIndex;

      var didDrop = monitor.didDrop();

      if (!didDrop) {
        moveColumn(droppedId, originalIndex);
      }
    }
  }),
      isDragging = _useDrag[0].isDragging,
      drag = _useDrag[1];

  var _useDrop = useDrop({
    accept: ItemTypes.COLUMN,
    canDrop: function canDrop() {
      return false;
    },
    hover: function hover(_ref2) {
      var draggedId = _ref2.id;

      if (draggedId !== id) {
        var _findColumn = findColumn(id),
            overIndex = _findColumn.index;

        moveColumn(draggedId, overIndex);
      }
    }
  }),
      drop = _useDrop[1];

  var opacity = isDragging ? 0.1 : 1;
  return /*#__PURE__*/React__default.createElement("div", {
    style: {
      opacity: opacity
    }
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "column__reorder"
  }, /*#__PURE__*/React__default.createElement("div", {
    ref: function ref(node) {
      return drag(drop(node));
    },
    style: {
      cursor: "move"
    },
    className: ""
  }, /*#__PURE__*/React__default.createElement("i", {
    className: "fa fa-align-justify",
    "aria-hidden": "true"
  })), /*#__PURE__*/React__default.createElement("div", {
    className: ""
  }, Header), /*#__PURE__*/React__default.createElement("div", {
    className: "column__innerCells__wrap"
  }, originalInnerCells && originalInnerCells.length > 0 ? originalInnerCells.map(function (cell, index) {
    return /*#__PURE__*/React__default.createElement("div", {
      className: "column__wrap",
      key: index
    }, /*#__PURE__*/React__default.createElement("div", {
      className: "column__checkbox"
    }, /*#__PURE__*/React__default.createElement("input", {
      type: "checkbox",
      "data-columnheader": Header,
      value: cell.Header,
      checked: isInnerCellSelected(Header, cell.Header),
      onChange: selectInnerCells
    })), /*#__PURE__*/React__default.createElement("div", {
      className: "column__txt"
    }, cell.Header));
  }) : null)));
};

ColumnItem.propTypes = {
  id: PropTypes.any,
  Header: PropTypes.any,
  moveColumn: PropTypes.any,
  findColumn: PropTypes.any,
  originalInnerCells: PropTypes.any,
  isInnerCellSelected: PropTypes.any,
  selectInnerCells: PropTypes.any
};

var ColumnsList = function ColumnsList(props) {
  var updateColumnsInState = props.updateColumnsInState,
      columnsToManage = props.columnsToManage,
      isInnerCellSelected = props.isInnerCellSelected,
      selectInnerCells = props.selectInnerCells;

  var findColumn = function findColumn(columnId) {
    var column = columnsToManage.filter(function (c) {
      return "" + c.columnId === columnId;
    })[0];
    return {
      column: column,
      index: columnsToManage.indexOf(column)
    };
  };

  var moveColumn = function moveColumn(columnId, atIndex) {
    var _findColumn = findColumn(columnId),
        column = _findColumn.column,
        index = _findColumn.index;

    updateColumnsInState(update(columnsToManage, {
      $splice: [[index, 1], [atIndex, 0, column]]
    }));
  };

  var _useDrop = useDrop({
    accept: ItemTypes.COLUMN
  }),
      drop = _useDrop[1];

  return /*#__PURE__*/React__default.createElement(Fragment, null, /*#__PURE__*/React__default.createElement("div", {
    ref: drop,
    style: {
      display: "flex",
      flexWrap: "wrap"
    }
  }, columnsToManage.map(function (column, index) {
    return /*#__PURE__*/React__default.createElement(ColumnItem, {
      key: index,
      id: "" + column.columnId,
      Header: "" + column.Header,
      moveColumn: moveColumn,
      findColumn: findColumn,
      originalInnerCells: column.originalInnerCells,
      isInnerCellSelected: isInnerCellSelected,
      selectInnerCells: selectInnerCells
    });
  })));
};

ColumnsList.propTypes = {
  updateColumnsInState: PropTypes.any,
  columnsToManage: PropTypes.any,
  isInnerCellSelected: PropTypes.any,
  selectInnerCells: PropTypes.any
};

var ColumnReordering = /*#__PURE__*/memo(function (props) {
  var isManageColumnOpen = props.isManageColumnOpen,
      toggleManageColumns = props.toggleManageColumns,
      originalColumns = props.originalColumns,
      isExpandContentAvailable = props.isExpandContentAvailable,
      additionalColumn = props.additionalColumn;
  var additionalColumnHeader = additionalColumn && additionalColumn.length ? additionalColumn[0].Header : "";

  var getRemarksColumnIfAvailable = function getRemarksColumnIfAvailable() {
    return isExpandContentAvailable ? additionalColumn : [];
  };

  var concatedOriginalColumns = originalColumns.concat(getRemarksColumnIfAvailable());

  var _useState = useState(originalColumns),
      managedColumns = _useState[0],
      setManagedColumns = _useState[1];

  var _useState2 = useState(concatedOriginalColumns),
      searchedColumns = _useState2[0],
      setSearchedColumns = _useState2[1];

  var _useState3 = useState(getRemarksColumnIfAvailable),
      remarksColumnToManage = _useState3[0],
      setRemarksColumnToManage = _useState3[1];

  var _useState4 = useState(false),
      isErrorDisplayed = _useState4[0],
      setIsErrorDisplayed = _useState4[1];

  var HTML5toTouch = {
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

  var filterColumnsList = function filterColumnsList(event) {
    var _ref = event ? event.target : "",
        value = _ref.value;

    value = value ? value.toLowerCase() : "";

    if (value !== "") {
      setSearchedColumns(originalColumns.filter(function (column) {
        return column.Header.toLowerCase().includes(value);
      }).concat(getRemarksColumnIfAvailable().filter(function (column) {
        return column.Header.toLowerCase().includes(value);
      })));
    } else {
      setSearchedColumns(concatedOriginalColumns);
    }
  };

  var updateColumnsInState = function updateColumnsInState(columns) {
    setManagedColumns(columns);
  };

  var findColumn = function findColumn(columnList, columnHeader) {
    return columnList.find(function (column) {
      return column.Header === columnHeader;
    });
  };

  var isItemPresentInList = function isItemPresentInList(list, headerValue) {
    var filteredList = list.filter(function (item) {
      return item.Header === headerValue;
    });
    return filteredList && filteredList.length > 0;
  };

  var isCheckboxSelected = function isCheckboxSelected(header) {
    if (header === additionalColumnHeader) {
      return remarksColumnToManage.length > 0;
    }

    if (header === "Select All") {
      return searchedColumns.length === managedColumns.length + remarksColumnToManage.length;
    }

    return isItemPresentInList(managedColumns, header);
  };

  var isInnerCellSelected = function isInnerCellSelected(columnHeader, header) {
    var columnListToSearch = columnHeader === additionalColumnHeader ? remarksColumnToManage : managedColumns;
    var selectedColumn = findColumn(columnListToSearch, columnHeader);
    return isItemPresentInList(selectedColumn.innerCells, header);
  };

  var findIndexOfItem = function findIndexOfItem(type, columnsList, indexOfColumnToAdd, columnHeader, originalInnerCells) {
    if (type === "column") {
      return columnsList.findIndex(function (column) {
        return column.Header === originalColumns[indexOfColumnToAdd].Header;
      });
    }

    return findColumn(columnsList, columnHeader).innerCells.findIndex(function (cell) {
      return cell.Header === originalInnerCells[indexOfColumnToAdd].Header;
    });
  };

  var selectAllColumns = function selectAllColumns(event) {
    if (event.currentTarget.checked) {
      setManagedColumns(originalColumns);
      setRemarksColumnToManage(getRemarksColumnIfAvailable());
    } else {
      setManagedColumns([]);
      setRemarksColumnToManage([]);
    }
  };

  var selectSingleColumn = function selectSingleColumn(event) {
    var currentTarget = event.currentTarget;
    var checked = currentTarget.checked,
        value = currentTarget.value;

    if (value === additionalColumnHeader) {
      if (checked) {
        setRemarksColumnToManage(additionalColumn);
      } else {
        setRemarksColumnToManage([]);
      }
    } else {
      if (checked) {
        var indexOfColumnToAdd = originalColumns.findIndex(function (column) {
          return column.Header === value;
        });
        var itemToAdd = originalColumns[indexOfColumnToAdd];
        var prevItemIndex = -1;

        while (indexOfColumnToAdd > 0 && prevItemIndex === -1) {
          indexOfColumnToAdd -= 1;
          prevItemIndex = findIndexOfItem("column", managedColumns, indexOfColumnToAdd);
        }

        var newColumnsList = [].concat(managedColumns);
        newColumnsList.splice(prevItemIndex + 1, 0, itemToAdd);
        setManagedColumns(newColumnsList);
      } else {
        setManagedColumns(managedColumns.filter(function (column) {
          return column.Header !== value;
        }));
      }
    }
  };

  var findAndSelectInnerCells = function findAndSelectInnerCells(stateColumnList, setStateColumnList, event) {
    var currentTarget = event.currentTarget;
    var checked = currentTarget.checked,
        dataset = currentTarget.dataset,
        value = currentTarget.value;
    var columnheader = dataset.columnheader;
    var selectedColumn = findColumn(stateColumnList, columnheader);
    var originalInnerCells = selectedColumn.originalInnerCells;

    if (originalInnerCells && originalInnerCells.length > 0) {
      if (checked) {
        var indexOfColumnToAdd = originalInnerCells.findIndex(function (column) {
          return column.Header === value;
        });
        var itemToAdd = originalInnerCells[indexOfColumnToAdd];
        var prevItemIndex = -1;

        while (indexOfColumnToAdd > 0 && prevItemIndex === -1) {
          indexOfColumnToAdd -= 1;
          prevItemIndex = findIndexOfItem("innercell", stateColumnList, indexOfColumnToAdd, columnheader, originalInnerCells);
        }

        var newColumnsList = [].concat(stateColumnList);
        findColumn(newColumnsList, columnheader).innerCells.splice(prevItemIndex + 1, 0, itemToAdd);
        setStateColumnList(newColumnsList);
      } else {
        setStateColumnList(stateColumnList.map(function (column) {
          if (column.Header === columnheader) {
            column.innerCells = column.innerCells.filter(function (cell) {
              return cell.Header !== value;
            });
          }

          return column;
        }));
      }
    }
  };

  var selectInnerCells = function selectInnerCells(event) {
    findAndSelectInnerCells(managedColumns, setManagedColumns, event);
  };

  var selectRemarksInnerCells = function selectRemarksInnerCells(event) {
    findAndSelectInnerCells(remarksColumnToManage, setRemarksColumnToManage, event);
  };

  var doColumnUpdate = function doColumnUpdate() {
    setIsErrorDisplayed(false);

    if (managedColumns && managedColumns.length > 0) {
      setSearchedColumns(concatedOriginalColumns);
      props.updateColumnStructure(managedColumns, remarksColumnToManage);
      toggleManageColumns();
    } else {
      setIsErrorDisplayed(true);
    }
  };

  var resetInnerCells = function resetInnerCells(columnList) {
    if (columnList && columnList.length) {
      return columnList.map(function (column) {
        column.innerCells = column.originalInnerCells;
        return column;
      });
    }

    return columnList;
  };

  var resetColumnUpdate = function resetColumnUpdate() {
    setManagedColumns(resetInnerCells(originalColumns));
    setSearchedColumns(originalColumns.concat(getRemarksColumnIfAvailable()));
    setRemarksColumnToManage(resetInnerCells(getRemarksColumnIfAvailable()));
    setIsErrorDisplayed(false);
    props.updateColumnStructure(originalColumns, getRemarksColumnIfAvailable());
  };

  if (isManageColumnOpen) {
    return /*#__PURE__*/React__default.createElement(ClickAwayListener, {
      onClickAway: toggleManageColumns
    }, /*#__PURE__*/React__default.createElement("div", {
      className: "neo-popover neo-popover--column columns--grid"
    }, /*#__PURE__*/React__default.createElement("div", {
      className: "neo-popover__column column__grid"
    }, /*#__PURE__*/React__default.createElement("div", {
      className: "column__chooser"
    }, /*#__PURE__*/React__default.createElement("div", {
      className: "column__header"
    }, /*#__PURE__*/React__default.createElement("div", {
      className: ""
    }, /*#__PURE__*/React__default.createElement("strong", null, "Column Chooser"))), /*#__PURE__*/React__default.createElement("div", {
      className: "column__body"
    }, /*#__PURE__*/React__default.createElement("div", null, /*#__PURE__*/React__default.createElement("input", {
      type: "text",
      placeholder: "Search column",
      className: "custom__ctrl",
      onChange: filterColumnsList
    })), /*#__PURE__*/React__default.createElement("div", {
      className: "column__selectAll"
    }, /*#__PURE__*/React__default.createElement("div", {
      className: "column__checkbox"
    }, /*#__PURE__*/React__default.createElement("input", {
      type: "checkbox",
      value: "Select All",
      checked: isCheckboxSelected("Select All"),
      onChange: selectAllColumns
    })), /*#__PURE__*/React__default.createElement("div", {
      className: "column__selectTxt"
    }, "Select All")), searchedColumns.map(function (column, index) {
      return /*#__PURE__*/React__default.createElement("div", {
        className: "column__wrap",
        key: index
      }, /*#__PURE__*/React__default.createElement("div", {
        className: "column__checkbox"
      }, /*#__PURE__*/React__default.createElement("input", {
        type: "checkbox",
        value: column.Header,
        checked: isCheckboxSelected(column.Header),
        onChange: selectSingleColumn
      })), /*#__PURE__*/React__default.createElement("div", {
        className: "column__txt"
      }, column.Header));
    }))), /*#__PURE__*/React__default.createElement("div", {
      className: "column__settings"
    }, /*#__PURE__*/React__default.createElement("div", {
      className: "column__header"
    }, /*#__PURE__*/React__default.createElement("div", {
      className: "column__headerTxt"
    }, /*#__PURE__*/React__default.createElement("strong", null, "Column Settings"), isErrorDisplayed ? /*#__PURE__*/React__default.createElement("strong", {
      style: {
        marginLeft: "10px",
        color: "red"
      }
    }, "Select at least one column (other than ", additionalColumnHeader, ")") : null), /*#__PURE__*/React__default.createElement("div", {
      className: "column__close",
      role: "presentation",
      onClick: toggleManageColumns
    }, /*#__PURE__*/React__default.createElement("i", {
      className: "fa fa-times",
      "aria-hidden": "true"
    }))), /*#__PURE__*/React__default.createElement("div", {
      className: "column__body"
    }, /*#__PURE__*/React__default.createElement(DndProvider, {
      backend: MultiBackend,
      options: HTML5toTouch
    }, /*#__PURE__*/React__default.createElement(ColumnsList, {
      columnsToManage: managedColumns,
      updateColumnsInState: updateColumnsInState,
      isInnerCellSelected: isInnerCellSelected,
      selectInnerCells: selectInnerCells
    })), remarksColumnToManage && remarksColumnToManage.length > 0 ? /*#__PURE__*/React__default.createElement("div", {
      className: "column__reorder full-width"
    }, /*#__PURE__*/React__default.createElement("div", {
      className: ""
    }, remarksColumnToManage[0].Header), /*#__PURE__*/React__default.createElement("div", {
      className: "column__innerCells__wrap"
    }, remarksColumnToManage[0].originalInnerCells && remarksColumnToManage[0].originalInnerCells.length > 0 ? remarksColumnToManage[0].originalInnerCells.map(function (cell, index) {
      return /*#__PURE__*/React__default.createElement("div", {
        className: "column__wrap",
        key: index
      }, /*#__PURE__*/React__default.createElement("div", {
        className: "column__checkbox"
      }, /*#__PURE__*/React__default.createElement("input", {
        type: "checkbox",
        "data-columnheader": remarksColumnToManage[0].Header,
        value: cell.Header,
        checked: isInnerCellSelected(remarksColumnToManage[0].Header, cell.Header),
        onChange: selectRemarksInnerCells
      })), /*#__PURE__*/React__default.createElement("div", {
        className: "column__txt"
      }, cell.Header));
    }) : null)) : null), /*#__PURE__*/React__default.createElement("div", {
      className: "column__footer"
    }, /*#__PURE__*/React__default.createElement("div", {
      className: "column__btns"
    }, /*#__PURE__*/React__default.createElement("button", {
      type: "button",
      className: "btns",
      onClick: resetColumnUpdate
    }, "Reset"), /*#__PURE__*/React__default.createElement("button", {
      type: "button",
      className: "btns",
      onClick: toggleManageColumns
    }, "Cancel"), /*#__PURE__*/React__default.createElement("button", {
      type: "button",
      className: "btns btns__save",
      onClick: doColumnUpdate
    }, "Save")))))));
  }

  return /*#__PURE__*/React__default.createElement("div", null);
});
ColumnReordering.propTypes = {
  isManageColumnOpen: PropTypes.any,
  toggleManageColumns: PropTypes.any,
  originalColumns: PropTypes.any,
  isExpandContentAvailable: PropTypes.any,
  additionalColumn: PropTypes.any,
  updateColumnStructure: PropTypes.any
};

var ItemTypes$1 = {
  SORT_ITEM: "SORT_ITEM"
};

var SortCopy = require("./SortCopy~IGKyJbDR.svg");

var SortDelete = require("./SortDelete~MFpZtzWS.svg");

var SortItem = function SortItem(_ref) {
  var id = _ref.id,
      sortOption = _ref.sortOption,
      originalColumns = _ref.originalColumns,
      moveSort = _ref.moveSort,
      findSort = _ref.findSort,
      updateSingleSortingOption = _ref.updateSingleSortingOption,
      copySortOption = _ref.copySortOption,
      deleteSortOption = _ref.deleteSortOption;
  var originalIndex = findSort(id).index;

  var _useDrag = useDrag({
    item: {
      type: ItemTypes$1.SORT_ITEM,
      id: id,
      originalIndex: originalIndex
    },
    collect: function collect(monitor) {
      return {
        isDragging: monitor.isDragging()
      };
    },
    end: function end(dropResult, monitor) {
      var _monitor$getItem = monitor.getItem(),
          droppedId = _monitor$getItem.id,
          originalIndex = _monitor$getItem.originalIndex;

      var didDrop = monitor.didDrop();

      if (!didDrop) {
        moveSort(droppedId, originalIndex);
      }
    }
  }),
      isDragging = _useDrag[0].isDragging,
      drag = _useDrag[1];

  var _useDrop = useDrop({
    accept: ItemTypes$1.SORT_ITEM,
    canDrop: function canDrop() {
      return false;
    },
    hover: function hover(_ref2) {
      var draggedId = _ref2.id;

      if (draggedId !== id) {
        var _findSort = findSort(id),
            overIndex = _findSort.index;

        moveSort(draggedId, overIndex);
      }
    }
  }),
      drop = _useDrop[1];

  var getInncerCellsOfColumn = function getInncerCellsOfColumn(columnAccessor) {
    return originalColumns.find(function (column) {
      return column.accessor === columnAccessor;
    }).innerCells;
  };

  var changeSortByOptions = function changeSortByOptions(event) {
    var newSortByValue = event.target.value;
    var innerCellsList = getInncerCellsOfColumn(newSortByValue);
    updateSingleSortingOption(id, newSortByValue, innerCellsList && innerCellsList.length > 0 ? innerCellsList[0].accessor : "value", sortOption.order);
  };

  var changeSortOnOptions = function changeSortOnOptions(event) {
    var newSortOnValue = event.target.value;
    updateSingleSortingOption(id, sortOption.sortBy, newSortOnValue, sortOption.order);
  };

  var changeSortOrderOptions = function changeSortOrderOptions(event) {
    var newSortOrderValue = event.target.value;
    updateSingleSortingOption(id, sortOption.sortBy, sortOption.sortOn, newSortOrderValue);
  };

  var copySort = function copySort() {
    copySortOption(id);
  };

  var deleteSort = function deleteSort() {
    deleteSortOption(id);
  };

  var opacity = isDragging ? 0.5 : 1;
  return /*#__PURE__*/React__default.createElement("div", {
    className: "sort__bodyContent",
    style: {
      opacity: opacity
    }
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "sort__reorder"
  }, /*#__PURE__*/React__default.createElement("div", {
    ref: function ref(node) {
      return drag(drop(node));
    },
    style: {
      cursor: "move"
    },
    className: ""
  }, /*#__PURE__*/React__default.createElement("i", {
    className: "fa fa-navicon"
  }))), /*#__PURE__*/React__default.createElement("div", {
    className: "sort__reorder"
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "sort__file"
  }, /*#__PURE__*/React__default.createElement("select", {
    className: "custom__ctrl",
    onChange: changeSortByOptions,
    value: sortOption.sortBy
  }, originalColumns.map(function (orgItem, index) {
    return /*#__PURE__*/React__default.createElement("option", {
      key: index,
      value: orgItem.accessor
    }, orgItem.Header);
  })))), /*#__PURE__*/React__default.createElement("div", {
    className: "sort__reorder"
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "sort__file"
  }, /*#__PURE__*/React__default.createElement("select", {
    className: "custom__ctrl",
    onChange: changeSortOnOptions,
    value: sortOption.sortOn
  }, getInncerCellsOfColumn(sortOption.sortBy) && getInncerCellsOfColumn(sortOption.sortBy).length > 0 ? getInncerCellsOfColumn(sortOption.sortBy).map(function (innerCellItem, innerCellIndex) {
    return /*#__PURE__*/React__default.createElement("option", {
      key: innerCellIndex,
      value: innerCellItem.accessor
    }, innerCellItem.Header);
  }) : /*#__PURE__*/React__default.createElement("option", {
    key: 0,
    value: "value"
  }, "Value")))), /*#__PURE__*/React__default.createElement("div", {
    className: "sort__reorder"
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "sort__file"
  }, /*#__PURE__*/React__default.createElement("select", {
    className: "custom__ctrl",
    value: sortOption.order,
    onChange: changeSortOrderOptions
  }, /*#__PURE__*/React__default.createElement("option", null, "Ascending"), /*#__PURE__*/React__default.createElement("option", null, "Descending")))), /*#__PURE__*/React__default.createElement("div", {
    className: "sort__reorder"
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "sort__icon",
    role: "presentation",
    onClick: copySort
  }, /*#__PURE__*/React__default.createElement("i", null, /*#__PURE__*/React__default.createElement("img", {
    src: SortCopy,
    alt: "copy sort"
  })))), /*#__PURE__*/React__default.createElement("div", {
    className: "sort__reorder"
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "sort__icon",
    role: "presentation",
    onClick: deleteSort
  }, /*#__PURE__*/React__default.createElement("i", null, /*#__PURE__*/React__default.createElement("img", {
    src: SortDelete,
    alt: "copy sort"
  })))));
};

SortItem.propTypes = {
  id: PropTypes.any,
  sortOption: PropTypes.any,
  originalColumns: PropTypes.any,
  moveSort: PropTypes.any,
  findSort: PropTypes.any,
  updateSingleSortingOption: PropTypes.any,
  copySortOption: PropTypes.any,
  deleteSortOption: PropTypes.any
};

var SortingList = function SortingList(props) {
  var updateSortingOptions = props.updateSortingOptions,
      sortOptions = props.sortOptions;

  var findSort = function findSort(sortId) {
    var sort = sortOptions.filter(function (c, index) {
      return index === sortId;
    })[0];
    return {
      sort: sort,
      index: sortOptions.indexOf(sort)
    };
  };

  var moveSort = function moveSort(sortId, atIndex) {
    var _findSort = findSort(sortId),
        sort = _findSort.sort,
        index = _findSort.index;

    updateSortingOptions(update(sortOptions, {
      $splice: [[index, 1], [atIndex, 0, sort]]
    }));
  };

  var _useDrop = useDrop({
    accept: ItemTypes$1.SORT_ITEM
  }),
      drop = _useDrop[1];

  return /*#__PURE__*/React__default.createElement(Fragment, null, /*#__PURE__*/React__default.createElement("div", {
    ref: drop,
    style: {
      display: "flex",
      flexWrap: "wrap"
    }
  }, sortOptions && sortOptions.length > 0 ? /*#__PURE__*/React__default.createElement("ul", null, /*#__PURE__*/React__default.createElement("li", null, "Sort By"), /*#__PURE__*/React__default.createElement("li", null, "Sort On"), /*#__PURE__*/React__default.createElement("li", null, "Order")) : null, sortOptions.map(function (sortOption, index) {
    return /*#__PURE__*/React__default.createElement(SortItem, {
      id: index,
      key: index,
      sortOption: sortOption,
      originalColumns: props.originalColumns,
      moveSort: moveSort,
      findSort: findSort,
      updateSingleSortingOption: props.updateSingleSortingOption,
      copySortOption: props.copySortOption,
      deleteSortOption: props.deleteSortOption
    });
  })));
};

SortingList.propTypes = {
  updateSortingOptions: PropTypes.any,
  sortOptions: PropTypes.any,
  originalColumns: PropTypes.any,
  copySortOption: PropTypes.any,
  deleteSortOption: PropTypes.any,
  updateSingleSortingOption: PropTypes.any
};

var GroupSort = /*#__PURE__*/memo(function (props) {
  var isGroupSortOverLayOpen = props.isGroupSortOverLayOpen,
      toggleGroupSortOverLay = props.toggleGroupSortOverLay,
      applyGroupSort = props.applyGroupSort,
      originalColumns = props.originalColumns;
  var sortingOrders = ["Ascending", "Descending"];
  var defaultSortingOption = [{
    sortBy: originalColumns[0].accessor,
    sortOn: originalColumns[0].innerCells ? originalColumns[0].innerCells[0].accessor : "value",
    order: sortingOrders[0]
  }];

  var _useState = useState([]),
      sortOptions = _useState[0],
      setSortOptions = _useState[1];

  var _useState2 = useState(false),
      isErrorDisplayed = _useState2[0],
      setIsErrorDisplayed = _useState2[1];

  var HTML5toTouch = {
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

  var updateSortingOptions = function updateSortingOptions(sortingOptions) {
    setSortOptions(sortingOptions);
  };

  var addSortingOptions = function addSortingOptions() {
    setSortOptions([].concat(sortOptions, defaultSortingOption));
  };

  var clearSortingOptions = function clearSortingOptions() {
    setSortOptions([]);
    applyGroupSort([]);
  };

  var updateSingleSortingOption = function updateSingleSortingOption(sortIndex, sortByValue, sortOnValue, sortOrder) {
    var newOptionsList = sortOptions.slice(0);
    var newSortingOption = {
      sortBy: sortByValue,
      sortOn: sortOnValue,
      order: sortOrder
    };
    var updatedSortOptions = newOptionsList.map(function (option, index) {
      return index === sortIndex ? newSortingOption : option;
    });
    updateSortingOptions(updatedSortOptions);
  };

  var copySortOption = function copySortOption(sortIndex) {
    var newOption = sortOptions.slice(0)[sortIndex];
    setSortOptions(sortOptions.concat(newOption));
  };

  var deleteSortOption = function deleteSortOption(sortIndex) {
    setSortOptions(sortOptions.filter(function (option, index) {
      return index !== sortIndex;
    }));
  };

  var applySort = function applySort() {
    var isError = false;
    sortOptions.map(function (option, index) {
      var sortBy = option.sortBy,
          sortOn = option.sortOn;
      var optionIndex = index;
      var duplicateSort = sortOptions.find(function (opt, optIndex) {
        return sortBy === opt.sortBy && sortOn === opt.sortOn && optionIndex !== optIndex;
      });

      if (duplicateSort) {
        isError = true;
      }

      return null;
    });

    if (!isError) {
      applyGroupSort(sortOptions);
      toggleGroupSortOverLay();
    }

    setIsErrorDisplayed(isError);
  };

  if (isGroupSortOverLayOpen) {
    return /*#__PURE__*/React__default.createElement(ClickAwayListener, {
      onClickAway: toggleGroupSortOverLay
    }, /*#__PURE__*/React__default.createElement("div", {
      className: "neo-popover"
    }, /*#__PURE__*/React__default.createElement("div", {
      className: "neo-popover__sort"
    }, /*#__PURE__*/React__default.createElement("div", {
      className: "neo-popover__title"
    }, /*#__PURE__*/React__default.createElement("h2", null, "Sort"), /*#__PURE__*/React__default.createElement("div", {
      className: "neo-popover__close"
    }, /*#__PURE__*/React__default.createElement("i", {
      className: "fa fa-times",
      "aria-hidden": "true",
      onClick: toggleGroupSortOverLay
    }))), /*#__PURE__*/React__default.createElement("div", {
      className: "neo-popover__content"
    }, /*#__PURE__*/React__default.createElement(DndProvider, {
      backend: MultiBackend,
      options: HTML5toTouch
    }, /*#__PURE__*/React__default.createElement(SortingList, {
      sortOptions: sortOptions,
      originalColumns: originalColumns,
      updateSortingOptions: updateSortingOptions,
      updateSingleSortingOption: updateSingleSortingOption,
      copySortOption: copySortOption,
      deleteSortOption: deleteSortOption
    }))), /*#__PURE__*/React__default.createElement("div", {
      className: "sort-warning"
    }, isErrorDisplayed ? /*#__PURE__*/React__default.createElement("span", null, "Duplicate sort options found.") : null), /*#__PURE__*/React__default.createElement("div", {
      className: "sort__new"
    }, /*#__PURE__*/React__default.createElement("div", {
      className: "sort__section",
      role: "presentation",
      onClick: addSortingOptions
    }, /*#__PURE__*/React__default.createElement("span", null, "+"), /*#__PURE__*/React__default.createElement("div", {
      className: "sort__txt"
    }, "New Sort"))), /*#__PURE__*/React__default.createElement("div", {
      className: "sort__footer"
    }, /*#__PURE__*/React__default.createElement("div", {
      className: "sort__btns"
    }, /*#__PURE__*/React__default.createElement("button", {
      type: "button",
      className: "btns",
      onClick: clearSortingOptions
    }, "Clear All"), /*#__PURE__*/React__default.createElement("button", {
      type: "button",
      className: "btns btns__save",
      onClick: applySort
    }, "Ok"))))));
  }

  return /*#__PURE__*/React__default.createElement("div", null);
});
GroupSort.propTypes = {
  isGroupSortOverLayOpen: PropTypes.any,
  toggleGroupSortOverLay: PropTypes.any,
  originalColumns: PropTypes.any,
  applyGroupSort: PropTypes.any
};

var ExportData = /*#__PURE__*/memo(function (props) {
  var isExportOverlayOpen = props.isExportOverlayOpen,
      toggleExportDataOverlay = props.toggleExportDataOverlay,
      rows = props.rows,
      originalColumns = props.originalColumns,
      columns = props.columns,
      isRowExpandEnabled = props.isRowExpandEnabled,
      isExpandContentAvailable = props.isExpandContentAvailable,
      additionalColumn = props.additionalColumn;

  var getRemarksColumnIfAvailable = function getRemarksColumnIfAvailable() {
    return isExpandContentAvailable ? additionalColumn : [];
  };

  var getRemarksColumnIfSelectedByUser = function getRemarksColumnIfSelectedByUser() {
    return isRowExpandEnabled ? additionalColumn : [];
  };

  var updatedColumns = [].concat(originalColumns).concat(getRemarksColumnIfAvailable());
  var updatedColumnsPerUserSelection = [].concat(columns).concat(getRemarksColumnIfSelectedByUser());

  var _useState = useState(updatedColumnsPerUserSelection),
      managedColumns = _useState[0],
      setManagedColumns = _useState[1];

  var _useState2 = useState(updatedColumns),
      searchedColumns = _useState2[0],
      setSearchedColumns = _useState2[1];

  var _useState3 = useState([]),
      downloadTypes = _useState3[0],
      setDownloadTypes = _useState3[1];

  var _useState4 = useState(""),
      warning = _useState4[0],
      setWarning = _useState4[1];

  var isDownload = false;

  var exportRowData = function exportRowData() {
    isDownload = true;
    var filteredRow = [];
    var filteredRowValues = [];
    var filteredRowHeader = [];
    setWarning("");

    if (managedColumns.length > 0 && downloadTypes.length > 0) {
      var rowLength = rows && rows.length > 0 ? rows.length : 0;
      rows.forEach(function (rowDetails, index) {
        var row = rowDetails.original;
        var filteredColumnVal = {};
        var rowFilteredValues = [];
        var rowFilteredHeader = [];
        managedColumns.forEach(function (columnName) {
          var Header = columnName.Header,
              accessor = columnName.accessor,
              originalInnerCells = columnName.originalInnerCells,
              displayInExpandedRegion = columnName.displayInExpandedRegion;
          var isInnerCellsPresent = originalInnerCells && originalInnerCells.length > 0;
          var accessorRowValue = row[accessor];
          var columnValue = "";
          var columnHeader = "";

          if (accessor) {
            if (isInnerCellsPresent && typeof accessorRowValue === "object") {
              originalInnerCells.forEach(function (cell) {
                var innerCellAccessor = cell.accessor;
                var innerCellHeader = cell.Header;
                var innerCellAccessorValue = accessorRowValue[innerCellAccessor];

                if (accessorRowValue.length > 0) {
                  accessorRowValue.forEach(function (item, index) {
                    columnValue = item[innerCellAccessor].toString();
                    columnHeader = Header + " - " + innerCellHeader + "_" + index;
                    filteredColumnVal[columnHeader] = columnValue;
                    rowFilteredValues.push(columnValue);
                    rowFilteredHeader.push(columnHeader);
                  });
                } else if (innerCellAccessorValue) {
                  columnValue = innerCellAccessorValue;
                  columnHeader = Header + " - " + innerCellHeader;
                  filteredColumnVal[columnHeader] = columnValue;
                  rowFilteredValues.push(columnValue);
                  rowFilteredHeader.push(columnHeader);
                }
              });
            } else {
              columnValue = accessorRowValue;
              columnHeader = Header;
              filteredColumnVal[columnHeader] = columnValue;
              rowFilteredValues.push(columnValue);
              rowFilteredHeader.push(columnHeader);
            }
          } else if (displayInExpandedRegion && isInnerCellsPresent) {
            originalInnerCells.forEach(function (expandedCell) {
              var expandedCellAccessor = expandedCell.accessor;
              var expandedCellHeader = expandedCell.Header;
              var expandedCellValue = row[expandedCellAccessor];
              var formattedValue = expandedCellValue;

              if (typeof expandedCellValue === "object") {
                if (expandedCellValue.length > 0) {
                  var newValues = [];
                  expandedCellValue.forEach(function (cellValue) {
                    newValues.push(Object.values(cellValue).join("--"));
                  });
                  formattedValue = newValues.join("||");
                } else {
                  formattedValue = Object.values(expandedCellValue).join("||");
                }
              }

              columnValue = formattedValue;
              columnHeader = expandedCellHeader;
              filteredColumnVal[columnHeader] = columnValue;
              rowFilteredValues.push(columnValue);
              rowFilteredHeader.push(columnHeader);
            });
          }
        });
        filteredRow.push(filteredColumnVal);
        filteredRowValues.push(rowFilteredValues);
        if (rowLength === index + 1) filteredRowHeader.push(rowFilteredHeader);
      });
      downloadTypes.map(function (item) {
        if (item === "pdf") {
          downloadPDF(filteredRowValues, filteredRowHeader);
        } else if (item === "excel") {
          downloadXLSFile(filteredRow);
        } else {
          downloadCSVFile(filteredRow);
        }
      });
    } else {
      if (managedColumns.length === 0 && downloadTypes.length === 0) {
        setWarning("Select at least one column and a file type");
      } else if (managedColumns.length === 0) {
        setWarning("Select at least one column");
      } else if (downloadTypes.length === 0) {
        setWarning("Select at least one file type");
      }
    }
  };

  var downloadPDF = function downloadPDF(rowFilteredValues, rowFilteredHeader) {
    var unit = "pt";
    var size = "A4";
    var orientation = "landscape";
    var marginLeft = 30;
    var doc = new jsPDF(orientation, unit, size);
    doc.setFontSize(15);
    var title = "iCargo Neo Report";
    var content = {
      startY: 50,
      head: rowFilteredHeader,
      body: rowFilteredValues,
      tableWidth: "wrap",
      headStyles: {
        fillColor: [102, 102, 255]
      },
      styles: {
        fontSize: 12,
        overflowX: "visible",
        overflowY: "visible"
      },
      theme: "grid",
      overflow: "visible",
      cellWidth: "auto",
      margin: {
        top: 15,
        right: 30,
        bottom: 10,
        left: 30
      }
    };
    doc.text(title, marginLeft, 40);
    doc.autoTable(content);
    doc.save("iCargo Neo Report.pdf");
    isDownload = false;
  };

  var downloadCSVFile = function downloadCSVFile(filteredRowValue) {
    var fileType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    var fileExtension = ".csv";
    var fileName = "iCargo Neo Report";
    var ws = utils.json_to_sheet(filteredRowValue);
    var wb = {
      Sheets: {
        data: ws
      },
      SheetNames: ["data"]
    };
    var excelBuffer = write(wb, {
      bookType: "csv",
      type: "array"
    });
    var data = new Blob([excelBuffer], {
      type: fileType
    });
    saveAs(data, fileName + fileExtension);
  };

  var downloadXLSFile = function downloadXLSFile(filteredRowValue) {
    var fileType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    var fileExtension = ".xlsx";
    var fileName = "iCargo Neo Report";
    var ws = utils.json_to_sheet(filteredRowValue);
    var wb = {
      Sheets: {
        data: ws
      },
      SheetNames: ["data"]
    };
    var excelBuffer = write(wb, {
      bookType: "xlsx",
      type: "array"
    });
    var data = new Blob([excelBuffer], {
      type: fileType
    });
    saveAs(data, fileName + fileExtension);
  };

  var filterColumnsList = function filterColumnsList(event) {
    var _ref = event ? event.target : "",
        value = _ref.value;

    value = value ? value.toLowerCase() : "";

    if (value !== "") {
      setSearchedColumns(originalColumns.filter(function (column) {
        return column.Header.toLowerCase().includes(value);
      }).concat(getRemarksColumnIfAvailable().filter(function (column) {
        return column.Header.toLowerCase().includes(value);
      })));
    } else {
      setSearchedColumns(updatedColumns);
    }
  };

  var isCheckboxSelected = function isCheckboxSelected(header) {
    if (header === "Select All") {
      return managedColumns.length === searchedColumns.length;
    }

    var selectedColumn = managedColumns.filter(function (column) {
      return column.Header === header;
    });
    return selectedColumn && selectedColumn.length > 0;
  };

  var selectAllColumns = function selectAllColumns(event) {
    if (event.target.checked) {
      setManagedColumns(updatedColumns);
    } else {
      setManagedColumns([]);
    }
  };

  var selectSingleColumn = function selectSingleColumn(event) {
    var currentTarget = event.currentTarget;
    var checked = currentTarget.checked,
        value = currentTarget.value;

    if (checked) {
      (function () {
        var indexOfColumnToAdd = updatedColumns.findIndex(function (column) {
          return column.Header === value;
        });
        var itemToAdd = updatedColumns[indexOfColumnToAdd];
        var prevItemIndex = -1;

        while (indexOfColumnToAdd > 0 && prevItemIndex === -1) {
          prevItemIndex = managedColumns.findIndex(function (column) {
            return column.Header === updatedColumns[indexOfColumnToAdd - 1].Header;
          });
          indexOfColumnToAdd -= 1;
        }

        var newColumnsList = managedColumns.slice(0);
        newColumnsList.splice(prevItemIndex + 1, 0, itemToAdd);
        setManagedColumns(newColumnsList);
      })();
    } else {
      setManagedColumns(managedColumns.filter(function (column) {
        return column.Header !== value;
      }));
    }
  };

  var changeDownloadType = function changeDownloadType(event) {
    var _ref2 = event ? event.currentTarget : "",
        value = _ref2.value,
        checked = _ref2.checked;

    if (checked) {
      setDownloadTypes(downloadTypes.concat([value]));
    } else {
      setDownloadTypes(downloadTypes.filter(function (type) {
        return type !== value;
      }));
    }
  };

  useEffect(function () {
    setManagedColumns(updatedColumnsPerUserSelection);
  }, [columns, isRowExpandEnabled]);

  if (isExportOverlayOpen) {
    return /*#__PURE__*/React__default.createElement(ClickAwayListener, {
      onClickAway: toggleExportDataOverlay
    }, /*#__PURE__*/React__default.createElement("div", {
      className: "neo-popover neo-popover--exports exports--grid"
    }, /*#__PURE__*/React__default.createElement("div", {
      className: "neo-popover__export export__grid"
    }, /*#__PURE__*/React__default.createElement("div", {
      className: "export__chooser"
    }, /*#__PURE__*/React__default.createElement("div", {
      className: "export__header"
    }, /*#__PURE__*/React__default.createElement("div", {
      className: ""
    }, /*#__PURE__*/React__default.createElement("strong", null, "Export Data"))), /*#__PURE__*/React__default.createElement("div", {
      className: "export__body"
    }, /*#__PURE__*/React__default.createElement("div", null, /*#__PURE__*/React__default.createElement("input", {
      type: "text",
      placeholder: "Search column",
      className: "custom__ctrl",
      onChange: filterColumnsList
    })), /*#__PURE__*/React__default.createElement("div", {
      className: "export__wrap export__headertxt"
    }, /*#__PURE__*/React__default.createElement("div", {
      className: "export__checkbox"
    }, /*#__PURE__*/React__default.createElement("input", {
      type: "checkbox",
      value: "Select All",
      checked: isCheckboxSelected("Select All"),
      onChange: selectAllColumns
    })), /*#__PURE__*/React__default.createElement("div", {
      className: "export__txt"
    }, "Select All")), searchedColumns.map(function (column, index) {
      return /*#__PURE__*/React__default.createElement("div", {
        className: "export__wrap",
        key: index
      }, /*#__PURE__*/React__default.createElement("div", {
        className: "export__checkbox"
      }, /*#__PURE__*/React__default.createElement("input", {
        type: "checkbox",
        value: column.Header,
        checked: isCheckboxSelected(column.Header),
        onChange: selectSingleColumn
      })), /*#__PURE__*/React__default.createElement("div", {
        className: "export__txt"
      }, column.Header));
    }))), /*#__PURE__*/React__default.createElement("div", {
      className: "export__settings"
    }, /*#__PURE__*/React__default.createElement("div", {
      className: "export__header"
    }, /*#__PURE__*/React__default.createElement("div", {
      className: "export__headerTxt"
    }), /*#__PURE__*/React__default.createElement("div", {
      className: "export__close"
    }, /*#__PURE__*/React__default.createElement("i", {
      className: "fa fa-times",
      "aria-hidden": "true",
      onClick: toggleExportDataOverlay
    }))), /*#__PURE__*/React__default.createElement("div", {
      className: "export__as"
    }, "Export As"), /*#__PURE__*/React__default.createElement("div", {
      className: "export__body"
    }, /*#__PURE__*/React__default.createElement("div", {
      className: "export__reorder"
    }, /*#__PURE__*/React__default.createElement("div", {
      className: "check-wrap"
    }, /*#__PURE__*/React__default.createElement("input", {
      type: "checkbox",
      id: "chk_pdf",
      value: "pdf",
      checked: downloadTypes.includes("pdf"),
      onChange: changeDownloadType
    })), /*#__PURE__*/React__default.createElement("div", {
      className: "export__file"
    }, /*#__PURE__*/React__default.createElement("i", {
      className: "fa fa-file-pdf-o",
      "aria-hidden": "true"
    }), /*#__PURE__*/React__default.createElement("br", null), /*#__PURE__*/React__default.createElement("strong", null, "PDF"))), /*#__PURE__*/React__default.createElement("div", {
      className: "export__reorder"
    }, /*#__PURE__*/React__default.createElement("div", {
      className: "check-wrap"
    }, /*#__PURE__*/React__default.createElement("input", {
      type: "checkbox",
      id: "chk_excel",
      value: "excel",
      checked: downloadTypes.includes("excel"),
      onChange: changeDownloadType
    })), /*#__PURE__*/React__default.createElement("div", {
      className: "export__file"
    }, /*#__PURE__*/React__default.createElement("i", {
      className: "fa fa-file-excel-o",
      "aria-hidden": "true"
    }), /*#__PURE__*/React__default.createElement("br", null), /*#__PURE__*/React__default.createElement("strong", null, "Excel"))), /*#__PURE__*/React__default.createElement("div", {
      className: "export__reorder"
    }, /*#__PURE__*/React__default.createElement("div", {
      className: "check-wrap"
    }, /*#__PURE__*/React__default.createElement("input", {
      type: "checkbox",
      id: "chk_csv",
      value: "csv",
      checked: downloadTypes.includes("csv"),
      onChange: changeDownloadType
    })), /*#__PURE__*/React__default.createElement("div", {
      className: "export__file"
    }, /*#__PURE__*/React__default.createElement("i", {
      className: "fa fa-file-text-o",
      "aria-hidden": "true"
    }), /*#__PURE__*/React__default.createElement("br", null), /*#__PURE__*/React__default.createElement("strong", null, "CSV"))), /*#__PURE__*/React__default.createElement("div", {
      className: "exportWarning"
    }, /*#__PURE__*/React__default.createElement("span", {
      className: "alert alert-danger"
    }, /*#__PURE__*/React__default.createElement("strong", null, warning))), /*#__PURE__*/React__default.createElement("div", null, isDownload ? /*#__PURE__*/React__default.createElement("h2", {
      style: {
        textAlign: "center"
      }
    }, "Loading...") : null)), /*#__PURE__*/React__default.createElement("div", {
      className: "export__footer"
    }, /*#__PURE__*/React__default.createElement("div", {
      className: "export__btns"
    }, /*#__PURE__*/React__default.createElement("button", {
      type: "button",
      className: "btns",
      onClick: toggleExportDataOverlay
    }, "Cancel"), /*#__PURE__*/React__default.createElement("button", {
      type: "button",
      className: "btns btns__save",
      onClick: exportRowData
    }, "Export")))))));
  }

  return /*#__PURE__*/React__default.createElement("div", null);
});
ExportData.propTypes = {
  isExportOverlayOpen: PropTypes.any,
  toggleExportDataOverlay: PropTypes.any,
  rows: PropTypes.any,
  originalColumns: PropTypes.any,
  isExpandContentAvailable: PropTypes.any,
  additionalColumn: PropTypes.any
};

var listRef = /*#__PURE__*/createRef(null);
var Customgrid = /*#__PURE__*/memo(function (props) {
  var title = props.title,
      gridHeight = props.gridHeight,
      gridWidth = props.gridWidth,
      managableColumns = props.managableColumns,
      originalColumns = props.originalColumns,
      additionalColumn = props.additionalColumn,
      data = props.data,
      getRowEditOverlay = props.getRowEditOverlay,
      updateRowInGrid = props.updateRowInGrid,
      deleteRowFromGrid = props.deleteRowFromGrid,
      globalSearchLogic = props.globalSearchLogic,
      selectBulkData = props.selectBulkData,
      calculateRowHeight = props.calculateRowHeight,
      isExpandContentAvailable = props.isExpandContentAvailable,
      displayExpandedContent = props.displayExpandedContent,
      rowActions = props.rowActions,
      rowActionCallback = props.rowActionCallback,
      hasNextPage = props.hasNextPage,
      isNextPageLoading = props.isNextPageLoading,
      loadNextPage = props.loadNextPage,
      doGroupSort = props.doGroupSort;

  var _useState = useState(managableColumns),
      columns = _useState[0],
      setColumns = _useState[1];

  var _useState2 = useState(isExpandContentAvailable),
      isRowExpandEnabled = _useState2[0],
      setIsRowExpandEnabled = _useState2[1];

  var itemCount = hasNextPage ? data.length + 1 : data.length;
  var loadMoreItems = isNextPageLoading ? function () {} : loadNextPage || function () {};

  var isItemLoaded = function isItemLoaded(index) {
    return !hasNextPage || index < data.length;
  };

  var _useState3 = useState(false),
      isFilterOpen = _useState3[0],
      setFilterOpen = _useState3[1];

  var toggleColumnFilter = function toggleColumnFilter() {
    setFilterOpen(!isFilterOpen);
  };

  var _useState4 = useState(false),
      isRowEditOverlyOpen = _useState4[0],
      setIsRowEditOverlyOpen = _useState4[1];

  var _useState5 = useState(null),
      editedRowData = _useState5[0],
      setEditedRowData = _useState5[1];

  var bindRowEditOverlay = function bindRowEditOverlay(rowValue) {
    setEditedRowData(rowValue);
    setIsRowEditOverlyOpen(true);
  };

  var closeRowEditOverlay = function closeRowEditOverlay() {
    setEditedRowData(null);
    setIsRowEditOverlyOpen(false);
  };

  var _useState6 = useState(false),
      isRowDeleteOverlyOpen = _useState6[0],
      setIsRowDeleteOverlyOpen = _useState6[1];

  var _useState7 = useState(null),
      deletedRowData = _useState7[0],
      setDeletedRowData = _useState7[1];

  var bindRowDeleteOverlay = function bindRowDeleteOverlay(rowValue) {
    setDeletedRowData(rowValue);
    setIsRowDeleteOverlyOpen(true);
  };

  var closeRowDeleteOverlay = function closeRowDeleteOverlay() {
    setDeletedRowData(null);
    setIsRowDeleteOverlyOpen(false);
  };

  var _useState8 = useState(false),
      isGroupSortOverLayOpen = _useState8[0],
      setGroupSortOverLay = _useState8[1];

  var toggleGroupSortOverLay = function toggleGroupSortOverLay() {
    setGroupSortOverLay(!isGroupSortOverLayOpen);
  };

  var applyGroupSort = function applyGroupSort(sortOptions) {
    doGroupSort(sortOptions);
  };

  var _useState9 = useState(false),
      isManageColumnOpen = _useState9[0],
      setManageColumnOpen = _useState9[1];

  var toggleManageColumns = function toggleManageColumns() {
    setManageColumnOpen(!isManageColumnOpen);
  };

  var updateColumnStructure = function updateColumnStructure(newColumnStructure, remarksColumn) {
    setColumns([].concat(newColumnStructure));
    setIsRowExpandEnabled(!!(remarksColumn && remarksColumn.length > 0));
  };

  var _useState10 = useState(false),
      isExportOverlayOpen = _useState10[0],
      setIsExportOverlayOpen = _useState10[1];

  var toggleExportDataOverlay = function toggleExportDataOverlay() {
    setIsExportOverlayOpen(!isExportOverlayOpen);
  };

  var defaultColumn = useMemo(function () {
    return {
      Filter: DefaultColumnFilter
    };
  }, []);

  var _useTable = useTable({
    columns: columns,
    data: data,
    defaultColumn: defaultColumn,
    globalFilter: function globalFilter(rowsToFilter, columnsToFilter, filterValue) {
      if (globalSearchLogic && typeof globalSearchLogic === "function") {
        return globalSearchLogic(rowsToFilter, columnsToFilter, filterValue);
      }

      return rowsToFilter;
    },
    autoResetFilters: false,
    autoResetGlobalFilter: false,
    autoResetSortBy: false,
    autoResetExpanded: false,
    autoResetSelectedRows: false
  }, useFilters, useGlobalFilter, useSortBy, useExpanded, useRowSelect, useFlexLayout, useResizeColumns, function (hooks) {
    hooks.allColumns.push(function (hookColumns) {
      return [{
        id: "selection",
        columnId: "column_custom_0",
        disableResizing: true,
        disableFilters: true,
        disableSortBy: true,
        minWidth: 35,
        width: 35,
        maxWidth: 35,
        Header: function Header(_ref) {
          var getToggleAllRowsSelectedProps = _ref.getToggleAllRowsSelectedProps;

          var headerSelectProps = _extends({}, getToggleAllRowsSelectedProps());

          return /*#__PURE__*/React__default.createElement(RowSelector, {
            checked: headerSelectProps.checked,
            indeterminate: headerSelectProps.indeterminate,
            onChange: headerSelectProps.onChange,
            style: headerSelectProps.style,
            title: headerSelectProps.title
          });
        },
        Cell: function Cell(_ref2) {
          var row = _ref2.row;
          return /*#__PURE__*/React__default.createElement(RowSelector, row.getToggleRowSelectedProps());
        }
      }].concat(hookColumns, [{
        id: "custom",
        columnId: "column_custom_1",
        disableResizing: true,
        disableFilters: true,
        disableSortBy: true,
        minWidth: 35,
        width: 35,
        maxWidth: 35,
        Cell: function Cell(_ref3) {
          var row = _ref3.row;
          return /*#__PURE__*/React__default.createElement("div", {
            className: "action"
          }, /*#__PURE__*/React__default.createElement(RowOptions, {
            row: row,
            rowActions: rowActions,
            rowActionCallback: rowActionCallback,
            bindRowEditOverlay: bindRowEditOverlay,
            bindRowDeleteOverlay: bindRowDeleteOverlay
          }), isRowExpandEnabled ? /*#__PURE__*/React__default.createElement("span", _extends({
            className: "expander"
          }, row.getToggleRowExpandedProps()), row.isExpanded ? /*#__PURE__*/React__default.createElement("i", {
            className: "fa fa-angle-up",
            "aria-hidden": "true"
          }) : /*#__PURE__*/React__default.createElement("i", {
            className: "fa fa-angle-down",
            "aria-hidden": "true"
          })) : null);
        }
      }]);
    });
  }),
      getTableProps = _useTable.getTableProps,
      getTableBodyProps = _useTable.getTableBodyProps,
      headerGroups = _useTable.headerGroups,
      rows = _useTable.rows,
      prepareRow = _useTable.prepareRow,
      selectedFlatRows = _useTable.selectedFlatRows,
      state = _useTable.state,
      setGlobalFilter = _useTable.setGlobalFilter;

  var bulkSelector = function bulkSelector() {
    if (selectBulkData) {
      selectBulkData(selectedFlatRows);
    }
  };

  useEffect(function () {
    if (listRef && listRef.current) {
      listRef.current.resetAfterIndex(0, true);
    }
  });
  var RenderRow = useCallback(function (_ref4) {
    var index = _ref4.index,
        style = _ref4.style;

    if (isItemLoaded(index)) {
      var row = rows[index];
      prepareRow(row);
      return /*#__PURE__*/React__default.createElement("div", _extends({}, row.getRowProps({
        style: style
      }), {
        className: "table-row tr"
      }), /*#__PURE__*/React__default.createElement("div", {
        className: "table-row-wrap"
      }, row.cells.map(function (cell) {
        return /*#__PURE__*/React__default.createElement("div", _extends({}, cell.getCellProps(), {
          className: "table-cell td"
        }), cell.render("Cell"));
      })), isRowExpandEnabled && row.isExpanded ? /*#__PURE__*/React__default.createElement("div", {
        className: "expand"
      }, displayExpandedContent ? displayExpandedContent(row) : null) : null);
    }

    return null;
  }, [prepareRow, rows, displayExpandedContent]);
  return /*#__PURE__*/React__default.createElement("div", {
    className: "table-wrapper",
    style: {
      width: gridWidth || "100%"
    }
  }, /*#__PURE__*/React__default.createElement("link", {
    rel: "stylesheet",
    href: "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
  }), /*#__PURE__*/React__default.createElement("div", {
    className: "neo-grid-header"
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "neo-grid-header__results"
  }, /*#__PURE__*/React__default.createElement("strong", null, rows.length), /*#__PURE__*/React__default.createElement("span", null, title || "Rows")), /*#__PURE__*/React__default.createElement("div", {
    className: "neo-grid-header__utilities"
  }, /*#__PURE__*/React__default.createElement(ColumnReordering, {
    isManageColumnOpen: isManageColumnOpen,
    toggleManageColumns: toggleManageColumns,
    originalColumns: originalColumns,
    isExpandContentAvailable: isExpandContentAvailable,
    additionalColumn: [additionalColumn],
    updateColumnStructure: updateColumnStructure
  }), /*#__PURE__*/React__default.createElement(GlobalFilter, {
    globalFilter: state.globalFilter,
    setGlobalFilter: setGlobalFilter
  }), /*#__PURE__*/React__default.createElement(GroupSort, {
    isGroupSortOverLayOpen: isGroupSortOverLayOpen,
    toggleGroupSortOverLay: toggleGroupSortOverLay,
    originalColumns: originalColumns,
    applyGroupSort: applyGroupSort
  }), /*#__PURE__*/React__default.createElement(ExportData, {
    isExportOverlayOpen: isExportOverlayOpen,
    toggleExportDataOverlay: toggleExportDataOverlay,
    rows: rows,
    originalColumns: originalColumns,
    columns: columns,
    isRowExpandEnabled: isRowExpandEnabled,
    isExpandContentAvailable: isExpandContentAvailable,
    additionalColumn: [additionalColumn]
  }), /*#__PURE__*/React__default.createElement("div", {
    className: "utilities-icon keyword-search",
    role: "presentation",
    onClick: toggleColumnFilter
  }, /*#__PURE__*/React__default.createElement("i", {
    className: "fa fa-filter",
    "aria-hidden": "true"
  })), /*#__PURE__*/React__default.createElement("div", {
    className: "utilities-icon bulk-select",
    role: "presentation",
    onClick: bulkSelector
  }, /*#__PURE__*/React__default.createElement("i", {
    className: "fa fa-pencil-square-o",
    "aria-hidden": "true"
  })), /*#__PURE__*/React__default.createElement("div", {
    className: "utilities-icon bulk-select",
    role: "presentation",
    onClick: toggleGroupSortOverLay
  }, /*#__PURE__*/React__default.createElement("i", {
    className: "fa fa-sort-amount-desc",
    "aria-hidden": "true"
  })), /*#__PURE__*/React__default.createElement("div", {
    className: "utilities-icon manage-columns",
    role: "presentation",
    onClick: toggleManageColumns
  }, /*#__PURE__*/React__default.createElement("i", {
    className: "fa fa-columns",
    "aria-hidden": "true"
  })), /*#__PURE__*/React__default.createElement("div", {
    className: "utilities-icon manage-columns",
    role: "presentation",
    onClick: toggleExportDataOverlay
  }, /*#__PURE__*/React__default.createElement("i", {
    className: "fa fa-share-alt",
    "aria-hidden": "true"
  })))), /*#__PURE__*/React__default.createElement("div", {
    className: "table-popus"
  }, isRowEditOverlyOpen ? /*#__PURE__*/React__default.createElement("div", {
    className: "overlay"
  }, /*#__PURE__*/React__default.createElement(RowEditOverLay, {
    row: editedRowData,
    columns: columns,
    isRowExpandEnabled: isRowExpandEnabled,
    additionalColumn: additionalColumn,
    getRowEditOverlay: getRowEditOverlay,
    closeRowEditOverlay: closeRowEditOverlay,
    updateRowInGrid: updateRowInGrid
  })) : null, isRowDeleteOverlyOpen ? /*#__PURE__*/React__default.createElement("div", {
    className: "overlay"
  }, /*#__PURE__*/React__default.createElement(RowDeleteOverLay, {
    row: deletedRowData,
    closeRowDeleteOverlay: closeRowDeleteOverlay,
    deleteRowFromGrid: deleteRowFromGrid
  })) : null), /*#__PURE__*/React__default.createElement("div", {
    className: "tableContainer table-outer neo-grid",
    style: {
      height: gridHeight || "50vh",
      overflowX: "auto",
      overflowY: "hidden"
    }
  }, /*#__PURE__*/React__default.createElement(AutoSizer, {
    disableWidth: true,
    disableResizing: true
  }, function (_ref5) {
    var height = _ref5.height;
    return /*#__PURE__*/React__default.createElement("div", _extends({}, getTableProps(), {
      className: "table"
    }), /*#__PURE__*/React__default.createElement("div", {
      className: "thead table-row table-row--head"
    }, headerGroups.map(function (headerGroup) {
      return /*#__PURE__*/React__default.createElement("div", _extends({}, headerGroup.getHeaderGroupProps(), {
        className: "tr"
      }), headerGroup.headers.map(function (column) {
        return /*#__PURE__*/React__default.createElement("div", _extends({}, column.getHeaderProps(), {
          className: "table-cell column-heading th"
        }), /*#__PURE__*/React__default.createElement("div", column.getSortByToggleProps(), column.render("Header"), /*#__PURE__*/React__default.createElement("span", null, column.isSorted ? column.isSortedDesc ? /*#__PURE__*/React__default.createElement("i", {
          className: "fa fa-sort-desc",
          "aria-hidden": "true"
        }) : /*#__PURE__*/React__default.createElement("i", {
          className: "fa fa-sort-asc",
          "aria-hidden": "true"
        }) : "")), /*#__PURE__*/React__default.createElement("div", {
          className: "txt-wrap column-filter " + (isFilterOpen ? "open" : "")
        }, !column.disableFilters ? column.render("Filter") : null), column.canResize && /*#__PURE__*/React__default.createElement("div", _extends({}, column.getResizerProps(), {
          className: "resizer"
        })));
      }));
    })), /*#__PURE__*/React__default.createElement("div", _extends({}, getTableBodyProps(), {
      className: "tbody"
    }), /*#__PURE__*/React__default.createElement(InfiniteLoader, {
      isItemLoaded: isItemLoaded,
      itemCount: itemCount,
      loadMoreItems: loadMoreItems
    }, function (_ref6) {
      var onItemsRendered = _ref6.onItemsRendered,
          _ref7 = _ref6.ref;
      return /*#__PURE__*/React__default.createElement(VariableSizeList, {
        ref: function ref(list) {
          _ref7(list);

          listRef.current = list;
        },
        style: {
          overflowX: "hidden"
        },
        height: height - 60,
        itemCount: rows.length,
        itemSize: function itemSize(index) {
          return calculateRowHeight(rows[index], headerGroups && headerGroups.length ? headerGroups[0].headers : []);
        },
        onItemsRendered: onItemsRendered,
        overscanCount: 20
      }, RenderRow);
    })));
  })));
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

var Grid = /*#__PURE__*/memo(function (props) {
  var title = props.title,
      gridHeight = props.gridHeight,
      gridWidth = props.gridWidth,
      columns = props.columns,
      columnToExpand = props.columnToExpand,
      rowActions = props.rowActions,
      rowActionCallback = props.rowActionCallback,
      fetchData = props.fetchData,
      getRowEditOverlay = props.getRowEditOverlay,
      updateRowData = props.updateRowData,
      deleteRowData = props.deleteRowData,
      selectBulkData = props.selectBulkData,
      calculateRowHeight = props.calculateRowHeight;
  var isDesktop = window.innerWidth > 1024;

  var _useState = useState(true),
      hasNextPage = _useState[0],
      setHasNextPage = _useState[1];

  var _useState2 = useState(false),
      isNextPageLoading = _useState2[0],
      setIsNextPageLoading = _useState2[1];

  var _useState3 = useState(false),
      isLoading = _useState3[0],
      setIsLoading = _useState3[1];

  var _useState4 = useState([]),
      items = _useState4[0],
      setItems = _useState4[1];

  var _useState5 = useState([]),
      groupSortOptions = _useState5[0],
      setGroupSortOptions = _useState5[1];

  var searchColumn = function searchColumn(column, original, searchText) {
    var isValuePresent = false;
    var accessor = column.accessor,
        innerCells = column.innerCells;
    var rowAccessorValue = original[accessor];
    var isInnerCellsPresent = innerCells && innerCells.length > 0;

    if (typeof rowAccessorValue === "object" && isInnerCellsPresent) {
      if (rowAccessorValue.length > 0) {
        rowAccessorValue.map(function (value) {
          innerCells.map(function (cell) {
            var dataAccessor = value[cell.accessor];

            if (dataAccessor && dataAccessor.toString().toLowerCase().includes(searchText)) {
              isValuePresent = true;
            }
          });
        });
      } else {
        innerCells.map(function (cell) {
          var dataAccessor = original[accessor][cell.accessor];

          if (dataAccessor && dataAccessor.toString().toLowerCase().includes(searchText)) {
            isValuePresent = true;
          }
        });
      }
    } else {
      var dataAccessor = original[accessor];

      if (dataAccessor && dataAccessor.toString().toLowerCase().includes(searchText)) {
        isValuePresent = true;
      }
    }

    return isValuePresent;
  };

  var updateRowInGrid = function updateRowInGrid(original, updatedRow) {
    setItems(function (old) {
      return old.map(function (row) {
        if (Object.entries(row).toString() === Object.entries(original).toString()) {
          row = updatedRow;
        }

        return row;
      });
    });

    if (updateRowData) {
      updateRowData(updatedRow);
    }
  };

  var deleteRowFromGrid = function deleteRowFromGrid(original) {
    setItems(function (old) {
      return old.filter(function (row) {
        return row !== original;
      });
    });

    if (deleteRowData) {
      deleteRowData(original);
    }
  };

  var processedColumns = extractColumns(columns, searchColumn, isDesktop, updateRowInGrid);
  var additionalColumn = extractAdditionalColumn(columnToExpand, isDesktop);
  var gridColumns = useMemo(function () {
    return processedColumns;
  }, []);
  var renderExpandedContent = additionalColumn ? additionalColumn.displayCell : null;

  var displayExpandedContent = function displayExpandedContent(row) {
    var original = row.original;

    if (original) {
      return /*#__PURE__*/React__default.createElement(AdditionalColumnContext.Provider, {
        value: {
          additionalColumn: additionalColumn
        }
      }, renderExpandedContent(original, AdditionalColumnTag));
    }
  };

  var globalSearchLogic = function globalSearchLogic(rows, columns, filterValue) {
    if (filterValue && processedColumns.length > 0) {
      var searchText = filterValue.toLowerCase();
      return rows.filter(function (row) {
        var original = row.original;
        var returnValue = false;
        processedColumns.map(function (column) {
          returnValue = returnValue || searchColumn(column, original, searchText);
        });
        return returnValue;
      });
    }

    return rows;
  };

  var calculateDefaultRowHeight = function calculateDefaultRowHeight(row, gridColumns) {
    var rowHeight = 50;

    if (gridColumns && gridColumns.length > 0 && row) {
      var original = row.original,
          isExpanded = row.isExpanded;
      var columnWithMaxWidth = [].concat(gridColumns).sort(function (a, b) {
        return b.width - a.width;
      })[0];
      var id = columnWithMaxWidth.id,
          width = columnWithMaxWidth.width,
          totalFlexWidth = columnWithMaxWidth.totalFlexWidth;
      var rowValue = original[id];

      if (rowValue) {
        var textLength = Object.values(rowValue).join(",").length;
        rowHeight += Math.ceil(80 * textLength / totalFlexWidth);
        var widthVariable = totalFlexWidth > width ? totalFlexWidth - width : width - totalFlexWidth;
        rowHeight += widthVariable / 1000;
      }

      if (isExpanded && additionalColumn) {
        rowHeight += additionalColumn.innerCells && additionalColumn.innerCells.length > 0 ? additionalColumn.innerCells.length * 35 : 35;
      }
    }

    return rowHeight;
  };

  var compareValues = function compareValues(compareOrder, v1, v2) {
    if (compareOrder === "Ascending") {
      return v1 > v2 ? 1 : v1 < v2 ? -1 : 0;
    }

    return v1 < v2 ? 1 : v1 > v2 ? -1 : 0;
  };

  var getSortedData = function getSortedData(originalData) {
    return originalData.sort(function (x, y) {
      var compareResult = 0;
      groupSortOptions.forEach(function (option) {
        var sortBy = option.sortBy,
            sortOn = option.sortOn,
            order = option.order;
        var newResult = sortOn === "value" ? compareValues(order, x[sortBy], y[sortBy]) : compareValues(order, x[sortBy][sortOn], y[sortBy][sortOn]);
        compareResult = compareResult || newResult;
      });
      return compareResult;
    });
  };

  var doGroupSort = function doGroupSort(sortOptions) {
    setGroupSortOptions(sortOptions);
  };

  var loadNextPage = function loadNextPage() {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    var newIndex = args && args.length > 0 ? args[0] : -1;

    if (newIndex >= 0 && hasNextPage) {
      setIsLoading(true);
      setIsNextPageLoading(true);
      fetchData(newIndex).then(function (data) {
        setIsLoading(false);
        setHasNextPage(data && data.length > 0);
        setIsNextPageLoading(false);
        setItems(items.concat(data));
      });
    }
  };

  useEffect(function () {
    processedColumns.map(function (column) {
      if (column.innerCells) {
        column.originalInnerCells = column.innerCells;
      }

      return column;
    });

    if (additionalColumn) {
      var innerCells = additionalColumn.innerCells;

      if (innerCells) {
        additionalColumn.originalInnerCells = innerCells;
      }
    }

    setIsLoading(true);
    fetchData(0).then(function (data) {
      setIsLoading(false);
      setItems(data);
    });
  }, []);
  var data = getSortedData([].concat(items));
  return /*#__PURE__*/React__default.createElement("div", {
    className: "grid-component-container"
  }, data && data.length > 0 && processedColumns && processedColumns.length > 0 ? /*#__PURE__*/React__default.createElement("div", null, /*#__PURE__*/React__default.createElement(Customgrid, {
    title: title,
    gridHeight: gridHeight,
    gridWidth: gridWidth,
    managableColumns: gridColumns,
    originalColumns: gridColumns,
    additionalColumn: additionalColumn,
    data: data,
    getRowEditOverlay: getRowEditOverlay,
    updateRowInGrid: updateRowInGrid,
    deleteRowFromGrid: deleteRowFromGrid,
    globalSearchLogic: globalSearchLogic,
    selectBulkData: selectBulkData,
    calculateRowHeight: calculateRowHeight && typeof calculateRowHeight === "function" ? calculateRowHeight : calculateDefaultRowHeight,
    isExpandContentAvailable: typeof renderExpandedContent === "function",
    displayExpandedContent: displayExpandedContent,
    rowActions: rowActions,
    rowActionCallback: rowActionCallback,
    hasNextPage: hasNextPage,
    isNextPageLoading: isNextPageLoading,
    loadNextPage: loadNextPage,
    doGroupSort: doGroupSort
  }), isNextPageLoading ? /*#__PURE__*/React__default.createElement("div", {
    id: "loader",
    className: "background"
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "dots container"
  }, /*#__PURE__*/React__default.createElement("span", null), /*#__PURE__*/React__default.createElement("span", null), /*#__PURE__*/React__default.createElement("span", null))) : null) : /*#__PURE__*/React__default.createElement("h2", {
    style: {
      textAlign: "center",
      marginTop: "70px"
    }
  }, isLoading ? "Initializing Grid..." : /*#__PURE__*/React__default.createElement("span", {
    className: "error"
  }, "Invalid Data or Column Configurations")));
});
Grid.propTypes = {
  title: PropTypes.any,
  gridHeight: PropTypes.any,
  gridWidth: PropTypes.any,
  columns: PropTypes.any,
  columnToExpand: PropTypes.any,
  fetchData: PropTypes.any,
  getRowEditOverlay: PropTypes.any,
  updateRowData: PropTypes.any,
  deleteRowData: PropTypes.any,
  selectBulkData: PropTypes.any,
  calculateRowHeight: PropTypes.any,
  cellKey: PropTypes.any,
  children: PropTypes.any
};

export default Grid;
//# sourceMappingURL=index.modern.js.map
