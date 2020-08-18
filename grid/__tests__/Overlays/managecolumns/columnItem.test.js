/* eslint-disable no-undef */
import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { DndProvider } from "react-dnd";
import { TouchBackend } from "react-dnd-touch-backend";
import { HTML5Backend } from "react-dnd-html5-backend";
import MultiBackend, { TouchTransition } from "react-dnd-multi-backend";
import ColumnItem from "../../../src/Overlays/managecolumns/columnItem";
import ColumnsList from "../../../src/Overlays/managecolumns/columnsList";
import "@testing-library/jest-dom/extend-expect";

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

const managedColumns = [
    {
        Header: "Id",
        accessor: "travelId",
        width: 50,
        disableFilters: true,
        columnId: "column_0",
        displayInExpandedRegion: false
    },
    {
        Header: "Flight",
        accessor: "flight",
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
        sortValue: "flightno",
        columnId: "column_1",
        displayInExpandedRegion: false,
        originalInnerCells: [
            {
                Header: "Flight No",
                accessor: "flightno"
            },
            {
                Header: "Date",
                accessor: "date"
            }
        ]
    }
];
const updateColumnsInState = jest.fn();
const isInnerCellSelected = jest.fn();
const selectInnerCells = jest.fn();
const data = {
    id: 1,
    Header: "Flight",
    moveColumn: jest.fn(),
    findColumn: jest.fn(() => 1),
    originalInnerCells: [
        {
            Header: "Flight No",
            accessor: "flightno"
        },
        {
            Header: "Date",
            accessor: "date"
        }
    ],
    isInnerCellSelected: jest.fn(),
    selectInnerCells: jest.fn()
};

describe("render ColumnItem", () => {
    it("should renders parent component", () => {
        const { getByText, container } = render(
            <DndProvider backend={MultiBackend} options={HTML5toTouch}>
                <ColumnsList
                    columnsToManage={managedColumns}
                    updateColumnsInState={updateColumnsInState}
                    isInnerCellSelected={isInnerCellSelected}
                    selectInnerCells={selectInnerCells}
                />
            </DndProvider>
        );
        const childComponent = container.querySelector("div");
        expect(childComponent).toBeInTheDocument();
        expect(getByText("Flight")).toBeInTheDocument();
    });
    it("should work drag and drop functionality", () => {
        const createBubbledEvent = (type, props = {}) => {
            const event = new Event(type, { bubbles: true });
            Object.assign(event, props);
            return event;
        };
        const { getAllByTestId } = render(
            <DndProvider backend={MultiBackend} options={HTML5toTouch}>
                <ColumnsList
                    columnsToManage={managedColumns}
                    updateColumnsInState={updateColumnsInState}
                    isInnerCellSelected={isInnerCellSelected}
                    selectInnerCells={selectInnerCells}
                />
            </DndProvider>
        );
        expect(getAllByTestId("columnItem")).toHaveLength(2);
        const startingNode = getAllByTestId("columnItem")[0];
        const endingNode = getAllByTestId("columnItem")[1];
        startingNode.dispatchEvent(
            createBubbledEvent("dragstart", { clientX: 0, clientY: 0 })
        );
        endingNode.dispatchEvent(
            createBubbledEvent("drop", { clientX: 0, clientY: 1 })
        );
        fireEvent.dragEnd(startingNode);
    });
    it("should work drag and drop functionality with didDrop false", () => {
        const createBubbledEvent = (type, props = {}) => {
            const event = new Event(type, { bubbles: true });
            Object.assign(event, props);
            return event;
        };
        const { getAllByTestId } = render(
            <DndProvider backend={MultiBackend} options={HTML5toTouch}>
                <ColumnsList
                    columnsToManage={managedColumns}
                    updateColumnsInState={updateColumnsInState}
                    isInnerCellSelected={isInnerCellSelected}
                    selectInnerCells={selectInnerCells}
                />
            </DndProvider>
        );
        expect(getAllByTestId("columnItem")).toHaveLength(2);
        const startingNode = getAllByTestId("columnItem")[0];
        startingNode.dispatchEvent(
            createBubbledEvent("dragstart", { clientX: 0, clientY: 0 })
        );
        fireEvent.dragEnd(startingNode);
    });

    it("should renders child component", () => {
        const { container } = render(
            <DndProvider
                backend={MultiBackend}
                options={HTML5toTouch}
                columnsToManage={managedColumns}
                updateColumnsInState={updateColumnsInState}
                isInnerCellSelected={isInnerCellSelected}
                selectInnerCells={selectInnerCells}
            >
                <ColumnItem {...data} />
            </DndProvider>
        );
        const childComponent = container.querySelector("div");
        expect(childComponent).toBeInTheDocument();
    });
});
