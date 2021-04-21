// @flow
import React, { useState, useEffect } from "react";
import { useAsyncDebounce } from "react-table";

const DefaultColumnFilter = ({
    column: { filterValue, setFilter },
    filterEventRef
}: {
    column: Object,
    filterEventRef: Object
}): React$Element<*> => {
    const [value, setValue] = useState("");

    const onChange = useAsyncDebounce((changedValue: string) => {
        const currentFilterEvent = filterEventRef;
        currentFilterEvent.current = true;
        setFilter(changedValue);
    }, 500);

    useEffect(() => {
        setValue(filterValue);
    }, [filterValue]);

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
