import React, { useState, useEffect, Fragment, Component } from 'react';
import { Toolbar, Editors, Data, Filters } from 'react-data-grid-addons';
import { FormControl } from 'react-bootstrap';
import { faTimes, faAlignJustify, faCopy, faTrash, faPlus, faFilePdf, faFileExcel, faFileCsv, faSave, faSortAmountDown, faSortDown, faColumns, faShareAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';
import ReactDataGrid from 'react-data-grid';
import { useDrag, useDrop, DndProvider } from 'react-dnd';
import { TouchBackend } from 'react-dnd-touch-backend';
import update from 'immutability-helper';
import JSPDF from 'jspdf';
import 'jspdf-autotable';
import { saveAs } from 'file-saver';
import { utils, write } from 'xlsx';

class ExtDataGrid extends ReactDataGrid {
  componentDidMount() {
    this._mounted = true;
    this.dataGridComponent = document.getElementsByClassName("react-grid-Viewport")[0];
    window.addEventListener("resize", this.metricsUpdated);

    this.metricsUpdated();
  }

  componentWillUnmount() {
    this._mounted = false;
    window.removeEventListener("resize", this.metricsUpdated);
  }

}

const applyFormula = (obj, columnName) => {
  const val = obj;
  const item = val[columnName].toString();

  if (item && item.charAt(0) === "=") {
    const operation = item.split("(");
    const value = operation[1].substring(0, operation[1].length - 1).split(/[,:]/);

    switch (operation[0]) {
      case "=SUM":
      case "=ADD":
      case "=sum":
      case "=add":
        val[columnName] = value.reduce(function (a, b) {
          return Number(a) + Number(b);
        });
        break;

      case "=MUL":
      case "=mul":
        val[columnName] = value.reduce(function (a, b) {
          return Number(a) * Number(b);
        });
        break;

      case "=SUB":
      case "=sub":
      case "=DIFF":
      case "=diff":
        val[columnName] = value.reduce(function (a, b) {
          return Number(a) - Number(b);
        });
        break;

      case "=min":
      case "=MIN":
        val[columnName] = Math.min.apply(Math, value);
        break;

      case "=max":
      case "=MAX":
        val[columnName] = Math.max.apply(Math, value);
        break;

      default:
        console.log("No Calculation");
    }
  }

  return val;
};

class DatePicker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: new Date()
    };
    this.input = null;
    this.getInputNode = this.getInputNode.bind(this);
    this.getValue = this.getValue.bind(this);
    this.onValueChanged = this.onValueChanged.bind(this);
  }

  onValueChanged(ev) {
    this.setState({
      value: ev.target.value
    });
  }

  getValue() {
    const updated = {};
    const date = new Date(this.state.value);
    const dateTimeFormat = new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "numeric",
      day: "2-digit"
    });
    const [{
      value: month
    },, {
      value: day
    },, {
      value: year
    }] = dateTimeFormat.formatToParts(date);
    updated[this.props.column.key] = `${year}-${month}-${day}`;
    return updated;
  }

  getInputNode() {
    return this.input;
  }

  render() {
    return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("input", {
      type: "date",
      ref: ref => {
        this.input = ref;
      },
      value: this.state.value,
      onChange: this.onValueChanged
    }));
  }

}
DatePicker.propTypes = {
  column: PropTypes.string
};

const SEARCH_NOT_FOUNT_ERROR = "No Records found!";

const ErrorMessage = props => {
  const [status, setStatus] = useState(props.status);
  useEffect(() => {
    setStatus(props.status);
  }, [props.status]);

  if (status === "invalid") {
    return /*#__PURE__*/React.createElement("div", {
      id: "errorMsg"
    }, /*#__PURE__*/React.createElement("div", {
      className: "alert alert-danger",
      role: "alert"
    }, SEARCH_NOT_FOUNT_ERROR), /*#__PURE__*/React.createElement("div", {
      className: "notification-close"
    }, /*#__PURE__*/React.createElement(FontAwesomeIcon, {
      icon: faTimes,
      onClick: () => {
        props.closeWarningStatus();
        props.clearSearchValue();
      }
    })));
  }

  return /*#__PURE__*/React.createElement("div", null);
};

const ItemTypes = {
  COLUMN: "column"
};

const style = {
  cursor: "move"
};

const ColumnItem = ({
  id,
  text,
  moveColumn,
  findColumn
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
    ref: node => drag(drop(node)),
    style: { ...style,
      opacity
    }
  }, text);
};

ColumnItem.propTypes = {
  id: PropTypes.any,
  text: PropTypes.any,
  moveColumn: PropTypes.any,
  findColumn: PropTypes.any
};

const ColumnsList = props => {
  const [columns, setColumns] = useState([...props.columnsArray]);

  const findColumn = id => {
    const column = columns.filter(c => `${c.id}` === id)[0];
    return {
      column,
      index: columns.indexOf(column)
    };
  };

  const moveColumn = (id, atIndex) => {
    const {
      column,
      index
    } = findColumn(id);
    setColumns(update(columns, {
      $splice: [[index, 1], [atIndex, 0, column]]
    }));
    const values = [];
    let temp = [];
    temp = update(columns, {
      $splice: [[index, 1], [atIndex, 0, column]]
    });
    temp.forEach(item => {
      values.push(item.id);
    });
    props.handleReorderList(values);
  };

  const [, drop] = useDrop({
    accept: ItemTypes.COLUMN
  });
  React.useEffect(() => {
    setColumns(props.columnsArray);
  }, [props.columnsArray]);
  return /*#__PURE__*/React.createElement(Fragment, null, /*#__PURE__*/React.createElement("div", {
    ref: drop,
    style: {
      display: "flex",
      flexWrap: "wrap"
    }
  }, columns.map(column => /*#__PURE__*/React.createElement(ColumnItem, {
    key: column.id,
    id: `${column.id}`,
    text: column.text,
    moveColumn: moveColumn,
    findColumn: findColumn
  }))));
};

ColumnsList.propTypes = {
  columnsArray: PropTypes.any,
  handleReorderList: PropTypes.any
};

