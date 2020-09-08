/* eslint-disable react/destructuring-assignment */

import React, { useState, useEffect } from "react";
import { Multiselect } from "multiselect-react-dropdown";
import { Form } from "react-bootstrap";
import PropTypes from "prop-types";
import { ReactComponent as IconTimes } from "../images/icon-close.svg";

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
    const autoCompleteDiv = autoCompleteArr.map((item) => {
        let validationClass = "";
        if (item.validated === false) {
            validationClass = "text-danger";
        }
        return (
            <div className="filter__input" key={item}>
                <div className="filter__input-title">
                    <div className="filter__label">
                        <span>{item.name}</span>
                        <span>&nbsp;&gt;&nbsp;</span>
                        <span>{item.type}</span>
                    </div>
                    <div className="filter__control">
                        <Form.Check
                            data-testid="handleAutoCompleteEnabled-check"
                            type="switch"
                            label=""
                            className={item.type.concat(item.name)}
                            id={item.name.concat(item.type)}
                            checked={item.enabled}
                            onChange={() => {
                                props.handleAutoCompleteEnabled(item);
                            }}
                        />
                        <div
                            role="presentation"
                            data-testid="deleteAutoCompleteElement-click"
                            onClick={() => {
                                handleClose(item);
                            }}
                        >
                            <IconTimes />
                        </div>
                    </div>
                </div>
                <div className="displayFlex multiselect">
                    <Multiselect
                        data-testid="autoCompleteSelect"
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

AutoComplete.propTypes = {
    autoCompleteArray: PropTypes.any,
    deleteAutoCompleteElement: PropTypes.any,
    createAutoCompleteArray: PropTypes.any,
    handleAutoCompleteEnabled: PropTypes.any
};
