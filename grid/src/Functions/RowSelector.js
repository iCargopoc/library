import React, { forwardRef, useRef, useEffect } from "react";
import PropTypes from "prop-types";

const RowSelector = forwardRef(({ indeterminate, ...rest }, ref) => {
    const defaultRef = useRef();
    const resolvedRef = ref || defaultRef;

    useEffect(() => {
        resolvedRef.current.indeterminate = indeterminate;
    }, [resolvedRef, indeterminate]);
    return (
        <div className="row-selector-cell-container">
            <div className="check-wrap">
                <input type="checkbox" ref={resolvedRef} {...rest} />
            </div>
        </div>
    );
});

RowSelector.propTypes = {
    indeterminate: PropTypes.bool
};

export default RowSelector;
