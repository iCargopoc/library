/* eslint-disable react/destructuring-assignment */

import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { ITextField } from "@neo-ui/textfield";
import { ISelect } from "@neo-ui/select";
import { IconTimes } from "../Utilities/SvgUtilities";

export default function TextField(props) {
    const [textComponentArr, setTextComponentArr] = useState([]);
    useEffect(() => {
        console.log(props.textComponentsArray);
        setTextComponentArr(props.textComponentsArray);
    }, [props.textComponentsArray]);

    const textComponentDiv = textComponentArr.map((item) => {
        return (
            <div key={item.name} className="form-group">
                <div className="title">
                    <h5>{item.name}</h5>
                    <div className="controls">
                        <label className="switch" htmlFor={item.name}>
                            <input
                                type="checkBox"
                                label=""
                                id={item.name}
                                data-testid="handleTextComponentEnabled-check"
                                onClick={() => {
                                    props.textFieldconditionHandler(item);
                                }}
                            />
                            <div className="slider round" />
                        </label>
                        <div
                            role="presentation"
                            data-testid="deleteTextComponentElement-button"
                            className="control__close"
                            onClick={() => {
                                props.closeTextField(item);
                            }}
                        >
                            <IconTimes />
                        </div>
                    </div>
                </div>
                <div className="form-inputs">
                    <div
                        style={{ display: item.display }}
                        disabled={item.disabled}
                    >
                        <label>Condition</label>
                        <ISelect
                            name={`${item.name}>condition`}
                            options={item.condition}
                        />
                        <label>Value</label>
                    </div>
                    <ITextField name={`${item.name}>value`} />
                    <span id="fieldWarning" className="text-danger">
                        This field is required*
                    </span>
                </div>
            </div>
        );
    });

    return <div>{textComponentDiv}</div>;
}

TextField.propTypes = {
    textComponentsArray: PropTypes.any,
    closeTextField: PropTypes.any,
    textFieldconditionHandler: PropTypes.any
};
