/* eslint-disable no-undef */
import React from "react";
import { render, cleanup, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
/* eslint-disable no-unused-vars */
import regeneratorRuntime from "regenerator-runtime";
import { act } from "react-dom/test-utils";
import Grid from "../src/index";
import ExportData from "../src/Overlays/exportdata";

describe("Export data functionality test", () => {
    jest.setTimeout(30000);
    HTMLCanvasElement.prototype.getContext = () => {
        // return whatever getContext has to return
        return [];
    };
    global.URL.createObjectURL = jest.fn();

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

    const validateData = (value: any): string => {
        if (value !== null && value !== undefined) {
            return value.toString();
        }
        return "";
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
                ],
                exportData: (rowData, isDesktop) => {
                    return null;
                }
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
                },
                exportData: (rowData) => {
                    const { travelId } = rowData;
                    return [
                        {
                            header: null, // To create an empty header entry in the export content
                            content: validateData(travelId)
                        }
                    ];
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
                editCell: mockFlightEdit,
                exportData: (rowData, isDesktop) => {
                    const { flight } = rowData;
                    const { flightno, date } = flight || {};

                    return [
                        {
                            header: "Flight No",
                            content: validateData(flightno)
                        },
                        {
                            header: "Flight Date",
                            content: validateData(date)
                        }
                    ];
                }
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
                },
                exportData: (rowData, isDesktop) => {
                    const { segment } = rowData;
                    const { from, to } = segment || {};
                    return [
                        {
                            header: "Origin",
                            content: validateData(from)
                        },
                        {
                            header: "Destination",
                            content: validateData(to)
                        }
                    ];
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
                },
                exportData: (rowData, isDesktop) => {
                    const { details } = rowData;
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
                    return [
                        {
                            header: "Departure Time",
                            content: validateData(startTime)
                        },
                        {
                            header: "Arrival Time",
                            content: validateData(endTime)
                        },
                        {
                            header: "Flight Status",
                            content: validateData(status)
                        },
                        {
                            header: "Flight Additional Status",
                            content: validateData(additionalStatus)
                        },
                        {
                            header: "Flight Model",
                            content: validateData(flightModel)
                        },
                        {
                            header: "Body Type",
                            content: validateData(bodyType)
                        },
                        {
                            header: "Flight Type",
                            content: validateData(type)
                        },
                        {
                            header: "Time Status",
                            content: validateData(timeStatus)
                        }
                    ];
                }
            },
            {
                Header: "Weight",
                accessor: "weight",
                width: 130,
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
                },
                exportData: (rowData, isDesktop) => {
                    const { weight } = rowData;
                    const { percentage, value } = weight || {};
                    return [
                        {
                            header: "Weight %",
                            content: validateData(percentage)
                        },
                        {
                            header: "Weight",
                            content: validateData(value)
                        }
                    ];
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
                },
                exportData: (rowData, isDesktop) => {
                    const { volume } = rowData;
                    const { percentage, value } = volume || {};
                    return [
                        {
                            header: "Volume %",
                            content: validateData(percentage)
                        },
                        {
                            header: "Volume",
                            content: validateData(value)
                        }
                    ];
                }
            },
            {
                Header: "ULD Positions",
                accessor: "uldPositions",
                width: 120,
                isArray: true,
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
                },
                exportData: (rowData, isDesktop) => {
                    const { uldPositions } = rowData;
                    const positionArray = [];
                    const valueArray = [];
                    if (uldPositions && uldPositions.length > 0) {
                        uldPositions.forEach((uld) => {
                            const { position, value } = uld;
                            positionArray.push(validateData(position));
                            valueArray.push(validateData(value));
                        });
                        return [
                            {
                                header: "ULD Position",
                                content: positionArray.join(" | ")
                            },
                            {
                                header: "ULD Value",
                                content: valueArray.join(" | ")
                            }
                        ];
                    }
                    return [];
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
                sortValue: "revenue",
                exportData: (rowData, isDesktop) => {
                    const revenueData = rowData ? rowData.revenue : {};
                    const { revenue, yeild } = revenueData || {};
                    return [
                        {
                            header: "Revenue",
                            content: validateData(revenue)
                        },
                        {
                            header: "Yeild",
                            content: validateData(yeild)
                        }
                    ];
                }
            },
            {
                Header: "SR",
                accessor: "sr",
                searchKeys: ["sr"],
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
                },
                exportData: (rowData, isDesktop) => {
                    const { sr } = rowData;
                    return [
                        {
                            header: "SR",
                            content: validateData(sr)
                        }
                    ];
                }
            },
            {
                Header: "Queued Booking",
                accessor: "queuedBooking",
                width: 130,
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
                },
                exportData: (rowData, isDesktop) => {
                    const { queuedBooking } = rowData;
                    const { sr, volume } = queuedBooking || {};
                    return [
                        {
                            header: "Queued Booking SR",
                            content: validateData(sr)
                        },
                        {
                            header: "Queued Booking Volume",
                            content: validateData(volume)
                        }
                    ];
                }
            }
        ];
    };

    const getColumnToExpand = () => {
        return {
            Header: "Remarks",
            innerCells: [
                { Header: "Remarks", accessor: "remarks" },
                { Header: "ULD Positions", accessor: "uldPositions" },
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
            },
            exportData: (rowData, isDesktop) => {
                const dataToReturn = [];
                const { remarks } = rowData;
                dataToReturn.push({
                    header: "Remarks",
                    content: validateData(remarks)
                });
                if (!isDesktop) {
                    const { details } = rowData;
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
                    dataToReturn.push(
                        {
                            header: "Departure Time",
                            content: validateData(startTime)
                        },
                        {
                            header: "Arrival Time",
                            content: validateData(endTime)
                        },
                        {
                            header: "Flight Status",
                            content: validateData(status)
                        },
                        {
                            header: "Flight Additional Status",
                            content: validateData(additionalStatus)
                        },
                        {
                            header: "Flight Model",
                            content: validateData(flightModel)
                        },
                        {
                            header: "Body Type",
                            content: validateData(bodyType)
                        },
                        {
                            header: "Flight Type",
                            content: validateData(type)
                        },
                        {
                            header: "Time Status",
                            content: validateData(timeStatus)
                        }
                    );
                }
                return dataToReturn;
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

    const mockGridColumns = getColumns();
    const mockGridColumnsWithoutExportProp = [...getColumns()].map((col) => {
        const updatedCol = { ...col };
        if (col.exportData) {
            delete updatedCol.exportData;
        }
        return updatedCol;
    });

    const mockAdditionalColumn = getColumnToExpand();
    const mockData = getGridData();

    afterEach(cleanup);
    let mockContainer;
    beforeAll(() => {
        mockContainer = document.createElement("div");
        document.body.appendChild(mockContainer);
    });

    it("test export data component without columns", () => {
        mockOffsetSize(600, 600);
        const { container } = render(
            <ExportData
                toggleExportDataOverlay={undefined}
                rows={[]}
                columns={[]}
                additionalColumn={null}
                isDesktop
            />
        );
        const gridContainer = container;
        // Check if grid has been loaded
        expect(gridContainer).toBeInTheDocument();

        // Check if export overlay has been loaded
        const exportOverlay = gridContainer.querySelectorAll(
            "[data-testid='exportoverlay']"
        );
        expect(exportOverlay.length).toBe(0);
    });

    it("test export data icon to be hidden as prop to hide export data is passed", () => {
        mockOffsetSize(1280, 1024);
        const { container } = render(
            <Grid
                gridData={mockData}
                idAttribute="travelId"
                columns={mockGridColumns}
                exportData={false}
            />
        );
        const gridContainer = container;
        // Check if grid has been loaded
        expect(gridContainer).toBeInTheDocument();

        // Check Column chooser Icon
        const exportDataIcon = gridContainer.querySelectorAll(
            "[data-testid='toggleExportDataOverlay']"
        );
        expect(exportDataIcon.length).toBe(0);
    });

    it("test export data without rows", async () => {
        mockOffsetSize(1280, 1024);
        const { container, getByTestId, getAllByTestId, getAllByText } = render(
            <Grid
                gridData={mockData}
                idAttribute="travelId"
                columns={mockGridColumns}
                columnToExpand={mockAdditionalColumn}
            />
        );
        const gridContainer = container;
        // Check if grid has been loaded
        expect(gridContainer).toBeInTheDocument();

        // Global Filter Search with invalid value "asd"
        let input = getByTestId("globalFilter-textbox");
        expect(input.value).toBe("");
        fireEvent.change(input, { target: { value: "asd" } });
        expect(input.value).toBe("asd");

        // There should not be any records
        await waitFor(() =>
            expect(getAllByText("No Records Found").length).toBe(1)
        );

        // Open Export overlay
        const exportDataIcon = getByTestId("toggleExportDataOverlay");
        act(() => {
            exportDataIcon.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });

        // Check if overlay is opened
        let exportDataOverlayCount = getAllByTestId("exportoverlay").length;
        expect(exportDataOverlayCount).toBe(1);

        // Select csv
        const selectCsv = getByTestId("chk_csv_test");
        expect(selectCsv.checked).toEqual(false);
        fireEvent.click(selectCsv);
        expect(selectCsv.checked).toEqual(true);

        // Click export data button
        const exportButton = getByTestId("export_button");
        act(() => {
            exportButton.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });

        // Check for error
        const errorMessage = getAllByText("No rows available to export");
        expect(errorMessage.length).toBe(1);

        // Close overlay
        const cancelButton = getByTestId("cancel_button");
        act(() => {
            cancelButton.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });

        // Check if overlay is opened now
        exportDataOverlayCount = gridContainer.querySelectorAll(
            "[data-testid='exportoverlay']"
        ).length;
        expect(exportDataOverlayCount).toBe(0);

        // Clear filter value "asd"
        input = getByTestId("globalFilter-textbox");
        expect(input.value).toBe("asd");
        fireEvent.change(input, { target: { value: "" } });
        expect(input.value).toBe("");

        // Rows should be present
        await waitFor(() =>
            expect(getAllByTestId("gridrow").length).toBeGreaterThan(0)
        );
    });

    it("test export data warnings", () => {
        mockOffsetSize(1280, 1024);
        const { container, getByTestId, getAllByTestId, getAllByText } = render(
            <Grid
                gridData={mockData}
                idAttribute="travelId"
                columns={mockGridColumns}
                columnToExpand={mockAdditionalColumn}
            />
        );
        const gridContainer = container;
        // Check if grid has been loaded
        expect(gridContainer).toBeInTheDocument();

        // Open Export overlay
        const exportDataIcon = getByTestId("toggleExportDataOverlay");
        act(() => {
            exportDataIcon.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });

        // Check if overlay is opened
        let exportDataOverlayCount = getAllByTestId("exportoverlay").length;
        expect(exportDataOverlayCount).toBe(1);

        // Deselect all columns
        const selectAllCheck = getByTestId("selectAllSearchableColumns");
        expect(selectAllCheck.checked).toEqual(true);
        fireEvent.click(selectAllCheck);
        expect(selectAllCheck.checked).toEqual(false);

        // Click export data button
        let exportButton = getByTestId("export_button");
        act(() => {
            exportButton.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });

        // Check for error
        let errorMessage = getAllByText("Select at least one parent column");
        expect(errorMessage.length).toBe(1);

        // Select a file type
        let selectExcel = getByTestId("chk_excel_test");
        expect(selectExcel.checked).toEqual(false);
        fireEvent.click(selectExcel);
        expect(selectExcel.checked).toEqual(true);

        // Select remarks column too
        const remarksCheck = getAllByTestId("selectSingleSearchableColumn")[11];
        expect(remarksCheck.checked).toEqual(false);
        fireEvent.click(remarksCheck);
        expect(remarksCheck.checked).toEqual(true);

        // Click export data button
        exportButton = getByTestId("export_button");
        act(() => {
            exportButton.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });

        // Check for error
        errorMessage = getAllByText("Select at least one parent column");
        expect(errorMessage.length).toBe(1);

        // Deselect a file type
        selectExcel = getByTestId("chk_excel_test");
        expect(selectExcel.checked).toEqual(true);
        fireEvent.click(selectExcel);
        expect(selectExcel.checked).toEqual(false);

        // Select one column
        const idCheck = getAllByTestId("selectSingleSearchableColumn")[2];
        expect(idCheck.checked).toEqual(false);
        fireEvent.click(idCheck);
        expect(idCheck.checked).toEqual(true);

        // Click export data button
        exportButton = getByTestId("export_button");
        act(() => {
            exportButton.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });

        // Check for error
        errorMessage = getAllByText("Select at least one file type");
        expect(errorMessage.length).toBe(1);

        // Close overlay
        const cancelButton = getByTestId("cancel_button");
        act(() => {
            cancelButton.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });

        // Check if overlay is opened now
        exportDataOverlayCount = gridContainer.querySelectorAll(
            "[data-testid='exportoverlay']"
        ).length;
        expect(exportDataOverlayCount).toBe(0);
    });

    it("test export data warning - columns without exportData property", () => {
        mockOffsetSize(1280, 1024);
        const { container, getByTestId, getAllByTestId, getAllByText } = render(
            <Grid
                gridData={mockData}
                idAttribute="travelId"
                columns={mockGridColumnsWithoutExportProp}
            />
        );
        const gridContainer = container;
        // Check if grid has been loaded
        expect(gridContainer).toBeInTheDocument();

        // Open Export overlay
        const exportDataIcon = getByTestId("toggleExportDataOverlay");
        act(() => {
            exportDataIcon.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });

        // Check if overlay is opened
        let exportDataOverlayCount = getAllByTestId("exportoverlay").length;
        expect(exportDataOverlayCount).toBe(1);

        // Select a file type
        const selectExcel = getByTestId("chk_excel_test");
        expect(selectExcel.checked).toEqual(false);
        fireEvent.click(selectExcel);
        expect(selectExcel.checked).toEqual(true);

        // Click export data button
        const exportButton = getByTestId("export_button");
        act(() => {
            exportButton.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });

        console.log(getAllByTestId("exportoverlay").innerHTML);

        // Check for error
        const errorMessage = getAllByText(
            "No data has been configured to export"
        );
        expect(errorMessage.length).toBe(1);

        // Close overlay
        const cancelButton = getByTestId("cancel_button");
        act(() => {
            cancelButton.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });

        // Check if overlay is closed now
        exportDataOverlayCount = gridContainer.querySelectorAll(
            "[data-testid='exportoverlay']"
        ).length;
        expect(exportDataOverlayCount).toBe(0);
    });

    it("download all file types", () => {
        mockOffsetSize(1280, 1024);
        const { container, getByTestId, getAllByTestId } = render(
            <Grid
                gridData={mockData}
                idAttribute="travelId"
                columns={mockGridColumns}
                columnToExpand={mockAdditionalColumn}
                fileName="customFileName"
            />
        );
        const gridContainer = container;
        // Check if grid has been loaded
        expect(gridContainer).toBeInTheDocument();

        // Open Export overlay
        const exportDataIcon = getByTestId("toggleExportDataOverlay");
        act(() => {
            exportDataIcon.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });

        // Check if overlay is opened
        const exportDataOverlayCount = getAllByTestId("exportoverlay").length;
        expect(exportDataOverlayCount).toBe(1);

        // Select csv
        const selectCsv = getByTestId("chk_csv_test");
        expect(selectCsv.checked).toEqual(false);
        fireEvent.click(selectCsv);
        expect(selectCsv.checked).toEqual(true);

        // Select excel
        const selectExcel = getByTestId("chk_excel_test");
        expect(selectExcel.checked).toEqual(false);
        fireEvent.click(selectExcel);
        expect(selectExcel.checked).toEqual(true);

        // Select pdf
        const selectPdf = getByTestId("chk_pdf_test");
        expect(selectPdf.checked).toEqual(false);
        fireEvent.click(selectPdf);
        expect(selectPdf.checked).toEqual(true);

        // Click export data button
        const exportButton = getByTestId("export_button");
        act(() => {
            exportButton.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });
    });

    it("download files with columns hidden", () => {
        mockOffsetSize(1280, 1024);
        const { container, getByTestId, getAllByTestId } = render(
            <Grid
                gridData={mockData}
                idAttribute="travelId"
                columns={mockGridColumns}
                columnToExpand={mockAdditionalColumn}
            />
        );
        const gridContainer = container;
        // Check if grid has been loaded
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

        // Reset if there are any changes before starting
        const resetButton = getByTestId("reset_columnsManage");
        act(() => {
            resetButton.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });

        // Check column and additional column boxes count in the column setting portion (should be 10 and 1)
        let columnsCount = getAllByTestId("column-box").length;
        let additionalColumnsCount = getAllByTestId("additional-column-box")
            .length;
        expect(columnsCount).toBe(10);
        expect(additionalColumnsCount).toBe(1);

        // Un check Id column checkbox
        const idCheckbox = getAllByTestId("selectSingleSearchableColumn")[2];
        expect(idCheckbox.checked).toBeTruthy();
        fireEvent.click(idCheckbox);
        expect(idCheckbox.checked).toBeFalsy();

        // Check column and additional column boxes count in the column setting portion (should be 9 and 1)
        columnsCount = getAllByTestId("column-box").length;
        additionalColumnsCount = getAllByTestId("additional-column-box").length;
        expect(columnsCount).toBe(9);
        expect(additionalColumnsCount).toBe(1);

        // Un check Remarks column checkbox
        const remarksCheckbox = getAllByTestId(
            "selectSingleSearchableColumn"
        )[11];
        fireEvent.click(remarksCheckbox);

        // Check column and additional column boxes count in the column setting portion (should be 9 and 0)
        columnsCount = getAllByTestId("column-box").length;
        additionalColumnsCount = gridContainer.querySelectorAll(
            "[data-testid='additional-column-box']"
        ).length;
        expect(columnsCount).toBe(9);
        expect(additionalColumnsCount).toBe(0);

        // Try to apply changes
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

        // Open Export overlay
        const exportDataIcon = getByTestId("toggleExportDataOverlay");
        act(() => {
            exportDataIcon.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });

        // Check if overlay is opened
        const exportDataOverlayCount = getAllByTestId("exportoverlay").length;
        expect(exportDataOverlayCount).toBe(1);

        // Select csv
        const selectCsv = getByTestId("chk_csv_test");
        expect(selectCsv.checked).toEqual(false);
        fireEvent.click(selectCsv);
        expect(selectCsv.checked).toEqual(true);

        // Click export data button
        const exportButton = getByTestId("export_button");
        act(() => {
            exportButton.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });
    });
});
