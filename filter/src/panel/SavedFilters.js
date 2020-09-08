import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import ClickAwayListener from "react-click-away-listener";
import { IconCheck } from "../Utilities/SvgUtilities";

const SavedFilters = (props) => {
    const [showFilter, setShowFilter] = useState(false);
    useEffect(() => {
        setShowFilter(props.showFilter);
    }, [props]);
    const keyValue = "";
    let savedFilters = localStorage.getItem("savedFilters");
    savedFilters = savedFilters ? JSON.parse(savedFilters) : [];
    const handleClickAway = () => {
        setShowFilter(false);
        props.handleListFilter();
    };
    const savedFilter = savedFilters.map((filterArray) => {
        return (
            <div key={filterArray}>
                <div className="alignLeft">
                    <div>
                        <IconCheck />
                    </div>
                    <div
                        role="presentation"
                        style={{ marginLeft: "15px" }}
                        data-testid="addSavedFilters-check"
                        onClick={() => {
                            // below two methods are required for closing the savedFilter list popUp
                            // setShowFilter(false);
                            props.handleListFilter();
                            props.addSavedFilters(filterArray);
                        }}
                    >
                        {Object.keys(filterArray)[0]}
                    </div>
                </div>
            </div>
        );
    });
    if (showFilter) {
        return (
            <ClickAwayListener onClickAway={handleClickAway}>
                <div className="filter__saved">
                    <div className="savedFilters">
                        <div className="text-muted">Saved Filters</div>
                        <ul key={keyValue} className="leftSpace">
                            {savedFilter}
                        </ul>
                    </div>
                </div>
            </ClickAwayListener>
        );
    }
    return <div />;
};

SavedFilters.propTypes = {
    handleListFilter: PropTypes.any,
    showFilter: PropTypes.any,
    addSavedFilters: PropTypes.any
};

export default SavedFilters;
