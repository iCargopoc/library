// @flow
import React from "react";
import { useDrop } from "react-dnd";
import update from "immutability-helper";
import { ItemTypes } from "./ItemTypes";
import SortItem from "./SortingItem";

const SortingList = (props: {
    updateSortingOptions: Function,
    sortingOrders: Array<Object>,
    sortOptions: Array<Object>,
    columns: Array<Object>,
    copySortOption: Function,
    deleteSortOption: Function,
    updateSingleSortingOption: Function
}): React$Element<*> => {
    const { updateSortingOptions, sortingOrders, sortOptions, columns } = props;

    const findSort = (sortId: String): Object => {
        const sort = sortOptions.filter(
            (c: Object, index: number): boolean => index === sortId
        )[0];
        return {
            sort,
            index: sortOptions.indexOf(sort)
        };
    };

    const moveSort = (sortId: String, atIndex: Number) => {
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

    const [, drop] = useDrop({ accept: ItemTypes.SORT_ITEM });

    return (
        <React.Fragment key="SortingListFragment">
            <div className="ng-popover--sort__content" ref={drop}>
                {sortOptions && sortOptions.length > 0 ? (
                    <ul className="ng-popover--sort__items-title">
                        <li className="ng-popover--sort__item-text">Sort By</li>
                        <li className="ng-popover--sort__item-text">Sort On</li>
                        <li className="ng-popover--sort__item-text">Order</li>
                    </ul>
                ) : null}
                {sortOptions.map(
                    (sortOption: Object, index: number): Object => {
                        return (
                            <SortItem
                                id={index}
                                key={index}
                                sortOption={sortOption}
                                sortingOrders={sortingOrders}
                                columns={columns}
                                moveSort={moveSort}
                                findSort={findSort}
                                updateSingleSortingOption={
                                    props.updateSingleSortingOption
                                }
                                copySortOption={props.copySortOption}
                                deleteSortOption={props.deleteSortOption}
                            />
                        );
                    }
                )}
            </div>
        </React.Fragment>
    );
};
export default SortingList;
