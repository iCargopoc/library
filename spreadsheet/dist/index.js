function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = require('react');
var React__default = _interopDefault(React);
var reactDataGridAddons = require('react-data-grid-addons');
var PropTypes = _interopDefault(require('prop-types'));
var ReactDataGrid = _interopDefault(require('react-data-grid'));
var reactDnd = require('react-dnd');
var reactDndHtml5Backend = require('react-dnd-html5-backend');
var reactDndTouchBackend = require('react-dnd-touch-backend');
var MultiBackend = require('react-dnd-multi-backend');
var MultiBackend__default = _interopDefault(MultiBackend);
var ClickAwayListener = _interopDefault(require('react-click-away-listener'));
var update = _interopDefault(require('immutability-helper'));
var JsPdf = _interopDefault(require('jspdf'));
require('jspdf-autotable');
var XLSX = require('xlsx');
require('!style-loader!css-loader!sass-loader!./Styles/main.scss');

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

var _ref = /*#__PURE__*/React.createElement("path", {
  d: "M13.67 10.465c.22.22.33.487.33.801 0 .314-.11.581-.33.801l-1.603 1.603c-.22.22-.487.33-.801.33-.314 0-.581-.11-.801-.33L7 10.205 3.535 13.67c-.22.22-.487.33-.801.33-.314 0-.581-.11-.801-.33L.33 12.067c-.22-.22-.33-.487-.33-.801 0-.314.11-.581.33-.801L3.795 7 .33 3.535C.11 3.315 0 3.048 0 2.734c0-.314.11-.581.33-.801L1.933.33c.22-.22.487-.33.801-.33.314 0 .581.11.801.33L7 3.795 10.465.33c.22-.22.487-.33.801-.33.314 0 .581.11.801.33l1.603 1.603c.22.22.33.487.33.801 0 .314-.11.581-.33.801L10.205 7l3.465 3.465z",
  fill: "#3c476f",
  fillOpacity: 0.71
});

function SvgIconClose(props) {
  return /*#__PURE__*/React.createElement("svg", _extends$1({
    width: 14,
    height: 14
  }, props), _ref);
}

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
      role: "presentation",
      className: "notification-close",
      onClick: function onClick() {
        props.closeWarningStatus();
        props.clearSearchValue();
      }
    }, /*#__PURE__*/React__default.createElement("i", null, /*#__PURE__*/React__default.createElement(SvgIconClose, null))));
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
    "data-testid": "columnItem",
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

var _ref$1 = /*#__PURE__*/React.createElement("path", {
  d: "M9.876 7.334A.45.45 0 0110 7.65v.9a.45.45 0 01-.124.316.386.386 0 01-.293.134H.417a.386.386 0 01-.293-.134A.45.45 0 010 8.55v-.9a.45.45 0 01.124-.316.386.386 0 01.293-.134h9.166c.113 0 .21.045.293.134zm0-3.6A.45.45 0 0110 4.05v.9a.45.45 0 01-.124.316.386.386 0 01-.293.134H.417a.386.386 0 01-.293-.134A.45.45 0 010 4.95v-.9a.45.45 0 01.124-.316.386.386 0 01.293-.134h9.166c.113 0 .21.045.293.134zm0-3.6A.45.45 0 0110 .45v.9a.45.45 0 01-.124.316.386.386 0 01-.293.134H.417a.386.386 0 01-.293-.134A.45.45 0 010 1.35v-.9A.45.45 0 01.124.134.386.386 0 01.417 0h9.166c.113 0 .21.045.293.134z",
  fill: "#1a4769",
  fillOpacity: 0.498
});

function SvgIconAlignJustify(props) {
  return /*#__PURE__*/React.createElement("svg", _extends$2({
    width: 10,
    height: 9
  }, props), _ref$1);
}

