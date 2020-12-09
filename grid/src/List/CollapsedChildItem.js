import { useEffect } from "react";
import PropTypes from "prop-types";

const CollapsedChildItem = ({ setSize, index }) => {
    useEffect(() => {
        setSize(index, 0);
    });

    return null;
};

CollapsedChildItem.propTypes = {
    setSize: PropTypes.func,
    index: PropTypes.number
};

export default CollapsedChildItem;
