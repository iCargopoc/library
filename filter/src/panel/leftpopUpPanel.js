import React from "react";
import PropTypes from "prop-types";
import sprite from "@neo-ui/images";

let listViewDiv = "";
let savedFiltersDiv = "";
const LeftPopUpPanel = (props) => {
    const {
        leftPopUpShow,
        listView,
        handlelistViewClick,
        savedFilters,
        listViewName,
        savedFilterName,
        theme
    } = props;

    if (listView) {
        listViewDiv = listView.predefinedFilters.map((list) => {
            return (
                <li className="nf-saved__list-item" data-testId="listViewList">
                    <div className="nf-saved__content">
                        {list.name === listViewName && !savedFilterName && (
                            <svg className="icon-tick">
                                <use href={`${sprite}#tick-sm`} />
                            </svg>
                        )}
                        <span
                            className={
                                list.name === listViewName && !savedFilterName
                                    ? "nf-saved__content-text nf-selected"
                                    : "nf-saved__content-text"
                            }
                            role="button"
                            data-testId={list.name}
                            key={list.name}
                            tabIndex={0}
                            onKeyPress={() => {
                                handlelistViewClick(list, "listView");
                            }}
                            onClick={() => {
                                handlelistViewClick(list, "listView");
                            }}
                        >
                            {list.name}
                        </span>
                    </div>
                    <div className="nf-saved__favourite">
                        {!list.default && (
                            <svg className="icon-star">
                                <use href={`${sprite}#star-inactive`} />
                            </svg>
                        )}
                        {list.default && (
                            <svg className="icon-star">
                                <use href={`${sprite}#star-active`} />
                            </svg>
                        )}
                    </div>
                </li>
            );
        });
    }

    if (savedFilters) {
        savedFiltersDiv = savedFilters.savedFilters.map((list) => {
            return (
                <li className="nf-saved__list-item">
                    <div className="nf-saved__content">
                        {list.name === savedFilterName && (
                            <svg className="icon-tick">
                                <use href={`${sprite}#tick-sm`} />
                            </svg>
                        )}
                        <span
                            className={
                                list.name === savedFilterName
                                    ? "nf-saved__content-text nf-selected"
                                    : "nf-saved__content-text"
                            }
                            role="button"
                            data-testId={list.name}
                            key={list.name}
                            tabIndex={0}
                            onKeyPress={() =>
                                handlelistViewClick(list, "savedFilter")
                            }
                            onClick={() => {
                                handlelistViewClick(list, "savedFilter");
                            }}
                        >
                            {list.name}
                        </span>
                    </div>
                    <div className="nf-saved__favourite">
                        {!list.default && (
                            <svg className="icon-star">
                                <use href={`${sprite}#star-inactive`} />
                            </svg>
                        )}
                        {list.default && (
                            <svg className="icon-star">
                                <use href={`${sprite}#star-active`} />
                            </svg>
                        )}
                    </div>
                </li>
            );
        });
    }

    if (leftPopUpShow) {
        return (
            <div className={theme ? `nf-saved ${theme}` : "nf-saved"}>
                <h2 className="nf-saved__title">LIST VIEW</h2>
                <ul className="nf-saved__list">{listViewDiv}</ul>
                <h2 className="nf-saved__title">SAVED FILTERS</h2>
                <ul className="nf-saved__list">{savedFiltersDiv}</ul>
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
    listViewName: PropTypes.any,
    savedFilterName: PropTypes.any,
    theme: PropTypes.any
};

export default LeftPopUpPanel;
