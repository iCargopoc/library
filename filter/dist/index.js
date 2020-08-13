function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = require('react');
var React__default = _interopDefault(React);
var reactBootstrap = require('react-bootstrap');
var multiselectReactDropdown = require('multiselect-react-dropdown');
var freeSolidSvgIcons = require('@fortawesome/free-solid-svg-icons');
var reactFontawesome = require('@fortawesome/react-fontawesome');
var Card = _interopDefault(require('react-bootstrap/Card'));

function AutoComplete(props) {
  var _useState = React.useState([]),
      autoCompleteArr = _useState[0],
      setAutoAcompleteArr = _useState[1];

  React.useEffect(function () {
    setAutoAcompleteArr(props.autoCompleteArray);
  }, [props.autoCompleteArray]);

  var handleClose = function handleClose(item) {
    props.deleteAutoCompleteElement(item);
  };

  var _onSelect = function onSelect(selectedList, selectedItem, item) {
    props.createAutoCompleteArray(item, selectedList);
  };

  var autoCompleteDiv = autoCompleteArr.map(function (item, index) {
    var validationClass = "";

    if (item.validated === false) {
      validationClass = "text-danger";
    }

    return /*#__PURE__*/React__default.createElement("div", {
      className: "filter__input",
      key: index
    }, /*#__PURE__*/React__default.createElement("div", {
      className: "filter__input-title"
    }, /*#__PURE__*/React__default.createElement("div", {
      className: "filter__label"
    }, /*#__PURE__*/React__default.createElement("span", null, item.name), /*#__PURE__*/React__default.createElement("span", null, "\xA0>\xA0"), /*#__PURE__*/React__default.createElement("span", null, item.type)), /*#__PURE__*/React__default.createElement("div", {
      className: "filter__control"
    }, /*#__PURE__*/React__default.createElement(reactBootstrap.Form.Check, {
      type: "switch",
      label: "",
      className: item.type.concat(item.name),
      id: item.name.concat(item.type),
      checked: item.enabled,
      onChange: function onChange(e) {
        props.handleAutoCompleteEnabled(item);
      }
    }), /*#__PURE__*/React__default.createElement(reactFontawesome.FontAwesomeIcon, {
      icon: freeSolidSvgIcons.faTimes,
      type: "button",
      onClick: function onClick(e) {
        handleClose(item);
      }
    }))), /*#__PURE__*/React__default.createElement("div", {
      className: "displayFlex"
    }, /*#__PURE__*/React__default.createElement(multiselectReactDropdown.Multiselect, {
      id: item.type.concat(item.name),
      disable: !item.enabled,
      options: item.objectArray,
      closeIcon: "close",
      displayValue: "key",
      className: "form-control",
      selectedValues: item.value,
      onSelect: function onSelect(e) {
        _onSelect(e, e[e.length - 1], item);
      }
    })), /*#__PURE__*/React__default.createElement("span", {
      id: "fieldWarning",
      className: validationClass
    }, item.warning));
  });
  return /*#__PURE__*/React__default.createElement("div", null, autoCompleteDiv);
}

function FieldComponent(props) {
  var _useState = React.useState([]),
      fieldComponentArr = _useState[0],
      setFieldComponentArr = _useState[1];

  React.useEffect(function () {
    setFieldComponentArr(props.dateTimesArray);
  }, [props.dateTimesArray]);

  var handleClose = function handleClose(item) {
    props.deleteDateTimeElement(item);
  };

  var fieldComponentDiv = fieldComponentArr.map(function (item, index) {
    var validationClass = "";

    if (item.validated === false) {
      validationClass = "text-danger";
    }

    return /*#__PURE__*/React__default.createElement("div", {
      className: "filter__input",
      key: index
    }, /*#__PURE__*/React__default.createElement("div", {
      className: "filter__input-title",
      key: 1
    }, /*#__PURE__*/React__default.createElement("div", {
      className: "filter__label"
    }, /*#__PURE__*/React__default.createElement(reactBootstrap.Form.Label, null, /*#__PURE__*/React__default.createElement("strong", null, item.name))), /*#__PURE__*/React__default.createElement("div", {
      className: "filter__control"
    }, /*#__PURE__*/React__default.createElement(reactBootstrap.Form.Check, {
      type: "switch",
      id: item.name,
      label: "",
      defaultChecked: item.enabled,
      onChange: function onChange(e) {
        props.handleDateTimeEnabled(item);
      }
    }), /*#__PURE__*/React__default.createElement(reactFontawesome.FontAwesomeIcon, {
      className: "fontIcons",
      icon: freeSolidSvgIcons.faTimes,
      onClick: function onClick(e) {
        handleClose(item);
      }
    }))), item.field.map(function (field, index) {
      return /*#__PURE__*/React__default.createElement("div", {
        key: index + "-" + field.name
      }, /*#__PURE__*/React__default.createElement("div", {
        className: "displayFlex",
        key: index + "," + field.name
      }, /*#__PURE__*/React__default.createElement(reactBootstrap.Form.Text, null, field.column)), /*#__PURE__*/React__default.createElement("div", {
        className: "filter__split",
        key: index
      }, /*#__PURE__*/React__default.createElement("div", {
        className: "date-wrap"
      }, /*#__PURE__*/React__default.createElement(reactBootstrap.Form.Control, {
        disabled: !item.enabled,
        type: "datetime-local",
        value: field.value,
        className: field.name,
        onChange: function onChange(e) {
          props.createDateTimeArray(item, field.column, e.target.value);
        }
      }), /*#__PURE__*/React__default.createElement("span", {
        className: "date-button"
      }, /*#__PURE__*/React__default.createElement("button", {
        type: "button"
      })))));
    }), /*#__PURE__*/React__default.createElement("span", {
      id: "fieldWarning",
      className: validationClass
    }, item.warning));
  });
  return /*#__PURE__*/React__default.createElement("div", null, fieldComponentDiv);
}

function Condition(props) {
  var _useState = React.useState([]),
      conditionArr = _useState[0],
      setConditionArr = _useState[1];

  React.useEffect(function () {
    setConditionArr(props.conditionsArray);
  }, [props.conditionsArray]);
  var conditionalDiv = conditionArr.map(function (item, index) {
    var validationClass = "";

    if (item.validated === false) {
      validationClass = "text-danger";
    }

    return /*#__PURE__*/React__default.createElement("div", {
      className: "filter__input",
      key: index
    }, /*#__PURE__*/React__default.createElement("div", {
      className: "filter__input-title"
    }, /*#__PURE__*/React__default.createElement("div", {
      className: "filter__label"
    }, /*#__PURE__*/React__default.createElement(reactBootstrap.Form.Label, null, /*#__PURE__*/React__default.createElement("strong", null, item.name))), /*#__PURE__*/React__default.createElement("div", {
      className: "filter__control"
    }, /*#__PURE__*/React__default.createElement(reactBootstrap.Form.Check, {
      type: "switch",
      id: item.name,
      label: "",
      checked: item.enabled,
      onChange: function onChange(e) {
        props.handleCondionalEnabled(item);
      }
    }), /*#__PURE__*/React__default.createElement(reactFontawesome.FontAwesomeIcon, {
      className: "fontIcons",
      icon: freeSolidSvgIcons.faTimes,
      onClick: function onClick(e) {
        props.deleteConditionalElement(item);
      }
    }))), /*#__PURE__*/React__default.createElement("div", {
      onChange: function onChange(e) {
        props.createConditionalArray(item, e.target.value);
      }
    }, /*#__PURE__*/React__default.createElement("div", {
      className: "displayFlex"
    }, /*#__PURE__*/React__default.createElement(reactBootstrap.Form.Group, {
      controlId: "exampleForm.ControlSelect1"
    }, /*#__PURE__*/React__default.createElement(reactBootstrap.Form.Text, {
      className: "text-muted"
    }, Object.keys(item)[3]), /*#__PURE__*/React__default.createElement(reactBootstrap.Form.Control, {
      disabled: !item.enabled,
      as: "select",
      defaultValue: item.value
    }, item.condition.map(function (condition, index) {
      return /*#__PURE__*/React__default.createElement("option", {
        key: index
      }, condition.value);
    })))), /*#__PURE__*/React__default.createElement("div", {
      className: "displayFlex"
    }, /*#__PURE__*/React__default.createElement(reactBootstrap.Form.Group, null, /*#__PURE__*/React__default.createElement(reactBootstrap.Form.Text, {
      className: "text-muted"
    }, Object.keys(item)[4]), /*#__PURE__*/React__default.createElement(reactBootstrap.Form.Control, {
      disabled: !item.enabled,
      defaultValue: item.amount,
      required: true,
      type: "number"
    })))), /*#__PURE__*/React__default.createElement("span", {
      id: "fieldWarning",
      className: validationClass
    }, item.warning));
  });
  return /*#__PURE__*/React__default.createElement("div", null, conditionalDiv);
}

function TextComponents(props) {
  var _useState = React.useState([]),
      textComponentArr = _useState[0],
      setTextComponentArr = _useState[1];

  React.useEffect(function () {
    setTextComponentArr(props.textComponentsArray);
  }, [props.textComponentsArray]);
  var textComponentDiv = textComponentArr.map(function (item, index) {
    var validationClass = "";

    if (item.validated === false) {
      validationClass = "text-danger";
    }

    return /*#__PURE__*/React__default.createElement("div", {
      key: index
    }, /*#__PURE__*/React__default.createElement("div", {
      className: "filter__input"
    }, /*#__PURE__*/React__default.createElement("div", {
      className: "filter__input-title"
    }, /*#__PURE__*/React__default.createElement("div", {
      className: "filter__label"
    }, /*#__PURE__*/React__default.createElement("span", null, item.name)), /*#__PURE__*/React__default.createElement("div", {
      className: "filter__control"
    }, /*#__PURE__*/React__default.createElement(reactBootstrap.Form.Check, {
      type: "switch",
      label: "",
      id: item.name,
      checked: item.enabled,
      onChange: function onChange(e) {
        props.handleTextComponentEnabled(item);
      }
    }), /*#__PURE__*/React__default.createElement(reactFontawesome.FontAwesomeIcon, {
      icon: freeSolidSvgIcons.faTimes,
      type: "button",
      onClick: function onClick(e) {
        props.deleteTextComponentElement(item);
      }
    }))), /*#__PURE__*/React__default.createElement("div", {
      className: "displayFlex"
    }, /*#__PURE__*/React__default.createElement("input", {
      id: item.name.concat(item.dataType),
      disabled: !item.enabled,
      type: "text",
      defaultValue: item.value,
      className: "form-control",
      onChange: function onChange(e) {
        props.createTextComponentsArray(item, e.target.value);
      }
    })), /*#__PURE__*/React__default.createElement("span", {
      id: "fieldWarning",
      className: validationClass
    }, item.warning)));
  });
  return /*#__PURE__*/React__default.createElement("div", null, textComponentDiv);
}

