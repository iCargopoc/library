/* eslint-disable no-undef */

import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { DndProvider } from "react-dnd";
import { TouchBackend } from "react-dnd-touch-backend";
import { HTML5Backend } from "react-dnd-html5-backend";
import MultiBackend, { TouchTransition } from "react-dnd-multi-backend";
import SortingList from "../../../src/overlays/sorting/SortingList";
import "@testing-library/jest-dom/extend-expect";

let container;

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

beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
});

afterEach(() => {
    document.body.removeChild(container);
    container = null;
});

describe("<SortingList />", () => {
    const sortsArray = [
        {
            id: 1,
            key: "flightno",
            text: "FlightNo"
        },
        {
            id: 2,
            key: "date",
            text: "Date"
        },
        {
            id: 3,
            key: "segmentfrom",
            text: "Segment From"
        }
    ];
    const handleReorderListOfSort = jest.fn(() => {});

    it("mount and render", () => {
        const { asFragment } = render(
            <DndProvider backend={MultiBackend} options={HTML5toTouch}>
                <SortingList
                    sortsArray={sortsArray}
                    handleReorderListOfSort={handleReorderListOfSort}
                />
            </DndProvider>
        );
        expect(asFragment).not.toBeNull();
    });
});
it("should work drag and drop functionality", () => {
    const sortsArray = [
        {
            id: 1,
            key: "flightno",
            text: "FlightNo"
        },
        {
            id: 2,
            key: "date",
            text: "Date"
        },
        {
            id: 3,
            key: "segmentfrom",
            text: "Segment From"
        }
    ];
    const handleReorderListOfSort = jest.fn(() => {});
    const createBubbledEvent = (type, props = {}) => {
        const event = new Event(type, { bubbles: true });
        Object.assign(event, props);
        return event;
    };
    const { getAllByTestId } = render(
        <DndProvider backend={MultiBackend} options={HTML5toTouch}>
            <SortingList
                sortsArray={sortsArray}
                handleReorderListOfSort={handleReorderListOfSort}
            />
        </DndProvider>
    );
    expect(getAllByTestId("sortingItem")).toHaveLength(3);
    const startingNode = getAllByTestId("sortingItem")[0];
    const endingNode = getAllByTestId("sortingItem")[1];
    startingNode.dispatchEvent(
        createBubbledEvent("dragstart", { clientX: 0, clientY: 0 })
    );
    fireEvent.dragStart(startingNode);
    console.log(startingNode.innerHTML);
    console.log(endingNode.innerHTML);
    endingNode.dispatchEvent(
        createBubbledEvent("drop", { clientX: 0, clientY: 1 })
    );
    fireEvent.dragEnd(startingNode);
});
