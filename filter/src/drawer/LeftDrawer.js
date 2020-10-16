import React, { useEffect, useState } from "react";
import {
    IAccordion,
    IAccordionItem,
    IAccordionItemTitle,
    IAccordionItemBody
} from "@neo-ui/accordion";
import PropTypes from "prop-types";

export default function LeftDrawer(props) {
    const [leftDrawData, setLeftDrawData] = useState([]);
    const [leftDrawTemp, setLeftDrawTemp] = useState([]);
    const { filterData } = props;
    useEffect(() => {
        setLeftDrawData(filterData.filter);
        setLeftDrawTemp(filterData.filter);
    }, [filterData.filter]);

    /**
     * Method To filter out the filters displayed at the left drawer
     * @param {*} e triggered while typing on the search field
     */
    const searchFilterHandler = (e) => {
        let filteredList = [];
        const searchKey = e.target.value;
        if (leftDrawData) {
            filteredList = leftDrawTemp.filter((item) => {
                return (
                    item.label &&
                    item.label.toLowerCase().includes(searchKey.toLowerCase())
                );
            });
        }
        setLeftDrawData(filteredList);
    };
    const filterList = leftDrawData.map((item, index) => {
        if (item.isSubFilter) {
            return (
                <div key={`${item.label}+${index}`} className="accordion__list">
                    <IAccordion className="accordion-no-border">
                        <IAccordionItem>
                            <IAccordionItemTitle>
                                {item.label}
                            </IAccordionItemTitle>
                            <IAccordionItemBody>
                                {item.subFilters &&
                                    item.subFilters.map((type) => {
                                        return (
                                            <div
                                                className="accordion__item"
                                                role="presentation"
                                                style={{
                                                    fontWeight: type.weight,
                                                    cursor: "pointer"
                                                }}
                                                data-testid={`${type.label}:${item.label}`}
                                                onClick={() => {
                                                    if (type.isGroupFilter) {
                                                        props.groupFiltersFromLeftToRight(
                                                            type
                                                        );
                                                    } else {
                                                        props.accordionFiltersFromLeftToRight(
                                                            item.label,
                                                            item.isSubFilter,
                                                            type.label,
                                                            type.dataType,
                                                            type.condition,
                                                            type.isRequired,
                                                            type.name,
                                                            type.initialValue,
                                                            type.props,
                                                            type.oneTimeCode
                                                        );
                                                    }
                                                }}
                                                key={`${type.label}:${item.label}`}
                                            >
                                                {type.label}
                                            </div>
                                        );
                                    })}
                            </IAccordionItemBody>
                        </IAccordionItem>
                    </IAccordion>
                </div>
            );
        }
        if (!item.isSubFilter) {
            return (
                <div className="fieldHeads" key={`${item.label},${index}`}>
                    <li
                        key={`${item.label}_${index}`}
                        role="presentation"
                        style={{ fontWeight: item.weight }}
                        data-testid={item.label}
                        onClick={() => {
                            if (item.isGroupFilter) {
                                props.groupFiltersFromLeftToRight(item);
                            } else {
                                props.individualFiltersfromLeftToRight(
                                    item.label,
                                    item.isSubFilter,
                                    item.dataType,
                                    item.condition,
                                    item.isRequired,
                                    item.name,
                                    item.initialValue,
                                    item.props,
                                    item.oneTimeCode
                                );
                            }
                        }}
                    >
                        {item.label}
                    </li>
                </div>
            );
        }
        return <div />;
    });
    return (
        <>
            <input
                required
                type="text"
                placeholder="Search a Filter"
                defaultValue=""
                className="customControl"
                data-testid="searchFilterHandler-input"
                onChange={searchFilterHandler}
            />
            <div className="leftDrawer">{filterList}</div>
        </>
    );
}

LeftDrawer.propTypes = {
    filterData: PropTypes.any,
    individualFiltersfromLeftToRight: PropTypes.any,
    accordionFiltersFromLeftToRight: PropTypes.any,
    groupFiltersFromLeftToRight: PropTypes.any
};