var saveLogo = require("./icon-save~EODvfpOb.svg");

var RightDrawer = function RightDrawer(props) {
  var _useState = React.useState("none"),
      showSavePopup = _useState[0],
      setShowSavePopup = _useState[1];

  var _useState2 = React.useState(""),
      saveFilterName = _useState2[0],
      setSaveFilterName = _useState2[1];

  var _useState3 = React.useState(""),
      saveFilterWarning = _useState3[0],
      setSaveFilterWarning = _useState3[1];

  var _useState4 = React.useState(""),
      warningLabel = _useState4[0],
      setWarningLabel = _useState4[1];

  var _useState5 = React.useState(""),
      applyFilterWarning = _useState5[0],
      setApplyFilterWarning = _useState5[1];

  var _useState6 = React.useState(""),
      applyfilterWarningClassName = _useState6[0],
      setApplyFilterWariningClassname = _useState6[1];

  var _useState7 = React.useState("none"),
      recentFilterShow = _useState7[0],
      setRecentFilterShow = _useState7[1];

  var _useState8 = React.useState(""),
      filterShow = _useState8[0],
      setFilterShow = _useState8[1];

  React.useEffect(function () {
    setApplyFilterWarning(props.emptyFilterWarning);
    setApplyFilterWariningClassname(props.emptyFilterClassName);
  }, [props.emptyFilterWarning, props.emptyFilterClassName]);
  React.useEffect(function () {
    setWarningLabel(props.saveWarningClassName);
    setSaveFilterWarning(props.saveWarningLabel);
    setShowSavePopup(props.showSavePopUp);
  }, [props.saveWarningClassName, props.saveWarningLabel, props.showSavePopUp]);
  React.useEffect(function () {
    setRecentFilterShow(props.recentFilterShow);
    setFilterShow(props.filterShow);
  }, [props.recentFilterShow, props.filterShow]);

  var registersaveFilterName = function registersaveFilterName(e) {
    setSaveFilterName(e.target.value);
  };

  var cancelSavePopup = function cancelSavePopup() {
    setShowSavePopup("none");
    setSaveFilterWarning("");
    setWarningLabel("");
  };

  var savedFilters = localStorage.getItem("savedFilters");
  savedFilters = savedFilters ? JSON.parse(savedFilters) : [];

  if (savedFilters.length > 2) {
    savedFilters = savedFilters.slice(savedFilters.length - 2, savedFilters.length);
  }

  var recent = savedFilters.map(function (filterArray, index) {
    return /*#__PURE__*/React__default.createElement("div", {
      className: "recentFilters",
      key: index,
      onClick: function onClick(e) {
        props.addSavedFilters(filterArray);
      }
    }, Object.keys(filterArray)[0]);
  });
  return /*#__PURE__*/React__default.createElement(React__default.Fragment, null, /*#__PURE__*/React__default.createElement("div", {
    style: {
      display: recentFilterShow
    },
    className: "filter__content"
  }, /*#__PURE__*/React__default.createElement("div", null, "Recent Filters"), recent), /*#__PURE__*/React__default.createElement("div", {
    style: {
      display: filterShow
    }
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "filter__title"
  }, "Searched Filters", /*#__PURE__*/React__default.createElement("span", {
    className: "filter-count"
  }, props.filterCount)), /*#__PURE__*/React__default.createElement("div", {
    className: "filter__content"
  }, /*#__PURE__*/React__default.createElement(AutoComplete, {
    name: props.name,
    type: props.type,
    enabled: props.enabled,
    dataType: props.dataType,
    options: props.options,
    autoCompleteArray: props.autoCompleteArray,
    deleteAutoCompleteElement: props.deleteAutoCompleteElement,
    handleAutoCompleteEnabled: props.handleAutoCompleteEnabled,
    createAutoCompleteArray: props.createAutoCompleteArray
  }), /*#__PURE__*/React__default.createElement(FieldComponent, {
    dateTimesArray: props.dateTimesArray,
    deleteDateTimeElement: props.deleteDateTimeElement,
    handleDateTimeEnabled: props.handleDateTimeEnabled,
    createDateTimeArray: props.createDateTimeArray,
    addToday: props.addToday,
    addTomorrow: props.addTomorrow,
    addThisMonth: props.addThisMonth,
    addForteenDays: props.addForteenDays,
    addSevenDays: props.addSevenDays,
    addThisWeek: props.addThisWeek,
    addThirtyDays: props.addThirtyDays,
    lastDayChange: props.lastDayChange,
    nextDayChange: props.nextDayChange
  }), /*#__PURE__*/React__default.createElement(Condition, {
    conditionsArray: props.conditionsArray,
    handleCondionalEnabled: props.handleCondionalEnabled,
    createConditionalArray: props.createConditionalArray,
    deleteConditionalElement: props.deleteConditionalElement
  }), /*#__PURE__*/React__default.createElement(TextComponents, {
    textComponentsArray: props.textComponentsArray,
    deleteTextComponentElement: props.deleteTextComponentElement,
    createTextComponentsArray: props.createTextComponentsArray,
    handleTextComponentEnabled: props.handleTextComponentEnabled
  })), /*#__PURE__*/React__default.createElement("div", {
    className: "filter__btn"
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "filter__save"
  }, /*#__PURE__*/React__default.createElement(reactBootstrap.Button, {
    className: "button-save",
    variant: ""
  }, /*#__PURE__*/React__default.createElement("img", {
    src: saveLogo,
    onClick: props.openShowSavePopUp,
    alt: "save icon"
  }), /*#__PURE__*/React__default.createElement("span", null, "SAVE"))), /*#__PURE__*/React__default.createElement("div", {
    className: "btn-wrap"
  }, /*#__PURE__*/React__default.createElement("span", {
    className: applyfilterWarningClassName
  }, applyFilterWarning), /*#__PURE__*/React__default.createElement(reactBootstrap.Button, {
    variant: "",
    className: "reset",
    onClick: props.resetDrawer
  }, "Reset"), /*#__PURE__*/React__default.createElement(reactBootstrap.Button, {
    variant: "",
    className: "applyFilter",
    onClick: function onClick(e) {
      props.applyFilter();
      props.deleteAutoCompleteElement({});
      props.deleteConditionalElement({});
      props.deleteDateTimeElement({});
      props.deleteTextComponentElement({});
    }
  }, "Apply Filter")), /*#__PURE__*/React__default.createElement("div", {
    style: {
      display: showSavePopup
    },
    className: "popup--save"
  }, /*#__PURE__*/React__default.createElement("h5", null, "Save the Filter"), /*#__PURE__*/React__default.createElement("span", {
    className: warningLabel
  }, saveFilterWarning), /*#__PURE__*/React__default.createElement("label", null, "Saved Filter Name"), /*#__PURE__*/React__default.createElement("input", {
    className: "txt",
    value: saveFilterName,
    onChange: function onChange(e) {
      return registersaveFilterName(e);
    }
  }), /*#__PURE__*/React__default.createElement("div", {
    className: "btn-wrap"
  }, /*#__PURE__*/React__default.createElement("button", {
    className: "button",
    onClick: function onClick(e) {
      cancelSavePopup();
    }
  }, "Cancel"), /*#__PURE__*/React__default.createElement("button", {
    className: "button",
    onClick: function onClick(e) {
      props.saveFilter(saveFilterName);
    }
  }, "Save"))))));
};

