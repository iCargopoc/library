/* eslint-disable no-undef */
import React from "react";
import { render, cleanup, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { act } from "react-dom/test-utils";
import Grid from "../src/index";

describe("Column manage functionality test", () => {
    const mockOffsetSize = (width, height, scrollHeight) => {
        Object.defineProperty(HTMLElement.prototype, "offsetHeight", {
            configurable: true,
            value: height
        });
        Object.defineProperty(HTMLElement.prototype, "scrollHeight", {
            configurable: true,
            value: scrollHeight
        });
        Object.defineProperty(HTMLElement.prototype, "offsetWidth", {
            configurable: true,
            value: width
        });
    };

    const getColumns = (mockFlightEdit) => {
        return [
            {
                Header: "Null column"
            },
            {
                Header: "Null column cell",
                innerCells: [
                    {
                        Header: "Null cell"
                    }
                ]
            },
            {
                Header: "Id",
                accessor: "travelId",
                width: 50,
                isSortable: true,
                displayCell: (
                    rowData,
                    DisplayTag,
                    isDesktop,
                    isExpandableColumn
                ) => {
                    const { travelId } = rowData;
                    if (travelId !== null && travelId !== undefined) {
                        return (
                            <div
                                className="travelId-details"
                                data-testid="cell-travelid"
                            >
                                <span>{travelId}</span>
                            </div>
                        );
                    }
                    return null;
                }
            },
            {
                groupHeader: "Flight & Segment",
                Header: () => {
                    return (
                        <div
                            className="flightHeader"
                            data-testid="header-flight"
                        >
                            <span className="flightText">Info</span>
                        </div>
                    );
                },
                title: "Flight",
                accessor: "flight",
                width: 100,
                widthGrow: 1,
                isSortable: true,
                innerCells: [
                    {
                        Header: "Flight No",
                        accessor: "flightno",
                        isSortable: true
                    },
                    {
                        Header: "Date",
                        accessor: "date"
                    }
                ],
                sortValue: "flightno",
                displayCell: (
                    rowData,
                    DisplayTag,
                    isDesktop,
                    isExpandableColumn
                ) => {
                    if (rowData.flight) {
                        const { flightno, date } = rowData.flight;
                        return (
                            <div
                                className="flight-details"
                                data-testid="cell-flight"
                            >
                                <DisplayTag
                                    columnKey="flight"
                                    cellKey="flightno"
                                >
                                    <strong>{flightno}</strong>
                                </DisplayTag>
                                <DisplayTag columnKey="flight" cellKey="date">
                                    <span>{date}</span>
                                </DisplayTag>
                            </div>
                        );
                    }
                    return null;
                },
                editCell: mockFlightEdit
            },
            {
                groupHeader: "Flight & Segment",
                Header: "Segment",
                accessor: "segment",
                width: 100,
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
                    }
                ],
                disableSortBy: true,
                displayCell: (
                    rowData,
                    DisplayTag,
                    isDesktop,
                    isExpandableColumn
                ) => {
                    if (rowData.segment) {
                        const { from, to } = rowData.segment;
                        return (
                            <div
                                className="segment-details"
                                data-testid="cell-segment"
                            >
                                <DisplayTag columnKey="segment" cellKey="from">
                                    <span>{from}</span>
                                </DisplayTag>
                                <DisplayTag columnKey="segment" cellKey="to">
                                    <span>{to}</span>
                                </DisplayTag>
                            </div>
                        );
                    }
                    return null;
                }
            },
            {
                Header: "Details",
                accessor: "details",
                onlyInDesktop: true,
                width: 300,
                innerCells: [
                    {
                        Header: "Flight Model",
                        accessor: "flightModel"
                    },
                    {
                        Header: "Body Type",
                        accessor: "bodyType"
                    },
                    {
                        Header: "Type",
                        accessor: "type"
                    },
                    {
                        Header: "Start Time",
                        accessor: "startTime"
                    },
                    {
                        Header: "End Time",
                        accessor: "endTime"
                    },
                    {
                        Header: "Status",
                        accessor: "status"
                    },
                    {
                        Header: "Additional Status",
                        accessor: "additionalStatus"
                    },
                    {
                        Header: "Time Status",
                        accessor: "timeStatus"
                    }
                ],
                disableSortBy: true,
                displayCell: (
                    rowData,
                    DisplayTag,
                    isDesktop,
                    isExpandableColumn
                ) => {
                    if (rowData.details) {
                        const {
                            startTime,
                            endTime,
                            status,
                            additionalStatus,
                            flightModel,
                            bodyType,
                            type,
                            timeStatus
                        } = rowData.details;
                        const timeStatusArray = timeStatus
                            ? timeStatus.split(" ")
                            : [];
                        const timeValue = timeStatusArray.shift();
                        const timeText = timeStatusArray.join(" ");
                        if (
                            isExpandableColumn === null ||
                            isExpandableColumn === true
                        ) {
                            return (
                                <div
                                    className="details-wrap"
                                    data-testid="cell-details-fullData"
                                >
                                    <ul>
                                        <li>
                                            <DisplayTag
                                                columnKey="details"
                                                cellKey="startTime"
                                            >
                                                {startTime}
                                            </DisplayTag>
                                            -
                                            <DisplayTag
                                                columnKey="details"
                                                cellKey="endTime"
                                            >
                                                {endTime}
                                            </DisplayTag>
                                        </li>
                                        <li className="divider">|</li>
                                        <li>
                                            <DisplayTag
                                                columnKey="details"
                                                cellKey="status"
                                            >
                                                <span>{status}</span>
                                            </DisplayTag>
                                        </li>
                                        <li className="divider">|</li>
                                        <li>
                                            <DisplayTag
                                                columnKey="details"
                                                cellKey="additionalStatus"
                                            >
                                                {additionalStatus}
                                            </DisplayTag>
                                        </li>
                                        <li className="divider">|</li>
                                        <li>
                                            <DisplayTag
                                                columnKey="details"
                                                cellKey="flightModel"
                                            >
                                                {flightModel}
                                            </DisplayTag>
                                        </li>
                                        <li className="divider">|</li>
                                        <li>
                                            <DisplayTag
                                                columnKey="details"
                                                cellKey="bodyType"
                                            >
                                                {bodyType}
                                            </DisplayTag>
                                        </li>
                                        <li className="divider">|</li>
                                        <li>
                                            <span>
                                                <DisplayTag
                                                    columnKey="details"
                                                    cellKey="type"
                                                >
                                                    {type}
                                                </DisplayTag>
                                            </span>
                                        </li>
                                        <li className="divider">|</li>
                                        <li>
                                            <DisplayTag
                                                columnKey="details"
                                                cellKey="timeStatus"
                                            >
                                                <strong>{timeValue} </strong>
                                                <span>{timeText}</span>
                                            </DisplayTag>
                                        </li>
                                    </ul>
                                </div>
                            );
                        }
                        return (
                            <div
                                className="details-wrap"
                                data-testid="cell-details-smallData"
                            >
                                <ul>
                                    <li>
                                        <DisplayTag
                                            columnKey="details"
                                            cellKey="startTime"
                                        >
                                            {startTime}
                                        </DisplayTag>
                                        -
                                        <DisplayTag
                                            columnKey="details"
                                            cellKey="endTime"
                                        >
                                            {endTime}
                                        </DisplayTag>
                                    </li>
                                    <li className="divider">|</li>
                                    <li>
                                        <DisplayTag
                                            columnKey="details"
                                            cellKey="status"
                                        >
                                            <span>{status}</span>
                                        </DisplayTag>
                                    </li>
                                    <li className="divider">|</li>
                                    <li>
                                        <DisplayTag
                                            columnKey="details"
                                            cellKey="flightModel"
                                        >
                                            {flightModel}
                                        </DisplayTag>
                                    </li>
                                    <li className="divider">|</li>
                                    <li>
                                        <DisplayTag
                                            columnKey="details"
                                            cellKey="bodyType"
                                        >
                                            {bodyType}
                                        </DisplayTag>
                                    </li>
                                    <li className="divider">|</li>
                                    <li>
                                        <span>
                                            <DisplayTag
                                                columnKey="details"
                                                cellKey="type"
                                            >
                                                {type}
                                            </DisplayTag>
                                        </span>
                                    </li>
                                    <li className="divider">|</li>
                                    <li>
                                        <DisplayTag
                                            columnKey="details"
                                            cellKey="timeStatus"
                                        >
                                            <strong>{timeValue} </strong>
                                            <span>{timeText}</span>
                                        </DisplayTag>
                                    </li>
                                </ul>
                            </div>
                        );
                    }
                    return null;
                }
            },
            {
                Header: "Weight",
                accessor: "weight",
                width: 130,
                widthGrow: 2,
                isSortable: true,
                innerCells: [
                    {
                        Header: "Percentage",
                        accessor: "percentage",
                        isSortable: true
                    },
                    {
                        Header: "Value",
                        accessor: "value",
                        isSortable: true
                    }
                ],
                sortValue: "percentage",
                displayCell: (
                    rowData,
                    DisplayTag,
                    isDesktop,
                    isExpandableColumn
                ) => {
                    if (rowData.weight) {
                        const { percentage, value } = rowData.weight;
                        const splitValue = value ? value.split("/") : [];
                        let valuePrefix;
                        let valueSuffix = "";
                        if (splitValue.length === 2) {
                            valuePrefix = splitValue[0];
                            valueSuffix = splitValue[1];
                        }
                        return (
                            <div
                                className="weight-details"
                                data-testid="cell-weight"
                            >
                                <DisplayTag
                                    columnKey="weight"
                                    cellKey="percentage"
                                >
                                    <strong className="per">
                                        {percentage}
                                    </strong>
                                </DisplayTag>
                                <DisplayTag columnKey="weight" cellKey="value">
                                    <span>
                                        <strong>{valuePrefix}/</strong>
                                        {valueSuffix}
                                    </span>
                                </DisplayTag>
                            </div>
                        );
                    }
                    return null;
                }
            },
            {
                Header: "Volume",
                accessor: "volume",
                width: 100,
                isSortable: true,
                innerCells: [
                    {
                        Header: "Percentage",
                        accessor: "percentage"
                    },
                    {
                        Header: "Value",
                        accessor: "value"
                    }
                ],
                sortValue: "percentage",
                displayCell: (
                    rowData,
                    DisplayTag,
                    isDesktop,
                    isExpandableColumn
                ) => {
                    if (rowData.volume) {
                        const { percentage, value } = rowData.volume;
                        const splitValue = value ? value.split("/") : [];
                        let valuePrefix;
                        let valueSuffix = "";
                        if (splitValue.length === 2) {
                            valuePrefix = splitValue[0];
                            valueSuffix = splitValue[1];
                        }
                        return (
                            <div
                                className="weight-details"
                                data-testid="cell-volume"
                            >
                                <DisplayTag
                                    columnKey="volume"
                                    cellKey="percentage"
                                >
                                    <strong className="per">
                                        {percentage}
                                    </strong>
                                </DisplayTag>
                                <DisplayTag columnKey="volume" cellKey="value">
                                    <span>
                                        <strong>{valuePrefix}/</strong>
                                        {valueSuffix}
                                    </span>
                                </DisplayTag>
                            </div>
                        );
                    }
                    return null;
                }
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
                displayCell: (
                    rowData,
                    DisplayTag,
                    isDesktop,
                    isExpandableColumn
                ) => {
                    const { uldPositions } = rowData;
                    if (uldPositions) {
                        return (
                            <div
                                className="uld-details"
                                data-testid="cell-uldPositions"
                            >
                                <ul>
                                    {uldPositions.map((positions, index) => {
                                        const { position, value } = positions;
                                        return (
                                            <li key={index}>
                                                <DisplayTag
                                                    columnKey="uldPositions"
                                                    cellKey="position"
                                                >
                                                    <span>
                                                        {positions.position}
                                                    </span>
                                                </DisplayTag>
                                                <DisplayTag
                                                    columnKey="uldPositions"
                                                    cellKey="value"
                                                >
                                                    <strong>
                                                        {positions.value}
                                                    </strong>
                                                </DisplayTag>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        );
                    }
                    return null;
                }
            },
            {
                Header: "Revenue/Yield",
                accessor: "revenue",
                width: 120,
                innerCells: [
                    {
                        Header: "Revenue",
                        accessor: "revenue"
                    },
                    {
                        Header: "Yeild",
                        accessor: "yeild"
                    }
                ],
                displayCell: (
                    rowData,
                    DisplayTag,
                    isDesktop,
                    isExpandableColumn
                ) => {
                    if (rowData.revenue) {
                        const { revenue, yeild } = rowData.revenue;
                        return (
                            <div
                                className="revenue-details"
                                data-testid="cell-revenue"
                            >
                                <DisplayTag
                                    columnKey="revenue"
                                    cellKey="revenue"
                                >
                                    <span className="large">{revenue}</span>
                                </DisplayTag>
                                <DisplayTag columnKey="revenue" cellKey="yeild">
                                    <span>{yeild}</span>
                                </DisplayTag>
                            </div>
                        );
                    }
                    return null;
                },
                sortValue: "revenue"
            },
            {
                Header: "SR",
                accessor: "sr",
                width: 90,
                isSortable: true,
                displayCell: (
                    rowData,
                    DisplayTag,
                    isDesktop,
                    isExpandableColumn
                ) => {
                    const { sr } = rowData;
                    if (sr) {
                        return (
                            <div className="sr-details" data-testid="cell-sr">
                                <span>{sr}</span>
                            </div>
                        );
                    }
                    return null;
                }
            },
            {
                Header: "Queued Booking",
                accessor: "queuedBooking",
                innerCells: [
                    {
                        Header: "Sr",
                        accessor: "sr"
                    },
                    {
                        Header: "Volume",
                        accessor: "volume"
                    }
                ],
                disableSortBy: true,
                displayCell: (
                    rowData,
                    DisplayTag,
                    isDesktop,
                    isExpandableColumn
                ) => {
                    if (rowData.queuedBooking) {
                        const { sr, volume } = rowData.queuedBooking;
                        return (
                            <div
                                className="queued-details"
                                data-testid="cell-queuedbooking"
                            >
                                <DisplayTag
                                    columnKey="queuedBooking"
                                    cellKey="sr"
                                >
                                    <span>
                                        <strong>{sr}</strong>
                                    </span>
                                </DisplayTag>
                                <DisplayTag
                                    columnKey="queuedBooking"
                                    cellKey="volume"
                                >
                                    <span>
                                        <strong>{volume}</strong>
                                    </span>
                                </DisplayTag>
                            </div>
                        );
                    }
                    return null;
                }
            }
        ];
    };

    const getColumnToExpand = () => {
        return {
            Header: "Remarks",
            innerCells: [
                { Header: "Remarks", accessor: "remarks" },
                { Header: "Details", onlyInTablet: true, accessor: "details" }
            ],
            displayCell: (rowData, DisplayTag, isDesktop) => {
                const { remarks, details } = rowData;
                const {
                    startTime,
                    endTime,
                    status,
                    additionalStatus,
                    flightModel,
                    bodyType,
                    type,
                    timeStatus
                } = details || {};
                const timeStatusArray = timeStatus ? timeStatus.split(" ") : [];
                const timeValue = timeStatusArray.shift();
                const timeText = timeStatusArray.join(" ");
                return (
                    <div
                        className="remarks-wrap details-wrap"
                        data-testid="expandcell"
                    >
                        <DisplayTag columnKey="remarks" cellKey="remarks">
                            <ul>
                                <li>{remarks}</li>
                            </ul>
                        </DisplayTag>
                        <DisplayTag columnKey="details" cellKey="details">
                            <ul>
                                <li>
                                    {startTime} - {endTime}
                                </li>
                                <li className="divider">|</li>
                                <li>
                                    <span>{status}</span>
                                </li>
                                <li className="divider">|</li>
                                <li>{additionalStatus}</li>
                                <li className="divider">|</li>
                                <li>{flightModel}</li>
                                <li className="divider">|</li>
                                <li>{bodyType}</li>
                                <li className="divider">|</li>
                                <li>
                                    <span>{type}</span>
                                </li>
                                <li className="divider">|</li>
                                <li>
                                    <strong>{timeValue} </strong>
                                    <span>{timeText}</span>
                                </li>
                            </ul>
                        </DisplayTag>
                    </div>
                );
            }
        };
    };

    const getGridData = () => {
        // Data with Null and Undefined values
        const newResult = [
            {
                travelId: null,
                flight: null,
                segment: {
                    from: null,
                    to: null
                },
                details: {
                    flightModel: null,
                    bodyType: null,
                    type: null,
                    startTime: null,
                    endTime: null,
                    status: null,
                    additionalStatus: null,
                    timeStatus: null
                },
                weight: {
                    percentage: null,
                    value: null
                },
                volume: {
                    percentage: null,
                    value: null
                },
                uldPositions: [
                    {
                        position: null,
                        value: null
                    },
                    {
                        position: null,
                        value: null
                    },
                    {
                        position: null,
                        value: null
                    },
                    {
                        position: null,
                        value: null
                    }
                ],
                revenue: {
                    revenue: null,
                    yeild: null
                },
                sr: null,
                queuedBooking: {
                    sr: null,
                    volume: null
                },
                remarks: null
            },
            {
                travelId: undefined,
                flight: undefined,
                segment: {
                    from: undefined,
                    to: undefined
                },
                details: {
                    flightModel: undefined,
                    bodyType: undefined,
                    type: undefined,
                    startTime: undefined,
                    endTime: undefined,
                    status: undefined,
                    additionalStatus: undefined,
                    timeStatus: undefined
                },
                weight: {
                    percentage: undefined,
                    value: undefined
                },
                volume: {
                    percentage: undefined,
                    value: undefined
                },
                uldPositions: [
                    {
                        position: undefined,
                        value: undefined
                    },
                    {
                        position: undefined,
                        value: undefined
                    },
                    {
                        position: undefined,
                        value: undefined
                    },
                    {
                        position: undefined,
                        value: undefined
                    }
                ],
                revenue: {
                    revenue: undefined,
                    yeild: undefined
                },
                sr: undefined,
                queuedBooking: {
                    sr: undefined,
                    volume: undefined
                },
                remarks: undefined
            }
        ];
        // Data with valid values
        const data = [];
        for (let i = 0; i < 50; i++) {
            data.push({
                travelId: i,
                flight: {
                    flightno: Math.ceil(1000 + Math.random() * (9999 - 1000)),
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
        return [...newResult, ...data];
    };

    const mockGridColumnsForWidthGrow = [...getColumns()];
    mockGridColumnsForWidthGrow.splice(5, 0, {
        groupHeader: "Flight & Segment",
        Header: "Sample column",
        accessor: "remarks",
        disableSortBy: true,
        displayCell: (rowData, DisplayTag, isDesktop, isExpandableColumn) => {
            return <p>Remarks</p>;
        }
    });
    const mockAdditionalColumn = getColumnToExpand();
    const mockData = getGridData();

    afterEach(cleanup);
    let mockContainer;
    beforeAll(() => {
        mockContainer = document.createElement("div");
        document.body.appendChild(mockContainer);
    });

    it("test width grow", () => {
        mockOffsetSize(1280, 1024);
        const { container, getByTestId, getAllByTestId } = render(
            <Grid
                gridData={mockData}
                idAttribute="travelId"
                columns={mockGridColumnsForWidthGrow}
                columnToExpand={mockAdditionalColumn}
            />
        );
        const gridContainer = container;
        // Check if grid has been loaded
        expect(gridContainer).toBeInTheDocument();

        // Check width of flight, weight and volume columns
        let flightColumnWidth = gridContainer.querySelectorAll(
            "[data-testid='grid-header']"
        )[4];
        let weightColumnWidth = gridContainer.querySelectorAll(
            "[data-testid='grid-header']"
        )[7];
        let volumeColumnWidth = gridContainer.querySelectorAll(
            "[data-testid='grid-header']"
        )[8];
        expect(flightColumnWidth.style.width).toBe("100px");
        expect(weightColumnWidth.style.width).toBe("130px");
        expect(volumeColumnWidth.style.width).toBe("100px");

        // Open Column chooser overlay
        let columnChooserIcon = getByTestId("toggleManageColumnsOverlay");
        act(() => {
            columnChooserIcon.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });

        // Un check Id column checkbox
        const idCheckbox = getAllByTestId("selectSingleSearchableColumn")[2];
        fireEvent.click(idCheckbox);

        // Un check Segment column checkbox (Another one from grouped columns)
        const segmentCheckbox = getAllByTestId(
            "selectSingleSearchableColumn"
        )[4];
        fireEvent.click(segmentCheckbox);

        // Apply changes
        let saveButton = getByTestId("save_columnsManage");
        act(() => {
            saveButton.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });

        // Width of flight and weight columns should increase (because of widthGrow) and width of volume column should not increase
        flightColumnWidth = gridContainer.querySelectorAll(
            "[data-testid='grid-header']"
        )[3];
        weightColumnWidth = gridContainer.querySelectorAll(
            "[data-testid='grid-header']"
        )[5];
        volumeColumnWidth = gridContainer.querySelectorAll(
            "[data-testid='grid-header']"
        )[6];
        expect(flightColumnWidth.style.width).toBe("150px");
        expect(weightColumnWidth.style.width).toBe("230px");
        expect(volumeColumnWidth.style.width).toBe("100px");

        // Open Column chooser overlay again
        columnChooserIcon = getByTestId("toggleManageColumnsOverlay");
        act(() => {
            columnChooserIcon.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });

        // Un-check Sample column - which doesn't have width specified in group columns
        const sampleColumnCheckbox = getAllByTestId(
            "selectSingleSearchableColumn"
        )[5];
        fireEvent.click(sampleColumnCheckbox);

        // Un-check Queued Booking - which doesn't have width specified
        const queuedBookingCheckbox = getAllByTestId(
            "selectSingleSearchableColumn"
        )[11];
        fireEvent.click(queuedBookingCheckbox);

        // Apply changes
        saveButton = getByTestId("save_columnsManage");
        act(() => {
            saveButton.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });

        // Open Column chooser overlay again
        columnChooserIcon = getByTestId("toggleManageColumnsOverlay");
        act(() => {
            columnChooserIcon.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });

        // Reset Changes
        const resetButton = getByTestId("reset_columnsManage");
        act(() => {
            resetButton.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });

        // Close Overlay
        const closeButton = getByTestId("cancel_columnsManage");
        act(() => {
            closeButton.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });

        // Width of flight, weight and volume columns should reset to original values after reset
        flightColumnWidth = gridContainer.querySelectorAll(
            "[data-testid='grid-header']"
        )[4];
        weightColumnWidth = gridContainer.querySelectorAll(
            "[data-testid='grid-header']"
        )[7];
        volumeColumnWidth = gridContainer.querySelectorAll(
            "[data-testid='grid-header']"
        )[8];
        expect(flightColumnWidth.style.width).toBe("100px");
        expect(weightColumnWidth.style.width).toBe("130px");
        expect(volumeColumnWidth.style.width).toBe("100px");
    });
});
