function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = require('react');
var React__default = _interopDefault(React);
var reactDataGridAddons = require('react-data-grid-addons');
var reactBootstrap = require('react-bootstrap');
var freeSolidSvgIcons = require('@fortawesome/free-solid-svg-icons');
var reactFontawesome = require('@fortawesome/react-fontawesome');
var PropTypes = _interopDefault(require('prop-types'));
var ReactDataGrid = _interopDefault(require('react-data-grid'));
var reactDnd = require('react-dnd');
var reactDndTouchBackend = require('react-dnd-touch-backend');
var update = _interopDefault(require('immutability-helper'));
var JSPDF = _interopDefault(require('jspdf'));
require('jspdf-autotable');
var FileSaver = require('file-saver');
var XLSX = require('xlsx');

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

function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;
  subClass.__proto__ = superClass;
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

var ExtDataGrid = /*#__PURE__*/function (_ReactDataGrid) {
  _inheritsLoose(ExtDataGrid, _ReactDataGrid);

  function ExtDataGrid() {
    return _ReactDataGrid.apply(this, arguments) || this;
  }

  var _proto = ExtDataGrid.prototype;

  _proto.componentDidMount = function componentDidMount() {
    this._mounted = true;
    this.dataGridComponent = document.getElementsByClassName("react-grid-Viewport")[0];
    window.addEventListener("resize", this.metricsUpdated);

    this.metricsUpdated();
  };

  _proto.componentWillUnmount = function componentWillUnmount() {
    this._mounted = false;
    window.removeEventListener("resize", this.metricsUpdated);
  };

  return ExtDataGrid;
}(ReactDataGrid);

var applyFormula = function applyFormula(obj, columnName) {
  var val = obj;
  var item = val[columnName].toString();

  if (item && item.charAt(0) === "=") {
    var operation = item.split("(");
    var value = operation[1].substring(0, operation[1].length - 1).split(/[,:]/);

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

var DatePicker = /*#__PURE__*/function (_React$Component) {
  _inheritsLoose(DatePicker, _React$Component);

  function DatePicker(props) {
    var _this;

    _this = _React$Component.call(this, props) || this;
    _this.state = {
      value: new Date()
    };
    _this.input = null;
    _this.getInputNode = _this.getInputNode.bind(_assertThisInitialized(_this));
    _this.getValue = _this.getValue.bind(_assertThisInitialized(_this));
    _this.onValueChanged = _this.onValueChanged.bind(_assertThisInitialized(_this));
    return _this;
  }

  var _proto = DatePicker.prototype;

  _proto.onValueChanged = function onValueChanged(ev) {
    this.setState({
      value: ev.target.value
    });
  };

  _proto.getValue = function getValue() {
    var updated = {};
    var date = new Date(this.state.value);
    var dateTimeFormat = new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "numeric",
      day: "2-digit"
    });

    var _dateTimeFormat$forma = dateTimeFormat.formatToParts(date),
        month = _dateTimeFormat$forma[0].value,
        day = _dateTimeFormat$forma[2].value,
        year = _dateTimeFormat$forma[4].value;

    updated[this.props.column.key] = year + "-" + month + "-" + day;
    return updated;
  };

  _proto.getInputNode = function getInputNode() {
    return this.input;
  };

  _proto.render = function render() {
    var _this2 = this;

    return /*#__PURE__*/React__default.createElement("div", null, /*#__PURE__*/React__default.createElement("input", {
      type: "date",
      ref: function ref(_ref) {
        _this2.input = _ref;
      },
      value: this.state.value,
      onChange: this.onValueChanged
    }));
  };

  return DatePicker;
}(React__default.Component);
DatePicker.propTypes = {
  column: PropTypes.string
};

var SEARCH_NOT_FOUNT_ERROR = "No Records found!";

var ErrorMessage = function ErrorMessage(props) {
  var _useState = React.useState(props.status),
      status = _useState[0],
      setStatus = _useState[1];

  React.useEffect(function () {
    setStatus(props.status);
  }, [props.status]);

  if (status === "invalid") {
    return /*#__PURE__*/React__default.createElement("div", {
      id: "errorMsg"
    }, /*#__PURE__*/React__default.createElement("div", {
      className: "alert alert-danger",
      role: "alert"
    }, SEARCH_NOT_FOUNT_ERROR), /*#__PURE__*/React__default.createElement("div", {
      className: "notification-close"
    }, /*#__PURE__*/React__default.createElement(reactFontawesome.FontAwesomeIcon, {
      icon: freeSolidSvgIcons.faTimes,
      onClick: function onClick() {
        props.closeWarningStatus();
        props.clearSearchValue();
      }
    })));
  }

  return /*#__PURE__*/React__default.createElement("div", null);
};

var ItemTypes = {
  COLUMN: "column"
};

var style = {
  cursor: "move"
};

