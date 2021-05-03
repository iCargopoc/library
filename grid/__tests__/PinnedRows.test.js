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
        Object.defineProperty(HTMLElement.prototype, "scrollHeight", {
            configurable: true,
            value: height - 100
        });
        Object.defineProperty(HTMLElement.prototype, "offsetWidth", {
            configurable: true,
            value: width
        });
        Object.defineProperty(window, "innerWidth", {
            configurable: true,
            value: width
        });
    }

    const mockGridColumns = [
        {
            Header: "Id",
            accessor: "travelId",
            width: 50,
            displayCell: () => {
                return <p style={{ height: "50px" }}>Id value</p>;
            }
        },
        {
            Header: () => {
                return <span className="flightHeader">Flight</span>;
            },
            title: "Flight",
            accessor: "flight",
            width: 100,
            displayCell: () => {
                return <p style={{ height: "50px" }}>Flight value</p>;
            }
        },
        {
            Header: "SR",
            accessor: "sr",
            width: 90,
            displayCell: () => {
                return <p style={{ height: "50px" }}>SR value</p>;
            }
        },
        {
            Header: "ULD Positions",
            accessor: "uldPositions",
            width: 120,
            displayCell: () => {
                return <p style={{ height: "50px" }}>ULD value</p>;
            }
        }
    ];

    const mockAdditionalColumn = {
        Header: "Remarks",
        innerCells: [
            {
                Header: "Remarks",
                accessor: "remarks"
            }
        ],
        displayCell: () => {
            return <p style={{ height: "50px" }}>Remarks value</p>;
        }
    };

    const data = [
        {
            travelId: 50,
            flight: {
                flightno: "XX2225",
                date: "31-Aug-2016"
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
            sr: "74/ AWBs"
        }
    ];

    for (let i = 0; i < 50; i++) {
        data.push({
            travelId: i,
            flight: {
                flightno: "XX6983",
                date: "23-May-2016"
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
            sr: "84/ AWBs"
        });
    }

    const gmockGtRowInfo = (rowData) => {
        const { travelId } = rowData;
        return {
            isRowExpandable: travelId % 2 === 0,
            isRowSelectable: true,
            className: travelId % 2 === 0 ? "disabled" : ""
        };
    };
    const mockRowsToPin = [1, 2];
    const mockRowActions = jest.fn();
    const mockUpdateRowData = jest.fn();
    const mockSelectBulkData = jest.fn();

    let mockContainer;
    beforeEach(() => {
        mockContainer = document.createElement("div");
        document.body.appendChild(mockContainer);
    });
    afterEach(cleanup);

    it("test pin rows functionality", () => {
        mockOffsetSize(1440, 900);
        const { getAllByTestId, container } = render(
            <Grid
                gridData={data}
                idAttribute="travelId"
                columns={mockGridColumns}
                columnToExpand={mockAdditionalColumn}
                getRowInfo={gmockGtRowInfo}
                rowActions={mockRowActions}
                onRowUpdate={mockUpdateRowData}
                onRowSelect={mockSelectBulkData}
                rowsToPin={mockRowsToPin}
            />
        );
        const gridContainer = container;
        expect(gridContainer).toBeInTheDocument();

        // Check if pin rows are present
        expect(getAllByTestId("pinned-gridrow").length).toBe(2);
    });

    it("test pin rows functionality without grid header", () => {
        mockOffsetSize(1440, 900);
        const { getAllByTestId, container } = render(
            <Grid
                gridData={data}
                idAttribute="travelId"
                columns={mockGridColumns}
                onRowUpdate={mockUpdateRowData}
                onRowSelect={mockSelectBulkData}
                rowsToPin={mockRowsToPin}
                gridHeader={false}
            />
        );
        const gridContainer = container;
        expect(gridContainer).toBeInTheDocument();

        // Check if pin rows are present
        expect(getAllByTestId("pinned-gridrow").length).toBe(2);
    });
});
