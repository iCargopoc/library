import React, { useState, useEffect } from "react";
import "./example.css";
import Grid from "../src/index";
import FlightIcon from "./images/FlightIcon.png";
import { fetchData } from "./getData";
import { getValueOfDate } from "./utils/DateUtility";
import FlightEdit from "./cells/FlightEdit";
import SrEdit from "./cells/SrEdit";
import SegmentEdit from "./cells/SegmentEdit";
import RowEdit from "./cells/RowEdit";

const GridView = () => {
    const { search } = window.location;
    const urlPageSize = search
        ? parseInt(search.replace("?pagesize=", ""), 10)
        : NaN;
    const pageSize = !Number.isNaN(urlPageSize) ? Number(urlPageSize) : 300;
    // State for holding index value for API call
    const [index, setIndex] = useState(0);
    // State for holding grid data
    const [gridData, setGridData] = useState([]);
    // State for notifying if next page is available or not
    const [isNextPageAvailable, setIsNextPageAvailable] = useState(true);

    const airportCodeList = [
        "AAA",
        "AAB",
        "AAC",
        "ABA",
        "ABB",
        "ABC",
        "ACA",
        "ACB",
        "ACC",
        "BAA",
        "BAB",
        "BAC",
        "BBA",
        "BBB",
        "BBC",
        "BCA",
        "BCB",
        "BCC",
        "CAA",
        "CAB",
        "CAC",
        "CBA",
        "CBB",
        "CBC",
        "CCA",
        "CCB",
        "CCC",
        "XXX",
        "XXY",
        "XXZ",
        "XYX",
        "XYY",
        "XYZ",
        "XZX",
        "XZY",
        "XZZ",
        "YXX",
        "YXY",
        "YXZ",
        "YYX",
        "YYY",
        "YYZ",
        "YZX",
        "YZY",
        "YZZ",
        "ZXX",
        "ZXY",
        "ZXZ",
        "ZYX",
        "ZYY",
        "ZYZ",
        "ZZX",
        "ZZY",
        "ZZZ"
    ];

    const columns = [
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
                    accessor: "flightno"
                },
                {
                    Header: "Date",
                    accessor: "date"
                }
            ],
            sortValue: "flightno",
            displayCell: (rowData, DisplayTag) => {
                const { flightno, date } = rowData.flight;
                return (
                    <div className="flight-details">
                        <DisplayTag columnKey="flight" cellKey="flightno">
                            <strong>{flightno}</strong>
                        </DisplayTag>
                        <DisplayTag columnKey="flight" cellKey="date">
                            <span>{getValueOfDate(date, "cell")}</span>
                        </DisplayTag>
                    </div>
                );
            },
            editCell: (rowData, DisplayTag, rowUpdateCallBack) => {
                return (
                    <FlightEdit
                        rowData={rowData}
                        DisplayTag={DisplayTag}
                        rowUpdateCallBack={rowUpdateCallBack}
                    />
                );
            }
        },
        {
            Header: "Segment",
            accessor: "segment",
            width: 100,
            innerCells: [
                {
                    Header: "From",
                    accessor: "from"
                },
                {
                    Header: "To",
                    accessor: "to"
                }
            ],
            disableSortBy: true,
            displayCell: (rowData, DisplayTag) => {
                const { from, to } = rowData.segment;
                return (
                    <div className="segment-details">
                        <DisplayTag columnKey="segment" cellKey="from">
                            <span>{from}</span>
                        </DisplayTag>
                        <i>
                            <img src={FlightIcon} alt="segment" />
                        </i>
                        <DisplayTag columnKey="segment" cellKey="to">
                            <span>{to}</span>
                        </DisplayTag>
                    </div>
                );
            },
            editCell: (rowData, DisplayTag, rowUpdateCallBack) => {
                return (
                    <SegmentEdit
                        airportCodeList={airportCodeList}
                        rowData={rowData}
                        DisplayTag={DisplayTag}
                        rowUpdateCallBack={rowUpdateCallBack}
                    />
                );
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
            displayCell: (rowData, DisplayTag) => {
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
                const timeStatusArray = timeStatus ? timeStatus.split(" ") : [];
                const timeValue = timeStatusArray.shift();
                const timeText = timeStatusArray.join(" ");
                return (
                    <div className="details-wrap">
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
        },
        {
            Header: "Weight",
            accessor: "weight",
            width: 130,
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
            displayCell: (rowData, DisplayTag) => {
                const { percentage, value } = rowData.weight;
                const splitValue = value ? value.split("/") : [];
                let valuePrefix;
                let valueSuffix = "";
                if (splitValue.length === 2) {
                    valuePrefix = splitValue[0];
                    valueSuffix = splitValue[1];
                }
                return (
                    <div className="weight-details">
                        <DisplayTag columnKey="weight" cellKey="percentage">
                            <strong className="per">{percentage}</strong>
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
        },
        {
            Header: "Volume",
            accessor: "volume",
            width: 100,
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
            displayCell: (rowData, DisplayTag) => {
                const { percentage, value } = rowData.volume;
                const splitValue = value ? value.split("/") : [];
                let valuePrefix;
                let valueSuffix = "";
                if (splitValue.length === 2) {
                    valuePrefix = splitValue[0];
                    valueSuffix = splitValue[1];
                }
                return (
                    <div className="weight-details">
                        <DisplayTag columnKey="volume" cellKey="percentage">
                            <strong className="per">{percentage}</strong>
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
                            {uldPositions.map((positions) => {
                                const { position, value } = positions;
                                return (
                                    <li key={`${position}_${value}`}>
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
            displayCell: (rowData, DisplayTag) => {
                const { revenue, yeild } = rowData.revenue;
                return (
                    <div className="revenue-details">
                        <DisplayTag columnKey="revenue" cellKey="revenue">
                            <span className="large">{revenue}</span>
                        </DisplayTag>
                        <DisplayTag columnKey="revenue" cellKey="yeild">
                            <span>{yeild}</span>
                        </DisplayTag>
                    </div>
                );
            },
            sortValue: "revenue"
        },
        {
            Header: "SR",
            accessor: "sr",
            width: 90,
            displayCell: (rowData) => {
                const { sr } = rowData;
                return (
                    <div className="sr-details">
                        <span>{sr}</span>
                    </div>
                );
            },
            editCell: (rowData, DisplayTag, rowUpdateCallBack) => {
                return (
                    <SrEdit
                        rowData={rowData}
                        rowUpdateCallBack={rowUpdateCallBack}
                    />
                );
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
            displayCell: (rowData, DisplayTag) => {
                const { sr, volume } = rowData.queuedBooking;
                return (
                    <div className="queued-details">
                        <DisplayTag columnKey="queuedBooking" cellKey="sr">
                            <span>
                                <strong>{sr}</strong>
                            </span>
                        </DisplayTag>
                        <DisplayTag columnKey="queuedBooking" cellKey="volume">
                            <span>
                                <strong>{volume}</strong>
                            </span>
                        </DisplayTag>
                    </div>
                );
            }
        }
    ];

    const columnToExpand = {
        Header: "Remarks",
        innerCells: [
            { Header: "Remarks", accessor: "remarks" },
            { Header: "Details", onlyInTablet: true, accessor: "details" }
        ],
        displayCell: (rowData, DisplayTag) => {
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
                <div className="details-wrap">
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

    const getRowEditOverlay = (rowData, DisplayTag, rowUpdateCallBack) => {
        return (
            <RowEdit
                airportCodeList={airportCodeList}
                DisplayTag={DisplayTag}
                rowData={rowData}
                rowUpdateCallBack={rowUpdateCallBack}
            />
        );
    };

    const rowActions = [
        { label: "edit" },
        { label: "delete" },
        { label: "Send SCR", value: "SCR" },
        { label: "Segment Summary", value: "SegmentSummary" },
        { label: "Open Summary", value: "OpenSummary" },
        { label: "Close Summary", value: "CloseSummary" }
    ];

    const rowActionCallback = (rowData, actionValue) => {
        console.log(`Row action: ${actionValue}`);
        console.log(rowData);
    };

    const calculateRowHeight = (row, gridColumns) => {
        // Minimum height for each row
        let rowHeight = 50;
        if (gridColumns && gridColumns.length > 0 && row) {
            // Get properties of a row
            const { original, isExpanded } = row;
            // Find the column with maximum width configured, from grid columns list
            const columnWithMaxWidth = [...gridColumns].sort((a, b) => {
                return b.width - a.width;
            })[0];
            // Get column properties including the user resized column width (totalFlexWidth)
            const { id, width, totalFlexWidth } = columnWithMaxWidth;
            // Get row value of that column
            const rowValue = original[id];
            if (rowValue) {
                // Find the length of text of data in that column
                const textLength = Object.values(rowValue).join(",").length;
                // This is a formula that was created for the test data used.
                rowHeight += Math.ceil((75 * textLength) / totalFlexWidth);
                const widthVariable =
                    totalFlexWidth > width
                        ? totalFlexWidth - width
                        : width - totalFlexWidth;
                rowHeight += widthVariable / 1000;
            }
            // Add logic to increase row height if row is expanded
            if (isExpanded && columnToExpand) {
                // Increase height based on the number of inner cells in additional columns
                rowHeight +=
                    columnToExpand.innerCells &&
                    columnToExpand.innerCells.length > 0
                        ? columnToExpand.innerCells.length * 35
                        : 35;
            }
        }
        return rowHeight;
    };

    const updateRowData = (originalRow, updatedRow) => {
        setGridData((old) =>
            old.map((row) => {
                let newRow = row;
                if (
                    Object.entries(row).toString() ===
                    Object.entries(originalRow).toString()
                ) {
                    newRow = updatedRow;
                }
                return newRow;
            })
        );
    };

    const deleteRowData = (originalRow) => {
        setGridData((old) =>
            old.filter((row) => {
                return row !== originalRow;
            })
        );
    };

    const selectBulkData = (selectedRows) => {
        console.log("Rows selected: ");
        console.log(selectedRows);
    };

    const loadMoreData = () => {
        fetchData(index, pageSize).then((data) => {
            if (data && data.length > 0) {
                setGridData(gridData.concat(data));
                setIndex(index + pageSize);
            } else {
                setIsNextPageAvailable(false);
            }
        });
    };

    useEffect(() => {
        fetchData(index, pageSize).then((data) => {
            if (data && data.length > 0) {
                setGridData(data);
                setIndex(index + pageSize);
            } else {
                setIsNextPageAvailable(false);
            }
        });
    }, []);

    if (gridData && gridData.length > 0 && columns && columns.length > 0) {
        return (
            <Grid
                title="AWBs"
                gridHeight="80vh"
                gridWidth="100%"
                gridData={gridData}
                isNextPageAvailable={isNextPageAvailable}
                loadMoreData={loadMoreData}
                columns={columns}
                columnToExpand={columnToExpand}
                rowActions={rowActions}
                rowActionCallback={rowActionCallback}
                getRowEditOverlay={getRowEditOverlay}
                calculateRowHeight={calculateRowHeight}
                updateRowData={updateRowData}
                deleteRowData={deleteRowData}
                selectBulkData={selectBulkData}
            />
        );
    }
    return (
        <h2 style={{ textAlign: "center", marginTop: "70px" }}>
            Initializing Grid...
        </h2>
    );
};

export default {
    title: "Grid Component",
    component: GridView
};
const Template = () => {
    return <GridView />;
};

export const MainStory = Template.bind({});
