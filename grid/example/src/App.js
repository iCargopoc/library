import React from "react";
import Grid from "grid";
import { fetchData } from "./getData";
import DeletePopUpOverLay from "./cells/DeletePopUpOverlay";
import RowEditOverlay from "./cells/RowEditOverlay";
import SREdit from "./cells/SREdit";
import FlightEdit from "./cells/FlightEdit";
import SegmentEdit from "./cells/SegmentEdit";

const App = () => {
    //Check if device is desktop
    const isDesktop = window.innerWidth > 1024;

    //Get grid height value, which is a required value
    const gridHeight = "84vh";

    //Get grid width value
    const gridWidth = "100%";

    //Create an array of airports
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

    //Configure columns and its related functions
    let columns = [
        {
            Header: "Id",
            accessor: "travelId",
            disableFilters: true,
            width: 50
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
            Cell: FlightEdit,
            sortValue: "flightno"
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
            Cell: (row) => {
                const otherColumn = "weight";
                const { value, column } = row;
                const { index, original } = row.row;
                return (
                    <SegmentEdit
                        airportCodeList={airportCodeList}
                        index={index}
                        segmentId={column.id}
                        segmentValue={value}
                        weightId={otherColumn}
                        weightValue={original[otherColumn]}
                        updateCellData={updateCellData}
                    />
                );
            }
        },
        {
            Header: "Details",
            accessor: "details",
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
            Cell: (row) => {
                const { startTime, endTime, status, additionalStatus, flightModel, bodyType, type, timeStatus } = row.value;
                let timeStatusArray = timeStatus.split(" ");
                const timeValue = timeStatusArray.shift();
                const timeText = timeStatusArray.join(" ");
                return (
                    <div className="details-wrap content">
                        <ul>
                            <li>
                                {startTime} – {endTime}
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
            Cell: (row) => {
                const { percentage, value } = row.value;
                return (
                    <div className="weight-details content">
                        <strong className="per">{percentage}</strong>
                        <span>
                            <strong>{value.split("/")[0]}/</strong>
                            {value.split("/")[1]}
                        </span>
                    </div>
                );
            },
            sortValue: "percentage"
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
            Cell: (row) => {
                const { percentage, value } = row.value;
                return (
                    <div className="weight-details content">
                        <strong className="per">{percentage}</strong>
                        <span>
                            <strong>{value.split("/")[0]}/</strong>
                            {value.split("/")[1]}
                        </span>
                    </div>
                );
            },
            sortValue: "percentage"
        },
        {
            Header: "ULD Positions",
            accessor: "uldPositions",
            disableSortBy: true,
            width: 100,
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
            Cell: (row) => (
                <div className="uld-details content">
                    <ul>
                        {row.value.map((positions, index) => {
                            return (
                                <li key={index}>
                                    <span>{positions.position}</span>
                                    <strong>{positions.value}</strong>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            )
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
            Cell: (row) => {
                const { revenue, yeild } = row.value;
                return (
                    <div className="revenue-details content">
                        <span className="large">{revenue}</span>
                        <span>{yeild}</span>
                    </div>
                );
            },
            sortValue: "revenue"
        },
        {
            Header: "SR",
            accessor: "sr",
            width: 90,
            Cell: SREdit
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
            Cell: (row) => {
                const { sr, volume } = row.value;
                return (
                    <div className="queued-details content">
                        <span>
                            <strong></strong>
                            {sr}
                        </span>
                        <span>
                            <strong></strong> {volume}
                        </span>
                    </div>
                );
            }
        }
    ];

    if (!isDesktop) {
        columns = columns.filter((item) => {
            return item.accessor !== "details";
        });
    }

    //Return data that has to be shown in the row expanded region
    const renderExpandedContent = (row) => {
        const { remarks, details } = row.original;
        if (isDesktop) {
            return remarks;
        } else {
            const { startTime, endTime, status, additionalStatus, flightModel, bodyType, type, timeStatus } = details;
            let timeStatusArray = timeStatus.split(" ");
            const timeValue = timeStatusArray.shift();
            const timeText = timeStatusArray.join(" ");
            return (
                <div className="details-wrap content">
                    <ul>
                        <li>{remarks}</li>
                        <li className="divider">|</li>
                    </ul>
                    <ul>
                        <li>
                            {startTime} – {endTime}
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
                </div>
            );
        }
    };

    //Add logic for doing global search in the grid
    const globalSearchLogic = (rows, columns, filterValue) => {
        if (filterValue) {
            const searchText = filterValue.toLowerCase();
            return rows.filter((row) => {
                const { flight, segment, details, weight, volume, revenue, queuedBooking, uldPositions, sr } = row.original;
                const { date, flightno } = flight;
                const { from, to } = segment;
                const { flightModel, bodyType, type, startTime, endTime, status, additionalStatus, timeStatus } = details;
                return (
                    date.toLowerCase().includes(searchText) ||
                    flightno.toLowerCase().includes(searchText) ||
                    from.toLowerCase().includes(searchText) ||
                    to.toLowerCase().includes(searchText) ||
                    flightModel.toString().toLowerCase().includes(searchText) ||
                    bodyType.toLowerCase().includes(searchText) ||
                    type.toLowerCase().includes(searchText) ||
                    startTime.toLowerCase().includes(searchText) ||
                    endTime.toLowerCase().includes(searchText) ||
                    status.toLowerCase().includes(searchText) ||
                    additionalStatus.toLowerCase().includes(searchText) ||
                    timeStatus.toLowerCase().includes(searchText) ||
                    weight.percentage.toLowerCase().includes(searchText) ||
                    weight.value.toLowerCase().includes(searchText) ||
                    volume.percentage.toLowerCase().includes(searchText) ||
                    volume.value.toLowerCase().includes(searchText) ||
                    revenue.revenue.toLowerCase().includes(searchText) ||
                    revenue.yeild.toLowerCase().includes(searchText) ||
                    sr.toLowerCase().includes(searchText) ||
                    queuedBooking.sr.toLowerCase().includes(searchText) ||
                    queuedBooking.volume.toLowerCase().includes(searchText) ||
                    uldPositions.findIndex((item) => {
                        return (item.position + " " + item.value).toLowerCase().includes(searchText);
                    }) >= 0
                );
            });
        }
        return rows;
    };

    //Add logic to calculate height of each row, based on the content of  or more columns
    const calculateRowHeight = (rows, index, headerCells) => {
        let rowHeight = 50;
        if (headerCells && headerCells.length > 0 && rows && rows.length > 0 && index >= 0) {
            const { headers } = headerCells[0];
            const { original, isExpanded } = rows[index];
            headers.forEach((header) => {
                const { id, totalFlexWidth } = header;
                if (id === "details") {
                    const details = original.details;
                    if (details) {
                        const text =
                            details.additionalStatus +
                            details.bodyType +
                            details.endTime +
                            details.flightModel +
                            details.startTime +
                            details.status +
                            details.timeStatus +
                            details.type;
                        rowHeight = rowHeight + Math.ceil((65 * text.length) / totalFlexWidth);
                        if (totalFlexWidth > 300) {
                            rowHeight = rowHeight + 0.001 * (totalFlexWidth - 300);
                        }
                        if (totalFlexWidth < 300) {
                            rowHeight = rowHeight + (300 - totalFlexWidth) / 4;
                        }
                    }
                }
            });
            if (isExpanded) {
                rowHeight = rowHeight + (isDesktop ? 30 : 80);
            }
        }
        return rowHeight;
    };

    //Gets called when there is a cell edit
    const updateCellData = (rowIndex, columnId, value) => {
        console.log(rowIndex + " " + columnId + " " + JSON.stringify(value));
        /*setItems((old) =>
            old.map((row, index) => {
                if (index === rowIndex) {
                    return {
                        ...old[rowIndex],
                        [columnId]: value
                    };
                }
                return row;
            })
        );*/
    };

    //Gets called when there is a row edit
    const updateRowData = (row) => {
        console.log("Row updated: ");
        console.log(row);
    };

    const deleteRowData = (row) => {
        console.log("Row deleted: ");
        console.log(row);
    };

    //Gets called when row bulk edit is done
    const selectBulkData = (selectedRows) => {
        console.log("Rows selected: ");
        console.log(selectedRows);
    };

    return (
        <Grid
            title="AWBs"
            gridHeight={gridHeight}
            gridWidth={gridWidth}
            columns={columns}
            fetchData={fetchData}
            rowEditOverlay={RowEditOverlay}
            rowEditData={{
                airportCodeList: airportCodeList
            }}
            updateRowData={updateRowData}
            deletePopUpOverLay={DeletePopUpOverLay}
            deleteRowData={deleteRowData}
            globalSearchLogic={globalSearchLogic}
            selectBulkData={selectBulkData}
            calculateRowHeight={calculateRowHeight}
            renderExpandedContent={renderExpandedContent}
        />
    );
};

export default App;
