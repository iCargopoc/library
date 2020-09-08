/* eslint-disable react/destructuring-assignment */

import React, { useState, useEffect } from "react";
import { Form } from "react-bootstrap";
import PropTypes from "prop-types";
import { ReactComponent as IconTimes } from "../images/icon-close.svg";

export default function FieldComponent(props) {
    const [fieldComponentArr, setFieldComponentArr] = useState([]);
    useEffect(() => {
        setFieldComponentArr(props.dateTimesArray);
    }, [props.dateTimesArray]);
    /**
     * Method To close the filter
     * @param {*} item is specific filter element
     */
    const handleClose = (item) => {
        props.deleteDateTimeElement(item);
    };
    const fieldComponentDiv = fieldComponentArr.map((item) => {
        let validationClass = "";
        if (item.validated === false) {
            validationClass = "text-danger";
        }
        return (
            <div className="filter__input" key={item}>
                <div className="filter__input-title" key={1}>
                    <div className="filter__label">
                        <Form.Label>
                            <strong>{item.name}</strong>
                        </Form.Label>
                    </div>
                    <div className="filter__control">
                        <Form.Check
                            type="switch"
                            id={item.name}
                            label=""
                            defaultChecked={item.enabled}
                            data-testid="handleDateTimeEnabled-check"
                            onChange={() => {
                                props.handleDateTimeEnabled(item);
                            }}
                        />
                        <div
                            role="presentation"
                            data-testid="deleteDateTimeElement-click"
                            onClick={() => {
                                handleClose(item);
                            }}
                        >
                            <IconTimes />
                        </div>
                    </div>
                </div>
                {item.field.map((field) => {
                    return (
                        <div key={`${field}-${field.name}`}>
                            <div
                                className="displayFlex"
                                key={`${field},${field.name}`}
                            >
                                <Form.Text>{field.column}</Form.Text>
                            </div>
                            <div className="filter__split" key={field}>
                                <div className="date-wrap">
                                    <Form.Control
                                        disabled={!item.enabled}
                                        type="datetime-local"
                                        value={field.value}
                                        className={field.name}
                                        data-testid="createDateTimeArray-input"
                                        onChange={(e) => {
                                            props.createDateTimeArray(
                                                item,
                                                field.column,
                                                e.target.value
                                            );
                                        }}
                                    />
                                    {/* <span className="date-button">
                                        <button type="button" />
                                    </span> */}
                                </div>
                            </div>
                        </div>
                    );
                })}
                <span id="fieldWarning" className={validationClass}>
                    {item.warning}
                </span>
            </div>
        );
    });
    return <div>{fieldComponentDiv}</div>;
}

FieldComponent.propTypes = {
    dateTimesArray: PropTypes.any,
    deleteDateTimeElement: PropTypes.any,
    handleDateTimeEnabled: PropTypes.any,
    createDateTimeArray: PropTypes.any
};
