import React, { forwardRef, useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import AutoComplete from "../types/AutoCompleteComponent";
import FieldComponent from "../types/DateTimeComponent";
import Condition from "../types/ConditionalComponent";
import TextComponents from "../types/TextComponents";
import saveLogo from "../images/save-icon.svg";

const RightDrawer = (props) => {
    const [showSavePopup, setShowSavePopup] = useState("none");
    const [saveFilterName, setSaveFilterName] = useState("");
    const [saveFilterWarning, setSaveFilterWarning] = useState("");
    const [warningLabel, setWarningLabel] = useState("");
    const [applyFilterWarning, setApplyFilterWarning] = useState("");
    const [applyfilterWarningClassName, setApplyFilterWariningClassname] = useState("");
    const [recentFilterShow, setRecentFilterShow] = useState("none");
    const [filterShow, setFilterShow] = useState("");
    useEffect(() => {
        setApplyFilterWarning(props.emptyFilterWarning);
        setApplyFilterWariningClassname(props.emptyFilterClassName);
    }, [props.emptyFilterWarning, props.emptyFilterClassName]);
    useEffect(() => {
        setWarningLabel(props.saveWarningClassName);
        setSaveFilterWarning(props.saveWarningLabel);
        setShowSavePopup(props.showSavePopUp);
    }, [props.saveWarningClassName, props.saveWarningLabel, props.showSavePopUp]);
    useEffect(() => {
        setRecentFilterShow(props.recentFilterShow);
        setFilterShow(props.filterShow);
    }, [props.recentFilterShow, props.filterShow]);
    /**
     * Method To pass the required name of the filter required to be saved
     * @param {*} e is event triggered when typing on the to-save filter name field
     */
    const registersaveFilterName = (e) => {
        setSaveFilterName(e.target.value);
    };

    /**
     * Method To close the save popup on clicking cancel button
     */
    const cancelSavePopup = () => {
        setShowSavePopup("none");
        setSaveFilterWarning("");
        setWarningLabel("");
    };
    let savedFilters = localStorage.getItem("savedFilters");
    savedFilters = savedFilters ? JSON.parse(savedFilters) : [];
    if (savedFilters.length > 2) {
        savedFilters = savedFilters.slice(savedFilters.length - 2, savedFilters.length);
    }
    const recent = savedFilters.map((filterArray, index) => {
        return (
            <div
                className="recentFilters"
                key={index}
                onClick={(e) => {
                    props.addSavedFilters(filterArray);
                }}
            >
                {Object.keys(filterArray)[0]}
            </div>
        );
    });
    return (
        <React.Fragment>
            <div style={{ display: recentFilterShow }} className="filter__content">
                <div>Recent Filters</div>
                {recent}
            </div>

            <div style={{ display: filterShow }}>
                <div className="filter__title">
                    Selected Filters
                    <span className="filter-count">{props.filterCount}</span>
                </div>
                <div className="filter__content">
                    <AutoComplete
                        name={props.name}
                        type={props.type}
                        enabled={props.enabled}
                        dataType={props.dataType}
                        options={props.options}
                        autoCompleteArray={props.autoCompleteArray}
                        deleteAutoCompleteElement={props.deleteAutoCompleteElement}
                        handleAutoCompleteEnabled={props.handleAutoCompleteEnabled}
                        createAutoCompleteArray={props.createAutoCompleteArray}
                    />
                    <FieldComponent
                        dateTimesArray={props.dateTimesArray}
                        deleteDateTimeElement={props.deleteDateTimeElement}
                        handleDateTimeEnabled={props.handleDateTimeEnabled}
                        createDateTimeArray={props.createDateTimeArray}
                        addToday={props.addToday}
                        addTomorrow={props.addTomorrow}
                        addThisMonth={props.addThisMonth}
                        addForteenDays={props.addForteenDays}
                        addSevenDays={props.addSevenDays}
                        addThisWeek={props.addThisWeek}
                        addThirtyDays={props.addThirtyDays}
                        lastDayChange={props.lastDayChange}
                        nextDayChange={props.nextDayChange}
                    />
                    <Condition
                        conditionsArray={props.conditionsArray}
                        handleCondionalEnabled={props.handleCondionalEnabled}
                        createConditionalArray={props.createConditionalArray}
                        deleteConditionalElement={props.deleteConditionalElement}
                    />
                    <TextComponents
                        textComponentsArray={props.textComponentsArray}
                        deleteTextComponentElement={props.deleteTextComponentElement}
                        createTextComponentsArray={props.createTextComponentsArray}
                        handleTextComponentEnabled={props.handleTextComponentEnabled}
                    />
                </div>
                <div className="filter__btn">
                    <div className="filter__save">
                        <Button className="button-save" variant="">
                            <img src={saveLogo} onClick={props.openShowSavePopUp} alt="save icon" />
                            <span>SAVE</span>
                        </Button>
                    </div>
                    <div className="btn-wrap">
                        <span className={applyfilterWarningClassName}>{applyFilterWarning}</span>
                        <Button variant="" className="reset" onClick={props.resetDrawer}>
                            Reset
                        </Button>
                        <Button
                            variant=""
                            className="applyFilter"
                            onClick={(e) => {
                                props.applyFilter();
                                props.deleteAutoCompleteElement({});
                                props.deleteConditionalElement({});
                                props.deleteDateTimeElement({});
                                props.deleteTextComponentElement({});
                            }}
                        >
                            Apply Filter
                        </Button>
                    </div>
                    <div style={{ display: showSavePopup }} className="popup--save">
                        <h5>Save the Filter</h5>
                        <span className={warningLabel}>{saveFilterWarning}</span>
                        <label>Saved Filter Name</label>
                        <input className="txt" value={saveFilterName} onChange={(e) => registersaveFilterName(e)} />
                        <div className="btn-wrap">
                            <button
                                className="button"
                                onClick={(e) => {
                                    cancelSavePopup();
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                className="button"
                                onClick={(e) => {
                                    props.saveFilter(saveFilterName);
                                    // setSaveFilterName("");
                                }}
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};

export default RightDrawer;