var HTML5toTouch = {
  backends: [{
    backend: reactDndHtml5Backend.HTML5Backend
  }, {
    backend: reactDndTouchBackend.TouchBackend,
    options: {
      enableMouseEvents: true
    },
    preview: true,
    transition: MultiBackend.TouchTransition
  }]
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

      if (isExistingAllSelect) {
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
            id: "checkBoxToPinLeft_" + item,
            checked: _this.state.leftPinnedColumList.includes(item),
            disabled: _this.state.maxLeftPinnedColumn - _this.state.leftPinnedColumList.length <= 0 ? !_this.state.leftPinnedColumList.includes(item) : false,
            onChange: function onChange() {
              return _this.reArrangeLeftPinnedColumn(item);
            }
          })), /*#__PURE__*/React__default.createElement("div", {
            className: "column__txt"
          }, "Pin Left"))))
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
    _this.handleClick = _this.handleClick.bind(_assertThisInitialized(_this));
    return _this;
  }

  var _proto = ColumnReordering.prototype;

  _proto.handleClick = function handleClick() {
    this.props.closeColumnReOrdering();
  };

  _proto.render = function render() {
    var _this2 = this;

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
        "data-testid": "addToColumnReorderEntityList",
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
    }, /*#__PURE__*/React__default.createElement("strong", null, "Column Settings")), /*#__PURE__*/React__default.createElement("div", {
      role: "presentation",
      "data-testid": "closeColumnReordering",
      className: "column__close",
      onClick: function onClick() {
        return _this2.props.closeColumnReOrdering();
      }
    }, /*#__PURE__*/React__default.createElement("i", null, /*#__PURE__*/React__default.createElement(SvgIconClose, null)))), /*#__PURE__*/React__default.createElement("div", {
      className: "column__body"
    }, /*#__PURE__*/React__default.createElement("div", {
      className: "column__info"
    }, /*#__PURE__*/React__default.createElement("strong", null, "\xA0 \xA0 Selected Column Count :", " ", this.state.columnReorderEntityList.length), this.state.maxLeftPinnedColumn - this.state.leftPinnedColumList.length > 0 ? /*#__PURE__*/React__default.createElement("strong", null, "\xA0 \xA0 Left Pinned Column Count Remaining :", " ", this.state.maxLeftPinnedColumn - this.state.leftPinnedColumList.length) : /*#__PURE__*/React__default.createElement("strong", {
      style: {
        color: "red"
      }
    }, "\xA0 \xA0 Maximum Count Of Left Pin Columns REACHED")), /*#__PURE__*/React__default.createElement(reactDnd.DndProvider, {
      backend: MultiBackend__default,
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
      onClick: function onClick() {
        return _this2.resetColumnReorderList();
      }
    }, "Reset"), /*#__PURE__*/React__default.createElement("button", {
      "data-testid": "cancelButton",
      type: "button",
      className: "btns",
      onClick: function onClick() {
        return _this2.props.closeColumnReOrdering();
      }
    }, "Cancel"), /*#__PURE__*/React__default.createElement("button", {
      "data-testid": "saveButton",
      type: "button",
      className: "btns btns__save",
      onClick: function onClick() {
        return _this2.props.updateTableAsPerRowChooser(_this2.state.columnReorderEntityList, _this2.state.leftPinnedColumList);
      }
    }, "Save")))))));
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
    "data-testid": "sortingItem",
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

var _ref$2 = /*#__PURE__*/React.createElement("path", {
  d: "M12.84 8.963c.106.11.16.238.16.387v1.1a.533.533 0 01-.16.387.517.517 0 01-.382.163H.542a.517.517 0 01-.381-.163A.533.533 0 010 10.45v-1.1c0-.149.054-.278.16-.387A.517.517 0 01.543 8.8h11.916c.147 0 .274.054.381.163zm0-4.4c.106.11.16.238.16.387v1.1a.533.533 0 01-.16.387.517.517 0 01-.382.163H.542a.517.517 0 01-.381-.163A.533.533 0 010 6.05v-1.1c0-.149.054-.278.16-.387A.517.517 0 01.543 4.4h11.916c.147 0 .274.054.381.163zm0-4.4c.106.11.16.238.16.387v1.1a.533.533 0 01-.16.387.517.517 0 01-.382.163H.542a.517.517 0 01-.381-.163A.533.533 0 010 1.65V.55C0 .401.054.272.16.163A.517.517 0 01.543 0h11.916c.147 0 .274.054.381.163z",
  fillOpacity: 0.11
});

