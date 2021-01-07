// @flow
import React, { useContext } from "react";
import { AdditionalColumnContext } from "../Utilities/TagsContext";
import { checkInnerCells } from "../Utilities/TagUtilities";

const AdditionalColumnTag = (props: Object): ?React$Element<*> => {
    const contextVallues = useContext(AdditionalColumnContext);
    const { additionalColumn } = contextVallues;
    const { cellKey } = props;

    if (additionalColumn && additionalColumn.display === true && cellKey) {
        if (checkInnerCells(additionalColumn, cellKey)) {
            return (
                <React.Fragment key="AdditionalColumnFragment">
                    {props.children}
                </React.Fragment>
            );
        }
    }
    return null;
};

export default AdditionalColumnTag;