class ColumnReordering extends React.Component {
  constructor(props) {
    super(props);

    this.resetColumnReorderList = () => {
      this.setState({
        columnReorderEntityList: this.props.columns.map(item => item.name),
        leftPinnedColumList: [],
        isAllSelected: true
      });
    };

    this.selectAllToColumnReOrderList = () => {
      this.resetColumnReorderList();
      let existingColumnReorderEntityList = this.state.columnReorderEntityList;
      let isExistingAllSelect = this.state.isAllSelected;

      if (!isExistingAllSelect) {
        existingColumnReorderEntityList = this.props.columns.map(item => item.name);
        isExistingAllSelect = true;
      } else {
        existingColumnReorderEntityList = [];
        isExistingAllSelect = false;
      }

      this.setState({
        columnReorderEntityList: existingColumnReorderEntityList,
        isAllSelected: isExistingAllSelect,
        leftPinnedColumList: []
      });
    };

    this.addToColumnReorderEntityList = typeToBeAdded => {
      let existingColumnReorderEntityList = this.state.columnReorderEntityList;
      let existingLeftPinnedList = this.state.leftPinnedColumList;

      if (!existingColumnReorderEntityList.includes(typeToBeAdded)) {
        let indexOfInsertion = this.state.columnSelectList.findIndex(item => item === typeToBeAdded);

        while (indexOfInsertion > 0) {
          if (existingColumnReorderEntityList.includes(this.state.columnSelectList[indexOfInsertion - 1])) {
            if (!existingLeftPinnedList.includes(this.state.columnSelectList[indexOfInsertion - 1])) {
              indexOfInsertion = existingColumnReorderEntityList.findIndex(item => item === this.state.columnSelectList[indexOfInsertion - 1]);
              indexOfInsertion += 1;
              break;
            } else {
              indexOfInsertion -= 1;
            }
          } else {
            indexOfInsertion -= 1;
          }
        }

        existingColumnReorderEntityList.splice(indexOfInsertion, 0, typeToBeAdded);
      } else {
        existingColumnReorderEntityList = existingColumnReorderEntityList.filter(item => {
          if (item !== typeToBeAdded) return item;else return "";
        });

        if (existingLeftPinnedList.includes(typeToBeAdded)) {
          existingLeftPinnedList = existingLeftPinnedList.filter(item => item !== typeToBeAdded);
        }
      }

      this.setState({
        columnReorderEntityList: existingColumnReorderEntityList,
        isAllSelected: false,
        leftPinnedColumList: existingLeftPinnedList
      });
    };

    this.filterColumnReorderList = e => {
      const searchKey = String(e.target.value).toLowerCase();
      const existingList = this.props.columns.map(item => item.name);
      let filtererdColumnReorderList = [];

      if (searchKey.length > 0) {
        filtererdColumnReorderList = existingList.filter(item => {
          return item.toLowerCase().includes(searchKey);
        });
      } else {
        filtererdColumnReorderList = this.props.columns.map(item => item.name);
      }

      this.setState({
        columnSelectList: filtererdColumnReorderList
      });
    };

    this.createColumnsArrayFromProps = colsList => {
      return colsList.map(item => {
        return {
          id: item,
          text: /*#__PURE__*/React.createElement("div", {
            className: "column__reorder",
            key: item
          }, /*#__PURE__*/React.createElement("div", {
            className: ""
          }, /*#__PURE__*/React.createElement(FontAwesomeIcon, {
            icon: faAlignJustify
          })), /*#__PURE__*/React.createElement("div", {
            className: "column__reorder__name"
          }, item), /*#__PURE__*/React.createElement("div", {
            className: "column__wrap"
          }, /*#__PURE__*/React.createElement("div", {
            className: "column__checkbox"
          }, /*#__PURE__*/React.createElement("input", {
            role: "button",
            type: "checkbox",
            id: `checkBoxToPinLeft_${item}`,
            checked: this.state.leftPinnedColumList.includes(item),
            disabled: this.state.maxLeftPinnedColumn - this.state.leftPinnedColumList.length <= 0 ? !this.state.leftPinnedColumList.includes(item) : false,
            onChange: () => this.reArrangeLeftPinnedColumn(item)
          })), /*#__PURE__*/React.createElement("div", {
            className: "column__txt"
          }, "Pin Left")))
        };
      });
    };

    this.reArrangeLeftPinnedColumn = columHeaderName => {
      let existingLeftPinnedList = this.state.leftPinnedColumList;
      let existingColumnReorderEntityList = this.state.columnReorderEntityList;

      if (!existingLeftPinnedList.includes(columHeaderName)) {
        existingLeftPinnedList.unshift(columHeaderName);
      } else {
        existingLeftPinnedList = existingLeftPinnedList.filter(item => item !== columHeaderName);
      }

      this.setState({
        leftPinnedColumList: existingLeftPinnedList
      });
      existingLeftPinnedList.forEach(item => {
        existingColumnReorderEntityList = existingColumnReorderEntityList.filter(subItem => subItem !== item);
        existingColumnReorderEntityList.unshift(item);
        return null;
      });
      this.setState({
        columnReorderEntityList: existingColumnReorderEntityList
      });
    };

    this.handleReorderList = reordered => {
      this.props.handleheaderNameList(reordered);
    };

    this.state = {
      columnReorderEntityList: this.props.headerKeys,
      columnSelectList: this.props.columns.map(item => item.name),
      leftPinnedColumList: this.props.existingPinnedHeadersList,
      isAllSelected: true,
      maxLeftPinnedColumn: this.props.maxLeftPinnedColumn
    };
    this.setWrapperRef = this.setWrapperRef.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
  }

  componentDidMount() {
    document.addEventListener("mousedown", this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleClickOutside);
  }

  setWrapperRef(node) {
    this.wrapperRef = node;
  }

  handleClickOutside(event) {
    if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
      this.props.closeColumnReOrdering();
    }
  }

  render() {
    return /*#__PURE__*/React.createElement("div", {
      className: "columns--grid",
      ref: this.setWrapperRef
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
      className: "custom__ctrl",
      onChange: this.filterColumnReorderList
    })), /*#__PURE__*/React.createElement("div", {
      className: "column__wrap column__headertxt"
    }, /*#__PURE__*/React.createElement("div", {
      className: "column__checkbox"
    }, /*#__PURE__*/React.createElement("input", {
      type: "checkbox",
      id: "selectallcolumncheckbox",
      onChange: () => this.selectAllToColumnReOrderList(),
      checked: this.state.columnReorderEntityList.length === this.props.columns.length
    })), /*#__PURE__*/React.createElement("div", {
      className: "column__txt"
    }, "Select all")), this.state.columnSelectList.map(item => {
      return /*#__PURE__*/React.createElement("div", {
        className: "column__wrap",
        key: item
      }, /*#__PURE__*/React.createElement("div", {
        className: "column__checkbox"
      }, /*#__PURE__*/React.createElement("input", {
        type: "checkbox",
        id: `checkboxtoselectreorder_${item}`,
        checked: this.state.columnReorderEntityList.includes(item),
        onChange: () => this.addToColumnReorderEntityList(item)
      })), /*#__PURE__*/React.createElement("div", {
        className: "column__txt"
      }, item));
    }))), /*#__PURE__*/React.createElement("div", {
      className: "column__settings"
    }, /*#__PURE__*/React.createElement("div", {
      className: "column__header"
    }, /*#__PURE__*/React.createElement("div", {
      className: "column__headerTxt"
    }, /*#__PURE__*/React.createElement("strong", null, "Column Setting")), /*#__PURE__*/React.createElement("div", {
      className: "column__close"
    }, /*#__PURE__*/React.createElement(FontAwesomeIcon, {
      className: "icon-close",
      icon: faTimes,
      onClick: () => this.props.closeColumnReOrdering()
    }))), /*#__PURE__*/React.createElement("div", {
      className: "column__header"
    }, /*#__PURE__*/React.createElement("div", {
      className: "column__headerTxt"
    }, /*#__PURE__*/React.createElement("strong", null, "\xA0 \xA0 Selected Column Count :", " ", this.state.columnReorderEntityList.length)), /*#__PURE__*/React.createElement("div", {
      className: "column__headerTxt"
    }, this.state.maxLeftPinnedColumn - this.state.leftPinnedColumList.length > 0 ? /*#__PURE__*/React.createElement("strong", null, "\xA0 \xA0 Left Pinned Column Count Remaining :", " ", this.state.maxLeftPinnedColumn - this.state.leftPinnedColumList.length) : /*#__PURE__*/React.createElement("strong", {
      style: {
        color: "red"
      }
    }, "\xA0 \xA0 Maximum Count Of Left Pin Columns REACHED"))), /*#__PURE__*/React.createElement("div", {
      className: "column__body"
    }, /*#__PURE__*/React.createElement(DndProvider, {
      backend: TouchBackend,
      options: {
        enableMouseEvents: true
      }
    }, /*#__PURE__*/React.createElement(ColumnsList, {
      columnsArray: this.createColumnsArrayFromProps(this.state.columnReorderEntityList),
      handleReorderList: this.handleReorderList
    }))), /*#__PURE__*/React.createElement("div", {
      className: "column__footer"
    }, /*#__PURE__*/React.createElement("div", {
      className: "column__btns"
    }, /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "btns",
      onClick: () => this.resetColumnReorderList()
    }, "Reset"), /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "btns",
      onClick: () => this.props.closeColumnReOrdering()
    }, "Cancel"), /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "btns btns__save",
      onClick: () => this.props.updateTableAsPerRowChooser(this.state.columnReorderEntityList, this.state.leftPinnedColumList)
    }, "Save"))))));
  }

}

ColumnReordering.propTypes = {
  headerKeys: PropTypes.any,
  columns: PropTypes.any,
  existingPinnedHeadersList: PropTypes.any,
  maxLeftPinnedColumn: PropTypes.any,
  closeColumnReOrdering: PropTypes.any,
  handleheaderNameList: PropTypes.any,
  updateTableAsPerRowChooser: PropTypes.any
};

const ItemTypes$1 = {
  CARD: "sort"
};

const style$1 = {
  cursor: "move"
};

const Card = ({
  id,
  text,
  moveCard,
  findCard
}) => {
  const originalIndex = findCard(id).index;
  const [{
    isDragging
  }, drag] = useDrag({
    item: {
      type: ItemTypes$1.CARD,
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
        moveCard(droppedId, originalIndex);
      }
    }
  });
  const [, drop] = useDrop({
    accept: ItemTypes$1.CARD,
    canDrop: () => false,

    hover({
      id: draggedId
    }) {
      if (draggedId !== id) {
        const {
          index: overIndex
        } = findCard(id);
        moveCard(draggedId, overIndex);
      }
    }

  });
  const opacity = isDragging ? 0.5 : 1;
  return /*#__PURE__*/React.createElement("div", {
    ref: node => drag(drop(node)),
    style: { ...style$1,
      opacity
    }
  }, text);
};

Card.propTypes = {
  id: PropTypes.any,
  text: PropTypes.any,
  moveCard: PropTypes.any,
  findCard: PropTypes.any
};