function SvgIconNav(props) {
  return /*#__PURE__*/React.createElement("svg", _extends$3({
    width: 13,
    height: 11
  }, props), _ref$2);
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

var _ref$3 = /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("linearGradient", {
  gradientUnits: "userSpaceOnUse",
  x1: 442.5,
  y1: 6,
  x2: 442.5,
  y2: 22,
  id: "SortCopy_svg__a"
}, /*#__PURE__*/React.createElement("stop", {
  stopColor: "#246290",
  stopOpacity: 0.6,
  offset: 0
}), /*#__PURE__*/React.createElement("stop", {
  stopColor: "#f2f2f2",
  offset: 0
}), /*#__PURE__*/React.createElement("stop", {
  stopColor: "#e4e4e4",
  offset: 1
}), /*#__PURE__*/React.createElement("stop", {
  stopColor: "#fff",
  offset: 1
})));

var _ref2 = /*#__PURE__*/React.createElement("path", {
  d: "M439.6 21h8.4v-8.8L442.8 7H437v11.4h1.3v1.3h1.3V21z",
  fill: "url(#SortCopy_svg__a)",
  transform: "translate(-436 -6)"
});

var _ref3 = /*#__PURE__*/React.createElement("path", {
  d: "M3.1 15.5h9.4V5.7L7.3.5H.5v12.4h1.3v1.3h1.3v1.3z",
  stroke: "#1a4769",
  fill: "none",
  strokeOpacity: 0.6
});

var _ref4 = /*#__PURE__*/React.createElement("path", {
  d: "M9.9 4.4l1.3.5v9.3H3.6M7.3 1v2.1h2.6v9.8H2.3M12 5.7h-.8",
  stroke: "#1a4769",
  fill: "none",
  strokeOpacity: 0.6
});

function SvgSortCopy(props) {
  return /*#__PURE__*/React.createElement("svg", _extends$4({
    width: 13,
    height: 16
  }, props), _ref$3, _ref2, _ref3, _ref4);
}

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

var _ref$4 = /*#__PURE__*/React.createElement("path", {
  d: "M5.359 6.094a.32.32 0 01.096.24v6a.32.32 0 01-.096.239.336.336 0 01-.245.094h-.682a.336.336 0 01-.245-.094.32.32 0 01-.096-.24v-6a.32.32 0 01.096-.24A.336.336 0 014.432 6h.682c.1 0 .18.031.245.094zm2.727 0a.32.32 0 01.096.24v6a.32.32 0 01-.096.239.336.336 0 01-.245.094h-.682a.336.336 0 01-.245-.094.32.32 0 01-.096-.24v-6a.32.32 0 01.096-.24A.336.336 0 017.16 6h.682c.1 0 .181.031.245.094zm2.727 0a.32.32 0 01.096.24v6a.32.32 0 01-.096.239.336.336 0 01-.245.094h-.682a.336.336 0 01-.245-.094.32.32 0 01-.096-.24v-6a.32.32 0 01.096-.24A.336.336 0 019.886 6h.682c.1 0 .181.031.245.094zm1.385 8.203c.05-.129.075-.27.075-.422V4H2.727v9.875a1.16 1.16 0 00.23.703c.053.06.09.089.111.089h8.864c.021 0 .058-.03.112-.089a.928.928 0 00.154-.281zM5.636 1.447l-.522 1.22h4.772l-.511-1.22a.301.301 0 00-.181-.114H5.817a.301.301 0 00-.181.115zm9.268 1.313A.32.32 0 0115 3v.667a.32.32 0 01-.096.24.336.336 0 01-.245.093h-1.023v9.875c0 .576-.167 1.075-.5 1.495-.334.42-.735.63-1.204.63H3.068c-.469 0-.87-.203-1.204-.61-.333-.406-.5-.897-.5-1.473V4H.34a.336.336 0 01-.245-.094.32.32 0 01-.096-.24V3a.32.32 0 01.096-.24.336.336 0 01.245-.093h3.292l.746-1.74c.106-.257.298-.476.575-.656C5.23.09 5.51 0 5.795 0h3.41c.284 0 .564.09.841.27.277.181.469.4.575.657l.746 1.74h3.292c.1 0 .181.03.245.093z",
  fill: "#1a4769",
  fillOpacity: 0.6
});

