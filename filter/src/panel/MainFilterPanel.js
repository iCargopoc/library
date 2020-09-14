/* eslint-disable react/destructuring-assignment */

import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { IconLeftAlign } from "../Utilities/SvgUtilities";
import SavedFilters from "./SavedFilters";

let chips;
let chipCount;
const MainFilterPanel = (props) => {
    const [listFilter, setListFilter] = useState(false);
    const [chipArray, setChipArray] = useState([]);
    const [countShow, setCountShow] = useState("none");
    useEffect(() => {
        setChipArray(props.applyFilterChip.applyFilter);
        if (
            props.applyFilterChip.applyFilter &&
            props.applyFilterChip.applyFilter.length > 0
        ) {
            setCountShow("");
        } else {
            setCountShow("none");
        }
    }, [props.applyFilterChip]);
    const handleListFilter = () => {
        setListFilter(!listFilter);
    };
    if (chipArray) {
        chipCount = chipArray.length;
        chips = chipArray.map((item) => {
            if (item.type) {
                return (
                    <div
                        role="presentation"
                        className="listContent"
                        data-testid="typecheck"
                        key={item}
                        onClick={() => {
                            props.addAppliedFilters(chipArray);
                        }}
                    >
                        <span>
                            {item.name}:{item.type}
                        </span>
                        {item.value.map((value) => {
                            return <div key={value}>{value.value}</div>;
                        })}
                    </div>
                );
            }
            if (item.condition) {
                return (
                    <div
                        role="presentation"
                        className="listContent"
                        data-testid="conditionValue-check"
                        key={item}
                        onClick={() => {
                            props.addAppliedFilters(chipArray);
                        }}
                    >
                        <span>{item.name}</span>:{item.condition}
                        {item.amount}
                    </div>
                );
            }
            if (item.fieldValue) {
                return (
                    <div
                        role="presentation"
                        className="listContent"
                        data-testid="fieldValue-check"
                        key={item}
                        onClick={() => {
                            props.addAppliedFilters(chipArray);
                        }}
                    >
                        <span>{item.fieldValue}</span>
                        {item.value}
                    </div>
                );
            }
            return (
                <div
                    role="presentation"
                    className="listContent"
                    data-testid="chipCount-check"
                    key={item}
                    onClick={() => {
                        props.addAppliedFilters(chipArray);
                    }}
                >
                    <span>{item.name}</span>:{item.value}
                </div>
            );
        });
    } else {
        chips = <div />;
    }

    return (
        <div className="neo-header">
            <div className="header__filter">
                <div className="displayFlex">
                    <div className="alignLeft">
                        <div
                            style={{ cursor: "pointer" }}
                            role="presentation"
                            className="iconLeft"
                            data-testid="handleListFilterCheck"
                            onClick={handleListFilter}
                        >
                            <IconLeftAlign />
                        </div>
                        <SavedFilters
                            showFilter={listFilter}
                            handleListFilter={handleListFilter}
                            addSavedFilters={props.addSavedFilters}
                        />
                        <div className="leftSpace">All flights</div>
                    </div>
                </div>
                <div className="secondList">
                    <div className="displayFlex">
                        <span
                            style={{ display: countShow }}
                            className="listContent"
                        >
                            count:{chipCount}
                        </span>
                        {chips}
                        <div
                            style={{ cursor: "pointer" }}
                            role="presentation"
                            data-testid="showDrawer-check"
                            onClick={() => {
                                props.showDrawer();
                            }}
                            className="addFilter"
                        >
                            + Add Filter
                        </div>
                    </div>
                </div>
            </div>
            <div className="header__btns">
                <props.customPanel />
            </div>
        </div>
    );
};

MainFilterPanel.propTypes = {
    applyFilterChip: PropTypes.any,
    addAppliedFilters: PropTypes.any,
    addSavedFilters: PropTypes.any,
    showDrawer: PropTypes.any
};

export default MainFilterPanel;
