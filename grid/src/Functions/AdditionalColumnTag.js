import React, { useContext, Fragment } from "react";
import { AdditionalColumnContext } from "../Utilities/TagsContext";
import { checkInnerCells } from "../Utilities/TagUtilities";

const AdditionalColumnTag = (props) => {
    const contextVallues = useContext(AdditionalColumnContext);
    const { additionalColumn } = contextVallues;
    const { cellKey } = props;

    if (additionalColumn && cellKey) {
        if (checkInnerCells(additionalColumn, cellKey)) {
            return <Fragment> {props.children}</Fragment>;
        }
    }
    return null;
};

export default AdditionalColumnTag;
