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

    const dateTimeDiv = fieldComponentArr.map((item) => {
        return (
            <div className="form-group">
                <div className="title" key={item.name}>
                    <h5>{item.name}</h5>
                    <div className="controls">
                        <div
                            role="presentation"
                            data-testid="deleteDateTimeElement-click"
                            onClick={() => {
                                props.closeDateTime(item);
                            }}
                        >
                            <IconTimes />
                        </div>
                    </div>
                </div>
                <div className="form-inputs">
                    <IDatePicker name="date" />
                    <span id="fieldWarning" className="text-danger">
                        This field is required*
                    </span>
                </div>
            </div>
        );
    });
    return <div>{dateTimeDiv}</div>;
};

export default DateTime;

DateTime.propTypes = {
    dateTimesArray: PropTypes.any,
    closeDateTime: PropTypes.any
};
