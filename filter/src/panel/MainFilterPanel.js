import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAlignLeft } from "@fortawesome/free-solid-svg-icons";
import SavedFilters from "./SavedFilters";

let chips, chipCount;
const MainFilterPanel = (props) => {
    const [listFilter, setListFilter] = useState(false);
    const [chipArray, setChipArray] = useState([]);
    const [countShow, setCountShow] = useState("none");
    useEffect(() => {
        setChipArray(props.applyFilterChip.applyFilter);
        if (props.applyFilterChip.applyFilter && props.applyFilterChip.applyFilter.length > 0) {
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
        chips = chipArray.map((item, index) => {
            if (item.type) {
                return (
                    <div
                        className="listContent"
                        key={index}
                        onClick={(e) => {
                            props.addAppliedFilters(chipArray);
                        }}
                    >
                        <span>
                            {item.name}:{item.type}
                        </span>
                        {item.value.map((value, index) => {
                            return <div key={index}>{value.value}</div>;
                        })}
                    </div>
                );
            } else if (item.condition) {
                return (
                    <div
                        className="listContent"
                        key={index}
                        onClick={(e) => {
                            props.addAppliedFilters(chipArray);
                        }}
                    >
                        <span>{item.name}</span>:{item.condition}
                        {item.amount}
                    </div>
                );
            } else if (item.fieldValue) {
                return (
                    <div
                        className="listContent"
                        key={index}
                        onClick={(e) => {
                            props.addAppliedFilters(chipArray);
                        }}
                    >
                        <span>{item.fieldValue}</span>
                        {item.value}
                    </div>
                );
            } else {
                return (
                    <div
                        className="listContent"
                        key={index}
                        onClick={(e) => {
                            props.addAppliedFilters(chipArray);
                        }}
                    >
                        <span>{item.name}</span>:{item.value}
                    </div>
                );
            }
        });
    } else {
        chips = <div></div>;
    }

    return (
        <div className="neo-header">
            <div className="displayFlex">
                <div className="alignLeft">
                    <FontAwesomeIcon icon={faAlignLeft} onClick={handleListFilter} />
                    <SavedFilters
                        onSelectSavedFilter={props.onSelectSavedFilter}
                        showFilter={listFilter}
                        handleListFilter={handleListFilter}
                        addSavedFilters={props.addSavedFilters}
                        addingToFavourite={props.addingToFavourite}
                    />
                    <div className="leftSpace">All flights</div>
                </div>
            </div>
            <div className="secondList">
                <div className="displayFlex">
                    <span style={{ display: countShow }} className="listContent">
                        count:{chipCount}
                    </span>
                    {chips}
                    <div
                        onClick={(e) => {
                            props.showDrawer();
                        }}
                        className="addFilter"
                    >
                        + Add Filter
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MainFilterPanel;