var ColumnItem = function ColumnItem(_ref) {
  var id = _ref.id,
      text = _ref.text,
      moveColumn = _ref.moveColumn,
      findColumn = _ref.findColumn;
  var originalIndex = findColumn(id).index;

  var _useDrag = reactDnd.useDrag({
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

  var _useDrop = reactDnd.useDrop({
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
    ref: function ref(node) {
      return drag(drop(node));
    },
    style: _extends({}, style, {
      opacity: opacity
    })
  }, text);
};

ColumnItem.propTypes = {
  id: PropTypes.any,
  text: PropTypes.any,
  moveColumn: PropTypes.any,
  findColumn: PropTypes.any
};

var ColumnsList = function ColumnsList(props) {
  var _useState = React.useState([].concat(props.columnsArray)),
      columns = _useState[0],
      setColumns = _useState[1];

  var findColumn = function findColumn(id) {
    var column = columns.filter(function (c) {
      return "" + c.id === id;
    })[0];
    return {
      column: column,
      index: columns.indexOf(column)
    };
  };

  var moveColumn = function moveColumn(id, atIndex) {
    var _findColumn = findColumn(id),
        column = _findColumn.column,
        index = _findColumn.index;

    setColumns(update(columns, {
      $splice: [[index, 1], [atIndex, 0, column]]
    }));
    var values = [];
    var temp = [];
    temp = update(columns, {
      $splice: [[index, 1], [atIndex, 0, column]]
    });
    temp.forEach(function (item) {
      values.push(item.id);
    });
    props.handleReorderList(values);
  };

  var _useDrop = reactDnd.useDrop({
    accept: ItemTypes.COLUMN
  }),
      drop = _useDrop[1];

  React__default.useEffect(function () {
    setColumns(props.columnsArray);
  }, [props.columnsArray]);
  return /*#__PURE__*/React__default.createElement(React.Fragment, null, /*#__PURE__*/React__default.createElement("div", {
    ref: drop,
    style: {
      display: "flex",
      flexWrap: "wrap"
    }
  }, columns.map(function (column) {
    return /*#__PURE__*/React__default.createElement(ColumnItem, {
      key: column.id,
      id: "" + column.id,
      text: column.text,
      moveColumn: moveColumn,
      findColumn: findColumn
    });
  })));
};

ColumnsList.propTypes = {
  columnsArray: PropTypes.any,
  handleReorderList: PropTypes.any
};

var ColumnReordering = /*#__PURE__*/function (_React$Component) {
  _inheritsLoose(ColumnReordering, _React$Component);

  function ColumnReordering(props) {
    var _this;

    _this = _React$Component.call(this, props) || this;

    _this.resetColumnReorderList = function () {
      _this.setState({
        columnReorderEntityList: _this.props.columns.map(function (item) {
          return item.name;
        }),
        leftPinnedColumList: [],
        isAllSelected: true
      });
    };

    _this.selectAllToColumnReOrderList = function () {
      _this.resetColumnReorderList();

      var existingColumnReorderEntityList = _this.state.columnReorderEntityList;
      var isExistingAllSelect = _this.state.isAllSelected;

      if (!isExistingAllSelect) {
        existingColumnReorderEntityList = _this.props.columns.map(function (item) {
          return item.name;
        });
        isExistingAllSelect = true;
      } else {
        existingColumnReorderEntityList = [];
        isExistingAllSelect = false;
      }

      _this.setState({
        columnReorderEntityList: existingColumnReorderEntityList,
        isAllSelected: isExistingAllSelect,
        leftPinnedColumList: []
      });
    };

    _this.addToColumnReorderEntityList = function (typeToBeAdded) {
      var existingColumnReorderEntityList = _this.state.columnReorderEntityList;
      var existingLeftPinnedList = _this.state.leftPinnedColumList;

      if (!existingColumnReorderEntityList.includes(typeToBeAdded)) {
        (function () {
          var indexOfInsertion = _this.state.columnSelectList.findIndex(function (item) {
            return item === typeToBeAdded;
          });

          while (indexOfInsertion > 0) {
            if (existingColumnReorderEntityList.includes(_this.state.columnSelectList[indexOfInsertion - 1])) {
              if (!existingLeftPinnedList.includes(_this.state.columnSelectList[indexOfInsertion - 1])) {
                indexOfInsertion = existingColumnReorderEntityList.findIndex(function (item) {
                  return item === _this.state.columnSelectList[indexOfInsertion - 1];
                });
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
        })();
      } else {
        existingColumnReorderEntityList = existingColumnReorderEntityList.filter(function (item) {
          if (item !== typeToBeAdded) return item;else return "";
        });

        if (existingLeftPinnedList.includes(typeToBeAdded)) {
          existingLeftPinnedList = existingLeftPinnedList.filter(function (item) {
            return item !== typeToBeAdded;
          });
        }
      }

      _this.setState({
        columnReorderEntityList: existingColumnReorderEntityList,
        isAllSelected: false,
        leftPinnedColumList: existingLeftPinnedList
      });
    };

    _this.filterColumnReorderList = function (e) {
      var searchKey = String(e.target.value).toLowerCase();

      var existingList = _this.props.columns.map(function (item) {
        return item.name;
      });

      var filtererdColumnReorderList = [];

      if (searchKey.length > 0) {
        filtererdColumnReorderList = existingList.filter(function (item) {
          return item.toLowerCase().includes(searchKey);
        });
      } else {
        filtererdColumnReorderList = _this.props.columns.map(function (item) {
          return item.name;
        });
      }

      _this.setState({
        columnSelectList: filtererdColumnReorderList
      });
    };

    _this.createColumnsArrayFromProps = function (colsList) {
      return colsList.map(function (item) {
        return {
          id: item,
          text: /*#__PURE__*/React__default.createElement("div", {
            className: "column__reorder",
            key: item
          }, /*#__PURE__*/React__default.createElement("div", {
            className: ""
          }, /*#__PURE__*/React__default.createElement(reactFontawesome.FontAwesomeIcon, {
            icon: freeSolidSvgIcons.faAlignJustify
          })), /*#__PURE__*/React__default.createElement("div", {
            className: "column__reorder__name"
          }, item), /*#__PURE__*/React__default.createElement("div", {
            className: "column__wrap"
          }, /*#__PURE__*/React__default.createElement("div", {
            className: "column__checkbox"
          }, /*#__PURE__*/React__default.createElement("input", {
            role: "button",
            type: "checkbox",
            id: "checkBoxToPinLeft_" + item,
            checked: _this.state.leftPinnedColumList.includes(item),
            disabled: _this.state.maxLeftPinnedColumn - _this.state.leftPinnedColumList.length <= 0 ? !_this.state.leftPinnedColumList.includes(item) : false,
            onChange: function onChange() {
              return _this.reArrangeLeftPinnedColumn(item);
            }
          })), /*#__PURE__*/React__default.createElement("div", {
            className: "column__txt"
          }, "Pin Left")))
        };
      });
    };

    _this.reArrangeLeftPinnedColumn = function (columHeaderName) {
      var existingLeftPinnedList = _this.state.leftPinnedColumList;
      var existingColumnReorderEntityList = _this.state.columnReorderEntityList;

      if (!existingLeftPinnedList.includes(columHeaderName)) {
        existingLeftPinnedList.unshift(columHeaderName);
      } else {
        existingLeftPinnedList = existingLeftPinnedList.filter(function (item) {
          return item !== columHeaderName;
        });
      }

      _this.setState({
        leftPinnedColumList: existingLeftPinnedList
      });

      existingLeftPinnedList.forEach(function (item) {
        existingColumnReorderEntityList = existingColumnReorderEntityList.filter(function (subItem) {
          return subItem !== item;
        });
        existingColumnReorderEntityList.unshift(item);
        return null;
      });

      _this.setState({
        columnReorderEntityList: existingColumnReorderEntityList
      });
    };

    _this.handleReorderList = function (reordered) {
      _this.props.handleheaderNameList(reordered);
    };

    _this.state = {
      columnReorderEntityList: _this.props.headerKeys,
      columnSelectList: _this.props.columns.map(function (item) {
        return item.name;
      }),
      leftPinnedColumList: _this.props.existingPinnedHeadersList,
      isAllSelected: true,
      maxLeftPinnedColumn: _this.props.maxLeftPinnedColumn
    };
    _this.setWrapperRef = _this.setWrapperRef.bind(_assertThisInitialized(_this));
    _this.handleClickOutside = _this.handleClickOutside.bind(_assertThisInitialized(_this));
    return _this;
  }

  var _proto = ColumnReordering.prototype;

  _proto.componentDidMount = function componentDidMount() {
    document.addEventListener("mousedown", this.handleClickOutside);
  };

  _proto.componentWillUnmount = function componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleClickOutside);
  };

  _proto.setWrapperRef = function setWrapperRef(node) {
    this.wrapperRef = node;
  };

  _proto.handleClickOutside = function handleClickOutside(event) {
    if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
      this.props.closeColumnReOrdering();
    }
  };

  _proto.render = function render() {
    var _this2 = this;

    return /*#__PURE__*/React__default.createElement("div", {
      className: "columns--grid",
      ref: this.setWrapperRef
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
      onChange: this.filterColumnReorderList
    })), /*#__PURE__*/React__default.createElement("div", {
      className: "column__wrap column__headertxt"
    }, /*#__PURE__*/React__default.createElement("div", {
      className: "column__checkbox"
    }, /*#__PURE__*/React__default.createElement("input", {
      type: "checkbox",
      id: "selectallcolumncheckbox",
      onChange: function onChange() {
        return _this2.selectAllToColumnReOrderList();
      },
      checked: this.state.columnReorderEntityList.length === this.props.columns.length
    })), /*#__PURE__*/React__default.createElement("div", {
      className: "column__txt"
    }, "Select all")), this.state.columnSelectList.map(function (item) {
      return /*#__PURE__*/React__default.createElement("div", {
        className: "column__wrap",
        key: item
      }, /*#__PURE__*/React__default.createElement("div", {
        className: "column__checkbox"
      }, /*#__PURE__*/React__default.createElement("input", {
        type: "checkbox",
        id: "checkboxtoselectreorder_" + item,
        checked: _this2.state.columnReorderEntityList.includes(item),
        onChange: function onChange() {
          return _this2.addToColumnReorderEntityList(item);
        }
      })), /*#__PURE__*/React__default.createElement("div", {
        className: "column__txt"
      }, item));
    }))), /*#__PURE__*/React__default.createElement("div", {
      className: "column__settings"
    }, /*#__PURE__*/React__default.createElement("div", {
      className: "column__header"
    }, /*#__PURE__*/React__default.createElement("div", {
      className: "column__headerTxt"
    }, /*#__PURE__*/React__default.createElement("strong", null, "Column Setting")), /*#__PURE__*/React__default.createElement("div", {
      className: "column__close"
    }, /*#__PURE__*/React__default.createElement(reactFontawesome.FontAwesomeIcon, {
      className: "icon-close",
      icon: freeSolidSvgIcons.faTimes,
      onClick: function onClick() {
        return _this2.props.closeColumnReOrdering();
      }
    }))), /*#__PURE__*/React__default.createElement("div", {
      className: "column__header"
    }, /*#__PURE__*/React__default.createElement("div", {
      className: "column__headerTxt"
    }, /*#__PURE__*/React__default.createElement("strong", null, "\xA0 \xA0 Selected Column Count :", " ", this.state.columnReorderEntityList.length)), /*#__PURE__*/React__default.createElement("div", {
      className: "column__headerTxt"
    }, this.state.maxLeftPinnedColumn - this.state.leftPinnedColumList.length > 0 ? /*#__PURE__*/React__default.createElement("strong", null, "\xA0 \xA0 Left Pinned Column Count Remaining :", " ", this.state.maxLeftPinnedColumn - this.state.leftPinnedColumList.length) : /*#__PURE__*/React__default.createElement("strong", {
      style: {
        color: "red"
      }
    }, "\xA0 \xA0 Maximum Count Of Left Pin Columns REACHED"))), /*#__PURE__*/React__default.createElement("div", {
      className: "column__body"
    }, /*#__PURE__*/React__default.createElement(reactDnd.DndProvider, {
      backend: reactDndTouchBackend.TouchBackend,
      options: {
        enableMouseEvents: true
      }
    }, /*#__PURE__*/React__default.createElement(ColumnsList, {
      columnsArray: this.createColumnsArrayFromProps(this.state.columnReorderEntityList),
      handleReorderList: this.handleReorderList
    }))), /*#__PURE__*/React__default.createElement("div", {
      className: "column__footer"
    }, /*#__PURE__*/React__default.createElement("div", {
      className: "column__btns"
    }, /*#__PURE__*/React__default.createElement("button", {
      type: "button",
      className: "btns",
      onClick: function onClick() {
        return _this2.resetColumnReorderList();
      }
    }, "Reset"), /*#__PURE__*/React__default.createElement("button", {
      type: "button",
      className: "btns",
      onClick: function onClick() {
        return _this2.props.closeColumnReOrdering();
      }
    }, "Cancel"), /*#__PURE__*/React__default.createElement("button", {
      type: "button",
      className: "btns btns__save",
      onClick: function onClick() {
        return _this2.props.updateTableAsPerRowChooser(_this2.state.columnReorderEntityList, _this2.state.leftPinnedColumList);
      }
    }, "Save"))))));
  };

  return ColumnReordering;
}(React__default.Component);

ColumnReordering.propTypes = {
  headerKeys: PropTypes.any,
  columns: PropTypes.any,
  existingPinnedHeadersList: PropTypes.any,
  maxLeftPinnedColumn: PropTypes.any,
  closeColumnReOrdering: PropTypes.any,
  handleheaderNameList: PropTypes.any,
  updateTableAsPerRowChooser: PropTypes.any
};

var ItemTypes$1 = {
  CARD: "sort"
};

var style$1 = {
  cursor: "move"
};

