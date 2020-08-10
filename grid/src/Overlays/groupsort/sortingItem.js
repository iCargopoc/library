import React from "react";
import { useDrag, useDrop } from "react-dnd";
import PropTypes from "prop-types";
import { ItemTypes } from "./ItemTypes";
import SortCopy from "../../Images/SortCopy.svg";
import SortDelete from "../../Images/SortDelete.svg";

const SortItem = ({
    id,
    sortOption,
    originalColumns,
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
            const { id: droppedId, originalIndex } = monitor.getItem();
            const didDrop = monitor.didDrop();
            if (!didDrop) {
                moveSort(droppedId, originalIndex);
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
        return originalColumns.find((column) => {
            return column.accessor === columnAccessor;
        }).innerCells;
    };

    const changeSortByOptions = (event) => {
        const newSortByValue = event.target.value;
        const innerCellsList = getInncerCellsOfColumn(newSortByValue);
        updateSingleSortingOption(
            id,
            newSortByValue,
            innerCellsList && innerCellsList.length > 0
                ? innerCellsList[0].accessor
                : "value",
            sortOption.order
        );
    };

    const changeSortOnOptions = (event) => {
        const newSortOnValue = event.target.value;
        updateSingleSortingOption(
            id,
            sortOption.sortBy,
            newSortOnValue,
            sortOption.order
        );
    };

    const changeSortOrderOptions = (event) => {
        const newSortOrderValue = event.target.value;
        updateSingleSortingOption(
            id,
            sortOption.sortBy,
            sortOption.sortOn,
            newSortOrderValue
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
        <div className="sort__bodyContent" style={{ opacity }}>
            <div className="sort__reorder">
                <div
                    ref={(node) => drag(drop(node))}
                    style={{ cursor: "move" }}
                    className=""
                >
                    <i className="fa fa-navicon" />
                </div>
            </div>

            <div className="sort__reorder">
                <div className="sort__file">
                    <select
                        className="custom__ctrl"
                        onChange={changeSortByOptions}
                        value={sortOption.sortBy}
                    >
                        {originalColumns.map((orgItem, index) => (
                            <option key={index} value={orgItem.accessor}>
                                {orgItem.Header}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
            <div className="sort__reorder">
                <div className="sort__file">
                    <select
                        className="custom__ctrl"
                        onChange={changeSortOnOptions}
                        value={sortOption.sortOn}
                    >
                        {getInncerCellsOfColumn(sortOption.sortBy) &&
                        getInncerCellsOfColumn(sortOption.sortBy).length > 0 ? (
                            getInncerCellsOfColumn(sortOption.sortBy).map(
                                (innerCellItem, innerCellIndex) => (
                                    <option
                                        key={innerCellIndex}
                                        value={innerCellItem.accessor}
                                    >
                                        {innerCellItem.Header}
                                    </option>
                                )
                            )
                        ) : (
                            <option key={0} value="value">
                                Value
                            </option>
                        )}
                    </select>
                </div>
            </div>
            <div className="sort__reorder">
                <div className="sort__file">
                    <select
                        className="custom__ctrl"
                        value={sortOption.order}
                        onChange={changeSortOrderOptions}
                    >
                        <option>Ascending</option>
                        <option>Descending</option>
                    </select>
                </div>
            </div>
            <div className="sort__reorder">
                <div
                    className="sort__icon"
                    role="presentation"
                    onClick={copySort}
                >
                    <i>
                        <img src={SortCopy} alt="copy sort" />
                    </i>
                </div>
            </div>
            <div className="sort__reorder">
                <div
                    className="sort__icon"
                    role="presentation"
                    onClick={deleteSort}
                >
                    <i>
                        <img src={SortDelete} alt="copy sort" />
                    </i>
                </div>
            </div>
        </div>
    );
};

SortItem.propTypes = {
    id: PropTypes.any,
    sortOption: PropTypes.any,
    originalColumns: PropTypes.any,
    moveSort: PropTypes.any,
    findSort: PropTypes.any,
    updateSingleSortingOption: PropTypes.any,
    copySortOption: PropTypes.any,
    deleteSortOption: PropTypes.any
};

export default SortItem;
