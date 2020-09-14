/* eslint-disable react/destructuring-assignment */
import React, { useState, useEffect } from "react";
import { IDatePicker } from "@neo-ui/date";
import "react-datepicker/dist/react-datepicker.css";
import PropTypes from "prop-types";
import { IconTimes } from "../Utilities/SvgUtilities";

const DateTimeRange = (props) => {
    const [fieldComponentArr, setFieldComponentArr] = useState([]);

    useEffect(() => {
        if (props.dateTimeRangesArray)
            setFieldComponentArr(props.dateTimeRangesArray);
    }, [props.dateTimeRangesArray]);

    const dateTimeRangeDiv = fieldComponentArr.map((item) => {
        return (
            <div className="form-group" key={item.name}>
                <div className="title">
                    <h5>{item.name}</h5>
                    <div className="controls">
                        <div
                            role="presentation"
                            data-testid="deleteDateTimeElement-click"
                            onClick={() => {
                                props.closeDateTimeRange(item);
                            }}
                        >
                            <IconTimes />
                        </div>
                    </div>
                </div>
                <div className="form-inputs">
                    <label>From Date Time</label>
                    <div className="input-wrap">
                        <IDatePicker name="fromDateTime" />
                    </div>
                </div>
                <div className="form-inputs">
                    <label>To Date Time</label>
                    <div className="input-wrap">
                        <IDatePicker name="toDateTime" />
                        <span id="fieldWarning" className="text-danger">
                            This field is required*
                        </span>
                    </div>
                </div>
            </div>
        );
    });

    return <div>{dateTimeRangeDiv}</div>;
};

export default DateTimeRange;

DateTimeRange.propTypes = {
    dateTimeRangesArray: PropTypes.any,
    closeDateTimeRange: PropTypes.any
};
