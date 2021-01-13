import React from "react";
import { useDrag, useDrop } from "react-dnd";
import PropTypes from "prop-types";
import { ItemTypes } from "./itemTypes";

const style = {
    cursor: "move"
};

const Card = ({ id, text, moveCard, findCard }) => {
    const originalIndexValue = findCard(id).index;

    const [{ isDragging }, drag] = useDrag({
        item: { type: ItemTypes.CARD, id, originalIndexValue },
        collect: (monitor) => ({
            isDragging: monitor.isDragging()
        }),
        end: (dropResult, monitor) => {
            const { id: droppedId, originalIndex } = monitor.getItem();
            const didDrop = monitor.didDrop();
            if (!didDrop) {
                moveCard(droppedId, originalIndex);
            }
        }
    });

    const [, drop] = useDrop({
        accept: ItemTypes.CARD,
        canDrop: () => false,
        hover({ id: draggedId }) {
            if (draggedId !== id) {
                const { index: overIndex } = findCard(id);
                moveCard(draggedId, overIndex);
            }
        }
    });

    const opacity = isDragging ? 0.5 : 1;
    return (
        <div
            className="ng-popover--sort__items"
            data-testid="sortingItem"
            ref={(node) => drag(drop(node))}
            style={{ ...style, opacity }}
        >
            {text}
        </div>
    );
};

Card.propTypes = {
    id: PropTypes.string,
    text: PropTypes.object,
    moveCard: PropTypes.func,
    findCard: PropTypes.func
};

export default Card;