const SortingList = props => {
  const [cards, setCards] = useState([...props.sortsArray]);

  const findCard = id => {
    const card = cards.filter(c => `${c.id}` === id)[0];
    return {
      card,
      index: cards.indexOf(card)
    };
  };

  const moveCard = (id, atIndex) => {
    const {
      card,
      index
    } = findCard(id);
    setCards(update(cards, {
      $splice: [[index, 1], [atIndex, 0, card]]
    }));
    const values = [];
    let temp = [];
    temp = update(cards, {
      $splice: [[index, 1], [atIndex, 0, card]]
    });
    temp.forEach(item => {
      values.push(item.id);
    });
    props.handleReorderListOfSort(values);
  };

  const [, drop] = useDrop({
    accept: ItemTypes$1.CARD
  });
  React.useEffect(() => {
    setCards(props.sortsArray);
  }, [props.sortsArray]);
  return /*#__PURE__*/React.createElement(Fragment, null, /*#__PURE__*/React.createElement("div", {
    ref: drop,
    style: {
      display: "flex",
      flexWrap: "wrap"
    }
  }, cards.map(card => /*#__PURE__*/React.createElement(Card, {
    key: card.id,
    id: `${card.id}`,
    text: card.text,
    moveCard: moveCard,
    findCard: findCard
  }))));
};

SortingList.propTypes = {
  sortsArray: PropTypes.any,
  handleReorderListOfSort: PropTypes.any
};

class App extends React.Component {
  constructor(props) {
    super(props);

    this.add = () => {
      const rowList = [...this.state.rowList];
      rowList.push(true);
      const existingSortingOrderList = this.state.sortingOrderList;
      existingSortingOrderList.push({
        sortBy: this.props.columnFieldValue[0],
        order: "Ascending",
        sortOn: "Value"
      });
      this.setState({
        rowList,
        sortingOrderList: existingSortingOrderList
      });
    };

    this.copy = i => {
      const rowList = [...this.state.sortingOrderList];
      rowList.push(JSON.parse(JSON.stringify(rowList[i])));
      this.setState({
        sortingOrderList: rowList
      });
    };

    this.clearAll = () => {
      this.setState({
        sortingOrderList: [],
        errorMessage: false
      });
      this.props.clearAllSortingParams();
    };

    this.remove = i => {
      const sortingOrderList = [...this.state.sortingOrderList];
      sortingOrderList.splice(i, 1);
      this.setState({
        sortingOrderList
      });

      if (sortingOrderList.length <= 1) {
        this.setState({
          errorMessage: false
        });
      }
    };

    this.createColumnsArrayFromProps = rowsValue => {
      return rowsValue.map((row, index) => {
        return {
          id: index,
          text: /*#__PURE__*/React.createElement("div", {
            className: "sort__bodyContent",
            key: row
          }, /*#__PURE__*/React.createElement("div", {
            className: "sort__reorder"
          }, /*#__PURE__*/React.createElement("div", {
            className: ""
          }, /*#__PURE__*/React.createElement("div", null, "\xA0")), /*#__PURE__*/React.createElement("div", {
            className: "sort__icon"
          }, /*#__PURE__*/React.createElement(FontAwesomeIcon, {
            icon: faAlignJustify
          }))), /*#__PURE__*/React.createElement("div", {
            className: "sort__reorder"
          }, /*#__PURE__*/React.createElement("div", {
            className: ""
          }, /*#__PURE__*/React.createElement("div", null, "Sort by")), /*#__PURE__*/React.createElement("div", {
            className: "sort__file"
          }, /*#__PURE__*/React.createElement("select", {
            className: "custom__ctrl",
            name: "sortBy",
            onChange: e => this.captureSortingFeildValues(e, index, "sortBy"),
            value: row.sortBy
          }, this.props.columnFieldValue.map(item => /*#__PURE__*/React.createElement("option", {
            key: item
          }, item))))), /*#__PURE__*/React.createElement("div", {
            className: "sort__reorder"
          }, /*#__PURE__*/React.createElement("div", {
            className: ""
          }, /*#__PURE__*/React.createElement("div", null, "Sort on")), /*#__PURE__*/React.createElement("div", {
            className: "sort__file"
          }, /*#__PURE__*/React.createElement("select", {
            className: "custom__ctrl",
            name: "sortOn",
            onChange: e => this.captureSortingFeildValues(e, index, "sortOn"),
            value: row.sortOn
          }, /*#__PURE__*/React.createElement("option", null, "Value")))), /*#__PURE__*/React.createElement("div", {
            className: "sort__reorder"
          }, /*#__PURE__*/React.createElement("div", {
            className: ""
          }, /*#__PURE__*/React.createElement("div", null, "Order")), /*#__PURE__*/React.createElement("div", {
            className: "sort__file"
          }, /*#__PURE__*/React.createElement("select", {
            className: "custom__ctrl",
            name: "order",
            onChange: e => this.captureSortingFeildValues(e, index, "order"),
            value: row.order
          }, /*#__PURE__*/React.createElement("option", null, "Ascending"), /*#__PURE__*/React.createElement("option", null, "Descending")))), /*#__PURE__*/React.createElement("div", {
            className: "sort__reorder"
          }, /*#__PURE__*/React.createElement("div", {
            className: ""
          }, /*#__PURE__*/React.createElement("div", null, "\xA0")), /*#__PURE__*/React.createElement("div", {
            className: "sort__icon"
          }, /*#__PURE__*/React.createElement(FontAwesomeIcon, {
            icon: faCopy,
            title: "Copy",
            onClick: () => this.copy(index)
          }))), /*#__PURE__*/React.createElement("div", {
            className: "sort__reorder"
          }, /*#__PURE__*/React.createElement("div", {
            className: ""
          }, /*#__PURE__*/React.createElement("div", null, "\xA0")), /*#__PURE__*/React.createElement("div", {
            className: "sort__icon"
          }, /*#__PURE__*/React.createElement(FontAwesomeIcon, {
            icon: faTrash,
            title: "Delete",
            onClick: () => this.remove(index)
          }))))
        };
      });
    };

    this.captureSortingFeildValues = (event, index, sortingKey) => {
      const existingSortingOrderList = this.state.sortingOrderList;

      if (sortingKey === "sortBy") {
        existingSortingOrderList[index].sortBy = event.target.value;
      }

      if (sortingKey === "order") {
        existingSortingOrderList[index].order = event.target.value;
      }

      if (existingSortingOrderList[index].sortOn === "" || existingSortingOrderList[index].sortOn === undefined) {
        existingSortingOrderList[index].sortOn = "Value";
      }

      this.setState({
        sortingOrderList: existingSortingOrderList
      });
    };

    this.updateTableAsPerSortCondition = () => {
      const unique = new Set();
      const showError = this.state.sortingOrderList.some(element => unique.size === unique.add(element.sortBy).size);
      showError ? this.setState({
        errorMessage: true
      }) : this.setState({
        errorMessage: false
      });

      if (!showError) {
        this.props.setTableAsPerSortingParams(this.state.sortingOrderList);
      }
    };

    this.handleReorderListOfSort = reOrderedIndexList => {
      this.props.handleTableSortSwap(reOrderedIndexList);
    };

    this.state = {
      rowList: [true],
      sortingOrderList: this.props.sortingParamsObjectList === undefined ? [] : this.props.sortingParamsObjectList,
      errorMessage: false
    };
    this.setWrapperRef = this.setWrapperRef.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
  }

  componentDidMount() {
    document.addEventListener("mousedown", this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleClickOutside);
  }

  setWrapperRef(node) {
    this.wrapperRef = node;
  }

  handleClickOutside(event) {
    if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
      this.props.closeSorting();
    }
  }

  render() {
    return /*#__PURE__*/React.createElement("div", {
      className: "sorts--grid",
      ref: this.setWrapperRef
    }, /*#__PURE__*/React.createElement("div", {
      className: "sort__grid"
    }, /*#__PURE__*/React.createElement("div", {
      className: "sort__settings"
    }, /*#__PURE__*/React.createElement("div", {
      className: "sort__header"
    }, /*#__PURE__*/React.createElement("div", {
      className: "sort__headerTxt"
    }, /*#__PURE__*/React.createElement("strong", null, "Sort ")), /*#__PURE__*/React.createElement("div", {
      className: "sort__close"
    }, /*#__PURE__*/React.createElement(FontAwesomeIcon, {
      className: "icon-close",
      icon: faTimes,
      onClick: () => this.props.closeSorting()
    }))), /*#__PURE__*/React.createElement("div", {
      className: "sort__body"
    }, /*#__PURE__*/React.createElement(DndProvider, {
      backend: TouchBackend,
      options: {
        enableMouseEvents: true
      }
    }, /*#__PURE__*/React.createElement(SortingList, {
      handleReorderListOfSort: this.handleReorderListOfSort,
      sortsArray: this.createColumnsArrayFromProps(this.state.sortingOrderList)
    })), /*#__PURE__*/React.createElement("div", {
      className: "sort-warning"
    }, this.state.errorMessage ? /*#__PURE__*/React.createElement("span", {
      className: "alert alert-danger"
    }, "Sort by opted are same, Please choose different one.") : "")), /*#__PURE__*/React.createElement("div", {
      className: "sort__new"
    }, /*#__PURE__*/React.createElement("div", {
      className: "sort__section"
    }, /*#__PURE__*/React.createElement(FontAwesomeIcon, {
      icon: faPlus,
      className: "sort__icon"
    }), /*#__PURE__*/React.createElement("div", {
      role: "button",
      tabIndex: 0,
      className: "sort__txt",
      onClick: () => this.add(),
      onKeyDown: () => this.add()
    }, "New Sort"))), /*#__PURE__*/React.createElement("div", {
      className: "sort__footer"
    }, /*#__PURE__*/React.createElement("div", {
      className: "sort__btns"
    }, /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "btns",
      onClick: this.clearAll
    }, "Clear All"), /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "btns btns__save",
      onClick: () => this.updateTableAsPerSortCondition()
    }, "Ok"))))));
  }

}