function SvgSortDelete(props) {
  return /*#__PURE__*/React.createElement("svg", _extends$5({
    width: 15,
    height: 16
  }, props), _ref$4);
}

var HTML5toTouch$1 = {
  backends: [{
    backend: reactDndHtml5Backend.HTML5Backend
  }, {
    backend: reactDndTouchBackend.TouchBackend,
    options: {
      enableMouseEvents: true
    },
    preview: true,
    transition: MultiBackend.TouchTransition
  }]
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
            "data-testid": "selectingValue",
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
            "data-testid": "selectOrder",
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
            "data-testid": "copySort",
            role: "presentation",
            className: "sort__icon",
            onClick: function onClick() {
              return _this.copy(index);
            }
          }, /*#__PURE__*/React__default.createElement(SvgSortCopy, null))), /*#__PURE__*/React__default.createElement("div", {
            className: "sort__reorder"
          }, /*#__PURE__*/React__default.createElement("div", {
            className: ""
          }, /*#__PURE__*/React__default.createElement("div", null, "\xA0")), /*#__PURE__*/React__default.createElement("div", {
            "data-testid": "removeSort",
            role: "presentation",
            className: "sort__icon",
            onClick: function onClick() {
              return _this.remove(index);
            }
          }, /*#__PURE__*/React__default.createElement(SvgSortDelete, null))))
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
    _this.handleClick = _this.handleClick.bind(_assertThisInitialized(_this));
    return _this;
  }

  var _proto = App.prototype;

  _proto.handleClick = function handleClick() {
    this.props.closeSorting();
  };

  _proto.render = function render() {
    var _this2 = this;

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
      onClick: function onClick() {
        return _this2.props.closeSorting();
      }
    }, /*#__PURE__*/React__default.createElement(SvgIconClose, null)))), /*#__PURE__*/React__default.createElement("div", {
      className: "neo-popover__content"
    }, /*#__PURE__*/React__default.createElement(reactDnd.DndProvider, {
      backend: MultiBackend__default,
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
      onClick: function onClick() {
        return _this2.add();
      },
      onKeyDown: function onKeyDown() {
        return _this2.add();
      }
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

var _ref$5 = /*#__PURE__*/React.createElement("path", {
  d: "M17.31 1.025l4.672 4.7c.28.282.519.663.719 1.146.2.482.299.924.299 1.325v17.358a1.4 1.4 0 01-.42 1.024c-.279.281-.618.422-1.017.422H1.438c-.4 0-.74-.14-1.019-.422A1.4 1.4 0 010 25.554V1.446C0 1.045.14.703.42.422.698.14 1.037 0 1.437 0h13.416c.4 0 .839.1 1.318.301.479.201.858.442 1.138.724zM15.947 2.38c-.12-.121-.324-.231-.614-.332v5.665h5.63c-.1-.291-.21-.497-.329-.617L15.947 2.38zM2 25h19V9.643h-6.146c-.4 0-.739-.14-1.018-.422a1.4 1.4 0 01-.42-1.025V2H2v23zm3.75-11.982v-.964a.47.47 0 01.135-.347c.09-.09.204-.136.344.293h10.542c.14-.429.254-.383.344-.293a.47.47 0 01.135.347v.964a.47.47 0 01-.135.346c-.09.09-.204.136-.344-.364H6.229c-.14.5-.254.455-.344.364a.47.47 0 01-.135-.346zM6.23 15h10.54c.14.429.255.474.345.564a.47.47 0 01.135.347v.964a.47.47 0 01-.135.347c-.09.09-.204.135-.344-.222H6.229c-.14.357-.254.312-.344.222a.47.47 0 01-.135-.347v-.964a.47.47 0 01.135-.347c.09-.09.204-.135.344-.564zm0 4h10.54c.14.286.255.33.345.421a.47.47 0 01.135.347v.964a.47.47 0 01-.135.347c-.09.09-.204.135-.344-.079H6.229c-.14.214-.254.17-.344.079a.47.47 0 01-.135-.347v-.964a.47.47 0 01.135-.347c.09-.09.204-.135.344-.421z",
  fill: "#1a4869"
});

function SvgIconCsv(props) {
  return /*#__PURE__*/React.createElement("svg", _extends$6({
    width: 23,
    height: 27
  }, props), _ref$5);
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

var _ref$6 = /*#__PURE__*/React.createElement("path", {
  d: "M17.31 1.025l4.672 4.7c.28.282.519.663.719 1.146.2.482.299.924.299 1.325v17.358a1.4 1.4 0 01-.42 1.024c-.279.281-.618.422-1.017.422H1.438c-.4 0-.74-.14-1.019-.422A1.4 1.4 0 010 25.554V1.446C0 1.045.14.703.42.422.698.14 1.037 0 1.437 0h13.416c.4 0 .839.1 1.318.301.479.201.858.442 1.138.724zM15.947 2.38c-.12-.121-.324-.231-.614-.332v5.665h5.63c-.1-.291-.21-.497-.329-.617L15.947 2.38zM2 25h19V9.643h-6.146c-.4 0-.739-.14-1.018-.422a1.4 1.4 0 01-.42-1.025V2H2v23zm5.442-3.454H6.424v1.597h4.208v-1.597H9.508l1.543-2.426c.05-.07.1-.153.15-.249.05-.095.087-.163.112-.203.025-.04.042-.06.052-.06h.03c.01.04.035.09.075.15.02.04.042.078.067.113.025.036.055.076.09.12l.098.129 1.602 2.426h-1.138v1.597h4.357v-1.597h-1.018l-2.875-4.114 2.92-4.248h1.003V11.57h-4.178v1.613h1.109l-1.543 2.395a6.727 6.727 0 01-.284.452l-.03.045h-.03a.52.52 0 00-.075-.15 1.797 1.797 0 00-.255-.347l-1.587-2.395h1.138V11.57H6.5v1.613h1.018l2.83 4.098-2.905 4.264z",
  fill: "#3da751"
});

function SvgIconExcel(props) {
  return /*#__PURE__*/React.createElement("svg", _extends$7({
    width: 23,
    height: 27
  }, props), _ref$6);
}

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

var _ref$7 = /*#__PURE__*/React.createElement("path", {
  d: "M18.063 1.063l4.875 4.875c.291.291.541.687.75 1.187.208.5.312.958.312 1.375v18c0 .417-.146.77-.438 1.063A1.447 1.447 0 0122.5 28h-21c-.417 0-.77-.146-1.063-.438A1.447 1.447 0 010 26.5v-25C0 1.083.146.73.438.437A1.447 1.447 0 011.5 0h14c.417 0 .875.104 1.375.313.5.208.896.458 1.188.75zM16.64 2.468c-.125-.125-.339-.24-.641-.344V8h5.875c-.104-.302-.219-.516-.344-.64l-4.89-4.891zM2 26h20V10h-6.5c-.417 0-.77-.146-1.063-.438A1.447 1.447 0 0114 8.5V2H2v24zm9.688-12.984c.572 1.708 1.333 2.948 2.28 3.718.345.271.782.563 1.313.875.615-.073 1.224-.109 1.828-.109 1.532 0 2.453.255 2.766.766.167.229.177.5.031.812 0 .01-.005.021-.015.031l-.032.032v.015c-.062.396-.432.594-1.109.594-.5 0-1.099-.104-1.797-.313a11.391 11.391 0 01-2.031-.828c-2.302.25-4.344.683-6.125 1.297C7.203 22.636 5.943 24 5.016 24a.909.909 0 01-.438-.11l-.375-.187a1.671 1.671 0 00-.094-.078c-.104-.104-.135-.292-.093-.563.093-.416.385-.893.875-1.43.49-.536 1.177-1.038 2.062-1.507.146-.094.266-.063.36.094.02.02.03.041.03.062a38.204 38.204 0 001.673-3.078c.708-1.417 1.25-2.781 1.625-4.094a12.63 12.63 0 01-.477-2.492c-.068-.807-.034-1.471.102-1.992.114-.417.333-.625.656-.625H11.266c.24 0 .421.078.546.234.188.22.235.573.141 1.063a.34.34 0 01-.062.125c.01.031.015.073.015.125v.469c-.02 1.28-.094 2.28-.219 3zM5.742 22c-.38.458-.638.844-.773 1.156.541-.25 1.255-1.073 2.14-2.468A8.908 8.908 0 005.742 22zm5.446-13.25v.031c-.157.438-.167 1.125-.032 2.063.01-.073.047-.302.11-.688 0-.031.036-.255.109-.672a.352.352 0 01.063-.125c-.01-.01-.016-.02-.016-.03a.12.12 0 01-.016-.048.9.9 0 00-.203-.562c0 .01-.005.02-.015.031zm-1.235 9.063a106.31 106.31 0 01-.703 1.296 22.918 22.918 0 014.438-1.265c-.021-.01-.089-.06-.204-.149a2.793 2.793 0 01-.25-.21c-.791-.699-1.453-1.615-1.984-2.75-.281.895-.714 1.921-1.297 3.078zm9.422 1.093c0-.01-.01-.026-.031-.047-.25-.25-.98-.375-2.188-.375.792.292 1.438.438 1.938.438.146 0 .24-.005.281-.016z",
  fill: "#ff4a4a"
});

function SvgIconPdf(props) {
  return /*#__PURE__*/React.createElement("svg", _extends$8({
    width: 24,
    height: 28
  }, props), _ref$7);
}

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
      var columnValueList = _this.state.columnEntityList;
      var filteredRow = [];
      var filteredRowValues = [];
      var filteredRowHeader = [];

      if (columnValueList.length > 0 && _this.state.downLaodFileType.length > 0) {
        var rows = _this.props.rows;
        var rowLength = rows && rows.length > 0 ? rows.length : 0;
        rows.forEach(function (row, index) {
          var filteredColumnVal = {};
          var rowFilteredValues = [];
          var rowFilteredHeader = [];
          columnValueList.forEach(function (columnName) {
            var key = columnName.key,
                name = columnName.name;
            filteredColumnVal[name] = row[key];
            rowFilteredValues.push(row[key]);
            rowFilteredHeader.push(name);
          });
          filteredRow.push(filteredColumnVal);
          filteredRowValues.push(rowFilteredValues);
          if (rowLength === index + 1) filteredRowHeader.push(rowFilteredHeader);
        });

        _this.state.downLaodFileType.forEach(function (item) {
          if (item === "pdf") {
            _this.downloadPDF(filteredRowValues, filteredRowHeader);
          } else if (item === "excel") {
            _this.downloadXLSFile(filteredRow);
          } else {
            _this.downloadCSVFile(filteredRow);
          }
        });
      }
    };

    _this.downloadPDF = function (rowFilteredValues, rowFilteredHeader) {
      var unit = "pt";
      var size = "A4";
      var orientation = "landscape";
      var doc = new JsPdf(orientation, unit, size);
      doc.setFontSize(12);
      var title = "iCargo Neo Report";
      var content = {
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

    _this.downloadCSVFile = function (filteredRowValue) {
      try {
        var fileType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
        var fileExtension = ".csv";
        var fileName = "iCargo Neo Report";
        var ws = XLSX.utils.json_to_sheet(filteredRowValue);
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
        return Promise.resolve(URL.createObjectURL(data)).then(function (href) {
          var link = document.createElement("a");
          link.href = href;
          link.download = fileName + fileExtension;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        });
      } catch (e) {
        return Promise.reject(e);
      }
    };

    _this.downloadXLSFile = function (filteredRowValue) {
      try {
        var fileType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
        var fileExtension = ".xlsx";
        var fileName = "iCargo Neo Report";
        var ws = XLSX.utils.json_to_sheet(filteredRowValue);
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
        return Promise.resolve(URL.createObjectURL(data)).then(function (href) {
          var link = document.createElement("a");
          link.href = href;
          link.download = fileName + fileExtension;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        });
      } catch (e) {
        return Promise.reject(e);
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
      warning: " ",
      clickTag: "none"
    };
    _this.handleClick = _this.handleClick.bind(_assertThisInitialized(_this));
    _this.selectDownLoadType = _this.selectDownLoadType.bind(_assertThisInitialized(_this));
    _this.exportValidation = _this.exportValidation.bind(_assertThisInitialized(_this));
    return _this;
  }

  var _proto = ExportData.prototype;

  _proto.handleClick = function handleClick() {
    this.props.closeExport();
  };

  _proto.render = function render() {
    var _this2 = this;

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
        "data-testid": "addToColumn",
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
      onClick: function onClick() {
        return _this2.props.closeExport();
      }
    }, "Cancel"), /*#__PURE__*/React__default.createElement("button", {
      "data-testid": "exportValidationClick",
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

var _ref$8 = /*#__PURE__*/React.createElement("path", {
  d: "M.992 11.836c.045.054.1.08.162.08h4.384v-9.75H.923v9.48c0 .073.023.137.069.19zm10.016 0a.284.284 0 00.069-.19v-9.48H6.462v9.75h4.384a.207.207 0 00.162-.08zM11.661.398c.226.265.339.584.339.956v10.292c0 .372-.113.691-.339.956-.226.265-.498.398-.815.398H1.154c-.317 0-.59-.133-.815-.398A1.426 1.426 0 010 11.646V1.354C0 .982.113.663.339.398.565.133.837 0 1.154 0h9.692c.317 0 .59.133.815.398z",
  fill: "#3c476f",
  fillOpacity: 0.8
});

function SvgIconColumns(props) {
  return /*#__PURE__*/React.createElement("svg", _extends$9({
    width: 12,
    height: 13
  }, props), _ref$8);
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

var _ref$9 = /*#__PURE__*/React.createElement("path", {
  d: "M7.797 7.672A2.41 2.41 0 019.5 7a2.41 2.41 0 011.77.73A2.41 2.41 0 0112 9.5a2.41 2.41 0 01-.73 1.77A2.41 2.41 0 019.5 12a2.41 2.41 0 01-1.77-.73A2.41 2.41 0 017 9.5c0-.063.005-.151.016-.266L4.203 7.828A2.41 2.41 0 012.5 8.5a2.41 2.41 0 01-1.77-.73A2.41 2.41 0 010 6c0-.693.243-1.283.73-1.77A2.41 2.41 0 012.5 3.5a2.41 2.41 0 011.703.672l2.813-1.406A3.146 3.146 0 017 2.5c0-.693.243-1.283.73-1.77A2.41 2.41 0 019.5 0a2.41 2.41 0 011.77.73A2.41 2.41 0 0112 2.5a2.41 2.41 0 01-.73 1.77A2.41 2.41 0 019.5 5a2.41 2.41 0 01-1.703-.672L4.984 5.734C4.994 5.85 5 5.938 5 6c0 .063-.005.151-.016.266l2.813 1.406z",
  fill: "#636c8c"
});

function SvgIconShare(props) {
  return /*#__PURE__*/React.createElement("svg", _extends$a({
    width: 12,
    height: 12
  }, props), _ref$9);
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

var _ref$a = /*#__PURE__*/React.createElement("path", {
  d: "M8.013 10.346c.041.04.061.092.061.154v1.286a.207.207 0 01-.218.214H6.112a.207.207 0 01-.218-.214V10.5a.207.207 0 01.218-.214h1.744c.064 0 .116.02.157.06zm-3.271-.857c.04.04.061.091.061.154a.25.25 0 01-.068.16L2.561 11.94a.23.23 0 01-.157.06.247.247 0 01-.156-.06L.067 9.797c-.068-.072-.084-.15-.048-.235.036-.089.104-.133.204-.133h1.309V.214A.207.207 0 011.75 0h1.309a.207.207 0 01.218.214V9.43h1.308c.064 0 .116.02.157.06zm4.58-2.572c.04.04.061.092.061.154v1.286a.207.207 0 01-.218.214H6.112a.207.207 0 01-.218-.214V7.071a.207.207 0 01.218-.214h3.053c.064 0 .116.02.157.06zM10.63 3.49c.041.04.061.091.061.154v1.286a.207.207 0 01-.218.214H6.112a.207.207 0 01-.218-.214V3.643a.207.207 0 01.218-.214h4.361c.064 0 .116.02.157.06zM11.94.06c.04.04.061.092.061.154V1.5a.207.207 0 01-.218.214h-5.67a.207.207 0 01-.218-.214V.214A.207.207 0 016.112 0h5.67c.064 0 .116.02.157.06z",
  fill: "#3c476f",
  fillOpacity: 0.8
});

function SvgIconGroupSort(props) {
  return /*#__PURE__*/React.createElement("svg", _extends$b({
    width: 12,
    height: 12
  }, props), _ref$a);
}

function _extends$c() {
  _extends$c = Object.assign || function (target) {
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

  return _extends$c.apply(this, arguments);
}

var _ref$b = /*#__PURE__*/React.createElement("path", {
  d: "M6.746 6.746c.58-.58.87-1.277.87-2.092 0-.815-.29-1.513-.87-2.092a2.852 2.852 0 00-2.092-.87c-.815 0-1.513.29-2.092.87-.58.58-.87 1.277-.87 2.092 0 .815.29 1.513.87 2.092.58.58 1.277.87 2.092.87.815 0 1.513-.29 2.092-.87zm4.01 2.813a.81.81 0 01.244.595c0 .229-.084.427-.251.595a.813.813 0 01-.595.251.786.786 0 01-.595-.251L7.29 8.488a4.527 4.527 0 01-2.637.82c-.63 0-1.233-.123-1.808-.367a4.653 4.653 0 01-1.488-.992 4.653 4.653 0 01-.991-1.487A4.573 4.573 0 010 4.654c0-.63.122-1.233.367-1.808.244-.575.575-1.071.991-1.488A4.653 4.653 0 012.846.367 4.573 4.573 0 014.654 0c.63 0 1.233.122 1.808.367.575.244 1.07.575 1.487.991.417.417.747.913.992 1.488.244.575.367 1.178.367 1.808 0 .97-.274 1.849-.82 2.637l2.267 2.268z",
  fill: "#3c476f",
  fillOpacity: 0.8
});

function SvgIconSearch(props) {
  return /*#__PURE__*/React.createElement("svg", _extends$c({
    width: 11,
    height: 11
  }, props), _ref$b);
}

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
      var updatedRow = "";
      var updatedValue = "";
      console.log({
        fromRow: fromRow,
        toRow: toRow,
        updated: updated,
        action: action
      });
      console.log("change", updated);

      for (var update in updated) {
        updatedRow = update;
        updatedValue = updated[update];
      }

      if (updatedValue.match(/=sum\((\d+(?:,\s*\d+)*)\)/g)) {
        console.log(updatedRow);
      }

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
        _this.props.updatedRows({
          fromRow: fromRow,
          toRow: toRow,
          updated: updated,
          action: action
        });

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
        dataSet = _this$props.dataSet,
        pageSize = _this$props.pageSize;
    var dataSetVar = JSON.parse(JSON.stringify(dataSet));
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
      onChange: function onChange(e) {
        _this3.handleSearchValue(e.target.value);

        var srchRows = _this3.getSearchRecords(e);

        _this3.globalSearchLogic(e, srchRows);
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
      onGridRowsUpdated: function onGridRowsUpdated(e) {
        _this3.onGridRowsUpdated(e);
      },
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
      var result = 0;

      for (var _i = 0, l = nFields; _i < l; _i++) {
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
  pageSize: PropTypes.any,
  updatedRows: PropTypes.any,
  saveRows: PropTypes.any
};

module.exports = Spreadsheet;
//# sourceMappingURL=index.js.map
