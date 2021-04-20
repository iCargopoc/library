// @flow
import React, { useState } from "react";
import { useAsyncDebounce } from "react-table";

const DefaultColumnFilter = ({
    column: { filterValue, setFilter }
}: {
    column: Object
}): React$Element<*> => {
    const [value, setValue] = useState(filterValue);

    const onChange = useAsyncDebounce((changedValue: string) => {
        setFilter(changedValue);
    }, 500);

    return (
        <input
            className="ng-txt"
            data-testid="columnFilter-textbox"
            value={value || ""}
            onChange={(e: Object) => {
                const newValue = e.target.value || undefined;
                setValue(newValue);
                onChange(newValue);
            }}
            placeholder="Search"
        />
    );
};

export default DefaultColumnFilter;
