import React__default, { memo, useState, Fragment, forwardRef, useRef, useEffect, useMemo, useCallback, createRef } from 'react';
import ClickAwayListener from 'react-click-away-listener';
import { useAsyncDebounce, useTable, useFilters, useGlobalFilter, useSortBy, useExpanded, useRowSelect, useFlexLayout, useResizeColumns } from 'react-table';
import { VariableSizeList } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import InfiniteLoader from 'react-window-infinite-loader';
import { useDrag, useDrop, DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';
import MultiBackend, { TouchTransition } from 'react-dnd-multi-backend';
import update from 'immutability-helper';
import '!style-loader!css-loader!sass-loader!./styles/columnreorder.scss';
import '!style-loader!css-loader!sass-loader!./styles/groupsort.scss';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { saveAs } from 'file-saver';
import { utils, write } from 'xlsx';
import '!style-loader!css-loader!sass-loader!./styles/exportdata.scss';
import '!style-loader!css-loader!sass-loader!./styles/main.scss';

const CellDisplayAndEdit = /*#__PURE__*/memo(({
  row,
  columns,
  updateRowInGrid
}) => {
  const {
    column
  } = row;

  if (column && row.row) {
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [editedRowValue, setEditedRowValue] = useState(null);
    const {
      id
    } = column;

    const closeEdit = () => {
      setIsEditOpen(false);
    };

    const openEdit = () => {
      setIsEditOpen(true);
    };

    const getUpdatedRowValue = value => {
      if (value) {
        setEditedRowValue(value);
      }
    };

    const saveEdit = () => {
      if (editedRowValue) {
        updateRowInGrid(row.row.original, editedRowValue);
      }

      closeEdit();
    };

    const DisplayTag = props => {
      const {
        cellKey,
        columnKey
      } = props;

      if (columns && columnKey) {
        const selectedColumn = columns.find(col => col.accessor === columnKey);

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

    const checkInnerCells = (column, cellKey) => {
      if (column) {
        const {
          innerCells
        } = column;

        if (innerCells) {
          const innerCellData = innerCells.find(cell => {
            return cell.accessor === cellKey;
          });

          if (innerCellData) {
            return true;
          }
        }
      }

      return false;
    };

    const originalRowValue = { ...row.row.original
    };
    const cellDisplayContent = column.displayCell(originalRowValue, DisplayTag);
    const cellEditContent = column.editCell ? column.editCell(originalRowValue, DisplayTag, getUpdatedRowValue) : null;
    return /*#__PURE__*/React__default.createElement(ClickAwayListener, {
      onClickAway: closeEdit
    }, /*#__PURE__*/React__default.createElement("div", {
      className: `table-cell--content table-cell--content__${id}`
    }, cellEditContent ? /*#__PURE__*/React__default.createElement("div", {
      className: "cell-edit",
      onClick: openEdit
    }, /*#__PURE__*/React__default.createElement("i", {
      className: "fa fa-pencil",
      "aria-hidden": "true"
    })) : null, cellDisplayContent, isEditOpen ? /*#__PURE__*/React__default.createElement("div", {
      className: "table-cell--content-edit"
    }, cellEditContent, /*#__PURE__*/React__default.createElement("button", {
      className: "ok",
      onClick: saveEdit
    }), /*#__PURE__*/React__default.createElement("button", {
      className: "cancel",
      onClick: closeEdit
    })) : null));
  }
});

const extractColumns = (columns, searchColumn, isDesktop, updateRowInGrid) => {
  const filteredColumns = columns.filter(column => {
    return isDesktop ? !column.onlyInTablet : !column.onlyInDesktop;
  });
  let modifiedColumns = [];
  filteredColumns.forEach((column, index) => {
    const {
      innerCells,
      accessor,
      sortValue
    } = column;
    const isInnerCellsPresent = innerCells && innerCells.length > 0;
    column.columnId = `column_${index}`;

    if (!column.Cell && column.displayCell) {
      column.Cell = row => {
        return /*#__PURE__*/React__default.createElement(CellDisplayAndEdit, {
          row: row,
          columns: columns,
          updateRowInGrid: updateRowInGrid
        });
      };
    }

    if (!column.disableSortBy) {
      if (isInnerCellsPresent) {
        if (sortValue) {
          column.sortType = (rowA, rowB) => {
            return rowA.original[accessor][sortValue] > rowB.original[accessor][sortValue] ? -1 : 1;
          };
        } else {
          column.disableSortBy = true;
        }
      } else if (!innerCells) {
        column.sortType = (rowA, rowB) => {
          return rowA.original[accessor] > rowB.original[accessor] ? -1 : 1;
        };
      }
    }

    if (!column.disableFilters) {
      column.filter = (rows, id, filterValue) => {
        const searchText = filterValue ? filterValue.toLowerCase() : "";
        return rows.filter(row => {
          const {
            original
          } = row;
          return searchColumn(column, original, searchText);
        });
      };
    }

    modifiedColumns.push(column);
  });
  return modifiedColumns;
};
const extractAdditionalColumn = (additionalColumn, isDesktop) => {
  const {
    innerCells
  } = additionalColumn;
  const isInnerCellsPresent = innerCells && innerCells.length > 0;
  additionalColumn.columnId = `ExpandColumn`;

  if (isInnerCellsPresent) {
    additionalColumn.innerCells = innerCells.filter(cell => {
      return isDesktop ? !cell.onlyInTablet : !cell.onlyInDesktop;
    });
  }

  return additionalColumn;
};

const RowSelector = /*#__PURE__*/memo( /*#__PURE__*/forwardRef(({
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
  return /*#__PURE__*/React__default.createElement("div", {
    className: "check-wrap"
  }, /*#__PURE__*/React__default.createElement("input", Object.assign({
    type: "checkbox",
    checked: checkValue,
    onChange: onChange,
    ref: resolvedRef
  }, rest)));
}));

const DefaultColumnFilter = /*#__PURE__*/memo(({
  column: {
    filterValue,
    setFilter
  }
}) => {
  return /*#__PURE__*/React__default.createElement("input", {
    className: "txt",
    value: filterValue || "",
    onChange: e => {
      setFilter(e.target.value || undefined);
    },
    placeholder: "Search"
  });
});

const GlobalFilter = /*#__PURE__*/memo(({
  globalFilter,
  setGlobalFilter
}) => {
  const [value, setValue] = useState(globalFilter);
  const onChange = useAsyncDebounce(value => {
    setGlobalFilter(value || undefined);
  }, 200);
  return /*#__PURE__*/React__default.createElement("div", {
    className: "txt-wrap"
  }, /*#__PURE__*/React__default.createElement("input", {
    type: "text",
    value: value || "",
    onChange: e => {
      setValue(e.target.value);
      onChange(e.target.value);
    },
    className: "txt",
    placeholder: "Search"
  }), /*#__PURE__*/React__default.createElement("i", {
    className: "fa fa-search fa-6",
    "aria-hidden": "true"
  }));
});

var RowDelete = require("./RowDelete~RKolkpAF.svg");

var RowEdit = require("./RowEdit~BuKwAcSl.svg");

var RowPin = require("./RowPin~qQRdvcXq.png");

const RowOptions = /*#__PURE__*/memo(({
  row,
  bindRowEditOverlay,
  bindRowDeleteOverlay
}) => {
  const {
    original
  } = row;
  const [isRowOptionsOpen, setRowOptionsOpen] = useState(false);

  const openRowOptionsOverlay = () => {
    setRowOptionsOpen(true);
  };

  const closeRowOptionsOverlay = () => {
    setRowOptionsOpen(false);
  };

  const openRowEditOverlay = () => {
    bindRowEditOverlay(original);
    closeRowOptionsOverlay();
  };

  const openDeleteOverlay = () => {
    bindRowDeleteOverlay(original);
    closeRowOptionsOverlay();
  };

  return /*#__PURE__*/React__default.createElement("div", null, /*#__PURE__*/React__default.createElement("div", {
    className: "row-options-wrap"
  }, /*#__PURE__*/React__default.createElement("span", {
    className: "icon-row-options",
    onClick: openRowOptionsOverlay
  }, /*#__PURE__*/React__default.createElement("i", null), /*#__PURE__*/React__default.createElement("i", null), /*#__PURE__*/React__default.createElement("i", null)), isRowOptionsOpen ? /*#__PURE__*/React__default.createElement(ClickAwayListener, {
    onClickAway: closeRowOptionsOverlay
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "row-options-overlay"
  }, /*#__PURE__*/React__default.createElement("ul", null, /*#__PURE__*/React__default.createElement("li", null, /*#__PURE__*/React__default.createElement("span", {
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
    onClick: openDeleteOverlay
  }, /*#__PURE__*/React__default.createElement("i", null, /*#__PURE__*/React__default.createElement("img", {
    src: RowDelete,
    alt: "cargo"
  })), /*#__PURE__*/React__default.createElement("span", null, "Delete")))), /*#__PURE__*/React__default.createElement("span", {
    className: "close",
    onClick: closeRowOptionsOverlay
  }, /*#__PURE__*/React__default.createElement("i", {
    className: "fa fa-close"
  })))) : null));
});

const RowEditOverLay = /*#__PURE__*/memo(({
  row,
  columns,
  isRowExpandEnabled,
  additionalColumn,
  getRowEditOverlay,
  closeRowEditOverlay,
  updateRowInGrid
}) => {
  const [editedRowValue, setEditedRowValue] = useState(null);

  const getUpdatedRowValue = value => {
    if (value) {
      setEditedRowValue(value);
    }
  };

  const saveRowEdit = () => {
    if (editedRowValue) {
      updateRowInGrid(row, editedRowValue);
    }

    closeRowEditOverlay();
  };

  const DisplayTag = props => {
    const {
      cellKey,
      columnKey
    } = props;

    if (columns && columnKey) {
      const selectedColumn = columns.find(col => col.accessor === columnKey);

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

  const checkInnerCells = (column, cellKey) => {
    if (column) {
      const {
        innerCells
      } = column;

      if (innerCells) {
        const innerCellData = innerCells.find(cell => {
          return cell.accessor === cellKey;
        });

        if (innerCellData) {
          return true;
        }
      }
    }

    return false;
  };

  const originalRowValue = { ...row
  };
  const rowEditContent = getRowEditOverlay(originalRowValue, DisplayTag, getUpdatedRowValue);
  return /*#__PURE__*/React__default.createElement(ClickAwayListener, {
    onClickAway: closeRowEditOverlay
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "row-option-action-overlay"
  }, rowEditContent, /*#__PURE__*/React__default.createElement("div", {
    className: "cancel-save-buttons"
  }, /*#__PURE__*/React__default.createElement("button", {
    className: "save-Button",
    onClick: saveRowEdit
  }, "Save"), /*#__PURE__*/React__default.createElement("button", {
    className: "cancel-Button",
    onClick: closeRowEditOverlay
  }, "Cancel"))));
});

const RowDeleteOverLay = /*#__PURE__*/memo(({
  row,
  closeRowDeleteOverlay,
  deleteRowFromGrid
}) => {
  const deleteRow = () => {
    if (row) {
      deleteRowFromGrid(row);
    }

    closeRowDeleteOverlay();
  };

  return /*#__PURE__*/React__default.createElement(ClickAwayListener, {
    onClickAway: closeRowDeleteOverlay
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "row-option-action-overlay delete"
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "cancel-save-buttons-delete"
  }, /*#__PURE__*/React__default.createElement("button", {
    className: "delete-Button",
    onClick: deleteRow
  }, "Delete"), /*#__PURE__*/React__default.createElement("button", {
    className: "cancel-Button",
    onClick: closeRowDeleteOverlay
  }, "Cancel"))));
});

const ItemTypes = {
  COLUMN: "column"
};

const ColumnItem = ({
  id,
  Header,
  moveColumn,
  findColumn,
  originalInnerCells,
  isInnerCellSelected,
  selectInnerCells
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
  return /*#__PURE__*/React__default.createElement("div", {
    style: {
      opacity
    }
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "column__reorder"
  }, /*#__PURE__*/React__default.createElement("div", {
    ref: node => drag(drop(node)),
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
  }, originalInnerCells && originalInnerCells.length > 0 ? originalInnerCells.map((cell, index) => {
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

const ColumnsList = props => {
  const {
    updateColumnsInState,
    columnsToManage,
    isInnerCellSelected,
    selectInnerCells
  } = props;

  const moveColumn = (columnId, atIndex) => {
    const {
      column,
      index
    } = findColumn(columnId);
    updateColumnsInState(update(columnsToManage, {
      $splice: [[index, 1], [atIndex, 0, column]]
    }));
  };

  const findColumn = columnId => {
    const column = columnsToManage.filter(c => `${c.columnId}` === columnId)[0];
    return {
      column,
      index: columnsToManage.indexOf(column)
    };
  };

  const [, drop] = useDrop({
    accept: ItemTypes.COLUMN
  });
  return /*#__PURE__*/React__default.createElement(React__default.Fragment, null, /*#__PURE__*/React__default.createElement("div", {
    ref: drop,
    style: {
      display: "flex",
      flexWrap: "wrap"
    }
  }, columnsToManage.map((column, index) => {
    return /*#__PURE__*/React__default.createElement(ColumnItem, {
      key: index,
      id: `${column.columnId}`,
      Header: `${column.Header}`,
      moveColumn: moveColumn,
      findColumn: findColumn,
      originalInnerCells: column.originalInnerCells,
      isInnerCellSelected: isInnerCellSelected,
      selectInnerCells: selectInnerCells
    });
  })));
};

const ColumnReordering = /*#__PURE__*/memo(props => {
  const {
    isManageColumnOpen,
    toggleManageColumns,
    originalColumns,
    isExpandContentAvailable,
    additionalColumn
  } = props;
  const additionalColumnHeader = additionalColumn && additionalColumn.length ? additionalColumn[0].Header : "";

  const getRemarksColumnIfAvailable = () => {
    return isExpandContentAvailable ? additionalColumn : [];
  };

  const concatedOriginalColumns = originalColumns.concat(getRemarksColumnIfAvailable());
  const [managedColumns, setManagedColumns] = useState(originalColumns);
  const [searchedColumns, setSearchedColumns] = useState(concatedOriginalColumns);
  const [remarksColumnToManage, setRemarksColumnToManage] = useState(getRemarksColumnIfAvailable);
  const [isErrorDisplayed, setIsErrorDisplayed] = useState(false);
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

  const filterColumnsList = event => {
    let {
      value
    } = event ? event.target : "";
    value = value ? value.toLowerCase() : "";

    if (value != "") {
      setSearchedColumns(originalColumns.filter(column => {
        return column.Header.toLowerCase().includes(value);
      }).concat(getRemarksColumnIfAvailable().filter(column => {
        return column.Header.toLowerCase().includes(value);
      })));
    } else {
      setSearchedColumns(concatedOriginalColumns);
    }
  };

  const updateColumnsInState = columns => {
    setManagedColumns(columns);
  };

  const findColumn = (columnList, columnHeader) => {
    return columnList.find(column => {
      return column.Header === columnHeader;
    });
  };

  const isItemPresentInList = (list, headerValue) => {
    const filteredList = list.filter(item => {
      return item.Header === headerValue;
    });
    return filteredList && filteredList.length > 0;
  };

  const isCheckboxSelected = header => {
    if (header === additionalColumnHeader) {
      return remarksColumnToManage.length > 0;
    } else if (header === "Select All") {
      return searchedColumns.length === managedColumns.length + remarksColumnToManage.length;
    } else {
      return isItemPresentInList(managedColumns, header);
    }
  };

  const isInnerCellSelected = (columnHeader, header) => {
    const columnListToSearch = columnHeader === additionalColumnHeader ? remarksColumnToManage : managedColumns;
    const selectedColumn = findColumn(columnListToSearch, columnHeader);
    return isItemPresentInList(selectedColumn.innerCells, header);
  };

  const findIndexOfItem = (type, columnsList, indexOfColumnToAdd, columnHeader, originalInnerCells) => {
    if (type === "column") {
      return columnsList.findIndex(column => {
        return column.Header === originalColumns[indexOfColumnToAdd].Header;
      });
    } else {
      return findColumn(columnsList, columnHeader).innerCells.findIndex(cell => {
        return cell.Header === originalInnerCells[indexOfColumnToAdd].Header;
      });
    }
  };

  const selectAllColumns = event => {
    if (event.currentTarget.checked) {
      setManagedColumns(originalColumns);
      setRemarksColumnToManage(getRemarksColumnIfAvailable());
    } else {
      setManagedColumns([]);
      setRemarksColumnToManage([]);
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

    if (value === additionalColumnHeader) {
      if (checked) {
        setRemarksColumnToManage(additionalColumn);
      } else {
        setRemarksColumnToManage([]);
      }
    } else {
      if (checked) {
        let indexOfColumnToAdd = originalColumns.findIndex(column => {
          return column.Header === value;
        });
        const itemToAdd = originalColumns[indexOfColumnToAdd];
        let prevItemIndex = -1;

        while (indexOfColumnToAdd > 0 && prevItemIndex === -1) {
          indexOfColumnToAdd = indexOfColumnToAdd - 1;
          prevItemIndex = findIndexOfItem("column", managedColumns, indexOfColumnToAdd);
        }

        const newColumnsList = [...managedColumns];
        newColumnsList.splice(prevItemIndex + 1, 0, itemToAdd);
        setManagedColumns(newColumnsList);
      } else {
        setManagedColumns(managedColumns.filter(column => {
          return column.Header !== value;
        }));
      }
    }
  };

  const findAndSelectInnerCells = (stateColumnList, setStateColumnList, event) => {
    const {
      currentTarget
    } = event;
    const {
      checked,
      dataset,
      value
    } = currentTarget;
    const {
      columnheader
    } = dataset;
    const selectedColumn = findColumn(stateColumnList, columnheader);
    const {
      originalInnerCells
    } = selectedColumn;

    if (originalInnerCells && originalInnerCells.length > 0) {
      if (checked) {
        let indexOfColumnToAdd = originalInnerCells.findIndex(column => {
          return column.Header === value;
        });
        const itemToAdd = originalInnerCells[indexOfColumnToAdd];
        let prevItemIndex = -1;

        while (indexOfColumnToAdd > 0 && prevItemIndex === -1) {
          indexOfColumnToAdd = indexOfColumnToAdd - 1;
          prevItemIndex = findIndexOfItem("innercell", stateColumnList, indexOfColumnToAdd, columnheader, originalInnerCells);
        }

        const newColumnsList = [...stateColumnList];
        findColumn(newColumnsList, columnheader).innerCells.splice(prevItemIndex + 1, 0, itemToAdd);
        setStateColumnList(newColumnsList);
      } else {
        setStateColumnList(stateColumnList.map(column => {
          if (column.Header === columnheader) {
            column.innerCells = column.innerCells.filter(cell => {
              return cell.Header !== value;
            });
          }

          return column;
        }));
      }
    }
  };

  const selectInnerCells = event => {
    findAndSelectInnerCells(managedColumns, setManagedColumns, event);
  };

  const selectRemarksInnerCells = event => {
    findAndSelectInnerCells(remarksColumnToManage, setRemarksColumnToManage, event);
  };

  const doColumnUpdate = () => {
    setIsErrorDisplayed(false);

    if (managedColumns && managedColumns.length > 0) {
      setSearchedColumns(concatedOriginalColumns);
      props.updateColumnStructure(managedColumns, remarksColumnToManage);
    } else {
      setIsErrorDisplayed(true);
    }

    toggleManageColumns();
  };

  const resetInnerCells = columnList => {
    if (columnList && columnList.length) {
      return columnList.map(column => {
        column.innerCells = column.originalInnerCells;
        return column;
      });
    }

    return columnList;
  };

  const resetColumnUpdate = () => {
    setManagedColumns(resetInnerCells(originalColumns));
    setSearchedColumns(originalColumns.concat(getRemarksColumnIfAvailable()));
    setRemarksColumnToManage(resetInnerCells(getRemarksColumnIfAvailable()));
    props.updateColumnStructure(originalColumns, getRemarksColumnIfAvailable());
  };

  if (isManageColumnOpen) {
    return /*#__PURE__*/React__default.createElement(ClickAwayListener, {
      onClickAway: toggleManageColumns
    }, /*#__PURE__*/React__default.createElement("div", {
      className: "columns--grid"
    }, /*#__PURE__*/React__default.createElement("div", {
      className: "column__grid"
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
    }, "Select All")), searchedColumns.map((column, index) => {
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
    }, remarksColumnToManage[0].originalInnerCells && remarksColumnToManage[0].originalInnerCells.length > 0 ? remarksColumnToManage[0].originalInnerCells.map((cell, index) => {
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
      className: "btns",
      onClick: resetColumnUpdate
    }, "Reset"), /*#__PURE__*/React__default.createElement("button", {
      className: "btns",
      onClick: toggleManageColumns
    }, "Cancel"), /*#__PURE__*/React__default.createElement("button", {
      className: "btns btns__save",
      onClick: doColumnUpdate
    }, "Save")))))));
  } else {
    return /*#__PURE__*/React__default.createElement("div", null);
  }
});

const ItemTypes$1 = {
  SORT_ITEM: "SORT_ITEM"
};

var SortCopy = require("./SortCopy~IGKyJbDR.svg");

var SortDelete = require("./SortDelete~MFpZtzWS.svg");

const SortItem = ({
  id,
  sortOption,
  originalColumns,
  moveSort,
  findSort,
  updateSingleSortingOption,
  copySortOption,
  deleteSortOption
}) => {
  const originalIndex = findSort(id).index;
  const [{
    isDragging
  }, drag] = useDrag({
    item: {
      type: ItemTypes$1.SORT_ITEM,
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
        moveSort(droppedId, originalIndex);
      }
    }
  });
  const [, drop] = useDrop({
    accept: ItemTypes$1.SORT_ITEM,
    canDrop: () => false,

    hover({
      id: draggedId
    }) {
      if (draggedId !== id) {
        const {
          index: overIndex
        } = findSort(id);
        moveSort(draggedId, overIndex);
      }
    }

  });

  const getInncerCellsOfColumn = columnAccessor => {
    return originalColumns.find(column => {
      return column.accessor === columnAccessor;
    }).innerCells;
  };

  const changeSortByOptions = event => {
    const newSortByValue = event.target.value;
    const innerCellsList = getInncerCellsOfColumn(newSortByValue);
    updateSingleSortingOption(id, newSortByValue, innerCellsList && innerCellsList.length > 0 ? innerCellsList[0].accessor : "value", sortOption.order);
  };

  const changeSortOnOptions = event => {
    const newSortOnValue = event.target.value;
    updateSingleSortingOption(id, sortOption.sortBy, newSortOnValue, sortOption.order);
  };

  const changeSortOrderOptions = event => {
    const newSortOrderValue = event.target.value;
    updateSingleSortingOption(id, sortOption.sortBy, sortOption.sortOn, newSortOrderValue);
  };

  const copySort = () => {
    copySortOption(id);
  };

  const deleteSort = () => {
    deleteSortOption(id);
  };

  const opacity = isDragging ? 0.5 : 1;
  return /*#__PURE__*/React__default.createElement("div", {
    className: "sort__bodyContent",
    style: {
      opacity
    }
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "sort__reorder"
  }, /*#__PURE__*/React__default.createElement("div", {
    ref: node => drag(drop(node)),
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
  }, originalColumns.map((orgItem, index) => /*#__PURE__*/React__default.createElement("option", {
    key: index,
    value: orgItem.accessor
  }, orgItem.Header))))), /*#__PURE__*/React__default.createElement("div", {
    className: "sort__reorder"
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "sort__file"
  }, /*#__PURE__*/React__default.createElement("select", {
    className: "custom__ctrl",
    onChange: changeSortOnOptions,
    value: sortOption.sortOn
  }, getInncerCellsOfColumn(sortOption.sortBy) && getInncerCellsOfColumn(sortOption.sortBy).length > 0 ? getInncerCellsOfColumn(sortOption.sortBy).map((innerCellItem, innerCellIndex) => /*#__PURE__*/React__default.createElement("option", {
    key: innerCellIndex,
    value: innerCellItem.accessor
  }, innerCellItem.Header)) : /*#__PURE__*/React__default.createElement("option", {
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
    type: "button",
    onClick: copySort
  }, /*#__PURE__*/React__default.createElement("i", null, /*#__PURE__*/React__default.createElement("img", {
    src: SortCopy,
    alt: "copy sort"
  })))), /*#__PURE__*/React__default.createElement("div", {
    className: "sort__reorder"
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "sort__icon",
    type: "button",
    onClick: deleteSort
  }, /*#__PURE__*/React__default.createElement("i", null, /*#__PURE__*/React__default.createElement("img", {
    src: SortDelete,
    alt: "copy sort"
  })))));
};

const SortingList = props => {
  const {
    updateSortingOptions,
    sortOptions
  } = props;

  const moveSort = (sortId, atIndex) => {
    const {
      sort,
      index
    } = findSort(sortId);
    updateSortingOptions(update(sortOptions, {
      $splice: [[index, 1], [atIndex, 0, sort]]
    }));
  };

  const findSort = sortId => {
    const sort = sortOptions.filter((c, index) => index === sortId)[0];
    return {
      sort,
      index: sortOptions.indexOf(sort)
    };
  };

  const [, drop] = useDrop({
    accept: ItemTypes$1.SORT_ITEM
  });
  return /*#__PURE__*/React__default.createElement(React__default.Fragment, null, /*#__PURE__*/React__default.createElement("div", {
    ref: drop,
    style: {
      display: "flex",
      flexWrap: "wrap"
    }
  }, sortOptions && sortOptions.length > 0 ? /*#__PURE__*/React__default.createElement("ul", null, /*#__PURE__*/React__default.createElement("li", null, "Sort By"), /*#__PURE__*/React__default.createElement("li", null, "Sort On"), /*#__PURE__*/React__default.createElement("li", null, "Order")) : null, sortOptions.map((sortOption, index) => {
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

const GroupSort = /*#__PURE__*/memo(props => {
  const {
    isGroupSortOverLayOpen,
    toggleGroupSortOverLay,
    applyGroupSort,
    originalColumns
  } = props;
  const sortingOrders = ["Ascending", "Descending"];
  const defaultSortingOption = [{
    sortBy: originalColumns[0].accessor,
    sortOn: originalColumns[0].innerCells ? originalColumns[0].innerCells[0].accessor : "value",
    order: sortingOrders[0]
  }];
  const [sortOptions, setSortOptions] = useState([]);
  const [isErrorDisplayed, setIsErrorDisplayed] = useState(false);
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

  const updateSortingOptions = sortingOptions => {
    setSortOptions(sortingOptions);
  };

  const addSortingOptions = () => {
    setSortOptions([...sortOptions, ...defaultSortingOption]);
  };

  const clearSortingOptions = () => {
    setSortOptions([]);
    applyGroupSort([]);
  };

  const updateSingleSortingOption = (sortIndex, sortByValue, sortOnValue, sortOrder) => {
    const newOptionsList = sortOptions.slice(0);
    const newSortingOption = {
      sortBy: sortByValue,
      sortOn: sortOnValue,
      order: sortOrder
    };
    const updatedSortOptions = newOptionsList.map((option, index) => index === sortIndex ? newSortingOption : option);
    updateSortingOptions(updatedSortOptions);
  };

  const copySortOption = sortIndex => {
    const newOption = sortOptions.slice(0)[sortIndex];
    setSortOptions(sortOptions.concat(newOption));
  };

  const deleteSortOption = sortIndex => {
    setSortOptions(sortOptions.filter((option, index) => {
      return index !== sortIndex;
    }));
  };

  const applySort = () => {
    let isError = false;
    sortOptions.map((option, index) => {
      const {
        sortBy,
        sortOn
      } = option;
      const optionIndex = index;
      const duplicateSort = sortOptions.find((opt, optIndex) => {
        return sortBy === opt.sortBy && sortOn === opt.sortOn && optionIndex !== optIndex;
      });

      if (duplicateSort) {
        isError = true;
      }
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
      className: "sorts--grid"
    }, /*#__PURE__*/React__default.createElement("div", {
      className: "sort__grid"
    }, /*#__PURE__*/React__default.createElement("div", {
      className: "sort__settings"
    }, /*#__PURE__*/React__default.createElement("div", {
      className: "sort__header"
    }, /*#__PURE__*/React__default.createElement("div", {
      className: "sort__headerTxt"
    }, "Sort"), /*#__PURE__*/React__default.createElement("div", {
      className: "sort__close"
    }, /*#__PURE__*/React__default.createElement("i", {
      className: "fa fa-times",
      "aria-hidden": "true",
      onClick: toggleGroupSortOverLay
    }))), /*#__PURE__*/React__default.createElement("div", {
      className: "sort__body"
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
      type: "button",
      onClick: addSortingOptions
    }, /*#__PURE__*/React__default.createElement("span", null, "+"), /*#__PURE__*/React__default.createElement("div", {
      className: "sort__txt"
    }, "New Sort"))), /*#__PURE__*/React__default.createElement("div", {
      className: "sort__footer"
    }, /*#__PURE__*/React__default.createElement("div", {
      className: "sort__btns"
    }, /*#__PURE__*/React__default.createElement("button", {
      className: "btns",
      onClick: clearSortingOptions
    }, "Clear All"), /*#__PURE__*/React__default.createElement("button", {
      className: "btns btns__save",
      onClick: applySort
    }, "Ok")))))));
  } else {
    return /*#__PURE__*/React__default.createElement("div", null);
  }
});

const ExportData = /*#__PURE__*/memo(props => {
  const {
    isExportOverlayOpen,
    toggleExportDataOverlay,
    rows,
    originalColumns,
    isExpandContentAvailable,
    additionalColumn
  } = props;

  const getRemarksColumnIfAvailable = () => {
    return isExpandContentAvailable ? additionalColumn : [];
  };

  const updatedColumns = [...originalColumns].concat(getRemarksColumnIfAvailable());
  const [managedColumns, setManagedColumns] = useState(updatedColumns);
  const [searchedColumns, setSearchedColumns] = useState(updatedColumns);
  const [downloadTypes, setDownloadTypes] = useState([]);
  const [warning, setWarning] = useState("");
  let isDownload = false;

  const exportRowData = () => {
    isDownload = true;
    let filteredRow = [];
    let filteredRowValues = [];
    setWarning("");

    if (managedColumns.length > 0 && downloadTypes.length > 0) {
      rows.forEach(rowDetails => {
        let row = rowDetails.original;
        const keys = Object.getOwnPropertyNames(row);
        let filteredColumnVal = {};
        let rowFilteredValues = [];
        keys.forEach(function (key) {
          managedColumns.forEach(columnName => {
            if (columnName.accessor === key || columnName.innerCells && columnName.innerCells.length && columnName.innerCells.includes(key)) {
              let columnValue = "";

              if (typeof row[key] === "object") {
                if (row[key].length === undefined) columnValue = Object.values(row[key]).toString().replace(",", " | ");

                if (row[key].length > 0) {
                  let arrObj = "";
                  row[key].forEach((item, index) => {
                    arrObj = index != 0 ? arrObj + " | " + Object.values(item) : Object.values(item);
                  });
                  columnValue = arrObj;
                }
              } else {
                columnValue = row[key];
              }

              filteredColumnVal[key] = columnValue;
              rowFilteredValues.push(columnValue);
            }
          });
        });
        filteredRow.push(filteredColumnVal);
        filteredRowValues.push(rowFilteredValues);
      });
      downloadTypes.map(item => {
        if (item === "pdf") {
          downloadPDF(filteredRowValues);
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

  const downloadPDF = rowFilteredValues => {
    const unit = "pt";
    const size = "A4";
    const orientation = "landscape";
    const marginLeft = 300;
    const doc = new jsPDF(orientation, unit, size);
    doc.setFontSize(15);
    const title = "iCargo Neo Report";
    const headers = [managedColumns.map(column => {
      return column.Header;
    })];
    let content = {
      startY: 50,
      head: headers,
      body: rowFilteredValues
    };
    doc.text(title, marginLeft, 40);
    doc.autoTable(content);
    doc.save("iCargo Neo Report.pdf");
    isDownload = false;
  };

  const downloadCSVFile = filteredRowValue => {
    const fileType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    const fileExtension = ".csv";
    const fileName = "iCargo Neo Report";
    const ws = utils.json_to_sheet(filteredRowValue);
    const wb = {
      Sheets: {
        data: ws
      },
      SheetNames: ["data"]
    };
    const excelBuffer = write(wb, {
      bookType: "csv",
      type: "array"
    });
    const data = new Blob([excelBuffer], {
      type: fileType
    });
    saveAs(data, fileName + fileExtension);
  };

  const downloadXLSFile = filteredRowValue => {
    const fileType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    const fileExtension = ".xlsx";
    const fileName = "iCargo Neo Report";
    const ws = utils.json_to_sheet(filteredRowValue);
    const wb = {
      Sheets: {
        data: ws
      },
      SheetNames: ["data"]
    };
    const excelBuffer = write(wb, {
      bookType: "xlsx",
      type: "array"
    });
    const data = new Blob([excelBuffer], {
      type: fileType
    });
    saveAs(data, fileName + fileExtension);
  };

  const filterColumnsList = event => {
    let {
      value
    } = event ? event.target : "";
    value = value ? value.toLowerCase() : "";

    if (value != "") {
      setSearchedColumns(originalColumns.filter(column => {
        return column.Header.toLowerCase().includes(value);
      }).concat(getRemarksColumnIfAvailable().filter(column => {
        return column.Header.toLowerCase().includes(value);
      })));
    } else {
      setSearchedColumns(updatedColumns);
    }
  };

  const isCheckboxSelected = header => {
    if (header === "Select All") {
      return managedColumns.length === searchedColumns.length;
    } else {
      const selectedColumn = managedColumns.filter(column => {
        return column.Header === header;
      });
      return selectedColumn && selectedColumn.length > 0;
    }
  };

  const selectAllColumns = event => {
    if (event.target.checked) {
      setManagedColumns(updatedColumns);
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
      let indexOfColumnToAdd = updatedColumns.findIndex(column => {
        return column.Header === value;
      });
      const itemToAdd = updatedColumns[indexOfColumnToAdd];
      let prevItemIndex = -1;

      while (indexOfColumnToAdd > 0 && prevItemIndex === -1) {
        prevItemIndex = managedColumns.findIndex(column => {
          return column.Header === updatedColumns[indexOfColumnToAdd - 1].Header;
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

  const changeDownloadType = event => {
    const {
      value,
      checked
    } = event ? event.currentTarget : "";

    if (checked) {
      setDownloadTypes(downloadTypes.concat([value]));
    } else {
      setDownloadTypes(downloadTypes.filter(type => {
        return type !== value;
      }));
    }
  };

  if (isExportOverlayOpen) {
    return /*#__PURE__*/React__default.createElement(ClickAwayListener, {
      onClickAway: toggleExportDataOverlay
    }, /*#__PURE__*/React__default.createElement("div", {
      className: "exports--grid"
    }, /*#__PURE__*/React__default.createElement("div", {
      className: "export__grid"
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
    }, "Select All")), searchedColumns.map((column, index) => {
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
      className: "btns",
      onClick: toggleExportDataOverlay
    }, "Cancel"), /*#__PURE__*/React__default.createElement("button", {
      className: "btns btns__save",
      onClick: exportRowData
    }, "Export")))))));
  } else {
    return /*#__PURE__*/React__default.createElement("div", null);
  }
});

const listRef = /*#__PURE__*/createRef(null);
const Customgrid = /*#__PURE__*/memo(props => {
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
    hasNextPage,
    isNextPageLoading,
    loadNextPage,
    doGroupSort
  } = props;
  const [columns, setColumns] = useState(managableColumns);
  const [isRowExpandEnabled, setIsRowExpandEnabled] = useState(isExpandContentAvailable);
  const itemCount = hasNextPage ? data.length + 1 : data.length;
  const loadMoreItems = isNextPageLoading ? () => {} : loadNextPage ? loadNextPage : () => {};

  const isItemLoaded = index => !hasNextPage || index < data.length;

  const [isFilterOpen, setFilterOpen] = useState(false);

  const toggleColumnFilter = () => {
    setFilterOpen(!isFilterOpen);
  };

  const [isRowEditOverlyOpen, setIsRowEditOverlyOpen] = useState(false);
  const [editedRowData, setEditedRowData] = useState(null);

  const bindRowEditOverlay = rowValue => {
    setEditedRowData(rowValue);
    setIsRowEditOverlyOpen(true);
  };

  const closeRowEditOverlay = () => {
    setEditedRowData(null);
    setIsRowEditOverlyOpen(false);
  };

  const [isRowDeleteOverlyOpen, setIsRowDeleteOverlyOpen] = useState(false);
  const [deletedRowData, setDeletedRowData] = useState(null);

  const bindRowDeleteOverlay = rowValue => {
    setDeletedRowData(rowValue);
    setIsRowDeleteOverlyOpen(true);
  };

  const closeRowDeleteOverlay = () => {
    setDeletedRowData(null);
    setIsRowDeleteOverlyOpen(false);
  };

  const [isGroupSortOverLayOpen, setGroupSortOverLay] = useState(false);

  const toggleGroupSortOverLay = () => {
    setGroupSortOverLay(!isGroupSortOverLayOpen);
  };

  const applyGroupSort = sortOptions => {
    doGroupSort(sortOptions);
  };

  const [isManageColumnOpen, setManageColumnOpen] = useState(false);

  const toggleManageColumns = () => {
    setManageColumnOpen(!isManageColumnOpen);
  };

  const updateColumnStructure = (newColumnStructure, remarksColumn) => {
    setColumns([...newColumnStructure]);
    setIsRowExpandEnabled(remarksColumn && remarksColumn.length > 0 ? true : false);
  };

  const [isExportOverlayOpen, setIsExportOverlayOpen] = useState(false);

  const toggleExportDataOverlay = () => {
    setIsExportOverlayOpen(!isExportOverlayOpen);
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
      }) => /*#__PURE__*/React__default.createElement(RowSelector, getToggleAllRowsSelectedProps()),
      Cell: ({
        row
      }) => /*#__PURE__*/React__default.createElement(RowSelector, row.getToggleRowSelectedProps())
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
        return /*#__PURE__*/React__default.createElement("div", {
          className: "action"
        }, /*#__PURE__*/React__default.createElement(RowOptions, {
          row: row,
          bindRowEditOverlay: bindRowEditOverlay,
          bindRowDeleteOverlay: bindRowDeleteOverlay
        }), isRowExpandEnabled ? /*#__PURE__*/React__default.createElement("span", Object.assign({
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
      return /*#__PURE__*/React__default.createElement("div", Object.assign({}, row.getRowProps({
        style
      }), {
        className: "table-row tr"
      }), /*#__PURE__*/React__default.createElement("div", {
        className: "table-row-wrap"
      }, row.cells.map(cell => {
        return /*#__PURE__*/React__default.createElement("div", Object.assign({}, cell.getCellProps(), {
          className: "table-cell td"
        }), cell.render("Cell"));
      })), isRowExpandEnabled && row.isExpanded ? /*#__PURE__*/React__default.createElement("div", {
        className: "expand"
      }, displayExpandedContent ? displayExpandedContent(row) : null) : null);
    }
  }, [prepareRow, rows, displayExpandedContent]);
  return /*#__PURE__*/React__default.createElement("div", {
    className: "table-wrapper",
    style: {
      width: gridWidth ? gridWidth : "100%"
    }
  }, /*#__PURE__*/React__default.createElement("link", {
    rel: "stylesheet",
    href: "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
  }), /*#__PURE__*/React__default.createElement("div", {
    className: "table-filter"
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "results"
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "name"
  }, /*#__PURE__*/React__default.createElement("strong", null, rows.length), /*#__PURE__*/React__default.createElement("span", null, " ", title ? title : "Rows"))), /*#__PURE__*/React__default.createElement("div", {
    className: "filter-utilities"
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
    isExpandContentAvailable: isExpandContentAvailable,
    additionalColumn: [additionalColumn]
  }), /*#__PURE__*/React__default.createElement("div", {
    className: "filter-icon keyword-search",
    onClick: toggleColumnFilter
  }, /*#__PURE__*/React__default.createElement("i", {
    className: "fa fa-filter",
    "aria-hidden": "true"
  })), /*#__PURE__*/React__default.createElement("div", {
    className: "filter-icon bulk-select",
    onClick: bulkSelector
  }, /*#__PURE__*/React__default.createElement("i", {
    className: "fa fa-pencil-square-o",
    "aria-hidden": "true"
  })), /*#__PURE__*/React__default.createElement("div", {
    className: "filter-icon bulk-select",
    onClick: toggleGroupSortOverLay
  }, /*#__PURE__*/React__default.createElement("i", {
    className: "fa fa-sort-amount-desc",
    "aria-hidden": "true"
  })), /*#__PURE__*/React__default.createElement("div", {
    className: "filter-icon manage-columns",
    onClick: toggleManageColumns
  }, /*#__PURE__*/React__default.createElement("i", {
    className: "fa fa-columns",
    "aria-hidden": "true"
  })), /*#__PURE__*/React__default.createElement("div", {
    className: "filter-icon manage-columns",
    onClick: toggleExportDataOverlay
  }, /*#__PURE__*/React__default.createElement("i", {
    className: "fa fa-share-alt",
    "aria-hidden": "true"
  })))), /*#__PURE__*/React__default.createElement("div", {
    className: "table-popus"
  }, isRowEditOverlyOpen ? /*#__PURE__*/React__default.createElement(RowEditOverLay, {
    row: editedRowData,
    columns: columns,
    isRowExpandEnabled: isRowExpandEnabled,
    additionalColumn: additionalColumn,
    getRowEditOverlay: getRowEditOverlay,
    closeRowEditOverlay: closeRowEditOverlay,
    updateRowInGrid: updateRowInGrid
  }) : null, isRowDeleteOverlyOpen ? /*#__PURE__*/React__default.createElement(RowDeleteOverLay, {
    row: deletedRowData,
    closeRowDeleteOverlay: closeRowDeleteOverlay,
    deleteRowFromGrid: deleteRowFromGrid
  }) : null), /*#__PURE__*/React__default.createElement("div", {
    className: "tableContainer table-outer",
    style: {
      height: gridHeight ? gridHeight : "50vh",
      overflowX: "auto",
      overflowY: "hidden"
    }
  }, /*#__PURE__*/React__default.createElement(AutoSizer, {
    disableWidth: true,
    disableResizing: true
  }, ({
    height
  }) => /*#__PURE__*/React__default.createElement("div", Object.assign({}, getTableProps(), {
    className: "table"
  }), /*#__PURE__*/React__default.createElement("div", {
    className: "thead table-row table-row--head"
  }, headerGroups.map(headerGroup => /*#__PURE__*/React__default.createElement("div", Object.assign({}, headerGroup.getHeaderGroupProps(), {
    className: "tr"
  }), headerGroup.headers.map(column => /*#__PURE__*/React__default.createElement("div", Object.assign({}, column.getHeaderProps(), {
    className: "table-cell column-heading th"
  }), /*#__PURE__*/React__default.createElement("div", column.getSortByToggleProps(), column.render("Header"), /*#__PURE__*/React__default.createElement("span", null, column.isSorted ? column.isSortedDesc ? /*#__PURE__*/React__default.createElement("i", {
    className: "fa fa-sort-desc",
    "aria-hidden": "true"
  }) : /*#__PURE__*/React__default.createElement("i", {
    className: "fa fa-sort-asc",
    "aria-hidden": "true"
  }) : "")), /*#__PURE__*/React__default.createElement("div", {
    className: `txt-wrap column-filter ${isFilterOpen ? "open" : ""}`
  }, !column.disableFilters ? column.render("Filter") : null), column.canResize && /*#__PURE__*/React__default.createElement("div", Object.assign({}, column.getResizerProps(), {
    className: "resizer"
  }))))))), /*#__PURE__*/React__default.createElement("div", Object.assign({}, getTableBodyProps(), {
    className: "tbody"
  }), /*#__PURE__*/React__default.createElement(InfiniteLoader, {
    isItemLoaded: isItemLoaded,
    itemCount: itemCount,
    loadMoreItems: loadMoreItems
  }, ({
    onItemsRendered,
    ref
  }) => /*#__PURE__*/React__default.createElement(VariableSizeList, {
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
      return calculateRowHeight(rows[index], headerGroups && headerGroups.length ? headerGroups[0].headers : []);
    },
    onItemsRendered: onItemsRendered,
    overscanCount: 20
  }, RenderRow)))))));
});

const Grid = /*#__PURE__*/memo(props => {
  const {
    title,
    gridHeight,
    gridWidth,
    columns,
    columnToExpand,
    fetchData,
    getRowEditOverlay,
    updateRowData,
    deleteRowData,
    selectBulkData,
    calculateRowHeight
  } = props;
  const isDesktop = window.innerWidth > 1024;
  const [hasNextPage, setHasNextPage] = useState(true);
  const [isNextPageLoading, setIsNextPageLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [groupSortOptions, setGroupSortOptions] = useState([]);

  const searchColumn = (column, original, searchText) => {
    let isValuePresent = false;
    const {
      accessor,
      innerCells
    } = column;
    const rowAccessorValue = original[accessor];
    const isInnerCellsPresent = innerCells && innerCells.length > 0;

    if (typeof rowAccessorValue === "object" && isInnerCellsPresent) {
      if (rowAccessorValue.length > 0) {
        rowAccessorValue.map(value => {
          innerCells.map(cell => {
            const dataAccessor = value[cell.accessor];

            if (dataAccessor && dataAccessor.toString().toLowerCase().includes(searchText)) {
              isValuePresent = true;
            }
          });
        });
      } else {
        innerCells.map(cell => {
          const dataAccessor = original[accessor][cell.accessor];

          if (dataAccessor && dataAccessor.toString().toLowerCase().includes(searchText)) {
            isValuePresent = true;
          }
        });
      }
    } else {
      const dataAccessor = original[accessor];

      if (dataAccessor && dataAccessor.toString().toLowerCase().includes(searchText)) {
        isValuePresent = true;
      }
    }

    return isValuePresent;
  };

  const updateRowInGrid = (original, updatedRow) => {
    setItems(old => old.map(row => {
      if (Object.entries(row).toString() === Object.entries(original).toString()) {
        row = updatedRow;
      }

      return row;
    }));

    if (updateRowData) {
      updateRowData(updatedRow);
    }
  };

  const deleteRowFromGrid = original => {
    setItems(old => old.filter(row => {
      return row !== original;
    }));

    if (deleteRowData) {
      deleteRowData(original);
    }
  };

  let processedColumns = extractColumns(columns, searchColumn, isDesktop, updateRowInGrid);
  let additionalColumn = extractAdditionalColumn(columnToExpand, isDesktop);
  const gridColumns = useMemo(() => processedColumns, []);
  let renderExpandedContent = additionalColumn ? additionalColumn.displayCell : null;

  const DisplayTag = props => {
    console.log(additionalColumn);
    const {
      cellKey
    } = props;

    if (additionalColumn && cellKey) {
      if (checkInnerCells(additionalColumn, cellKey)) {
        return /*#__PURE__*/React__default.createElement(Fragment, null, " ", props.children);
      }
    }

    return null;
  };

  const checkInnerCells = (column, cellKey) => {
    if (column) {
      const {
        innerCells
      } = column;

      if (innerCells) {
        const innerCellData = innerCells.find(cell => {
          return cell.accessor === cellKey;
        });

        if (innerCellData) {
          return true;
        }
      }
    }

    return false;
  };

  const displayExpandedContent = row => {
    const {
      original
    } = row;

    if (original) {
      return renderExpandedContent(original, DisplayTag);
    }
  };

  const globalSearchLogic = (rows, columns, filterValue) => {
    if (filterValue && processedColumns.length > 0) {
      const searchText = filterValue.toLowerCase();
      return rows.filter(row => {
        const {
          original
        } = row;
        let returnValue = false;
        processedColumns.map(column => {
          returnValue = returnValue || searchColumn(column, original, searchText);
        });
        return returnValue;
      });
    }

    return rows;
  };

  const calculateDefaultRowHeight = (row, gridColumns) => {
    let rowHeight = 50;

    if (gridColumns && gridColumns.length > 0 && row) {
      const {
        original,
        isExpanded
      } = row;
      const columnWithMaxWidth = [...gridColumns].sort((a, b) => {
        return b.width - a.width;
      })[0];
      const {
        id,
        width,
        totalFlexWidth
      } = columnWithMaxWidth;
      const rowValue = original[id];

      if (rowValue) {
        const textLength = Object.values(rowValue).join(",").length;
        rowHeight = rowHeight + Math.ceil(80 * textLength / totalFlexWidth);
        const widthVariable = totalFlexWidth > width ? totalFlexWidth - width : width - totalFlexWidth;
        rowHeight = rowHeight + widthVariable / 1000;
      }

      if (isExpanded && additionalColumn) {
        rowHeight = rowHeight + (additionalColumn.innerCells && additionalColumn.innerCells.length > 0 ? additionalColumn.innerCells.length * 35 : 35);
      }
    }

    return rowHeight;
  };

  const compareValues = (compareOrder, v1, v2) => {
    if (compareOrder === "Ascending") {
      return v1 > v2 ? 1 : v1 < v2 ? -1 : 0;
    } else {
      return v1 < v2 ? 1 : v1 > v2 ? -1 : 0;
    }
  };

  const getSortedData = originalData => {
    return originalData.sort(function (x, y) {
      let compareResult = 0;
      groupSortOptions.forEach(option => {
        const {
          sortBy,
          sortOn,
          order
        } = option;
        const newResult = sortOn === "value" ? compareValues(order, x[sortBy], y[sortBy]) : compareValues(order, x[sortBy][sortOn], y[sortBy][sortOn]);
        compareResult = compareResult || newResult;
      });
      return compareResult;
    });
  };

  const doGroupSort = sortOptions => {
    setGroupSortOptions(sortOptions);
  };

  const loadNextPage = (...args) => {
    const newIndex = args && args.length > 0 ? args[0] : -1;

    if (newIndex >= 0 && hasNextPage) {
      setIsLoading(true);
      setIsNextPageLoading(true);
      fetchData(newIndex).then(data => {
        setIsLoading(false);
        setHasNextPage(data && data.length > 0);
        setIsNextPageLoading(false);
        setItems(items.concat(data));
      });
    }
  };

  useEffect(() => {
    processedColumns.map(column => {
      if (column.innerCells) {
        column.originalInnerCells = column.innerCells;
      }

      return column;
    });

    if (additionalColumn) {
      const {
        innerCells
      } = additionalColumn;

      if (innerCells) {
        additionalColumn.originalInnerCells = innerCells;
      }
    }

    setIsLoading(true);
    fetchData(0).then(data => {
      setIsLoading(false);
      setItems(data);
    });
  }, []);
  const data = getSortedData([...items]);
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
  }, isLoading ? "Initializing Grid..." : "Invalid Data or Column Configurations"));
});

export default Grid;
//# sourceMappingURL=index.modern.js.map