var Card = function Card(_ref) {
  var id = _ref.id,
      text = _ref.text,
      moveCard = _ref.moveCard,
      findCard = _ref.findCard;
  var originalIndex = findCard(id).index;

  var _useDrag = reactDnd.useDrag({
    item: {
      type: ItemTypes$1.CARD,
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
        moveCard(droppedId, originalIndex);
      }
    }
  }),
      isDragging = _useDrag[0].isDragging,
      drag = _useDrag[1];

  var _useDrop = reactDnd.useDrop({
    accept: ItemTypes$1.CARD,
    canDrop: function canDrop() {
      return false;
    },
    hover: function hover(_ref2) {
      var draggedId = _ref2.id;

      if (draggedId !== id) {
        var _findCard = findCard(id),
            overIndex = _findCard.index;

        moveCard(draggedId, overIndex);
      }
    }
  }),
      drop = _useDrop[1];

  var opacity = isDragging ? 0.5 : 1;
  return /*#__PURE__*/React__default.createElement("div", {
    ref: function ref(node) {
      return drag(drop(node));
    },
    style: _extends({}, style$1, {
      opacity: opacity
    })
  }, text);
};

Card.propTypes = {
  id: PropTypes.any,
  text: PropTypes.any,
  moveCard: PropTypes.any,
  findCard: PropTypes.any
};

var SortingList = function SortingList(props) {
  var _useState = React.useState([].concat(props.sortsArray)),
      cards = _useState[0],
      setCards = _useState[1];

  var findCard = function findCard(id) {
    var card = cards.filter(function (c) {
      return "" + c.id === id;
    })[0];
    return {
      card: card,
      index: cards.indexOf(card)
    };
  };

  var moveCard = function moveCard(id, atIndex) {
    var _findCard = findCard(id),
        card = _findCard.card,
        index = _findCard.index;

    setCards(update(cards, {
      $splice: [[index, 1], [atIndex, 0, card]]
    }));
    var values = [];
    var temp = [];
    temp = update(cards, {
      $splice: [[index, 1], [atIndex, 0, card]]
    });
    temp.forEach(function (item) {
      values.push(item.id);
    });
    props.handleReorderListOfSort(values);
  };

  var _useDrop = reactDnd.useDrop({
    accept: ItemTypes$1.CARD
  }),
      drop = _useDrop[1];

  React__default.useEffect(function () {
    setCards(props.sortsArray);
  }, [props.sortsArray]);
  return /*#__PURE__*/React__default.createElement(React.Fragment, null, /*#__PURE__*/React__default.createElement("div", {
    ref: drop,
    style: {
      display: "flex",
      flexWrap: "wrap"
    }
  }, cards.map(function (card) {
    return /*#__PURE__*/React__default.createElement(Card, {
      key: card.id,
      id: "" + card.id,
      text: card.text,
      moveCard: moveCard,
      findCard: findCard
    });
  })));
};

SortingList.propTypes = {
  sortsArray: PropTypes.any,
  handleReorderListOfSort: PropTypes.any
};

var App = /*#__PURE__*/function (_React$Component) {
  _inheritsLoose(App, _React$Component);

  function App(props) {
    var _this;

    _this = _React$Component.call(this, props) || this;

    _this.add = function () {
      var rowList = [].concat(_this.state.rowList);
      rowList.push(true);
      var existingSortingOrderList = _this.state.sortingOrderList;
      existingSortingOrderList.push({
        sortBy: _this.props.columnFieldValue[0],
        order: "Ascending",
        sortOn: "Value"
      });

      _this.setState({
        rowList: rowList,
        sortingOrderList: existingSortingOrderList
      });
    };

    _this.copy = function (i) {
      var rowList = [].concat(_this.state.sortingOrderList);
      rowList.push(JSON.parse(JSON.stringify(rowList[i])));

      _this.setState({
        sortingOrderList: rowList
      });
    };

    _this.clearAll = function () {
      _this.setState({
        sortingOrderList: [],
        errorMessage: false
      });

      _this.props.clearAllSortingParams();
    };

    _this.remove = function (i) {
      var sortingOrderList = [].concat(_this.state.sortingOrderList);
      sortingOrderList.splice(i, 1);

      _this.setState({
        sortingOrderList: sortingOrderList
      });

      if (sortingOrderList.length <= 1) {
        _this.setState({
          errorMessage: false
        });
      }
    };

    _this.createColumnsArrayFromProps = function (rowsValue) {
      return rowsValue.map(function (row, index) {
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
          }, /*#__PURE__*/React__default.createElement(reactFontawesome.FontAwesomeIcon, {
            icon: freeSolidSvgIcons.faAlignJustify
          }))), /*#__PURE__*/React__default.createElement("div", {
            className: "sort__reorder"
          }, /*#__PURE__*/React__default.createElement("div", {
            className: ""
          }, /*#__PURE__*/React__default.createElement("div", null, "Sort by")), /*#__PURE__*/React__default.createElement("div", {
            className: "sort__file"
          }, /*#__PURE__*/React__default.createElement("select", {
            className: "custom__ctrl",
            name: "sortBy",
            onChange: function onChange(e) {
              return _this.captureSortingFeildValues(e, index, "sortBy");
            },
            value: row.sortBy
          }, _this.props.columnFieldValue.map(function (item) {
            return /*#__PURE__*/React__default.createElement("option", {
              key: item
            }, item);
          })))), /*#__PURE__*/React__default.createElement("div", {
            className: "sort__reorder"
          }, /*#__PURE__*/React__default.createElement("div", {
            className: ""
          }, /*#__PURE__*/React__default.createElement("div", null, "Sort on")), /*#__PURE__*/React__default.createElement("div", {
            className: "sort__file"
          }, /*#__PURE__*/React__default.createElement("select", {
            className: "custom__ctrl",
            name: "sortOn",
            onChange: function onChange(e) {
              return _this.captureSortingFeildValues(e, index, "sortOn");
            },
            value: row.sortOn
          }, /*#__PURE__*/React__default.createElement("option", null, "Value")))), /*#__PURE__*/React__default.createElement("div", {
            className: "sort__reorder"
          }, /*#__PURE__*/React__default.createElement("div", {
            className: ""
          }, /*#__PURE__*/React__default.createElement("div", null, "Order")), /*#__PURE__*/React__default.createElement("div", {
            className: "sort__file"
          }, /*#__PURE__*/React__default.createElement("select", {
            className: "custom__ctrl",
            name: "order",
            onChange: function onChange(e) {
              return _this.captureSortingFeildValues(e, index, "order");
            },
            value: row.order
          }, /*#__PURE__*/React__default.createElement("option", null, "Ascending"), /*#__PURE__*/React__default.createElement("option", null, "Descending")))), /*#__PURE__*/React__default.createElement("div", {
            className: "sort__reorder"
          }, /*#__PURE__*/React__default.createElement("div", {
            className: ""
          }, /*#__PURE__*/React__default.createElement("div", null, "\xA0")), /*#__PURE__*/React__default.createElement("div", {
            className: "sort__icon"
          }, /*#__PURE__*/React__default.createElement(reactFontawesome.FontAwesomeIcon, {
            icon: freeSolidSvgIcons.faCopy,
            title: "Copy",
            onClick: function onClick() {
              return _this.copy(index);
            }
          }))), /*#__PURE__*/React__default.createElement("div", {
            className: "sort__reorder"
          }, /*#__PURE__*/React__default.createElement("div", {
            className: ""
          }, /*#__PURE__*/React__default.createElement("div", null, "\xA0")), /*#__PURE__*/React__default.createElement("div", {
            className: "sort__icon"
          }, /*#__PURE__*/React__default.createElement(reactFontawesome.FontAwesomeIcon, {
            icon: freeSolidSvgIcons.faTrash,
            title: "Delete",
            onClick: function onClick() {
              return _this.remove(index);
            }
          }))))
        };
      });
    };

    _this.captureSortingFeildValues = function (event, index, sortingKey) {
      var existingSortingOrderList = _this.state.sortingOrderList;

      if (sortingKey === "sortBy") {
        existingSortingOrderList[index].sortBy = event.target.value;
      }

      if (sortingKey === "order") {
        existingSortingOrderList[index].order = event.target.value;
      }

      if (existingSortingOrderList[index].sortOn === "" || existingSortingOrderList[index].sortOn === undefined) {
        existingSortingOrderList[index].sortOn = "Value";
      }

      _this.setState({
        sortingOrderList: existingSortingOrderList
      });
    };

    _this.updateTableAsPerSortCondition = function () {
      var unique = new Set();

      var showError = _this.state.sortingOrderList.some(function (element) {
        return unique.size === unique.add(element.sortBy).size;
      });

      showError ? _this.setState({
        errorMessage: true
      }) : _this.setState({
        errorMessage: false
      });

      if (!showError) {
        _this.props.setTableAsPerSortingParams(_this.state.sortingOrderList);
      }
    };

    _this.handleReorderListOfSort = function (reOrderedIndexList) {
      _this.props.handleTableSortSwap(reOrderedIndexList);
    };

    _this.state = {
      rowList: [true],
      sortingOrderList: _this.props.sortingParamsObjectList === undefined ? [] : _this.props.sortingParamsObjectList,
      errorMessage: false
    };
    _this.setWrapperRef = _this.setWrapperRef.bind(_assertThisInitialized(_this));
    _this.handleClickOutside = _this.handleClickOutside.bind(_assertThisInitialized(_this));
    return _this;
  }

  var _proto = App.prototype;

  _proto.componentDidMount = function componentDidMount() {
    document.addEventListener("mousedown", this.handleClickOutside);
  };

  _proto.componentWillUnmount = function componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleClickOutside);
  };

  _proto.setWrapperRef = function setWrapperRef(node) {
    this.wrapperRef = node;
  };

  _proto.handleClickOutside = function handleClickOutside(event) {
    if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
      this.props.closeSorting();
    }
  };

  _proto.render = function render() {
    var _this2 = this;

    return /*#__PURE__*/React__default.createElement("div", {
      className: "sorts--grid",
      ref: this.setWrapperRef
    }, /*#__PURE__*/React__default.createElement("div", {
      className: "sort__grid"
    }, /*#__PURE__*/React__default.createElement("div", {
      className: "sort__settings"
    }, /*#__PURE__*/React__default.createElement("div", {
      className: "sort__header"
    }, /*#__PURE__*/React__default.createElement("div", {
      className: "sort__headerTxt"
    }, /*#__PURE__*/React__default.createElement("strong", null, "Sort ")), /*#__PURE__*/React__default.createElement("div", {
      className: "sort__close"
    }, /*#__PURE__*/React__default.createElement(reactFontawesome.FontAwesomeIcon, {
      className: "icon-close",
      icon: freeSolidSvgIcons.faTimes,
      onClick: function onClick() {
        return _this2.props.closeSorting();
      }
    }))), /*#__PURE__*/React__default.createElement("div", {
      className: "sort__body"
    }, /*#__PURE__*/React__default.createElement(reactDnd.DndProvider, {
      backend: reactDndTouchBackend.TouchBackend,
      options: {
        enableMouseEvents: true
      }
    }, /*#__PURE__*/React__default.createElement(SortingList, {
      handleReorderListOfSort: this.handleReorderListOfSort,
      sortsArray: this.createColumnsArrayFromProps(this.state.sortingOrderList)
    })), /*#__PURE__*/React__default.createElement("div", {
      className: "sort-warning"
    }, this.state.errorMessage ? /*#__PURE__*/React__default.createElement("span", {
      className: "alert alert-danger"
    }, "Sort by opted are same, Please choose different one.") : "")), /*#__PURE__*/React__default.createElement("div", {
      className: "sort__new"
    }, /*#__PURE__*/React__default.createElement("div", {
      className: "sort__section"
    }, /*#__PURE__*/React__default.createElement(reactFontawesome.FontAwesomeIcon, {
      icon: freeSolidSvgIcons.faPlus,
      className: "sort__icon"
    }), /*#__PURE__*/React__default.createElement("div", {
      role: "button",
      tabIndex: 0,
      className: "sort__txt",
      onClick: function onClick() {
        return _this2.add();
      },
      onKeyDown: function onKeyDown() {
        return _this2.add();
      }
    }, "New Sort"))), /*#__PURE__*/React__default.createElement("div", {
      className: "sort__footer"
    }, /*#__PURE__*/React__default.createElement("div", {
      className: "sort__btns"
    }, /*#__PURE__*/React__default.createElement("button", {
      type: "button",
      className: "btns",
      onClick: this.clearAll
    }, "Clear All"), /*#__PURE__*/React__default.createElement("button", {
      type: "button",
      className: "btns btns__save",
      onClick: function onClick() {
        return _this2.updateTableAsPerSortCondition();
      }
    }, "Ok"))))));
  };

  return App;
}(React__default.Component);