var accordianArray = [];
function LeftDrawer(props) {
  var _useState = React.useState([]),
      leftDrawData = _useState[0],
      setLeftDrawData = _useState[1];

  var _useState2 = React.useState([]),
      leftDrawTemp = _useState2[0],
      setLeftDrawTemp = _useState2[1];

  var _useState3 = React.useState([]),
      setFilterType = _useState3[1];

  var _useState4 = React.useState([]),
      setFilterTypeTemp = _useState4[1];

  var _useState5 = React.useState("1"),
      setActiveState = _useState5[1];

  var _useState6 = React.useState([]),
      accordianArr = _useState6[0],
      setAccordianArr = _useState6[1];

  React.useEffect(function () {
    var typeArray = [];
    setLeftDrawData(props.filterData.filter);
    setLeftDrawTemp(props.filterData.filter);
    props.filterData.filter.forEach(function (item) {
      if (item.types) {
        item.types.forEach(function (type) {
          typeArray.push(type.name);
        });
      }
    });
    setFilterType(typeArray);
    setFilterTypeTemp(typeArray);
  }, [props.filterData.filter]);

  var searchFilterHandler = function searchFilterHandler(e) {
    var filteredList = [];
    var filteredTypeList = [];
    var searchKey = e.target.value;

    if (leftDrawData) {
      filteredList = leftDrawTemp.filter(function (item) {
        if (item.types) {
          filteredTypeList = item.types.filter(function (type) {
            return type.name && type.name.toLowerCase().includes(searchKey.toLowerCase());
          });

          if (filteredTypeList.length > 0 && searchKey !== "") {
            setActiveState("2");
            return true;
          } else {
            setActiveState("1");
          }

          return item.name && item.name.toLowerCase().includes(searchKey.toLowerCase());
        } else {
          return item.name && item.name.toLowerCase().includes(searchKey.toLowerCase());
        }
      });
    }

    setLeftDrawData(filteredList);
    setFilterType(filteredTypeList);
  };

  leftDrawData.forEach(function (item) {
    if (item.types) {
      accordianArray.push({
        name: item.name,
        accordianShow: ""
      });
    }
  });

  var handleAccordianArrow = function handleAccordianArrow(name, className) {
    accordianArray.forEach(function (item) {
      var index = accordianArray.indexOf(item);

      if (item.name === name) {
        if (className === "show card-header") {
          accordianArray[index] = {
            name: item.name,
            accordianShow: ""
          };
        } else {
          accordianArray[index] = {
            name: item.name,
            accordianShow: "show"
          };
        }
      }
    });
    setAccordianArr(accordianArray);
    accordianArray = [];
  };

  var accordianHeads = leftDrawData.map(function (item, index) {
    if (item.types.length) {
      var show = "";
      accordianArr.forEach(function (accord) {
        if (accord.name === item.name) {
          show = accord.accordianShow;
        }
      });
      return /*#__PURE__*/React__default.createElement("div", {
        key: index
      }, /*#__PURE__*/React__default.createElement(reactBootstrap.Accordion, null, /*#__PURE__*/React__default.createElement(Card, null, /*#__PURE__*/React__default.createElement(reactBootstrap.Accordion.Toggle, {
        style: {
          fontWeight: item.weight
        },
        className: show,
        as: Card.Header,
        eventKey: "1",
        onClick: function onClick(e) {
          handleAccordianArrow(item.name, e.target.className);
        }
      }, item.name), /*#__PURE__*/React__default.createElement(reactBootstrap.Accordion.Collapse, {
        eventKey: "1"
      }, /*#__PURE__*/React__default.createElement(Card.Body, null, /*#__PURE__*/React__default.createElement("ul", {
        className: "firstAccordion",
        key: index
      }, item.types && item.types.map(function (type, index) {
        return /*#__PURE__*/React__default.createElement("li", {
          style: {
            fontWeight: type.weight
          },
          onClick: function onClick(e) {
            props.fromLeftToRight(item.name, type.dataType, type.enabled, type.name, item.field, item.condition, type.dataSource, type.validationMessage, type.options);
          },
          key: index
        }, type.name);
      })))))));
    } else {
      return /*#__PURE__*/React__default.createElement("div", {
        key: index
      });
    }
  });
  var fieldHeads = leftDrawData.map(function (item, index) {
    if (item.field.length) {
      return /*#__PURE__*/React__default.createElement("div", {
        className: "fieldHeads",
        key: index
      }, /*#__PURE__*/React__default.createElement("li", {
        style: {
          fontWeight: item.weight
        },
        onClick: function onClick(e) {
          props.fromLeftToRight(item.name, item.dataType, item.enabled, item.types, item.field, item.condition, item.dataSource, item.validationMessage, item.options);
        }
      }, item.name));
    } else {
      return /*#__PURE__*/React__default.createElement("div", {
        key: index
      });
    }
  });
  var conditionHeads = leftDrawData.map(function (item, index) {
    if (item.condition.length) {
      return /*#__PURE__*/React__default.createElement("div", {
        className: "conditionHeads",
        key: index
      }, /*#__PURE__*/React__default.createElement("li", {
        style: {
          fontWeight: item.weight
        },
        onClick: function onClick(e) {
          props.fromLeftToRight(item.name, item.dataType, item.enabled, item.types, item.field, item.condition, item.dataSource, item.validationMessage, item.options);
        }
      }, item.name));
    } else {
      return /*#__PURE__*/React__default.createElement("div", {
        key: index
      });
    }
  });
  var normalHeads = leftDrawData.map(function (item, index) {
    if (!(item.condition.length || item.types.length || item.field.length)) {
      return /*#__PURE__*/React__default.createElement("div", {
        className: "normalHeads",
        key: index
      }, /*#__PURE__*/React__default.createElement("li", {
        style: {
          fontWeight: item.weight
        },
        onClick: function onClick(e) {
          props.fromLeftToRight(item.name, item.dataType, item.enabled, item.types, item.field, item.condition, item.dataSource, item.validationMessage, item.options);
        }
      }, item.name));
    } else {
      return /*#__PURE__*/React__default.createElement("div", {
        key: index
      });
    }
  });
  return /*#__PURE__*/React__default.createElement("div", null, /*#__PURE__*/React__default.createElement(reactBootstrap.Form.Row, null, /*#__PURE__*/React__default.createElement(reactBootstrap.Form.Control, {
    required: true,
    type: "text",
    placeholder: "Search a Filter",
    defaultValue: "",
    className: "customControl",
    onChange: searchFilterHandler
  })), /*#__PURE__*/React__default.createElement("div", {
    className: "leftDrawer"
  }, /*#__PURE__*/React__default.createElement("div", null, accordianHeads), /*#__PURE__*/React__default.createElement("div", null, fieldHeads), /*#__PURE__*/React__default.createElement("div", null, conditionHeads), /*#__PURE__*/React__default.createElement("div", null, normalHeads)));
}

var SavedFilters = function SavedFilters(props) {
  var _useState = React.useState(false),
      showFilter = _useState[0],
      setShowFilter = _useState[1];

  var listRef = React.useRef();
  React.useEffect(function () {
    var listHandler = function listHandler(event) {
      if (listRef.current && !listRef.current.contains(event.target)) {
        setShowFilter(false);
        props.handleListFilter();
      }
    };

    setShowFilter(props.showFilter);
    document.addEventListener("mousedown", listHandler);
    return function () {
      document.removeEventListener("mousedown", listHandler);
    };
  }, [props]);
  var keyValue = "";
  var savedFilters = localStorage.getItem("savedFilters");
  savedFilters = savedFilters ? JSON.parse(savedFilters) : [];

  var addToFavourite = function addToFavourite(item) {
    if (item.color === "#bcbdd1") {
      item.color = "#2680e8";
    } else {
      item.color = "#bcbdd1";
    }

    console.log(savedFilters);
    savedFilters.map(function (filterArray, index) {
      console.log(filterArray.color);
    });
    props.addingToFavourite(item);
  };

  var savedFilter = savedFilters.map(function (filterArray, index) {
    return /*#__PURE__*/React__default.createElement("div", {
      key: index
    }, /*#__PURE__*/React__default.createElement("div", {
      className: "alignLeft"
    }, /*#__PURE__*/React__default.createElement(reactFontawesome.FontAwesomeIcon, {
      style: {
        marginLeft: "-54px"
      },
      icon: freeSolidSvgIcons.faCheck
    }), /*#__PURE__*/React__default.createElement("div", {
      style: {
        marginLeft: "15px"
      },
      onClick: function onClick(e) {
        setShowFilter(false);
        props.handleListFilter();
        props.addSavedFilters(filterArray);
      }
    }, Object.keys(filterArray)[0]), /*#__PURE__*/React__default.createElement(reactFontawesome.FontAwesomeIcon, {
      style: {
        color: filterArray.color
      },
      icon: freeSolidSvgIcons.faStar,
      className: "marginLeft",
      onClick: function onClick(e) {
        addToFavourite(filterArray);
      }
    })));
  });

  if (showFilter) {
    return /*#__PURE__*/React__default.createElement("div", {
      className: "lists",
      ref: listRef
    }, /*#__PURE__*/React__default.createElement("div", {
      className: "savedFilters"
    }, /*#__PURE__*/React__default.createElement("div", {
      className: "text-muted"
    }, "Saved Filters"), /*#__PURE__*/React__default.createElement("ul", {
      key: keyValue,
      className: "leftSpace"
    }, savedFilter)));
  } else {
    return /*#__PURE__*/React__default.createElement("div", null);
  }
};

var chips, chipCount;

var MainFilterPanel = function MainFilterPanel(props) {
  var _useState = React.useState(false),
      listFilter = _useState[0],
      setListFilter = _useState[1];

  var _useState2 = React.useState([]),
      chipArray = _useState2[0],
      setChipArray = _useState2[1];

  var _useState3 = React.useState("none"),
      countShow = _useState3[0],
      setCountShow = _useState3[1];

  React.useEffect(function () {
    setChipArray(props.applyFilterChip.applyFilter);

    if (props.applyFilterChip.applyFilter && props.applyFilterChip.applyFilter.length > 0) {
      setCountShow("");
    } else {
      setCountShow("none");
    }
  }, [props.applyFilterChip]);

  var handleListFilter = function handleListFilter() {
    setListFilter(!listFilter);
  };

  if (chipArray) {
    chipCount = chipArray.length;
    chips = chipArray.map(function (item, index) {
      if (item.type) {
        return /*#__PURE__*/React__default.createElement("div", {
          className: "listContent",
          key: index,
          onClick: function onClick(e) {
            props.addAppliedFilters(chipArray);
          }
        }, /*#__PURE__*/React__default.createElement("span", null, item.name, ":", item.type), item.value.map(function (value, index) {
          return /*#__PURE__*/React__default.createElement("div", {
            key: index
          }, value.value);
        }));
      } else if (item.condition) {
        return /*#__PURE__*/React__default.createElement("div", {
          className: "listContent",
          key: index,
          onClick: function onClick(e) {
            props.addAppliedFilters(chipArray);
          }
        }, /*#__PURE__*/React__default.createElement("span", null, item.name), ":", item.condition, item.amount);
      } else if (item.fieldValue) {
        return /*#__PURE__*/React__default.createElement("div", {
          className: "listContent",
          key: index,
          onClick: function onClick(e) {
            props.addAppliedFilters(chipArray);
          }
        }, /*#__PURE__*/React__default.createElement("span", null, item.fieldValue), item.value);
      } else {
        return /*#__PURE__*/React__default.createElement("div", {
          className: "listContent",
          key: index,
          onClick: function onClick(e) {
            props.addAppliedFilters(chipArray);
          }
        }, /*#__PURE__*/React__default.createElement("span", null, item.name), ":", item.value);
      }
    });
  } else {
    chips = /*#__PURE__*/React__default.createElement("div", null);
  }

  return /*#__PURE__*/React__default.createElement("div", {
    className: "list"
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "displayFlex"
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "alignLeft"
  }, /*#__PURE__*/React__default.createElement(reactFontawesome.FontAwesomeIcon, {
    icon: freeSolidSvgIcons.faAlignLeft,
    onClick: handleListFilter
  }), /*#__PURE__*/React__default.createElement(SavedFilters, {
    onSelectSavedFilter: props.onSelectSavedFilter,
    showFilter: listFilter,
    handleListFilter: handleListFilter,
    addSavedFilters: props.addSavedFilters,
    addingToFavourite: props.addingToFavourite
  }), /*#__PURE__*/React__default.createElement("div", {
    className: "leftSpace"
  }, "All flights"))), /*#__PURE__*/React__default.createElement("div", {
    className: "secondList"
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "displayFlex"
  }, /*#__PURE__*/React__default.createElement("span", {
    style: {
      display: countShow
    },
    className: "listContent"
  }, "count:", chipCount), chips, /*#__PURE__*/React__default.createElement("div", {
    onClick: function onClick(e) {
      props.showDrawer();
    },
    className: "addFilter"
  }, "+ Add Filter"))));
};

