/* eslint-disable react/destructuring-assignment */

import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
    Accordion,
    AccordionItem,
    AccordionItemHeading,
    AccordionItemButton,
    AccordionItemPanel
} from "react-accessible-accordion";
import { IconUpArrow, IconDownArrow } from "../Utilities/SvgUtilities";

export default function LeftDrawer(props) {
    const [leftDrawData, setLeftDrawData] = useState([]);
    const [leftDrawTemp, setLeftDrawTemp] = useState([]);
    const [showUpArrow, setShowUpArrow] = useState("none");
    const [showDownArrow, setShowDownArrow] = useState("");

    useEffect(() => {
        const typeArray = [];
        setLeftDrawData(props.filterData.filter);
        setLeftDrawTemp(props.filterData.filter);
        props.filterData.filter.forEach((item) => {
            if (item.types) {
                item.types.forEach((type) => {
                    typeArray.push(type.name);
                });
            }
        });
    }, [props.filterData.filter]);
    /**
     * Method To filter out the filters displayed at the left drawer
     * @param {*} e triggered on typing on the search field
     */
    const searchFilterHandler = (e) => {
        let filteredList = [];
        // eslint-disable-next-line no-unused-vars
        const searchKey = e.target.value;
        if (leftDrawData) {
            filteredList = leftDrawTemp.filter((item) => {
                return (
                    item.name &&
                    item.name.toLowerCase().includes(searchKey.toLowerCase())
                );
            });
        }
        setLeftDrawData(filteredList);
    };

    const handleAccordian = () => {
        if (showUpArrow === "none" || showDownArrow === "") {
            setShowUpArrow("");
            setShowDownArrow("none");
        } else {
            setShowUpArrow("none");
            setShowDownArrow("");
        }
    };

    const accordianHeads = leftDrawData.map((item, index) => {
        if (item.types && item.types.length > 0) {
            return (
                <div key={`${item.name}+${index}`}>
                    <Accordion
                        allowZeroExpanded
                        className="accordion"
                        key={`${item.name}|${index}`}
                    >
                        <AccordionItem
                            className="card"
                            key={`${item.name}=${index}`}
                        >
                            <AccordionItemHeading
                                onClick={() => {
                                    handleAccordian();
                                }}
                                className="card-header"
                                key={`${item.name}>${index}`}
                            >
                                <AccordionItemButton
                                    className="arrows"
                                    key={`${item.name},${index}`}
                                    style={{ cursor: "pointer" }}
                                >
                                    {item.name}
                                    <div
                                        className="accordionDown"
                                        style={{
                                            display: showDownArrow
                                        }}
                                    >
                                        <IconDownArrow />
                                    </div>
                                    <div
                                        className="accordionUp"
                                        style={{
                                            display: showUpArrow
                                        }}
                                    >
                                        <IconUpArrow />
                                    </div>
                                </AccordionItemButton>
                            </AccordionItemHeading>
                            <AccordionItemPanel className="firstAccordion">
                                {item.types &&
                                    item.types.map((type) => {
                                        return (
                                            <div
                                                role="presentation"
                                                style={{
                                                    fontWeight: type.weight,
                                                    cursor: "pointer"
                                                }}
                                                data-testid="firstAccordion"
                                                onClick={() => {
                                                    props.portValuesFromLeftToRight(
                                                        item.name,
                                                        type.name,
                                                        type.dataType,
                                                        type.condition
                                                    );
                                                    props.setInitialValuePort(
                                                        item.name,
                                                        type.name
                                                    );
                                                }}
                                                key={`${type.name}:${item.name}`}
                                            >
                                                {type.name}
                                            </div>
                                        );
                                    })}
                            </AccordionItemPanel>
                        </AccordionItem>
                    </Accordion>
                </div>
            );
        }
        return <div key={index} />;
    });
    const dateTimeHeads = leftDrawData.map((item, index) => {
        if (item.dataType === "DateTime") {
            return (
                <div className="fieldHeads" key={`${item.name},${index}`}>
                    <li
                        key={`${item.name}_${index}`}
                        role="presentation"
                        style={{ fontWeight: item.weight }}
                        data-testid="fieldHeads"
                        onClick={() => {
                            props.fromLeftToRight(
                                item.name,
                                item.dataType,
                                item.condition
                            );
                            props.setInitialValueDate("date");
                        }}
                    >
                        {item.name}
                    </li>
                </div>
            );
        }
        return <div key={index} />;
    });
    const dateTimeRangeHeads = leftDrawData.map((item, index) => {
        if (item.dataType === "DateTimeRange") {
            return (
                <div className="fieldHeads" key={`${item.name},${index}`}>
                    <li
                        key={`${item.name}_${index}`}
                        role="presentation"
                        style={{ fontWeight: item.weight }}
                        data-testid="fieldHeads"
                        onClick={() => {
                            props.fromLeftToRight(
                                item.name,
                                item.dataType,
                                item.condition
                            );
                            props.setInitialValueDateRange();
                        }}
                    >
                        {item.name}
                    </li>
                </div>
            );
        }
        return <div key={index} />;
    });
    const normalHeads = leftDrawData.map((item, index) => {
        if (item.dataType === "TextField") {
            return (
                <div className="normalHeads" key={`${item.name}>${index}`}>
                    <li
                        key={`${item.name}_${index}`}
                        role="presentation"
                        style={{ fontWeight: item.weight }}
                        data-testid="normalHeads"
                        onClick={() => {
                            props.fromLeftToRight(
                                item.name,
                                item.dataType,
                                item.condition
                            );
                            // props.addedFilterCount();
                        }}
                    >
                        {item.name}
                    </li>
                </div>
            );
        }
        return <div key={index} />;
    });
    return (
        <div>
            <input
                required
                type="text"
                placeholder="Search a Filter"
                defaultValue=""
                className="customControl"
                data-testid="searchFilterHandler-input"
                onChange={searchFilterHandler}
            />
            <div className="leftDrawer">
                <div>{accordianHeads}</div>
                <div>{dateTimeHeads}</div>
                <div>{dateTimeRangeHeads}</div>
                <div>{normalHeads}</div>
            </div>
        </div>
    );
}

LeftDrawer.propTypes = {
    filterData: PropTypes.any,
    fromLeftToRight: PropTypes.any,
    portValuesFromLeftToRight: PropTypes.any,
    setInitialValueDate: PropTypes.any,
    setInitialValueDateRange: PropTypes.any,
    setInitialValuePort: PropTypes.any
};