App.propTypes = {
  sortingParamsObjectList: PropTypes.any,
  closeSorting: PropTypes.any,
  columnFieldValue: PropTypes.any,
  clearAllSortingParams: PropTypes.any,
  setTableAsPerSortingParams: PropTypes.any,
  handleTableSortSwap: PropTypes.any
};

var downLaodFileType = [];

var ExportData = /*#__PURE__*/function (_React$Component) {
  _inheritsLoose(ExportData, _React$Component);

  function ExportData(props) {
    var _this;

    _this = _React$Component.call(this, props) || this;

    _this.resetColumnExportList = function () {
      _this.setState({
        columnEntityList: [],
        isAllSelected: false
      });
    };

    _this.selectAllToColumnList = function () {
      _this.resetColumnExportList();

      _this.setState({
        columnEntityList: !_this.state.isAllSelected ? _this.props.columnsList : [],
        isAllSelected: !_this.state.isAllSelected
      });
    };

    _this.addToColumnEntityList = function (typeToBeAdded) {
      var existingColumnEntityList = _this.state.columnEntityList;

      if (!existingColumnEntityList.includes(typeToBeAdded)) {
        existingColumnEntityList.push(typeToBeAdded);
      } else {
        existingColumnEntityList = existingColumnEntityList.filter(function (item) {
          return item !== typeToBeAdded;
        });
      }

      _this.setState({
        columnEntityList: existingColumnEntityList,
        isAllSelected: false
      });
    };

    _this.selectDownLoadType = function (event) {
      if (event.target.checked && !_this.state.downLaodFileType.includes(event.target.value)) {
        downLaodFileType.push(event.target.value);

        _this.setState({
          downLaodFileType: downLaodFileType
        });
      } else {
        downLaodFileType.forEach(function (value, index) {
          if (value === event.target.value) {
            downLaodFileType = downLaodFileType.splice(index, value);
          }
        });

        _this.setState({
          downLaodFileType: downLaodFileType
        });
      }
    };

    _this.exportRowData = function () {
      var columnVlaueList = _this.state.columnEntityList;

      if (columnVlaueList.length > 0 && _this.state.downLaodFileType.length > 0) {
        _this.props.rows.forEach(function (row) {
          var keys = Object.getOwnPropertyNames(row);
          var filteredColumnVal = {};
          keys.forEach(function (key) {
            columnVlaueList.forEach(function (columnName) {
              if (columnName.key === key) filteredColumnVal[key] = row[key];
            });
          });

          _this.state.filteredRow.push(filteredColumnVal);
        });

        _this.state.downLaodFileType.forEach(function (item) {
          if (item === "pdf") _this.downloadPDF();else if (item === "excel") _this.downloadXLSFile();else _this.downloadCSVFile();
        });
      }
    };

    _this.downloadPDF = function () {
      var unit = "pt";
      var size = "A4";
      var orientation = "landscape";
      var marginLeft = 300;
      var doc = new JSPDF(orientation, unit, size);
      doc.setFontSize(15);
      var title = "iCargo Report";
      var headers = [_this.state.columnEntityList.map(function (column) {
        return column.name;
      })];
      var dataValues = [];

      _this.props.rows.forEach(function (row) {
        var keys = Object.keys(row);
        var filteredColumnVal = [];

        _this.state.columnEntityList.forEach(function (columnName) {
          keys.forEach(function (key) {
            if (columnName.key === key) filteredColumnVal.push(row[key]);
          });
        });

        dataValues.push(filteredColumnVal);
      });

      var content = {
        startY: 50,
        head: headers,
        body: dataValues
      };
      doc.text(title, marginLeft, 40);
      doc.autoTable(content);
      doc.save("report.pdf");
    };

    _this.downloadCSVFile = function () {
      var fileType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
      var fileExtension = ".csv";
      var fileName = "CSVDownload";
      var ws = XLSX.utils.json_to_sheet(_this.state.filteredRow);
      var wb = {
        Sheets: {
          data: ws
        },
        SheetNames: ["data"]
      };
      var excelBuffer = XLSX.write(wb, {
        bookType: "csv",
        type: "array"
      });
      var data = new Blob([excelBuffer], {
        type: fileType
      });
      FileSaver.saveAs(data, fileName + fileExtension);
    };

    _this.downloadXLSFile = function () {
      var fileType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
      var fileExtension = ".xlsx";
      var fileName = "XLSXDownload";
      var ws = XLSX.utils.json_to_sheet(_this.state.filteredRow);
      var wb = {
        Sheets: {
          data: ws
        },
        SheetNames: ["data"]
      };
      var excelBuffer = XLSX.write(wb, {
        bookType: "xlsx",
        type: "array"
      });
      var data = new Blob([excelBuffer], {
        type: fileType
      });
      FileSaver.saveAs(data, fileName + fileExtension);
    };

    _this.columnSearchLogic = function (e) {
      var searchKey = String(e.target.value).toLowerCase();

      var filteredRows = _this.props.columnsList.filter(function (item) {
        return item.name.toLowerCase().includes(searchKey);
      });

      if (!filteredRows.length) {
        _this.setState({
          columnValueList: _this.props.columnsList
        });
      } else {
        _this.setState({
          columnValueList: filteredRows
        });
      }
    };

    _this.exportValidation = function () {
      var columnLength = _this.state.columnEntityList.length;
      var fileLength = _this.state.downLaodFileType.length;

      if (columnLength > 0 && fileLength > 0) {
        _this.exportRowData();

        _this.setState({
          clickTag: "none"
        });
      } else if (columnLength === 0) {
        _this.setState({
          warning: "Column"
        });

        _this.setState({
          clickTag: ""
        });
      } else if (fileLength === 0) {
        _this.setState({
          warning: "File Type"
        });

        _this.setState({
          clickTag: ""
        });
      }

      if (columnLength === 0 && fileLength === 0) {
        _this.setState({
          warning: "File Type & Column"
        });

        _this.setState({
          clickTag: ""
        });
      }
    };

    _this.state = {
      columnValueList: _this.props.columnsList,
      columnEntityList: _this.props.columnsList,
      isAllSelected: true,
      downLaodFileType: [],
      filteredRow: [],
      warning: "",
      clickTag: "none"
    };
    _this.setWrapperRef = _this.setWrapperRef.bind(_assertThisInitialized(_this));
    _this.handleClickOutside = _this.handleClickOutside.bind(_assertThisInitialized(_this));
    _this.selectDownLoadType = _this.selectDownLoadType.bind(_assertThisInitialized(_this));
    _this.exportValidation = _this.exportValidation.bind(_assertThisInitialized(_this));
    return _this;
  }

  var _proto = ExportData.prototype;

  _proto.componentDidMount = function componentDidMount() {
    document.addEventListener("mousedown", this.handleClickOutside);
  };

  _proto.componentWillUnmount = function componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleClickOutside);
  };

  _proto.setWrapperRef = function setWrapperRef(node) {
    this.wrapperRef = node;
  };

  _proto.handleClickOutside = function handleClickOutside(event) {
    if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
      this.props.closeExport();
    }
  };

  _proto.render = function render() {
    var _this2 = this;

    return /*#__PURE__*/React__default.createElement("div", {
      className: "exports--grid",
      ref: this.setWrapperRef
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
      placeholder: "Search export",
      className: "custom__ctrl",
      onChange: this.columnSearchLogic
    })), /*#__PURE__*/React__default.createElement("div", {
      className: "export__wrap export__headertxt"
    }, /*#__PURE__*/React__default.createElement("div", {
      className: "export__checkbox"
    }, /*#__PURE__*/React__default.createElement("input", {
      className: "selectColumn",
      type: "checkbox",
      onChange: function onChange() {
        return _this2.selectAllToColumnList();
      },
      checked: this.state.isAllSelected
    })), /*#__PURE__*/React__default.createElement("div", {
      className: "export__txt"
    }, "Select All")), this.state.columnValueList && this.state.columnValueList.length > 0 ? this.state.columnValueList.map(function (column) {
      return /*#__PURE__*/React__default.createElement("div", {
        className: "export__wrap",
        key: column.key
      }, /*#__PURE__*/React__default.createElement("div", {
        className: "export__checkbox"
      }, /*#__PURE__*/React__default.createElement("input", {
        type: "checkbox",
        checked: _this2.state.columnEntityList.includes(column),
        onChange: function onChange() {
          return _this2.addToColumnEntityList(column);
        }
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
    }, /*#__PURE__*/React__default.createElement(reactFontawesome.FontAwesomeIcon, {
      icon: freeSolidSvgIcons.faTimes,
      className: "icon-close",
      onClick: this.props.closeExport
    }))), /*#__PURE__*/React__default.createElement("div", {
      className: "export__as"
    }, "Export as"), /*#__PURE__*/React__default.createElement("div", {
      className: "export__body"
    }, /*#__PURE__*/React__default.createElement("div", {
      className: "export__reorder"
    }, /*#__PURE__*/React__default.createElement("div", {
      className: ""
    }, /*#__PURE__*/React__default.createElement("input", {
      type: "checkbox",
      name: "pdf",
      value: "pdf",
      onChange: this.selectDownLoadType
    })), /*#__PURE__*/React__default.createElement("div", {
      className: "export__file"
    }, /*#__PURE__*/React__default.createElement(reactFontawesome.FontAwesomeIcon, {
      icon: freeSolidSvgIcons.faFilePdf,
      className: "temp"
    }))), /*#__PURE__*/React__default.createElement("div", {
      className: "export__reorder"
    }, /*#__PURE__*/React__default.createElement("div", {
      className: ""
    }, /*#__PURE__*/React__default.createElement("input", {
      type: "checkbox",
      name: "excel",
      value: "excel",
      onChange: this.selectDownLoadType
    })), /*#__PURE__*/React__default.createElement("div", {
      className: "export__file"
    }, /*#__PURE__*/React__default.createElement(reactFontawesome.FontAwesomeIcon, {
      icon: freeSolidSvgIcons.faFileExcel,
      className: "temp"
    }))), /*#__PURE__*/React__default.createElement("div", {
      className: "export__reorder"
    }, /*#__PURE__*/React__default.createElement("div", {
      className: ""
    }, /*#__PURE__*/React__default.createElement("input", {
      type: "checkbox",
      name: "csv",
      value: "csv",
      onChange: this.selectDownLoadType
    })), /*#__PURE__*/React__default.createElement("div", {
      className: "export__file"
    }, /*#__PURE__*/React__default.createElement(reactFontawesome.FontAwesomeIcon, {
      icon: freeSolidSvgIcons.faFileCsv,
      className: "temp"
    }))), /*#__PURE__*/React__default.createElement("div", {
      className: "exportWarning"
    }, /*#__PURE__*/React__default.createElement("span", {
      style: {
        display: this.state.clickTag
      },
      className: "alert alert-danger"
    }, "You have not selected", " ", /*#__PURE__*/React__default.createElement("strong", null, this.state.warning)))), /*#__PURE__*/React__default.createElement("div", {
      className: "export__footer"
    }, /*#__PURE__*/React__default.createElement("div", {
      className: "export__btns"
    }, /*#__PURE__*/React__default.createElement("button", {
      type: "button",
      className: "btns",
      onClick: function onClick() {
        return _this2.props.closeExport();
      }
    }, "Cancel"), /*#__PURE__*/React__default.createElement("button", {
      type: "button",
      className: "btns btns__save",
      onClick: function onClick() {
        _this2.exportValidation();
      }
    }, "Export"))))));
  };

  return ExportData;
}(React__default.Component);

