import React, { memo, useState } from "react";
import { useAsyncDebounce } from "react-table";
import PropTypes from "prop-types";
import IconSearch from "../Images/icon-search.svg";

const GlobalFilter = memo(({ globalFilter, setGlobalFilter }) => {
    const [value, setValue] = useState(globalFilter);

    const onChange = useAsyncDebounce((changedValue) => {
        setGlobalFilter(changedValue || undefined);
    }, 200);

    return (
        <div className="txt-wrap">
            <input
                type="text"
                value={value || ""}
                onChange={(e) => {
                    setValue(e.target.value);
                    onChange(e.target.value);
                }}
                className="txt"
                placeholder="Search"
            />
            <i>
                <img src={IconSearch} alt="Global Search Icon" />
            </i>
        </div>
    );
});

GlobalFilter.propTypes = {
    globalFilter: PropTypes.any,
    setGlobalFilter: PropTypes.any
};

export default GlobalFilter;
