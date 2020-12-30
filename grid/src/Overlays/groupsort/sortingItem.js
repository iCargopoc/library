import React from "react";
import { useDrag, useDrop } from "react-dnd";
import PropTypes from "prop-types";
import { ItemTypes } from "./ItemTypes";

import {
    IconDragVertical,
    SortCopy,
    SortDelete
} from "../../Utilities/SvgUtilities";

const SortItem = ({
    id,
    sortOption,
    columns,
    sortingOrders,
    moveSort,
    findSort,
    updateSingleSortingOption,
    copySortOption,
    deleteSortOption
}) => {
    const originalIndex = findSort(id).index;

    const [{ isDragging }, drag] = useDrag({
        item: { type: ItemTypes.SORT_ITEM, id, originalIndex },
        collect: (monitor) => ({
            isDragging: monitor.isDragging()
        }),
        end: (dropResult, monitor) => {
            const monitorGetItemValue = monitor.getItem();
            const { id: droppedId } = monitorGetItemValue;
            const newOriginalIndex = monitorGetItemValue.originalIndex;
            const didDrop = monitor.didDrop();
            if (!didDrop) {
                moveSort(droppedId, newOriginalIndex);
            }
        }
    });

    const [, drop] = useDrop({
        accept: ItemTypes.SORT_ITEM,
        canDrop: () => false,
        hover({ id: draggedId }) {
            if (draggedId !== id) {
                const { index: overIndex } = findSort(id);
                moveSort(draggedId, overIndex);
            }
        }
    });

    const getInncerCellsOfColumn = (columnAccessor) => {
        const origCol = columns.find((column) => {
            return column.accessor === columnAccessor;
        });
        if (origCol && origCol.innerCells) {
            return origCol.innerCells.filter((cell) => cell.isSortable);
        }
        return [];
    };

    const checkIfColumnIsSubComponent = (columnAccessor) => {
        const origCol = columns.find((column) => {
            return column.accessor === columnAccessor;
        });
        return origCol ? origCol.isSubComponentColumn : false;
    };

    const changeSortByOptions = (event) => {
        const { value } = event.currentTarget;
        const innerCellsList = getInncerCellsOfColumn(value);
        updateSingleSortingOption(
            id,
            value,
            innerCellsList && innerCellsList.length > 0
                ? innerCellsList[0].accessor
                : "value",
            sortOption.order,
            checkIfColumnIsSubComponent(value)
        );
    };

    const changeSortOnOptions = (event) => {
        const newSortOnValue = event.target.value;
        updateSingleSortingOption(
            id,
            sortOption.sortBy,
            newSortOnValue,
            sortOption.order,
            sortOption.isSubComponentColumn
        );
    };

    const changeSortOrderOptions = (event) => {
        const newSortOrderValue = event.target.value;
        updateSingleSortingOption(
            id,
            sortOption.sortBy,
            sortOption.sortOn,
            newSortOrderValue,
            sortOption.isSubComponentColumn
        );
    };

    const copySort = () => {
        copySortOption(id);
    };

    const deleteSort = () => {
        deleteSortOption(id);
    };

    const opacity = isDragging ? 0.5 : 1;

    return (
        <div
            className="ng-popover--sort__items"
            data-testid="sortItem"
            style={{ opacity }}
        >
            <div className="ng-popover__reorder">
                <div
                    className="ng-popover__drag"
                    data-testid="sortItemDnd"
                    ref={(node) => drag(drop(node))}
                >
                    <i className="ng-icon-block">
                        <IconDragVertical className="ng-icon" />
                    </i>
                </div>
            </div>

            <div className="ng-popover--sort__reorder">
                <div>
                    <select
                        data-testid="groupSort-sortBy"
                        className="ng-popover--sort__select"
                        onChange={changeSortByOptions}
                        value={sortOption.sortBy}
                    >
                        {columns.map((orgItem) => {
                            if (orgItem.isSortable) {
                                return (
                                    <option
                                        data-testid="groupSort-sortBy-Option"
                                        key={orgItem.columnId}
                                        value={orgItem.accessor}
                                    >
                                        {orgItem.title || orgItem.Header}
                                    </option>
                                );
                            }
                            return null;
                        })}
                    </select>
                </div>
            </div>
            <div className="ng-popover--sort__reorder">
                <div>
                    <select
                        data-testid="groupSort-sortOn"
                        className="ng-popover--sort__select"
                        onChange={changeSortOnOptions}
                        value={sortOption.sortOn}
                    >
                        {getInncerCellsOfColumn(sortOption.sortBy) &&
                        getInncerCellsOfColumn(sortOption.sortBy).length > 0 ? (
                            getInncerCellsOfColumn(sortOption.sortBy).map(
                                (innerCellItem) => (
                                    <option
                                        data-testid="groupSort-sortOn-Option"
                                        key={innerCellItem.cellId}
                                        value={innerCellItem.accessor}
                                    >
                                        {innerCellItem.Header}
                                    </option>
                                )
                            )
                        ) : (
                            <option
                                data-testid="groupSort-sortOn-Option"
                                key={0}
                                value="value"
                            >
                                Value
                            </option>
                        )}
                    </select>
                </div>
            </div>
            <div className="ng-popover--sort__reorder">
                <div>
                    <select
                        data-testid="groupSort-order"
                        className="ng-popover--sort__select"
                        value={sortOption.order}
                        onChange={changeSortOrderOptions}
                    >
                        {sortingOrders.map((order) => (
                            <option
                                data-testid="groupSort-order-Option"
                                key={order}
                            >
                                {order}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
            <div className="ng-popover--sort__reorder">
                <div
                    className="ng-popover--sort__icon"
                    role="presentation"
                    data-testid="sort-copy-icon"
                    onClick={copySort}
                >
                    <i>
                        <SortCopy className="ng-icon" />
                    </i>
                </div>
            </div>
            <div className="ng-popover--sort__reorder">
                <div
                    className="ng-popover--sort__icon"
                    role="presentation"
                    data-testid="sort-delete-icon"
                    onClick={deleteSort}
                >
                    <i>
                        <SortDelete className="ng-icon" />
                    </i>
                </div>
            </div>
        </div>
    );
};

SortItem.propTypes = {
    id: PropTypes.number,
    sortOption: PropTypes.object,
    columns: PropTypes.arrayOf(PropTypes.object),
    sortingOrders: PropTypes.array,
    moveSort: PropTypes.func,
    findSort: PropTypes.func,
    updateSingleSortingOption: PropTypes.func,
    copySortOption: PropTypes.func,
    deleteSortOption: PropTypes.func
};

export default SortItem;
