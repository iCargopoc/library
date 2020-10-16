import React from "react";
import PropTypes from "prop-types";
import {
    IconUnSaved,
    IconSelected,
    IconSaved
} from "../utilities/svgUtilities";

let listViewDiv = "";
let savedFiltersDiv = "";
const LeftPopUpPanel = (props) => {
    const {
        leftPopUpShow,
        listView,
        handlelistViewClick,
        savedFilters,
        handleSavedFilterClick,
        listViewName,
        savedFilterName
    } = props;

    if (listView) {
        listViewDiv = listView.predefinedFilters.map((list) => {
            return (
                <li data-testId="listViewList">
                    <div className="filter--saved__content">
                        {list.name === listViewName && !savedFilterName && (
                            <IconSelected />
                        )}
                        <span
                            className={
                                list.name === listViewName && !savedFilterName
                                    ? "selected"
                                    : ""
                            }
                            role="button"
                            data-testId={list.name}
                            key={list.name}
                            tabIndex={0}
                            onKeyPress={() => {
                                handlelistViewClick(list);
                            }}
                            onClick={() => {
                                handlelistViewClick(list);
                            }}
                        >
                            {list.name}
                        </span>
                    </div>
                    <div className="filter--saved__favourite">
                        {!list.default && <IconUnSaved />}
                        {list.default && <IconSaved />}
                    </div>
                </li>
            );
        });
    }

    if (savedFilters) {
        savedFiltersDiv = savedFilters.savedFilters.map((list) => {
            return (
                <li>
                    <div className="filter--saved__content">
                        {list.name === savedFilterName && !listViewName && (
                            <IconSelected />
                        )}
                        <span
                            className={
                                list.name === savedFilterName && !listViewName
                                    ? "selected"
                                    : ""
                            }
                            role="button"
                            data-testId={list.name}
                            key={list.name}
                            tabIndex={0}
                            onKeyPress={() => handleSavedFilterClick(list)}
                            onClick={() => {
                                handleSavedFilterClick(list);
                            }}
                        >
                            {list.name}
                        </span>
                    </div>
                    <div className="filter--saved__favourite">
                        {!list.default && <IconUnSaved />}
                        {list.default && <IconSaved />}
                    </div>
                </li>
            );
        });
    }

    if (leftPopUpShow) {
        return (
            <div className="filter--saved">
                <h2>LIST VIEW</h2>
                <ul>{listViewDiv}</ul>
                <h2>SAVED FILTERS</h2>
                <ul>{savedFiltersDiv}</ul>
            </div>
        );
    }
    return <div />;
};

LeftPopUpPanel.propTypes = {
    leftPopUpShow: PropTypes.any,
    listView: PropTypes.any,
    handlelistViewClick: PropTypes.any,
    savedFilters: PropTypes.any,
    handleSavedFilterClick: PropTypes.any,
    listViewName: PropTypes.any,
    savedFilterName: PropTypes.any
};

export default LeftPopUpPanel;
