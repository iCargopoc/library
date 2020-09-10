/* eslint-disable react/destructuring-assignment */

import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { ITextField } from "@neo-ui/textfield";
import { IconTimes } from "../Utilities/SvgUtilities";

export default function TextField(props) {
    const [textComponentArr, setTextComponentArr] = useState([]);
    useEffect(() => {
        console.log(props.textComponentsArray);
        setTextComponentArr(props.textComponentsArray);
    }, [props.textComponentsArray]);

    const textComponentDiv = textComponentArr.map((item) => {
        return (
            <div key={item}>
                <div className="filter__input">
                    <div className="filter__input-title">
                        <div className="filter__label">
                            <span>{item.name}</span>
                        </div>
                        <div className="filter__control">
                            <input
                                type="checkBox"
                                label=""
                                id={item.name}
                                checked={item.enabled}
                                data-testid="handleTextComponentEnabled-check"
                            />
                            <div
                                role="presentation"
                                data-testid="deleteTextComponentElement-button"
                            >
                                <IconTimes />
                            </div>
                        </div>
                    </div>
                    <div className="displayFlex">
                        <ITextField name="textFieldComponent" />
                    </div>
                </div>
            </div>
        );
    });

    return <div>{textComponentDiv}</div>;
}

TextField.propTypes = {
    textComponentsArray: PropTypes.any
};
