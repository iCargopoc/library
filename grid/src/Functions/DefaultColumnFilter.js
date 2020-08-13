import React, { memo } from "react";
import PropTypes from "prop-types";

const DefaultColumnFilter = memo(({ column: { filterValue, setFilter } }) => {
    return (
        <input
            className="txt"
            value={filterValue || ""}
            onChange={(e) => {
                setFilter(e.target.value || undefined);
            }}
            placeholder="Search"
        />
    );
});

DefaultColumnFilter.propTypes = {
    column: PropTypes.any
};

export default DefaultColumnFilter;
