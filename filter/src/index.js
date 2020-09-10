/* eslint-disable react/destructuring-assignment */

import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import ClickAwayListener from "react-click-away-listener";
import RightDrawer from "./drawer/RightDrawer";
import LeftDrawer from "./drawer/LeftDrawer";
import MainFilterPanel from "./panel/MainFilterPanel";
// eslint-disable-next-line import/no-unresolved
import "!style-loader!css-loader!sass-loader!./Styles/main.scss";

export default function Filter(props) {
    const [showApplyFilter, setApplyFilter] = useState(false);
    const [autoCompletesValueArray] = useState([]);
    const [portsArray, setPortsArray] = useState([]);
    const [dateTimesArray, setDateTimesArray] = useState([]);
    const [dateTimesValueArray] = useState([]);
    const [textComponentsArray, setTextComponentsArray] = useState([]);
    const [textComponentsValueArray] = useState([]);
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
            portsArray.length +
            dateTimesArray.length +
            textComponentsArray.length;
        setFilterCount(count);
    }, [portsArray, dateTimesArray, textComponentsArray]);
    /**
     * Method set the state which shows the drawer when on true condition
     */
    const showDrawer = () => {
        // eslint-disable-next-line no-use-before-define
        setApplyFilter(true);
    };
    /**
     * Method set the state which closes the drawer when the state is in false condition
     */
    const closeDrawer = () => {
        // eslint-disable-next-line no-use-before-define
        setApplyFilter(false);
    };
    /**
     * Method To show the save popup
     */
    const openShowSavePopUp = () => {
        setShowSavePopUp("");
    };

    /* Method To close the save popup on clicking cancel button */
    const cancelSavePopup = () => {
        setShowSavePopUp("none");
    };

    /**
     * Method which creates the array which contains the elements to be shown in the applied filter chips
     */

    const applyFilter = () => {
        if (filterCount > 0) {
            setEmptyFilterClassName("");
            setEmptyFilterWarning("");
            // eslint-disable-next-line no-shadow
            const applyFilter = {
                applyFilterArray: []
            };
            let tempObj = { applyFilter: [] };
            const obj = [];
            if (autoCompletesValueArray.length > 0) {
                autoCompletesValueArray.forEach((item) => {
                    tempObj.applyFilter.push(item);
                    obj.push({ ...item });
                });
                applyFilter.applyFilterArray.push({
                    autoComplete: autoCompletesValueArray
                });
            }
            if (dateTimesValueArray.length > 0) {
                dateTimesValueArray.forEach((item) => {
                    tempObj.applyFilter.push(item);
                    obj.push({ ...item });
                });
                applyFilter.applyFilterArray.push({
                    dateTime: dateTimesValueArray
                });
            }
            if (textComponentsValueArray.length > 0) {
                textComponentsValueArray.forEach((item) => {
                    tempObj.applyFilter.push(item);
                    obj.push({ ...item });
                });
                applyFilter.applyFilterArray.push({
                    textComponent: textComponentsValueArray
                });
            }
            setApplyFilterChip(tempObj);
            obj.forEach((objec) => {
                const item = objec; // Added for no-param-reassign lint errors
                delete item.dataType;
                delete item.enabled;
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
     * Method To reset the right drawer
     */
    const resetDrawer = () => {
        setApplyFilterChip({});
        setRecentFilterShow("");
        setFilterShow("none");
    };

    /**
     * Method To save the filters
     * @param {*} value is saved filter from the saved filter popup list
     */
    /* eslint-disable no-param-reassign */
    const saveFilter = (value) => {
        const obj = [];
        if (value.length > 0) {
            if (
                !(
                    autoCompletesValueArray.length > 0 ||
                    dateTimesValueArray.length > 0 ||
                    textComponentsValueArray.length > 0
                )
            ) {
                setShowSavePopUp("");
                setSaveWarningClassName("text-danger");
                setSaveWarningLabel("No filters selected or values entered");
            } else {
                const savedFilter = {
                    filter: []
                };
                if (autoCompletesValueArray.length > 0) {
                    const portArray = [...portsArray];
                    portArray.map((item) => {
                        const newItem = item;
                        autoCompletesValueArray.forEach((valueItem) => {
                            if (
                                valueItem.name === item.name &&
                                valueItem.type === item.type
                            ) {
                                newItem.validated = true;
                                newItem.warning = "";
                            }
                        });
                        return newItem;
                    });
                    setPortsArray(portArray);
                    let count = 0;
                    portsArray.forEach((item) => {
                        if (item.validated === false) {
                            count++;
                        }
                    });
                    if (count === 0) {
                        savedFilter.filter.push({
                            ports: autoCompletesValueArray
                        });
                    } else {
                        setShowSavePopUp("");
                        setSaveWarningClassName("text-danger");
                        setSaveWarningLabel("Enter values in every field");
                    }
                } else {
                    const portArray = [...portsArray];
                    portArray.forEach((item) => {
                        item.validated = false;
                    });
                    setPortsArray(portArray);
                }
                if (dateTimesValueArray.length > 0) {
                    const dateTimeArray = [...dateTimesArray];
                    dateTimeArray.map((item) => {
                        const newItem = item;
                        dateTimesValueArray.forEach((valueItem) => {
                            if (valueItem.name === item.name) {
                                newItem.validated = true; // Added for no-param-reassign lint errors
                                newItem.warning = "";
                            }
                        });
                        return newItem;
                    });
                    setDateTimesArray(dateTimeArray);
                    let count = 0;
                    dateTimesArray.forEach((item) => {
                        if (item.validated === false) {
                            count++;
                        }
                    });
                    if (count === 0) {
                        savedFilter.filter.push({
                            dateTime: dateTimesValueArray
                        });
                    } else {
                        setShowSavePopUp("");
                        setSaveWarningClassName("text-danger");
                        setSaveWarningLabel("Enter values in every field");
                    }
                } else {
                    const dateTimeArray = [...dateTimesArray];
                    dateTimeArray.forEach((item) => {
                        item.validated = false;
                    });
                    setDateTimesArray(dateTimeArray);
                }
                if (textComponentsValueArray.length > 0) {
                    const textComponentArray = [...textComponentsArray];
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
                            textComponent: textComponentsValueArray
                        });
                    } else {
                        setShowSavePopUp("");
                        setSaveWarningClassName("text-danger");
                        setSaveWarningLabel("Enter values in every field");
                    }
                } else {
                    const textComponentArray = [...textComponentsArray];
                    textComponentArray.forEach((item) => {
                        item.validated = false;
                    });
                    setTextComponentsArray(textComponentArray);
                }
                if (savedFilter.filter.length > 0) {
                    savedFilter[value] = savedFilter.filter;
                    delete savedFilter.filter;
                    let savedFilters = localStorage.getItem("savedFilters");
                    savedFilters = savedFilters ? JSON.parse(savedFilters) : [];
                    savedFilters.push(savedFilter);
                    localStorage.setItem(
                        "savedFilters",
                        JSON.stringify(savedFilters)
                    );
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
            obj.push({ ...item });
        });
        dateTimesValueArray.forEach((item) => {
            obj.push({ ...item });
        });
        textComponentsValueArray.forEach((item) => {
            obj.push({ ...item });
        });
        obj.forEach((objec) => {
            delete objec.dataType;
            delete objec.enabled;
        });
        props.savedFilters(obj);
    };

    /**
     * Method To create the filter arrays for Port type filter element
     * @param {*} name is the name of the filter
     * @param {*} type is the name of the filter
     * @param {*} dataType is the dataType of the filter
     * @param {*} condition is the condition array of the filter if present
     */
    /* eslint-disable no-param-reassign */
    const portValuesFromLeftToRight = (name, type, dataType, condition) => {
        setRecentFilterShow("none");
        setFilterShow("");
        setShowSavePopUp("none");
        setSaveWarningLabel("");
        setSaveWarningClassName("");
        setEmptyFilterClassName("");
        setEmptyFilterWarning("");
        let value = {};
        if (name === "Departure Port" || name === "Arrival Port") {
            if (type !== "Airport")
                value = {
                    name,
                    type,
                    dataType,
                    condition
                };
            else {
                value = {
                    name,
                    type,
                    dataType
                };
            }
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
            const portArray = [...portsArray];
            if (portArray.length > 0) {
                const index = portArray.findIndex(
                    (x) => x.name === value.name && x.type === value.type
                );
                if (index === -1) {
                    portArray.push({
                        name,
                        type,
                        dataType,
                        condition
                    });
                }
            } else {
                portArray.push({
                    name,
                    type,
                    dataType,
                    condition
                });
            }
            setPortsArray(portArray);
        }
    };

    /**
     * Method To create the filter arrays for each specific type based on datatype
     * @param {*} name is the name of the filter
     * @param {*} dataType is the dataType of the filter
     * @param {*} dataSource is the condition array of the filter if present
     * @param {*} condition is the condition array of the filter if present
     */
    /* eslint-disable no-param-reassign */
    const fromLeftToRight = (name, dataType, condition) => {
        if (dataType === "DateTime") {
            const value = {
                name,
                dataType,
                condition
            };
            filterData.filter.forEach((item) => {
                if (item.name === value.name) {
                    item.weight = 700;
                }
            });
            const dateTimeArray = [...dateTimesArray];
            if (dateTimeArray.length > 0) {
                const index = dateTimeArray.findIndex(
                    (x) => x.name === value.name && x.field === value.field
                );
                if (index === -1) {
                    dateTimeArray.push({
                        name,
                        dataType,
                        condition
                    });
                }
            } else {
                dateTimeArray.push({
                    name,
                    dataType,
                    condition
                });
            }
            setDateTimesArray(dateTimeArray);
        }
        if (dataType === "TextField") {
            const value = {
                name,
                dataType,
                condition
            };
            filterData.filter.forEach((item) => {
                if (item.name === value.name) {
                    item.weight = 700;
                }
            });
            const textComponentArray = [...textComponentsArray];
            if (textComponentArray.length > 0) {
                const index = textComponentArray.findIndex(
                    (x) =>
                        x.name === value.name && x.dataType === value.dataType
                );
                if (index === -1) {
                    textComponentArray.push({
                        name,
                        dataType,
                        condition
                    });
                }
            } else {
                textComponentArray.push({
                    name,
                    dataType,
                    condition
                });
            }
            setTextComponentsArray(textComponentArray);
        }
    };

    /**
     * Method To map the applied filters to drawer on clicking the chips
     * @param {*} items is the  filter element array
     */
    const addAppliedFilters = (items) => {
        let port = [];
        let dateTime = [];
        let text = [];
        items.forEach((item) => {
            if (item.dataType === "AutoComplete") {
                const portArray = [...port];
                const options = [];
                if (portArray.length > 0) {
                    const index = portArray.findIndex(
                        (x) => x.name === item.name && item.type === x.type
                    );

                    if (index === -1) {
                        portArray.push({
                            name: item.name,
                            dataType: item.dataType,
                            value: item.value,
                            objectArray: options
                        });
                    }
                } else {
                    portArray.push({
                        name: item.name,
                        dataType: item.dataType,
                        value: item.value,
                        objectArray: options
                    });
                }
                port = portArray;
            } else if (item.dataType === "DateTime") {
                const dateTimeArray = [...dateTime];
                if (dateTimeArray.length === 0) {
                    dateTimeArray.push({
                        name: item.name,
                        dataType: item.dataType
                    });
                    dateTimesValueArray.forEach((item_) => {
                        // Added for no-param-reassign lint errors
                        if (item_.fieldValue) {
                            dateTimeArray.forEach((dt) => {
                                dt.field.push({
                                    column: item_.fieldValue,
                                    value: item_.value
                                });
                            });
                        }
                    });
                }
                dateTime = dateTimeArray;
            } else {
                const textComponentArray = [...textComponentsArray];
                if (textComponentArray.length > 0) {
                    const index = textComponentArray.findIndex(
                        (x) => x.name === item.name
                    );
                    if (index === -1) {
                        textComponentArray.push({
                            name: item.name,
                            dataType: item.dataType,
                            value: item.value
                        });
                    }
                } else {
                    textComponentArray.push({
                        name: item.name,
                        dataType: item.dataType,
                        value: item.value
                    });
                }
                text = textComponentArray;
            }
            setPortsArray(port);
            setDateTimesArray(dateTime);
            setTextComponentsArray(text);
        });
        // eslint-disable-next-line no-use-before-define
        setApplyFilter(true);
    };
    /**
     * Method To map the saved filters to drawer on clicking the specific saved filter name
     * @param {*} item is the specific filter element object
     */
    const addSavedFilters = (item) => {
        setFilterShow("");
        setRecentFilterShow("none");
        let port = [];
        let text = [];
        const tempArr = [];
        const savedFilters = [];
        Object.keys(item).forEach((key) => {
            item[key].forEach((arrays) => {
                Object.keys(arrays).forEach((keys) => {
                    tempArr.push(arrays[keys]);
                });
            });
        });
        let arr = [];
        tempArr.forEach((arrays) => {
            arrays.forEach((array) => {
                savedFilters.push(array);
            });
        });
        savedFilters.forEach((items) => {
            filterData.filter.forEach((fil) => {
                if (fil.types.length) {
                    const index = fil.types.findIndex(
                        (x) => x.name === items.type && fil.name === items.name
                    );
                    if (index !== -1) {
                        arr = fil.types[index].options;
                    }
                }
            });
            if (
                items.name === "Arrival Port" ||
                items.name === "Departure Port"
            ) {
                const portArray = [...port];
                if (portArray.length > 0) {
                    const index = portArray.findIndex(
                        (x) => x.name === items.name && items.type === x.type
                    );
                    if (index === -1) {
                        portArray.push({
                            name: items.name,
                            dataType: items.dataType,
                            value: items.value,
                            objectArray: arr
                        });
                    }
                } else {
                    portArray.push({
                        name: items.name,
                        dataType: items.dataType,
                        value: items.value,
                        objectArray: arr
                    });
                }
                port = portArray;
            }
        });
        setPortsArray(port);
        const saveTempDateTimeArray = [];
        savedFilters.forEach((items) => {
            if (items.dataType === "DateTime") {
                if (saveTempDateTimeArray.length === 0) {
                    saveTempDateTimeArray.push({
                        name: items.name,
                        dataType: items.dataType
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
                            value: saved.value
                        });
                    });
                }
            }
        });
        setDateTimesArray(saveTempDateTimeArray);
        savedFilters.forEach((items) => {
            if (items.dataType === "Text") {
                const textComponentArray = [...text];
                if (textComponentArray.length > 0) {
                    const index = textComponentArray.findIndex(
                        (x) => x.name === items.name
                    );
                    if (index === -1) {
                        textComponentArray.push({
                            name: items.name,
                            dataType: items.dataType,
                            value: items.value
                        });
                    }
                } else {
                    textComponentArray.push({
                        name: items.name,
                        dataType: items.dataType,
                        value: items.value
                    });
                }
                text = textComponentArray;
            }
        });
        setTextComponentsArray(text);
        // eslint-disable-next-line no-use-before-define
        setApplyFilter(true);
    };
    const handleClickAway = () => {
        setApplyFilter(false);
    };
    return (
        <ClickAwayListener onClickAway={handleClickAway}>
            {showApplyFilter && (
                <div className="neo-filter filter--grid iCargo__custom">
                    <div className="filter__wrap">
                        <div className="filter__list">
                            <LeftDrawer
                                filterData={filterData}
                                fromLeftToRight={fromLeftToRight}
                                portValuesFromLeftToRight={
                                    portValuesFromLeftToRight
                                }
                            />
                        </div>
                        <div className="filter__inputwrap">
                            <RightDrawer
                                applyFilter={applyFilter}
                                saveFilter={saveFilter}
                                closeDrawer={closeDrawer}
                                resetDrawer={resetDrawer}
                                filterCount={filterCount}
                                saveWarningClassName={saveWarningClassName}
                                saveWarningLabel={saveWarningLabel}
                                showSavePopUp={showSavePopUp}
                                cancelSavePopup={cancelSavePopup}
                                emptyFilterClassName={emptyFilterClassName}
                                emptyFilterWarning={emptyFilterWarning}
                                openShowSavePopUp={openShowSavePopUp}
                                recentFilterShow={recentFilterShow}
                                filterShow={filterShow}
                                addSavedFilters={addSavedFilters}
                                dateTimesArray={dateTimesArray}
                                portsArray={portsArray}
                                textComponentsArray={textComponentsArray}
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
        </ClickAwayListener>
    );
}

Filter.propTypes = {
    filterData: PropTypes.any,
    addingToFavourite: PropTypes.any,
    appliedFilters: PropTypes.any,
    savedFilters: PropTypes.any
};
