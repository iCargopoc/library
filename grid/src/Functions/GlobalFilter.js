// @flow
import React, { useState } from "react";
import { useAsyncDebounce } from "react-table";
import { IconSearch } from "../Utilities/SvgUtilities";

const GlobalFilter = ({
    globalFilter,
    setGlobalFilter
}: Object): React$Element<*> => {
    const [value, setValue] = useState(globalFilter);

    const onChange = useAsyncDebounce((changedValue: string) => {
        setGlobalFilter(changedValue);
    }, 500);

    return (
        <div className="ng-txt-wrap ng-header__globalFilter">
            <input
                type="text"
                data-testid="globalFilter-textbox"
                value={value || ""}
                onChange={(e: Object) => {
                    const newValue = e.target.value || undefined;
                    setValue(newValue);
                    onChange(newValue);
                }}
                className="ng-txt"
                placeholder="Search"
            />
            <i className="ng-txt-wrap__icon">
                <IconSearch className="ng-icon" />
            </i>
        </div>
    );
};

export default GlobalFilter;
