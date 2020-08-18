import React__default, { createElement, useState, useEffect, Fragment, Component } from 'react';
import { Toolbar, Editors, Data, Filters } from 'react-data-grid-addons';
import PropTypes from 'prop-types';
import ReactDataGrid from 'react-data-grid';
import { useDrag, useDrop, DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';
import MultiBackend, { TouchTransition } from 'react-dnd-multi-backend';
import ClickAwayListener from 'react-click-away-listener';
import update from 'immutability-helper';
import JsPdf from 'jspdf';
import 'jspdf-autotable';
import { saveAs } from 'file-saver';
import { utils, write } from 'xlsx';
import '!style-loader!css-loader!sass-loader!./Styles/main.scss';

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

class DatePicker extends React__default.Component {
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
    return /*#__PURE__*/React__default.createElement("div", null, /*#__PURE__*/React__default.createElement("input", {
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

var _ref = /*#__PURE__*/createElement("path", {
  d: "M13.67 10.465c.22.22.33.487.33.801 0 .314-.11.581-.33.801l-1.603 1.603c-.22.22-.487.33-.801.33-.314 0-.581-.11-.801-.33L7 10.205 3.535 13.67c-.22.22-.487.33-.801.33-.314 0-.581-.11-.801-.33L.33 12.067c-.22-.22-.33-.487-.33-.801 0-.314.11-.581.33-.801L3.795 7 .33 3.535C.11 3.315 0 3.048 0 2.734c0-.314.11-.581.33-.801L1.933.33c.22-.22.487-.33.801-.33.314 0 .581.11.801.33L7 3.795 10.465.33c.22-.22.487-.33.801-.33.314 0 .581.11.801.33l1.603 1.603c.22.22.33.487.33.801 0 .314-.11.581-.33.801L10.205 7l3.465 3.465z",
  fill: "#3c476f",
  fillOpacity: 0.71
});

function SvgIconClose(props) {
  return /*#__PURE__*/createElement("svg", _extends({
    width: 14,
    height: 14
  }, props), _ref);
}

const ErrorMessage = props => {
  const [status, setStatus] = useState(props.status);
  useEffect(() => {
    setStatus(props.status);
  }, [props.status]);

  if (status === "invalid") {
    return /*#__PURE__*/React__default.createElement("div", {
      id: "errorMsg"
    }, /*#__PURE__*/React__default.createElement("div", {
      className: "alert alert-danger",
      role: "alert"
    }, SEARCH_NOT_FOUNT_ERROR), /*#__PURE__*/React__default.createElement("div", {
      role: "presentation",
      className: "notification-close",
      onClick: () => {
        props.closeWarningStatus();
        props.clearSearchValue();
      }
    }, /*#__PURE__*/React__default.createElement("i", null, /*#__PURE__*/React__default.createElement(SvgIconClose, null))));
  }

  return /*#__PURE__*/React__default.createElement("div", null);
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
  return /*#__PURE__*/React__default.createElement("div", {
    "data-testid": "columnItem",
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
  React__default.useEffect(() => {
    setColumns(props.columnsArray);
  }, [props.columnsArray]);
  return /*#__PURE__*/React__default.createElement(Fragment, null, /*#__PURE__*/React__default.createElement("div", {
    ref: drop,
    style: {
      display: "flex",
      flexWrap: "wrap"
    }
  }, columns.map(column => /*#__PURE__*/React__default.createElement(ColumnItem, {
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

function _extends$1() {
  _extends$1 = Object.assign || function (target) {
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

  return _extends$1.apply(this, arguments);
}

var _ref$1 = /*#__PURE__*/createElement("path", {
  d: "M9.876 7.334A.45.45 0 0110 7.65v.9a.45.45 0 01-.124.316.386.386 0 01-.293.134H.417a.386.386 0 01-.293-.134A.45.45 0 010 8.55v-.9a.45.45 0 01.124-.316.386.386 0 01.293-.134h9.166c.113 0 .21.045.293.134zm0-3.6A.45.45 0 0110 4.05v.9a.45.45 0 01-.124.316.386.386 0 01-.293.134H.417a.386.386 0 01-.293-.134A.45.45 0 010 4.95v-.9a.45.45 0 01.124-.316.386.386 0 01.293-.134h9.166c.113 0 .21.045.293.134zm0-3.6A.45.45 0 0110 .45v.9a.45.45 0 01-.124.316.386.386 0 01-.293.134H.417a.386.386 0 01-.293-.134A.45.45 0 010 1.35v-.9A.45.45 0 01.124.134.386.386 0 01.417 0h9.166c.113 0 .21.045.293.134z",
  fill: "#1a4769",
  fillOpacity: 0.498
});

function SvgIconAlignJustify(props) {
  return /*#__PURE__*/createElement("svg", _extends$1({
    width: 10,
    height: 9
  }, props), _ref$1);
}

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

class ColumnReordering extends React__default.Component {
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

      if (isExistingAllSelect) {
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
          text: /*#__PURE__*/React__default.createElement("div", {
            className: "column__reorder",
            key: item
          }, /*#__PURE__*/React__default.createElement("div", {
            style: {
              cursor: "move"
            },
            className: "column_drag"
          }, /*#__PURE__*/React__default.createElement("i", null, /*#__PURE__*/React__default.createElement(SvgIconAlignJustify, null))), /*#__PURE__*/React__default.createElement("div", {
            className: "column__reorder__name"
          }, item), /*#__PURE__*/React__default.createElement("div", {
            className: "column__innerCells__wrap"
          }, /*#__PURE__*/React__default.createElement("div", {
            className: "column__wrap"
          }, /*#__PURE__*/React__default.createElement("div", {
            className: "column__checkbox"
          }, /*#__PURE__*/React__default.createElement("input", {
            "data-testid": "reArrangeLeftPin",
            role: "button",
            type: "checkbox",
            id: `checkBoxToPinLeft_${item}`,
            checked: this.state.leftPinnedColumList.includes(item),
            disabled: this.state.maxLeftPinnedColumn - this.state.leftPinnedColumList.length <= 0 ? !this.state.leftPinnedColumList.includes(item) : false,
            onChange: () => this.reArrangeLeftPinnedColumn(item)
          })), /*#__PURE__*/React__default.createElement("div", {
            className: "column__txt"
          }, "Pin Left"))))
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
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.props.closeColumnReOrdering();
  }

  render() {
    return /*#__PURE__*/React__default.createElement(ClickAwayListener, {
      onClickAway: this.handleClick
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
      onChange: this.filterColumnReorderList
    })), /*#__PURE__*/React__default.createElement("div", {
      className: "column__selectAll"
    }, /*#__PURE__*/React__default.createElement("div", {
      className: "column__checkbox"
    }, /*#__PURE__*/React__default.createElement("input", {
      type: "checkbox",
      "data-testid": "selectAllCheckBox",
      id: "selectallcolumncheckbox",
      onChange: () => this.selectAllToColumnReOrderList(),
      checked: this.state.columnReorderEntityList.length === this.props.columns.length
    })), /*#__PURE__*/React__default.createElement("div", {
      className: "column__txt"
    }, "Select all")), this.state.columnSelectList.map(item => {
      return /*#__PURE__*/React__default.createElement("div", {
        className: "column__wrap",
        key: item
      }, /*#__PURE__*/React__default.createElement("div", {
        className: "column__checkbox"
      }, /*#__PURE__*/React__default.createElement("input", {
        "data-testid": "addToColumnReorderEntityList",
        type: "checkbox",
        id: `checkboxtoselectreorder_${item}`,
        checked: this.state.columnReorderEntityList.includes(item),
        onChange: () => this.addToColumnReorderEntityList(item)
      })), /*#__PURE__*/React__default.createElement("div", {
        className: "column__txt"
      }, item));
    }))), /*#__PURE__*/React__default.createElement("div", {
      className: "column__settings"
    }, /*#__PURE__*/React__default.createElement("div", {
      className: "column__header"
    }, /*#__PURE__*/React__default.createElement("div", {
      className: "column__headerTxt"
    }, /*#__PURE__*/React__default.createElement("strong", null, "Column Settings")), /*#__PURE__*/React__default.createElement("div", {
      role: "presentation",
      "data-testid": "closeColumnReordering",
      className: "column__close",
      onClick: () => this.props.closeColumnReOrdering()
    }, /*#__PURE__*/React__default.createElement("i", null, /*#__PURE__*/React__default.createElement(SvgIconClose, null)))), /*#__PURE__*/React__default.createElement("div", {
      className: "column__body"
    }, /*#__PURE__*/React__default.createElement("div", {
      className: "column__info"
    }, /*#__PURE__*/React__default.createElement("strong", null, "\xA0 \xA0 Selected Column Count :", " ", this.state.columnReorderEntityList.length), this.state.maxLeftPinnedColumn - this.state.leftPinnedColumList.length > 0 ? /*#__PURE__*/React__default.createElement("strong", null, "\xA0 \xA0 Left Pinned Column Count Remaining :", " ", this.state.maxLeftPinnedColumn - this.state.leftPinnedColumList.length) : /*#__PURE__*/React__default.createElement("strong", {
      style: {
        color: "red"
      }
    }, "\xA0 \xA0 Maximum Count Of Left Pin Columns REACHED")), /*#__PURE__*/React__default.createElement(DndProvider, {
      backend: MultiBackend,
      options: HTML5toTouch
    }, /*#__PURE__*/React__default.createElement(ColumnsList, {
      columnsArray: this.createColumnsArrayFromProps(this.state.columnReorderEntityList),
      handleReorderList: this.handleReorderList
    }))), /*#__PURE__*/React__default.createElement("div", {
      className: "column__footer"
    }, /*#__PURE__*/React__default.createElement("div", {
      className: "column__btns"
    }, /*#__PURE__*/React__default.createElement("button", {
      "data-testid": "resetButton",
      type: "button",
      className: "btns",
      onClick: () => this.resetColumnReorderList()
    }, "Reset"), /*#__PURE__*/React__default.createElement("button", {
      "data-testid": "cancelButton",
      type: "button",
      className: "btns",
      onClick: () => this.props.closeColumnReOrdering()
    }, "Cancel"), /*#__PURE__*/React__default.createElement("button", {
      "data-testid": "saveButton",
      type: "button",
      className: "btns btns__save",
      onClick: () => this.props.updateTableAsPerRowChooser(this.state.columnReorderEntityList, this.state.leftPinnedColumList)
    }, "Save")))))));
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
  return /*#__PURE__*/React__default.createElement("div", {
    "data-testid": "sortingItem",
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
  React__default.useEffect(() => {
    setCards(props.sortsArray);
  }, [props.sortsArray]);
  return /*#__PURE__*/React__default.createElement(Fragment, null, /*#__PURE__*/React__default.createElement("div", {
    ref: drop,
    style: {
      display: "flex",
      flexWrap: "wrap"
    }
  }, cards.map(card => /*#__PURE__*/React__default.createElement(Card, {
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

function _extends$2() {
  _extends$2 = Object.assign || function (target) {
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

  return _extends$2.apply(this, arguments);
}

var _ref$2 = /*#__PURE__*/createElement("path", {
  d: "M12.84 8.963c.106.11.16.238.16.387v1.1a.533.533 0 01-.16.387.517.517 0 01-.382.163H.542a.517.517 0 01-.381-.163A.533.533 0 010 10.45v-1.1c0-.149.054-.278.16-.387A.517.517 0 01.543 8.8h11.916c.147 0 .274.054.381.163zm0-4.4c.106.11.16.238.16.387v1.1a.533.533 0 01-.16.387.517.517 0 01-.382.163H.542a.517.517 0 01-.381-.163A.533.533 0 010 6.05v-1.1c0-.149.054-.278.16-.387A.517.517 0 01.543 4.4h11.916c.147 0 .274.054.381.163zm0-4.4c.106.11.16.238.16.387v1.1a.533.533 0 01-.16.387.517.517 0 01-.382.163H.542a.517.517 0 01-.381-.163A.533.533 0 010 1.65V.55C0 .401.054.272.16.163A.517.517 0 01.543 0h11.916c.147 0 .274.054.381.163z",
  fillOpacity: 0.11
});

function SvgIconNav(props) {
  return /*#__PURE__*/createElement("svg", _extends$2({
    width: 13,
    height: 11
  }, props), _ref$2);
}

function _extends$3() {
  _extends$3 = Object.assign || function (target) {
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

  return _extends$3.apply(this, arguments);
}

var _ref$3 = /*#__PURE__*/createElement("defs", null, /*#__PURE__*/createElement("linearGradient", {
  gradientUnits: "userSpaceOnUse",
  x1: 442.5,
  y1: 6,
  x2: 442.5,
  y2: 22,
  id: "SortCopy_svg__a"
}, /*#__PURE__*/createElement("stop", {
  stopColor: "#246290",
  stopOpacity: 0.6,
  offset: 0
}), /*#__PURE__*/createElement("stop", {
  stopColor: "#f2f2f2",
  offset: 0
}), /*#__PURE__*/createElement("stop", {
  stopColor: "#e4e4e4",
  offset: 1
}), /*#__PURE__*/createElement("stop", {
  stopColor: "#fff",
  offset: 1
})));

var _ref2 = /*#__PURE__*/createElement("path", {
  d: "M439.6 21h8.4v-8.8L442.8 7H437v11.4h1.3v1.3h1.3V21z",
  fill: "url(#SortCopy_svg__a)",
  transform: "translate(-436 -6)"
});

var _ref3 = /*#__PURE__*/createElement("path", {
  d: "M3.1 15.5h9.4V5.7L7.3.5H.5v12.4h1.3v1.3h1.3v1.3z",
  stroke: "#1a4769",
  fill: "none",
  strokeOpacity: 0.6
});

var _ref4 = /*#__PURE__*/createElement("path", {
  d: "M9.9 4.4l1.3.5v9.3H3.6M7.3 1v2.1h2.6v9.8H2.3M12 5.7h-.8",
  stroke: "#1a4769",
  fill: "none",
  strokeOpacity: 0.6
});

function SvgSortCopy(props) {
  return /*#__PURE__*/createElement("svg", _extends$3({
    width: 13,
    height: 16
  }, props), _ref$3, _ref2, _ref3, _ref4);
}

function _extends$4() {
  _extends$4 = Object.assign || function (target) {
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

  return _extends$4.apply(this, arguments);
}

var _ref$4 = /*#__PURE__*/createElement("path", {
  d: "M5.359 6.094a.32.32 0 01.096.24v6a.32.32 0 01-.096.239.336.336 0 01-.245.094h-.682a.336.336 0 01-.245-.094.32.32 0 01-.096-.24v-6a.32.32 0 01.096-.24A.336.336 0 014.432 6h.682c.1 0 .18.031.245.094zm2.727 0a.32.32 0 01.096.24v6a.32.32 0 01-.096.239.336.336 0 01-.245.094h-.682a.336.336 0 01-.245-.094.32.32 0 01-.096-.24v-6a.32.32 0 01.096-.24A.336.336 0 017.16 6h.682c.1 0 .181.031.245.094zm2.727 0a.32.32 0 01.096.24v6a.32.32 0 01-.096.239.336.336 0 01-.245.094h-.682a.336.336 0 01-.245-.094.32.32 0 01-.096-.24v-6a.32.32 0 01.096-.24A.336.336 0 019.886 6h.682c.1 0 .181.031.245.094zm1.385 8.203c.05-.129.075-.27.075-.422V4H2.727v9.875a1.16 1.16 0 00.23.703c.053.06.09.089.111.089h8.864c.021 0 .058-.03.112-.089a.928.928 0 00.154-.281zM5.636 1.447l-.522 1.22h4.772l-.511-1.22a.301.301 0 00-.181-.114H5.817a.301.301 0 00-.181.115zm9.268 1.313A.32.32 0 0115 3v.667a.32.32 0 01-.096.24.336.336 0 01-.245.093h-1.023v9.875c0 .576-.167 1.075-.5 1.495-.334.42-.735.63-1.204.63H3.068c-.469 0-.87-.203-1.204-.61-.333-.406-.5-.897-.5-1.473V4H.34a.336.336 0 01-.245-.094.32.32 0 01-.096-.24V3a.32.32 0 01.096-.24.336.336 0 01.245-.093h3.292l.746-1.74c.106-.257.298-.476.575-.656C5.23.09 5.51 0 5.795 0h3.41c.284 0 .564.09.841.27.277.181.469.4.575.657l.746 1.74h3.292c.1 0 .181.03.245.093z",
  fill: "#1a4769",
  fillOpacity: 0.6
});

function SvgSortDelete(props) {
  return /*#__PURE__*/createElement("svg", _extends$4({
    width: 15,
    height: 16
  }, props), _ref$4);
}

const HTML5toTouch$1 = {
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

class App extends React__default.Component {
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
          text: /*#__PURE__*/React__default.createElement("div", {
            className: "sort__bodyContent",
            key: row
          }, /*#__PURE__*/React__default.createElement("div", {
            className: "sort__reorder"
          }, /*#__PURE__*/React__default.createElement("div", {
            className: ""
          }, /*#__PURE__*/React__default.createElement("div", null, "\xA0")), /*#__PURE__*/React__default.createElement("div", {
            className: "sort__icon"
          }, /*#__PURE__*/React__default.createElement("i", null, /*#__PURE__*/React__default.createElement(SvgIconNav, null)))), /*#__PURE__*/React__default.createElement("div", {
            className: "sort__reorder"
          }, /*#__PURE__*/React__default.createElement("div", {
            className: ""
          }, /*#__PURE__*/React__default.createElement("div", null, "Sort by")), /*#__PURE__*/React__default.createElement("div", {
            className: "sort__file"
          }, /*#__PURE__*/React__default.createElement("select", {
            "data-testid": "selectSortingField",
            className: "custom__ctrl",
            name: "sortBy",
            onChange: e => this.captureSortingFeildValues(e, index, "sortBy"),
            value: row.sortBy
          }, this.props.columnFieldValue.map(item => /*#__PURE__*/React__default.createElement("option", {
            key: item
          }, item))))), /*#__PURE__*/React__default.createElement("div", {
            className: "sort__reorder"
          }, /*#__PURE__*/React__default.createElement("div", {
            className: ""
          }, /*#__PURE__*/React__default.createElement("div", null, "Sort on")), /*#__PURE__*/React__default.createElement("div", {
            className: "sort__file"
          }, /*#__PURE__*/React__default.createElement("select", {
            className: "custom__ctrl",
            name: "sortOn",
            "data-testid": "selectingValue",
            onChange: e => this.captureSortingFeildValues(e, index, "sortOn"),
            value: row.sortOn
          }, /*#__PURE__*/React__default.createElement("option", null, "Value")))), /*#__PURE__*/React__default.createElement("div", {
            className: "sort__reorder"
          }, /*#__PURE__*/React__default.createElement("div", {
            className: ""
          }, /*#__PURE__*/React__default.createElement("div", null, "Order")), /*#__PURE__*/React__default.createElement("div", {
            className: "sort__file"
          }, /*#__PURE__*/React__default.createElement("select", {
            "data-testid": "selectOrder",
            className: "custom__ctrl",
            name: "order",
            onChange: e => this.captureSortingFeildValues(e, index, "order"),
            value: row.order
          }, /*#__PURE__*/React__default.createElement("option", null, "Ascending"), /*#__PURE__*/React__default.createElement("option", null, "Descending")))), /*#__PURE__*/React__default.createElement("div", {
            className: "sort__reorder"
          }, /*#__PURE__*/React__default.createElement("div", {
            className: ""
          }, /*#__PURE__*/React__default.createElement("div", null, "\xA0")), /*#__PURE__*/React__default.createElement("div", {
            "data-testid": "copySort",
            role: "presentation",
            className: "sort__icon",
            onClick: () => this.copy(index)
          }, /*#__PURE__*/React__default.createElement(SvgSortCopy, null))), /*#__PURE__*/React__default.createElement("div", {
            className: "sort__reorder"
          }, /*#__PURE__*/React__default.createElement("div", {
            className: ""
          }, /*#__PURE__*/React__default.createElement("div", null, "\xA0")), /*#__PURE__*/React__default.createElement("div", {
            "data-testid": "removeSort",
            role: "presentation",
            className: "sort__icon",
            onClick: () => this.remove(index)
          }, /*#__PURE__*/React__default.createElement(SvgSortDelete, null))))
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
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.props.closeSorting();
  }

  render() {
    return /*#__PURE__*/React__default.createElement(ClickAwayListener, {
      onClickAway: this.handleClick
    }, /*#__PURE__*/React__default.createElement("div", {
      className: "neo-popover"
    }, /*#__PURE__*/React__default.createElement("div", {
      className: "neo-popover__sort"
    }, /*#__PURE__*/React__default.createElement("div", {
      className: "neo-popover__title"
    }, /*#__PURE__*/React__default.createElement("h2", null, "Sort"), /*#__PURE__*/React__default.createElement("div", {
      className: "neo-popover__close"
    }, /*#__PURE__*/React__default.createElement("i", {
      role: "presentation",
      "data-testid": "closeSorting",
      onClick: () => this.props.closeSorting()
    }, /*#__PURE__*/React__default.createElement(SvgIconClose, null)))), /*#__PURE__*/React__default.createElement("div", {
      className: "neo-popover__content"
    }, /*#__PURE__*/React__default.createElement(DndProvider, {
      backend: MultiBackend,
      options: HTML5toTouch$1
    }, /*#__PURE__*/React__default.createElement(SortingList, {
      handleReorderListOfSort: this.handleReorderListOfSort,
      sortsArray: this.createColumnsArrayFromProps(this.state.sortingOrderList)
    }))), /*#__PURE__*/React__default.createElement("div", {
      className: "sort-warning"
    }, this.state.errorMessage ? /*#__PURE__*/React__default.createElement("span", {
      className: "alert alert-danger"
    }, "Sort by opted are same, Please choose different one.") : ""), /*#__PURE__*/React__default.createElement("div", {
      className: "sort__new"
    }, /*#__PURE__*/React__default.createElement("div", {
      role: "presentation",
      className: "sort__section",
      "data-testid": "addSort",
      onClick: () => this.add(),
      onKeyDown: () => this.add()
    }, /*#__PURE__*/React__default.createElement("span", null, "+"), /*#__PURE__*/React__default.createElement("div", {
      className: "sort__txt"
    }, "New Sort"))), /*#__PURE__*/React__default.createElement("div", {
      className: "sort__footer"
    }, /*#__PURE__*/React__default.createElement("div", {
      className: "sort__btns"
    }, /*#__PURE__*/React__default.createElement("button", {
      type: "button",
      className: "btns",
      onClick: this.clearAll
    }, "Clear All"), /*#__PURE__*/React__default.createElement("button", {
      "data-testid": "applySort",
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

function _extends$5() {
  _extends$5 = Object.assign || function (target) {
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

  return _extends$5.apply(this, arguments);
}

var _ref$5 = /*#__PURE__*/createElement("path", {
  d: "M17.31 1.025l4.672 4.7c.28.282.519.663.719 1.146.2.482.299.924.299 1.325v17.358a1.4 1.4 0 01-.42 1.024c-.279.281-.618.422-1.017.422H1.438c-.4 0-.74-.14-1.019-.422A1.4 1.4 0 010 25.554V1.446C0 1.045.14.703.42.422.698.14 1.037 0 1.437 0h13.416c.4 0 .839.1 1.318.301.479.201.858.442 1.138.724zM15.947 2.38c-.12-.121-.324-.231-.614-.332v5.665h5.63c-.1-.291-.21-.497-.329-.617L15.947 2.38zM2 25h19V9.643h-6.146c-.4 0-.739-.14-1.018-.422a1.4 1.4 0 01-.42-1.025V2H2v23zm3.75-11.982v-.964a.47.47 0 01.135-.347c.09-.09.204-.136.344.293h10.542c.14-.429.254-.383.344-.293a.47.47 0 01.135.347v.964a.47.47 0 01-.135.346c-.09.09-.204.136-.344-.364H6.229c-.14.5-.254.455-.344.364a.47.47 0 01-.135-.346zM6.23 15h10.54c.14.429.255.474.345.564a.47.47 0 01.135.347v.964a.47.47 0 01-.135.347c-.09.09-.204.135-.344-.222H6.229c-.14.357-.254.312-.344.222a.47.47 0 01-.135-.347v-.964a.47.47 0 01.135-.347c.09-.09.204-.135.344-.564zm0 4h10.54c.14.286.255.33.345.421a.47.47 0 01.135.347v.964a.47.47 0 01-.135.347c-.09.09-.204.135-.344-.079H6.229c-.14.214-.254.17-.344.079a.47.47 0 01-.135-.347v-.964a.47.47 0 01.135-.347c.09-.09.204-.135.344-.421z",
  fill: "#1a4869"
});

function SvgIconCsv(props) {
  return /*#__PURE__*/createElement("svg", _extends$5({
    width: 23,
    height: 27
  }, props), _ref$5);
}

function _extends$6() {
  _extends$6 = Object.assign || function (target) {
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

  return _extends$6.apply(this, arguments);
}

var _ref$6 = /*#__PURE__*/createElement("path", {
  d: "M17.31 1.025l4.672 4.7c.28.282.519.663.719 1.146.2.482.299.924.299 1.325v17.358a1.4 1.4 0 01-.42 1.024c-.279.281-.618.422-1.017.422H1.438c-.4 0-.74-.14-1.019-.422A1.4 1.4 0 010 25.554V1.446C0 1.045.14.703.42.422.698.14 1.037 0 1.437 0h13.416c.4 0 .839.1 1.318.301.479.201.858.442 1.138.724zM15.947 2.38c-.12-.121-.324-.231-.614-.332v5.665h5.63c-.1-.291-.21-.497-.329-.617L15.947 2.38zM2 25h19V9.643h-6.146c-.4 0-.739-.14-1.018-.422a1.4 1.4 0 01-.42-1.025V2H2v23zm5.442-3.454H6.424v1.597h4.208v-1.597H9.508l1.543-2.426c.05-.07.1-.153.15-.249.05-.095.087-.163.112-.203.025-.04.042-.06.052-.06h.03c.01.04.035.09.075.15.02.04.042.078.067.113.025.036.055.076.09.12l.098.129 1.602 2.426h-1.138v1.597h4.357v-1.597h-1.018l-2.875-4.114 2.92-4.248h1.003V11.57h-4.178v1.613h1.109l-1.543 2.395a6.727 6.727 0 01-.284.452l-.03.045h-.03a.52.52 0 00-.075-.15 1.797 1.797 0 00-.255-.347l-1.587-2.395h1.138V11.57H6.5v1.613h1.018l2.83 4.098-2.905 4.264z",
  fill: "#3da751"
});

function SvgIconExcel(props) {
  return /*#__PURE__*/createElement("svg", _extends$6({
    width: 23,
    height: 27
  }, props), _ref$6);
}

function _extends$7() {
  _extends$7 = Object.assign || function (target) {
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

  return _extends$7.apply(this, arguments);
}

var _ref$7 = /*#__PURE__*/createElement("path", {
  d: "M18.063 1.063l4.875 4.875c.291.291.541.687.75 1.187.208.5.312.958.312 1.375v18c0 .417-.146.77-.438 1.063A1.447 1.447 0 0122.5 28h-21c-.417 0-.77-.146-1.063-.438A1.447 1.447 0 010 26.5v-25C0 1.083.146.73.438.437A1.447 1.447 0 011.5 0h14c.417 0 .875.104 1.375.313.5.208.896.458 1.188.75zM16.64 2.468c-.125-.125-.339-.24-.641-.344V8h5.875c-.104-.302-.219-.516-.344-.64l-4.89-4.891zM2 26h20V10h-6.5c-.417 0-.77-.146-1.063-.438A1.447 1.447 0 0114 8.5V2H2v24zm9.688-12.984c.572 1.708 1.333 2.948 2.28 3.718.345.271.782.563 1.313.875.615-.073 1.224-.109 1.828-.109 1.532 0 2.453.255 2.766.766.167.229.177.5.031.812 0 .01-.005.021-.015.031l-.032.032v.015c-.062.396-.432.594-1.109.594-.5 0-1.099-.104-1.797-.313a11.391 11.391 0 01-2.031-.828c-2.302.25-4.344.683-6.125 1.297C7.203 22.636 5.943 24 5.016 24a.909.909 0 01-.438-.11l-.375-.187a1.671 1.671 0 00-.094-.078c-.104-.104-.135-.292-.093-.563.093-.416.385-.893.875-1.43.49-.536 1.177-1.038 2.062-1.507.146-.094.266-.063.36.094.02.02.03.041.03.062a38.204 38.204 0 001.673-3.078c.708-1.417 1.25-2.781 1.625-4.094a12.63 12.63 0 01-.477-2.492c-.068-.807-.034-1.471.102-1.992.114-.417.333-.625.656-.625H11.266c.24 0 .421.078.546.234.188.22.235.573.141 1.063a.34.34 0 01-.062.125c.01.031.015.073.015.125v.469c-.02 1.28-.094 2.28-.219 3zM5.742 22c-.38.458-.638.844-.773 1.156.541-.25 1.255-1.073 2.14-2.468A8.908 8.908 0 005.742 22zm5.446-13.25v.031c-.157.438-.167 1.125-.032 2.063.01-.073.047-.302.11-.688 0-.031.036-.255.109-.672a.352.352 0 01.063-.125c-.01-.01-.016-.02-.016-.03a.12.12 0 01-.016-.048.9.9 0 00-.203-.562c0 .01-.005.02-.015.031zm-1.235 9.063a106.31 106.31 0 01-.703 1.296 22.918 22.918 0 014.438-1.265c-.021-.01-.089-.06-.204-.149a2.793 2.793 0 01-.25-.21c-.791-.699-1.453-1.615-1.984-2.75-.281.895-.714 1.921-1.297 3.078zm9.422 1.093c0-.01-.01-.026-.031-.047-.25-.25-.98-.375-2.188-.375.792.292 1.438.438 1.938.438.146 0 .24-.005.281-.016z",
  fill: "#ff4a4a"
});

function SvgIconPdf(props) {
  return /*#__PURE__*/createElement("svg", _extends$7({
    width: 24,
    height: 28
  }, props), _ref$7);
}

let downLaodFileType = [];

class ExportData extends React__default.Component {
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
      const columnValueList = this.state.columnEntityList;
      const filteredRow = [];
      const filteredRowValues = [];
      const filteredRowHeader = [];

      if (columnValueList.length > 0 && this.state.downLaodFileType.length > 0) {
        const {
          rows
        } = this.props;
        const rowLength = rows && rows.length > 0 ? rows.length : 0;
        rows.forEach((row, index) => {
          const filteredColumnVal = {};
          const rowFilteredValues = [];
          const rowFilteredHeader = [];
          columnValueList.forEach(columnName => {
            const {
              key,
              name
            } = columnName;
            filteredColumnVal[name] = row[key];
            rowFilteredValues.push(row[key]);
            rowFilteredHeader.push(name);
          });
          filteredRow.push(filteredColumnVal);
          filteredRowValues.push(rowFilteredValues);
          if (rowLength === index + 1) filteredRowHeader.push(rowFilteredHeader);
        });
        this.state.downLaodFileType.forEach(item => {
          if (item === "pdf") {
            this.downloadPDF(filteredRowValues, filteredRowHeader);
          } else if (item === "excel") {
            this.downloadXLSFile(filteredRow);
          } else {
            this.downloadCSVFile(filteredRow);
          }
        });
      }
    };

    this.downloadPDF = (rowFilteredValues, rowFilteredHeader) => {
      const unit = "pt";
      const size = "A4";
      const orientation = "landscape";
      const doc = new JsPdf(orientation, unit, size);
      doc.setFontSize(12);
      const title = "iCargo Neo Report";
      const content = {
        startY: 50,
        head: rowFilteredHeader,
        body: rowFilteredValues,
        tableWidth: "wrap",
        headStyles: {
          fillColor: [102, 102, 255]
        },
        theme: "grid",
        margin: {
          top: 30,
          right: 30,
          bottom: 10,
          left: 30
        }
      };
      doc.text(title, 30, 40);
      doc.autoTable(content);
      doc.save("iCargo Neo Report.pdf");
    };

    this.downloadCSVFile = filteredRowValue => {
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

    this.downloadXLSFile = filteredRowValue => {
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
      warning: " ",
      clickTag: "none"
    };
    this.handleClick = this.handleClick.bind(this);
    this.selectDownLoadType = this.selectDownLoadType.bind(this);
    this.exportValidation = this.exportValidation.bind(this);
  }

  handleClick() {
    this.props.closeExport();
  }

  render() {
    return /*#__PURE__*/React__default.createElement(ClickAwayListener, {
      onClickAway: this.handleClick,
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
      "data-testid": "searchExport",
      type: "text",
      placeholder: "Search export",
      className: "custom__ctrl",
      onChange: this.columnSearchLogic
    })), /*#__PURE__*/React__default.createElement("div", {
      className: "export__wrap export__headertxt"
    }, /*#__PURE__*/React__default.createElement("div", {
      className: "export__checkbox"
    }, /*#__PURE__*/React__default.createElement("input", {
      "data-testid": "selectColumns",
      className: "selectColumn",
      type: "checkbox",
      onChange: () => this.selectAllToColumnList(),
      checked: this.state.isAllSelected
    })), /*#__PURE__*/React__default.createElement("div", {
      className: "export__txt"
    }, "Select All")), this.state.columnValueList && this.state.columnValueList.length > 0 ? this.state.columnValueList.map(column => {
      return /*#__PURE__*/React__default.createElement("div", {
        className: "export__wrap",
        key: column.key
      }, /*#__PURE__*/React__default.createElement("div", {
        className: "export__checkbox"
      }, /*#__PURE__*/React__default.createElement("input", {
        "data-testid": "addToColumn",
        type: "checkbox",
        checked: this.state.columnEntityList.includes(column),
        onChange: () => this.addToColumnEntityList(column)
      })), /*#__PURE__*/React__default.createElement("div", {
        className: "export__txt"
      }, column.name));
    }) : "")), /*#__PURE__*/React__default.createElement("div", {
      className: "export__settings"
    }, /*#__PURE__*/React__default.createElement("div", {
      className: "export__header"
    }, /*#__PURE__*/React__default.createElement("div", {
      className: "export__headerTxt"
    }), /*#__PURE__*/React__default.createElement("div", {
      className: "export__close"
    }, /*#__PURE__*/React__default.createElement("i", {
      role: "presentation",
      onClick: this.props.closeExport
    }, /*#__PURE__*/React__default.createElement(SvgIconClose, null)))), /*#__PURE__*/React__default.createElement("div", {
      className: "export__as"
    }, "Export as"), /*#__PURE__*/React__default.createElement("div", {
      className: "export__body"
    }, /*#__PURE__*/React__default.createElement("div", {
      className: "export__reorder"
    }, /*#__PURE__*/React__default.createElement("div", {
      className: "check-wrap"
    }, /*#__PURE__*/React__default.createElement("input", {
      "data-testid": "addpdfDownloadType",
      type: "checkbox",
      name: "pdf",
      value: "pdf",
      onChange: this.selectDownLoadType
    })), /*#__PURE__*/React__default.createElement("div", {
      className: "export__file"
    }, /*#__PURE__*/React__default.createElement("i", null, /*#__PURE__*/React__default.createElement(SvgIconPdf, null)), /*#__PURE__*/React__default.createElement("strong", null, "PDF"))), /*#__PURE__*/React__default.createElement("div", {
      className: "export__reorder"
    }, /*#__PURE__*/React__default.createElement("div", {
      className: "check-wrap"
    }, /*#__PURE__*/React__default.createElement("input", {
      type: "checkbox",
      name: "excel",
      value: "excel",
      onChange: this.selectDownLoadType
    })), /*#__PURE__*/React__default.createElement("div", {
      className: "export__file"
    }, /*#__PURE__*/React__default.createElement("i", null, /*#__PURE__*/React__default.createElement(SvgIconExcel, null)), /*#__PURE__*/React__default.createElement("strong", null, "Excel"))), /*#__PURE__*/React__default.createElement("div", {
      className: "export__reorder"
    }, /*#__PURE__*/React__default.createElement("div", {
      className: "check-wrap"
    }, /*#__PURE__*/React__default.createElement("input", {
      type: "checkbox",
      name: "csv",
      value: "csv",
      onChange: this.selectDownLoadType
    })), /*#__PURE__*/React__default.createElement("div", {
      className: "export__file"
    }, /*#__PURE__*/React__default.createElement("i", null, /*#__PURE__*/React__default.createElement(SvgIconCsv, null)), /*#__PURE__*/React__default.createElement("strong", null, "CSV"))), /*#__PURE__*/React__default.createElement("div", {
      className: "exportWarning"
    }, /*#__PURE__*/React__default.createElement("span", {
      style: {
        display: this.state.clickTag
      }
    }, /*#__PURE__*/React__default.createElement("strong", null, "Select at least one file type")))), /*#__PURE__*/React__default.createElement("div", {
      className: "export__footer"
    }, /*#__PURE__*/React__default.createElement("div", {
      className: "export__btns"
    }, /*#__PURE__*/React__default.createElement("button", {
      "data-testid": "closeExport",
      type: "button",
      className: "btns",
      onClick: () => this.props.closeExport()
    }, "Cancel"), /*#__PURE__*/React__default.createElement("button", {
      "data-testid": "exportValidationClick",
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

function _extends$8() {
  _extends$8 = Object.assign || function (target) {
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

  return _extends$8.apply(this, arguments);
}

var _ref$8 = /*#__PURE__*/createElement("path", {
  d: "M.992 11.836c.045.054.1.08.162.08h4.384v-9.75H.923v9.48c0 .073.023.137.069.19zm10.016 0a.284.284 0 00.069-.19v-9.48H6.462v9.75h4.384a.207.207 0 00.162-.08zM11.661.398c.226.265.339.584.339.956v10.292c0 .372-.113.691-.339.956-.226.265-.498.398-.815.398H1.154c-.317 0-.59-.133-.815-.398A1.426 1.426 0 010 11.646V1.354C0 .982.113.663.339.398.565.133.837 0 1.154 0h9.692c.317 0 .59.133.815.398z",
  fill: "#3c476f",
  fillOpacity: 0.8
});

function SvgIconColumns(props) {
  return /*#__PURE__*/createElement("svg", _extends$8({
    width: 12,
    height: 13
  }, props), _ref$8);
}

function _extends$9() {
  _extends$9 = Object.assign || function (target) {
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

  return _extends$9.apply(this, arguments);
}

var _ref$9 = /*#__PURE__*/createElement("path", {
  d: "M7.797 7.672A2.41 2.41 0 019.5 7a2.41 2.41 0 011.77.73A2.41 2.41 0 0112 9.5a2.41 2.41 0 01-.73 1.77A2.41 2.41 0 019.5 12a2.41 2.41 0 01-1.77-.73A2.41 2.41 0 017 9.5c0-.063.005-.151.016-.266L4.203 7.828A2.41 2.41 0 012.5 8.5a2.41 2.41 0 01-1.77-.73A2.41 2.41 0 010 6c0-.693.243-1.283.73-1.77A2.41 2.41 0 012.5 3.5a2.41 2.41 0 011.703.672l2.813-1.406A3.146 3.146 0 017 2.5c0-.693.243-1.283.73-1.77A2.41 2.41 0 019.5 0a2.41 2.41 0 011.77.73A2.41 2.41 0 0112 2.5a2.41 2.41 0 01-.73 1.77A2.41 2.41 0 019.5 5a2.41 2.41 0 01-1.703-.672L4.984 5.734C4.994 5.85 5 5.938 5 6c0 .063-.005.151-.016.266l2.813 1.406z",
  fill: "#636c8c"
});

function SvgIconShare(props) {
  return /*#__PURE__*/createElement("svg", _extends$9({
    width: 12,
    height: 12
  }, props), _ref$9);
}

function _extends$a() {
  _extends$a = Object.assign || function (target) {
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

  return _extends$a.apply(this, arguments);
}

var _ref$a = /*#__PURE__*/createElement("path", {
  d: "M8.013 10.346c.041.04.061.092.061.154v1.286a.207.207 0 01-.218.214H6.112a.207.207 0 01-.218-.214V10.5a.207.207 0 01.218-.214h1.744c.064 0 .116.02.157.06zm-3.271-.857c.04.04.061.091.061.154a.25.25 0 01-.068.16L2.561 11.94a.23.23 0 01-.157.06.247.247 0 01-.156-.06L.067 9.797c-.068-.072-.084-.15-.048-.235.036-.089.104-.133.204-.133h1.309V.214A.207.207 0 011.75 0h1.309a.207.207 0 01.218.214V9.43h1.308c.064 0 .116.02.157.06zm4.58-2.572c.04.04.061.092.061.154v1.286a.207.207 0 01-.218.214H6.112a.207.207 0 01-.218-.214V7.071a.207.207 0 01.218-.214h3.053c.064 0 .116.02.157.06zM10.63 3.49c.041.04.061.091.061.154v1.286a.207.207 0 01-.218.214H6.112a.207.207 0 01-.218-.214V3.643a.207.207 0 01.218-.214h4.361c.064 0 .116.02.157.06zM11.94.06c.04.04.061.092.061.154V1.5a.207.207 0 01-.218.214h-5.67a.207.207 0 01-.218-.214V.214A.207.207 0 016.112 0h5.67c.064 0 .116.02.157.06z",
  fill: "#3c476f",
  fillOpacity: 0.8
});

function SvgIconGroupSort(props) {
  return /*#__PURE__*/createElement("svg", _extends$a({
    width: 12,
    height: 12
  }, props), _ref$a);
}

function _extends$b() {
  _extends$b = Object.assign || function (target) {
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

  return _extends$b.apply(this, arguments);
}

var _ref$b = /*#__PURE__*/createElement("path", {
  d: "M6.746 6.746c.58-.58.87-1.277.87-2.092 0-.815-.29-1.513-.87-2.092a2.852 2.852 0 00-2.092-.87c-.815 0-1.513.29-2.092.87-.58.58-.87 1.277-.87 2.092 0 .815.29 1.513.87 2.092.58.58 1.277.87 2.092.87.815 0 1.513-.29 2.092-.87zm4.01 2.813a.81.81 0 01.244.595c0 .229-.084.427-.251.595a.813.813 0 01-.595.251.786.786 0 01-.595-.251L7.29 8.488a4.527 4.527 0 01-2.637.82c-.63 0-1.233-.123-1.808-.367a4.653 4.653 0 01-1.488-.992 4.653 4.653 0 01-.991-1.487A4.573 4.573 0 010 4.654c0-.63.122-1.233.367-1.808.244-.575.575-1.071.991-1.488A4.653 4.653 0 012.846.367 4.573 4.573 0 014.654 0c.63 0 1.233.122 1.808.367.575.244 1.07.575 1.487.991.417.417.747.913.992 1.488.244.575.367 1.178.367 1.808 0 .97-.274 1.849-.82 2.637l2.267 2.268z",
  fill: "#3c476f",
  fillOpacity: 0.8
});

function SvgIconSearch(props) {
  return /*#__PURE__*/createElement("svg", _extends$b({
    width: 11,
    height: 11
  }, props), _ref$b);
}

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
        columnReorderingComponent: /*#__PURE__*/React__default.createElement(ColumnReordering, Object.assign({
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
        sortingPanelComponent: /*#__PURE__*/React__default.createElement(App, {
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
        exportComponent: /*#__PURE__*/React__default.createElement(ExportData, {
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
      let updatedRow = "";
      let updatedValue = "";
      console.log({
        fromRow,
        toRow,
        updated,
        action
      });
      console.log("change", updated);

      for (let update in updated) {
        updatedRow = update;
        updatedValue = updated[update];
      }

      if (updatedValue.match(/=sum\((\d+(?:,\s*\d+)*)\)/g)) {
        console.log(updatedRow);
      }

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
        this.props.updatedRows({
          fromRow,
          toRow,
          updated,
          action
        });
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
      dataSet,
      pageSize
    } = this.props;
    const dataSetVar = JSON.parse(JSON.stringify(dataSet));
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
          colItem.editor = /*#__PURE__*/React__default.createElement(DropDownEditor, {
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
    return /*#__PURE__*/React__default.createElement("div", {
      onScroll: this.handleScroll
    }, /*#__PURE__*/React__default.createElement("div", {
      className: "neo-grid-header"
    }, /*#__PURE__*/React__default.createElement("div", {
      className: "neo-grid-header__results"
    }, "Showing \xA0", /*#__PURE__*/React__default.createElement("strong", null, " ", this.state.count, " "), " ", "\xA0 records"), /*#__PURE__*/React__default.createElement("div", {
      className: "neo-grid-header__utilities"
    }, /*#__PURE__*/React__default.createElement("div", {
      className: "txt-wrap"
    }, /*#__PURE__*/React__default.createElement("input", {
      "data-testid": "globalSearch",
      type: "text",
      onChange: e => {
        this.handleSearchValue(e.target.value);
        const srchRows = this.getSearchRecords(e);
        this.globalSearchLogic(e, srchRows);
      },
      value: this.state.searchValue,
      className: "txt",
      placeholder: "Search"
    }), /*#__PURE__*/React__default.createElement("i", null, /*#__PURE__*/React__default.createElement(SvgIconSearch, null))), /*#__PURE__*/React__default.createElement("div", {
      id: "openSorting",
      className: "filterIcons",
      onClick: this.sortingPanel
    }, /*#__PURE__*/React__default.createElement(SvgIconGroupSort, null)), this.state.sortingPanelComponent, /*#__PURE__*/React__default.createElement("div", {
      className: "filterIcons",
      onClick: this.columnReorderingPannel
    }, /*#__PURE__*/React__default.createElement(SvgIconColumns, null)), this.state.columnReorderingComponent, /*#__PURE__*/React__default.createElement("div", {
      className: "filterIcons",
      onClick: this.exportColumnData
    }, /*#__PURE__*/React__default.createElement(SvgIconShare, null)), this.state.exportComponent)), /*#__PURE__*/React__default.createElement(ErrorMessage, {
      className: "errorDiv",
      status: this.state.warningStatus,
      closeWarningStatus: () => {
        this.closeWarningStatus();
      },
      clearSearchValue: this.clearSearchValue
    }), /*#__PURE__*/React__default.createElement(ExtDataGrid, {
      toolbar: /*#__PURE__*/React__default.createElement(Toolbar, {
        enableFilter: true
      }),
      getValidFilterValues: columnKey => this.getValidFilterValues(this.state.filteringRows, columnKey),
      minHeight: this.state.height,
      columns: this.state.columns,
      rowGetter: i => this.state.rows[i],
      rowsCount: this.state.rows.length,
      onGridRowsUpdated: e => {
        this.onGridRowsUpdated(e);
      },
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
  pageSize: PropTypes.any,
  updatedRows: PropTypes.any,
  saveRows: PropTypes.any
};

export default Spreadsheet;
//# sourceMappingURL=index.modern.js.map