function useComponentVisible() {
  var _useState = React.useState(false),
      showApplyFilter = _useState[0],
      setApplyFilter = _useState[1];

  var ref = React.useRef(null);

  var handleHideDropdown = function handleHideDropdown(event) {
    if (event.key === "Escape") {
      setApplyFilter(false);
    }
  };

  var handleClickOutside = function handleClickOutside(event) {
    if (ref.current && !ref.current.contains(event.target)) {
      setApplyFilter(false);
    }
  };

  React.useEffect(function () {
    document.addEventListener("keydown", handleHideDropdown, true);
    document.addEventListener("click", handleClickOutside, true);
    return function () {
      document.removeEventListener("keydown", handleHideDropdown, true);
      document.removeEventListener("click", handleClickOutside, true);
    };
  });
  return {
    ref: ref,
    showApplyFilter: showApplyFilter,
    setApplyFilter: setApplyFilter
  };
}

function Filter(props) {
  var _useState2 = React.useState([]),
      autoCompletesValueArray = _useState2[0],
      setAutoCompletesValueArray = _useState2[1];

  var _useState3 = React.useState([]),
      autoCompletesArray = _useState3[0],
      setAutoCompletesArray = _useState3[1];

  var _useState4 = React.useState([]),
      dateTimesArray = _useState4[0],
      setDateTimesArray = _useState4[1];

  var _useState5 = React.useState([]),
      dateTimesValueArray = _useState5[0],
      setDateTimesValueArray = _useState5[1];

  var _useState6 = React.useState([]),
      conditionsArray = _useState6[0],
      setConditionsArray = _useState6[1];

  var _useState7 = React.useState([]),
      conditionsValueArray = _useState7[0],
      setConditionsValueArray = _useState7[1];

  var _useState8 = React.useState([]),
      textComponentsArray = _useState8[0],
      setTextComponentsArray = _useState8[1];

  var _useState9 = React.useState([]),
      textComponentsValueArray = _useState9[0],
      setTextComponentsValueArray = _useState9[1];

  var _useState10 = React.useState({}),
      applyFilterChip = _useState10[0],
      setApplyFilterChip = _useState10[1];

  var _useState11 = React.useState(0),
      filterCount = _useState11[0],
      setFilterCount = _useState11[1];

  var _useState12 = React.useState({}),
      filterData = _useState12[0],
      setFilterData = _useState12[1];

  var _useState13 = React.useState("none"),
      showSavePopUp = _useState13[0],
      setShowSavePopUp = _useState13[1];

  var _useState14 = React.useState(""),
      saveWarningLabel = _useState14[0],
      setSaveWarningLabel = _useState14[1];

  var _useState15 = React.useState(""),
      saveWarningClassName = _useState15[0],
      setSaveWarningClassName = _useState15[1];

  var _useState16 = React.useState(""),
      emptyFilterWarning = _useState16[0],
      setEmptyFilterWarning = _useState16[1];

  var _useState17 = React.useState(""),
      emptyFilterClassName = _useState17[0],
      setEmptyFilterClassName = _useState17[1];

  var _useState18 = React.useState("none"),
      recentFilterShow = _useState18[0],
      setRecentFilterShow = _useState18[1];

  var _useState19 = React.useState(""),
      filterShow = _useState19[0],
      setFilterShow = _useState19[1];

  React.useEffect(function () {
    setFilterData(props.filterData);
  }, [props.filterData]);
  React.useEffect(function () {
    var count = 0;
    count = autoCompletesArray.length + dateTimesArray.length + conditionsArray.length + textComponentsArray.length;
    setFilterCount(count);
  }, [autoCompletesArray, dateTimesArray, conditionsArray, textComponentsArray]);

  var showDrawer = function showDrawer() {
    setApplyFilter(true);
  };

  var closeDrawer = function closeDrawer() {
    setApplyFilter(false);
  };

  var openShowSavePopUp = function openShowSavePopUp() {
    setShowSavePopUp("");
  };

  var applyFilter = function applyFilter() {
    if (filterCount > 0) {
      setEmptyFilterClassName("");
      setEmptyFilterWarning("");
      var _applyFilter = {
        applyFilterArray: []
      };
      var tempObj = {
        applyFilter: []
      };
      var obj = [];

      if (autoCompletesValueArray.length > 0) {
        autoCompletesValueArray.forEach(function (item) {
          tempObj.applyFilter.push(item);
          obj.push(Object.assign({}, item));
        });

        _applyFilter.applyFilterArray.push({
          autoComplete: autoCompletesValueArray
        });
      }

      if (dateTimesValueArray.length > 0) {
        dateTimesValueArray.forEach(function (item) {
          tempObj.applyFilter.push(item);
          obj.push(Object.assign({}, item));
        });

        _applyFilter.applyFilterArray.push({
          dateTime: dateTimesValueArray
        });
      }

      if (conditionsValueArray.length > 0) {
        conditionsValueArray.forEach(function (item) {
          tempObj.applyFilter.push(item);
          obj.push(Object.assign({}, item));
        });

        _applyFilter.applyFilterArray.push({
          conditional: conditionsValueArray
        });
      }

      if (textComponentsValueArray.length > 0) {
        textComponentsValueArray.forEach(function (item) {
          tempObj.applyFilter.push(item);
          obj.push(Object.assign({}, item));
        });

        _applyFilter.applyFilterArray.push({
          textComponent: textComponentsValueArray
        });
      }

      setApplyFilterChip(tempObj);
      obj.forEach(function (objec) {
        delete objec.dataType;
        delete objec.enabled;
      });
      props.appliedFilters(obj);
      tempObj = {};
      closeDrawer();
    } else {
      setEmptyFilterClassName("text-danger");
      setEmptyFilterWarning("No Filter is being selected");
    }
  };

  var saveFilter = function saveFilter(value) {
    var obj = [];

    if (value.length > 0) {
      if (!(autoCompletesValueArray.length > 0 || dateTimesValueArray.length > 0 || conditionsValueArray.length > 0 || textComponentsValueArray.length > 0)) {
        setShowSavePopUp("");
        setSaveWarningClassName("text-danger");
        setSaveWarningLabel("No filters selected or values entered");
      } else {
        var savedFilter = {
          filter: []
        };

        if (autoCompletesValueArray.length > 0) {
          var autoCompleteArray = [].concat(autoCompletesArray);
          autoCompleteArray.forEach(function (item) {
            autoCompletesValueArray.forEach(function (valueItem) {
              if (valueItem.name === item.name && valueItem.type === item.type) {
                item.validated = true;
                item.warning = "";
              }
            });
          });
          setAutoCompletesArray(autoCompleteArray);
          var count = 0;
          autoCompletesArray.forEach(function (item) {
            if (item.validated === false) {
              count++;
            }
          });

          if (count === 0) {
            savedFilter.filter.push({
              autoComplete: autoCompletesValueArray
            });
          } else {
            setShowSavePopUp("");
            setSaveWarningClassName("text-danger");
            setSaveWarningLabel("Enter values in every field");
          }

          autoCompleteArray = [];
        } else {
          var _autoCompleteArray = [].concat(autoCompletesArray);

          _autoCompleteArray.forEach(function (item) {
            item.validated = false;
          });

          setAutoCompletesArray(_autoCompleteArray);
          _autoCompleteArray = [];
        }

        if (dateTimesValueArray.length > 0) {
          var dateTimeArray = [].concat(dateTimesArray);
          dateTimeArray.forEach(function (item) {
            dateTimesValueArray.forEach(function (valueItem) {
              if (valueItem.name === item.name) {
                item.validated = true;
                item.warning = "";
              }
            });
          });
          setDateTimesArray(dateTimeArray);
          var _count = 0;
          dateTimesArray.forEach(function (item) {
            if (item.validated === false) {
              _count++;
            }
          });

          if (_count === 0) {
            savedFilter.filter.push({
              dateTime: dateTimesValueArray
            });
          } else {
            setShowSavePopUp("");
            setSaveWarningClassName("text-danger");
            setSaveWarningLabel("Enter values in every field");
          }

          dateTimeArray = [];
        } else {
          var _dateTimeArray = [].concat(dateTimesArray);

          _dateTimeArray.forEach(function (item) {
            item.validated = false;
          });

          setDateTimesArray(_dateTimeArray);
          _dateTimeArray = [];
        }

        if (conditionsValueArray.length > 0) {
          var conditionArray = [].concat(conditionsArray);
          conditionArray.forEach(function (item) {
            conditionsValueArray.forEach(function (valueItem) {
              if (valueItem.name === item.name) {
                item.validated = true;
                item.warning = "";
              }
            });
          });
          setConditionsArray(conditionArray);
          var _count2 = 0;
          conditionsArray.forEach(function (item) {
            if (item.validated === false) {
              _count2++;
            }
          });

          if (_count2 === 0) {
            savedFilter.filter.push({
              conditional: conditionsValueArray
            });
          } else {
            setShowSavePopUp("");
            setSaveWarningClassName("text-danger");
            setSaveWarningLabel("Enter values in every field");
          }

          conditionArray = [];
        } else {
          var _conditionArray = [].concat(conditionsArray);

          _conditionArray.forEach(function (item) {
            item.validated = false;
          });

          setConditionsArray(_conditionArray);
          _conditionArray = [];
        }

        if (textComponentsValueArray.length > 0) {
          var textComponentArray = [].concat(textComponentsArray);
          textComponentArray.forEach(function (item) {
            textComponentsValueArray.forEach(function (valueItem) {
              if (valueItem.name === item.name) {
                item.validated = true;
                item.warning = "";
              }
            });
          });
          setTextComponentsArray(textComponentArray);
          var _count3 = 0;
          textComponentArray.forEach(function (item) {
            if (item.validated === false) {
              _count3++;
            }
          });

          if (_count3 === 0) {
            savedFilter.filter.push({
              textComponent: textComponentsValueArray
            });
          } else {
            setShowSavePopUp("");
            setSaveWarningClassName("text-danger");
            setSaveWarningLabel("Enter values in every field");
          }

          textComponentArray = [];
        } else {
          var _textComponentArray = [].concat(textComponentsArray);

          _textComponentArray.forEach(function (item) {
            item.validated = false;
          });

          setTextComponentsArray(_textComponentArray);
          _textComponentArray = [];
        }

        if (savedFilter.filter.length > 0) {
          savedFilter[value] = savedFilter["filter"];
          delete savedFilter.filter;
          var savedFilters = localStorage.getItem("savedFilters");
          savedFilters = savedFilters ? JSON.parse(savedFilters) : [];
          savedFilters.push(savedFilter);
          localStorage.setItem("savedFilters", JSON.stringify(savedFilters));
          setShowSavePopUp("none");
          setSaveWarningClassName("");
          setSaveWarningLabel("");
          resetDrawer();
        }
      }
    } else {
      setShowSavePopUp("");
      setSaveWarningClassName("text-danger");
      setSaveWarningLabel("Enter a valid filterName");
    }

    autoCompletesValueArray.forEach(function (item) {
      obj.push(Object.assign({}, item));
    });
    dateTimesValueArray.forEach(function (item) {
      obj.push(Object.assign({}, item));
    });
    conditionsValueArray.forEach(function (item) {
      obj.push(Object.assign({}, item));
    });
    textComponentsValueArray.forEach(function (item) {
      obj.push(Object.assign({}, item));
    });
    obj.forEach(function (objec) {
      delete objec.dataType;
      delete objec.enabled;
    });
    props.savedFilters(obj);
  };

  var fromLeftToRight = function fromLeftToRight(name, dataType, enabled, type, field, condition, dataSource, warning, options) {
    setShowSavePopUp("none");
    setSaveWarningLabel("");
    setSaveWarningClassName("");
    setEmptyFilterClassName("");
    setEmptyFilterWarning("");

    if (dataType === "AutoComplete") {
      var value = {
        name: name,
        type: type,
        dataType: dataType,
        enabled: enabled,
        objectArray: []
      };
      filterData.filter.forEach(function (item) {
        if (item.name === value.name) {
          item.weight = 700;
          item.types.forEach(function (tip) {
            if (tip.name === value.type) {
              tip.weight = 600;
            }
          });
        }
      });
      var autoCompleteArray = [].concat(autoCompletesArray);

      if (autoCompleteArray.length > 0) {
        var index = autoCompleteArray.findIndex(function (x) {
          return x.name === value.name && x.type === value.type;
        });

        if (index === -1) {
          autoCompleteArray.push({
            name: name,
            type: type,
            dataType: dataType,
            enabled: enabled,
            objectArray: options,
            validated: false,
            warning: warning
          });
        }
      } else {
        autoCompleteArray.push({
          name: name,
          type: type,
          dataType: dataType,
          enabled: enabled,
          objectArray: options,
          validated: false,
          warning: warning
        });
      }

      setAutoCompletesArray(autoCompleteArray);
      autoCompleteArray = [];
    }

    if (dataType === "DateTime") {
      var _value = {
        name: name,
        dataType: dataType,
        enabled: enabled,
        field: field,
        validated: false,
        warning: warning
      };
      filterData.filter.forEach(function (item) {
        if (item.name === _value.name) {
          item.weight = 700;
        }
      });
      var dateTimeArray = [].concat(dateTimesArray);

      if (dateTimeArray.length > 0) {
        var _index = dateTimeArray.findIndex(function (x) {
          return x.name === _value.name && x.field === _value.field;
        });

        if (_index === -1) {
          dateTimeArray.push({
            name: name,
            dataType: dataType,
            enabled: enabled,
            field: field,
            validated: false,
            warning: warning
          });
        }
      } else {
        dateTimeArray.push({
          name: name,
          dataType: dataType,
          enabled: enabled,
          field: field,
          validated: false,
          warning: warning
        });
      }

      setDateTimesArray(dateTimeArray);
      dateTimeArray = [];
    }

    if (dataType === "Numeric") {
      var _value2 = {
        name: name,
        dataType: dataType,
        enabled: enabled,
        condition: condition,
        amount: "",
        validated: false,
        warning: warning
      };
      filterData.filter.forEach(function (item) {
        if (item.name === _value2.name) {
          item.weight = 700;
        }
      });
      var conditionArray = [].concat(conditionsArray);

      if (conditionArray.length > 0) {
        var _index2 = conditionArray.findIndex(function (x) {
          return x.name === _value2.name && x.condition === _value2.condition;
        });

        if (_index2 === -1) {
          conditionArray.push({
            name: name,
            dataType: dataType,
            enabled: enabled,
            condition: condition,
            amount: "",
            validated: false,
            warning: warning
          });
        }
      } else {
        conditionArray.push({
          name: name,
          dataType: dataType,
          enabled: enabled,
          condition: condition,
          amount: "",
          validated: false,
          warning: warning
        });
      }

      setConditionsArray(conditionArray);
      conditionArray = [];
    }

    if (dataType === "Text") {
      var _value3 = {
        name: name,
        dataType: dataType,
        enabled: enabled,
        validated: false,
        warning: warning
      };
      filterData.filter.forEach(function (item) {
        if (item.name === _value3.name) {
          item.weight = 700;
        }
      });
      var textComponentArray = [].concat(textComponentsArray);

      if (textComponentArray.length > 0) {
        var _index3 = textComponentArray.findIndex(function (x) {
          return x.name === _value3.name && x.dataType === _value3.dataType;
        });

        if (_index3 === -1) {
          textComponentArray.push({
            name: name,
            dataType: dataType,
            enabled: enabled,
            validated: false,
            warning: warning
          });
        }
      } else {
        textComponentArray.push({
          name: name,
          dataType: dataType,
          enabled: enabled,
          validated: false,
          warning: warning
        });
      }

      setTextComponentsArray(textComponentArray);
      textComponentArray = [];
    }
  };

  var createAutoCompleteArray = function createAutoCompleteArray(item, valueArray) {
    setShowSavePopUp("none");
    setSaveWarningLabel("");
    setSaveWarningClassName("");
    var autoCompleteArray = [].concat(autoCompletesArray);
    var tempObj = JSON.parse(JSON.stringify(item));
    tempObj.value = valueArray;
    var autoCompleteValueArray = [].concat(autoCompletesValueArray);

    if (autoCompleteValueArray.length > 0) {
      var index = autoCompleteValueArray.findIndex(function (x) {
        return x.name === tempObj.name && x.type === tempObj.type;
      });

      if (index === -1) {
        autoCompleteValueArray.push({
          name: tempObj.name,
          type: tempObj.type,
          dataType: tempObj.dataType,
          enabled: tempObj.enabled,
          value: tempObj.value
        });
      } else {
        autoCompleteValueArray[index].value = tempObj.value;
      }

      autoCompleteValueArray.forEach(function (valueItem) {
        autoCompleteArray.forEach(function (item) {
          if (item.name === valueItem.name && item.type === valueItem.type) {
            item.validated = true;
            item.warning = "";
          }
        });
      });
    } else {
      autoCompleteValueArray.push({
        name: tempObj.name,
        type: tempObj.type,
        dataType: tempObj.dataType,
        enabled: tempObj.enabled,
        value: tempObj.value
      });
      autoCompleteValueArray.forEach(function (valueItem) {
        autoCompleteArray.forEach(function (item) {
          if (item.name === valueItem.name && item.type === valueItem.type) {
            item.validated = true;
            item.warning = "";
          }
        });
      });
    }

    setAutoCompletesArray(autoCompleteArray);
    autoCompleteArray = [];
    setAutoCompletesValueArray(autoCompleteValueArray);
    autoCompleteValueArray = [];
  };

  var deleteAutoCompleteElement = function deleteAutoCompleteElement(item) {
    filterData.filter.forEach(function (it) {
      it.types.forEach(function (tip) {
        if (tip.name === item.type && item.name === it.name) {
          tip.weight = 400;
        }
      });
    });
    var autoCompleteArray = [].concat(autoCompletesArray);
    var index = autoCompleteArray.findIndex(function (x) {
      return x.name === item.name && x.type === item.type;
    });

    if (index !== -1) {
      autoCompleteArray.splice(index, 1);
    } else {
      autoCompleteArray = [];
    }

    setAutoCompletesArray(autoCompleteArray);
    autoCompleteArray.forEach(function (aut) {
      filterData.filter.forEach(function (fit) {
        if (fit.types && fit.name !== aut.name && fit.weight === 700) {
          fit.weight = 400;
        }
      });
    });
  };

  var handleAutoCompleteEnabled = function handleAutoCompleteEnabled(item) {
    var autoCompleteArray = [].concat(autoCompletesArray);
    var index = autoCompleteArray.findIndex(function (x) {
      return x.name === item.name && x.type === item.type;
    });

    if (index !== -1) {
      autoCompleteArray[index].enabled = !autoCompleteArray[index].enabled;
    }

    setAutoCompletesArray(autoCompleteArray);

    if (autoCompletesValueArray.length > 0) {
      var autoCompleteValueArray = [].concat(autoCompletesValueArray);

      var _index4 = autoCompleteValueArray.findIndex(function (x) {
        return x.name === item.name && x.type === item.type;
      });

      autoCompleteValueArray[_index4].enabled = !autoCompleteValueArray[_index4].enabled;
      setAutoCompletesValueArray(autoCompleteValueArray);
      autoCompleteValueArray = [];
    }
  };

  var deleteDateTimeElement = function deleteDateTimeElement(item) {
    filterData.filter.forEach(function (it) {
      if (it.name === item.name) {
        it.weight = 400;
      }
    });
    filterData.filter.forEach(function (it) {
      if (it.name === item.name) {
        item.weight = 400;
      }
    });
    var dateTimeArray = [].concat(dateTimesArray);
    var index = dateTimeArray.findIndex(function (x) {
      return x.name === item.name;
    });
    dateTimeArray.splice(index, 1);
    dateTimeArray.forEach(function (item) {
      item.field.forEach(function (fieldArray) {
        fieldArray.value = "";
      });
    });
    setDateTimesArray(dateTimeArray);
    dateTimeArray = [];
    filterData.filter.forEach(function (filters) {
      if (filters.name === item.name) {
        item.field.forEach(function (fieldArray) {
          fieldArray.value = "";
        });
      }
    });

    if (item === {}) {
      setDateTimesValueArray([]);
    }
  };

  var handleDateTimeEnabled = function handleDateTimeEnabled(item) {
    var dateTimeArray = [].concat(dateTimesArray);
    var index = dateTimeArray.findIndex(function (x) {
      return x.name === item.name && x.field === item.field;
    });

    if (index !== -1) {
      dateTimeArray[index].enabled = !dateTimeArray[index].enabled;
    }

    setDateTimesArray(dateTimeArray);
    dateTimeArray = [];

    if (dateTimesValueArray.length > 0) {
      var dateTimeValueArray = [].concat(dateTimesValueArray);
      var tempArray = [];
      item.field.forEach(function (item) {
        tempArray.push(item.column);
      });

      var _index5 = dateTimeValueArray.findIndex(function (x) {
        return x.name === item.name && tempArray.includes(x.fieldValue);
      });

      if (_index5 !== -1) {
        dateTimeValueArray.forEach(function (item) {
          item.enabled = !item.enabled;
        });
      }

      setDateTimesValueArray(dateTimeValueArray);
      dateTimeValueArray = [];
    }
  };

  var createDateTimeArray = function createDateTimeArray(item, fieldName, value) {
    setShowSavePopUp("none");
    setSaveWarningLabel("");
    setSaveWarningClassName("");
    var dateTimeArray = [].concat(dateTimesArray);
    console.log(dateTimesArray);
    console.log(value);
    var tempObj = JSON.parse(JSON.stringify(item));
    tempObj.fieldValue = fieldName;
    tempObj.value = value;
    var dateTimeValueArray = [].concat(dateTimesValueArray);

    if (dateTimeValueArray.length > 0) {
      var index = dateTimeValueArray.findIndex(function (x) {
        return x.fieldValue === tempObj.fieldValue && x.name === tempObj.name;
      });

      if (index === -1) {
        dateTimeValueArray.push({
          name: tempObj.name,
          dataType: tempObj.dataType,
          enabled: tempObj.enabled,
          fieldValue: tempObj.fieldValue,
          value: tempObj.value
        });
      } else {
        dateTimeValueArray[index].value = tempObj.value;
      }

      dateTimeValueArray.forEach(function (valueItem) {
        dateTimeArray.forEach(function (item) {
          if (item.name === valueItem.name) {
            item.validated = true;
            item.warning = "";
          }
        });
      });
    } else {
      dateTimeValueArray.push({
        name: tempObj.name,
        dataType: tempObj.dataType,
        enabled: tempObj.enabled,
        fieldValue: tempObj.fieldValue,
        value: tempObj.value
      });
      dateTimeValueArray.forEach(function (valueItem) {
        dateTimeArray.forEach(function (item) {
          if (item.name === valueItem.name) {
            item.validated = true;
            item.warning = "";
          }
        });
      });
    }

    setDateTimesValueArray(dateTimeValueArray);
    dateTimeValueArray = [];
    dateTimeArray = [].concat(dateTimesArray);

    if (dateTimeArray.length > 0) {
      dateTimeArray.forEach(function (item) {
        item.field.forEach(function (fieldArray) {
          if (fieldArray.column === fieldName) {
            fieldArray.value = value;
          }
        });
      });
      setDateTimesArray(dateTimeArray);
    }

    dateTimeArray = [];
  };

  var getValueOfDate = function getValueOfDate(dateValue) {
    var date = new Date(dateValue);
    console.log(date);
    var dateTimeFormat = new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "numeric",
      seconds: "numeric"
    });

    var _dateTimeFormat$forma = dateTimeFormat.formatToParts(date),
        month = _dateTimeFormat$forma[0].value,
        day = _dateTimeFormat$forma[2].value,
        year = _dateTimeFormat$forma[4].value,
        hour = _dateTimeFormat$forma[6].value,
        minute = _dateTimeFormat$forma[8].value;

    return year + "-" + month + "-" + day + "T" + hour + ":" + minute;
  };

  var addToday = function addToday() {
    var todayDate = new Date();
    var dated = getValueOfDate(todayDate);
    console.log(dated);
    var dateTimeArray = [].concat(dateTimesArray);
    var dateTimeValueArray = [].concat(dateTimesValueArray);

    if (dateTimeArray.length > 0) {
      dateTimeArray.forEach(function (item) {
        item.field.forEach(function (fieldArray) {
          fieldArray.value = dated;

          if (dateTimeValueArray.length > 1) {
            dateTimeValueArray.forEach(function (item) {
              if (item.fieldValue === fieldArray.column) {
                item.value = dated;
              }
            });
          } else {
            dateTimeValueArray.push({
              name: item.name,
              dataType: item.dataType,
              enabled: item.enabled,
              fieldValue: fieldArray.column,
              value: dated
            });
          }
        });
      });
      setDateTimesArray(dateTimeArray);
      setDateTimesValueArray(dateTimeValueArray);
    }
  };

  var addTomorrow = function addTomorrow() {
    var fromDate = new Date();
    var toDate = new Date();
    fromDate.setDate(fromDate.getDate() + 1);
    toDate.setDate(toDate.getDate() + 1);
    fromDate = getValueOfDate(fromDate);
    toDate = getValueOfDate(toDate);
    var dateTimeArray = [].concat(dateTimesArray);
    var dateTimeValueArray = [].concat(dateTimesValueArray);

    if (dateTimeArray.length > 0) {
      dateTimeArray.forEach(function (item) {
        item.field[0].value = fromDate;
        item.field[1].value = toDate;
        item.field.forEach(function (fieldArray) {
          if (dateTimeValueArray.length > 1) {
            dateTimeValueArray.forEach(function (arr) {
              if (arr.fieldValue === fieldArray.column) {
                arr.value = fieldArray.value;
              }
            });
          } else {
            dateTimeValueArray.push({
              name: item.name,
              dataType: item.dataType,
              enabled: item.enabled,
              fieldValue: fieldArray.column,
              value: fieldArray.value
            });
          }
        });
      });
      setDateTimesArray(dateTimeArray);
      setDateTimesValueArray(dateTimeValueArray);
    }
  };

  var addThisMonth = function addThisMonth() {
    var today = new Date();
    var fromDate = new Date(today.getFullYear(), today.getMonth(), 1);
    var toDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    fromDate = getValueOfDate(fromDate);
    toDate = getValueOfDate(toDate);
    var dateTimeArray = [].concat(dateTimesArray);
    var dateTimeValueArray = [].concat(dateTimesValueArray);

    if (dateTimeArray.length > 0) {
      dateTimeArray.forEach(function (item) {
        item.field[0].value = fromDate;
        item.field[1].value = toDate;
        item.field.forEach(function (fieldArray) {
          if (dateTimeValueArray.length > 1) {
            dateTimeValueArray.forEach(function (arr) {
              if (arr.fieldValue === fieldArray.column) {
                arr.value = fieldArray.value;
              }
            });
          } else {
            dateTimeValueArray.push({
              name: item.name,
              dataType: item.dataType,
              enabled: item.enabled,
              fieldValue: fieldArray.column,
              value: fieldArray.value
            });
          }
        });
      });
      setDateTimesArray(dateTimeArray);
      setDateTimesValueArray(dateTimeValueArray);
    }
  };

  var addForteenDays = function addForteenDays() {
    var fromDate = new Date();
    var toDate = new Date();
    fromDate.setDate(fromDate.getDate() + 1);
    toDate.setDate(toDate.getDate() + 14);
    fromDate = getValueOfDate(fromDate);
    toDate = getValueOfDate(toDate);
    var dateTimeArray = [].concat(dateTimesArray);
    var dateTimeValueArray = [].concat(dateTimesValueArray);

    if (dateTimeArray.length > 0) {
      dateTimeArray.forEach(function (item) {
        item.field[0].value = fromDate;
        item.field[1].value = toDate;
        item.field.forEach(function (fieldArray) {
          if (dateTimeValueArray.length > 1) {
            dateTimeValueArray.forEach(function (arr) {
              if (arr.fieldValue === fieldArray.column) {
                arr.value = fieldArray.value;
              }
            });
          } else {
            dateTimeValueArray.push({
              name: item.name,
              dataType: item.dataType,
              enabled: item.enabled,
              fieldValue: fieldArray.column,
              value: fieldArray.value
            });
          }
        });
      });
      setDateTimesArray(dateTimeArray);
      setDateTimesValueArray(dateTimeValueArray);
    }
  };

  var addSevenDays = function addSevenDays() {
    var fromDate = new Date();
    var toDate = new Date();
    fromDate.setDate(fromDate.getDate() + 1);
    toDate.setDate(toDate.getDate() + 7);
    fromDate = getValueOfDate(fromDate);
    toDate = getValueOfDate(toDate);
    var dateTimeArray = [].concat(dateTimesArray);
    var dateTimeValueArray = [].concat(dateTimesValueArray);

    if (dateTimeArray.length > 0) {
      dateTimeArray.forEach(function (item) {
        item.field[0].value = fromDate;
        item.field[1].value = toDate;
        item.field.forEach(function (fieldArray) {
          if (dateTimeValueArray.length > 1) {
            dateTimeValueArray.forEach(function (arr) {
              if (arr.fieldValue === fieldArray.column) {
                arr.value = fieldArray.value;
              }
            });
          } else {
            dateTimeValueArray.push({
              name: item.name,
              dataType: item.dataType,
              enabled: item.enabled,
              fieldValue: fieldArray.column,
              value: fieldArray.value
            });
          }
        });
      });
      setDateTimesArray(dateTimeArray);
      setDateTimesValueArray(dateTimeValueArray);
    }
  };

  var addThisWeek = function addThisWeek() {
    var today = new Date();
    var from = today.getDate() - today.getDay();
    var to = from + 6;
    var fromDate = new Date(today.setDate(from)).toUTCString();
    var toDate = new Date(today.setDate(to)).toUTCString();
    fromDate = getValueOfDate(fromDate);
    toDate = getValueOfDate(toDate);
    var dateTimeArray = [].concat(dateTimesArray);
    var dateTimeValueArray = [].concat(dateTimesValueArray);

    if (dateTimeArray.length > 0) {
      dateTimeArray.forEach(function (item) {
        item.field[0].value = fromDate;
        item.field[1].value = toDate;
        item.field.forEach(function (fieldArray) {
          if (dateTimeValueArray.length > 1) {
            dateTimeValueArray.forEach(function (arr) {
              if (arr.fieldValue === fieldArray.column) {
                arr.value = fieldArray.value;
              }
            });
          } else {
            dateTimeValueArray.push({
              name: item.name,
              dataType: item.dataType,
              enabled: item.enabled,
              fieldValue: fieldArray.column,
              value: fieldArray.value
            });
          }
        });
      });
      setDateTimesArray(dateTimeArray);
      setDateTimesValueArray(dateTimeValueArray);
    }
  };

  var addThirtyDays = function addThirtyDays() {
    var from = new Date();
    var to = new Date();
    from.setDate(from.getDate() + 1);
    to.setDate(to.getDate() + 30);
    var fromDate = getValueOfDate(from);
    var toDate = getValueOfDate(to);
    var dateTimeArray = [].concat(dateTimesArray);
    var dateTimeValueArray = [].concat(dateTimesValueArray);

    if (dateTimeArray.length > 0) {
      dateTimeArray.forEach(function (item) {
        item.field[0].value = fromDate;
        item.field[1].value = toDate;
        item.field.forEach(function (fieldArray) {
          if (dateTimeValueArray.length > 1) {
            dateTimeValueArray.forEach(function (arr) {
              if (arr.fieldValue === fieldArray.column) {
                arr.value = fieldArray.value;
              }
            });
          } else {
            dateTimeValueArray.push({
              name: item.name,
              dataType: item.dataType,
              enabled: item.enabled,
              fieldValue: fieldArray.column,
              value: fieldArray.value
            });
          }
        });
      });
      setDateTimesArray(dateTimeArray);
      setDateTimesValueArray(dateTimeValueArray);
    }
  };

  var nextDayChange = function nextDayChange(value) {
    if (value === "") {
      value = 1;
    }

    var fromDate = new Date();
    var toDate = new Date();

    if (value !== "0") {
      fromDate.setDate(fromDate.getDate() + 1);
      toDate.setDate(toDate.getDate() + parseInt(value));
    }

    fromDate = getValueOfDate(fromDate);
    toDate = getValueOfDate(toDate);
    var dateTimeArray = [].concat(dateTimesArray);
    var dateTimeValueArray = [].concat(dateTimesValueArray);

    if (dateTimeArray.length > 0) {
      dateTimeArray.forEach(function (item) {
        item.field[0].value = fromDate;
        item.field[1].value = toDate;
        item.field.forEach(function (fieldArray) {
          if (dateTimeValueArray.length > 1) {
            dateTimeValueArray.forEach(function (arr) {
              if (arr.fieldValue === fieldArray.column) {
                arr.value = fieldArray.value;
              }
            });
          } else {
            dateTimeValueArray.push({
              name: item.name,
              dataType: item.dataType,
              enabled: item.enabled,
              fieldValue: fieldArray.column,
              value: fieldArray.value
            });
          }
        });
      });
      setDateTimesArray(dateTimeArray);
      setDateTimesValueArray(dateTimeValueArray);
    }
  };

  var lastDayChange = function lastDayChange(value) {
    if (value === "") {
      value = 1;
    }

    var fromDate = new Date();
    var toDate = new Date();

    if (value !== "0") {
      fromDate.setDate(fromDate.getDate() - parseInt(value));
      toDate.setDate(toDate.getDate() - 1);
    }

    fromDate = getValueOfDate(fromDate);
    toDate = getValueOfDate(toDate);
    var dateTimeArray = [].concat(dateTimesArray);
    var dateTimeValueArray = [].concat(dateTimesValueArray);

    if (dateTimeArray.length > 0) {
      dateTimeArray.forEach(function (item) {
        item.field[0].value = fromDate;
        item.field[1].value = toDate;
        item.field.forEach(function (fieldArray) {
          if (dateTimeValueArray.length > 1) {
            dateTimeValueArray.forEach(function (arr) {
              if (arr.fieldValue === fieldArray.column) {
                arr.value = fieldArray.value;
              }
            });
          } else {
            dateTimeValueArray.push({
              name: item.name,
              dataType: item.dataType,
              enabled: item.enabled,
              fieldValue: fieldArray.column,
              value: fieldArray.value
            });
          }
        });
      });
      setDateTimesArray(dateTimeArray);
      setDateTimesValueArray(dateTimeValueArray);
    }
  };

  var handleCondionalEnabled = function handleCondionalEnabled(item) {
    var conditionArray = [].concat(conditionsArray);
    var index = conditionArray.findIndex(function (x) {
      return x.name === item.name && x.condition === item.condition;
    });

    if (index !== -1) {
      conditionArray[index].enabled = !conditionArray[index].enabled;
    }

    setConditionsArray(conditionArray);
    var conditionValueArray = [];
    conditionValueArray = [].concat(conditionsValueArray);

    if (conditionValueArray.length > 0) {
      var _index6 = conditionValueArray.findIndex(function (x) {
        return x.name === item.name && x.dataType === item.dataType;
      });

      conditionValueArray[_index6].enabled = !conditionValueArray[_index6].enabled;
    }

    setConditionsValueArray(conditionValueArray);
    conditionValueArray = [];
  };

  var createConditionalArray = function createConditionalArray(item, value) {
    setShowSavePopUp("none");
    setSaveWarningLabel("");
    setSaveWarningClassName("");
    var conditionArray = [].concat(conditionsArray);
    var valueArray = [];
    item.condition.forEach(function (it) {
      valueArray.push(it.value);
    });
    var conditionValueArray = [].concat(conditionsValueArray);

    if (conditionValueArray.length > 0) {
      var index = conditionValueArray.findIndex(function (x) {
        return x.name === item.name && x.dataType === item.dataType;
      });

      if (index !== -1) {
        if (valueArray.includes(value)) {
          conditionValueArray[index].condition = value;
        } else {
          conditionValueArray[index].amount = value;
        }
      }

      conditionValueArray.forEach(function (valueItem) {
        conditionArray.forEach(function (item) {
          if (item.name === valueItem.name) {
            item.validated = true;
            item.warning = "";
          }
        });
      });
    } else {
      if (valueArray.includes(value)) {
        conditionValueArray.push({
          name: item.name,
          dataType: item.dataType,
          enabled: item.enabled,
          condition: value
        });
      } else {
        conditionValueArray.push({
          name: item.name,
          dataType: item.dataType,
          enabled: item.enabled,
          condition: item.condition[0].value,
          amount: value
        });
        conditionValueArray.forEach(function (valueItem) {
          conditionArray.forEach(function (item) {
            if (item.name === valueItem.name) {
              item.validated = true;
              item.warning = "";
            }
          });
        });
      }
    }

    setConditionsValueArray(conditionValueArray);
    conditionValueArray = [];
  };

  var deleteConditionalElement = function deleteConditionalElement(item) {
    filterData.filter.forEach(function (it) {
      if (it.name === item.name) {
        it.weight = 400;
      }
    });
    var conditionArray = [].concat(conditionsArray);
    var index = conditionArray.findIndex(function (x) {
      return x.name === item.name && x.dataType === item.dataType;
    });

    if (index !== -1) {
      conditionArray.splice(index, 1);
    } else {
      conditionArray = [];
    }

    setConditionsArray(conditionArray);
  };

  var createTextComponentsArray = function createTextComponentsArray(item, value) {
    setShowSavePopUp("none");
    setSaveWarningLabel("");
    setSaveWarningClassName("");
    var textComponentArray = [].concat(textComponentsArray);
    var textComponentValueArray = [].concat(textComponentsValueArray);

    if (textComponentValueArray.length > 0) {
      var index = textComponentValueArray.findIndex(function (x) {
        return x.name === item.name && x.dataType === item.dataType;
      });

      if (index === -1) {
        textComponentValueArray.push({
          name: item.name,
          dataType: item.dataType,
          enabled: item.enabled,
          value: value
        });
      } else {
        textComponentValueArray[index].value = value;
      }

      textComponentValueArray.forEach(function (valueItem) {
        textComponentArray.forEach(function (item) {
          if (item.name === valueItem.name) {
            item.validated = true;
            item.warning = "";
          }
        });
      });
    } else {
      textComponentValueArray.push({
        name: item.name,
        dataType: item.dataType,
        enabled: item.enabled,
        value: value
      });
      textComponentValueArray.forEach(function (valueItem) {
        textComponentArray.forEach(function (item) {
          if (item.name === valueItem.name) {
            item.validated = true;
            item.warning = "";
          }
        });
      });
    }

    setTextComponentsValueArray(textComponentValueArray);
    textComponentValueArray = [];
  };

  var handleTextComponentEnabled = function handleTextComponentEnabled(item) {
    var textComponentArray = [].concat(textComponentsArray);
    var index = textComponentArray.findIndex(function (x) {
      return x.name === item.name && x.dataType === item.dataType;
    });

    if (index !== -1) {
      textComponentArray[index].enabled = !textComponentArray[index].enabled;
    }

    setTextComponentsArray(textComponentArray);
    textComponentArray = [];
    var textComponentValueArray = [].concat(textComponentsValueArray);

    if (textComponentValueArray.length > 0) {
      var _index7 = textComponentValueArray.findIndex(function (x) {
        return x.name === item.name && x.dataType === item.dataType;
      });

      if (_index7 !== -1) {
        textComponentValueArray[_index7].enabled = !textComponentValueArray[_index7].enabled;
      }
    }

    setTextComponentsValueArray(textComponentValueArray);
    textComponentValueArray = [];
  };

  var returnOptions = function returnOptions(name, typeName) {
    var options = [];
    filterData.filter.forEach(function (item) {
      if (item.name === name) {
        item.types.forEach(function (type) {
          if (type.name === typeName) {
            options = [].concat(type.options);
          }
        });
      }
    });
    return options;
  };

  var deleteTextComponentElement = function deleteTextComponentElement(item) {
    filterData.filter.forEach(function (it) {
      if (it.name === item.name) {
        it.weight = 400;
      }
    });
    var textComponentArray = [].concat(textComponentsArray);
    var index = textComponentArray.findIndex(function (x) {
      return x.name === item.name && x.dataType === item.dataType;
    });

    if (index !== -1) {
      textComponentArray.splice(index, 1);
    } else {
      textComponentArray = [];
    }

    setTextComponentsArray(textComponentArray);
  };

  var addAppliedFilters = function addAppliedFilters(items) {
    var autoComplete = [];
    var dateTime = [];
    var condition = [];
    var text = [];
    items.forEach(function (item) {
      if (item.dataType === "AutoComplete") {
        var autoCompleteArray = [].concat(autoComplete);
        var options = returnOptions(item.name, item.type);

        if (autoCompleteArray.length > 0) {
          var index = autoCompleteArray.findIndex(function (x) {
            return x.name === item.name && item.type === x.type;
          });

          if (index === -1) {
            autoCompleteArray.push({
              name: item.name,
              dataType: item.dataType,
              type: item.type,
              enabled: item.enabled,
              value: item.value,
              objectArray: options
            });
          }
        } else {
          autoCompleteArray.push({
            name: item.name,
            dataType: item.dataType,
            type: item.type,
            enabled: item.enabled,
            value: item.value,
            objectArray: options
          });
        }

        autoComplete = autoCompleteArray;
      } else if (item.dataType === "DateTime") {
        var dateTimeArray = [].concat(dateTime);

        if (dateTimeArray.length === 0) {
          dateTimeArray.push({
            name: item.name,
            dataType: item.dataType,
            enabled: item.enabled,
            field: []
          });
          dateTimesValueArray.forEach(function (item) {
            if (item.fieldValue) {
              dateTimeArray.forEach(function (dt) {
                dt.field.push({
                  column: item.fieldValue,
                  value: item.value
                });
              });
            }
          });
        }

        dateTime = dateTimeArray;
      } else if (item.dataType === "Numeric") {
        var conditionArray = [].concat(condition);

        if (conditionArray.length === 0) {
          conditionArray.push({
            name: item.name,
            dataType: item.dataType,
            enabled: item.enabled,
            condition: [],
            amount: item.amount,
            value: item.condition
          });
          filterData.filter.forEach(function (data) {
            if (data.dataType === "Numeric") {
              data.condition.forEach(function (values) {
                conditionArray.forEach(function (item) {
                  item.condition.push({
                    value: values.value
                  });
                });
              });
            }
          });
        }

        condition = conditionArray;
      } else {
        var textComponentArray = [].concat(textComponentsArray);

        if (textComponentArray.length > 0) {
          var _index8 = textComponentArray.findIndex(function (x) {
            return x.name === item.name;
          });

          if (_index8 === -1) {
            textComponentArray.push({
              name: item.name,
              dataType: item.dataType,
              enabled: item.enabled,
              value: item.value
            });
          }
        } else {
          textComponentArray.push({
            name: item.name,
            dataType: item.dataType,
            enabled: item.enabled,
            value: item.value
          });
        }

        text = textComponentArray;
      }

      setAutoCompletesArray(autoComplete);
      setDateTimesArray(dateTime);
      setConditionsArray(condition);
      setTextComponentsArray(text);
    });
    setApplyFilter(true);
  };

  var addSavedFilters = function addSavedFilters(item) {
    setFilterShow("");
    setRecentFilterShow("none");
    var autoComplete = [];
    var condition = [];
    var text = [];
    var tempArr = [];
    var savedFilters = [];

    for (var objects in item) {
      item[objects].forEach(function (arrays) {
        for (var array in arrays) {
          tempArr.push(arrays[array]);
        }
      });
    }

    var arr = [];
    tempArr.forEach(function (arrays) {
      arrays.forEach(function (array) {
        savedFilters.push(array);
      });
    });
    savedFilters.forEach(function (items) {
      filterData.filter.forEach(function (fil) {
        if (fil.types.length) {
          var index = fil.types.findIndex(function (x) {
            return x.name === items.type && fil.name === items.name;
          });

          if (index !== -1) {
            arr = fil.types[index].options;
          }
        }
      });

      if (items.dataType === "AutoComplete") {
        var autoCompleteArray = [].concat(autoComplete);

        if (autoCompleteArray.length > 0) {
          var index = autoCompleteArray.findIndex(function (x) {
            return x.name === items.name && items.type === x.type;
          });

          if (index === -1) {
            autoCompleteArray.push({
              name: items.name,
              dataType: items.dataType,
              type: items.type,
              enabled: items.enabled,
              value: items.value,
              objectArray: arr
            });
          }
        } else {
          autoCompleteArray.push({
            name: items.name,
            dataType: items.dataType,
            type: items.type,
            enabled: items.enabled,
            value: items.value,
            objectArray: arr
          });
        }

        autoComplete = autoCompleteArray;
      }
    });
    setAutoCompletesArray(autoComplete);
    var saveTempDateTimeArray = [];
    savedFilters.forEach(function (items) {
      if (items.dataType === "DateTime") {
        if (saveTempDateTimeArray.length === 0) {
          saveTempDateTimeArray.push({
            name: items.name,
            dataType: items.dataType,
            enabled: items.enabled,
            field: []
          });
        }
      }
    });
    savedFilters.forEach(function (saved) {
      if (saved.dataType === "DateTime") {
        if (saveTempDateTimeArray.length > 0) {
          saveTempDateTimeArray.forEach(function (filter) {
            filter.field.push({
              column: saved.fieldValue,
              value: saved.value
            });
          });
        }
      }
    });
    setDateTimesArray(saveTempDateTimeArray);
    savedFilters.forEach(function (items) {
      if (items.dataType === "Numeric") {
        var conditionArray = [].concat(condition);

        if (conditionArray.length === 0) {
          conditionArray.push({
            name: items.name,
            dataType: items.dataType,
            enabled: items.enabled,
            condition: [],
            amount: items.amount,
            value: items.condition
          });
          filterData.filter.forEach(function (data) {
            if (data.dataType === "Numeric") {
              data.condition.forEach(function (values) {
                conditionArray.forEach(function (items) {
                  items.condition.push({
                    value: values.value
                  });
                });
              });
            }
          });
        }

        condition = conditionArray;
      }
    });
    setConditionsArray(condition);
    savedFilters.forEach(function (items) {
      if (items.dataType === "Text") {
        var textComponentArray = [].concat(text);

        if (textComponentArray.length > 0) {
          var index = textComponentArray.findIndex(function (x) {
            return x.name === items.name;
          });

          if (index === -1) {
            textComponentArray.push({
              name: items.name,
              dataType: items.dataType,
              enabled: items.enabled,
              value: items.value
            });
          }
        } else {
          textComponentArray.push({
            name: items.name,
            dataType: items.dataType,
            enabled: items.enabled,
            value: items.value
          });
        }

        text = textComponentArray;
      }
    });
    setTextComponentsArray(text);
    setApplyFilter(true);
  };

  var resetDrawer = function resetDrawer() {
    deleteAutoCompleteElement({});
    deleteConditionalElement({});
    deleteDateTimeElement({});
    deleteTextComponentElement({});
    setApplyFilterChip({});
    setRecentFilterShow("");
    setFilterShow("none");
  };

  var _useComponentVisible = useComponentVisible(),
      ref = _useComponentVisible.ref,
      showApplyFilter = _useComponentVisible.showApplyFilter,
      setApplyFilter = _useComponentVisible.setApplyFilter;

  return /*#__PURE__*/React__default.createElement("div", {
    ref: ref
  }, showApplyFilter && /*#__PURE__*/React__default.createElement("div", {
    className: "filter--grid",
    ref: ref
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "filter__wrap"
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "filter__list"
  }, /*#__PURE__*/React__default.createElement(LeftDrawer, {
    filterData: filterData,
    fromLeftToRight: fromLeftToRight
  })), /*#__PURE__*/React__default.createElement("div", {
    className: "filter__inputwrap"
  }, /*#__PURE__*/React__default.createElement(RightDrawer, {
    applyFilter: applyFilter,
    saveFilter: saveFilter,
    createAutoCompleteArray: createAutoCompleteArray,
    handleAutoCompleteEnabled: handleAutoCompleteEnabled,
    deleteAutoCompleteElement: deleteAutoCompleteElement,
    autoCompleteArray: autoCompletesArray,
    dateTimesArray: dateTimesArray,
    deleteDateTimeElement: deleteDateTimeElement,
    handleDateTimeEnabled: handleDateTimeEnabled,
    createDateTimeArray: createDateTimeArray,
    addToday: addToday,
    addTomorrow: addTomorrow,
    addThisMonth: addThisMonth,
    addForteenDays: addForteenDays,
    addSevenDays: addSevenDays,
    addThisWeek: addThisWeek,
    addThirtyDays: addThirtyDays,
    lastDayChange: lastDayChange,
    nextDayChange: nextDayChange,
    conditionsArray: conditionsArray,
    handleCondionalEnabled: handleCondionalEnabled,
    createConditionalArray: createConditionalArray,
    deleteConditionalElement: deleteConditionalElement,
    textComponentsArray: textComponentsArray,
    deleteTextComponentElement: deleteTextComponentElement,
    createTextComponentsArray: createTextComponentsArray,
    handleTextComponentEnabled: handleTextComponentEnabled,
    closeDrawer: closeDrawer,
    resetDrawer: resetDrawer,
    filterCount: filterCount,
    saveWarningClassName: saveWarningClassName,
    saveWarningLabel: saveWarningLabel,
    showSavePopUp: showSavePopUp,
    emptyFilterClassName: emptyFilterClassName,
    emptyFilterWarning: emptyFilterWarning,
    openShowSavePopUp: openShowSavePopUp,
    recentFilterShow: recentFilterShow,
    filterShow: filterShow,
    addSavedFilters: addSavedFilters
  })))), /*#__PURE__*/React__default.createElement(MainFilterPanel, {
    showDrawer: showDrawer,
    applyFilterChip: applyFilterChip,
    addAppliedFilters: addAppliedFilters,
    addSavedFilters: addSavedFilters,
    addingToFavourite: props.addingToFavourite
  }));
}

module.exports = Filter;
//# sourceMappingURL=index.js.map
