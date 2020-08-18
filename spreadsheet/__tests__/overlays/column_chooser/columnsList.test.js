/* eslint-disable no-undef */

import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { DndProvider } from "react-dnd";
import { TouchBackend } from "react-dnd-touch-backend";
import ColumnsList from "../../../src/overlays/column_chooser/columnsList";
import "@testing-library/jest-dom/extend-expect";

let container;

beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
});

afterEach(() => {
    document.body.removeChild(container);
    container = null;
});

describe("<ColumnsList />", () => {
    const columns = [
        {
            id: "FlightNo",
            text: (
                <div className="column__reorder" key={1}>
                    <div style={{ cursor: "move" }} className="column_drag" />
                    <div className="column__reorder__name">FlightNo</div>
                    <div className="column__innerCells__wrap">
                        <div className="column__wrap">
                            <div className="column__checkbox">
                                <input
                                    data-testid="reArrangeLeftPin"
                                    role="button"
                                    type="checkbox"
                                    id={`checkBoxToPinLeft_${"FlightNo"}`}
                                    disabled={false}
                                />
                            </div>
                            <div className="column__txt">Pin Left</div>
                        </div>
                    </div>
                </div>
            )
        },
        {
            id: "Date",
            text: (
                <div className="column__reorder" key={2}>
                    <div style={{ cursor: "move" }} className="column_drag" />
                    <div className="column__reorder__name">Date</div>
                    <div className="column__innerCells__wrap">
                        <div className="column__wrap">
                            <div className="column__checkbox">
                                <input
                                    data-testid="reArrangeLeftPin"
                                    role="button"
                                    type="checkbox"
                                    id={`checkBoxToPinLeft_${"Date"}`}
                                    disabled={false}
                                />
                            </div>
                            <div className="column__txt">Pin Left</div>
                        </div>
                    </div>
                </div>
            )
        },
        {
            id: "SegmentFrom",
            text: (
                <div className="column__reorder" key={3}>
                    <div style={{ cursor: "move" }} className="column_drag" />
                    <div className="column__reorder__name">SegmentFrom</div>
                    <div className="column__innerCells__wrap">
                        <div className="column__wrap">
                            <div className="column__checkbox">
                                <input
                                    data-testid="reArrangeLeftPin"
                                    role="button"
                                    type="checkbox"
                                    id={`checkBoxToPinLeft_${"SegmentFrom"}`}
                                    disabled={false}
                                />
                            </div>
                            <div className="column__txt">Pin Left</div>
                        </div>
                    </div>
                </div>
            )
        }
    ];

    const handleReorderList = jest.fn(() => {});

    it("mount and render", () => {
        const { asFragment } = render(
            <DndProvider
                backend={TouchBackend}
                options={{ enableMouseEvents: true }}
            >
                <ColumnsList
                    columnsArray={columns}
                    handleReorderList={handleReorderList}
                />
            </DndProvider>
        );
        expect(asFragment).not.toBeNull();
    });
    it("should work drag and drop functionality", () => {
        const createBubbledEvent = (type, props = {}) => {
            const event = new Event(type, { bubbles: true });
            Object.assign(event, props);
            return event;
        };
        const { getAllByTestId } = render(
            <DndProvider
                backend={TouchBackend}
                options={{ enableMouseEvents: true }}
            >
                <ColumnsList
                    columnsArray={columns}
                    handleReorderList={handleReorderList}
                />
            </DndProvider>
        );
        expect(getAllByTestId("columnItem")).toHaveLength(3);
        const startingNode = getAllByTestId("columnItem")[0];
        const endingNode = getAllByTestId("columnItem")[1];
        startingNode.dispatchEvent(
            createBubbledEvent("dragstart", { clientX: 0, clientY: 0 })
        );
        endingNode.dispatchEvent(
            createBubbledEvent("drop", { clientX: 0, clientY: 2 })
        );
        fireEvent.dragEnd(startingNode);
    });
});
