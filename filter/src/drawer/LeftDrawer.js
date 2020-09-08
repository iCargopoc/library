/* eslint-disable react/destructuring-assignment */

import React, { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
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
                <div>
                    <Accordion allowZeroExpanded className="accordion">
                        <AccordionItem key={index} className="card">
                            <AccordionItemHeading
                                onClick={() => {
                                    handleAccordian();
                                }}
                                className="card-header"
                            >
                                <AccordionItemButton className="arrows">
                                    {item.name}
                                    <div
                                        className="accordionDown"
                                        style={{
                                            display: showDownArrow,
                                            position: "relative",
                                            bottom: "47%",
                                            left: "150%"
                                        }}
                                    >
                                        <IconDownArrow />
                                    </div>
                                    <div
                                        className="accordionUp"
                                        style={{
                                            display: showUpArrow,
                                            position: "relative",
                                            bottom: "47%",
                                            left: "150%"
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
                                                    fontWeight: type.weight
                                                }}
                                                data-testid="firstAccordion"
                                                onClick={() => {
                                                    props.fromLeftToRight(
                                                        item.name,
                                                        type.dataType,
                                                        type.condition,
                                                        type.dataSource
                                                    );
                                                }}
                                                key={type.name}
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
        return <div key={item.name} />;
    });
    const fieldHeads = leftDrawData.map((item) => {
        if (item.dataType === "DateTime") {
            return (
                <div className="fieldHeads">
                    <li
                        key={item.name}
                        role="presentation"
                        style={{ fontWeight: item.weight }}
                        data-testid="fieldHeads"
                        onClick={() => {
                            props.fromLeftToRight(
                                item.name,
                                item.dataType,
                                item.condition,
                                item.dataSource
                            );
                            // props.addedFilterCount();
                        }}
                    >
                        {item.name}
                    </li>
                </div>
            );
        }
        return <div key={item.name} />;
    });
    // const conditionHeads = leftDrawData.map((item, index) => {
    //     if (item.condition.length) {
    //         return (
    //             <div className="conditionHeads" key={index}>
    //                 <li
    //                     role="presentation"
    //                     style={{ fontWeight: item.weight }}
    //                     onClick={() => {
    //                         props.fromLeftToRight(
    //                             item.name,
    //                             item.dataType,
    //                             item.enabled,
    //                             item.types,
    //                             item.field,
    //                             item.condition,
    //                             item.dataSource,
    //                             item.validationMessage,
    //                             item.options
    //                         );
    //                         // props.addedFilterCount();
    //                     }}
    //                 >
    //                     {item.name}
    //                 </li>
    //             </div>
    //         );
    //     }
    //     return <div key={index} />;
    // });
    const normalHeads = leftDrawData.map((item) => {
        if (item.dataType === "Text") {
            return (
                <div className="normalHeads">
                    <li
                        key={item.name}
                        role="presentation"
                        style={{ fontWeight: item.weight }}
                        data-testid="normalHeads"
                        onClick={() => {
                            props.fromLeftToRight(
                                item.name,
                                item.dataType,
                                item.condition,
                                item.dataSource
                            );
                            // props.addedFilterCount();
                        }}
                    >
                        {item.name}
                    </li>
                </div>
            );
        }
        return <div key={item.dataType} />;
    });
    return (
        <div>
            <Form.Row>
                <Form.Control
                    required
                    type="text"
                    placeholder="Search a Filter"
                    defaultValue=""
                    className="customControl"
                    data-testid="searchFilterHandler-input"
                    onChange={searchFilterHandler}
                />
            </Form.Row>
            <div className="leftDrawer">
                <div>{accordianHeads}</div>
                <div>{fieldHeads}</div>
                <div>{normalHeads}</div>
            </div>
        </div>
    );
}

LeftDrawer.propTypes = {
    filterData: PropTypes.any,
    fromLeftToRight: PropTypes.any
};
