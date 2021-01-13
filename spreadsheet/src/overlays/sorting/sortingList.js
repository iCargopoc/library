import React, { useState } from "react";
import { useDrop } from "react-dnd";
import update from "immutability-helper";
import PropTypes from "prop-types";
import Card from "./sortItem";
import { ItemTypes } from "./itemTypes";

const SortingList = (props) => {
    const { sortsArray } = props;
    const [cards, setCards] = useState([...sortsArray]);

    const findCard = (id) => {
        const card = cards.filter((c) => `${c.id}` === id)[0];
        return {
            card,
            index: cards.indexOf(card)
        };
    };

    const moveCard = (id, atIndex) => {
        const { card, index } = findCard(id);
        setCards(
            update(cards, {
                $splice: [
                    [index, 1],
                    [atIndex, 0, card]
                ]
            })
        );

        const values = [];
        let temp = [];
        temp = update(cards, {
            $splice: [
                [index, 1],
                [atIndex, 0, card]
            ]
        });
        temp.forEach((item) => {
            values.push(item.id);
        });
        props.handleReorderListOfSort(values);
    };

    const [, drop] = useDrop({ accept: ItemTypes.CARD });

    React.useEffect(() => {
        setCards(props.sortsArray);
    }, [sortsArray]);

    return (
        <div ref={drop} className="ng-popover--sort__content">
            <ul className="ng-popover--sort__items-title">
                <li className="ng-popover--sort__item-text">Sort By</li>
                <li className="ng-popover--sort__item-text">Sort On</li>
                <li className="ng-popover--sort__item-text">Order</li>
            </ul>
            {cards.map((card) => (
                <Card
                    key={card.id}
                    id={`${card.id}`}
                    text={card.text}
                    moveCard={moveCard}
                    findCard={findCard}
                />
            ))}
        </div>
    );
};

SortingList.propTypes = {
    sortsArray: PropTypes.arrayOf(PropTypes.object),
    handleReorderListOfSort: PropTypes.func
};

export default SortingList;
