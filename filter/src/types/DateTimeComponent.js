/* eslint-disable react/destructuring-assignment */

import React, { useState, useEffect } from "react";
import { IDatePicker } from "@neo-ui/date";
import "react-datepicker/dist/react-datepicker.css";
import PropTypes from "prop-types";
import { IconTimes } from "../Utilities/SvgUtilities";

const DateTime = (props) => {
    const [fieldComponentArr, setFieldComponentArr] = useState([]);
    useEffect(() => {
        if (props.dateTimesArray) setFieldComponentArr(props.dateTimesArray);
    }, [props.dateTimesArray]);
    const fieldComponentDiv = fieldComponentArr.map((item) => {
        return (
            <div className="filter__input" key={item.name}>
                <div className="filter__input-title" key={1}>
                    <div className="filter__label">
                        <label>
                            <strong>{item.name}</strong>
                        </label>
                    </div>
                    <div className="filter__control">
                        <input
                            type="checkBox"
                            id={item.name}
                            label=""
                            defaultChecked
                        />
                        <div
                            role="presentation"
                            data-testid="deleteDateTimeElement-click"
                        >
                            <IconTimes />
                        </div>
                    </div>
                    <IDatePicker name="dateTime" />
                    {/* <IDatePicker name="toDateTime" /> */}
                </div>
            </div>
        );
    });
    return <div>{fieldComponentDiv}</div>;
};

export default DateTime;

DateTime.propTypes = {
    dateTimesArray: PropTypes.any
};