App.propTypes = {
  sortingParamsObjectList: PropTypes.any,
  closeSorting: PropTypes.any,
  columnFieldValue: PropTypes.any,
  clearAllSortingParams: PropTypes.any,
  setTableAsPerSortingParams: PropTypes.any,
  handleTableSortSwap: PropTypes.any
};

let downLaodFileType = [];

class ExportData extends React.Component {
  constructor(props) {
    super(props);

    this.resetColumnExportList = () => {
      this.setState({
        columnEntityList: [],
        isAllSelected: false
      });
    };

    this.selectAllToColumnList = () => {
      this.resetColumnExportList();
      this.setState({
        columnEntityList: !this.state.isAllSelected ? this.props.columnsList : [],
        isAllSelected: !this.state.isAllSelected
      });
    };

    this.addToColumnEntityList = typeToBeAdded => {
      let existingColumnEntityList = this.state.columnEntityList;

      if (!existingColumnEntityList.includes(typeToBeAdded)) {
        existingColumnEntityList.push(typeToBeAdded);
      } else {
        existingColumnEntityList = existingColumnEntityList.filter(item => {
          return item !== typeToBeAdded;
        });
      }

      this.setState({
        columnEntityList: existingColumnEntityList,
        isAllSelected: false
      });
    };

    this.selectDownLoadType = event => {
      if (event.target.checked && !this.state.downLaodFileType.includes(event.target.value)) {
        downLaodFileType.push(event.target.value);
        this.setState({
          downLaodFileType
        });
      } else {
        downLaodFileType.forEach(function (value, index) {
          if (value === event.target.value) {
            downLaodFileType = downLaodFileType.splice(index, value);
          }
        });
        this.setState({
          downLaodFileType
        });
      }
    };

    this.exportRowData = () => {
      const columnVlaueList = this.state.columnEntityList;

      if (columnVlaueList.length > 0 && this.state.downLaodFileType.length > 0) {
        this.props.rows.forEach(row => {
          const keys = Object.getOwnPropertyNames(row);
          const filteredColumnVal = {};
          keys.forEach(function (key) {
            columnVlaueList.forEach(columnName => {
              if (columnName.key === key) filteredColumnVal[key] = row[key];
            });
          });
          this.state.filteredRow.push(filteredColumnVal);
        });
        this.state.downLaodFileType.forEach(item => {
          if (item === "pdf") this.downloadPDF();else if (item === "excel") this.downloadXLSFile();else this.downloadCSVFile();
        });
      }
    };

    this.downloadPDF = () => {
      const unit = "pt";
      const size = "A4";
      const orientation = "landscape";
      const marginLeft = 300;
      const doc = new JSPDF(orientation, unit, size);
      doc.setFontSize(15);
      const title = "iCargo Report";
      const headers = [this.state.columnEntityList.map(column => {
        return column.name;
      })];
      const dataValues = [];
      this.props.rows.forEach(row => {
        const keys = Object.keys(row);
        const filteredColumnVal = [];
        this.state.columnEntityList.forEach(columnName => {
          keys.forEach(key => {
            if (columnName.key === key) filteredColumnVal.push(row[key]);
          });
        });
        dataValues.push(filteredColumnVal);
      });
      const content = {
        startY: 50,
        head: headers,
        body: dataValues
      };
      doc.text(title, marginLeft, 40);
      doc.autoTable(content);
      doc.save("report.pdf");
    };

    this.downloadCSVFile = () => {
      const fileType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
      const fileExtension = ".csv";
      const fileName = "CSVDownload";
      const ws = utils.json_to_sheet(this.state.filteredRow);
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

    this.downloadXLSFile = () => {
      const fileType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
      const fileExtension = ".xlsx";
      const fileName = "XLSXDownload";
      const ws = utils.json_to_sheet(this.state.filteredRow);
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

    this.columnSearchLogic = e => {
      const searchKey = String(e.target.value).toLowerCase();
      const filteredRows = this.props.columnsList.filter(item => {
        return item.name.toLowerCase().includes(searchKey);
      });

      if (!filteredRows.length) {
        this.setState({
          columnValueList: this.props.columnsList
        });
      } else {
        this.setState({
          columnValueList: filteredRows
        });
      }
    };

    this.exportValidation = () => {
      const columnLength = this.state.columnEntityList.length;
      const fileLength = this.state.downLaodFileType.length;

      if (columnLength > 0 && fileLength > 0) {
        this.exportRowData();
        this.setState({
          clickTag: "none"
        });
      } else if (columnLength === 0) {
        this.setState({
          warning: "Column"
        });
        this.setState({
          clickTag: ""
        });
      } else if (fileLength === 0) {
        this.setState({
          warning: "File Type"
        });
        this.setState({
          clickTag: ""
        });
      }

      if (columnLength === 0 && fileLength === 0) {
        this.setState({
          warning: "File Type & Column"
        });
        this.setState({
          clickTag: ""
        });
      }
    };

    this.state = {
      columnValueList: this.props.columnsList,
      columnEntityList: this.props.columnsList,
      isAllSelected: true,
      downLaodFileType: [],
      filteredRow: [],
      warning: "",
      clickTag: "none"
    };
    this.setWrapperRef = this.setWrapperRef.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
    this.selectDownLoadType = this.selectDownLoadType.bind(this);
    this.exportValidation = this.exportValidation.bind(this);
  }

  componentDidMount() {
    document.addEventListener("mousedown", this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleClickOutside);
  }

  setWrapperRef(node) {
    this.wrapperRef = node;
  }

  handleClickOutside(event) {
    if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
      this.props.closeExport();
    }
  }

  render() {
    return /*#__PURE__*/React.createElement("div", {
      className: "exports--grid",
      ref: this.setWrapperRef
    }, /*#__PURE__*/React.createElement("div", {
      className: "export__grid"
    }, /*#__PURE__*/React.createElement("div", {
      className: "export__chooser"
    }, /*#__PURE__*/React.createElement("div", {
      className: "export__header"
    }, /*#__PURE__*/React.createElement("div", {
      className: ""
    }, /*#__PURE__*/React.createElement("strong", null, "Export Data"))), /*#__PURE__*/React.createElement("div", {
      className: "export__body"
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("input", {
      type: "text",
      placeholder: "Search export",
      className: "custom__ctrl",
      onChange: this.columnSearchLogic
    })), /*#__PURE__*/React.createElement("div", {
      className: "export__wrap export__headertxt"
    }, /*#__PURE__*/React.createElement("div", {
      className: "export__checkbox"
    }, /*#__PURE__*/React.createElement("input", {
      className: "selectColumn",
      type: "checkbox",
      onChange: () => this.selectAllToColumnList(),
      checked: this.state.isAllSelected
    })), /*#__PURE__*/React.createElement("div", {
      className: "export__txt"
    }, "Select All")), this.state.columnValueList && this.state.columnValueList.length > 0 ? this.state.columnValueList.map(column => {
      return /*#__PURE__*/React.createElement("div", {
        className: "export__wrap",
        key: column.key
      }, /*#__PURE__*/React.createElement("div", {
        className: "export__checkbox"
      }, /*#__PURE__*/React.createElement("input", {
        type: "checkbox",
        checked: this.state.columnEntityList.includes(column),
        onChange: () => this.addToColumnEntityList(column)
      })), /*#__PURE__*/React.createElement("div", {
        className: "export__txt"
      }, column.name));
    }) : "")), /*#__PURE__*/React.createElement("div", {
      className: "export__settings"
    }, /*#__PURE__*/React.createElement("div", {
      className: "export__header"
    }, /*#__PURE__*/React.createElement("div", {
      className: "export__headerTxt"
    }), /*#__PURE__*/React.createElement("div", {
      className: "export__close"
    }, /*#__PURE__*/React.createElement(FontAwesomeIcon, {
      icon: faTimes,
      className: "icon-close",
      onClick: this.props.closeExport
    }))), /*#__PURE__*/React.createElement("div", {
      className: "export__as"
    }, "Export as"), /*#__PURE__*/React.createElement("div", {
      className: "export__body"
    }, /*#__PURE__*/React.createElement("div", {
      className: "export__reorder"
    }, /*#__PURE__*/React.createElement("div", {
      className: ""
    }, /*#__PURE__*/React.createElement("input", {
      type: "checkbox",
      name: "pdf",
      value: "pdf",
      onChange: this.selectDownLoadType
    })), /*#__PURE__*/React.createElement("div", {
      className: "export__file"
    }, /*#__PURE__*/React.createElement(FontAwesomeIcon, {
      icon: faFilePdf,
      className: "temp"
    }))), /*#__PURE__*/React.createElement("div", {
      className: "export__reorder"
    }, /*#__PURE__*/React.createElement("div", {
      className: ""
    }, /*#__PURE__*/React.createElement("input", {
      type: "checkbox",
      name: "excel",
      value: "excel",
      onChange: this.selectDownLoadType
    })), /*#__PURE__*/React.createElement("div", {
      className: "export__file"
    }, /*#__PURE__*/React.createElement(FontAwesomeIcon, {
      icon: faFileExcel,
      className: "temp"
    }))), /*#__PURE__*/React.createElement("div", {
      className: "export__reorder"
    }, /*#__PURE__*/React.createElement("div", {
      className: ""
    }, /*#__PURE__*/React.createElement("input", {
      type: "checkbox",
      name: "csv",
      value: "csv",
      onChange: this.selectDownLoadType
    })), /*#__PURE__*/React.createElement("div", {
      className: "export__file"
    }, /*#__PURE__*/React.createElement(FontAwesomeIcon, {
      icon: faFileCsv,
      className: "temp"
    }))), /*#__PURE__*/React.createElement("div", {
      className: "exportWarning"
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        display: this.state.clickTag
      },
      className: "alert alert-danger"
    }, "You have not selected", " ", /*#__PURE__*/React.createElement("strong", null, this.state.warning)))), /*#__PURE__*/React.createElement("div", {
      className: "export__footer"
    }, /*#__PURE__*/React.createElement("div", {
      className: "export__btns"
    }, /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "btns",
      onClick: () => this.props.closeExport()
    }, "Cancel"), /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "btns btns__save",
      onClick: () => {
        this.exportValidation();
      }
    }, "Export"))))));
  }

}

