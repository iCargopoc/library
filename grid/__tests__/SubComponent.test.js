/* eslint-disable no-undef */
import React from "react";
import { render, cleanup, fireEvent } from "@testing-library/react";
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
    }

    const mockGridData = [
        {
            travelId: 60,
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
            remarks: "Enim aute magna.",
            subComponentData: [
                {
                    hawbId: 601,
                    hawb: {
                        hawbNo: "H1886",
                        from: "CBB",
                        to: "YYX",
                        status: "In transit",
                        ports: "GEN,SPX",
                        type: "NCE Corper",
                        std: {
                            item1: "20 Pcs",
                            item2: "300 kg",
                            item3: "0.3 CBM",
                            item4: "100 Slac Pcs"
                        },
                        goodsType: "Dangerous Goods"
                    },
                    scr: {
                        status: "Not ready to send",
                        ack: "Call",
                        num: 639
                    },
                    remarks:
                        "Laboris enim non do esse aliquip adipisicing eiusmod officia quis commodo sit. Voluptate ullamco occaecat incididunt amet ad dolor nisi ad consectetur. Laboris nulla esse do occaecat tempor cupidatat labore."
                },
                {
                    hawbId: 602,
                    hawb: {
                        hawbNo: "H1886",
                        from: "CBB",
                        to: "YYX",
                        status: "In transit",
                        ports: "GEN,SPX",
                        type: "NCE Corper",
                        std: {
                            item1: "20 Pcs",
                            item2: "300 kg",
                            item3: "0.3 CBM",
                            item4: "100 Slac Pcs"
                        },
                        goodsType: "Dangerous Goods"
                    },
                    scr: {
                        status: "Not ready to send",
                        ack: "Call",
                        num: 639
                    },
                    remarks:
                        "Laboris enim non do esse aliquip adipisicing eiusmod officia quis commodo sit. Voluptate ullamco occaecat incididunt amet ad dolor nisi ad consectetur. Laboris nulla esse do occaecat tempor cupidatat labore."
                },
                {
                    hawbId: 603,
                    hawb: {
                        hawbNo: "H1886",
                        from: "CBB",
                        to: "YYX",
                        status: "In transit",
                        ports: "GEN,SPX",
                        type: "NCE Corper",
                        std: {
                            item1: "20 Pcs",
                            item2: "300 kg",
                            item3: "0.3 CBM",
                            item4: "100 Slac Pcs"
                        },
                        goodsType: "Dangerous Goods"
                    },
                    scr: {
                        status: "Not ready to send",
                        ack: "Call",
                        num: 639
                    },
                    remarks:
                        "Laboris enim non do esse aliquip adipisicing eiusmod officia quis commodo sit. Voluptate ullamco occaecat incididunt amet ad dolor nisi ad consectetur. Laboris nulla esse do occaecat tempor cupidatat labore."
                }
            ]
        }
    ];
    for (let i = 0; i < 50; i++) {
        mockGridData.push({
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
            remarks: "Labore irure.",
            subComponentData: [
                {
                    hawbId: i * 100 + 1,
                    hawb: {
                        hawbNo: "H1886",
                        from: "CBB",
                        to: "YYX",
                        status: "In transit",
                        ports: "GEN,SPX",
                        type: "NCE Corper",
                        std: {
                            item1: "20 Pcs",
                            item2: "300 kg",
                            item3: "0.3 CBM",
                            item4: "100 Slac Pcs"
                        },
                        goodsType: "Dangerous Goods"
                    },
                    scr: {
                        status: "Not ready to send",
                        ack: "Call",
                        num: 639
                    },
                    remarks:
                        "Laboris enim non do esse aliquip adipisicing eiusmod officia quis commodo sit. Voluptate ullamco occaecat incididunt amet ad dolor nisi ad consectetur. Laboris nulla esse do occaecat tempor cupidatat labore."
                },
                {
                    hawbId: i * 100 + 2,
                    hawb: {
                        hawbNo: "H1886",
                        from: "CBB",
                        to: "YYX",
                        status: "In transit",
                        ports: "GEN,SPX",
                        type: "NCE Corper",
                        std: {
                            item1: "20 Pcs",
                            item2: "300 kg",
                            item3: "0.3 CBM",
                            item4: "100 Slac Pcs"
                        },
                        goodsType: "Dangerous Goods"
                    },
                    scr: {
                        status: "Not ready to send",
                        ack: "Call",
                        num: 639
                    },
                    remarks:
                        "Laboris enim non do esse aliquip adipisicing eiusmod officia quis commodo sit. Voluptate ullamco occaecat incididunt amet ad dolor nisi ad consectetur. Laboris nulla esse do occaecat tempor cupidatat labore."
                },
                {
                    hawbId: i * 100 + 3,
                    hawb: {
                        hawbNo: "H1886",
                        from: "CBB",
                        to: "YYX",
                        status: "In transit",
                        ports: "GEN,SPX",
                        type: "NCE Corper",
                        std: {
                            item1: "20 Pcs",
                            item2: "300 kg",
                            item3: "0.3 CBM",
                            item4: "100 Slac Pcs"
                        },
                        goodsType: "Dangerous Goods"
                    },
                    scr: {
                        status: "Not ready to send",
                        ack: "Call",
                        num: 639
                    },
                    remarks:
                        "Laboris enim non do esse aliquip adipisicing eiusmod officia quis commodo sit. Voluptate ullamco occaecat incididunt amet ad dolor nisi ad consectetur. Laboris nulla esse do occaecat tempor cupidatat labore."
                }
            ]
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
    const mockUpdateDateValue = jest.fn();
    const mockEditCell = jest.fn((rowData, DisplayTag, rowUpdateCallBack) => {
        const { flightno, date } = rowData.flight;
        return (
            <div>
                <DisplayTag columnKey="flight" cellKey="flightno">
                    <input
                        data-testid="flightnoinput"
                        className="flight-no-input"
                        type="text"
                        value={flightno}
                        onChange={() => rowUpdateCallBack("nothing")}
                    />
                </DisplayTag>
                <DisplayTag columnKey="flight" cellKey="date">
                    <input
                        type="date"
                        value={date}
                        onChange={mockUpdateDateValue}
                    />
                </DisplayTag>
            </div>
        );
    });

    const gridColumns = [
        {
            Header: "Id",
            accessor: "travelId",
            width: 50,
            isSortable: true,
            disableFilters: true
        },
        {
            Header: () => {
                return <span className="flightHeader">Flight</span>;
            },
            title: "Flight",
            accessor: "flight",
            width: 100,
            isSortable: true,
            innerCells: [
                {
                    Header: "Flight No",
                    accessor: "flightno",
                    isSortable: true,
                    isSearchable: true
                },
                {
                    Header: "Date",
                    accessor: "date",
                    isSortable: true,
                    isSearchable: true
                }
            ],
            isSearchable: true,
            sortValue: "flightno",
            displayCell: mockDisplayCell,
            editCell: mockEditCell
        },
        {
            Header: "SR",
            accessor: "sr",
            width: 90,
            isSortable: true,
            isSearchable: true
        },
        {
            Header: "ULD Positions",
            accessor: "uldPositions",
            width: 120,
            isSortable: true,
            innerCells: [
                {
                    Header: "Position",
                    accessor: "position",
                    isSortable: true,
                    isSearchable: true
                },
                {
                    Header: "Value",
                    accessor: "value",
                    isSortable: true,
                    isSearchable: true
                }
            ],
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
            isSearchable: true
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

    const subComponentColumns = [
        {
            Header: "HAWB No",
            accessor: "hawbId",
            width: 250,
            isSortable: true,
            displayCell: (rowData, DisplayTag, isDesktop, isColumnExpanded) => {
                const { hawbId } = rowData;
                if (hawbId !== null && hawbId !== undefined) {
                    return (
                        <div className="travelId-details">
                            <span>{hawbId}</span>
                        </div>
                    );
                }
                return null;
            }
        },
        {
            Header: "AWB Details",
            accessor: "hawb",
            width: 800,
            isSortable: true,
            innerCells: [
                {
                    Header: "From",
                    accessor: "from",
                    isSortable: true
                },
                {
                    Header: "To",
                    accessor: "to",
                    isSortable: true
                },
                {
                    Header: "Goods Type",
                    accessor: "goodsType"
                },
                {
                    Header: "Hawb No",
                    accessor: "hawbNo"
                },
                {
                    Header: "Ports",
                    accessor: "ports"
                },
                {
                    Header: "Status",
                    accessor: "status"
                },
                {
                    Header: "Type",
                    accessor: "type"
                },
                {
                    Header: "Std",
                    accessor: "std"
                }
            ],
            disableSortBy: true,
            displayCell: (rowData, DisplayTag, isDesktop, isColumnExpanded) => {
                const { hawb } = rowData;
                const { from, to, goodsType, hawbNo, ports, status } = hawb;
                return (
                    <div
                        className="details-wrap"
                        style={{ marginRight: "35px" }}
                    >
                        <ul className="details-expanded-content">
                            <li>
                                <DisplayTag columnKey="hawb" cellKey="from">
                                    {from}
                                </DisplayTag>
                                -
                                <DisplayTag columnKey="hawb" cellKey="to">
                                    {to}
                                </DisplayTag>
                            </li>
                            <li className="divider">|</li>
                            <li>
                                <DisplayTag columnKey="hawb" cellKey="status">
                                    <span>{status}</span>
                                </DisplayTag>
                            </li>
                            <li className="divider">|</li>
                            <li>
                                <DisplayTag
                                    columnKey="hawb"
                                    cellKey="goodsType"
                                >
                                    {goodsType}
                                </DisplayTag>
                            </li>
                            <li className="divider">|</li>
                            <li>
                                <DisplayTag columnKey="hawb" cellKey="hawbNo">
                                    {hawbNo}
                                </DisplayTag>
                            </li>
                            <li className="divider">|</li>
                            <li>
                                <DisplayTag columnKey="hawb" cellKey="ports">
                                    {ports}
                                </DisplayTag>
                            </li>
                        </ul>
                    </div>
                );
            }
        },
        {
            Header: "SCR Details",
            accessor: "scr",
            width: 200,
            isSearchable: true,
            isSortable: true,
            innerCells: [
                {
                    Header: "ACK",
                    accessor: "ack"
                },
                {
                    Header: "NUM",
                    accessor: "num",
                    isSearchable: true,
                    isSortable: true
                },
                {
                    Header: "Status",
                    accessor: "status"
                }
            ],
            displayCell: (rowData, DisplayTag, isDesktop, isColumnExpanded) => {
                const { scr } = rowData;
                const { ack, num, status } = scr;
                return (
                    <div className="details-wrap">
                        <ul className="details-expanded-content">
                            <li>
                                <DisplayTag columnKey="scr" cellKey="ack">
                                    <span>{ack}</span>
                                </DisplayTag>
                            </li>
                            <li className="divider">|</li>
                            <li>
                                <DisplayTag columnKey="scr" cellKey="num">
                                    {num}
                                </DisplayTag>
                            </li>
                            <li className="divider">|</li>
                            <li>
                                <DisplayTag columnKey="scr" cellKey="status">
                                    {status}
                                </DisplayTag>
                            </li>
                        </ul>
                    </div>
                );
            }
        }
    ];

    const mockSubComponentAdditionalColumn = {
        Header: "Additional Column",
        innerCells: [{ Header: "Remarks", accessor: "remarks" }],
        displayCell: (rowData, DisplayTag, isDesktop) => {
            const { remarks } = rowData;
            return (
                <div className="remarks-wrap details-wrap">
                    <DisplayTag columnKey="remarks" cellKey="remarks">
                        <ul>
                            <li>{remarks}</li>
                        </ul>
                    </DisplayTag>
                </div>
            );
        }
    };

    const mockGetRowInfo = (rowData, isSubComponentRow) => {
        if (isSubComponentRow) {
            const { hawbId } = rowData;
            return {
                isRowExpandable: hawbId % 2 === 0,
                isRowSelectable: hawbId % 3 !== 0,
                className: hawbId % 2 === 0 ? "disabled" : ""
            };
        }
        const { travelId } = rowData;
        return {
            isRowExpandable: travelId % 2 === 0,
            isRowSelectable: travelId % 3 !== 0,
            className: travelId % 2 === 0 ? "disabled" : ""
        };
    };

    const mockGridWidth = "100%";
    const mockTitle = "AWBs";

    const mockRowActions = jest.fn();
    const mockUpdateRowData = jest.fn();
    const mockSelectBulkData = jest.fn();
    const mockLoadMoreData = jest.fn();

    let mockContainer;
    beforeEach(() => {
        mockContainer = document.createElement("div");
        document.body.appendChild(mockContainer);
    });
    afterEach(cleanup);

    it("test grid with sub component data without row selector", () => {
        mockOffsetSize(600, 600);
        const { container, getAllByTestId, getByTestId } = render(
            <Grid
                title={mockTitle}
                gridWidth={mockGridWidth}
                gridData={mockGridData}
                idAttribute="travelId"
                paginationType="index"
                loadMoreData={mockLoadMoreData}
                columns={gridColumns}
                columnToExpand={mockAdditionalColumn}
                subComponentColumnns={subComponentColumns}
                getRowInfo={mockGetRowInfo}
                rowActions={mockRowActions}
                rowSelector={false}
                onRowUpdate={mockUpdateRowData}
            />
        );
        const gridContainer = container;

        // Check if Grid id rendered.
        expect(gridContainer).toBeInTheDocument();

        // Check if expand/collapse icons are present
        let subComponentExpandCollpase = getAllByTestId(
            "subComponent-header-expand-collapse"
        );
        expect(subComponentExpandCollpase.length).toBeGreaterThan(0);

        // Open 1 subComponent
        act(() => {
            subComponentExpandCollpase[0].dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });
        // Check if subComponent section is opened
        let subComponentContent = getAllByTestId("subcomponent-content");
        expect(subComponentContent.length).toBe(1);

        // Close that sub component
        subComponentExpandCollpase = getAllByTestId(
            "subComponent-header-expand-collapse"
        );
        act(() => {
            subComponentExpandCollpase[0].dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });
        // Check if that subComponent section is closed
        subComponentContent = gridContainer.querySelectorAll(
            "[data-testid='subcomponent-content']"
        );
        expect(subComponentContent.length).toBe(0);

        // Open expand/collapse from header
        let headerExpand = getByTestId(
            "subComponent-header-expand-collapse-all"
        );
        act(() => {
            headerExpand.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });
        // Check if subComponent sections are opened
        subComponentContent = getAllByTestId("subcomponent-content");
        expect(subComponentContent.length).toBeGreaterThan(1);

        // Close sub components from header
        headerExpand = getByTestId("subComponent-header-expand-collapse-all");
        act(() => {
            headerExpand.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });
        // Check if all subComponent sections are closed
        subComponentContent = gridContainer.querySelectorAll(
            "[data-testid='subcomponent-content']"
        );
        expect(subComponentContent.length).toBe(0);
    });

    it("test grid with sub component data without multi row selection", () => {
        mockOffsetSize(600, 600);
        const { container, getAllByTestId, getByTestId } = render(
            <Grid
                title={mockTitle}
                gridWidth={mockGridWidth}
                gridData={mockGridData}
                idAttribute="travelId"
                paginationType="index"
                loadMoreData={mockLoadMoreData}
                columns={gridColumns}
                columnToExpand={mockAdditionalColumn}
                subComponentColumnns={subComponentColumns}
                getRowInfo={mockGetRowInfo}
                rowActions={mockRowActions}
                multiRowSelection={false}
                onRowUpdate={mockUpdateRowData}
            />
        );
        const gridContainer = container;

        // Check if Grid id rendered.
        expect(gridContainer).toBeInTheDocument();

        // Check if expand/collapse icons are present
        let subComponentExpandCollpase = getAllByTestId(
            "subComponent-header-expand-collapse"
        );
        expect(subComponentExpandCollpase.length).toBeGreaterThan(0);

        // Open 1 subComponent
        act(() => {
            subComponentExpandCollpase[0].dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });
        // Check if subComponent section is opened
        let subComponentContent = getAllByTestId("subcomponent-content");
        expect(subComponentContent.length).toBe(1);

        // Close that sub component
        subComponentExpandCollpase = getAllByTestId(
            "subComponent-header-expand-collapse"
        );
        act(() => {
            subComponentExpandCollpase[0].dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });
        // Check if that subComponent section is closed
        subComponentContent = gridContainer.querySelectorAll(
            "[data-testid='subcomponent-content']"
        );
        expect(subComponentContent.length).toBe(0);

        // Open expand/collapse from header
        let headerExpand = getByTestId(
            "subComponent-header-expand-collapse-all"
        );
        act(() => {
            headerExpand.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });
        // Check if subComponent sections are opened
        subComponentContent = getAllByTestId("subcomponent-content");
        expect(subComponentContent.length).toBeGreaterThan(1);

        // Close sub components from header
        headerExpand = getByTestId("subComponent-header-expand-collapse-all");
        act(() => {
            headerExpand.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });
        // Check if all subComponent sections are closed
        subComponentContent = gridContainer.querySelectorAll(
            "[data-testid='subcomponent-content']"
        );
        expect(subComponentContent.length).toBe(0);
    });

    it("test grid with sub component data without expandable column and column to expand", () => {
        mockOffsetSize(600, 600);
        const { container, getAllByTestId, getByTestId } = render(
            <Grid
                title={mockTitle}
                gridWidth={mockGridWidth}
                gridData={mockGridData}
                idAttribute="travelId"
                paginationType="index"
                loadMoreData={mockLoadMoreData}
                columns={gridColumns}
                columnToExpand={mockAdditionalColumn}
                subComponentColumnns={subComponentColumns}
                getRowInfo={mockGetRowInfo}
                rowActions={mockRowActions}
                onRowUpdate={mockUpdateRowData}
                onRowSelect={mockSelectBulkData}
            />
        );
        const gridContainer = container;

        // Check if Grid id rendered.
        expect(gridContainer).toBeInTheDocument();

        // Check if expand/collapse icons are present
        let subComponentExpandCollpase = getAllByTestId(
            "subComponent-header-expand-collapse"
        );
        expect(subComponentExpandCollpase.length).toBeGreaterThan(0);

        // Open 1 subComponent
        act(() => {
            subComponentExpandCollpase[0].dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });
        // Check if subComponent section is opened
        let subComponentContent = getAllByTestId("subcomponent-content");
        expect(subComponentContent.length).toBe(1);

        // Close that sub component
        subComponentExpandCollpase = getAllByTestId(
            "subComponent-header-expand-collapse"
        );
        act(() => {
            subComponentExpandCollpase[0].dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });
        // Check if that subComponent section is closed
        subComponentContent = gridContainer.querySelectorAll(
            "[data-testid='subcomponent-content']"
        );
        expect(subComponentContent.length).toBe(0);

        // Open expand/collapse from header
        let headerExpand = getByTestId(
            "subComponent-header-expand-collapse-all"
        );
        act(() => {
            headerExpand.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });
        // Check if subComponent sections are opened
        subComponentContent = getAllByTestId("subcomponent-content");
        expect(subComponentContent.length).toBeGreaterThan(1);

        // Close sub components from header
        headerExpand = getByTestId("subComponent-header-expand-collapse-all");
        act(() => {
            headerExpand.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });
        // Check if all subComponent sections are closed
        subComponentContent = gridContainer.querySelectorAll(
            "[data-testid='subcomponent-content']"
        );
        expect(subComponentContent.length).toBe(0);
    });

    it("test grid with sub component data and sub component row wxpand and expandable column", () => {
        mockOffsetSize(600, 600);
        const { container, getAllByTestId, getByTestId } = render(
            <Grid
                title={mockTitle}
                gridWidth={mockGridWidth}
                gridData={mockGridData}
                idAttribute="travelId"
                paginationType="index"
                loadMoreData={mockLoadMoreData}
                columns={gridColumns}
                columnToExpand={mockAdditionalColumn}
                subComponentColumnns={subComponentColumns}
                subComponentColumnToExpand={mockSubComponentAdditionalColumn}
                getRowInfo={mockGetRowInfo}
                rowActions={mockRowActions}
                expandableColumn
                onRowUpdate={mockUpdateRowData}
            />
        );
        const gridContainer = container;

        // Check if Grid id rendered.
        expect(gridContainer).toBeInTheDocument();

        // Check if expand/collapse icons are present
        let subComponentExpandCollpase = getAllByTestId(
            "subComponent-header-expand-collapse"
        );
        expect(subComponentExpandCollpase.length).toBeGreaterThan(0);

        // Open 1 subComponent
        act(() => {
            subComponentExpandCollpase[0].dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });
        // Check if subComponent section is opened
        let subComponentContent = getAllByTestId("subcomponent-content");
        expect(subComponentContent.length).toBe(1);

        // Check if expand icon for sub component row is present
        let expandRow = getAllByTestId("subcontentrow_expandericon");
        expect(expandRow.length).toBeGreaterThan(0);

        // Open 1 subComponent row
        act(() => {
            expandRow[0].dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });
        // Check if subComponent row expand region is opened
        let subComponentRowExpandRegion = getAllByTestId(
            "subcontentrow_expandedregion"
        );
        expect(subComponentContent.length).toBe(1);

        // Close row expand region
        expandRow = getAllByTestId("subcontentrow_expandericon");
        act(() => {
            expandRow[0].dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });
        // Check if subComponent row expand region is closed
        subComponentRowExpandRegion = gridContainer.querySelectorAll(
            "[data-testid='subcontentrow_expandedregion']"
        );
        expect(subComponentRowExpandRegion.length).toBe(0);

        // Close that sub component
        subComponentExpandCollpase = getAllByTestId(
            "subComponent-header-expand-collapse"
        );
        act(() => {
            subComponentExpandCollpase[0].dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });
        // Check if that subComponent section is closed
        subComponentContent = gridContainer.querySelectorAll(
            "[data-testid='subcomponent-content']"
        );
        expect(subComponentContent.length).toBe(0);

        // Open expand/collapse from header
        let headerExpand = getByTestId(
            "subComponent-header-expand-collapse-all"
        );
        act(() => {
            headerExpand.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });
        // Check if subComponent sections are opened
        subComponentContent = getAllByTestId("subcomponent-content");
        expect(subComponentContent.length).toBeGreaterThan(1);

        // Close sub components from header
        headerExpand = getByTestId("subComponent-header-expand-collapse-all");
        act(() => {
            headerExpand.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });
        // Check if all subComponent sections are closed
        subComponentContent = gridContainer.querySelectorAll(
            "[data-testid='subcomponent-content']"
        );
        expect(subComponentContent.length).toBe(0);
    });

    it("test manage columns overlay grid with sub component data and sub component row wxpand", () => {
        mockOffsetSize(600, 600);
        const { container, getAllByTestId, getByTestId } = render(
            <Grid
                title={mockTitle}
                gridWidth={mockGridWidth}
                gridData={mockGridData}
                idAttribute="travelId"
                paginationType="index"
                loadMoreData={mockLoadMoreData}
                columns={gridColumns}
                columnToExpand={mockAdditionalColumn}
                subComponentColumnns={subComponentColumns}
                subComponentColumnToExpand={mockSubComponentAdditionalColumn}
                getRowInfo={mockGetRowInfo}
                rowActions={mockRowActions}
                onRowUpdate={mockUpdateRowData}
            />
        );
        const gridContainer = container;

        // Check if Grid id rendered.
        expect(gridContainer).toBeInTheDocument();

        // Open Column chooser overlay
        const columnChooserIcon = getByTestId("toggleManageColumnsOverlay");
        act(() => {
            columnChooserIcon.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });

        // Check if overlay is opened
        let columnChooserOverlayCount = getAllByTestId("managecolumnoverlay")
            .length;
        expect(columnChooserOverlayCount).toBe(1);

        // Check if parent columns section is present
        const parentColumnsListBox = getAllByTestId("columns-list-box");
        expect(parentColumnsListBox.length).toBeGreaterThan(0);

        // Check if parent additional column is present
        const parentAdditionalColumnBox = getAllByTestId(
            "additional-column-box"
        );
        expect(parentAdditionalColumnBox.length).toBeGreaterThan(0);

        // Check if child columns section is present
        const childColumnsListBox = getAllByTestId(
            "sub-component-columns-list-box"
        );
        expect(childColumnsListBox.length).toBeGreaterThan(0);

        // Check if parent additional column is present
        const childAdditionalColumnBox = getAllByTestId(
            "sub-component-additional-column-box"
        );
        expect(childAdditionalColumnBox.length).toBeGreaterThan(0);

        // Hide sub component column
        const subComponentColumn = getAllByTestId(
            "selectSingleSearchableSubComponentColumn"
        );
        expect(subComponentColumn[0].checked).toBeTruthy();
        fireEvent.click(subComponentColumn[0]);
        expect(subComponentColumn[0].checked).toBeFalsy();

        // Hide sub component expand region column
        expect(subComponentColumn[3].checked).toBeTruthy();
        fireEvent.click(subComponentColumn[3]);
        expect(subComponentColumn[3].checked).toBeFalsy();

        // Save changes
        const saveButton = getByTestId("save_columnsManage");
        act(() => {
            saveButton.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });

        // Check if overlay is closed
        columnChooserOverlayCount = gridContainer.querySelectorAll(
            "[data-testid='managecolumnoverlay']"
        ).length;
        expect(columnChooserOverlayCount).toBe(0);

        // Check if expand/collapse icons are present
        let subComponentExpandCollpase = getAllByTestId(
            "subComponent-header-expand-collapse"
        );
        expect(subComponentExpandCollpase.length).toBeGreaterThan(0);

        // Open 1 subComponent
        act(() => {
            subComponentExpandCollpase[0].dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });
        // Check if subComponent section is opened
        let subComponentContent = getAllByTestId("subcomponent-content");
        expect(subComponentContent.length).toBe(1);

        // Close that sub component
        subComponentExpandCollpase = getAllByTestId(
            "subComponent-header-expand-collapse"
        );
        act(() => {
            subComponentExpandCollpase[0].dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });
        // Check if that subComponent section is closed
        subComponentContent = gridContainer.querySelectorAll(
            "[data-testid='subcomponent-content']"
        );
        expect(subComponentContent.length).toBe(0);
    });
});
