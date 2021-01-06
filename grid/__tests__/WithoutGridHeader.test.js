/* eslint-disable no-undef */
import React from "react";
import { render, cleanup } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import "@testing-library/jest-dom/extend-expect";
import Grid from "../src/index";

describe("render Index file ", () => {
    function mockOffsetSize(width, height) {
        Object.defineProperty(HTMLElement.prototype, "offsetHeight", {
            configurable: true,
            value: height
        });
        Object.defineProperty(HTMLElement.prototype, "offsetWidth", {
            configurable: true,
            value: width
        });
    }

    const mockDisplayCell = jest.fn(() => {
        return (
            <div className="flight-details">
                <strong>XX2225</strong>
                <span>31-Aug-2016</span>
            </div>
        );
    });

    const gridColumns = [
        {
            Header: "Id",
            accessor: "travelId",
            width: 50,
            disableFilters: true
        },
        {
            Header: "Flight",
            accessor: "flight",
            width: 100,
            innerCells: [
                {
                    Header: "Flight No",
                    accessor: "flightno",
                    isSearchable: true
                },
                {
                    Header: "Date",
                    accessor: "date",
                    isSearchable: true
                }
            ],
            isSearchable: true,
            sortValue: "flightno",
            Cell: mockDisplayCell
        },
        {
            Header: "SR",
            accessor: "sr",
            width: 90,
            isSearchable: true
        },
        {
            Header: "ULD Positions",
            accessor: "uldPositions",
            width: 120,
            innerCells: [
                {
                    Header: "Position",
                    accessor: "position",
                    isSearchable: true
                },
                {
                    Header: "Value",
                    accessor: "value",
                    isSearchable: true
                }
            ],
            disableSortBy: true,
            displayCell: (rowData, DisplayTag) => {
                const { uldPositions } = rowData;
                return (
                    <div className="uld-details">
                        <ul>
                            {uldPositions.map((positions, index) => {
                                return (
                                    <li key={index}>
                                        <DisplayTag
                                            columnKey="uldPositions"
                                            cellKey="position"
                                        >
                                            <span>{positions.position}</span>
                                        </DisplayTag>
                                        <DisplayTag
                                            columnKey="uldPositions"
                                            cellKey="value"
                                        >
                                            <strong>{positions.value}</strong>
                                        </DisplayTag>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                );
            },
            columnId: "column_3",
            isSearchable: true
        }
    ];

    const data = [
        {
            travelId: 0,
            flight: {
                flightno: "XX2225",
                date: "31-Aug-2016"
            },
            segment: {
                from: "BCC",
                to: "ZZY"
            },
            details: {
                flightModel: 6518,
                bodyType: "Big Body",
                type: "Van",
                startTime: "01:23 (S)",
                endTime: "11:29 (E)",
                status: "To Be Cancelled",
                additionalStatus:
                    "Elit est consectetur deserunt et sit officia eu. Qui minim quis exercitation in irure elit velit nisi officia cillum laborum reprehenderit.aliqua ex sint cupidatat non",
                timeStatus: "10:02 hrs to depart"
            },
            weight: {
                percentage: "16%",
                value: "35490/20000 kg"
            },
            volume: {
                percentage: "54%",
                value: "31/60 cbm"
            },
            uldPositions: [
                {
                    position: "L1",
                    value: "7/9"
                },
                {
                    position: "Q1",
                    value: "9/3"
                },
                {
                    position: "L6",
                    value: "8/4"
                },
                {
                    position: "Q7",
                    value: "4/9"
                }
            ],
            revenue: {
                revenue: "$63,474.27",
                yeild: "$7.90"
            },
            sr: "74/ AWBs",
            queuedBooking: {
                sr: "88/ AWBs",
                volume: "7437 kg / 31 cbm"
            },
            remarks: "Enim aute magna."
        }
    ];
    for (let i = 1; i < 50; i++) {
        data.push({
            travelId: i,
            flight: {
                flightno: "XX6983",
                date: "23-May-2016"
            },
            segment: {
                from: "AAB",
                to: "XXY"
            },
            details: {
                flightModel: 6593,
                bodyType: "Narrow Body",
                type: "Car",
                startTime: "07:48 (A)",
                endTime: "05:36 (E)",
                status: "Active",
                additionalStatus:
                    "Elit est dolore nostrud Lorem labore et elit voluptate elit commodo cupidatat. Sint quis dolor laboris sit ipsum aliquip.velit cupidatat tempor laborum cupidatat",
                timeStatus: "09:20 hrs to depart"
            },
            weight: {
                percentage: "76%",
                value: "40966/20000 kg"
            },
            volume: {
                percentage: "94%",
                value: "11/60 cbm"
            },
            uldPositions: [
                {
                    position: "L1",
                    value: "6/2"
                },
                {
                    position: "Q2",
                    value: "5/1"
                },
                {
                    position: "L6",
                    value: "6/4"
                },
                {
                    position: "Q5",
                    value: "3/7"
                }
            ],
            revenue: {
                revenue: "$77,213.84",
                yeild: "$4.36"
            },
            sr: "84/ AWBs",
            queuedBooking: {
                sr: "36/ AWBs",
                volume: "7692 kg / 78 cbm"
            },
            remarks: "Labore irure."
        });
    }

    const mockUpdateRowData = jest.fn();
    const mockSelectBulkData = jest.fn();

    let mockContainer;
    beforeEach(() => {
        mockContainer = document.createElement("div");
        document.body.appendChild(mockContainer);
    });
    afterEach(cleanup);

    it("test grid without header", () => {
        mockOffsetSize(600, 600);
        const { container, getByTestId, getAllByTestId } = render(
            <Grid
                gridData={data}
                idAttribute="travelId"
                columns={gridColumns}
                onRowUpdate={mockUpdateRowData}
                onRowSelect={mockSelectBulkData}
                gridHeader={false}
            />
        );
        const gridContainer = container;
        // Check if grid has been loaded
        expect(gridContainer).toBeInTheDocument();

        // Find checked checkboxes
        let checkedCheckboxes = gridContainer.querySelectorAll(
            'input[type="checkbox"]:checked'
        );
        // Checked checkbox count should be 0
        expect(checkedCheckboxes.length).toBe(0);

        // Find and make checked checkbox in the grid header title part
        let checkBoxInHeaderTitle = getByTestId(
            "rowSelector-allRows-fromHeaderTitle"
        );
        act(() => {
            checkBoxInHeaderTitle.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });
        // Find checked checkboxes
        checkedCheckboxes = gridContainer.querySelectorAll(
            'input[type="checkbox"]:checked'
        );
        // Find all row level checkboxes
        const rowLevelCheckboxes = getAllByTestId("rowSelector-singleRow");
        // Total number of checked checkboxes should be all row level checkboxes + 1 checkbox in the grid header title part
        expect(checkedCheckboxes.length).toBe(rowLevelCheckboxes.length + 1);

        // Find and make un-checked checkbox in the grid header title part
        checkBoxInHeaderTitle = getByTestId(
            "rowSelector-allRows-fromHeaderTitle"
        );
        act(() => {
            checkBoxInHeaderTitle.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });
        // Find checked checkboxes
        checkedCheckboxes = gridContainer.querySelectorAll(
            'input[type="checkbox"]:checked'
        );
        // Checked checkbox count should be 0
        expect(checkedCheckboxes.length).toBe(0);
    });
});