ExportData.propTypes = {
  columnsList: PropTypes.any,
  closeExport: PropTypes.any,
  rows: PropTypes.any
};

const {
  DropDownEditor
} = Editors;
const selectors = Data.Selectors;
let swapList = [];
let swapSortList = [];
const {
  AutoCompleteFilter,
  NumericFilter
} = Filters;

class Spreadsheet extends Component {
  constructor(props) {
    var _this;

    super(props);
    _this = this;

    this.handleTableSortSwap = reorderedSwap => {
      swapSortList = reorderedSwap;
    };

    this.updateTableAsPerRowChooser = (inComingColumnsHeaderList, pinnedColumnsList) => {
      let existingColumnsHeaderList = this.props.columns;
      existingColumnsHeaderList = existingColumnsHeaderList.filter(item => {
        return inComingColumnsHeaderList.includes(item.name);
      });
      let rePositionedArray = existingColumnsHeaderList;
      let singleHeaderOneList;

      if (pinnedColumnsList.length > 0) {
        pinnedColumnsList.slice(0).reverse().forEach((item, index) => {
          singleHeaderOneList = existingColumnsHeaderList.filter(subItem => item === subItem.name);
          rePositionedArray = this.arrayMove(existingColumnsHeaderList, existingColumnsHeaderList.indexOf(singleHeaderOneList[0]), index);
        });
      }

      if (swapList.length > 0) {
        swapList.slice(0).forEach((item, index) => {
          singleHeaderOneList = existingColumnsHeaderList.filter(subItem => {
            return item === subItem.name;
          });
          rePositionedArray = this.arrayMove(existingColumnsHeaderList, existingColumnsHeaderList.indexOf(singleHeaderOneList[0]), index);
        });
      }

      existingColumnsHeaderList = rePositionedArray;
      existingColumnsHeaderList.forEach((headerItem, index) => {
        if (headerItem.frozen !== undefined && headerItem.frozen === true) {
          existingColumnsHeaderList[index].frozen = false;
        }

        if (pinnedColumnsList.includes(headerItem.name)) {
          existingColumnsHeaderList[index].frozen = true;
        }
      });

      const toTop = (key, value) => (a, b) => (b[key] === value) - (a[key] === value);

      existingColumnsHeaderList.sort(toTop("frozen", true));
      this.setState({
        columns: existingColumnsHeaderList
      });
      const tempList = [];
      existingColumnsHeaderList.forEach(item => {
        tempList.push(item.name);
      });

      if (swapList.length > 0) {
        for (let i = 0; i < tempList.length; i++) {
          if (tempList[i] === swapList[i]) this.setState({
              pinnedReorder: true
            });
        }
      }

      this.closeColumnReOrdering();
      swapList = [];
      this.setState({
        pinnedReorder: false
      });
    };

    this.arrayMove = (arr, oldIndex, newIndex) => {
      if (newIndex >= arr.length) {
        let k = newIndex - arr.length + 1;

        while (k--) {
          arr.push(undefined);
        }
      }

      arr.splice(newIndex, 0, arr.splice(oldIndex, 1)[0]);
      return arr;
    };

    this.columnReorderingPannel = () => {
      this.setState({
        selectedIndexes: []
      });
      const headerNameList = [];
      const existingPinnedHeadersList = [];
      this.state.columns.filter(item => item.frozen !== undefined && item.frozen === true).map(item => existingPinnedHeadersList.push(item.name));
      this.state.columns.map(item => headerNameList.push(item.name));
      this.setState({
        columnReorderingComponent: /*#__PURE__*/React.createElement(ColumnReordering, Object.assign({
          maxLeftPinnedColumn: this.props.maxLeftPinnedColumn,
          updateTableAsPerRowChooser: this.updateTableAsPerRowChooser,
          headerKeys: headerNameList,
          closeColumnReOrdering: this.closeColumnReOrdering,
          existingPinnedHeadersList: existingPinnedHeadersList,
          handleheaderNameList: this.handleheaderNameList
        }, this.props))
      });
    };

    this.closeColumnReOrdering = () => {
      this.setState({
        columnReorderingComponent: null
      });
    };

    this.handleSearchValue = value => {
      this.setState({
        searchValue: value
      });
    };

    this.clearSearchValue = () => {
      this.setState({
        searchValue: ""
      });
      this.setState({
        filteringRows: this.state.filteringRows
      });
    };

    this.sortingPanel = () => {
      this.setState({
        selectedIndexes: []
      });
      const columnField = [];
      this.state.columns.map(item => columnField.push(item.name));
      this.setState({
        sortingPanelComponent: /*#__PURE__*/React.createElement(App, {
          setTableAsPerSortingParams: args => this.setTableAsPerSortingParams(args),
          sortingParamsObjectList: this.state.sortingParamsObjectList,
          handleTableSortSwap: this.handleTableSortSwap,
          clearAllSortingParams: this.clearAllSortingParams,
          columnFieldValue: columnField,
          closeSorting: this.closeSorting
        })
      });
    };

    this.closeSorting = () => {
      this.setState({
        sortingPanelComponent: null,
        sortingOrderSwapList: []
      });
      swapSortList = [];
    };

    this.clearAllSortingParams = () => {
      const hasSingleSortkey = this.state.sortDirection !== "NONE" && this.state.sortColumn !== "";
      let dataRows = this.getFilterResult([...this.state.dataSet]);

      if (this.state.searchValue !== "") {
        const searchKey = String(this.state.searchValue).toLowerCase();
        dataRows = dataRows.filter(item => {
          return Object.values(item).toString().toLowerCase().includes(searchKey);
        });
      }

      if (hasSingleSortkey) {
        dataRows = this.getSingleSortResult(dataRows);
      }

      this.setState({
        rows: dataRows.slice(0, this.state.pageIndex * this.state.pageRowCount),
        subDataSet: dataRows
      });
    };

    this.exportColumnData = () => {
      let exportData = this.state.dataSet;

      if (this.isSubset()) {
        exportData = this.state.subDataSet;
      }

      this.setState({
        selectedIndexes: []
      });
      this.setState({
        exportComponent: /*#__PURE__*/React.createElement(ExportData, {
          rows: exportData,
          columnsList: this.state.columns,
          closeExport: this.closeExport
        })
      });
    };

    this.closeExport = () => {
      this.setState({
        exportComponent: null
      });
    };

    this.setTableAsPerSortingParams = tableSortList => {
      const hasFilter = Object.keys(this.state.junk).length > 0;
      const hasSearchKey = String(this.state.searchValue).toLowerCase() !== "";
      const hasSingleSortkey = this.state.sortDirection !== "NONE" && this.state.sortColumn !== "";
      let existingRows = [...this.state.dataSet];

      if (hasFilter || hasSearchKey || hasSingleSortkey) {
        existingRows = [...this.state.subDataSet];
      }

      let sortingOrderNameList = [];
      tableSortList.forEach(item => {
        let nameOfItem = "";
        Object.keys(this.state.rows[0]).forEach(rowItem => {
          if (rowItem.toLowerCase() === this.toCamelCase(item.sortBy).toLowerCase()) {
            nameOfItem = rowItem;
          }
        });
        const typeOfItem = this.state.rows[0][item.sortBy === nameOfItem];

        if (typeof typeOfItem === "number") {
          sortingOrderNameList.push({
            name: nameOfItem,
            primer: parseInt,
            reverse: item.order !== "Ascending"
          });
        } else {
          sortingOrderNameList.push({
            name: nameOfItem,
            reverse: item.order !== "Ascending"
          });
        }
      });

      if (swapSortList.length > 0) {
        const existingSortingOrderSwapList = this.state.sortingOrderSwapList;
        swapSortList.forEach((item, index) => {
          const stringOfItemIndex = `${item}${index}`;

          if (item !== index && !existingSortingOrderSwapList.includes(stringOfItemIndex.split("").reverse().join(""))) {
            existingSortingOrderSwapList.push(stringOfItemIndex);
            sortingOrderNameList = this.arrayMove(sortingOrderNameList, item, index);
            tableSortList = this.arrayMove(tableSortList, item, index);
          }

          this.setState({
            sortingOrderSwapList: existingSortingOrderSwapList
          });
        });
      }

      existingRows.sort(sortBy(...sortingOrderNameList));
      this.setState({
        rows: existingRows.slice(0, this.state.pageIndex * this.state.pageRowCount),
        subDataSet: existingRows,
        sortingParamsObjectList: tableSortList
      });
      this.closeSorting();
    };

    this.groupSort = (tableSortList, existingRows) => {
      let sortingOrderNameList = [];
      tableSortList.forEach(item => {
        let nameOfItem = "";
        Object.keys(this.state.rows[0]).forEach(rowItem => {
          if (rowItem.toLowerCase() === this.toCamelCase(item.sortBy).toLowerCase()) {
            nameOfItem = rowItem;
          }
        });
        const typeOfItem = this.state.rows[0][item.sortBy === nameOfItem];

        if (typeof typeOfItem === "number") {
          sortingOrderNameList.push({
            name: nameOfItem,
            primer: parseInt,
            reverse: item.order !== "Ascending"
          });
        } else {
          sortingOrderNameList.push({
            name: nameOfItem,
            reverse: item.order !== "Ascending"
          });
        }
      });

      if (swapSortList.length > 0) {
        const existingSortingOrderSwapList = this.state.sortingOrderSwapList;
        swapSortList.forEach((item, index) => {
          const stringOfItemIndex = `${item}${index}`;

          if (item !== index && !existingSortingOrderSwapList.includes(stringOfItemIndex.split("").reverse().join(""))) {
            existingSortingOrderSwapList.push(stringOfItemIndex);
            sortingOrderNameList = this.arrayMove(sortingOrderNameList, item, index);
            tableSortList = this.arrayMove(tableSortList, item, index);
          }

          this.setState({
            sortingOrderSwapList: existingSortingOrderSwapList
          });
        });
      }

      return existingRows.sort(sortBy(...sortingOrderNameList));
    };

    this.toCamelCase = str => {
      return str.replace(/\s(.)/g, function ($1) {
        return $1.toUpperCase();
      }).replace(/\s/g, "").replace(/^(.)/, function ($1) {
        return $1.toLowerCase();
      });
    };

    this.handleheaderNameList = reordered => {
      swapList = reordered;
    };

    this.getSingleSortResult = data => {
      if (this.state.sortDirection !== "NONE" && this.state.sortColumn !== "") {
        const sortColumn = this.state.sortColumn;
        const sortDirection = this.state.sortDirection;
        this.setState({
          selectedIndexes: []
        });

        const comparer = (a, b) => {
          if (sortDirection === "ASC") {
            return a[sortColumn] > b[sortColumn] ? 1 : -1;
          }

          if (sortDirection === "DESC") {
            return a[sortColumn] < b[sortColumn] ? 1 : -1;
          }

          return 0;
        };

        return sortDirection === "NONE" ? data : [...data].sort(comparer);
      }

      return data;
    };

    this.sortRows = (data, sortColumn, sortDirection) => {
      this.setState({
        selectedIndexes: []
      });

      const comparer = (a, b) => {
        if (sortDirection === "ASC") {
          return a[sortColumn] > b[sortColumn] ? 1 : -1;
        }

        if (sortDirection === "DESC") {
          return a[sortColumn] < b[sortColumn] ? 1 : -1;
        }
      };

      const hasFilter = Object.keys(this.state.junk).length > 0;
      const hasSearchKey = String(this.state.searchValue).toLowerCase() !== "";
      const hasGropSortKeys = this.state.sortingParamsObjectList && this.state.sortingParamsObjectList.length > 0;
      let dtRows = [];

      if (hasFilter || hasSearchKey || hasGropSortKeys) {
        dtRows = this.state.subDataSet;
      } else {
        dtRows = this.state.dataSet;
      }

      const result = [...dtRows].sort(comparer);
      this.setState({
        rows: result.slice(0, this.state.pageIndex * this.state.pageRowCount),
        subDataSet: result,
        selectedIndexes: [],
        sortColumn: sortDirection === "NONE" ? "" : sortColumn,
        sortDirection
      });
      return sortDirection === "NONE" ? data : this.state.rows;
    };

    this.getSlicedRows = async function (filters, rowsToSplit, firstResult) {
      let data = [];

      if (rowsToSplit.length > 0) {
        const chunks = [];

        while (rowsToSplit.length) {
          chunks.push(rowsToSplit.splice(0, 500));
        }

        let index = 0;
        chunks.forEach(async function (arr) {
          _this.getRowsAsync(arr, filters).then(async function (dt) {
            index++;
            data = [...data, ...dt];

            if (index === chunks.length) {
              let dtSet = [...firstResult, ...data];

              if (_this.state.searchValue !== "") {
                const searchKey = String(_this.state.searchValue).toLowerCase();
                dtSet = dtSet.filter(item => {
                  return Object.values(item).toString().toLowerCase().includes(searchKey);
                });
              }

              dtSet = _this.getSingleSortResult(dtSet);

              if (_this.state.sortingParamsObjectList && _this.state.sortingParamsObjectList.length > 0) {
                dtSet = _this.groupSort(_this.state.sortingParamsObjectList, dtSet);
              }

              const rw = dtSet.slice(0, _this.state.pageIndex * _this.state.pageRowCount);
              await _this.setStateAsync({
                subDataSet: dtSet,
                rows: rw,
                tempRows: rw,
                count: rw.length
              });

              if (dtSet.length === 0) {
                _this.handleWarningStatus();
              } else {
                _this.closeWarningStatus(rw);
              }
            }
          });
        });
      }
    };

    this.getRowsAsync = async function (rows, filters) {
      let filterVal = { ...filters
      };

      if (Object.keys(filters).length <= 0) {
        filterVal = {};
      }

      selectors.getRows({
        rows: [],
        filters: {}
      });
      return selectors.getRows({
        rows: rows,
        filters: filterVal
      });
    };

    this.getrows = (rows, filters) => {
      let filterVal = { ...filters
      };

      if (Object.keys(filters).length <= 0) {
        filterVal = {};
      }

      selectors.getRows({
        rows: [],
        filters: {}
      });
      return selectors.getRows({
        rows: rows,
        filters: filterVal
      });
    };

    this.onRowsDeselected = rows => {
      const rowIndexes = rows.map(r => r.rowIdx);
      this.setState({
        selectedIndexes: this.state.selectedIndexes.filter(i => rowIndexes.indexOf(i) === -1)
      });
    };

    this.onGridRowsUpdated = ({
      fromRow,
      toRow,
      updated,
      action
    }) => {
      let columnName = "";
      const filter = this.formulaAppliedCols.filter(item => {
        if (updated[item.key] !== null && updated[item.key] !== undefined) {
          columnName = item.key;
          return true;
        }

        return false;
      });

      if (filter.length > 0) {
        updated = applyFormula(updated, columnName);
      }

      if (action !== "COPY_PASTE") {
        this.setState(state => {
          const rows = state.rows.slice();

          for (let i = fromRow; i <= toRow; i++) {
            rows[i] = { ...rows[i],
              ...updated
            };
          }

          return {
            rows
          };
        });
        this.setState(state => {
          const dataSet = state.dataSet.slice();

          for (let i = fromRow; i <= toRow; i++) {
            dataSet[i] = { ...dataSet[i],
              ...updated
            };
          }

          return {
            dataSet
          };
        });
        this.setState(state => {
          const filteringRows = state.filteringRows.slice();

          for (let i = fromRow; i <= toRow; i++) {
            filteringRows[i] = { ...filteringRows[i],
              ...updated
            };
          }

          return {
            filteringRows
          };
        });
        this.setState(state => {
          const tempRows = state.tempRows.slice();

          for (let i = fromRow; i <= toRow; i++) {
            tempRows[i] = { ...tempRows[i],
              ...updated
            };
          }

          return {
            tempRows
          };
        });
      }

      if (this.props.updateCellData) {
        this.props.updateCellData(this.state.tempRows[fromRow], this.state.tempRows[toRow], updated, action);
      }
    };

    this.onRowsSelected = rows => {
      this.setState({
        selectedIndexes: this.state.selectedIndexes.concat(rows.map(r => r.rowIdx))
      });

      if (this.props.selectBulkData) {
        this.props.selectBulkData(rows);
      }
    };

    this.handleFilterChange = async function (value) {
      const {
        junk
      } = _this.state;

      if (!(value.filterTerm == null) && !(value.filterTerm.length <= 0)) {
        junk[value.column.key] = value;
      } else {
        delete junk[value.column.key];
      }

      _this.setState({
        junk
      });

      const hasFilter = Object.keys(junk).length > 0;

      const firstPage = _this.state.dataSet.slice(0, _this.state.pageRowCount);

      let data = _this.getrows(firstPage, _this.state.junk);

      await _this.setStateAsync({
        rows: data,
        tempRows: data,
        count: data.length,
        subDataSet: hasFilter ? data : [],
        pageIndex: hasFilter ? _this.state.pageIndex : 1
      });

      if (hasFilter) {
        const rowsRemaining = _this.state.dataSet.slice(_this.state.pageRowCount, _this.state.dataSet.length);

        _this.getSlicedRows(_this.state.junk, rowsRemaining, data);
      } else {
        let rowsRemaining = _this.state.dataSet;

        if (_this.state.searchValue !== "") {
          const searchKey = String(_this.state.searchValue).toLowerCase();
          rowsRemaining = rowsRemaining.filter(item => {
            return Object.values(item).toString().toLowerCase().includes(searchKey);
          });
        }

        rowsRemaining = _this.getSingleSortResult(rowsRemaining);

        if (_this.state.sortingParamsObjectList && _this.state.sortingParamsObjectList.length > 0) {
          rowsRemaining = _this.groupSort(_this.state.sortingParamsObjectList, rowsRemaining);
        }

        const rw = rowsRemaining.slice(0, _this.state.pageIndex * _this.state.pageRowCount);
        await _this.setStateAsync({
          subDataSet: rowsRemaining,
          rows: rw,
          tempRows: rw,
          count: rw.length
        });
        data = rw;
      }

      if (data.length === 0) {
        _this.handleWarningStatus();
      } else {
        _this.closeWarningStatus(data);
      }
    };

    this.isAtBottom = event => {
      const {
        target
      } = event;
      const isbtm = target.clientHeight + target.scrollTop >= target.scrollHeight - 10;
      return isbtm;
    };

    this.loadMoreRows = (from, newRowsCount) => {
      return new Promise(resolve => {
        let to = from + newRowsCount;

        if (this.isSubset() && this.state.subDataSet.length > 0) {
          to = to < this.state.subDataSet.length ? to : this.state.subDataSet.length;
          resolve(this.state.subDataSet.slice(from, to));
        } else {
          resolve(this.state.dataSet.slice(from, to));
        }
      });
    };

    this.handleScroll = async function (event) {
      if (!_this.isAtBottom(event)) return;
      const newRows = await _this.loadMoreRows(_this.state.pageIndex * _this.state.pageRowCount, _this.state.pageRowCount);

      if (newRows && newRows.length > 0) {
        let length = 0;

        _this.setState(prev => {
          length = prev.rows.length + newRows.length;
        });

        _this.setState({
          rows: [..._this.state.rows, ...newRows],
          count: length,
          pageIndex: _this.state.pageIndex + 1
        });
      }
    };

    this.globalSearchLogic = (e, updatedRows) => {
      const searchKey = String(e.target.value).toLowerCase();
      const filteredRows = updatedRows.filter(item => {
        return Object.values(item).toString().toLowerCase().includes(searchKey);
      });

      if (!filteredRows.length) {
        this.setState({
          warningStatus: "invalid",
          rows: [],
          count: 0
        });
      } else {
        const rowSlice = filteredRows.slice(0, this.state.pageIndex * this.state.pageRowCount);
        this.setState({
          warningStatus: "",
          rows: rowSlice,
          subDataSet: filteredRows,
          count: rowSlice.length
        });
      }
    };

    this.handleWarningStatus = () => {
      this.setState({
        warningStatus: "invalid"
      });
    };

    this.closeWarningStatus = val => {
      let rVal = val;

      if (!rVal) {
        const hasSingleSortkey = this.state.sortDirection !== "NONE" && this.state.sortColumn !== "";
        const hasGropSortKeys = this.state.sortingParamsObjectList && this.state.sortingParamsObjectList.length > 0;
        let dataRows = this.getFilterResult([...this.state.dataSet]);

        if (hasSingleSortkey) {
          dataRows = this.getSingleSortResult(dataRows);
        }

        if (hasGropSortKeys) {
          dataRows = this.groupSort(this.state.sortingParamsObjectList, dataRows);
        }

        rVal = dataRows.slice(0, this.state.pageIndex * this.state.pageRowCount);
      }

      this.setState({
        warningStatus: "",
        rows: rVal,
        count: rVal.length
      });
    };

    this.save = () => {
      this.props.saveRows(this.state.dataSet);
    };

    this.clearAllFilters = () => {
      const hasSingleSortkey = this.state.sortDirection !== "NONE" && this.state.sortColumn !== "";
      const hasGropSortKeys = this.state.sortingParamsObjectList && this.state.sortingParamsObjectList.length > 0;
      let dtSet = this.getSearchResult(this.state.dataSet);

      if (hasSingleSortkey) {
        dtSet = this.getSingleSortResult(dtSet);
      }

      if (hasGropSortKeys) {
        dtSet = this.groupSort(this.state.sortingParamsObjectList, dtSet);
      }

      const rVal = dtSet.slice(0, this.state.pageIndex * this.state.pageRowCount);
      this.setState({
        rows: rVal,
        count: rVal.length,
        subDataSet: dtSet
      });
    };

    this.getSearchResult = data => {
      let dtSet = data;
      const searchKey = String(this.state.searchValue).toLowerCase();

      if (searchKey !== "") {
        dtSet = dtSet.filter(item => {
          return Object.values(item).toString().toLowerCase().includes(searchKey);
        });
      }

      return dtSet;
    };

    this.getFilterResult = data => {
      let dataRows = [];

      if (Object.keys(this.state.junk).length > 0) {
        const rowsToSplit = [...data];
        const chunks = [];

        while (rowsToSplit.length) {
          chunks.push(rowsToSplit.splice(0, 500));
        }

        chunks.forEach(arr => {
          const dt = this.getrows(arr, this.state.junk);
          dataRows = [...dataRows, ...dt];
        });
      } else {
        dataRows = [...data];
      }

      return dataRows;
    };
    const {
      dataSet: _dataSet,
      pageSize
    } = this.props;
    const dataSetVar = JSON.parse(JSON.stringify(_dataSet));
    this.state = {
      warningStatus: "",
      height: 680,
      searchValue: "",
      sortColumn: "",
      sortDirection: "NONE",
      pageRowCount: pageSize,
      pageIndex: 1,
      dataSet: dataSetVar,
      subDataSet: [],
      rows: dataSetVar ? dataSetVar.slice(0, 500) : [],
      selectedIndexes: [],
      junk: {},
      columnReorderingComponent: null,
      exportComponent: null,
      filteringRows: this.props.rows,
      tempRows: this.props.rows,
      sortingPanelComponent: null,
      count: this.props.rows.length,
      sortingOrderSwapList: [],
      sortingParamsObjectList: [],
      pinnedReorder: false,
      columns: this.props.columns.map(item => {
        const colItem = item;

        if (colItem.editor === "DatePicker") {
          colItem.editor = DatePicker;
        } else if (colItem.editor === "DropDown" && colItem.dataSource) {
          colItem.editor = /*#__PURE__*/React.createElement(DropDownEditor, {
            options: colItem.dataSource
          });
        } else if (colItem.editor === "Text") {
          colItem.editor = "text";
        } else {
          colItem.editor = null;
        }

        if (colItem.filterType === "numeric") {
          colItem.filterRenderer = NumericFilter;
        } else {
          colItem.filterRenderer = AutoCompleteFilter;
        }

        return colItem;
      })
    };
    this.handleSearchValue = this.handleSearchValue.bind(this);
    this.clearSearchValue = this.clearSearchValue.bind(this);
    this.handleFilterChange = this.handleFilterChange.bind(this);
    this.formulaAppliedCols = this.props.columns.filter(item => {
      return item.formulaApplicable;
    });
  }