ExportData.propTypes = {
  columnsList: PropTypes.any,
  closeExport: PropTypes.any,
  rows: PropTypes.any
};

var DropDownEditor = reactDataGridAddons.Editors.DropDownEditor;
var selectors = reactDataGridAddons.Data.Selectors;
var swapList = [];
var swapSortList = [];
var AutoCompleteFilter = reactDataGridAddons.Filters.AutoCompleteFilter,
    NumericFilter = reactDataGridAddons.Filters.NumericFilter;

var Spreadsheet = /*#__PURE__*/function (_Component) {
  _inheritsLoose(Spreadsheet, _Component);

  function Spreadsheet(props) {
    var _this;

    _this = _Component.call(this, props) || this;

    _this.handleTableSortSwap = function (reorderedSwap) {
      swapSortList = reorderedSwap;
    };

    _this.updateTableAsPerRowChooser = function (inComingColumnsHeaderList, pinnedColumnsList) {
      var existingColumnsHeaderList = _this.props.columns;
      existingColumnsHeaderList = existingColumnsHeaderList.filter(function (item) {
        return inComingColumnsHeaderList.includes(item.name);
      });
      var rePositionedArray = existingColumnsHeaderList;
      var singleHeaderOneList;

      if (pinnedColumnsList.length > 0) {
        pinnedColumnsList.slice(0).reverse().forEach(function (item, index) {
          singleHeaderOneList = existingColumnsHeaderList.filter(function (subItem) {
            return item === subItem.name;
          });
          rePositionedArray = _this.arrayMove(existingColumnsHeaderList, existingColumnsHeaderList.indexOf(singleHeaderOneList[0]), index);
        });
      }

      if (swapList.length > 0) {
        swapList.slice(0).forEach(function (item, index) {
          singleHeaderOneList = existingColumnsHeaderList.filter(function (subItem) {
            return item === subItem.name;
          });
          rePositionedArray = _this.arrayMove(existingColumnsHeaderList, existingColumnsHeaderList.indexOf(singleHeaderOneList[0]), index);
        });
      }

      existingColumnsHeaderList = rePositionedArray;
      existingColumnsHeaderList.forEach(function (headerItem, index) {
        if (headerItem.frozen !== undefined && headerItem.frozen === true) {
          existingColumnsHeaderList[index].frozen = false;
        }

        if (pinnedColumnsList.includes(headerItem.name)) {
          existingColumnsHeaderList[index].frozen = true;
        }
      });

      var toTop = function toTop(key, value) {
        return function (a, b) {
          return (b[key] === value) - (a[key] === value);
        };
      };

      existingColumnsHeaderList.sort(toTop("frozen", true));

      _this.setState({
        columns: existingColumnsHeaderList
      });

      var tempList = [];
      existingColumnsHeaderList.forEach(function (item) {
        tempList.push(item.name);
      });

      if (swapList.length > 0) {
        for (var i = 0; i < tempList.length; i++) {
          if (tempList[i] === swapList[i]) _this.setState({
              pinnedReorder: true
            });
        }
      }

      _this.closeColumnReOrdering();

      swapList = [];

      _this.setState({
        pinnedReorder: false
      });
    };

    _this.arrayMove = function (arr, oldIndex, newIndex) {
      if (newIndex >= arr.length) {
        var k = newIndex - arr.length + 1;

        while (k--) {
          arr.push(undefined);
        }
      }

      arr.splice(newIndex, 0, arr.splice(oldIndex, 1)[0]);
      return arr;
    };

    _this.columnReorderingPannel = function () {
      _this.setState({
        selectedIndexes: []
      });

      var headerNameList = [];
      var existingPinnedHeadersList = [];

      _this.state.columns.filter(function (item) {
        return item.frozen !== undefined && item.frozen === true;
      }).map(function (item) {
        return existingPinnedHeadersList.push(item.name);
      });

      _this.state.columns.map(function (item) {
        return headerNameList.push(item.name);
      });

      _this.setState({
        columnReorderingComponent: /*#__PURE__*/React__default.createElement(ColumnReordering, _extends({
          maxLeftPinnedColumn: _this.props.maxLeftPinnedColumn,
          updateTableAsPerRowChooser: _this.updateTableAsPerRowChooser,
          headerKeys: headerNameList,
          closeColumnReOrdering: _this.closeColumnReOrdering,
          existingPinnedHeadersList: existingPinnedHeadersList,
          handleheaderNameList: _this.handleheaderNameList
        }, _this.props))
      });
    };

    _this.closeColumnReOrdering = function () {
      _this.setState({
        columnReorderingComponent: null
      });
    };

    _this.handleSearchValue = function (value) {
      _this.setState({
        searchValue: value
      });
    };

    _this.clearSearchValue = function () {
      _this.setState({
        searchValue: ""
      });

      _this.setState({
        filteringRows: _this.state.filteringRows
      });
    };

    _this.sortingPanel = function () {
      _this.setState({
        selectedIndexes: []
      });

      var columnField = [];

      _this.state.columns.map(function (item) {
        return columnField.push(item.name);
      });

      _this.setState({
        sortingPanelComponent: /*#__PURE__*/React__default.createElement(App, {
          setTableAsPerSortingParams: function setTableAsPerSortingParams(args) {
            return _this.setTableAsPerSortingParams(args);
          },
          sortingParamsObjectList: _this.state.sortingParamsObjectList,
          handleTableSortSwap: _this.handleTableSortSwap,
          clearAllSortingParams: _this.clearAllSortingParams,
          columnFieldValue: columnField,
          closeSorting: _this.closeSorting
        })
      });
    };

    _this.closeSorting = function () {
      _this.setState({
        sortingPanelComponent: null,
        sortingOrderSwapList: []
      });

      swapSortList = [];
    };

    _this.clearAllSortingParams = function () {
      var hasSingleSortkey = _this.state.sortDirection !== "NONE" && _this.state.sortColumn !== "";

      var dataRows = _this.getFilterResult([].concat(_this.state.dataSet));

      if (_this.state.searchValue !== "") {
        var searchKey = String(_this.state.searchValue).toLowerCase();
        dataRows = dataRows.filter(function (item) {
          return Object.values(item).toString().toLowerCase().includes(searchKey);
        });
      }

      if (hasSingleSortkey) {
        dataRows = _this.getSingleSortResult(dataRows);
      }

      _this.setState({
        rows: dataRows.slice(0, _this.state.pageIndex * _this.state.pageRowCount),
        subDataSet: dataRows
      });
    };

    _this.exportColumnData = function () {
      var exportData = _this.state.dataSet;

      if (_this.isSubset()) {
        exportData = _this.state.subDataSet;
      }

      _this.setState({
        selectedIndexes: []
      });

      _this.setState({
        exportComponent: /*#__PURE__*/React__default.createElement(ExportData, {
          rows: exportData,
          columnsList: _this.state.columns,
          closeExport: _this.closeExport
        })
      });
    };

    _this.closeExport = function () {
      _this.setState({
        exportComponent: null
      });
    };

    _this.setTableAsPerSortingParams = function (tableSortList) {
      var hasFilter = Object.keys(_this.state.junk).length > 0;
      var hasSearchKey = String(_this.state.searchValue).toLowerCase() !== "";
      var hasSingleSortkey = _this.state.sortDirection !== "NONE" && _this.state.sortColumn !== "";
      var existingRows = [].concat(_this.state.dataSet);

      if (hasFilter || hasSearchKey || hasSingleSortkey) {
        existingRows = [].concat(_this.state.subDataSet);
      }

      var sortingOrderNameList = [];
      tableSortList.forEach(function (item) {
        var nameOfItem = "";
        Object.keys(_this.state.rows[0]).forEach(function (rowItem) {
          if (rowItem.toLowerCase() === _this.toCamelCase(item.sortBy).toLowerCase()) {
            nameOfItem = rowItem;
          }
        });
        var typeOfItem = _this.state.rows[0][item.sortBy === nameOfItem];

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
        var existingSortingOrderSwapList = _this.state.sortingOrderSwapList;
        swapSortList.forEach(function (item, index) {
          var stringOfItemIndex = "" + item + index;

          if (item !== index && !existingSortingOrderSwapList.includes(stringOfItemIndex.split("").reverse().join(""))) {
            existingSortingOrderSwapList.push(stringOfItemIndex);
            sortingOrderNameList = _this.arrayMove(sortingOrderNameList, item, index);
            tableSortList = _this.arrayMove(tableSortList, item, index);
          }

          _this.setState({
            sortingOrderSwapList: existingSortingOrderSwapList
          });
        });
      }

      existingRows.sort(sortBy.apply(void 0, sortingOrderNameList));

      _this.setState({
        rows: existingRows.slice(0, _this.state.pageIndex * _this.state.pageRowCount),
        subDataSet: existingRows,
        sortingParamsObjectList: tableSortList
      });

      _this.closeSorting();
    };

    _this.groupSort = function (tableSortList, existingRows) {
      var sortingOrderNameList = [];
      tableSortList.forEach(function (item) {
        var nameOfItem = "";
        Object.keys(_this.state.rows[0]).forEach(function (rowItem) {
          if (rowItem.toLowerCase() === _this.toCamelCase(item.sortBy).toLowerCase()) {
            nameOfItem = rowItem;
          }
        });
        var typeOfItem = _this.state.rows[0][item.sortBy === nameOfItem];

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
        var existingSortingOrderSwapList = _this.state.sortingOrderSwapList;
        swapSortList.forEach(function (item, index) {
          var stringOfItemIndex = "" + item + index;

          if (item !== index && !existingSortingOrderSwapList.includes(stringOfItemIndex.split("").reverse().join(""))) {
            existingSortingOrderSwapList.push(stringOfItemIndex);
            sortingOrderNameList = _this.arrayMove(sortingOrderNameList, item, index);
            tableSortList = _this.arrayMove(tableSortList, item, index);
          }

          _this.setState({
            sortingOrderSwapList: existingSortingOrderSwapList
          });
        });
      }

      return existingRows.sort(sortBy.apply(void 0, sortingOrderNameList));
    };

    _this.toCamelCase = function (str) {
      return str.replace(/\s(.)/g, function ($1) {
        return $1.toUpperCase();
      }).replace(/\s/g, "").replace(/^(.)/, function ($1) {
        return $1.toLowerCase();
      });
    };

    _this.handleheaderNameList = function (reordered) {
      swapList = reordered;
    };

    _this.getSingleSortResult = function (data) {
      if (_this.state.sortDirection !== "NONE" && _this.state.sortColumn !== "") {
        var sortColumn = _this.state.sortColumn;
        var sortDirection = _this.state.sortDirection;

        _this.setState({
          selectedIndexes: []
        });

        var comparer = function comparer(a, b) {
          if (sortDirection === "ASC") {
            return a[sortColumn] > b[sortColumn] ? 1 : -1;
          }

          if (sortDirection === "DESC") {
            return a[sortColumn] < b[sortColumn] ? 1 : -1;
          }

          return 0;
        };

        return sortDirection === "NONE" ? data : [].concat(data).sort(comparer);
      }

      return data;
    };

    _this.sortRows = function (data, sortColumn, sortDirection) {
      _this.setState({
        selectedIndexes: []
      });

      var comparer = function comparer(a, b) {
        if (sortDirection === "ASC") {
          return a[sortColumn] > b[sortColumn] ? 1 : -1;
        }

        if (sortDirection === "DESC") {
          return a[sortColumn] < b[sortColumn] ? 1 : -1;
        }
      };

      var hasFilter = Object.keys(_this.state.junk).length > 0;
      var hasSearchKey = String(_this.state.searchValue).toLowerCase() !== "";
      var hasGropSortKeys = _this.state.sortingParamsObjectList && _this.state.sortingParamsObjectList.length > 0;
      var dtRows = [];

      if (hasFilter || hasSearchKey || hasGropSortKeys) {
        dtRows = _this.state.subDataSet;
      } else {
        dtRows = _this.state.dataSet;
      }

      var result = [].concat(dtRows).sort(comparer);

      _this.setState({
        rows: result.slice(0, _this.state.pageIndex * _this.state.pageRowCount),
        subDataSet: result,
        selectedIndexes: [],
        sortColumn: sortDirection === "NONE" ? "" : sortColumn,
        sortDirection: sortDirection
      });

      return sortDirection === "NONE" ? data : _this.state.rows;
    };

    _this.getSlicedRows = function (filters, rowsToSplit, firstResult) {
      try {
        var data = [];

        if (rowsToSplit.length > 0) {
          var chunks = [];

          while (rowsToSplit.length) {
            chunks.push(rowsToSplit.splice(0, 500));
          }

          var index = 0;
          chunks.forEach(function (arr) {
            try {
              _this.getRowsAsync(arr, filters).then(function (dt) {
                try {
                  index++;
                  data = [].concat(data, dt);

                  var _temp2 = function () {
                    if (index === chunks.length) {
                      var dtSet = [].concat(firstResult, data);

                      if (_this.state.searchValue !== "") {
                        var searchKey = String(_this.state.searchValue).toLowerCase();
                        dtSet = dtSet.filter(function (item) {
                          return Object.values(item).toString().toLowerCase().includes(searchKey);
                        });
                      }

                      dtSet = _this.getSingleSortResult(dtSet);

                      if (_this.state.sortingParamsObjectList && _this.state.sortingParamsObjectList.length > 0) {
                        dtSet = _this.groupSort(_this.state.sortingParamsObjectList, dtSet);
                      }

                      var rw = dtSet.slice(0, _this.state.pageIndex * _this.state.pageRowCount);
                      return Promise.resolve(_this.setStateAsync({
                        subDataSet: dtSet,
                        rows: rw,
                        tempRows: rw,
                        count: rw.length
                      })).then(function () {
                        if (dtSet.length === 0) {
                          _this.handleWarningStatus();
                        } else {
                          _this.closeWarningStatus(rw);
                        }
                      });
                    }
                  }();

                  return Promise.resolve(_temp2 && _temp2.then ? _temp2.then(function () {}) : void 0);
                } catch (e) {
                  return Promise.reject(e);
                }
              });

              return Promise.resolve();
            } catch (e) {
              return Promise.reject(e);
            }
          });
        }

        return Promise.resolve();
      } catch (e) {
        return Promise.reject(e);
      }
    };

    _this.getRowsAsync = function (rows, filters) {
      try {
        var filterVal = _extends({}, filters);

        if (Object.keys(filters).length <= 0) {
          filterVal = {};
        }

        selectors.getRows({
          rows: [],
          filters: {}
        });
        return Promise.resolve(selectors.getRows({
          rows: rows,
          filters: filterVal
        }));
      } catch (e) {
        return Promise.reject(e);
      }
    };

    _this.getrows = function (rows, filters) {
      var filterVal = _extends({}, filters);

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

    _this.onRowsDeselected = function (rows) {
      var rowIndexes = rows.map(function (r) {
        return r.rowIdx;
      });

      _this.setState({
        selectedIndexes: _this.state.selectedIndexes.filter(function (i) {
          return rowIndexes.indexOf(i) === -1;
        })
      });
    };

    _this.onGridRowsUpdated = function (_ref) {
      var fromRow = _ref.fromRow,
          toRow = _ref.toRow,
          updated = _ref.updated,
          action = _ref.action;
      var columnName = "";

      var filter = _this.formulaAppliedCols.filter(function (item) {
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
        _this.setState(function (state) {
          var rows = state.rows.slice();

          for (var i = fromRow; i <= toRow; i++) {
            rows[i] = _extends({}, rows[i], updated);
          }

          return {
            rows: rows
          };
        });

        _this.setState(function (state) {
          var dataSet = state.dataSet.slice();

          for (var i = fromRow; i <= toRow; i++) {
            dataSet[i] = _extends({}, dataSet[i], updated);
          }

          return {
            dataSet: dataSet
          };
        });

        _this.setState(function (state) {
          var filteringRows = state.filteringRows.slice();

          for (var i = fromRow; i <= toRow; i++) {
            filteringRows[i] = _extends({}, filteringRows[i], updated);
          }

          return {
            filteringRows: filteringRows
          };
        });

        _this.setState(function (state) {
          var tempRows = state.tempRows.slice();

          for (var i = fromRow; i <= toRow; i++) {
            tempRows[i] = _extends({}, tempRows[i], updated);
          }

          return {
            tempRows: tempRows
          };
        });
      }

      if (_this.props.updateCellData) {
        _this.props.updateCellData(_this.state.tempRows[fromRow], _this.state.tempRows[toRow], updated, action);
      }
    };

    _this.onRowsSelected = function (rows) {
      _this.setState({
        selectedIndexes: _this.state.selectedIndexes.concat(rows.map(function (r) {
          return r.rowIdx;
        }))
      });

      if (_this.props.selectBulkData) {
        _this.props.selectBulkData(rows);
      }
    };

    _this.handleFilterChange = function (value) {
      try {
        var junk = _this.state.junk;

        if (!(value.filterTerm == null) && !(value.filterTerm.length <= 0)) {
          junk[value.column.key] = value;
        } else {
          delete junk[value.column.key];
        }

        _this.setState({
          junk: junk
        });

        var hasFilter = Object.keys(junk).length > 0;

        var firstPage = _this.state.dataSet.slice(0, _this.state.pageRowCount);

        var data = _this.getrows(firstPage, _this.state.junk);

        return Promise.resolve(_this.setStateAsync({
          rows: data,
          tempRows: data,
          count: data.length,
          subDataSet: hasFilter ? data : [],
          pageIndex: hasFilter ? _this.state.pageIndex : 1
        })).then(function () {
          function _temp4() {
            if (data.length === 0) {
              _this.handleWarningStatus();
            } else {
              _this.closeWarningStatus(data);
            }
          }

          var _temp3 = function () {
            if (hasFilter) {
              var rowsRemaining = _this.state.dataSet.slice(_this.state.pageRowCount, _this.state.dataSet.length);

              _this.getSlicedRows(_this.state.junk, rowsRemaining, data);
            } else {
              var _rowsRemaining = _this.state.dataSet;

              if (_this.state.searchValue !== "") {
                var searchKey = String(_this.state.searchValue).toLowerCase();
                _rowsRemaining = _rowsRemaining.filter(function (item) {
                  return Object.values(item).toString().toLowerCase().includes(searchKey);
                });
              }

              _rowsRemaining = _this.getSingleSortResult(_rowsRemaining);

              if (_this.state.sortingParamsObjectList && _this.state.sortingParamsObjectList.length > 0) {
                _rowsRemaining = _this.groupSort(_this.state.sortingParamsObjectList, _rowsRemaining);
              }

              var rw = _rowsRemaining.slice(0, _this.state.pageIndex * _this.state.pageRowCount);

              return Promise.resolve(_this.setStateAsync({
                subDataSet: _rowsRemaining,
                rows: rw,
                tempRows: rw,
                count: rw.length
              })).then(function () {
                data = rw;
              });
            }
          }();

          return _temp3 && _temp3.then ? _temp3.then(_temp4) : _temp4(_temp3);
        });
      } catch (e) {
        return Promise.reject(e);
      }
    };

    _this.isAtBottom = function (event) {
      var target = event.target;
      var isbtm = target.clientHeight + target.scrollTop >= target.scrollHeight - 10;
      return isbtm;
    };

    _this.loadMoreRows = function (from, newRowsCount) {
      return new Promise(function (resolve) {
        var to = from + newRowsCount;

        if (_this.isSubset() && _this.state.subDataSet.length > 0) {
          to = to < _this.state.subDataSet.length ? to : _this.state.subDataSet.length;
          resolve(_this.state.subDataSet.slice(from, to));
        } else {
          resolve(_this.state.dataSet.slice(from, to));
        }
      });
    };

    _this.handleScroll = function (event) {
      try {
        if (!_this.isAtBottom(event)) return Promise.resolve();
        return Promise.resolve(_this.loadMoreRows(_this.state.pageIndex * _this.state.pageRowCount, _this.state.pageRowCount)).then(function (newRows) {
          if (newRows && newRows.length > 0) {
            var length = 0;

            _this.setState(function (prev) {
              length = prev.rows.length + newRows.length;
            });

            _this.setState({
              rows: [].concat(_this.state.rows, newRows),
              count: length,
              pageIndex: _this.state.pageIndex + 1
            });
          }
        });
      } catch (e) {
        return Promise.reject(e);
      }
    };

    _this.globalSearchLogic = function (e, updatedRows) {
      var searchKey = String(e.target.value).toLowerCase();
      var filteredRows = updatedRows.filter(function (item) {
        return Object.values(item).toString().toLowerCase().includes(searchKey);
      });

      if (!filteredRows.length) {
        _this.setState({
          warningStatus: "invalid",
          rows: [],
          count: 0
        });
      } else {
        var rowSlice = filteredRows.slice(0, _this.state.pageIndex * _this.state.pageRowCount);

        _this.setState({
          warningStatus: "",
          rows: rowSlice,
          subDataSet: filteredRows,
          count: rowSlice.length
        });
      }
    };

    _this.handleWarningStatus = function () {
      _this.setState({
        warningStatus: "invalid"
      });
    };

    _this.closeWarningStatus = function (val) {
      var rVal = val;

      if (!rVal) {
        var hasSingleSortkey = _this.state.sortDirection !== "NONE" && _this.state.sortColumn !== "";
        var hasGropSortKeys = _this.state.sortingParamsObjectList && _this.state.sortingParamsObjectList.length > 0;

        var dataRows = _this.getFilterResult([].concat(_this.state.dataSet));

        if (hasSingleSortkey) {
          dataRows = _this.getSingleSortResult(dataRows);
        }

        if (hasGropSortKeys) {
          dataRows = _this.groupSort(_this.state.sortingParamsObjectList, dataRows);
        }

        rVal = dataRows.slice(0, _this.state.pageIndex * _this.state.pageRowCount);
      }

      _this.setState({
        warningStatus: "",
        rows: rVal,
        count: rVal.length
      });
    };

    _this.save = function () {
      _this.props.saveRows(_this.state.dataSet);
    };

    _this.clearAllFilters = function () {
      var hasSingleSortkey = _this.state.sortDirection !== "NONE" && _this.state.sortColumn !== "";
      var hasGropSortKeys = _this.state.sortingParamsObjectList && _this.state.sortingParamsObjectList.length > 0;

      var dtSet = _this.getSearchResult(_this.state.dataSet);

      if (hasSingleSortkey) {
        dtSet = _this.getSingleSortResult(dtSet);
      }

      if (hasGropSortKeys) {
        dtSet = _this.groupSort(_this.state.sortingParamsObjectList, dtSet);
      }

      var rVal = dtSet.slice(0, _this.state.pageIndex * _this.state.pageRowCount);

      _this.setState({
        rows: rVal,
        count: rVal.length,
        subDataSet: dtSet
      });
    };

    _this.getSearchResult = function (data) {
      var dtSet = data;
      var searchKey = String(_this.state.searchValue).toLowerCase();

      if (searchKey !== "") {
        dtSet = dtSet.filter(function (item) {
          return Object.values(item).toString().toLowerCase().includes(searchKey);
        });
      }

      return dtSet;
    };

    _this.getFilterResult = function (data) {
      var dataRows = [];

      if (Object.keys(_this.state.junk).length > 0) {
        var rowsToSplit = [].concat(data);
        var chunks = [];

        while (rowsToSplit.length) {
          chunks.push(rowsToSplit.splice(0, 500));
        }

        chunks.forEach(function (arr) {
          var dt = _this.getrows(arr, _this.state.junk);

          dataRows = [].concat(dataRows, dt);
        });
      } else {
        dataRows = [].concat(data);
      }

      return dataRows;
    };
    var _this$props = _this.props,
        _dataSet = _this$props.dataSet,
        pageSize = _this$props.pageSize;
    var dataSetVar = JSON.parse(JSON.stringify(_dataSet));
    _this.state = {
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
      filteringRows: _this.props.rows,
      tempRows: _this.props.rows,
      sortingPanelComponent: null,
      count: _this.props.rows.length,
      sortingOrderSwapList: [],
      sortingParamsObjectList: [],
      pinnedReorder: false,
      columns: _this.props.columns.map(function (item) {
        var colItem = item;

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
    _this.handleSearchValue = _this.handleSearchValue.bind(_assertThisInitialized(_this));
    _this.clearSearchValue = _this.clearSearchValue.bind(_assertThisInitialized(_this));
    _this.handleFilterChange = _this.handleFilterChange.bind(_assertThisInitialized(_this));
    _this.formulaAppliedCols = _this.props.columns.filter(function (item) {
      return item.formulaApplicable;
    });
    return _this;
  }

  var _proto = Spreadsheet.prototype;

  _proto.UNSAFE_componentWillReceiveProps = function UNSAFE_componentWillReceiveProps(props) {
    this.setState({
      rows: props.rows,
      count: props.count,
      warningStatus: props.status
    });
  };

  _proto.setStateAsync = function setStateAsync(stateObj) {
    var _this2 = this;

    return new Promise(function (resolve) {
      _this2.setState(stateObj, resolve);
    });
  };

  _proto.getValidFilterValues = function getValidFilterValues(rows, columnId) {
    this.setState({
      selectedIndexes: []
    });
    return rows.map(function (r) {
      return r[columnId];
    }).filter(function (item, i, a) {
      return i === a.indexOf(item);
    });
  };

  _proto.componentDidUpdate = function componentDidUpdate() {
    var resizeEvent = document.createEvent("HTMLEvents");
    resizeEvent.initEvent("resize", true, false);
    window.dispatchEvent(resizeEvent);
  };

  _proto.getSearchRecords = function getSearchRecords(e) {
    var searchKey = String(e.target.value).toLowerCase();
    var hasFilter = Object.keys(this.state.junk).length > 0;
    var hasSingleSortkey = this.state.sortDirection !== "NONE" && this.state.sortColumn !== "";
    var hasGropSortKeys = this.state.sortingParamsObjectList && this.state.sortingParamsObjectList.length > 0;
    var rowsToSearch = [];

    if (this.state.searchValue.startsWith(searchKey) || searchKey === "") {
      rowsToSearch = this.getFilterResult([].concat(this.state.dataSet));

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
  };

  _proto.isSubset = function isSubset() {
    if (Object.keys(this.state.junk).length > 0 || this.state.sortDirection !== "NONE" || this.state.searchValue !== "" || this.state.sortingParamsObjectList && this.state.sortingParamsObjectList.length > 0) {
      return true;
    }

    return false;
  };

  _proto.render = function render() {
    var _this3 = this;

    return /*#__PURE__*/React__default.createElement("div", {
      onScroll: this.handleScroll
    }, /*#__PURE__*/React__default.createElement("div", {
      className: "parentDiv"
    }, /*#__PURE__*/React__default.createElement("div", {
      className: "totalCount"
    }, "Showing ", /*#__PURE__*/React__default.createElement("strong", null, " ", this.state.count, " "), " records"), /*#__PURE__*/React__default.createElement("div", {
      className: "globalSearch"
    }, /*#__PURE__*/React__default.createElement("i", {
      className: "fa fa-search"
    }), /*#__PURE__*/React__default.createElement(reactBootstrap.FormControl, {
      className: "globalSeachInput",
      type: "text",
      placeholder: "Search",
      onChange: function onChange(e) {
        _this3.handleSearchValue(e.target.value);

        var srchRows = _this3.getSearchRecords(e);

        _this3.globalSearchLogic(e, srchRows);
      },
      value: this.state.searchValue
    })), /*#__PURE__*/React__default.createElement("div", {
      className: "filterIcons",
      onClick: this.save
    }, /*#__PURE__*/React__default.createElement(reactFontawesome.FontAwesomeIcon, {
      title: "Group Sort",
      icon: freeSolidSvgIcons.faSave
    })), /*#__PURE__*/React__default.createElement("div", {
      className: "filterIcons",
      onClick: this.sortingPanel
    }, /*#__PURE__*/React__default.createElement(reactFontawesome.FontAwesomeIcon, {
      title: "Group Sort",
      icon: freeSolidSvgIcons.faSortAmountDown
    }), /*#__PURE__*/React__default.createElement(reactFontawesome.FontAwesomeIcon, {
      icon: freeSolidSvgIcons.faSortDown,
      className: "filterArrow"
    })), this.state.sortingPanelComponent, /*#__PURE__*/React__default.createElement("div", {
      className: "filterIcons",
      onClick: this.columnReorderingPannel
    }, /*#__PURE__*/React__default.createElement(reactFontawesome.FontAwesomeIcon, {
      title: "Column Chooser",
      icon: freeSolidSvgIcons.faColumns
    }), /*#__PURE__*/React__default.createElement(reactFontawesome.FontAwesomeIcon, {
      icon: freeSolidSvgIcons.faSortDown,
      className: "filterArrow"
    })), this.state.columnReorderingComponent, /*#__PURE__*/React__default.createElement("div", {
      className: "filterIcons"
    }, /*#__PURE__*/React__default.createElement(reactFontawesome.FontAwesomeIcon, {
      title: "Export",
      icon: freeSolidSvgIcons.faShareAlt,
      onClick: this.exportColumnData
    })), this.state.exportComponent), /*#__PURE__*/React__default.createElement(ErrorMessage, {
      className: "errorDiv",
      status: this.state.warningStatus,
      closeWarningStatus: function closeWarningStatus() {
        _this3.closeWarningStatus();
      },
      clearSearchValue: this.clearSearchValue
    }), /*#__PURE__*/React__default.createElement(ExtDataGrid, {
      toolbar: /*#__PURE__*/React__default.createElement(reactDataGridAddons.Toolbar, {
        enableFilter: true
      }),
      getValidFilterValues: function getValidFilterValues(columnKey) {
        return _this3.getValidFilterValues(_this3.state.filteringRows, columnKey);
      },
      minHeight: this.state.height,
      columns: this.state.columns,
      rowGetter: function rowGetter(i) {
        return _this3.state.rows[i];
      },
      rowsCount: this.state.rows.length,
      onGridRowsUpdated: this.onGridRowsUpdated,
      enableCellSelect: true,
      onClearFilters: function onClearFilters() {
        _this3.setState({
          junk: {}
        });

        _this3.clearAllFilters();
      },
      onColumnResize: function onColumnResize(idx, width) {
        return console.log("Column " + idx + " has been resized to " + width);
      },
      onAddFilter: function onAddFilter(filter) {
        return _this3.handleFilterChange(filter);
      },
      rowSelection: {
        showCheckbox: true,
        enableShiftSelect: true,
        onRowsSelected: this.onRowsSelected,
        onRowsDeselected: this.onRowsDeselected,
        selectBy: {
          indexes: this.state.selectedIndexes
        }
      },
      onGridSort: function onGridSort(sortColumn, sortDirection) {
        return _this3.sortRows(_this3.state.filteringRows, sortColumn, sortDirection);
      },
      globalSearch: this.globalSearchLogic,
      handleWarningStatus: this.handleWarningStatus,
      closeWarningStatus: this.closeWarningStatus
    }));
  };

  return Spreadsheet;
}(React.Component);

var sortBy;

(function () {
  var defaultCmp = function defaultCmp(a, b) {
    if (a === b) return 0;
    return a < b ? -1 : 1;
  };

  var getCmpFunc = function getCmpFunc(primer, reverse) {
    var cmp = defaultCmp;

    if (primer) {
      cmp = function cmp(a, b) {
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

  sortBy = function sortBy() {
    var fields = [];
    var nFields = arguments.length;
    var field;
    var name;
    var cmp;

    for (var i = 0; i < nFields; i++) {
      field = arguments[i];

      if (typeof field === "string") {
        name = field;
        cmp = defaultCmp;
      } else {
        name = field.name;
        cmp = getCmpFunc(field.primer, field.reverse);
      }

      fields.push({
        name: name,
        cmp: cmp
      });
    }

    return function (A, B) {
      var result;

      for (var _i = 0, l = nFields; _i < l; _i++) {
        result = 0;
        field = fields[_i];
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

module.exports = Spreadsheet;
//# sourceMappingURL=index.js.map
