import React, { useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import { ItemTypes } from "./ItemTypes";

const style = {
    cursor: "move"
};

const Card = ({
    id,
    text,
    sortParamObj,
    originalColumns,
    handleEditOfSortingParamsList,
    handleDeleteOfSortList,
    handleCopySortRow,
    indexOfIteration,
    moveColumn,
    findColumn
}) => {
    const [sortOnOption, setSortOnOption] = useState(
        originalColumns.filter((item) => item.accessor === sortParamObj.sortBy)[0].innerCells
    );
    // const [updatedSortObj, setUpdatedSortObj] = useState()
    const originalIndex = findColumn(indexOfIteration).index;

    const changeSortOnOptions = (selectedHeader, indexOfSelectedItem) => {
        originalColumns.map((orgItem) => {
            if (orgItem.Header === selectedHeader) {
                setSortOnOption(orgItem.innerCells);
                // return orgItem.innerCells;
            }
        });
        handleOnChangeSortingParams(indexOfSelectedItem, "sortBy", selectedHeader);
    };

    const handleOnChangeSortingParams = (index, key, value) => {
        handleEditOfSortingParamsList(index, key, value);
    };

    const [{ isDragging }, drag] = useDrag({
        item: { type: ItemTypes.CARD, id, originalIndex },
        collect: (monitor) => ({
            isDragging: monitor.isDragging()
        }),
        end: (dropResult, monitor) => {
            const { id: droppedId, originalIndex } = monitor.getItem();
            const didDrop = monitor.didDrop();
            if (!didDrop) {
                moveColumn(droppedId, originalIndex);
            //
            }
        }
    });

    const [, drop] = useDrop({
        accept: ItemTypes.CARD,
        canDrop: () => false,
        hover({ id: draggedId }) {
            if (draggedId !== id) {
                const { index: overIndex } = findColumn(id);
                moveColumn(draggedId, overIndex);
            }
        }
    });

    const opacity = isDragging ? 0.5 : 1;

    return (
        <div className="sort__bodyContent" style={{ opacity }}>
            <div className="sort__reorder">
                <div className="">
                    <div>&nbsp;</div>
                </div>

                <div ref={(node) => drag(drop(node))} style={{ cursor: "move" }} className="">
                    <i class="fa fa-navicon"></i>
                </div>
            </div>

            <div className="sort__reorder">
                <div className="">
                    <div>Sort by</div>
                </div>
                <div className="sort__file">
                    <select
                        className="custom__ctrl"
                        name={"sortBy"}
                        onChange={(event) => changeSortOnOptions(event.target.value, indexOfIteration)}
                        value={originalColumns.filter((item) => item.accessor === sortParamObj.sortBy)[0].Header}
                    >
                        {originalColumns.map((orgItem, index) => (
                            <option key={index}>{orgItem.Header}</option>
                        ))}
                    </select>
                </div>
            </div>
            <div className="sort__reorder">
                <div className="">
                    <div>Sort on</div>
                </div>
                <div className="sort__file">
                    <select
                        className="custom__ctrl"
                        onChange={(event) => handleOnChangeSortingParams(indexOfIteration, "sortOn", event.target.value)}
                        value={
                            originalColumns.filter((item) => item.accessor === sortParamObj.sortBy)[0].innerCells !== undefined
                                ? originalColumns
                                      .filter((item) => item.accessor === sortParamObj.sortBy)[0]
                                      .innerCells.filter((inrCls) => inrCls.accessor === sortParamObj.sortOn)[0].Header
                                : "Value"
                        }
                        name={"sortOn"}
                    >
                        {sortOnOption === undefined ? (
                                <option key={0}>{sortParamObj.sortOn}</option>
                            )
                         : (
                            sortOnOption.map((innerCellItem, innerCellIndex) => (
                                <option key={innerCellIndex}>{innerCellItem.Header}</option>
                            ))
                        )}
                    </select>
                </div>
            </div>
            <div className="sort__reorder">
                <div className="">
                    <div>Order</div>
                </div>
                <div className="sort__file">
                    <select
                        className="custom__ctrl"
                        value={sortParamObj.order}
                        name={"order"}
                        onChange={(event) => handleOnChangeSortingParams(indexOfIteration, "order", event.target.value)}
                    >
                        <option>Ascending</option>
                        <option>Descending</option>
                    </select>
                </div>
            </div>
            <div className="sort__reorder">
                <div className="">
                    <div>&nbsp;</div>
                </div>

                <div className="sort__icon" type={"button"} onClick={() => handleCopySortRow(indexOfIteration)}>
                    <i class="fa fa-clone"></i>
                </div>
            </div>
            <div className="sort__reorder">
                <div className="">
                    <div>&nbsp;</div>
                </div>
                <div className="sort__icon" type={"button"} onClick={() => handleDeleteOfSortList(indexOfIteration)}>
                    <i class="fa fa-trash"></i>
                </div>
            </div>
        </div>
    );
};

export default Card;
