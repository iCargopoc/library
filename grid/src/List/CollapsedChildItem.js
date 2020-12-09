import { useEffect } from "react";
import PropTypes from "prop-types";

const ChildItem = ({ setSize, index }) => {
    useEffect(() => {
        setSize(index, 0);
    });

    return null;
};

ChildItem.propTypes = {
    setSize: PropTypes.func,
    index: PropTypes.number
};

export default ChildItem;
