// @flow
import React from "react";

const RowSelector: any = ({ ...rest }: Object): React$Element<*> => {
    return (
        <div className="neo-grid__row-selector">
            <div className="neo-form-check">
                <input type="checkbox" className="neo-checkbox" {...rest} />
            </div>
        </div>
    );
};
export default RowSelector;
