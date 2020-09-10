/* eslint-disable react/destructuring-assignment */

import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { IAirport } from "@neo-ui/airport";
import { ITextField } from "@neo-ui/textfield";
import { IconTimes } from "../Utilities/SvgUtilities";

export default function Port(props) {
    const [portArray, setPortArray] = useState([]);
    useEffect(() => {
        if (props.portsArray) setPortArray(props.portsArray);
        console.log(props.portsArray);
    }, [props.portsArray]);
    /**
     * Method To close the filter
     * @param {*} item is specific filter element
     */
    const handleClose = () => {
        console.log("close");
    };
    const portDiv = portArray.map((item) => {
        if (item.dataType === "Airport") {
            return (
                <div className="filter__input" key={item}>
                    <div className="filter__input-title">
                        <div className="filter__label">
                            <span>{item.name}</span>
                            <span>&nbsp;&gt;&nbsp;</span>
                            <span>{item.type}</span>
                        </div>
                        <div className="filter__control">
                            <input
                                data-testid="handleAutoCompleteEnabled-check"
                                type="checkBox"
                                label=""
                                className={item.type.concat(item.name)}
                                id={item.name.concat(item.type)}
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
                        <IAirport name="Airport" />
                    </div>
                </div>
            );
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
                        <input
                            data-testid="handleAutoCompleteEnabled-check"
                            type="checkBox"
                            label=""
                            className={item.type.concat(item.name)}
                            id={item.name.concat(item.type)}
                            checked
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
                    <ITextField name="portTextField" />
                </div>
            </div>
        );
    });
    return <div>{portDiv}</div>;
}

Port.propTypes = {
    portsArray: PropTypes.any
};
