import React, { useState, useEffect } from "react";
// import "react-bootstrap-typeahead/css/Typeahead.css";
import { Multiselect } from "multiselect-react-dropdown";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Form } from "react-bootstrap";

export default function AutoComplete(props) {
    const [autoCompleteArr, setAutoAcompleteArr] = useState([]);
    useEffect(() => {
        setAutoAcompleteArr(props.autoCompleteArray);
    }, [props.autoCompleteArray]);
    /**
     * Method To close the filter
     * @param {*} item is specific filter element
     */
    const handleClose = (item) => {
        props.deleteAutoCompleteElement(item);
    };
    /**
     * Method To pass the selected list of values to create value array
     * @param {*} selectedList is entire list of selected
     * @param {*} selectedItem is specific item selected now
     * @param {*} item is specific filter element
     */
    const onSelect = (selectedList, selectedItem, item) => {
        props.createAutoCompleteArray(item, selectedList);
    };
    let autoCompleteDiv = autoCompleteArr.map((item, index) => {
        let validationClass = "";
        if (item.validated === false) {
            validationClass = "text-danger";
        }
        return (
            <div className="filter__input" key={index}>
                <div className="filter__input-title">
                    <div className="filter__label">
                        <span>{item.name}</span>
                        <span>&nbsp;&gt;&nbsp;</span>
                        <span>{item.type}</span>
                    </div>
                    <div className="filter__control">
                        <Form.Check
                            type="switch"
                            label=""
                            className={item.type.concat(item.name)}
                            id={item.name.concat(item.type)}
                            checked={item.enabled}
                            onChange={(e) => {
                                props.handleAutoCompleteEnabled(item);
                            }}
                        />
                        <FontAwesomeIcon
                            icon={faTimes}
                            type="button"
                            onClick={(e) => {
                                handleClose(item);
                            }}
                        />
                    </div>
                </div>
                <div className="displayFlex multiselect">
                    <Multiselect
                        id={item.type.concat(item.name)}
                        disable={!item.enabled}
                        options={item.objectArray}
                        closeIcon="close"
                        displayValue="key"
                        className="form-control"
                        selectedValues={item.value}
                        onSelect={(e) => {
                            onSelect(e, e[e.length - 1], item);
                        }}
                    />
                </div>
                <span id="fieldWarning" className={validationClass}>
                    {item.warning}
                </span>
            </div>
        );
    });
    return <div>{autoCompleteDiv}</div>;
}