  UNSAFE_componentWillReceiveProps(props) {
    this.setState({
      rows: props.rows,
      count: props.count,
      warningStatus: props.status
    });
  }

  setStateAsync(stateObj) {
    return new Promise(resolve => {
      this.setState(stateObj, resolve);
    });
  }

  getValidFilterValues(rows, columnId) {
    this.setState({
      selectedIndexes: []
    });
    return rows.map(r => r[columnId]).filter((item, i, a) => {
      return i === a.indexOf(item);
    });
  }

  componentDidUpdate() {
    const resizeEvent = document.createEvent("HTMLEvents");
    resizeEvent.initEvent("resize", true, false);
    window.dispatchEvent(resizeEvent);
  }

  getSearchRecords(e) {
    const searchKey = String(e.target.value).toLowerCase();
    const hasFilter = Object.keys(this.state.junk).length > 0;
    const hasSingleSortkey = this.state.sortDirection !== "NONE" && this.state.sortColumn !== "";
    const hasGropSortKeys = this.state.sortingParamsObjectList && this.state.sortingParamsObjectList.length > 0;
    let rowsToSearch = [];

    if (this.state.searchValue.startsWith(searchKey) || searchKey === "") {
      rowsToSearch = this.getFilterResult([...this.state.dataSet]);

      if (hasSingleSortkey) {
        rowsToSearch = this.getSingleSortResult(rowsToSearch);
      }

      if (hasGropSortKeys) {
        rowsToSearch = this.groupSort(this.state.sortingParamsObjectList, rowsToSearch);
      }

      return rowsToSearch;
    }

    if (hasFilter || hasSingleSortkey || searchKey.length > 1 || hasGropSortKeys) return this.state.subDataSet;
    return this.state.dataSet;
  }

