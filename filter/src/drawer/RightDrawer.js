import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { withFormik, useFormikContext } from "formik";
import { IButton } from "@neo/button";
import "react-datepicker/dist/react-datepicker.css";
import FilterForm from "../component/filterForm";
import { DeepSearchName } from "../utilities/deepSearch";

const RightDrawer = (props) => {
    const { handleSubmit, components, filterData } = props;
    const { values, setFieldValue } = useFormikContext();
    const [applyFilterWarning, setApplyFilterWarning] = useState("");
    const [
        applyfilterWarningClassName,
        setApplyFilterWariningClassname
    ] = useState("");
    const [recentFilterShow, setRecentFilterShow] = useState("none");
    const [filterShow, setFilterShow] = useState("");
    const [showSavePopup, setShowSavePopup] = useState("none");
    const {
        emptyFilterWarning,
        emptyFilterClassName,
        filterShowProp,
        recentFilterShowProp,
        filterCount,
        filters,
        closeField,
        conditionHandler,
        applyValidator,
        resetDrawer,
        groupFilterCloseField,
        groupFilterConditionHandler,
        listViewClick,
        listView,
        listViewName,
        savedFilters,
        savedFilterName,
        savedFilterClick
    } = props;
    useEffect(() => {
        setApplyFilterWarning(emptyFilterWarning);
        setApplyFilterWariningClassname(emptyFilterClassName);
    }, [emptyFilterWarning, emptyFilterClassName]);

    useEffect(() => {
        if (listViewClick) {
            listView.predefinedFilters.forEach((list) => {
                if (list.name === listViewName) {
                    const filterValueObject = {};
                    Object.entries(list.filters).forEach(([key, value]) => {
                        const filterDataTemp = { ...filterData };
                        const name = DeepSearchName(filterDataTemp, key);
                        filterValueObject[name] = value;
                    });
                    Object.entries(filterValueObject).forEach(
                        ([filterKeys, filterValues]) => {
                            setFieldValue(filterKeys, filterValues);
                            if (
                                filterValueObject[filterKeys].constructor ===
                                    Object &&
                                filterValueObject[filterKeys].condition
                            ) {
                                filters.forEach((filterItem) => {
                                    if (
                                        `${filterKeys}.value` ===
                                        filterItem.name
                                    ) {
                                        setFieldValue(
                                            `${filterItem.labelName},check`,
                                            true
                                        );
                                    }
                                });
                            }
                        }
                    );
                }
            });
        }
    }, [listViewClick]);

    useEffect(() => {
        if (savedFilterClick) {
            savedFilters.savedFilters.forEach((list) => {
                if (list.name === savedFilterName) {
                    const filterValueObject = {};
                    Object.entries(list.filters).forEach(([key, value]) => {
                        const filterDataTemp = { ...filterData };
                        const name = DeepSearchName(filterDataTemp, key);
                        filterValueObject[name] = value;
                    });
                    Object.entries(filterValueObject).forEach(
                        ([filterKeys, filterValues]) => {
                            setFieldValue(filterKeys, filterValues);
                            if (
                                filterValueObject[filterKeys].constructor ===
                                    Object &&
                                filterValueObject[filterKeys].condition
                            ) {
                                filters.forEach((filterItem) => {
                                    if (
                                        `${filterKeys}.value` ===
                                        filterItem.name
                                    ) {
                                        setFieldValue(
                                            `${filterItem.labelName},check`,
                                            true
                                        );
                                    }
                                });
                            }
                        }
                    );
                }
            });
        }
    }, [savedFilterClick]);

    useEffect(() => {
        setRecentFilterShow(recentFilterShowProp);
        setFilterShow(filterShowProp);
    }, [recentFilterShowProp, filterShowProp]);

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
    };
    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div
                    style={{
                        display: recentFilterShow
                    }}
                    className="filter__content"
                >
                    <div className="filter__recentFilterTitle">
                        Recent Filters
                    </div>
                </div>

                <div
                    style={{
                        display: filterShow
                    }}
                >
                    <div className="filter__title">
                        Selected Filters
                        <span className="filter-count">{filterCount}</span>
                    </div>
                    <div className="filter__content">
                        <FilterForm
                            filters={filters}
                            closeField={closeField}
                            conditionHandler={conditionHandler}
                            groupFilterCloseField={groupFilterCloseField}
                            groupFilterConditionHandler={
                                groupFilterConditionHandler
                            }
                            customComponents={components}
                        />
                        <div className="filter__warning">
                            <span
                                id="fieldWarning"
                                className="text-danger"
                                style={{
                                    display: applyValidator
                                }}
                            >
                                No filter selected!
                            </span>
                        </div>
                    </div>
                    <div className="filter__btn">
                        <div className="filter__save">
                            <IButton
                                type="button"
                                className="neo-btn-link pointer"
                                onClick={openSavePopup}
                                data-testId="savePopUp"
                            >
                                Save
                            </IButton>
                        </div>
                        <div className="btn-wrap">
                            <span className={applyfilterWarningClassName}>
                                {applyFilterWarning}
                            </span>
                            <IButton
                                type="button"
                                data-testId="reset"
                                className="neo-btn-link pointer"
                                onClick={() => {
                                    resetDrawer(values, setFieldValue);
                                }}
                            >
                                Reset
                            </IButton>
                            <IButton
                                type="submit"
                                className="neo-btn-primary pointer"
                                data-testId="applyFilter"
                            >
                                Apply Filter
                            </IButton>
                        </div>
                        <div
                            style={{
                                display: showSavePopup
                            }}
                            className="popup--save"
                        >
                            <h5>Save the Filter</h5>
                            <label
                                className="neo-form-control-label"
                                htmlFor="saveFilterName"
                            >
                                Save Filter Name
                                <input
                                    id="saveFilterName"
                                    className="txt"
                                    data-testId="registersaveFilterName-input"
                                    onChange={() => {}}
                                />
                            </label>
                            <div className="btn-wrap">
                                <IButton
                                    type="button"
                                    className="neo-btn-primary pointer"
                                    data-testId="cancelSavePopup-button"
                                    onClick={() => {
                                        closeSavePopUp();
                                    }}
                                >
                                    Cancel
                                </IButton>
                                <IButton
                                    type="button"
                                    className="neo-btn-primary pointer"
                                    data-testId="saveFilter-button"
                                    onClick={() => {
                                        closeSavePopUp();
                                    }}
                                >
                                    Save
                                </IButton>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

RightDrawer.propTypes = {
    emptyFilterWarning: PropTypes.any,
    emptyFilterClassName: PropTypes.any,
    recentFilterShowProp: PropTypes.any,
    filterShowProp: PropTypes.any,
    filterCount: PropTypes.any,
    resetDrawer: PropTypes.any,
    filters: PropTypes.any,
    closeField: PropTypes.any,
    conditionHandler: PropTypes.any,
    handleSubmit: PropTypes.any,
    applyValidator: PropTypes.any,
    groupFilterCloseField: PropTypes.any,
    groupFilterConditionHandler: PropTypes.any,
    listViewClick: PropTypes.any,
    listView: PropTypes.any,
    listViewName: PropTypes.any,
    savedFilters: PropTypes.any,
    savedFilterName: PropTypes.any,
    savedFilterClick: PropTypes.any,
    components: PropTypes.any,
    filterData: PropTypes.any
};

export default withFormik({
    displayName: "BasicForm",
    mapPropsToValues: (props) => props.initialValuesObject,
    validateOnBlur: false,
    validateOnChange: false,
    handleSubmit: (values, { props }) => {
        props.applyFilter(values);
    }
})(RightDrawer);
