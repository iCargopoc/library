/* eslint-disable react/destructuring-assignment */

import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { IAirport } from "@neo-ui/airport";
import { ITextField } from "@neo-ui/textfield";
import { ISelect } from "@neo-ui/select";
import { IconTimes } from "../Utilities/SvgUtilities";

export default function Port(props) {
    const [portArray, setPortArray] = useState([]);
    useEffect(() => {
        if (props.portsArray) setPortArray(props.portsArray);
    }, [props.portsArray]);

    const portDiv = portArray.map((item) => {
        if (item.dataType === "Airport") {
            return (
                <div className="form-group" key={`${item.name}>${item.type}`}>
                    <div className="title">
                        <h4>
                            {item.name}&nbsp;&gt;&nbsp;{item.type}
                        </h4>
                        <div className="controls">
                            <div
                                role="presentation"
                                data-testid="deleteAutoCompleteElement-click"
                                onClick={() => {
                                    props.closePortElement(item);
                                }}
                            >
                                <IconTimes />
                            </div>
                        </div>
                    </div>
                    <div className="form-inputs">
                        <IAirport name={`${item.name}>${item.type}`} />
                        <span id="fieldWarning" className="text-danger">
                            This field is required*
                        </span>
                    </div>
                </div>
            );
        }
        return (
            <div className="form-group" key={`${item.name},${item.type}`}>
                <div className="title">
                    <h4>
                        {item.name} &nbsp;&gt;&nbsp;{item.type}
                    </h4>
                    <div className="controls">
                        <label
                            className="switch"
                            htmlFor={`${item.name}>${item.type}`}
                        >
                            <input
                                type="checkBox"
                                label=""
                                id={`${item.name}>${item.type}`}
                                data-testid="handleTextComponentEnabled-check"
                                onClick={() => {
                                    props.portConditionHandler(item);
                                }}
                            />
                            <div className="slider round" />
                        </label>
                        <div
                            role="presentation"
                            data-testid="deleteAutoCompleteElement-click"
                            className="control__close"
                            onClick={() => {
                                props.closePortElement(item);
                            }}
                        >
                            <IconTimes />
                        </div>
                    </div>
                </div>
                <div className="form-inputs">
                    <div
                        disabled={item.disabled}
                        style={{
                            display: item.display
                        }}
                    >
                        <label>Condition</label>
                        <ISelect
                            name={`${item.name}>${item.type}>condition`}
                            options={item.condition}
                        />
                        <label>Value</label>
                    </div>
                    <ITextField name={`${item.name}>${item.type}>value`} />
                    <span id="fieldWarning" className="text-danger">
                        This field is required*
                    </span>
                </div>
            </div>
        );
    });
    return <div>{portDiv}</div>;
}

Port.propTypes = {
    portsArray: PropTypes.any,
    closePortElement: PropTypes.any,
    portConditionHandler: PropTypes.any
};
