import React, { useState } from "react";
import { useAsyncDebounce } from "react-table";
import PropTypes from "prop-types";
import { IconSearch } from "../Utilities/SvgUtilities";

const GlobalFilter = ({ globalFilter, setGlobalFilter }) => {
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
                <IconSearch />
            </i>
        </div>
    );
};

GlobalFilter.propTypes = {
    globalFilter: PropTypes.any,
    setGlobalFilter: PropTypes.any
};

export default GlobalFilter;
