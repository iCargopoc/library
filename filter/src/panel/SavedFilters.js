import React, { useEffect, useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faStar } from "@fortawesome/free-solid-svg-icons";

const SavedFilters = (props) => {
    const [showFilter, setShowFilter] = useState(false);
    let listRef = useRef();
    useEffect(() => {
        let listHandler = (event) => {
            if (listRef.current && !listRef.current.contains(event.target)) {
                setShowFilter(false);
                props.handleListFilter();
            }
        };
        setShowFilter(props.showFilter);
        document.addEventListener("mousedown", listHandler);

        return () => {
            document.removeEventListener("mousedown", listHandler);
        };
    }, [props]);

    let name = "";
    let keyValue = "";
    let savedFilters = localStorage.getItem("savedFilters");
    savedFilters = savedFilters ? JSON.parse(savedFilters) : [];
    const addToFavourite = (item) => {
        if (item.color === "#bcbdd1") {
            item.color = "#2680e8";
        } else {
            item.color = "#bcbdd1";
        }
        console.log(savedFilters);
        savedFilters.map((filterArray, index) => {
            console.log(filterArray.color);
        });
        props.addingToFavourite(item);
    };
    const savedFilter = savedFilters.map((filterArray, index) => {
        return (
            <div key={index}>
                <div className="alignLeft">
                    <FontAwesomeIcon style={{ marginLeft: "-54px" }} icon={faCheck}></FontAwesomeIcon>
                    <div
                        style={{ marginLeft: "15px" }}
                        onClick={(e) => {
                            //below two methods are required for closing the savedFilter list popUp
                            setShowFilter(false);
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
            <div className="filter__saved" ref={listRef}>
                <div className="savedFilters">
                    <div className="text-muted">Saved Filters</div>
                    <ul key={keyValue} className="leftSpace">
                        {savedFilter}
                    </ul>
                </div>
            </div>
        );
    } else {
        return <div></div>;
    }
};

export default SavedFilters;
