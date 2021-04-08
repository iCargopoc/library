/* eslint-disable no-undef */
import React from "react";
import { render, cleanup } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import "@testing-library/jest-dom/extend-expect";
import Grid from "../src/index";

describe("Reference test cases", () => {
    // Grid will load only required data based on the screen size.
    // This function is to mock a ascreen size.
    // This has to be called in each of the test cases
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

    // Mocked columns structure for Grid
    const gridColumns = [
        {
            Header: "Id",
            accessor: "travelId",
            width: 50
        },
        {
            Header: () => {
                return <span className="flightHeader">Flight</span>;
            },
            title: "Flight",
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
            displayCell: (rowData, DisplayTag) => {
                const { flightno } = rowData.flight;
                return (
                    <div className="flight-details">
                        <DisplayTag columnKey="flight" cellKey="flightno">
                            <strong>{flightno}</strong>
                        </DisplayTag>
                    </div>
                );
            }
        },
        {
            Header: "SR",
            accessor: "sr",
            width: 90
        },
        {
            Header: "ULD Positions",
            accessor: "uldPositions",
            width: 120,
            innerCells: [
                {
                    Header: "Position",
                    accessor: "position"
                },
                {
                    Header: "Value",
                    accessor: "value"
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
            }
        }
    ];

    // Mocked column structure that has to be displayed in the row expanded region
    const mockAdditionalColumn = {
        Header: "Remarks",
        innerCells: [{ Header: "Remarks", accessor: "remarks" }],
        displayCell: (rowData, DisplayTag) => {
            const { remarks } = rowData;
            return (
                <div className="details-wrap">
                    <DisplayTag columnKey="remarks" cellKey="remarks">
                        <ul>
                            <li>{remarks}</li>
                        </ul>
                    </DisplayTag>
                </div>
            );
        }
    };

    // Mock sample data structure for Grid
    const data = [
        {
            travelId: 10,
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
    const pageInfo = {
        pageNum: 1,
        pageSize: 300,
        total: 20000,
        lastPage: true
    };

    // Keep a data structure with only 1 row.
    // This is used to test the load more function (which is used to load next page)
    const smallData = [...data];
    const smallPageInfo = {
        pageNum: 1,
        pageSize: 1,
        total: 20000,
        lastPage: false
    };

    // Add more items to the Grid data structure
    for (let i = 0; i < 50; i++) {
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
    const mockOnRowUpdate = jest.fn();
    const mockOnRowSelect = jest.fn();
    const mockLoadMoreData = jest.fn();

    // Initialize contianer and functions for test
    let mockContainer;
    beforeEach(() => {
        mockContainer = document.createElement("div");
        document.body.appendChild(mockContainer);
    });
    afterEach(cleanup);

    // Set screen size before starting the tests.
    // Grid will be loaded based on this screen size.
    mockOffsetSize(600, 600);
    it("load Grid with small data and next page as true. This will trigger the load next page function", () => {
        const { container } = render(
            <Grid
                gridData={smallData}
                idAttribute="travelId"
                paginationType="index"
                pageInfo={smallPageInfo}
                loadMoreData={mockLoadMoreData}
                columns={gridColumns}
                onRowUpdate={mockOnRowUpdate}
                onRowSelect={mockOnRowSelect}
            />
        );
        const gridContainer = container;
        expect(gridContainer).toBeInTheDocument();
        // Check if loadmoredata function has been called
        expect(mockLoadMoreData).toBeCalled();
    });

    it("load Grid with large data and test row expansion", () => {
        const { container, getAllByTestId } = render(
            <Grid
                gridData={data}
                rowsToOverscan={20}
                idAttribute="travelId"
                paginationType="index"
                pageInfo={pageInfo}
                columns={gridColumns}
                columnToExpand={mockAdditionalColumn}
                onRowUpdate={mockOnRowUpdate}
                onRowSelect={mockOnRowSelect}
            />
        );
        const gridContainer = container;
        expect(gridContainer).toBeInTheDocument();

        // Find and click expand icon and check if row rerender is triggered
        // If row is rerendered function to calculate row height will be called for each rows
        const rowExpandIcon = getAllByTestId("rowExpanderIcon");
        act(() => {
            rowExpandIcon[0].dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });
        const rowExpandedRegion = getAllByTestId("rowExpandedRegion");
        expect(rowExpandedRegion.length).toBe(1);
    });

    it("test row selections", () => {
        const { container, getAllByTestId, getByTestId } = render(
            <Grid
                gridData={data}
                idAttribute="travelId"
                paginationType="index"
                pageInfo={pageInfo}
                columns={gridColumns}
                onRowUpdate={mockOnRowUpdate}
                onRowSelect={mockOnRowSelect}
            />
        );
        const gridContainer = container;
        expect(gridContainer).toBeInTheDocument();

        // Test select all checkbox
        let selectAllRowsCheckbox = getByTestId("rowSelector-allRows");
        act(() => {
            selectAllRowsCheckbox.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });
        expect(mockOnRowSelect).toBeCalled();

        // Test deselect all checkbox
        selectAllRowsCheckbox = getByTestId("rowSelector-allRows");
        act(() => {
            selectAllRowsCheckbox.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });
        expect(mockOnRowSelect).toBeCalled();

        // Test single row checkbox
        const selectRowCheckbox = getAllByTestId("rowSelector-singleRow");
        act(() => {
            selectRowCheckbox[0].dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });
        expect(mockOnRowSelect).toBeCalled();
    });
});
