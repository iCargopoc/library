/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
import React, { useState, useEffect } from "react";
import { SEARCH_NOT_FOUNT_ERROR } from "./ErrorConstants";
import { ReactComponent as IconClose } from "../images/icon-close.svg";

const ErrorMessage = (props) => {
    const [status, setStatus] = useState(props.status);
    useEffect(() => {
        setStatus(props.status);
    }, [props.status]);
    if (status === "invalid") {
        return (
            <div id="errorMsg">
                <div className="alert alert-danger" role="alert">
                    {SEARCH_NOT_FOUNT_ERROR}
                </div>
                <div
                    className="notification-close"
                    onClick={() => {
                        props.closeWarningStatus();
                        props.clearSearchValue();
                    }}
                >
                    <i>
                        <IconClose />
                    </i>
                </div>
            </div>
        );
    }
    return <div />;
};
export default ErrorMessage;
