// @flow
import React, { forwardRef, useRef, useEffect } from "react";

const RowSelector: any = forwardRef(
    ({ indeterminate, ...rest }: Object, ref: any): React$Element<*> => {
        const defaultRef = useRef();
        const resolvedRef = ref || defaultRef;

        useEffect(() => {
            resolvedRef.current.indeterminate = indeterminate;
        }, [resolvedRef, indeterminate]);

        return (
            <div className="neo-grid__row-selector">
                <div className="neo-form-check">
                    <input
                        type="checkbox"
                        className="neo-checkbox form-check-input"
                        ref={resolvedRef}
                        {...rest}
                    />
                </div>
            </div>
        );
    }
);
export default RowSelector;
