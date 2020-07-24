import React, { memo, useState, useEffect } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";
import MultiBackend, { TouchTransition } from "react-dnd-multi-backend";
import SortingList from "./sortingList";

const TableSorting = memo((props) => {
    const { isGroupSortOverLayOpen, toggleGroupSortOverLay, updateSortingParamsList, originalColumns, sortingLimit } = props;

    const defaultSortParamObj = {
        sortBy: "flight",
        sortOn: "flightno",
        order: "Ascending"
    };

    const [sortParamsList, setSortParamsList] = useState([]);
    const [isError, setIsError] = useState(false);

    const HTML5toTouch = {
        backends: [
            {
                backend: HTML5Backend
            },
            {
                backend: TouchBackend,
                options: { enableMouseEvents: true },
                preview: true,
                transition: TouchTransition
            }
        ]
    };

    const addSortingParams = () => {
        //for dynamic copying into existingSortParamsList.
        let existingSortParamsList = [...sortParamsList];
        existingSortParamsList.push(defaultSortParamObj);
        setSortParamsList(existingSortParamsList);
    };

    const handleUpdatedSortList = (updatedIndex, key, value) => {
        setIsError(false);
        let existingSortParamsList = [...sortParamsList];
        if (key === "sortBy") {
            let changedValueAsPerHeader = "";
            let changedKeyAsPerHeader = "";
            originalColumns.map((orgClms) => {
                if (orgClms.Header === value) {
                    changedKeyAsPerHeader = orgClms.accessor;
                    changedValueAsPerHeader = orgClms.innerCells !== undefined ? orgClms.innerCells[0].accessor : "value";
                }
            });
            existingSortParamsList[updatedIndex][key] = changedKeyAsPerHeader;
            existingSortParamsList[updatedIndex]["sortOn"] = changedValueAsPerHeader;
        } else {
            let accessorValue = value;
            if (key === "sortOn") {
                let headerAtIndex = existingSortParamsList[updatedIndex]["sortBy"];
                accessorValue = props.originalColumns
                    .filter((item) => item.accessor === headerAtIndex)[0]
                    .innerCells.filter((irnCls) => irnCls.Header === value)[0].accessor;
            }
            existingSortParamsList[updatedIndex][key] = accessorValue;
        }
        setSortParamsList(existingSortParamsList);
        validateSortParamsList();
    };

    const handleDeleteOfSortList = (indexOfDeletion) => {
        let existingSortParamsList = [...sortParamsList];
        existingSortParamsList = existingSortParamsList.filter((item, index) => index !== indexOfDeletion);
        setSortParamsList(existingSortParamsList);
        validateSortParamsList();
    };

    const handleCopySortRow = (indexOfCopy) => {
        console.log("Copy index ", indexOfCopy);
        let rowList = [...sortParamsList];
        let copiedValue = rowList[indexOfCopy];
        rowList.push(JSON.parse(JSON.stringify(copiedValue)));
        setSortParamsList(rowList);
    };

    const handleClearOfSortingList = () => {
        setSortParamsList([]);
    };

    const updateColumnsInState = (columns) => {
        console.log("columns ", columns);
        setSortParamsList(columns);
    };

    const validateSortParamsList = () => {
        let filterResult = [];
        for (let outerIndex = 0; outerIndex < sortParamsList.length; outerIndex++) {
            let outerParamObj = sortParamsList[outerIndex];
            filterResult = sortParamsList.filter(
                (innerParamObj, innerIndex) =>
                    outerIndex !== innerIndex &&
                    JSON.stringify({
                        sortBy: outerParamObj.sortBy,
                        sortOn: outerParamObj.sortOn
                    }) ===
                        JSON.stringify({
                            sortBy: innerParamObj.sortBy,
                            sortOn: innerParamObj.sortOn
                        })
            );
            if (filterResult.length === 0) {
                setIsError(false);
            } else {
                setIsError(true);
                break;
            }
        }
    };

    if (isGroupSortOverLayOpen) {
        return (
            <div className="sorts--grid" /*ref={this.setWrapperRef} */>
                <div className="sort__grid">
                    <div className="sort__settings">
                        <div className="sort__header">
                            <div className="sort__headerTxt">
                                <strong>Sort </strong>
                            </div>

                            <div className="sort__close">
                                <i className="fa fa-times" aria-hidden="true" onClick={toggleGroupSortOverLay}></i>
                            </div>
                        </div>

                        <div className="sort__body">
                            <DndProvider backend={MultiBackend} options={HTML5toTouch}>
                                <SortingList
                                    sortParamsList={sortParamsList}
                                    originalColumns={originalColumns}
                                    handleUpdatedSortList={handleUpdatedSortList}
                                    handleDeleteOfSortList={handleDeleteOfSortList}
                                    handleCopySortRow={handleCopySortRow}
                                    updateColumnsInState={updateColumnsInState}
                                    {...props}
                                />
                            </DndProvider>
                            <div className="sort-warning">
                                {isError ? (
                                    <span style={{ color: "red" }}>
                                        Sort by opted are same for Some Rows, Please choose different one.
                                    </span>
                                ) : (
                                    ""
                                )}
                            </div>
                        </div>
                        <div className="sort__new">
                            <div className="sort__section" type="button" onClick={addSortingParams}>
                                <i class="fa fa-plus" aria-hidden="true"></i>
                                <div className="sort__txt">New Sort</div>
                            </div>
                        </div>
                        <div className="sort__footer">
                            <div className="sort__btns">
                                <button className="btns" onClick={handleClearOfSortingList}>
                                    Clear All
                                </button>

                                <button
                                    className="btns btns__save"
                                    onClick={() => updateSortingParamsList(sortParamsList, isError)}
                                >
                                    Ok
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});

export default TableSorting;