  isSubset() {
    if (Object.keys(this.state.junk).length > 0 || this.state.sortDirection !== "NONE" || this.state.searchValue !== "" || this.state.sortingParamsObjectList && this.state.sortingParamsObjectList.length > 0) {
      return true;
    }

    return false;
  }

  render() {
    return /*#__PURE__*/React.createElement("div", {
      onScroll: this.handleScroll
    }, /*#__PURE__*/React.createElement("div", {
      className: "parentDiv"
    }, /*#__PURE__*/React.createElement("div", {
      className: "totalCount"
    }, "Showing ", /*#__PURE__*/React.createElement("strong", null, " ", this.state.count, " "), " records"), /*#__PURE__*/React.createElement("div", {
      className: "globalSearch"
    }, /*#__PURE__*/React.createElement("i", {
      className: "fa fa-search"
    }), /*#__PURE__*/React.createElement(FormControl, {
      className: "globalSeachInput",
      type: "text",
      placeholder: "Search",
      onChange: e => {
        this.handleSearchValue(e.target.value);
        const srchRows = this.getSearchRecords(e);
        this.globalSearchLogic(e, srchRows);
      },
      value: this.state.searchValue
    })), /*#__PURE__*/React.createElement("div", {
      className: "filterIcons",
      onClick: this.save
    }, /*#__PURE__*/React.createElement(FontAwesomeIcon, {
      title: "Group Sort",
      icon: faSave
    })), /*#__PURE__*/React.createElement("div", {
      className: "filterIcons",
      onClick: this.sortingPanel
    }, /*#__PURE__*/React.createElement(FontAwesomeIcon, {
      title: "Group Sort",
      icon: faSortAmountDown
    }), /*#__PURE__*/React.createElement(FontAwesomeIcon, {
      icon: faSortDown,
      className: "filterArrow"
    })), this.state.sortingPanelComponent, /*#__PURE__*/React.createElement("div", {
      className: "filterIcons",
      onClick: this.columnReorderingPannel
    }, /*#__PURE__*/React.createElement(FontAwesomeIcon, {
      title: "Column Chooser",
      icon: faColumns
    }), /*#__PURE__*/React.createElement(FontAwesomeIcon, {
      icon: faSortDown,
      className: "filterArrow"
    })), this.state.columnReorderingComponent, /*#__PURE__*/React.createElement("div", {
      className: "filterIcons"
    }, /*#__PURE__*/React.createElement(FontAwesomeIcon, {
      title: "Export",
      icon: faShareAlt,
      onClick: this.exportColumnData
    })), this.state.exportComponent), /*#__PURE__*/React.createElement(ErrorMessage, {
      className: "errorDiv",
      status: this.state.warningStatus,
      closeWarningStatus: () => {
        this.closeWarningStatus();
      },
      clearSearchValue: this.clearSearchValue
    }), /*#__PURE__*/React.createElement(ExtDataGrid, {
      toolbar: /*#__PURE__*/React.createElement(Toolbar, {
        enableFilter: true
      }),
      getValidFilterValues: columnKey => this.getValidFilterValues(this.state.filteringRows, columnKey),
      minHeight: this.state.height,
      columns: this.state.columns,
      rowGetter: i => this.state.rows[i],
      rowsCount: this.state.rows.length,
      onGridRowsUpdated: this.onGridRowsUpdated,
      enableCellSelect: true,
      onClearFilters: () => {
        this.setState({
          junk: {}
        });
        this.clearAllFilters();
      },
      onColumnResize: (idx, width) => console.log(`Column ${idx} has been resized to ${width}`),
      onAddFilter: filter => this.handleFilterChange(filter),
      rowSelection: {
        showCheckbox: true,
        enableShiftSelect: true,
        onRowsSelected: this.onRowsSelected,
        onRowsDeselected: this.onRowsDeselected,
        selectBy: {
          indexes: this.state.selectedIndexes
        }
      },
      onGridSort: (sortColumn, sortDirection) => this.sortRows(this.state.filteringRows, sortColumn, sortDirection),
      globalSearch: this.globalSearchLogic,
      handleWarningStatus: this.handleWarningStatus,
      closeWarningStatus: this.closeWarningStatus
    }));
  }

}

