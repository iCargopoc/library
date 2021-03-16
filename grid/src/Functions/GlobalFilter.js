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
        setGlobalFilter(changedValue || undefined);
    }, 200);

    return (
        <div className="ng-txt-wrap ng-header__globalFilter">
            <input
                type="text"
                data-testid="globalFilter-textbox"
                value={value || ""}
                onChange={(e: Object) => {
                    setValue(e.target.value);
                    onChange(e.target.value);
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
