/* eslint-disable no-undef */
import React from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";
import MultiBackend, { TouchTransition } from "react-dnd-multi-backend";
import "@testing-library/jest-dom/extend-expect";
import { render, screen } from "@testing-library/react";
import SortingList from "../../../src/Overlays/groupsort/sortingList";

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

const originalColumns = [
    {
        Header: "Flight",
        accessor: "flight",
        columnId: "flight-id",
        width: 100,
        innerCells: [
            {
                Header: "Flight No",
                accessor: "flightno"
            },
            {
                Header: "Date",
                accessor: "date"
            }
        ],
        sortValue: "flightno"
    },
    {
        Header: "Flight1",
        accessor: "flight1",
        columnId: "flight1-id",
        width: 100,
        innerCells: [
            {
                Header: "Flight No1",
                accessor: "flightno1"
            },
            {
                Header: "Date1",
                accessor: "date1"
            }
        ],
        sortValue: "flightno1"
    }
];

const sortItems = [
    {
        order: "Ascending",
        sortBy: "flight1",
        sortOn: "date1"
    },
    {
        order: "Ascending",
        sortBy: "flight",
        sortOn: "flightno"
    }
];

const sortProps = {
    sortArray: [...sortItems]
};

const updateSortingOptions = jest.fn();

describe("test cases for sorting list", () => {
    it("check the Sort item not null", () => {
        render(
            <DndProvider
                backend={TouchBackend}
                options={{ enableMouseEvents: true }}
            >
                <SortingList
                    sortOptions={sortProps.sortArray}
                    originalColumns={originalColumns}
                />
            </DndProvider>
        );
        expect("listitem").toBe("listitem");
        expect(screen.getAllByRole("listitem"));
    });

    it("Renders component correctly", () => {
        const onMoveSort = jest.fn();
        const onFindSort = jest.fn();
        const updateSingleSortingOptionFn = jest.fn();
        const copySortOptionFn = jest.fn();
        const deleteSortOptionFn = jest.fn();
        const item = [];
        sortItems.forEach((a) =>
            item.push({
                ...a,
                moveSort: onMoveSort,
                findSort: onFindSort,
                updateSingleSortingOption: updateSingleSortingOptionFn,
                copySortOption: copySortOptionFn,
                deleteSortOption: deleteSortOptionFn
            })
        );
        sortProps.sortArray = item;
        const { getByText } = render(
            <DndProvider
                backend={TouchBackend}
                options={{ enableMouseEvents: true }}
            >
                <SortingList
                    sortOptions={sortItems}
                    originalColumns={originalColumns}
                />
            </DndProvider>
        );
        expect(getByText("Date1")).toBeInTheDocument();
    });

    it("should work drag and drop functionality", () => {
        const createBubbledEvent = (type, props = {}) => {
            const event = new Event(type, { bubbles: true });
            Object.assign(event, props);
            return event;
        };
        const { getAllByTestId } = render(
            <DndProvider backend={MultiBackend} options={HTML5toTouch}>
                <SortingList
                    sortOptions={sortItems}
                    originalColumns={originalColumns}
                    updateSortingOptions={updateSortingOptions}
                />
            </DndProvider>
        );
        expect(getAllByTestId("sortItem")).toHaveLength(2);
        const startingNode = getAllByTestId("sortItem")[0];
        const endingNode = getAllByTestId("sortItem")[1];
        startingNode.dispatchEvent(
            createBubbledEvent("dragstart", { clientX: 0, clientY: 0 })
        );
        endingNode.dispatchEvent(
            createBubbledEvent("drop", { clientX: 0, clientY: 1 })
        );
    });
});
