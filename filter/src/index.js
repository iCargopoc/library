import React, { useState, useEffect } from "react";
import OutsideClickHandler from "react-outside-click-handler";
import PropTypes from "prop-types";
// import { IPopover, IPopoverBody, IPopoverHeader } from "@neo/popover";
// import { useQuery } from "@apollo/react-hooks";
// import { filterQuery } from "./gql/filterQuery";
import RightDrawer from "./drawer/rightDrawer";
import LeftDrawer from "./drawer/leftDrawer";
import MainFilterPanel from "./panel/mainFilterPanel";
import { DeepSearchLabel } from "./utilities/deepSearch";
import { dateFormatter } from "./utilities/dateFormatter";

// lazy styles inclusion via styleloader
import __cmpStyles from "./styles/main.scss";

let filter = [];
let initialValueObject = {};
let filterDataTemp = {};
let defaultFilterCategory = "";

export default function Filter(props) {
    // const { data } = useQuery(filterQuery);
    // const [filterProp, setFilterProp] = useState([]);
    // useEffect(() => {
    // if (data) setFilterProp(data.findFilterConfig.filterConfigs);
    // }, [data]);

    // useEffect for binding lazyloading styles
    useEffect(() => {
        if (__cmpStyles.use) {
            __cmpStyles.use();
        }
        return () => {
            if (__cmpStyles.unuse) {
                __cmpStyles.unuse();
            }
        };
    }, []);
    const {
        filterDataProp,
        appliedFiltersProp,
        CustomPanel,
        listView,
        savedFilters,
        oneTimeValues,
        components,
        recentFilter,
        filterValue,
        theme
    } = props;
    listView.predefinedFilters.forEach((item) => {
        if (item.default) defaultFilterCategory = item.category;
    });
    savedFilters.savedFilters.forEach((item) => {
        if (item.default) defaultFilterCategory = item.category;
    });

    const [leftPopUpShow, setLeftShowPopup] = useState(false);
    const [showApplyFilter, setApplyFilter] = useState(false);
    const [applyFilterChip, setApplyFilterChip] = useState({});
    const [showSavePopup, setShowSavePopup] = useState("none");
    const [filterCount, setFilterCount] = useState(0);
    const [filterData, setFilterData] = useState([]);
    const [emptyFilterWarning, setEmptyFilterWarning] = useState("");
    const [emptyFilterClassName, setEmptyFilterClassName] = useState("");
    const [recentFilterShow, setRecentFilterShow] = useState("none");
    const [filterShow, setFilterShow] = useState("");
    const [initialValuesObject, setInitialValuesObject] = useState({});
    const [applyValidator, setApplyFilterValidator] = useState("none");
    const [filters, setFilters] = useState([]);
    const [listViewClick, setListViewClick] = useState(false);
    const [listViewName, setListViewName] = useState(
        filterDataProp.filter(
            (item) => item.category === defaultFilterCategory
        )[0].name
    );
    const [listViewCode, setListViewCode] = useState("");
    const [savedFilterClick, setSavedFilterClick] = useState(false);
    const [savedFilterName, setSavedFilterName] = useState("");
    const [toSaveFilterName, setToSaveFilterName] = useState("");
    const [loaded, setLoad] = useState(false);
    const [autoLoad, setAutoLoad] = useState("");
    const [saveFilterWarning, setSaveFilterWarning] = useState("");

    useEffect(() => {
        if (defaultFilterCategory === "") {
            defaultFilterCategory = filterDataProp[0].category;
        }
        const filterDataCategory = filterDataProp.filter(
            (item) => item.category === defaultFilterCategory
        )[0];

        setFilterData(filterDataCategory);
    }, [filterDataProp]);

    useEffect(() => {
        setFilters(filter);
    }, [filter]);
    useEffect(() => {
        filterDataProp.forEach((item) => {
            if (item.name === listViewName) {
                setFilterData(item);
                if (item.autoLoadFilters) setAutoLoad("none");
                else setAutoLoad("");
            }
        });
    }, [listViewName]);
    useEffect(() => {
        let count = 0;
        count = filters.length;
        setFilterCount(count);

        if (count > 0) {
            setApplyFilterValidator("none");
        }
    }, [filters]);

    /**
     * Method to display left Popup
     */

    const closeLeftPopUp = () => {
        if (leftPopUpShow === true) setLeftShowPopup(false);
    };

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
     * Method to check whether atleast a filter is being selected
     */

    const applyFilterValidation = () => {
        if (filterCount === 0) {
            setApplyFilterValidator("");
            setApplyFilter(true);
        } else {
            closeDrawer();
        }
    };

    /**
     * Method which creates the array which contains the elements to be shown in the applied filter chips
     * @param {*} appliedFilters is the filter changes to be applied
     */

    const applyFilter = (appliedFilters) => {
        const chipObject = {};
        filterDataTemp = {
            ...filterData
        };
        Object.entries(appliedFilters).forEach(([key, value]) => {
            let tempValue;
            if (Object.prototype.toString.call(value) === "[object Object]")
                tempValue = JSON.parse(JSON.stringify(value));
            if (Object.prototype.toString.call(value) === "[object Array]")
                tempValue = JSON.parse(JSON.stringify(value));
            else tempValue = JSON.parse(JSON.stringify(value));
            filters.forEach((filterObject) => {
                if (
                    filterObject.dataType === "DateRange" &&
                    filterObject.props &&
                    filterObject.props.showSuggestion
                ) {
                    filterObject.props.suggestions.forEach(
                        (suggestionObject) => {
                            if (suggestionObject.value === value.valueString) {
                                tempValue.valueString = suggestionObject.label;
                                tempValue.value.forEach((dateObject, index) => {
                                    tempValue.value[index] = dateFormatter(
                                        dateObject
                                    );
                                });
                            }
                        }
                    );
                }
            });
            const label = DeepSearchLabel(filterDataTemp, key);
            if (label !== "") chipObject[label] = tempValue;
        });
        Object.entries(chipObject).forEach(([key, value]) => {
            if (value === undefined) {
                delete chipObject[key];
            }
        });
        setApplyFilterChip(chipObject);
        applyFilterValidation();
        initialValueObject = {
            ...initialValuesObject
        };
        Object.entries(appliedFilters).forEach(([key, value]) => {
            initialValueObject[key] = value;
        });
        setInitialValuesObject(initialValueObject);
        const applied = {};
        Object.entries(appliedFilters).forEach(([key, values]) => {
            if (
                !values.condition &&
                (((typeof values === "string" || Array.isArray(values)) &&
                    values.length > 0) ||
                    (values &&
                        values.constructor === Object &&
                        Object.keys(values).length > 0) ||
                    (typeof values === "boolean" && !key.includes(",check")))
            ) {
                applied[key] = values;
            } else if (
                (values.condition && values.condition.length > 0) ||
                ((typeof values.value === "string" ||
                    Array.isArray(values.value)) &&
                    values.value.length > 0) ||
                (typeof values.value === "object" &&
                    !Array.isArray(values.value) &&
                    Object.keys(values.value).length > 0) ||
                (typeof values.value === "boolean" && !key.includes(",check"))
            ) {
                applied[key] = values;
            }
        });
        if (Object.keys(applied).length > 0) {
            appliedFiltersProp(applied, listViewCode, listViewName);
        }
        setListViewClick(false);
    };

    /**
     * Method bind the listViews/savedFilters
     * @param {*} list is the listViews/savedFilters object
     *  @param {*} type is the listViews/savedFilters object
     */

    const handlelistViewClick = (list, type) => {
        if (
            Object.keys(filterData).length > 0 &&
            Array.isArray(filterData.filter) &&
            Object.keys(list.filters).length > 0
        ) {
            const filterTemp = [];
            const checkFieldInitialValue = {};
            const initialValueTemp = {};
            const filterValueObject = {};
            filterDataProp.forEach((item) => {
                if (item.category === list.category) {
                    filterDataTemp = item;
                    setListViewName(item.name);
                }
                item.filter.forEach((filterItem) => {
                    if (filterItem.isSubFilter) {
                        filterItem.subFilters.forEach((subFilterItem) => {
                            const tempSubFilterItem = subFilterItem;
                            tempSubFilterItem.weight = 400;
                        });
                    } else {
                        const tempFilterItem = filterItem;
                        tempFilterItem.weight = 400;
                    }
                });
            });

            Object.entries(list.filters).forEach(([key, value]) => {
                let tempValue;
                if (Object.prototype.toString.call(value) === "[object Object]")
                    tempValue = JSON.parse(JSON.stringify(value));
                if (Object.prototype.toString.call(value) === "[object Array]")
                    tempValue = JSON.parse(JSON.stringify(value));
                else tempValue = JSON.parse(JSON.stringify(value));
                filterDataTemp.filter.forEach((filterObject) => {
                    if (
                        filterObject.dataType === "DateRange" &&
                        filterObject.props &&
                        filterObject.props.showSuggestion
                    ) {
                        filterObject.props.suggestions.forEach(
                            (suggestionObject) => {
                                if (
                                    suggestionObject.value === value.valueString
                                ) {
                                    tempValue.valueString =
                                        suggestionObject.label;
                                    tempValue.value.forEach(
                                        (dateObject, index) => {
                                            tempValue.value[
                                                index
                                            ] = dateFormatter(dateObject);
                                        }
                                    );
                                }
                            }
                        );
                    }
                });
                const name = DeepSearchLabel(filterDataTemp, key);
                filterValueObject[name] = tempValue;
            });
            Object.entries(list.filters).forEach(([key, values]) => {
                filterDataTemp.filter.forEach((jsonFilter) => {
                    if (
                        key === jsonFilter.name &&
                        !jsonFilter.isSubFilter &&
                        !jsonFilter.isGroupFilter
                    ) {
                        let tempProp;
                        if (jsonFilter.props !== undefined) {
                            tempProp = jsonFilter.props;
                        } else tempProp = {};
                        if (jsonFilter.oneTimeCode && oneTimeValues) {
                            Object.entries(oneTimeValues).forEach(([keys]) => {
                                if (
                                    jsonFilter.oneTimeCode === keys &&
                                    jsonFilter.dataType !== "MasterTypeSelect"
                                ) {
                                    tempProp.options = [...oneTimeValues[keys]];
                                }
                                if (
                                    jsonFilter.oneTimeCode === keys &&
                                    jsonFilter.dataType === "MasterTypeSelect"
                                ) {
                                    tempProp.selectOptions = [
                                        ...oneTimeValues[keys]
                                    ];
                                }
                            });
                            const tempOptions =
                                tempProp.options &&
                                JSON.parse(JSON.stringify(tempProp.options));

                            if (jsonFilter.labelOnSelect) {
                                if (tempOptions) {
                                    tempOptions.forEach((item) => {
                                        const tempItem = item;
                                        tempItem.value = item.label;
                                    });
                                    tempProp.options = [...tempOptions];
                                }
                            }
                        }
                        const jsonFilterTemp = jsonFilter;
                        jsonFilterTemp.weight = 700;

                        if (values.condition) {
                            filterTemp.push({
                                labelName: `${jsonFilter.label}`,
                                label: jsonFilter.label,
                                name: `${jsonFilter.name}.value`,
                                isSubFilter: jsonFilter.isSubFilter,
                                dataType: jsonFilter.dataType,
                                condition: jsonFilter.condition,
                                isRequired: jsonFilter.isRequired,
                                initialValue: jsonFilter.initialValue,
                                display: "",
                                disabled: false,
                                validationDisplay: "none",
                                props: tempProp,
                                conditionFieldName: `${jsonFilter.name}.condition`
                            });
                            checkFieldInitialValue[
                                `${jsonFilter.label},check`
                            ] = true;
                        } else {
                            filterTemp.push({
                                labelName: `${jsonFilter.label}`,
                                label: jsonFilter.label,
                                name: jsonFilter.name,
                                isSubFilter: jsonFilter.isSubFilter,
                                dataType: jsonFilter.dataType,
                                condition: jsonFilter.condition,
                                isRequired: jsonFilter.isRequired,
                                initialValue: jsonFilter.initialValue,
                                display: "none",
                                disabled: true,
                                validationDisplay: "none",
                                props: tempProp
                            });
                        }

                        if (
                            !Object.prototype.hasOwnProperty.call(
                                initialValueObject,
                                jsonFilter.name
                            )
                        ) {
                            if (
                                jsonFilter.dataType === "IFlightNumber" ||
                                jsonFilter.dataType === "MasterSelect"
                            ) {
                                initialValueTemp[jsonFilter.name] = [];
                            } else {
                                initialValueTemp[jsonFilter.name] = "";
                            }
                        }
                    }

                    if (jsonFilter.isSubFilter) {
                        jsonFilter.subFilters.forEach((subFilter) => {
                            if (key === subFilter.name) {
                                const jsonFilterTemp = jsonFilter;
                                jsonFilterTemp.weight = 700;
                                const subFilterTemp = subFilter;
                                subFilterTemp.weight = 600;
                                let tempProp;
                                if (subFilter.props !== undefined) {
                                    tempProp = subFilter.props;
                                } else tempProp = {};
                                if (subFilter.oneTimeCode && oneTimeValues) {
                                    Object.entries(oneTimeValues).forEach(
                                        ([keys]) => {
                                            if (
                                                subFilter.oneTimeCode ===
                                                    keys &&
                                                subFilter.dataType !==
                                                    "MasterTypeSelect"
                                            ) {
                                                tempProp.options =
                                                    oneTimeValues[keys];
                                            }
                                            if (
                                                subFilter.oneTimeCode ===
                                                    keys &&
                                                subFilter.dataType ===
                                                    "MasterTypeSelect"
                                            ) {
                                                tempProp.selectOptions =
                                                    oneTimeValues[keys];
                                            }
                                        }
                                    );
                                    const tempOptions =
                                        tempProp.options &&
                                        JSON.parse(
                                            JSON.stringify(tempProp.options)
                                        );

                                    if (subFilter.labelOnSelect) {
                                        if (tempOptions) {
                                            tempOptions.forEach((item) => {
                                                const tempItem = item;
                                                tempItem.value = item.label;
                                            });
                                            tempProp.options = [...tempOptions];
                                        }
                                    }
                                }
                                if (list.filters[key].condition) {
                                    filterTemp.push({
                                        labelName: `${jsonFilter.label}${subFilter.label}`,
                                        label: jsonFilter.label,
                                        name: `${subFilter.name}.value`,
                                        isSubFilter: jsonFilter.isSubFilter,
                                        type: subFilter.label,
                                        dataType: subFilter.dataType,
                                        condition: subFilter.condition,
                                        isRequired: subFilter.isRequired,
                                        initialValue: subFilter.initialValue,
                                        display: "",
                                        disabled: false,
                                        validationDisplay: "none",
                                        props: tempProp,
                                        conditionFieldName: `${subFilter.name}.condition`
                                    });
                                    checkFieldInitialValue[
                                        `${jsonFilter.label}${subFilter.label},check`
                                    ] = true;
                                } else {
                                    filterTemp.push({
                                        labelName: `${jsonFilter.label}${subFilter.label}`,
                                        label: jsonFilter.label,
                                        name: subFilter.name,
                                        isSubFilter: jsonFilter.isSubFilter,
                                        type: subFilter.label,
                                        dataType: subFilter.dataType,
                                        condition: subFilter.condition,
                                        isRequired: subFilter.isRequired,
                                        initialValue: subFilter.initialValue,
                                        display: "none",
                                        disabled: true,
                                        validationDisplay: "none",
                                        props: tempProp
                                    });
                                }

                                if (
                                    !Object.prototype.hasOwnProperty.call(
                                        initialValueObject,
                                        subFilter.name
                                    )
                                ) {
                                    if (
                                        subFilter.dataType ===
                                            "IFlightNumber" ||
                                        subFilter.dataType === "MasterSelect"
                                    ) {
                                        initialValueTemp[subFilter.name] = [];
                                    } else {
                                        initialValueTemp[subFilter.name] = "";
                                    }
                                }
                            }

                            if (subFilter.isGroupFilter) {
                                const groupFiltersArray = [];
                                subFilter.groupFilter.forEach(
                                    (groupFilters) => {
                                        const tempGroupFilters = groupFilters;
                                        if (key === groupFilters.name) {
                                            const jsonFilterTemp = jsonFilter;
                                            jsonFilterTemp.weight = 700;
                                            const subFilterTemp = subFilter;
                                            subFilterTemp.weight = 600;
                                            const index = filterTemp.findIndex(
                                                (x) =>
                                                    x.label === subFilter.label
                                            );
                                            let tempProp;
                                            if (
                                                groupFilters.props !== undefined
                                            ) {
                                                tempProp = groupFilters.props;
                                            } else tempProp = {};
                                            if (groupFilters.oneTimeCode) {
                                                Object.entries(
                                                    oneTimeValues
                                                ).forEach(
                                                    ([groupFilterKey]) => {
                                                        if (
                                                            groupFilters.oneTimeCode ===
                                                                groupFilterKey &&
                                                            groupFilters.dataType !==
                                                                "MasterTypeSelect"
                                                        ) {
                                                            tempProp.options = [
                                                                ...oneTimeValues[
                                                                    groupFilterKey
                                                                ]
                                                            ];
                                                        }
                                                        if (
                                                            groupFilters.oneTimeCode ===
                                                                groupFilterKey &&
                                                            groupFilters.dataType ===
                                                                "MasterTypeSelect"
                                                        ) {
                                                            tempProp.selectOptions = [
                                                                ...oneTimeValues[
                                                                    groupFilterKey
                                                                ]
                                                            ];
                                                        }
                                                    }
                                                );
                                                const tempOptions =
                                                    tempProp.options &&
                                                    JSON.parse(
                                                        JSON.stringify(
                                                            tempProp.options
                                                        )
                                                    );

                                                if (
                                                    groupFilters.labelOnSelect
                                                ) {
                                                    if (tempOptions) {
                                                        tempOptions.forEach(
                                                            (item) => {
                                                                const tempItem = item;
                                                                tempItem.value =
                                                                    item.label;
                                                            }
                                                        );
                                                        tempProp.options = [
                                                            ...tempOptions
                                                        ];
                                                    }
                                                }
                                            }
                                            tempGroupFilters.props = tempProp;
                                            if (index === -1) {
                                                if (
                                                    list.filters[key].condition
                                                ) {
                                                    filterTemp.push({
                                                        display: "",
                                                        disabled: false,
                                                        validationDisplay:
                                                            "none",
                                                        label: subFilter.label,
                                                        name: subFilter.name,
                                                        isSubFilter:
                                                            subFilter.isSubFilter,
                                                        isGroupFilter:
                                                            subFilter.isGroupFilter,
                                                        groupFilter: groupFiltersArray,
                                                        condition:
                                                            subFilter.condition
                                                    });
                                                    checkFieldInitialValue[
                                                        `${groupFilters.label},check`
                                                    ] = true;
                                                } else {
                                                    filterTemp.push({
                                                        display: "none",
                                                        disabled: true,
                                                        validationDisplay:
                                                            "none",
                                                        label: subFilter.label,
                                                        name: subFilter.name,
                                                        isSubFilter:
                                                            subFilter.isSubFilter,
                                                        isGroupFilter:
                                                            subFilter.isGroupFilter,
                                                        groupFilter: groupFiltersArray,
                                                        condition:
                                                            subFilter.condition
                                                    });
                                                }
                                            }
                                            subFilter.groupFilter.forEach(
                                                (groupedFilter) => {
                                                    if (
                                                        !Object.prototype.hasOwnProperty.call(
                                                            initialValueObject,
                                                            groupedFilter.name
                                                        )
                                                    ) {
                                                        if (
                                                            groupedFilter.dataType ===
                                                                "IFlightNumber" ||
                                                            groupedFilter.dataType ===
                                                                "MasterSelect"
                                                        ) {
                                                            initialValueObject[
                                                                groupedFilter.name
                                                            ] = [];
                                                        } else {
                                                            initialValueObject[
                                                                groupedFilter.name
                                                            ] = "";
                                                        }
                                                    }
                                                }
                                            );
                                        }
                                        groupFiltersArray.push(
                                            tempGroupFilters
                                        );
                                    }
                                );
                            }
                        });
                    }
                    if (jsonFilter.isGroupFilter) {
                        const groupFiltersArray = [];
                        jsonFilter.groupFilter.forEach((groupFilters) => {
                            const tempGroupFilters = groupFilters;
                            if (key === groupFilters.name) {
                                const jsonFilterTemp = jsonFilter;
                                jsonFilterTemp.weight = 700;
                                const index = filterTemp.findIndex(
                                    (x) => x.name === jsonFilter.name
                                );
                                let tempProp;
                                if (groupFilters.props !== undefined) {
                                    tempProp = groupFilters.props;
                                } else tempProp = {};
                                if (groupFilters.oneTimeCode) {
                                    Object.entries(oneTimeValues).forEach(
                                        ([groupFilterKey]) => {
                                            if (
                                                groupFilters.oneTimeCode ===
                                                    groupFilterKey &&
                                                groupFilters.dataType !==
                                                    "MasterTypeSelect"
                                            ) {
                                                tempProp.options = [
                                                    ...oneTimeValues[
                                                        groupFilterKey
                                                    ]
                                                ];
                                            }
                                            if (
                                                groupFilters.oneTimeCode ===
                                                    groupFilterKey &&
                                                groupFilters.dataType ===
                                                    "MasterTypeSelect"
                                            ) {
                                                tempProp.selectOptions = [
                                                    ...oneTimeValues[
                                                        groupFilterKey
                                                    ]
                                                ];
                                            }
                                        }
                                    );
                                    const tempOptions =
                                        tempProp.options &&
                                        JSON.parse(
                                            JSON.stringify(tempProp.options)
                                        );

                                    if (groupFilters.labelOnSelect) {
                                        if (tempOptions) {
                                            tempOptions.forEach((item) => {
                                                const tempItem = item;
                                                tempItem.value = item.label;
                                            });
                                            tempProp.options = [...tempOptions];
                                        }
                                    }
                                }
                                tempGroupFilters.props = tempProp;

                                if (list.filters[key].condition) {
                                    tempGroupFilters.name = `${tempGroupFilters.name}.value`;
                                }
                                if (index === -1) {
                                    if (list.filters[key].condition) {
                                        filterTemp.push({
                                            display: "",
                                            disabled: false,
                                            validationDisplay: "none",
                                            label: jsonFilter.label,
                                            name: jsonFilter.name,
                                            isSubFilter: jsonFilter.isSubFilter,
                                            isGroupFilter:
                                                jsonFilter.isGroupFilter,
                                            groupFilter: groupFiltersArray,
                                            condition: groupFilters.condition
                                        });
                                        checkFieldInitialValue[
                                            `${groupFilters.label},check`
                                        ] = true;
                                    } else {
                                        filterTemp.push({
                                            display: "none",
                                            disabled: true,
                                            validationDisplay: "none",
                                            label: jsonFilter.label,
                                            name: jsonFilter.name,
                                            isSubFilter: jsonFilter.isSubFilter,
                                            isGroupFilter:
                                                jsonFilter.isGroupFilter,
                                            groupFilter: groupFiltersArray,
                                            condition: jsonFilter.condition
                                        });
                                    }
                                }

                                jsonFilter.groupFilter.forEach(
                                    (groupedFilter) => {
                                        if (
                                            !Object.prototype.hasOwnProperty.call(
                                                initialValueObject,
                                                groupedFilter.name
                                            )
                                        ) {
                                            if (
                                                groupedFilter.dataType ===
                                                    "IFlightNumber" ||
                                                groupedFilter.dataType ===
                                                    "MasterSelect"
                                            ) {
                                                initialValueObject[
                                                    groupedFilter.name
                                                ] = [];
                                            } else {
                                                initialValueObject[
                                                    groupedFilter.name
                                                ] = "";
                                            }
                                        }
                                    }
                                );
                            }
                            groupFiltersArray.push(tempGroupFilters);
                        });
                    }
                });
            });
            filterDataTemp.filter.forEach((jsonFilter) => {
                let tempProp;
                let index;
                if (
                    (jsonFilter.isRequired || filterDataTemp.autoLoadFilters) &&
                    !jsonFilter.isSubFilter &&
                    !jsonFilter.isGroupFilter
                ) {
                    const jsonFilterTemp = jsonFilter;
                    jsonFilterTemp.weight = 700;
                    if (jsonFilter.props !== undefined) {
                        tempProp = jsonFilter.props;
                    } else tempProp = {};
                    if (jsonFilter.oneTimeCode && oneTimeValues) {
                        Object.entries(oneTimeValues).forEach(([keys]) => {
                            if (
                                jsonFilter.oneTimeCode === keys &&
                                jsonFilter.dataType !== "MasterTypeSelect"
                            ) {
                                tempProp.options = oneTimeValues[keys];
                            }
                            if (
                                jsonFilter.oneTimeCode === keys &&
                                jsonFilter.dataType === "MasterTypeSelect"
                            ) {
                                tempProp.selectOptions = oneTimeValues[keys];
                            }
                        });
                        const tempOptions =
                            tempProp.options &&
                            JSON.parse(JSON.stringify(tempProp.options));

                        if (jsonFilter.labelOnSelect) {
                            if (tempOptions) {
                                tempOptions.forEach((item) => {
                                    const tempItem = item;
                                    tempItem.value = item.label;
                                });
                                tempProp.options = [...tempOptions];
                            }
                        }
                    }
                    if (filterTemp.length > 0) {
                        index = filterTemp.findIndex(
                            (x) => x.name === jsonFilter.name
                        );
                    }
                    if (index === -1) {
                        filterTemp.push({
                            labelName: `${jsonFilter.label}`,
                            label: jsonFilter.label,
                            name: jsonFilter.name,
                            isSubFilter: jsonFilter.isSubFilter,
                            dataType: jsonFilter.dataType,
                            condition: jsonFilter.condition,
                            isRequired: jsonFilter.isRequired,
                            initialValue: jsonFilter.initialValue,
                            display: "none",
                            disabled: true,
                            validationDisplay: "none",
                            props: tempProp
                        });
                    }
                }
                if (jsonFilter.isSubFilter) {
                    jsonFilter.subFilters.forEach((subFilter) => {
                        if (
                            (subFilter.isRequired ||
                                filterDataTemp.autoLoadFilters) &&
                            !subFilter.isGroupFilter
                        ) {
                            const subFilterTemp = subFilter;
                            subFilterTemp.weight = 700;
                            if (subFilter.props !== undefined) {
                                tempProp = subFilter.props;
                            } else tempProp = {};
                            if (subFilter.oneTimeCode && oneTimeValues) {
                                Object.entries(oneTimeValues).forEach(
                                    ([keys]) => {
                                        if (
                                            subFilter.oneTimeCode === keys &&
                                            subFilter.dataType !==
                                                "MasterTypeSelect"
                                        ) {
                                            tempProp.options =
                                                oneTimeValues[keys];
                                        }
                                        if (
                                            subFilter.oneTimeCode === keys &&
                                            subFilter.dataType ===
                                                "MasterTypeSelect"
                                        ) {
                                            tempProp.selectOptions =
                                                oneTimeValues[keys];
                                        }
                                    }
                                );
                                const tempOptions =
                                    tempProp.options &&
                                    JSON.parse(
                                        JSON.stringify(tempProp.options)
                                    );

                                if (subFilter.labelOnSelect) {
                                    if (tempOptions) {
                                        tempOptions.forEach((item) => {
                                            const tempItem = item;
                                            tempItem.value = item.label;
                                        });
                                        tempProp.options = [...tempOptions];
                                    }
                                }
                            }
                            if (filterTemp.length > 0) {
                                index = filterTemp.findIndex(
                                    (x) => x.name === subFilter.name
                                );
                            }
                            if (index === -1) {
                                filterTemp.push({
                                    labelName: `${jsonFilter.label}${subFilter.label}`,
                                    label: jsonFilter.label,
                                    name: subFilter.name,
                                    isSubFilter: jsonFilter.isSubFilter,
                                    type: subFilter.label,
                                    dataType: subFilter.dataType,
                                    condition: subFilter.condition,
                                    isRequired: subFilter.isRequired,
                                    initialValue: subFilter.initialValue,
                                    display: "none",
                                    disabled: true,
                                    validationDisplay: "none",
                                    props: tempProp
                                });
                            }
                        }
                        if (subFilter.isGroupFilter) {
                            subFilter.groupFilter.forEach((groupFilters) => {
                                if (
                                    groupFilters.isRequired ||
                                    filterDataTemp.autoLoadFilters
                                ) {
                                    const jsonFilterTemp = jsonFilter;
                                    jsonFilterTemp.weight = 700;
                                    const subFilterTemp = subFilter;
                                    subFilterTemp.weight = 600;
                                    if (filterTemp.length > 0) {
                                        index = filterTemp.findIndex(
                                            (x) => x.name === subFilter.name
                                        );
                                    }
                                    if (index === -1) {
                                        filterTemp.push({
                                            display: "none",
                                            disabled: true,
                                            validationDisplay: "none",
                                            label: subFilter.label,
                                            name: subFilter.name,
                                            isSubFilter: subFilter.isSubFilter,
                                            isGroupFilter:
                                                subFilter.isGroupFilter,
                                            groupFilter: subFilter.groupFilter,
                                            condition: subFilter.condition
                                        });
                                    }
                                }
                            });
                        }
                    });
                }
                if (jsonFilter.isGroupFilter) {
                    jsonFilter.groupFilter.forEach((groupFilters) => {
                        if (
                            groupFilters.isRequired ||
                            filterDataTemp.autoLoadFilters
                        ) {
                            const jsonFilterTemp = jsonFilter;
                            jsonFilterTemp.weight = 700;
                            index = filterTemp.findIndex(
                                (x) => x.name === jsonFilter.name
                            );
                            if (index === -1) {
                                filterTemp.push({
                                    display: "none",
                                    disabled: true,
                                    validationDisplay: "none",
                                    label: jsonFilter.label,
                                    name: jsonFilter.name,
                                    isSubFilter: jsonFilter.isSubFilter,
                                    isGroupFilter: jsonFilter.isGroupFilter,
                                    groupFilter: jsonFilter.groupFilter,
                                    condition: jsonFilter.condition
                                });
                            }
                        }
                    });
                }
            });
            filter = [...filterTemp];
            initialValueObject = {
                ...list.filters,
                ...checkFieldInitialValue
            };
            if (filter.length > 0) {
                closeLeftPopUp();
            }
            setApplyFilterChip(filterValueObject);
            appliedFiltersProp(list.filters, list.category, list.name);
        }
        if (type === "listView") {
            setListViewCode(list.category);
            setSavedFilterName("");
            setListViewClick(true);
            setSavedFilterClick(false);
            setInitialValuesObject({});
            setRecentFilterShow("none");
            setFilterShow("");
            setEmptyFilterClassName("");
            setEmptyFilterWarning("");
        }
        if (type === "savedFilter") {
            setRecentFilterShow("none");
            setFilterShow("");
            setEmptyFilterClassName("");
            setEmptyFilterWarning("");
            setSavedFilterName(list.name);
            setSavedFilterClick(true);
            setListViewClick(false);
        }
    };
    useEffect(() => {
        if (!loaded && Object.keys(filterData).length > 0) {
            listView.predefinedFilters.forEach((list) => {
                if (
                    list.default === true ||
                    defaultFilterCategory === list.category
                ) {
                    handlelistViewClick(list, "listView");
                    setListViewName(list.name);
                }
            });
            setLoad(true);
        }
    }, [loaded, filterData]);

    useEffect(() => {
        if (filterValue) handlelistViewClick(filterValue, "listView");
    }, [filterValue]);

    /**
     * Method To prevent listView rerendering */
    const completeListViewClick = () => {
        setListViewClick(false);
    };

    /**
     * Method To prevent savedFilter rerendering */
    const completeSavedFilterClick = () => {
        setSavedFilterClick(false);
    };

    /**
     * Method To reset the right drawer
     * @param {*} values is the formik values
     * @param {*} setFieldValue is the values to set the formik field values
     */
    const clearDrawer = (values, setFieldValue) => {
        setRecentFilterShow("");
        setFilterShow("");
        const filterDatas = {
            ...filterData
        };
        filterDatas.filter.forEach((filte) => {
            if (filte && !filte.isRequired) {
                const weigh = filte;
                weigh.weight = 400;
                if (filte.isSubFilter) {
                    filte.subFilters.forEach((item) => {
                        if (!item.isRequired) {
                            const fontweigh = item;
                            fontweigh.weight = 400;
                        }
                    });
                }
            }
        });

        setFilterData(filterDatas);

        filter = [...filters];
        filter = filter.filter((item) => {
            return item.isRequired;
        });
        const filterName = [];
        filter.forEach((item) => {
            return filterName.push(item.name);
        });
        Object.keys(values).forEach((item) => {
            if (!filterName.includes(item)) setFieldValue(item, "");
        });
        setFilters(filter);
        setInitialValuesObject({});
        completeListViewClick();
        completeSavedFilterClick();
        // setListViewName("");
        setListViewCode("");
        setSavedFilterName("");
        // setListViewCode("");
    };

    const resetFilter = () => {
        setLoad(false);
    };

    /**
     * Method To create the filter field arrays for filters under a accordion grouping
     * @param {*} label is the label of the filter field
     * @param {*} isSubFilter is a boolean check for whether the subFilters are there or not
     * @param {*} type is the name of the filter field
     * @param {*} dataType is the dataType of the filter field
     * @param {*} condition is the condition array of the filter field if present
     * @param {*} isRequired is the required of the filter field
     * @param {*} name is the name of the filter field
     * @param {*} initialValue is the initialValue of the filter field
     * @param {*} prop is the prop of the filter field
     * @param {*} labelOnSelect is the attribute to display label on select fields
     */
    const accordionFiltersFromLeftToRight = (
        label,
        isSubFilter,
        type,
        dataType,
        condition,
        isRequired,
        name,
        initialValue,
        prop,
        oneTimeCode,
        labelOnSelect
    ) => {
        let tempProp;
        if (prop !== undefined) {
            tempProp = prop;
        } else tempProp = {};
        setListViewName("Custom Filter");
        setRecentFilterShow("none");
        setFilterShow("");
        setEmptyFilterClassName("");
        setEmptyFilterWarning("");
        filter = [...filters];
        filterData.filter.forEach((item) => {
            const itemParam = item;
            if (item.label === label) {
                itemParam.weight = 700;
                item.subFilters.forEach((tip) => {
                    const tipParam = tip;
                    if (tip.label === type) {
                        tipParam.weight = 600;
                    }
                });
            }
        });
        if (oneTimeCode) {
            Object.entries(oneTimeValues).forEach(([key]) => {
                if (oneTimeCode === key && dataType !== "MasterTypeSelect") {
                    tempProp.options = oneTimeValues[key];
                } else {
                    tempProp.selectOptions = oneTimeValues[key];
                }
            });
            const tempOptions =
                tempProp.options &&
                JSON.parse(JSON.stringify(tempProp.options));

            if (labelOnSelect) {
                if (tempOptions) {
                    tempOptions.forEach((item) => {
                        const tempItem = item;
                        tempItem.value = item.label;
                    });
                    tempProp.options = [...tempOptions];
                }
            }
        }
        if (filter.length > 0) {
            const index = filter.findIndex(
                (x) => x.labelName === `${label}${type}`
            );
            if (index === -1) {
                filter.unshift({
                    labelName: `${label}${type}`,
                    label,
                    name,
                    isSubFilter,
                    type,
                    dataType,
                    condition,
                    isRequired,
                    initialValue,
                    display: "none",
                    disabled: true,
                    validationDisplay: "none",
                    props: tempProp,
                    componentId: name
                });
            }
        } else {
            filter.unshift({
                labelName: `${label}${type}`,
                label,
                name,
                isSubFilter,
                type,
                dataType,
                condition,
                isRequired,
                initialValue,
                display: "none",
                disabled: true,
                validationDisplay: "none",
                props: tempProp,
                componentId: name
            });
        }
        setFilters(filter);
    };

    /**
     * Method To create the filter field arrays for each individual filter type
     * @param {*} label is the label of the filter field
     * @param {*} isSubFilter is a boolean check for whether the subFilters are there or not
     * @param {*} dataType is the dataType of the filter field
     * @param {*} condition is the condition array of the filter field if present
     * @param {*} isRequired is the required of the filter field
     * @param {*} name is the name of the filter field
     * @param {*} initialValue is the initialValue of the filter field
     * @param {*} prop is the props of the filter field
     * @param {*} oneTimeCode is the props of the filter field
     * @param {*} labelOnSelect is the attribute to display label on select fields
     */
    const individualFiltersfromLeftToRight = (
        label,
        isSubFilter,
        dataType,
        condition,
        isRequired,
        name,
        initialValue,
        prop,
        oneTimeCode,
        labelOnSelect
    ) => {
        let tempProp;
        if (prop !== undefined) {
            tempProp = prop;
        } else tempProp = {};
        setListViewName("Custom Filter");
        setRecentFilterShow("none");
        setFilterShow("");
        setEmptyFilterClassName("");
        setEmptyFilterWarning("");

        filterDataTemp = filterData;
        filterDataTemp.filter.forEach((item) => {
            const itemParam = item;
            if (item.label === label) {
                itemParam.weight = 700;
            }
        });
        filter = [...filters];
        if (oneTimeCode) {
            Object.entries(oneTimeValues).forEach(([key]) => {
                if (oneTimeCode === key && dataType !== "MasterTypeSelect") {
                    tempProp.options = oneTimeValues[key];
                } else {
                    tempProp.selectOptions = oneTimeValues[key];
                }
            });
            const tempOptions =
                tempProp.options &&
                JSON.parse(JSON.stringify(tempProp.options));

            if (labelOnSelect) {
                if (tempOptions) {
                    tempOptions.forEach((item) => {
                        const tempItem = item;
                        tempItem.value = item.label;
                    });
                    tempProp.options = [...tempOptions];
                }
            }
        }
        if (filter.length > 0) {
            const index = filter.findIndex((x) => x.label === label);
            if (index === -1) {
                filter.unshift({
                    labelName: `${label}`,
                    label,
                    name,
                    isSubFilter,
                    dataType,
                    condition,
                    isRequired,
                    initialValue,
                    display: "none",
                    disabled: true,
                    validationDisplay: "none",
                    props: tempProp,
                    componentId: name
                });
            }
        } else {
            filter.unshift({
                labelName: `${label}`,
                label,
                name,
                isSubFilter,
                dataType,
                condition,
                isRequired,
                initialValue,
                display: "none",
                disabled: true,
                validationDisplay: "none",
                props: tempProp,
                componentId: name
            });
        }

        setFilters(filter);
    };
    /**
     * Method To create the filter field arrays for groupFilters
     *  @param {*} item is the groupFilter
     */
    const groupFiltersFromLeftToRight = (item) => {
        setListViewName("Custom Filter");
        setRecentFilterShow("none");
        setFilterShow("");
        setEmptyFilterClassName("");
        setEmptyFilterWarning("");
        filterDataTemp = {
            ...filterData
        };
        filterDataTemp.filter.forEach((field) => {
            const fieldParam = field;
            if (field.isGroupFilter) {
                field.groupFilter.forEach((groupFilters) => {
                    item.groupFilter.forEach((itemGroupFilter) => {
                        if (itemGroupFilter.name === groupFilters.name) {
                            fieldParam.weight = 700;
                        }
                    });
                });
            }
        });
        filter = [...filters];

        const groupFilterTemp = [];
        if (filter.length > 0) {
            const index = filter.findIndex((x) => x.label === item.label);
            if (index === -1) {
                item.groupFilter.forEach((groupFilters) => {
                    const tempGroupFilters = groupFilters;
                    let tempProp;
                    if (groupFilters.props !== undefined) {
                        tempProp = groupFilters.props;
                    } else tempProp = {};
                    if (groupFilters.oneTimeCode) {
                        Object.entries(oneTimeValues).forEach(([key]) => {
                            if (
                                groupFilters.oneTimeCode === key &&
                                groupFilters.dataType !== "MasterTypeSelect"
                            ) {
                                tempProp.options = [...oneTimeValues[key]];
                            }
                            if (
                                groupFilters.oneTimeCode === key &&
                                groupFilters.dataType === "MasterTypeSelect"
                            ) {
                                tempProp.selectOptions = [
                                    ...oneTimeValues[key]
                                ];
                            }
                        });
                        const tempOptions =
                            tempProp.options &&
                            JSON.parse(JSON.stringify(tempProp.options));

                        if (groupFilters.labelOnSelect) {
                            if (tempOptions) {
                                tempOptions.forEach((items) => {
                                    const tempItem = items;
                                    tempItem.value = items.label;
                                });
                                tempProp.options = [...tempOptions];
                            }
                        }
                    }
                    tempGroupFilters.props = tempProp;
                    groupFilterTemp.push({
                        display: "none",
                        disabled: true,
                        validationDisplay: "none",
                        componentId: groupFilters.name,
                        ...groupFilters
                    });
                });
                filter.unshift({
                    label: item.label,
                    isSubFilter: item.isSubFilter,
                    isGroupFilter: item.isGroupFilter,
                    groupFilter: groupFilterTemp
                });
            }
        } else {
            item.groupFilter.forEach((groupFilters) => {
                const tempGroupFilters = groupFilters;
                let tempProp;
                if (groupFilters.props !== undefined) {
                    tempProp = groupFilters.props;
                } else tempProp = {};
                if (groupFilters.oneTimeCode) {
                    Object.entries(oneTimeValues).forEach(([key]) => {
                        if (
                            groupFilters.oneTimeCode === key &&
                            groupFilters.dataType !== "MasterTypeSelect"
                        ) {
                            tempProp.options = oneTimeValues[key];
                        } else {
                            tempProp.selectOptions = oneTimeValues[key];
                        }
                    });
                    const tempOptions =
                        tempProp.options &&
                        JSON.parse(JSON.stringify(tempProp.options));

                    if (groupFilters.labelOnSelect) {
                        if (tempOptions) {
                            tempOptions.forEach((items) => {
                                const tempItem = items;
                                tempItem.value = items.label;
                            });
                            tempProp.options = [...tempOptions];
                        }
                    }
                }
                tempGroupFilters.props = tempProp;
                groupFilterTemp.push({
                    display: "none",
                    disabled: true,
                    validationDisplay: "none",
                    componentId: groupFilters.name,
                    ...groupFilters
                });
            });
            filter.unshift({
                label: item.label,
                isSubFilter: item.isSubFilter,
                isGroupFilter: item.isGroupFilter,
                groupFilter: groupFilterTemp
            });
        }
        setFilterData(filterDataTemp);
        setFilters(filter);
    };

    /**
     * Method To close the filter element from rightDrawer
     * @param {*} item is the specific filter element object
     * @param {*} setFieldValue is formik call back function to set the field Values,
     * @param {*} name is name of the field
     * @param {*} values in formik state
     */
    const closeField = (item, setFieldValue, name, values) => {
        filter = [...filters];
        const tempValues = values;
        const index = filter.findIndex((it) => it.name === item.name);
        if (index !== -1) {
            filterData.filter.forEach((it) => {
                const itParam = it;
                if (it.name === item.name || item.name === `${it.name}.value`)
                    itParam.weight = 400;
                if (
                    item.conditionFieldName &&
                    item.conditionFieldName.length > 0
                ) {
                    Object.entries(tempValues).forEach(([keys]) => {
                        if (`${keys}.value` === item.name) {
                            delete tempValues[keys];
                        }
                    });
                    setFieldValue(`${item.labelName},check`, false);
                } else {
                    setFieldValue(name, "");
                }
            });
            if (item.isSubFilter) {
                filterData.filter.forEach((its) => {
                    if (its.label === item.label) {
                        its.subFilters.forEach((ite) => {
                            const iteParam = ite;
                            if (ite.label === item.type) {
                                iteParam.weight = 400;
                            }
                        });
                    }
                });
            }
            filter.splice(index, 1);
        }
        setFilters(filter);
    };
    /**
     * Method To handle filter conditional field in rightDrawer
     * @param {*} item is the specific filter element object
     * @param {*} values is formik values
     * @param {*} setFieldValue is the method to set formik values
     */
    const conditionHandler = (item, values, setFieldValue) => {
        filter = [...filters];
        filter.forEach((it) => {
            const itParam = it;
            if (it.name === item.name) {
                if (it.disabled === false) {
                    itParam.disabled = true;
                } else {
                    itParam.disabled = false;
                }
                if (it.display === "none") {
                    itParam.display = "";
                } else {
                    itParam.display = "none";
                }
            }
        });
        if (item.disabled === true) {
            const itemParam = item;
            delete itemParam.conditionFieldName;
            filter.forEach((filterItem) => {
                if (filterItem.name === item.name) {
                    Object.assign(filterItem, {
                        name: filterItem.name.replace(".value", "")
                    });
                }
            });
            Object.entries(values).forEach(([key, value]) => {
                if (key === item.name) {
                    const tempValues = values;
                    const tempValue = value.value;
                    delete tempValues[key];
                    setFieldValue(item.name, tempValue);
                }
            });
        }

        if (item.disabled === false) {
            filter.forEach((filterItem) => {
                if (filterItem.name === item.name) {
                    Object.assign(filterItem, {
                        conditionFieldName: `${item.name}.condition`,
                        name: `${item.name}.value`
                    });
                }
            });

            Object.entries(values).forEach(([key, value]) => {
                if (`${key}.value` === item.name) {
                    const tempObject = {};
                    Object.assign(tempObject, {
                        condition: "",
                        value
                    });
                    setFieldValue(key, tempObject);
                }
            });
        }
    };

    /**
     * Method To close the groupfilter element from rightDrawer
     * @param {*} quanta is the specific groupfilter element object
     * @param {*} setFieldValue is formik call back function to set the field Values,
     */
    const groupFilterCloseField = (quanta, setFieldValue) => {
        const index = filters.findIndex((it) => it.label === quanta.label);
        if (index !== -1) {
            filterData.filter.forEach((it) => {
                const itParam = it;
                if (it.label === quanta.label) {
                    itParam.weight = 400;
                    it.groupFilter.forEach((item) => {
                        setFieldValue(item.name, "");
                    });
                }
            });
        }
        filter = [...filters];
        filter.splice(index, 1);
        setFilters(filter);
    };
    /**
     * Method To handle groupfilter conditional field in rightDrawer
     * @param {*} item is the specific groupfilter element object
     *  @param {*} values is formik values
     * @param {*} setFieldValue is the method to set formik values
     */
    const groupFilterConditionHandler = (item, values, setFieldValue) => {
        filter = [...filters];
        filter.forEach((it) => {
            if (it.isGroupFilter) {
                it.groupFilter.forEach((groupFilters) => {
                    const groupFiltersParam = groupFilters;
                    if (groupFilters.name === item.name) {
                        if (!groupFilters.conditionFieldName)
                            groupFiltersParam.conditionFieldName = `${item.name}.condition`;
                        else delete groupFiltersParam.conditionFieldName;
                        if (groupFilters.disabled === false) {
                            groupFiltersParam.disabled = true;
                        } else {
                            groupFiltersParam.disabled = false;
                        }
                        if (groupFilters.display === "none") {
                            groupFiltersParam.display = "";
                        } else {
                            groupFiltersParam.display = "none";
                        }
                    }
                });
            }
        });
        if (item.disabled === true) {
            filter.forEach((filterItem) => {
                if (filterItem.isGroupFilter) {
                    filterItem.groupFilter.forEach((groupFilters) => {
                        const groupFiltersParam = groupFilters;
                        if (groupFilters.name === item.name) {
                            delete groupFiltersParam.conditionFieldName;
                            groupFiltersParam.name = groupFiltersParam.name.replace(
                                ".value",
                                ""
                            );
                        }
                    });
                }
            });
            Object.entries(values).forEach(([key, value]) => {
                if (key === item.name) {
                    const tempValues = values;
                    const tempValue = value.value;
                    delete tempValues[key];
                    setFieldValue(item.name, tempValue);
                }
            });
        }

        if (item.disabled === false) {
            filter.forEach((filterItem) => {
                if (filterItem.isGroupFilter) {
                    filterItem.groupFilter.forEach((groupFilters) => {
                        const groupFiltersParam = groupFilters;
                        if (groupFilters.name === item.name) {
                            groupFiltersParam.name = `${groupFiltersParam.name}.value`;
                        }
                    });
                }
            });

            Object.entries(values).forEach(([key, value]) => {
                if (`${key}.value` === item.name) {
                    const tempObject = {};
                    Object.assign(tempObject, {
                        value
                    });
                    setFieldValue(key, tempObject);
                }
            });
        }
        setFilters(filter);
    };

    /**
     * Method to display left Popup
     */
    const openLeftPopUp = () => {
        if (leftPopUpShow === false) setLeftShowPopup(true);
    };

    /**
     * Method To open the save filter element from rightDrawer
     */
    const openSavePopup = () => {
        setShowSavePopup("");
    };

    /**
     * Method To close the save filter element from rightDrawer
     */
    const closeSavePopUp = () => {
        setShowSavePopup("none");
        setSaveFilterWarning("");
    };

    /**
     * Method To bind to save filter element from rightDrawer
     */
    const handleSaveFilterName = (name) => {
        setToSaveFilterName(name);
    };

    /**
     * Method to validate saveFilter Name
     */
    const handleSaveFilterNameValidation = () => {
        if (toSaveFilterName.length > 0) return true;
        return false;
    };
    /**
     * Method To save filter elements from rightDrawer
     */
    const saveFilter = (saveFilters) => {
        const validated = handleSaveFilterNameValidation();
        if (validated) {
            const saveFilterObject = {};
            const chipObject = {};
            filterDataTemp = {
                ...filterData
            };
            Object.entries(saveFilters).forEach(([key, value]) => {
                const label = DeepSearchLabel(filterDataTemp, key);
                if (label !== "") chipObject[label] = value;
            });
            initialValueObject = {
                ...initialValuesObject
            };
            Object.entries(saveFilters).forEach(([key, value]) => {
                initialValueObject[key] = value;
            });
            setInitialValuesObject(initialValueObject);
            const applied = {};
            Object.entries(chipObject).forEach(([key, values]) => {
                if (
                    !values.condition &&
                    (((typeof values === "string" || Array.isArray(values)) &&
                        values.length > 0) ||
                        (values &&
                            values.constructor === Object &&
                            Object.keys(values).length > 0) ||
                        (typeof values === "boolean" &&
                            !key.includes(",check")))
                ) {
                    applied[key] = values;
                } else if (
                    (values.condition && values.condition.length > 0) ||
                    ((typeof values.value === "string" ||
                        Array.isArray(values.value)) &&
                        values.value.length > 0) ||
                    (typeof values.value === "object" &&
                        !Array.isArray(values.value) &&
                        Object.keys(values.value).length > 0) ||
                    (typeof values.value === "boolean" &&
                        !key.includes(",check"))
                ) {
                    applied[key] = values;
                }
            });
            if (Object.keys(applied).length > 0) {
                saveFilterObject[toSaveFilterName] = { ...applied };
                console.log(saveFilterObject);
            }
            setToSaveFilterName("");
            closeSavePopUp();
            setSaveFilterWarning("");
        } else {
            setSaveFilterWarning("Enter Valid Name");
        }
    };
    return (
        <div className="nf-header">
            <MainFilterPanel
                listViewName={listViewName}
                savedFilterName={savedFilterName}
                showDrawer={showDrawer}
                applyFilterChip={applyFilterChip}
                CustomPanel={CustomPanel}
                listView={listView}
                savedFilters={savedFilters}
                handlelistViewClick={handlelistViewClick}
                openLeftPopUp={openLeftPopUp}
                leftPopUpShow={leftPopUpShow}
                closeLeftPopUp={closeLeftPopUp}
                resetFilter={resetFilter}
                theme={theme}
            />
            {/* <div id="popover-target"> */}
            {/* <IPopover
                    isOpen={showApplyFilter}
                    placement="right"
                    target="popover-target"
                    toggle={() => closeDrawer()}
                    trigger="legacy"
                    hideArrow
                >
                    <IPopoverHeader>Popover header</IPopoverHeader>
                    <IPopoverBody> */}
            <OutsideClickHandler onOutsideClick={closeDrawer}>
                {showApplyFilter && (
                    <div className={theme ? `nf-filter ${theme}` : "nf-filter"}>
                        <div className="nf-filter__wrap">
                            <div
                                className="nf-filter__list"
                                style={{
                                    display: autoLoad
                                }}
                            >
                                <LeftDrawer
                                    filterData={filterData}
                                    individualFiltersfromLeftToRight={
                                        individualFiltersfromLeftToRight
                                    }
                                    accordionFiltersFromLeftToRight={
                                        accordionFiltersFromLeftToRight
                                    }
                                    groupFiltersFromLeftToRight={
                                        groupFiltersFromLeftToRight
                                    }
                                />
                            </div>
                            <div className="nf-filter__form">
                                <RightDrawer
                                    filterShow={filterShow}
                                    recentFilterShow={recentFilterShow}
                                    autoLoad={autoLoad}
                                    components={components}
                                    filters={filters}
                                    applyFilter={applyFilter}
                                    closeDrawer={closeDrawer}
                                    clearDrawer={clearDrawer}
                                    filterCount={filterCount}
                                    emptyFilterClassName={emptyFilterClassName}
                                    emptyFilterWarning={emptyFilterWarning}
                                    recentFilterShowProp={recentFilterShow}
                                    filterShowProp={filterShow}
                                    initialValuesObject={initialValuesObject}
                                    applyFilterValidation={
                                        applyFilterValidation
                                    }
                                    applyValidator={applyValidator}
                                    closeField={closeField}
                                    conditionHandler={conditionHandler}
                                    groupFilterCloseField={
                                        groupFilterCloseField
                                    }
                                    groupFilterConditionHandler={
                                        groupFilterConditionHandler
                                    }
                                    listViewClick={listViewClick}
                                    listView={listView}
                                    savedFilters={savedFilters}
                                    listViewName={listViewName}
                                    savedFilterName={savedFilterName}
                                    savedFilterClick={savedFilterClick}
                                    completeListViewClick={
                                        completeListViewClick
                                    }
                                    completeSavedFilterClick={
                                        completeSavedFilterClick
                                    }
                                    filterData={filterData}
                                    showSavePopup={showSavePopup}
                                    openSavePopup={openSavePopup}
                                    closeSavePopUp={closeSavePopUp}
                                    handleSaveFilterName={handleSaveFilterName}
                                    saveFilter={saveFilter}
                                    toSaveFilterName={toSaveFilterName}
                                    recentFilter={recentFilter}
                                    saveFilterWarning={saveFilterWarning}
                                    handlelistViewClick={handlelistViewClick}
                                    theme={theme}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </OutsideClickHandler>
            {/* </IPopoverBody>
                </IPopover> */}
            {/* </div> */}
        </div>
    );
}

Filter.propTypes = {
    filterDataProp: PropTypes.any,
    appliedFiltersProp: PropTypes.any,
    CustomPanel: PropTypes.any,
    listView: PropTypes.any,
    savedFilters: PropTypes.any,
    oneTimeValues: PropTypes.any,
    components: PropTypes.any,
    recentFilter: PropTypes.any,
    filterValue: PropTypes.any,
    theme: PropTypes.any
};