let sortBy;

(function () {
  const defaultCmp = function (a, b) {
    if (a === b) return 0;
    return a < b ? -1 : 1;
  };

  const getCmpFunc = function (primer, reverse) {
    let cmp = defaultCmp;

    if (primer) {
      cmp = function (a, b) {
        return defaultCmp(primer(a), primer(b));
      };
    }

    if (reverse) {
      return function (a, b) {
        return -1 * cmp(a, b);
      };
    }

    return cmp;
  };

  sortBy = function () {
    const fields = [];
    const nFields = arguments.length;
    let field;
    let name;
    let cmp;

    for (let i = 0; i < nFields; i++) {
      field = arguments[i];

      if (typeof field === "string") {
        name = field;
        cmp = defaultCmp;
      } else {
        name = field.name;
        cmp = getCmpFunc(field.primer, field.reverse);
      }

      fields.push({
        name,
        cmp
      });
    }

    return function (A, B) {
      let result;

      for (let i = 0, l = nFields; i < l; i++) {
        result = 0;
        field = fields[i];
        name = field.name;
        cmp = field.cmp;
        result = cmp(A[name], B[name]);
        if (result !== 0) break;
      }

      return result;
    };
  };
})();

Spreadsheet.propTypes = {
  airportCodes: PropTypes.any,
  rows: PropTypes.any,
  columns: PropTypes.any,
  status: PropTypes.any,
  count: PropTypes.any,
  updateCellData: PropTypes.any,
  selectBulkData: PropTypes.any,
  pinnedReorder: PropTypes.any,
  maxLeftPinnedColumn: PropTypes.any,
  globalSearchLogic: PropTypes.any,
  closeWarningStatus: PropTypes.any,
  dataSet: PropTypes.any,
  pageSize: PropTypes.any
};

export default Spreadsheet;
//# sourceMappingURL=index.modern.js.map
