import React, { useState, useRef, useEffect } from "react";
import RightDrawer from "./drawer/RightDrawer";
import LeftDrawer from "./drawer/LeftDrawer";
import MainFilterPanel from "./panel/MainFilterPanel";
// eslint-disable-next-line import/no-unresolved
import "!style-loader!css-loader!sass-loader!./Styles/main.scss";

/**
 * Component handling clock outside close of Drawer
 */
function useComponentVisible() {
  const [showApplyFilter, setApplyFilter] = useState(false);

  const ref = useRef(null);

  /**
   * Method To sort the rows for a particular column
   * @param {*} event is the event that is getting passed when an outside click is triggered
   */
  const handleHideDropdown = (event) => {
    if (event.key === "Escape") {
      setApplyFilter(false);
    }
  };
  /**
   * Method To sort the rows for a particular column
   * @param {*} event it is the event triggered on the ref div when click happens
   */
  const handleClickOutside = (event) => {
    if (ref.current && !ref.current.contains(event.target)) {
      setApplyFilter(false);
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleHideDropdown, true);
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("keydown", handleHideDropdown, true);
      document.removeEventListener("click", handleClickOutside, true);
    };
  });

  return { ref, showApplyFilter, setApplyFilter };
}
export default function Filter(props) {
  const [autoCompletesValueArray, setAutoCompletesValueArray] = useState([]);
  const [autoCompletesArray, setAutoCompletesArray] = useState([]);
  const [dateTimesArray, setDateTimesArray] = useState([]);
  const [dateTimesValueArray, setDateTimesValueArray] = useState([]);
  const [conditionsArray, setConditionsArray] = useState([]);
  const [conditionsValueArray, setConditionsValueArray] = useState([]);
  const [textComponentsArray, setTextComponentsArray] = useState([]);
  const [textComponentsValueArray, setTextComponentsValueArray] = useState([]);
  const [applyFilterChip, setApplyFilterChip] = useState({});
  const [filterCount, setFilterCount] = useState(0);
  const [filterData, setFilterData] = useState({});
  const [showSavePopUp, setShowSavePopUp] = useState("none");
  const [saveWarningLabel, setSaveWarningLabel] = useState("");
  const [saveWarningClassName, setSaveWarningClassName] = useState("");
  const [emptyFilterWarning, setEmptyFilterWarning] = useState("");
  const [emptyFilterClassName, setEmptyFilterClassName] = useState("");
  const [recentFilterShow, setRecentFilterShow] = useState("none");
  const [filterShow, setFilterShow] = useState("");

  useEffect(() => {
    setFilterData(props.filterData);
  }, [props.filterData]);
  useEffect(() => {
    let count = 0;
    count =
      autoCompletesArray.length +
      dateTimesArray.length +
      conditionsArray.length +
      textComponentsArray.length;
    setFilterCount(count);
  }, [
    autoCompletesArray,
    dateTimesArray,
    conditionsArray,
    textComponentsArray,
  ]);
  /**
   * Method set the state which shows the drawer when on true condition
   */
  const showDrawer = () => {
    setApplyFilter(true);
  };
  /**
   * Method set the state which closes the drawer when the state is in false condition
   */
  const closeDrawer = () => {
    setApplyFilter(false);
  };
  /**
   * Method To show the save popup
   */
  const openShowSavePopUp = () => {
    setShowSavePopUp("");
  };
  /**
   * Method which creates the array which contains the elements to be shown in the applied filter chips
   */

  const applyFilter = () => {
    if (filterCount > 0) {
      setEmptyFilterClassName("");
      setEmptyFilterWarning("");
      let applyFilter = {
        applyFilterArray: [],
      };
      let tempObj = { applyFilter: [] };
      let obj = [];
      if (autoCompletesValueArray.length > 0) {
        autoCompletesValueArray.forEach((item) => {
          tempObj.applyFilter.push(item);
          obj.push(Object.assign({}, item));
        });
        applyFilter.applyFilterArray.push({
          autoComplete: autoCompletesValueArray,
        });
      }
      if (dateTimesValueArray.length > 0) {
        dateTimesValueArray.forEach((item) => {
          tempObj.applyFilter.push(item);
          obj.push(Object.assign({}, item));
        });
        applyFilter.applyFilterArray.push({ dateTime: dateTimesValueArray });
      }
      if (conditionsValueArray.length > 0) {
        conditionsValueArray.forEach((item) => {
          tempObj.applyFilter.push(item);
          obj.push(Object.assign({}, item));
        });
        applyFilter.applyFilterArray.push({
          conditional: conditionsValueArray,
        });
      }
      if (textComponentsValueArray.length > 0) {
        textComponentsValueArray.forEach((item) => {
          tempObj.applyFilter.push(item);
          obj.push(Object.assign({}, item));
        });
        applyFilter.applyFilterArray.push({
          textComponent: textComponentsValueArray,
        });
      }
      setApplyFilterChip(tempObj);
      obj.forEach((objec) => {
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
  /**
   * Method To save the filters
   * @param {*} value is saved filter from the saved filter popup list
   */
  const saveFilter = (value) => {
    let obj = [];
    if (value.length > 0) {
      if (
        !(
          autoCompletesValueArray.length > 0 ||
          dateTimesValueArray.length > 0 ||
          conditionsValueArray.length > 0 ||
          textComponentsValueArray.length > 0
        )
      ) {
        setShowSavePopUp("");
        setSaveWarningClassName("text-danger");
        setSaveWarningLabel("No filters selected or values entered");
      } else {
        let savedFilter = {
          filter: [],
        };
        if (autoCompletesValueArray.length > 0) {
          let autoCompleteArray = [...autoCompletesArray];
          autoCompleteArray.forEach((item) => {
            autoCompletesValueArray.forEach((valueItem) => {
              if (
                valueItem.name === item.name &&
                valueItem.type === item.type
              ) {
                item.validated = true;
                item.warning = "";
              }
            });
          });
          setAutoCompletesArray(autoCompleteArray);
          let count = 0;
          autoCompletesArray.forEach((item) => {
            if (item.validated === false) {
              count++;
            }
          });
          if (count === 0) {
            savedFilter.filter.push({ autoComplete: autoCompletesValueArray });
          } else {
            setShowSavePopUp("");
            setSaveWarningClassName("text-danger");
            setSaveWarningLabel("Enter values in every field");
          }
          autoCompleteArray = [];
        } else {
          let autoCompleteArray = [...autoCompletesArray];
          autoCompleteArray.forEach((item) => {
            item.validated = false;
          });
          setAutoCompletesArray(autoCompleteArray);
          autoCompleteArray = [];
        }
        if (dateTimesValueArray.length > 0) {
          let dateTimeArray = [...dateTimesArray];
          dateTimeArray.forEach((item) => {
            dateTimesValueArray.forEach((valueItem) => {
              if (valueItem.name === item.name) {
                item.validated = true;
                item.warning = "";
              }
            });
          });
          setDateTimesArray(dateTimeArray);
          let count = 0;
          dateTimesArray.forEach((item) => {
            if (item.validated === false) {
              count++;
            }
          });
          if (count === 0) {
            savedFilter.filter.push({ dateTime: dateTimesValueArray });
          } else {
            setShowSavePopUp("");
            setSaveWarningClassName("text-danger");
            setSaveWarningLabel("Enter values in every field");
          }
          dateTimeArray = [];
        } else {
          let dateTimeArray = [...dateTimesArray];
          dateTimeArray.forEach((item) => {
            item.validated = false;
          });
          setDateTimesArray(dateTimeArray);
          dateTimeArray = [];
        }
        if (conditionsValueArray.length > 0) {
          let conditionArray = [...conditionsArray];
          conditionArray.forEach((item) => {
            conditionsValueArray.forEach((valueItem) => {
              if (valueItem.name === item.name) {
                item.validated = true;
                item.warning = "";
              }
            });
          });
          setConditionsArray(conditionArray);
          let count = 0;
          conditionsArray.forEach((item) => {
            if (item.validated === false) {
              count++;
            }
          });
          if (count === 0) {
            savedFilter.filter.push({ conditional: conditionsValueArray });
          } else {
            setShowSavePopUp("");
            setSaveWarningClassName("text-danger");
            setSaveWarningLabel("Enter values in every field");
          }
          conditionArray = [];
        } else {
          let conditionArray = [...conditionsArray];
          conditionArray.forEach((item) => {
            item.validated = false;
          });
          setConditionsArray(conditionArray);
          conditionArray = [];
        }
        if (textComponentsValueArray.length > 0) {
          let textComponentArray = [...textComponentsArray];
          textComponentArray.forEach((item) => {
            textComponentsValueArray.forEach((valueItem) => {
              if (valueItem.name === item.name) {
                item.validated = true;
                item.warning = "";
              }
            });
          });
          setTextComponentsArray(textComponentArray);
          let count = 0;
          textComponentArray.forEach((item) => {
            if (item.validated === false) {
              count++;
            }
          });
          if (count === 0) {
            savedFilter.filter.push({
              textComponent: textComponentsValueArray,
            });
          } else {
            setShowSavePopUp("");
            setSaveWarningClassName("text-danger");
            setSaveWarningLabel("Enter values in every field");
          }
          textComponentArray = [];
        } else {
          let textComponentArray = [...textComponentsArray];
          textComponentArray.forEach((item) => {
            item.validated = false;
          });
          setTextComponentsArray(textComponentArray);
          textComponentArray = [];
        }
        if (savedFilter.filter.length > 0) {
          savedFilter[value] = savedFilter["filter"];
          delete savedFilter.filter;
          let savedFilters = localStorage.getItem("savedFilters");
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
    autoCompletesValueArray.forEach((item) => {
      obj.push(Object.assign({}, item));
    });
    dateTimesValueArray.forEach((item) => {
      obj.push(Object.assign({}, item));
    });
    conditionsValueArray.forEach((item) => {
      obj.push(Object.assign({}, item));
    });
    textComponentsValueArray.forEach((item) => {
      obj.push(Object.assign({}, item));
    });
    obj.forEach((objec) => {
      delete objec.dataType;
      delete objec.enabled;
    });
    props.savedFilters(obj);
  };
  /**
   * Method To create the filter arrays for each specific type based on datatype
   * @param {*} name is the name of the filter
   * @param {*} dataType is the dataType of the filter
   * @param {*} enabled is initial enabled status of the filter
   * @param {*} type is the type array of the filter if present
   * @param {*} field is the field array of the filter if present
   * @param {*} condition is the condition array of the filter if present
   * @param {*} options is the options array of the filter if present
   */
  const fromLeftToRight = (
    name,
    dataType,
    enabled,
    type,
    field,
    condition,
    dataSource,
    warning,
    options
  ) => {
    setShowSavePopUp("none");
    setSaveWarningLabel("");
    setSaveWarningClassName("");
    setEmptyFilterClassName("");
    setEmptyFilterWarning("");
    if (dataType === "AutoComplete") {
      let value = {
        name: name,
        type: type,
        dataType: dataType,
        enabled: enabled,
        objectArray: [],
      };
      filterData.filter.forEach((item) => {
        if (item.name === value.name) {
          item.weight = 700;
          item.types.forEach((tip) => {
            if (tip.name === value.type) {
              tip.weight = 600;
            }
          });
        }
      });
      let autoCompleteArray = [...autoCompletesArray];
      if (autoCompleteArray.length > 0) {
        let index = autoCompleteArray.findIndex(
          (x) => x.name === value.name && x.type === value.type
        );
        if (index === -1) {
          autoCompleteArray.push({
            name: name,
            type: type,
            dataType: dataType,
            enabled: enabled,
            objectArray: options,
            validated: false,
            warning: warning,
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
          warning: warning,
        });
      }
      setAutoCompletesArray(autoCompleteArray);
      autoCompleteArray = [];
    }
    if (dataType === "DateTime") {
      let value = {
        name: name,
        dataType: dataType,
        enabled: enabled,
        field: field,
        validated: false,
        warning: warning,
      };
      filterData.filter.forEach((item) => {
        if (item.name === value.name) {
          item.weight = 700;
        }
      });
      let dateTimeArray = [...dateTimesArray];
      if (dateTimeArray.length > 0) {
        let index = dateTimeArray.findIndex(
          (x) => x.name === value.name && x.field === value.field
        );
        if (index === -1) {
          dateTimeArray.push({
            name: name,
            dataType: dataType,
            enabled: enabled,
            field: field,
            validated: false,
            warning: warning,
          });
        }
      } else {
        dateTimeArray.push({
          name: name,
          dataType: dataType,
          enabled: enabled,
          field: field,
          validated: false,
          warning: warning,
        });
      }
      setDateTimesArray(dateTimeArray);
      dateTimeArray = [];
    }
    if (dataType === "Numeric") {
      let value = {
        name: name,
        dataType: dataType,
        enabled: enabled,
        condition: condition,
        amount: "",
        validated: false,
        warning: warning,
      };
      filterData.filter.forEach((item) => {
        if (item.name === value.name) {
          item.weight = 700;
        }
      });
      let conditionArray = [...conditionsArray];
      if (conditionArray.length > 0) {
        let index = conditionArray.findIndex(
          (x) => x.name === value.name && x.condition === value.condition
        );
        if (index === -1) {
          conditionArray.push({
            name: name,
            dataType: dataType,
            enabled: enabled,
            condition: condition,
            amount: "",
            validated: false,
            warning: warning,
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
          warning: warning,
        });
      }
      setConditionsArray(conditionArray);
      conditionArray = [];
    }
    if (dataType === "Text") {
      let value = {
        name: name,
        dataType: dataType,
        enabled: enabled,
        validated: false,
        warning: warning,
      };
      filterData.filter.forEach((item) => {
        if (item.name === value.name) {
          item.weight = 700;
        }
      });
      let textComponentArray = [...textComponentsArray];
      if (textComponentArray.length > 0) {
        let index = textComponentArray.findIndex(
          (x) => x.name === value.name && x.dataType === value.dataType
        );
        if (index === -1) {
          textComponentArray.push({
            name: name,
            dataType: dataType,
            enabled: enabled,
            validated: false,
            warning: warning,
          });
        }
      } else {
        textComponentArray.push({
          name: name,
          dataType: dataType,
          enabled: enabled,
          validated: false,
          warning: warning,
        });
      }
      setTextComponentsArray(textComponentArray);
      textComponentArray = [];
    }
  };
  /**
   * Method To create arrays containing values upon change trigger from respective input fields
   * @param {*} item is the specific filter element object
   * @param {*} valueArray is the selected multiselect options
   */
  const createAutoCompleteArray = (item, valueArray) => {
    setShowSavePopUp("none");
    setSaveWarningLabel("");
    setSaveWarningClassName("");
    let autoCompleteArray = [...autoCompletesArray];
    let tempObj = JSON.parse(JSON.stringify(item));
    tempObj.value = valueArray;
    let autoCompleteValueArray = [...autoCompletesValueArray];
    if (autoCompleteValueArray.length > 0) {
      let index = autoCompleteValueArray.findIndex(
        (x) => x.name === tempObj.name && x.type === tempObj.type
      );
      if (index === -1) {
        autoCompleteValueArray.push({
          name: tempObj.name,
          type: tempObj.type,
          dataType: tempObj.dataType,
          enabled: tempObj.enabled,
          value: tempObj.value,
        });
      } else {
        autoCompleteValueArray[index].value = tempObj.value;
      }
      autoCompleteValueArray.forEach((valueItem) => {
        autoCompleteArray.forEach((item) => {
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
        value: tempObj.value,
      });
      autoCompleteValueArray.forEach((valueItem) => {
        autoCompleteArray.forEach((item) => {
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
  /**
   * Method To delete the specific element from filter array upon clicking close
   * @param {*} item is the specific filter element object
   */
  const deleteAutoCompleteElement = (item) => {
    filterData.filter.forEach((it) => {
      it.types.forEach((tip) => {
        if (tip.name === item.type && item.name === it.name) {
          tip.weight = 400;
        }
      });
    });
    let autoCompleteArray = [...autoCompletesArray];
    let index = autoCompleteArray.findIndex(
      (x) => x.name === item.name && x.type === item.type
    );
    if (index !== -1) {
      autoCompleteArray.splice(index, 1);
    } else {
      autoCompleteArray = [];
    }
    setAutoCompletesArray(autoCompleteArray);
    autoCompleteArray.forEach((aut) => {
      filterData.filter.forEach((fit) => {
        if (fit.types && fit.name !== aut.name && fit.weight === 700) {
          fit.weight = 400;
        }
      });
    });
  };
  /**
   * Method To toggle the switch to enable and disable the input fields
   * @param {*} item is the specific filter element object
   */
  const handleAutoCompleteEnabled = (item) => {
    let autoCompleteArray = [...autoCompletesArray];
    let index = autoCompleteArray.findIndex(
      (x) => x.name === item.name && x.type === item.type
    );
    if (index !== -1) {
      autoCompleteArray[index].enabled = !autoCompleteArray[index].enabled;
    }
    setAutoCompletesArray(autoCompleteArray);
    if (autoCompletesValueArray.length > 0) {
      let autoCompleteValueArray = [...autoCompletesValueArray];
      let index = autoCompleteValueArray.findIndex(
        (x) => x.name === item.name && x.type === item.type
      );
      autoCompleteValueArray[index].enabled = !autoCompleteValueArray[index]
        .enabled;
      setAutoCompletesValueArray(autoCompleteValueArray);
      autoCompleteValueArray = [];
    }
  };
  /**
   * Method To delete the specific element from filter array upon clicking close
   * @param {*} item is the specific filter element object
   */
  const deleteDateTimeElement = (item) => {
    filterData.filter.forEach((it) => {
      if (it.name === item.name) {
        it.weight = 400;
      }
    });
    filterData.filter.forEach((it) => {
      if (it.name === item.name) {
        item.weight = 400;
      }
    });
    let dateTimeArray = [...dateTimesArray];
    let index = dateTimeArray.findIndex((x) => x.name === item.name);
    dateTimeArray.splice(index, 1);
    dateTimeArray.forEach((item) => {
      item.field.forEach((fieldArray) => {
        fieldArray.value = "";
      });
    });
    setDateTimesArray(dateTimeArray);
    dateTimeArray = [];
    filterData.filter.forEach((filters) => {
      if (filters.name === item.name) {
        item.field.forEach((fieldArray) => {
          fieldArray.value = "";
        });
      }
    });
    if (item === {}) {
      setDateTimesValueArray([]);
    }
  };
  /**
   * Method To toggle the switch to enable and disable the input fields
   * @param {*} item is the specific filter element object
   */
  const handleDateTimeEnabled = (item) => {
    let dateTimeArray = [...dateTimesArray];
    let index = dateTimeArray.findIndex(
      (x) => x.name === item.name && x.field === item.field
    );
    if (index !== -1) {
      dateTimeArray[index].enabled = !dateTimeArray[index].enabled;
    }
    setDateTimesArray(dateTimeArray);
    dateTimeArray = [];
    if (dateTimesValueArray.length > 0) {
      let dateTimeValueArray = [...dateTimesValueArray];
      let tempArray = [];
      item.field.forEach((item) => {
        tempArray.push(item.column);
      });
      let index = dateTimeValueArray.findIndex(
        (x) => x.name === item.name && tempArray.includes(x.fieldValue)
      );
      if (index !== -1) {
        dateTimeValueArray.forEach((item) => {
          item.enabled = !item.enabled;
        });
      }

      setDateTimesValueArray(dateTimeValueArray);
      dateTimeValueArray = [];
    }
  };
  /**
   * Method To create arrays containing values upon change trigger from respective input fields
   * @param {*} item is the specific filter element object
   * @param {*} fieldName is the specific type of field/date in which change is happening
   * @param {*} value is value of the field
   */
  const createDateTimeArray = (item, fieldName, value) => {
    setShowSavePopUp("none");
    setSaveWarningLabel("");
    setSaveWarningClassName("");
    let dateTimeArray = [...dateTimesArray];
    console.log(dateTimesArray);
    console.log(value);
    let tempObj = JSON.parse(JSON.stringify(item));
    tempObj.fieldValue = fieldName;
    tempObj.value = value;
    let dateTimeValueArray = [...dateTimesValueArray];
    if (dateTimeValueArray.length > 0) {
      let index = dateTimeValueArray.findIndex(
        (x) => x.fieldValue === tempObj.fieldValue && x.name === tempObj.name
      );
      if (index === -1) {
        dateTimeValueArray.push({
          name: tempObj.name,
          dataType: tempObj.dataType,
          enabled: tempObj.enabled,
          fieldValue: tempObj.fieldValue,
          value: tempObj.value,
        });
      } else {
        dateTimeValueArray[index].value = tempObj.value;
      }
      dateTimeValueArray.forEach((valueItem) => {
        dateTimeArray.forEach((item) => {
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
        value: tempObj.value,
      });
      dateTimeValueArray.forEach((valueItem) => {
        dateTimeArray.forEach((item) => {
          if (item.name === valueItem.name) {
            item.validated = true;
            item.warning = "";
          }
        });
      });
    }
    setDateTimesValueArray(dateTimeValueArray);
    dateTimeValueArray = [];
    dateTimeArray = [...dateTimesArray];
    if (dateTimeArray.length > 0) {
      dateTimeArray.forEach((item) => {
        item.field.forEach((fieldArray) => {
          if (fieldArray.column === fieldName) {
            fieldArray.value = value;
          }
        });
      });
      setDateTimesArray(dateTimeArray);
    }
    dateTimeArray = [];
  };
  /**
   * Method to Convert Date to required Format as per value of type
   * @param {String} inputDate
   * @param {String} type
   */
  const getValueOfDate = (dateValue) => {
    const date = new Date(dateValue);
    console.log(date);
    const dateTimeFormat = new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "numeric",
      seconds: "numeric",
    });
    const [
      { value: month },
      ,
      { value: day },
      ,
      { value: year },
      ,
      { value: hour },
      ,
      { value: minute },
      ,
      { value: seconds },
    ] = dateTimeFormat.formatToParts(date);
    return `${year}-${month}-${day}${"T"}${hour}:${minute}`;
  };
  /**
   * Method To set both from date and to date as todays date
   */
  const addToday = () => {
    let todayDate = new Date();
    let dated = getValueOfDate(todayDate);
    console.log(dated);
    let dateTimeArray = [...dateTimesArray];
    let dateTimeValueArray = [...dateTimesValueArray];
    if (dateTimeArray.length > 0) {
      dateTimeArray.forEach((item) => {
        item.field.forEach((fieldArray) => {
          fieldArray.value = dated;
          if (dateTimeValueArray.length > 1) {
            dateTimeValueArray.forEach((item) => {
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
              value: dated,
            });
          }
        });
      });
      setDateTimesArray(dateTimeArray);
      setDateTimesValueArray(dateTimeValueArray);
    }
  };
  /**
   * Method To set both from date and to date as tomorrow's date
   */
  const addTomorrow = () => {
    let fromDate = new Date();
    let toDate = new Date();
    fromDate.setDate(fromDate.getDate() + 1);
    toDate.setDate(toDate.getDate() + 1);
    fromDate = getValueOfDate(fromDate);
    toDate = getValueOfDate(toDate);
    let dateTimeArray = [...dateTimesArray];
    let dateTimeValueArray = [...dateTimesValueArray];
    if (dateTimeArray.length > 0) {
      dateTimeArray.forEach((item) => {
        item.field[0].value = fromDate;
        item.field[1].value = toDate;
        item.field.forEach((fieldArray) => {
          if (dateTimeValueArray.length > 1) {
            dateTimeValueArray.forEach((arr) => {
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
              value: fieldArray.value,
            });
          }
        });
      });

      setDateTimesArray(dateTimeArray);
      setDateTimesValueArray(dateTimeValueArray);
    }
  };
  /**
   * Method To set the date range as this month
   */
  const addThisMonth = () => {
    let today = new Date();
    let fromDate = new Date(today.getFullYear(), today.getMonth(), 1);
    let toDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    fromDate = getValueOfDate(fromDate);
    toDate = getValueOfDate(toDate);
    let dateTimeArray = [...dateTimesArray];
    let dateTimeValueArray = [...dateTimesValueArray];
    if (dateTimeArray.length > 0) {
      dateTimeArray.forEach((item) => {
        item.field[0].value = fromDate;
        item.field[1].value = toDate;
        item.field.forEach((fieldArray) => {
          if (dateTimeValueArray.length > 1) {
            dateTimeValueArray.forEach((arr) => {
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
              value: fieldArray.value,
            });
          }
        });
      });

      setDateTimesArray(dateTimeArray);
      setDateTimesValueArray(dateTimeValueArray);
    }
  };
  /**
   * Method To set the date range as next 14 days
   */
  const addForteenDays = () => {
    let fromDate = new Date();
    let toDate = new Date();
    fromDate.setDate(fromDate.getDate() + 1);
    toDate.setDate(toDate.getDate() + 14);
    fromDate = getValueOfDate(fromDate);
    toDate = getValueOfDate(toDate);
    let dateTimeArray = [...dateTimesArray];
    let dateTimeValueArray = [...dateTimesValueArray];
    if (dateTimeArray.length > 0) {
      dateTimeArray.forEach((item) => {
        item.field[0].value = fromDate;
        item.field[1].value = toDate;
        item.field.forEach((fieldArray) => {
          if (dateTimeValueArray.length > 1) {
            dateTimeValueArray.forEach((arr) => {
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
              value: fieldArray.value,
            });
          }
        });
      });

      setDateTimesArray(dateTimeArray);
      setDateTimesValueArray(dateTimeValueArray);
    }
  };
  /**
   * Method To set the date range as next 7 days
   */
  const addSevenDays = () => {
    let fromDate = new Date();
    let toDate = new Date();
    fromDate.setDate(fromDate.getDate() + 1);
    toDate.setDate(toDate.getDate() + 7);
    fromDate = getValueOfDate(fromDate);
    toDate = getValueOfDate(toDate);
    let dateTimeArray = [...dateTimesArray];
    let dateTimeValueArray = [...dateTimesValueArray];
    if (dateTimeArray.length > 0) {
      dateTimeArray.forEach((item) => {
        item.field[0].value = fromDate;
        item.field[1].value = toDate;
        item.field.forEach((fieldArray) => {
          if (dateTimeValueArray.length > 1) {
            dateTimeValueArray.forEach((arr) => {
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
              value: fieldArray.value,
            });
          }
        });
      });

      setDateTimesArray(dateTimeArray);
      setDateTimesValueArray(dateTimeValueArray);
    }
  };
  /**
   * Method To set the date range as current week Sunday to Saturday
   */
  const addThisWeek = () => {
    let today = new Date();
    let from = today.getDate() - today.getDay();
    let to = from + 6;
    let fromDate = new Date(today.setDate(from)).toUTCString();
    let toDate = new Date(today.setDate(to)).toUTCString();
    fromDate = getValueOfDate(fromDate);
    toDate = getValueOfDate(toDate);
    let dateTimeArray = [...dateTimesArray];
    let dateTimeValueArray = [...dateTimesValueArray];
    if (dateTimeArray.length > 0) {
      dateTimeArray.forEach((item) => {
        item.field[0].value = fromDate;
        item.field[1].value = toDate;
        item.field.forEach((fieldArray) => {
          if (dateTimeValueArray.length > 1) {
            dateTimeValueArray.forEach((arr) => {
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
              value: fieldArray.value,
            });
          }
        });
      });

      setDateTimesArray(dateTimeArray);
      setDateTimesValueArray(dateTimeValueArray);
    }
  };
  /**
   * Method To set the date range as next 30 days
   */
  const addThirtyDays = () => {
    let from = new Date();
    let to = new Date();
    from.setDate(from.getDate() + 1);
    to.setDate(to.getDate() + 30);
    let fromDate = getValueOfDate(from);
    let toDate = getValueOfDate(to);
    let dateTimeArray = [...dateTimesArray];
    let dateTimeValueArray = [...dateTimesValueArray];
    if (dateTimeArray.length > 0) {
      dateTimeArray.forEach((item) => {
        item.field[0].value = fromDate;
        item.field[1].value = toDate;
        item.field.forEach((fieldArray) => {
          if (dateTimeValueArray.length > 1) {
            dateTimeValueArray.forEach((arr) => {
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
              value: fieldArray.value,
            });
          }
        });
      });

      setDateTimesArray(dateTimeArray);
      setDateTimesValueArray(dateTimeValueArray);
    }
  };
  /**
   * Method To set the date range as next n days
   * @param {*} value is the no: of days after today
   */
  const nextDayChange = (value) => {
    if (value === "") {
      value = 1;
    }
    let fromDate = new Date();
    let toDate = new Date();
    if (value !== "0") {
      fromDate.setDate(fromDate.getDate() + 1);
      toDate.setDate(toDate.getDate() + parseInt(value));
    }
    fromDate = getValueOfDate(fromDate);
    toDate = getValueOfDate(toDate);
    let dateTimeArray = [...dateTimesArray];
    let dateTimeValueArray = [...dateTimesValueArray];
    if (dateTimeArray.length > 0) {
      dateTimeArray.forEach((item) => {
        item.field[0].value = fromDate;
        item.field[1].value = toDate;
        item.field.forEach((fieldArray) => {
          if (dateTimeValueArray.length > 1) {
            dateTimeValueArray.forEach((arr) => {
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
              value: fieldArray.value,
            });
          }
        });
      });

      setDateTimesArray(dateTimeArray);
      setDateTimesValueArray(dateTimeValueArray);
    }
  };
  /**
   * Method To set the date range as last n days
   * @param {*} value is the no: of days before today
   */
  const lastDayChange = (value) => {
    if (value === "") {
      value = 1;
    }
    let fromDate = new Date();
    let toDate = new Date();
    if (value !== "0") {
      fromDate.setDate(fromDate.getDate() - parseInt(value));
      toDate.setDate(toDate.getDate() - 1);
    }
    fromDate = getValueOfDate(fromDate);
    toDate = getValueOfDate(toDate);
    let dateTimeArray = [...dateTimesArray];
    let dateTimeValueArray = [...dateTimesValueArray];
    if (dateTimeArray.length > 0) {
      dateTimeArray.forEach((item) => {
        item.field[0].value = fromDate;
        item.field[1].value = toDate;
        item.field.forEach((fieldArray) => {
          if (dateTimeValueArray.length > 1) {
            dateTimeValueArray.forEach((arr) => {
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
              value: fieldArray.value,
            });
          }
        });
      });

      setDateTimesArray(dateTimeArray);
      setDateTimesValueArray(dateTimeValueArray);
    }
  };
  /**
   * Method To toggle the switch to enable and disable the input fields
   * @param {*} item is the specific filter element object
   */
  const handleCondionalEnabled = (item) => {
    let conditionArray = [...conditionsArray];
    let index = conditionArray.findIndex(
      (x) => x.name === item.name && x.condition === item.condition
    );
    if (index !== -1) {
      conditionArray[index].enabled = !conditionArray[index].enabled;
    }
    setConditionsArray(conditionArray);
    let conditionValueArray = [];
    conditionValueArray = [...conditionsValueArray];
    if (conditionValueArray.length > 0) {
      let index = conditionValueArray.findIndex(
        (x) => x.name === item.name && x.dataType === item.dataType
      );
      conditionValueArray[index].enabled = !conditionValueArray[index].enabled;
    }
    setConditionsValueArray(conditionValueArray);
    conditionValueArray = [];
  };
  /**
   * Method To create arrays containing values upon change trigger from respective input fields
   * @param {*} item is the specific filter element object
   * @param {*} value is value of the input field
   */
  const createConditionalArray = (item, value) => {
    setShowSavePopUp("none");
    setSaveWarningLabel("");
    setSaveWarningClassName("");
    let conditionArray = [...conditionsArray];
    let valueArray = [];
    item.condition.forEach((it) => {
      valueArray.push(it.value);
    });
    let conditionValueArray = [...conditionsValueArray];
    if (conditionValueArray.length > 0) {
      let index = conditionValueArray.findIndex(
        (x) => x.name === item.name && x.dataType === item.dataType
      );
      if (index !== -1) {
        if (valueArray.includes(value)) {
          conditionValueArray[index].condition = value;
        } else {
          conditionValueArray[index].amount = value;
        }
      }
      conditionValueArray.forEach((valueItem) => {
        conditionArray.forEach((item) => {
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
          condition: value,
        });
      } else {
        conditionValueArray.push({
          name: item.name,
          dataType: item.dataType,
          enabled: item.enabled,
          condition: item.condition[0].value,
          amount: value,
        });
        conditionValueArray.forEach((valueItem) => {
          conditionArray.forEach((item) => {
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
  /**
   * Method To delete the specific element from filter array upon clicking close
   * @param {*} item is the specific filter element object
   */
  const deleteConditionalElement = (item) => {
    filterData.filter.forEach((it) => {
      if (it.name === item.name) {
        it.weight = 400;
      }
    });
    let conditionArray = [...conditionsArray];
    let index = conditionArray.findIndex(
      (x) => x.name === item.name && x.dataType === item.dataType
    );
    if (index !== -1) {
      conditionArray.splice(index, 1);
    } else {
      conditionArray = [];
    }
    setConditionsArray(conditionArray);
  };
  /**
   * Method To create arrays containing values upon change trigger from respective input fields
   * @param {*} item is the specific filter element object
   * @param {*} value is value of the input field
   */
  const createTextComponentsArray = (item, value) => {
    setShowSavePopUp("none");
    setSaveWarningLabel("");
    setSaveWarningClassName("");
    let textComponentArray = [...textComponentsArray];
    let textComponentValueArray = [...textComponentsValueArray];
    if (textComponentValueArray.length > 0) {
      let index = textComponentValueArray.findIndex(
        (x) => x.name === item.name && x.dataType === item.dataType
      );
      if (index === -1) {
        textComponentValueArray.push({
          name: item.name,
          dataType: item.dataType,
          enabled: item.enabled,
          value: value,
        });
      } else {
        textComponentValueArray[index].value = value;
      }
      textComponentValueArray.forEach((valueItem) => {
        textComponentArray.forEach((item) => {
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
        value: value,
      });
      textComponentValueArray.forEach((valueItem) => {
        textComponentArray.forEach((item) => {
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
  /**
   * Method To toggle the switch to enable and disable the input fields
   * @param {*} item is the specific filter element object
   */
  const handleTextComponentEnabled = (item) => {
    let textComponentArray = [...textComponentsArray];
    let index = textComponentArray.findIndex(
      (x) => x.name === item.name && x.dataType === item.dataType
    );
    if (index !== -1) {
      textComponentArray[index].enabled = !textComponentArray[index].enabled;
    }
    setTextComponentsArray(textComponentArray);
    textComponentArray = [];
    let textComponentValueArray = [...textComponentsValueArray];
    if (textComponentValueArray.length > 0) {
      let index = textComponentValueArray.findIndex(
        (x) => x.name === item.name && x.dataType === item.dataType
      );
      if (index !== -1) {
        textComponentValueArray[index].enabled = !textComponentValueArray[index]
          .enabled;
      }
    }
    setTextComponentsValueArray(textComponentValueArray);
    textComponentValueArray = [];
  };
  /**
   * Method To return the specific options array for autoComplete element
   * @param {*} name is the name of the filter
   * @param {*} typeName is the type of the filter
   */
  const returnOptions = (name, typeName) => {
    let options = [];
    filterData.filter.forEach((item) => {
      if (item.name === name) {
        item.types.forEach((type) => {
          if (type.name === typeName) {
            options = [...type.options];
          }
        });
      }
    });
    return options;
  };
  /**
   * Method To delete the specific element from filter array upon clicking close
   * @param {*} item is the specific filter element object
   */
  const deleteTextComponentElement = (item) => {
    filterData.filter.forEach((it) => {
      if (it.name === item.name) {
        it.weight = 400;
      }
    });
    let textComponentArray = [...textComponentsArray];
    let index = textComponentArray.findIndex(
      (x) => x.name === item.name && x.dataType === item.dataType
    );
    if (index !== -1) {
      textComponentArray.splice(index, 1);
    } else {
      textComponentArray = [];
    }
    setTextComponentsArray(textComponentArray);
  };
  /**
   * Method To map the applied filters to drawer on clicking the chips
   * @param {*} items is the  filter element array
   */
  const addAppliedFilters = (items) => {
    let autoComplete = [];
    let dateTime = [];
    let condition = [];
    let text = [];
    items.forEach((item) => {
      if (item.dataType === "AutoComplete") {
        let autoCompleteArray = [...autoComplete];
        let options = returnOptions(item.name, item.type);
        if (autoCompleteArray.length > 0) {
          let index = autoCompleteArray.findIndex(
            (x) => x.name === item.name && item.type === x.type
          );

          if (index === -1) {
            autoCompleteArray.push({
              name: item.name,
              dataType: item.dataType,
              type: item.type,
              enabled: item.enabled,
              value: item.value,
              objectArray: options,
            });
          }
        } else {
          autoCompleteArray.push({
            name: item.name,
            dataType: item.dataType,
            type: item.type,
            enabled: item.enabled,
            value: item.value,
            objectArray: options,
          });
        }
        autoComplete = autoCompleteArray;
      } else if (item.dataType === "DateTime") {
        let dateTimeArray = [...dateTime];
        if (dateTimeArray.length === 0) {
          dateTimeArray.push({
            name: item.name,
            dataType: item.dataType,
            enabled: item.enabled,
            field: [],
          });
          dateTimesValueArray.forEach((item) => {
            if (item.fieldValue) {
              dateTimeArray.forEach((dt) => {
                dt.field.push({
                  column: item.fieldValue,
                  value: item.value,
                });
              });
            }
          });
        }
        dateTime = dateTimeArray;
      } else if (item.dataType === "Numeric") {
        let conditionArray = [...condition];
        if (conditionArray.length === 0) {
          conditionArray.push({
            name: item.name,
            dataType: item.dataType,
            enabled: item.enabled,
            condition: [],
            amount: item.amount,
            value: item.condition,
          });
          filterData.filter.forEach((data) => {
            if (data.dataType === "Numeric") {
              data.condition.forEach((values) => {
                conditionArray.forEach((item) => {
                  item.condition.push({ value: values.value });
                });
              });
            }
          });
        }
        condition = conditionArray;
      } else {
        let textComponentArray = [...textComponentsArray];
        if (textComponentArray.length > 0) {
          let index = textComponentArray.findIndex((x) => x.name === item.name);
          if (index === -1) {
            textComponentArray.push({
              name: item.name,
              dataType: item.dataType,
              enabled: item.enabled,
              value: item.value,
            });
          }
        } else {
          textComponentArray.push({
            name: item.name,
            dataType: item.dataType,
            enabled: item.enabled,
            value: item.value,
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
  /**
   * Method To map the saved filters to drawer on clicking the specific saved filter name
   * @param {*} item is the specific filter element object
   */
  const addSavedFilters = (item) => {
    setFilterShow("");
    setRecentFilterShow("none");
    let autoComplete = [];
    let condition = [];
    let text = [];
    let tempArr = [];
    let savedFilters = [];
    for (let objects in item) {
      item[objects].forEach((arrays) => {
        for (let array in arrays) {
          tempArr.push(arrays[array]);
        }
      });
    }
    let arr = [];
    tempArr.forEach((arrays) => {
      arrays.forEach((array) => {
        savedFilters.push(array);
      });
    });
    savedFilters.forEach((items) => {
      filterData.filter.forEach((fil) => {
        if (fil.types.length) {
          let index = fil.types.findIndex(
            (x) => x.name === items.type && fil.name === items.name
          );
          if (index !== -1) {
            arr = fil.types[index].options;
          }
        }
      });
      if (items.dataType === "AutoComplete") {
        let autoCompleteArray = [...autoComplete];
        if (autoCompleteArray.length > 0) {
          let index = autoCompleteArray.findIndex(
            (x) => x.name === items.name && items.type === x.type
          );
          if (index === -1) {
            autoCompleteArray.push({
              name: items.name,
              dataType: items.dataType,
              type: items.type,
              enabled: items.enabled,
              value: items.value,
              objectArray: arr,
            });
          }
        } else {
          autoCompleteArray.push({
            name: items.name,
            dataType: items.dataType,
            type: items.type,
            enabled: items.enabled,
            value: items.value,
            objectArray: arr,
          });
        }
        autoComplete = autoCompleteArray;
      }
    });
    setAutoCompletesArray(autoComplete);
    let saveTempDateTimeArray = [];
    savedFilters.forEach((items) => {
      if (items.dataType === "DateTime") {
        if (saveTempDateTimeArray.length === 0) {
          saveTempDateTimeArray.push({
            name: items.name,
            dataType: items.dataType,
            enabled: items.enabled,
            field: [],
          });
        }
      }
    });
    savedFilters.forEach((saved) => {
      if (saved.dataType === "DateTime") {
        if (saveTempDateTimeArray.length > 0) {
          saveTempDateTimeArray.forEach((filter) => {
            filter.field.push({
              column: saved.fieldValue,
              value: saved.value,
            });
          });
        }
      }
    });
    setDateTimesArray(saveTempDateTimeArray);
    savedFilters.forEach((items) => {
      if (items.dataType === "Numeric") {
        let conditionArray = [...condition];
        if (conditionArray.length === 0) {
          conditionArray.push({
            name: items.name,
            dataType: items.dataType,
            enabled: items.enabled,
            condition: [],
            amount: items.amount,
            value: items.condition,
          });
          filterData.filter.forEach((data) => {
            if (data.dataType === "Numeric") {
              data.condition.forEach((values) => {
                conditionArray.forEach((items) => {
                  items.condition.push({ value: values.value });
                });
              });
            }
          });
        }
        condition = conditionArray;
      }
    });
    setConditionsArray(condition);
    savedFilters.forEach((items) => {
      if (items.dataType === "Text") {
        let textComponentArray = [...text];
        if (textComponentArray.length > 0) {
          let index = textComponentArray.findIndex(
            (x) => x.name === items.name
          );
          if (index === -1) {
            textComponentArray.push({
              name: items.name,
              dataType: items.dataType,
              enabled: items.enabled,
              value: items.value,
            });
          }
        } else {
          textComponentArray.push({
            name: items.name,
            dataType: items.dataType,
            enabled: items.enabled,
            value: items.value,
          });
        }
        text = textComponentArray;
      }
    });
    setTextComponentsArray(text);
    setApplyFilter(true);
  };
  /**
   * Method To reset the right drawer
   */
  const resetDrawer = () => {
    deleteAutoCompleteElement({});
    deleteConditionalElement({});
    deleteDateTimeElement({});
    deleteTextComponentElement({});
    setApplyFilterChip({});
    setRecentFilterShow("");
    setFilterShow("none");
  };
  const { ref, showApplyFilter, setApplyFilter } = useComponentVisible(true);
  return (
    <div ref={ref}>
      {showApplyFilter && (
        <div className="neo-filter filter--grid" ref={ref}>
          <div className="filter__wrap">
            <div className="filter__list">
              <LeftDrawer
                filterData={filterData}
                fromLeftToRight={fromLeftToRight}
              />
            </div>
            <div className="filter__inputwrap">
              <RightDrawer
                applyFilter={applyFilter}
                saveFilter={saveFilter}
                createAutoCompleteArray={createAutoCompleteArray}
                handleAutoCompleteEnabled={handleAutoCompleteEnabled}
                deleteAutoCompleteElement={deleteAutoCompleteElement}
                autoCompleteArray={autoCompletesArray}
                dateTimesArray={dateTimesArray}
                deleteDateTimeElement={deleteDateTimeElement}
                handleDateTimeEnabled={handleDateTimeEnabled}
                createDateTimeArray={createDateTimeArray}
                addToday={addToday}
                addTomorrow={addTomorrow}
                addThisMonth={addThisMonth}
                addForteenDays={addForteenDays}
                addSevenDays={addSevenDays}
                addThisWeek={addThisWeek}
                addThirtyDays={addThirtyDays}
                lastDayChange={lastDayChange}
                nextDayChange={nextDayChange}
                conditionsArray={conditionsArray}
                handleCondionalEnabled={handleCondionalEnabled}
                createConditionalArray={createConditionalArray}
                deleteConditionalElement={deleteConditionalElement}
                textComponentsArray={textComponentsArray}
                deleteTextComponentElement={deleteTextComponentElement}
                createTextComponentsArray={createTextComponentsArray}
                handleTextComponentEnabled={handleTextComponentEnabled}
                closeDrawer={closeDrawer}
                resetDrawer={resetDrawer}
                filterCount={filterCount}
                saveWarningClassName={saveWarningClassName}
                saveWarningLabel={saveWarningLabel}
                showSavePopUp={showSavePopUp}
                emptyFilterClassName={emptyFilterClassName}
                emptyFilterWarning={emptyFilterWarning}
                openShowSavePopUp={openShowSavePopUp}
                recentFilterShow={recentFilterShow}
                filterShow={filterShow}
                addSavedFilters={addSavedFilters}
              />
            </div>
          </div>
        </div>
      )}

      <MainFilterPanel
        showDrawer={showDrawer}
        applyFilterChip={applyFilterChip}
        addAppliedFilters={addAppliedFilters}
        addSavedFilters={addSavedFilters}
        addingToFavourite={props.addingToFavourite}
      />
    </div>
  );
}
