// @flow
import React from "react";

const DefaultColumnFilter = ({
    column: { filterValue, setFilter }
}: {
    column: Object
}): React$Element<*> => {
    return (
        <input
            className="ng-txt"
            data-testid="columnFilter-textbox"
            value={filterValue || ""}
            onChange={(e: Object) => {
                setFilter(e.target.value || undefined);
            }}
            placeholder="Search"
        />
    );
};

export default DefaultColumnFilter;
