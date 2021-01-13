import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { withFormik, useFormikContext } from "formik";
import { IButton } from "@neo/button";
import "react-datepicker/dist/react-datepicker.css";
import { ITooltip } from "@neo/tooltip";
import FilterForm from "../component/filterForm";

let recentFiltersDiv = "";
const RightDrawer = (props) => {
    const { handleSubmit, components } = props;
    const { values, setFieldValue } = useFormikContext();
    const [applyFilterWarning, setApplyFilterWarning] = useState("");
    const [
        applyfilterWarningClassName,
        setApplyFilterWariningClassname
    ] = useState("");
    const [recentFilterShow, setRecentFilterShow] = useState("none");
    const [filterShow, setFilterShow] = useState("");
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
        clearDrawer,
        groupFilterCloseField,
        groupFilterConditionHandler,
        listViewClick,
        listView,
        listViewName,
        savedFilters,
        savedFilterName,
        savedFilterClick,
        showSavePopup,
        closeSavePopUp,
        openSavePopup,
        handleSaveFilterName,
        saveFilter,
        toSaveFilterName,
        recentFilter,
        autoLoad,
        saveFilterWarning,
        handlelistViewClick,
        theme
    } = props;
    useEffect(() => {
        setApplyFilterWarning(emptyFilterWarning);
        setApplyFilterWariningClassname(emptyFilterClassName);
    }, [emptyFilterWarning, emptyFilterClassName]);

    useEffect(() => {
        if (listViewClick) {
            listView.predefinedFilters.forEach((list) => {
                if (
                    list.name === listViewName &&
                    listViewName !== "Custom Filter"
                ) {
                    Object.entries(list.filters).forEach(
                        ([filterKeys, filterValues]) => {
                            setFieldValue(filterKeys, filterValues);
                            if (
                                list.filters[filterKeys].constructor ===
                                    Object &&
                                list.filters[filterKeys].condition
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
                if (
                    list.name === savedFilterName &&
                    listViewName !== "Custom Filter"
                ) {
                    Object.entries(list.filters).forEach(
                        ([filterKeys, filterValues]) => {
                            setFieldValue(filterKeys, filterValues);
                            if (
                                list.filters[filterKeys].constructor ===
                                    Object &&
                                list.filters[filterKeys].condition
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

    if (recentFilter) {
        recentFiltersDiv = recentFilter.map((item, keyspect) => {
            return (
                <div
                    className="nf-recentsearch__list"
                    role="presentation"
                    onClick={() => {
                        handlelistViewClick(item, "listView");
                    }}
                >
                    <span
                        className="neo-btn-link pointer"
                        id={`tooltip-target${keyspect}`}
                    >
                        {Object.entries(item.filters).map(([key, value]) => {
                            if (
                                typeof value === "string" ||
                                value.constructor === Object ||
                                Array.isArray(value) ||
                                typeof value === "boolean"
                            ) {
                                return (
                                    <>
                                        <span className="nf-recentsearch__label">
                                            {key}:
                                        </span>
                                        {(typeof value === "string" ||
                                            typeof value === "boolean") && (
                                            <span className="nf-recentsearch__value">
                                                {String(value)}
                                            </span>
                                        )}
                                        {value.constructor === Object &&
                                            Object.entries(value).map(
                                                ([keysItem, valuesItem]) => {
                                                    return (
                                                        <span
                                                            key={keysItem}
                                                            className="nf-recentsearch__value"
                                                        >
                                                            {valuesItem}
                                                        </span>
                                                    );
                                                }
                                            )}
                                        {Array.isArray(value) &&
                                            value.map((valueItem) => {
                                                return (
                                                    <span className="nf-recentsearch__value">
                                                        {valueItem}
                                                    </span>
                                                );
                                            })}
                                        ;
                                    </>
                                );
                            }
                            return "";
                        })}
                    </span>
                    <ITooltip
                        target={`tooltip-target${keyspect}`}
                        placement="left"
                        className="toolTipBody"
                    >
                        <span className="nf-recentsearch__tooltip">
                            {Object.entries(item.filters).map(
                                ([key, value]) => {
                                    if (
                                        typeof value === "string" ||
                                        value.constructor === Object ||
                                        Array.isArray(value) ||
                                        typeof value === "boolean"
                                    ) {
                                        return (
                                            <>
                                                <span className="nf-recentsearch__tooltip-label">
                                                    {key}:
                                                </span>
                                                {(typeof value === "string" ||
                                                    typeof value ===
                                                        "boolean") && (
                                                    <span className="nf-recentsearch__tooltip-value">
                                                        {String(value)}
                                                    </span>
                                                )}
                                                {value.constructor === Object &&
                                                    Object.entries(value).map(
                                                        ([
                                                            keysItem,
                                                            valuesItem
                                                        ]) => {
                                                            return (
                                                                <span
                                                                    key={
                                                                        keysItem
                                                                    }
                                                                    className="nf-recentsearch__tooltip-value"
                                                                >
                                                                    {valuesItem}
                                                                </span>
                                                            );
                                                        }
                                                    )}
                                                {Array.isArray(value) &&
                                                    value.map((valueItem) => {
                                                        return (
                                                            <span className="nf-recentsearch__tooltip-value">
                                                                {valueItem}
                                                            </span>
                                                        );
                                                    })}
                                                <br />
                                            </>
                                        );
                                    }
                                    return "";
                                }
                            )}
                        </span>
                    </ITooltip>
                </div>
            );
        });
    }
    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div
                    style={{
                        display: recentFilterShow
                    }}
                    className="nf-recentsearch"
                >
                    <div className="nf-recentsearch__title">Recent Filters</div>
                    <div className="nf-recentsearch__content">
                        {recentFiltersDiv}
                    </div>
                </div>

                <div
                    className="nf-form"
                    style={{
                        display: filterShow
                    }}
                >
                    <div className="nf-form__title">
                        Selected Filters
                        <span className="nf-form__count">{filterCount}</span>
                    </div>
                    <div
                        className={
                            filterShow === "" && recentFilterShow === "none"
                                ? "nf-form__content is-clear"
                                : "nf-form__content"
                        }
                        style={
                            (theme === undefined &&
                                (filterShow === "" &&
                                recentFilterShow === "none"
                                    ? { height: `calc(100vh - 65px)` }
                                    : { height: `calc(100vh - 280px)` })) ||
                            (!!theme && { height: `calc(65vh - 50px)` })
                        }
                    >
                        <FilterForm
                            filters={filters}
                            closeField={closeField}
                            conditionHandler={conditionHandler}
                            groupFilterCloseField={groupFilterCloseField}
                            groupFilterConditionHandler={
                                groupFilterConditionHandler
                            }
                            customComponents={components}
                            autoLoad={autoLoad}
                        />
                        <div className="nf-form__warning">
                            <span
                                id="fieldWarning"
                                className="nf-form__danger"
                                style={{
                                    display: applyValidator
                                }}
                            >
                                No filter selected!
                            </span>
                        </div>
                    </div>
                    <div className="nf-form__btn-block">
                        <div className="nf-form__btn-save">
                            <IButton
                                type="button"
                                className="neo-btn-link pointer"
                                onClick={openSavePopup}
                                data-testId="savePopUp"
                            >
                                Save
                            </IButton>
                        </div>
                        <div className="nf-form__btn-wrap">
                            <span className={applyfilterWarningClassName}>
                                {applyFilterWarning}
                            </span>
                            <IButton
                                style={{ display: autoLoad }}
                                type="button"
                                dataTestId="reset"
                                className="neo-btn-link pointer"
                                onClick={() => {
                                    clearDrawer(values, setFieldValue);
                                }}
                            >
                                Clear
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
                            className="nf-popover"
                        >
                            <h5 className="nf-popover__title">
                                Save the Filter
                            </h5>
                            <label
                                className="neo-form-control-label"
                                htmlFor="saveFilterName"
                            >
                                Save Filter Name
                                <input
                                    id="saveFilterName"
                                    className="nf-txt"
                                    data-testId="registersaveFilterName-input"
                                    value={toSaveFilterName}
                                    onChange={(e) => {
                                        handleSaveFilterName(e.target.value);
                                    }}
                                />
                            </label>
                            {saveFilterWarning.length > 0 && (
                                <label className="neo-form-control-label nf-form__danger">
                                    {saveFilterWarning}
                                </label>
                            )}
                            <div className="nf-popover__btn-wrap">
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
                                        saveFilter(values);
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
    clearDrawer: PropTypes.any,
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
    showSavePopup: PropTypes.any,
    closeSavePopUp: PropTypes.any,
    openSavePopup: PropTypes.any,
    handleSaveFilterName: PropTypes.any,
    saveFilter: PropTypes.any,
    toSaveFilterName: PropTypes.any,
    recentFilter: PropTypes.any,
    autoLoad: PropTypes.any,
    saveFilterWarning: PropTypes.any,
    handlelistViewClick: PropTypes.any,
    theme: PropTypes.any
};

export default withFormik({
    enableReinitialize: true,
    displayName: "BasicForm",
    mapPropsToValues: (props) => props.initialValuesObject,
    validateOnBlur: false,
    validateOnChange: false,
    handleSubmit: (values, { props }) => {
        props.applyFilter(values);
    }
})(RightDrawer);
