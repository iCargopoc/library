import React from "react";
import { useDrop } from "react-dnd";
import update from "immutability-helper";
import { ItemTypes } from "./ItemTypes";
import SortItem from "./sortingItem";

const SortingList = (props) => {
    const { updateSortingOptions, sortOptions } = props;

    const moveSort = (sortId, atIndex) => {
        const { sort, index } = findSort(sortId);
        updateSortingOptions(
            update(sortOptions, {
                $splice: [
                    [index, 1],
                    [atIndex, 0, sort]
                ]
            })
        );
    };

    const findSort = (sortId) => {
        const sort = sortOptions.filter((c, index) => index === sortId)[0];
        return {
            sort,
            index: sortOptions.indexOf(sort)
        };
    };

    const [, drop] = useDrop({ accept: ItemTypes.SORT_ITEM });

    return (
        <React.Fragment>
            <div ref={drop} style={{ display: "flex", flexWrap: "wrap" }}>
                {sortOptions && sortOptions.length > 0 ? (
                    <ul>
                        <li>Sort By</li>
                        <li>Sort On</li>
                        <li>Order</li>
                    </ul>
                ) : null}
                {sortOptions.map((sortOption, index) => {
                    return (
                        <SortItem
                            id={index}
                            key={index}
                            sortOption={sortOption}
                            originalColumns={props.originalColumns}
                            moveSort={moveSort}
                            findSort={findSort}
                            updateSingleSortingOption={
                                props.updateSingleSortingOption
                            }
                            copySortOption={props.copySortOption}
                            deleteSortOption={props.deleteSortOption}
                        />
                    );
                })}
            </div>
        </React.Fragment>
    );
};

export default SortingList;
