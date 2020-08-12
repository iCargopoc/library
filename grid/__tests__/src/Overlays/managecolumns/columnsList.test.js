/* eslint-disable no-undef */
import React from "react";
import { render, cleanup, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";
import MultiBackend, { TouchTransition } from "react-dnd-multi-backend";
import ColumnsList from "../../../../src/Overlays/managecolumns/columnsList";

describe("ColumnsList unit test", () => {
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

    afterEach(cleanup);

    it("should renders component", () => {
        const { getByText } = render(
            <DndProvider backend={MultiBackend} options={HTML5toTouch}>
                <ColumnsList
                    columnsToManage={managedColumns}
                    updateColumnsInState={updateColumnsInState}
                    isInnerCellSelected={isInnerCellSelected}
                    selectInnerCells={selectInnerCells}
                />
            </DndProvider>
        );
        expect(getByText("Flight")).toBeInTheDocument();
    });
    it("contains 2 columnItems inside ColumnList", () => {
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
        const item = getAllByTestId("columnItem")[0];
        fireEvent.drag(item);
    });
});
