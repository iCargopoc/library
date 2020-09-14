/* eslint-disable react/destructuring-assignment */

import React, { useRef, useEffect } from "react";
import PropTypes from "prop-types";

/**
 * Hook that alerts clicks outside of the passed ref
 */
function useClickAwayListener(ref, props) {
    useEffect(() => {
        /**
         * Alert if clicked on outside of element
         */
        function handleClickOutside(event) {
            if (ref.current && !ref.current.contains(event.target)) {
                props.onClickAway();
            }
        }
        // Bind the event listener
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [ref]);
}

/**
 * Component that alerts if you click outside of it
 */
function ClickAwayListener(props) {
    const wrapperRef = useRef(null);

    useClickAwayListener(wrapperRef, props);

    return <div ref={wrapperRef}>{props.children}</div>;
}

ClickAwayListener.propTypes = {
    children: PropTypes.any
};

export default ClickAwayListener;
