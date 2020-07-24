import React, { useState, useEffect } from "react";
import { useDrop } from "react-dnd";
import Card from "./sortingItem";
import update from "immutability-helper";
import { ItemTypes } from "./ItemTypes";

const SortingList = (props) => {
    const [, drop] = useDrop({ accept: ItemTypes.CARD });

    const handleEditOfSortingParamsList = (updatedIndex, key, value) => {
        props.handleUpdatedSortList(updatedIndex, key, value);
    };

    const moveColumn = (columnId, atIndex) => {
        const { column, index } = findColumn(columnId);
        props.updateColumnsInState(
            update(props.sortParamsList, {
                $splice: [
                    [index, 1],
                    [atIndex, 0, column]
                ]
            })
        );
    };

    const findColumn = (sortId) => {
        const column = props.sortParamsList.filter((c, index) => index === sortId)[0];
        return {
            column,
            index: props.sortParamsList.indexOf(column)
        };
    };

    return (
        <React.Fragment>
            <div ref={drop} style={{ display: "flex", flexWrap: "wrap" }}>
                {props.sortParamsList.map((sortParamObj, index) => {
                    return (
                        <Card
                            id={index}
                            key={index}
                            sortParamObj={sortParamObj}
                            indexOfIteration={index}
                            moveColumn={moveColumn}
                            findColumn={findColumn}
                            handleEditOfSortingParamsList={handleEditOfSortingParamsList}
                            {...props}
                        />
                    );
                })}
            </div>
        </React.Fragment>
    );
};

export default SortingList;
