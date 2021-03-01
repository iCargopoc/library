/* eslint-disable no-undef */
import React from "react";
import { render, cleanup, fireEvent, waitFor } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import "@testing-library/jest-dom/extend-expect";
/* eslint-disable no-unused-vars */
import regeneratorRuntime from "regenerator-runtime";
import Grid from "../src/index";

describe("render Index file ", () => {
    jest.setTimeout(30000);
    HTMLCanvasElement.prototype.getContext = () => {
        // return whatever getContext has to return
        return [];
    };
    global.URL.createObjectURL = jest.fn();

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

    let mockGridData = [
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
                    hawbId: 6001,
                    subCompUldPositions: [
                        {
                            subCompPosition: "L1",
                            subCompValue: "7/9"
                        },
                        {
                            subCompPosition: "Q1",
                            subCompValue: "9/3"
                        },
                        {
                            subCompPosition: "L6",
                            subCompValue: "8/4"
                        },
                        {
                            subCompPosition: "Q7",
                            subCompValue: "4/9"
                        }
                    ],
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
                    hawbId: 6002,
                    subCompUldPositions: [
                        {
                            subCompPosition: "L1",
                            subCompValue: "7/9"
                        },
                        {
                            subCompPosition: "Q1",
                            subCompValue: "9/3"
                        },
                        {
                            subCompPosition: "L6",
                            subCompValue: "8/4"
                        },
                        {
                            subCompPosition: "Q7",
                            subCompValue: "4/9"
                        }
                    ],
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
                    hawbId: 6003,
                    subCompUldPositions: [
                        {
                            subCompPosition: "L1",
                            subCompValue: "7/9"
                        },
                        {
                            subCompPosition: "Q1",
                            subCompValue: "9/3"
                        },
                        {
                            subCompPosition: "L6",
                            subCompValue: "8/4"
                        },
                        {
                            subCompPosition: "Q7",
                            subCompValue: "4/9"
                        }
                    ],
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
                    subCompUldPositions: [
                        {
                            subCompPosition: "L1",
                            subCompValue: "7/9"
                        },
                        {
                            subCompPosition: "Q1",
                            subCompValue: "9/3"
                        },
                        {
                            subCompPosition: "L6",
                            subCompValue: "8/4"
                        },
                        {
                            subCompPosition: "Q7",
                            subCompValue: "4/9"
                        }
                    ],
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
                    subCompUldPositions: [
                        {
                            subCompPosition: "L1",
                            subCompValue: "7/9"
                        },
                        {
                            subCompPosition: "Q1",
                            subCompValue: "9/3"
                        },
                        {
                            subCompPosition: "L6",
                            subCompValue: "8/4"
                        },
                        {
                            subCompPosition: "Q7",
                            subCompValue: "4/9"
                        }
                    ],
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
                    subCompUldPositions: [
                        {
                            subCompPosition: "L1",
                            subCompValue: "7/9"
                        },
                        {
                            subCompPosition: "Q1",
                            subCompValue: "9/3"
                        },
                        {
                            subCompPosition: "L6",
                            subCompValue: "8/4"
                        },
                        {
                            subCompPosition: "Q7",
                            subCompValue: "4/9"
                        }
                    ],
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
    mockGridData = mockGridData.map((data, index) => {
        const updatedData = { ...data };
        if (index !== 0 && index % 4 === 0) {
            delete updatedData.subComponentData;
        }
        return updatedData;
    });

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
            groupHeader: "Other Details",
            Header: "HAWB No",
            accessor: "hawbId",
            width: 250,
            isSortable: true,
            isSearchable: true,
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
            Header: "Sub Comp ULD Positions",
            accessor: "subCompUldPositions",
            width: 120,
            innerCells: [
                {
                    Header: "Sub Comp Position",
                    accessor: "subCompPosition"
                },
                {
                    Header: "Sub Comp Value",
                    accessor: "subCompValue"
                }
            ],
            displayCell: (rowData, DisplayTag) => {
                const { subCompUldPositions } = rowData;
                return (
                    <div className="uld-details">
                        <ul>
                            {subCompUldPositions.map((positions, index) => {
                                return (
                                    <li key={index}>
                                        <DisplayTag
                                            columnKey="subCompUldPositions"
                                            cellKey="subCompPosition"
                                        >
                                            <span>
                                                {positions.subCompPosition}
                                            </span>
                                        </DisplayTag>
                                        <DisplayTag
                                            columnKey="subCompUldPositions"
                                            cellKey="subCompValue"
                                        >
                                            <strong>
                                                {positions.subCompValue}
                                            </strong>
                                        </DisplayTag>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                );
            }
        },
        {
            groupHeader: "Other Details",
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
            title: "SCR Details",
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
        innerCells: [
            { Header: "Remarks", accessor: "remarks" },
            {
                Header: "sub Comp Uld Positions Additional",
                accessor: "subCompUldPositions"
            },
            {
                Header: "sub Comp scr Additional",
                accessor: "scr"
            }
        ],
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
                rowActions={mockRowActions}
                onRowUpdate={mockUpdateRowData}
                onRowSelect={mockSelectBulkData}
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

        // Close overlay
        const closeButton = getByTestId("cancel_columnsManage");
        act(() => {
            closeButton.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });

        // Check if overlay is closed
        columnChooserOverlayCount = gridContainer.querySelectorAll(
            "[data-testid='managecolumnoverlay']"
        ).length;
        expect(columnChooserOverlayCount).toBe(0);

        // Open export overlay
        const exportDataIcon = getByTestId("toggleExportDataOverlay");
        act(() => {
            exportDataIcon.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });

        // Check if overlay is opened
        let exportDataOverlayCount = getAllByTestId("exportoverlay").length;
        expect(exportDataOverlayCount).toBe(1);

        // Close overlay
        const closeExportButton = getByTestId("cancel_button");
        act(() => {
            closeExportButton.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });

        // Check if overlay is closed
        exportDataOverlayCount = gridContainer.querySelectorAll(
            "[data-testid='exportoverlay']"
        ).length;
        expect(exportDataOverlayCount).toBe(0);

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

    it("test manage columns overlay grid with sub component data and sub component row expand", () => {
        const createBubbledEvent = (type, props = {}) => {
            const event = new Event(type, { bubbles: true });
            Object.assign(event, props);
            return event;
        };
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
        let columnChooserIcon = getByTestId("toggleManageColumnsOverlay");
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
        let saveButton = getByTestId("save_columnsManage");
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

        // Open overlay again
        columnChooserIcon = getByTestId("toggleManageColumnsOverlay");
        act(() => {
            columnChooserIcon.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });

        // Check if overlay is opened
        columnChooserOverlayCount = getAllByTestId("managecolumnoverlay")
            .length;
        expect(columnChooserOverlayCount).toBe(1);

        // Reset current changes
        let resetButton = getByTestId("reset_columnsManage");
        act(() => {
            resetButton.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });

        // Hide sub component column Inner cell with group header
        const subComponentInnerCell = getAllByTestId(
            "selectInnerCell_subComponentColumn_1_subComponentColumn_1_cell_0"
        );
        expect(subComponentInnerCell.length).toBeGreaterThan(0);
        expect(subComponentInnerCell[0].checked).toBeTruthy();
        fireEvent.click(subComponentInnerCell[0]);
        expect(subComponentInnerCell[0].checked).toBeFalsy();

        // Hide sub component column Inner cell with group header
        const subComponentInnerCell2 = getAllByTestId(
            "selectInnerCell_subComponentColumn_2_subComponentColumn_2_cell_0"
        );
        expect(subComponentInnerCell2[0].checked).toBeTruthy();
        fireEvent.click(subComponentInnerCell2[0]);
        expect(subComponentInnerCell2[0].checked).toBeFalsy();

        // Hide sub component column Inner cell
        const subComponentAdditionalColumnInnerCell = getAllByTestId(
            "selectSubComponentInnerCell_subComponentRowExpand_subComponentRowExpand_cell_0"
        );
        expect(subComponentAdditionalColumnInnerCell.length).toBeGreaterThan(0);
        expect(subComponentAdditionalColumnInnerCell[0].checked).toBeTruthy();
        fireEvent.click(subComponentAdditionalColumnInnerCell[0]);
        expect(subComponentAdditionalColumnInnerCell[0].checked).toBeFalsy();

        // Drag and Drop boxes
        const columnDnds = getAllByTestId("subcomponentcolumnItemDnd");
        expect(columnDnds).toHaveLength(3);
        const firstNode = columnDnds[0];
        const lastNode = columnDnds[1];

        // Do drag and drop from 0 to 1
        act(() => {
            firstNode.dispatchEvent(
                createBubbledEvent("dragstart", { clientX: 0, clientY: 0 })
            );
        });
        act(() => {
            lastNode.dispatchEvent(
                createBubbledEvent("drop", { clientX: 50, clientY: 50 })
            );
        });

        // Save changes
        saveButton = getByTestId("save_columnsManage");
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

        // Open overlay again
        columnChooserIcon = getByTestId("toggleManageColumnsOverlay");
        act(() => {
            columnChooserIcon.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });

        // Check if overlay is opened
        columnChooserOverlayCount = getAllByTestId("managecolumnoverlay")
            .length;
        expect(columnChooserOverlayCount).toBe(1);

        // Reset current changes
        resetButton = getByTestId("reset_columnsManage");
        act(() => {
            resetButton.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });

        // Un select all sub component checkboxes
        const chkAllSubComponentColumn = getAllByTestId(
            "selectAllSearchableSubComponentColumns"
        );
        expect(chkAllSubComponentColumn.length).toBeGreaterThan(0);
        expect(chkAllSubComponentColumn[0].checked).toBeTruthy();
        fireEvent.click(chkAllSubComponentColumn[0]);
        expect(chkAllSubComponentColumn[0].checked).toBeFalsy();

        // Save changes
        saveButton = getByTestId("save_columnsManage");
        act(() => {
            saveButton.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });

        // Check if error message is present
        const errorMessages = getAllByTestId("column-chooser-error");
        expect(errorMessages.length).toBe(1);

        // Reset current changes
        resetButton = getByTestId("reset_columnsManage");
        act(() => {
            resetButton.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });

        // Check count of sub component columns
        let subComponentColumnsCheckboxes = getAllByTestId(
            "selectSingleSearchableSubComponentColumn"
        );
        expect(subComponentColumnsCheckboxes.length).toBe(5);

        // Filter columns
        const filterList = getByTestId("filterColumnsList");
        expect(filterList.value).toBe("");
        fireEvent.change(filterList, { target: { value: "de" } });
        expect(filterList.value).toBe("de");

        // Check count of sub component columns
        subComponentColumnsCheckboxes = getAllByTestId(
            "selectSingleSearchableSubComponentColumn"
        );
        expect(subComponentColumnsCheckboxes.length).toBe(2);

        // Remove searched value
        fireEvent.change(filterList, { target: { value: "" } });
        expect(filterList.value).toBe("");

        // Check count of sub component columns
        subComponentColumnsCheckboxes = getAllByTestId(
            "selectSingleSearchableSubComponentColumn"
        );
        expect(subComponentColumnsCheckboxes.length).toBe(5);

        // Close overlay
        const closeButton = getByTestId("cancel_columnsManage");
        act(() => {
            closeButton.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });

        // Check if overlay is closed
        columnChooserOverlayCount = gridContainer.querySelectorAll(
            "[data-testid='managecolumnoverlay']"
        ).length;
        expect(columnChooserOverlayCount).toBe(0);
    });

    it("test export overlay grid with sub component data and sub component row expand", () => {
        mockOffsetSize(600, 600);
        const { container, getAllByTestId, getByTestId, getAllByText } = render(
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

        // Open export overlay
        const exportDataIcon = getByTestId("toggleExportDataOverlay");
        act(() => {
            exportDataIcon.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });

        // Check if overlay is opened
        const exportDataOverlayCount = getAllByTestId("exportoverlay").length;
        expect(exportDataOverlayCount).toBe(1);

        // Check if child column check boxes are present
        const childColumnCheckboxes = getAllByTestId(
            "selectSingleSearchableSubComponentColumn"
        );
        const childColumnCheckboxesLength = childColumnCheckboxes.length;
        expect(childColumnCheckboxesLength).toBe(5);

        // Un-check first column
        expect(childColumnCheckboxes[0].checked).toBeTruthy();
        fireEvent.click(childColumnCheckboxes[0]);
        expect(childColumnCheckboxes[0].checked).toBeFalsy();

        // Un-check last column
        expect(
            childColumnCheckboxes[childColumnCheckboxesLength - 1].checked
        ).toBeTruthy();
        fireEvent.click(childColumnCheckboxes[childColumnCheckboxesLength - 1]);
        expect(
            childColumnCheckboxes[childColumnCheckboxesLength - 1].checked
        ).toBeFalsy();

        // Re-check first column
        expect(childColumnCheckboxes[0].checked).toBeFalsy();
        fireEvent.click(childColumnCheckboxes[0]);
        expect(childColumnCheckboxes[0].checked).toBeTruthy();

        // Re-check last column
        expect(
            childColumnCheckboxes[childColumnCheckboxesLength - 1].checked
        ).toBeFalsy();
        fireEvent.click(childColumnCheckboxes[childColumnCheckboxesLength - 1]);
        expect(
            childColumnCheckboxes[childColumnCheckboxesLength - 1].checked
        ).toBeTruthy();

        // Un-check all sub component columns
        let allSubComponentColumns = getAllByTestId(
            "selectAllSearchableSubComponentColumns"
        );
        expect(allSubComponentColumns[0].checked).toBeTruthy();
        fireEvent.click(allSubComponentColumns[0]);
        expect(allSubComponentColumns[0].checked).toBeFalsy();

        // Try to export data
        let exportButton = getByTestId("export_button");
        act(() => {
            exportButton.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });

        // Check for error
        const errorMessage = getAllByText(
            "Select at least one sub component column"
        );
        expect(errorMessage.length).toBe(1);

        // Re-check all sub component columns
        allSubComponentColumns = getAllByTestId(
            "selectAllSearchableSubComponentColumns"
        );
        expect(allSubComponentColumns[0].checked).toBeFalsy();
        fireEvent.click(allSubComponentColumns[0]);
        expect(allSubComponentColumns[0].checked).toBeTruthy();

        // Select excel
        const selectExcel = getByTestId("chk_excel_test");
        expect(selectExcel.checked).toEqual(false);
        fireEvent.click(selectExcel);
        expect(selectExcel.checked).toEqual(true);

        // Try to export data
        exportButton = getByTestId("export_button");
        act(() => {
            exportButton.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });
    });

    it("test group sort overlay grid with sub component data and sub component row expand", () => {
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
                subComponentColumnns={subComponentColumns}
                getRowInfo={mockGetRowInfo}
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

        // Check Group sort Icon
        const groupSortIcon = getAllByTestId("toggleGroupSortOverLay");
        expect(groupSortIcon.length).toBe(1);

        // Open Group sort Icon
        act(() => {
            groupSortIcon[0].dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });

        // Add sort option
        let addSortLink = getByTestId("addSort");
        act(() => {
            addSortLink.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });

        // Change sortby option to the first sort option
        const sortBySelect = getAllByTestId("groupSort-sortBy")[0];
        fireEvent.change(sortBySelect, {
            target: { value: "hawbId" }
        });

        // Change sort order
        const sortOrderSelect = getAllByTestId("groupSort-order")[0];
        fireEvent.change(sortOrderSelect, {
            target: { value: "Descending" }
        });

        // Add one more sort option
        addSortLink = getByTestId("addSort");
        act(() => {
            addSortLink.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });

        // Change sortby option to the first sort option
        const newSortBySelect = getAllByTestId("groupSort-sortBy")[1];
        fireEvent.change(newSortBySelect, {
            target: { value: "scr" }
        });

        // Apply sort
        const applySortButton = getByTestId("saveSort");
        act(() => {
            applySortButton.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });

        // Sort overlay should have been closed
        const groupSortOverlay = gridContainer.querySelectorAll(
            "[data-testid='groupsortoverlay']"
        );
        expect(groupSortOverlay.length).toBe(0);
    });

    it("test global filter in Grid with sub component data and sub component row expand", async () => {
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

        // Check total rows count
        expect(getAllByTestId("gridrow").length).toBeGreaterThan(1);

        // Global Filter Search with invalid value "60"
        let input = getByTestId("globalFilter-textbox");
        expect(input.value).toBe("");
        fireEvent.change(input, { target: { value: "6001" } });
        expect(input.value).toBe("6001");

        // There should not be any records
        await waitFor(() => expect(getAllByTestId("gridrow").length).toBe(1));

        // Clear filter value "asd"
        input = getByTestId("globalFilter-textbox");
        expect(input.value).toBe("6001");
        fireEvent.change(input, { target: { value: "" } });
        expect(input.value).toBe("");

        // Rows should be present
        await waitFor(() =>
            expect(getAllByTestId("gridrow").length).toBeGreaterThan(1)
        );
    });
});
