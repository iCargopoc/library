/* eslint-disable react/prop-types */
import React, { useState, useEffect, useRef } from "react";
import "./example.css";
import Grid from "../src/index";
import FlightIcon from "./images/FlightIcon.png";
import { fetchData, fetchSubComponentData } from "./getData";
import { getValueOfDate } from "./utils/DateUtility";
import DetailsView from "./cells/DetailsView";
import FlightEdit from "./cells/FlightEdit";
import SrEdit from "./cells/SrEdit";
import ScrNumEdit from "./cells/ScrNumEdit";
import SegmentEdit from "./cells/SegmentEdit";
import RowAction from "./cells/RowAction";
import RowEdit from "./cells/RowEdit";
import SubRowEdit from "./cells/SubRowEdit";
import RowDelete from "./cells/RowDelete";

const GridComponent = (props) => {
    const {
        allProps,
        isSubComponentGrid,
        className,
        title,
        fixedRowHeight,
        gridWidth,
        rowsToOverscan,
        passColumnToExpand,
        passRowActions,
        passGetRowInfo,
        passOnGridRefresh,
        hasPagination,
        CustomPanel,
        enableGroupHeaders,
        enableJsxHeaders,
        gridHeader,
        subComponentHeader,
        showTitle,
        rowSelector,
        globalSearch,
        columnFilter,
        groupSort,
        columnChooser,
        exportData,
        fileName,
        rowsForSelection,
        passIdAttribute,
        expandableColumn,
        multiRowSelection,
        passTheme,
        enableServersideSorting,
        treeStructure,
        parentRowExpandable,
        parentRowsToExpand,
        previousPageRefresh,
        pdfPaperSize,
        isHorizontalGrid,
        passPinColumn
    } = props;

    const idAttribute = "travelId";
    const parentIdAttribute = "titleId";
    const subComponentIdAttribute = "hawbId";
    const gridPageSize = 50;
    const paginationType = "index"; // or - "cursor" - if Gris is tree view and parentRowExpandable is false, then paginationType should be "index"
    // State for holding index page info
    const [indexPageInfo, setIndexPageInfo] = useState({
        pageNum: 1,
        pageSize: gridPageSize,
        total: 20000,
        lastPage: false
    });
    // State for holding cursor page info
    const [cursorPageInfo, setCursorPageInfo] = useState({
        endCursor: gridPageSize - 1,
        pageSize: gridPageSize,
        total: 20000,
        lastPage: false
    });
    // Ref to keep store of pages that are reloaded based on total records count.
    const reloadedPages = useRef([]);
    // Ref to keep store of pages that are loaded till now.
    const loadedPages = useRef([]);
    // Ref to keep store of endCursors that are loaded till now.
    const loadedEndCursors = useRef([]);
    // State for holding grid data
    const [gridData, setGridData] = useState([]);
    // State for holding Original grid data, to be used while clearing group sort
    const [originalGridData, setOriginalGridData] = useState([]);
    // State for holding group sort options
    const [sortOptions, setSortOptions] = useState([]);
    // State for holding selected rows
    const [userSelectedRows, setUserSelectedRows] = useState([]);
    // State for holding rows to deselect
    const [rowsToDeselect, setRowsToDeselect] = useState([]);
    // State for holding rows to select
    const [rowsToSelect, setRowsToSelect] = useState([]);

    const [isEditOverlayOpened, setIsEditOverlayOpened] = useState(false);
    const [rowDataToEdit, setRowDataToEdit] = useState(null);

    const [isDeleteOverlayOpened, setIsDeleteOverlayOpened] = useState(false);
    const [rowDataToDelete, setRowDataToDelete] = useState(null);

    const [
        isSubComponentRowForEditAndDelete,
        setIsSubComponentRowForEditAndDelete
    ] = useState(false);

    const isParentExpandedByDefault =
        treeStructure &&
        parentRowExpandable !== false &&
        parentRowsToExpand &&
        parentRowsToExpand.length > 0;

    // Loginc for sorting data
    const compareValues = (compareOrder, v1, v2) => {
        let returnValue = 0;
        if (compareOrder === "Ascending") {
            if (v1 > v2) {
                returnValue = 1;
            } else if (v1 < v2) {
                returnValue = -1;
            }
            return returnValue;
        }
        if (v1 < v2) {
            returnValue = 1;
        } else if (v1 > v2) {
            returnValue = -1;
        }
        return returnValue;
    };
    // Return sorted data based on the parameters
    const getSortedData = (data, sortValues) => {
        if (data && data.length > 0 && sortValues && sortValues.length > 0) {
            const gridSortOptions = sortValues.filter(
                (option) => option.isSubComponentColumn !== true
            );
            if (
                treeStructure &&
                parentIdAttribute !== null &&
                parentIdAttribute !== undefined
            ) {
                const sortedTreeData = [...data].map((dataItem) => {
                    const sortedDataItem = dataItem;
                    const { childData } = dataItem;
                    if (childData) {
                        const childRows = [...childData.data];
                        if (childRows && childRows.length > 0) {
                            const sortedData = childRows.sort((x, y) => {
                                let compareResult = 0;
                                gridSortOptions.forEach((option) => {
                                    const { sortBy, sortOn, order } = option;
                                    const newResult =
                                        sortOn === "value"
                                            ? compareValues(
                                                  order,
                                                  x[sortBy],
                                                  y[sortBy]
                                              )
                                            : compareValues(
                                                  order,
                                                  x[sortBy][sortOn],
                                                  y[sortBy][sortOn]
                                              );
                                    compareResult = compareResult || newResult;
                                });
                                return compareResult;
                            });
                            sortedDataItem.childData.data = sortedData;
                        }
                    }
                    return sortedDataItem;
                });
                return sortedTreeData;
            }
            const subComponentSortOptions = sortValues.filter(
                (option) => option.isSubComponentColumn === true
            );
            let sortedOriginalData = [...data].sort((x, y) => {
                let compareResult = 0;
                gridSortOptions.forEach((option) => {
                    const { sortBy, sortOn, order } = option;
                    const newResult =
                        sortOn === "value"
                            ? compareValues(order, x[sortBy], y[sortBy])
                            : compareValues(
                                  order,
                                  x[sortBy][sortOn],
                                  y[sortBy][sortOn]
                              );
                    compareResult = compareResult || newResult;
                });
                return compareResult;
            });
            if (subComponentSortOptions && subComponentSortOptions.length > 0) {
                sortedOriginalData = [...sortedOriginalData].map(
                    (dataToSort) => {
                        const sortedData = { ...dataToSort };
                        if (
                            sortedData.subComponentData &&
                            sortedData.subComponentData.length > 0
                        ) {
                            const sortedSubComponentData = [
                                ...sortedData.subComponentData
                            ].sort((x, y) => {
                                let compareResult = 0;
                                if (
                                    x !== null &&
                                    x !== undefined &&
                                    y !== null &&
                                    y !== undefined
                                )
                                    subComponentSortOptions.forEach(
                                        (option) => {
                                            const {
                                                sortBy,
                                                sortOn,
                                                order
                                            } = option;
                                            const xSortBy = x[sortBy];
                                            const ySortBy = y[sortBy];
                                            let xSortOn = null;
                                            let ySortOn = null;
                                            if (
                                                xSortBy !== null &&
                                                xSortBy !== undefined
                                            ) {
                                                xSortOn = xSortBy[sortOn];
                                            }
                                            if (
                                                ySortBy !== null &&
                                                ySortBy !== undefined
                                            ) {
                                                ySortOn = ySortBy[sortOn];
                                            }
                                            const newResult =
                                                sortOn === "value"
                                                    ? compareValues(
                                                          order,
                                                          xSortBy,
                                                          ySortBy
                                                      )
                                                    : compareValues(
                                                          order,
                                                          xSortOn,
                                                          ySortOn
                                                      );
                                            compareResult =
                                                compareResult || newResult;
                                        }
                                    );
                                return compareResult;
                            });
                            sortedData.subComponentData = sortedSubComponentData;
                        }
                        return sortedData;
                    }
                );
            }
            return sortedOriginalData;
        }
        return data;
    };

    const parentData = [
        {
            titleId: 0,
            parentTitle: "EXCVGRATES 1",
            count: 300,
            lastModified: "User name 1",
            date: "10 Jul 2020",
            time: "18:39"
        },
        {
            titleId: 1,
            parentTitle: "EXCVGRATES 2",
            count: 300,
            lastModified: "User name 2",
            date: "10 Sep 2020",
            time: "03:59"
        },
        {
            titleId: 2,
            parentTitle: "EXCVGRATES 3",
            count: 300,
            lastModified: "User name 3",
            date: "10 Nov 2020",
            time: "12:10"
        }
    ];

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

    const validateData = (value: any): string => {
        if (value !== null && value !== undefined) {
            return value.toString();
        }
        return "";
    };

    const originalColumns = [
        {
            Header: "Id",
            accessor: "travelId",
            width: isHorizontalGrid ? 100 : 5,
            isSortable: true,
            displayCell: (rowData, DisplayTag, isDesktop, isColumnExpanded) => {
                const { travelId } = rowData;
                if (travelId !== null && travelId !== undefined) {
                    return (
                        <div className="travelId-details">
                            <span>{travelId}</span>
                        </div>
                    );
                }
                return null;
            },
            exportData: (rowData, isDesktop) => {
                const { travelId } = rowData;
                return [
                    {
                        header: "Travel Id",
                        content: validateData(travelId)
                    }
                ];
            }
        },
        {
            groupHeader: "Flight & Segment",
            Header: () => {
                return (
                    <div className="flightHeader">
                        <i className="flightIcon">
                            <img src={FlightIcon} alt="Flight Info" />
                        </i>
                        <span className="flightText">Info</span>
                    </div>
                );
            },
            title: "Flight",
            accessor: "flight",
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
            searchKeys: [
                "flight.flightno",
                "flight.date",
                "flight.flightdetails.connectionflights.*.airlinename",
                "flight.flightdetails.connectionflights.*.airlinenumbers.code",
                "flight.flightdetails.connectionflights.*.airlinenumbers.number",
                "flight.flightdetails.flightclass"
            ],
            width: isHorizontalGrid ? 250 : 10,
            displayCell: (rowData, DisplayTag, isDesktop, isColumnExpanded) => {
                const { flight } = rowData;
                if (flight) {
                    const { flightno, date, flightdetails } = flight;
                    const { flightclass, connectionflights } = flightdetails;
                    return (
                        <div className="flight-details">
                            <DisplayTag columnKey="flight" cellKey="flightno">
                                <strong>{flightno}</strong>
                            </DisplayTag>
                            <DisplayTag columnKey="flight" cellKey="date">
                                <span>{getValueOfDate(date, "cell")}</span>
                            </DisplayTag>
                            {fixedRowHeight !== true ? (
                                <>
                                    <br />
                                    <span>{flightclass} Class</span>
                                    <br />
                                    {connectionflights.map((item, index) => {
                                        const {
                                            airlinename,
                                            airlinenumbers
                                        } = item;
                                        const { code, number } = airlinenumbers;
                                        return (
                                            <React.Fragment key={index}>
                                                <span>
                                                    {index + 1}) {airlinename}:{" "}
                                                    {code}-{number}
                                                </span>
                                                <br />
                                            </React.Fragment>
                                        );
                                    })}
                                </>
                            ) : null}
                        </div>
                    );
                }
                return null;
            },
            editCell: (
                rowData,
                DisplayTag,
                rowUpdateCallBack,
                isDesktop,
                isColumnExpanded
            ) => {
                if (fixedRowHeight !== true) {
                    return (
                        <FlightEdit
                            rowData={rowData}
                            DisplayTag={DisplayTag}
                            rowUpdateCallBack={rowUpdateCallBack}
                        />
                    );
                }
                return null;
            },
            exportData: (rowData, isDesktop) => {
                const { flight } = rowData;
                const { flightno, date, flightdetails } = flight || {};
                const { flightclass, connectionflights } = flightdetails || {};

                const connectionFlightsArray = [];
                connectionflights.forEach((uld) => {
                    const { airlinename, airlinenumbers } = uld || {};
                    const { code, number } = airlinenumbers || {};
                    connectionFlightsArray.push(
                        `${validateData(airlinename)}: ${validateData(
                            code
                        )}-${validateData(number)}`
                    );
                });

                return [
                    {
                        header: "Flight No",
                        content: validateData(flightno)
                    },
                    {
                        header: "Flight Date",
                        content: validateData(date)
                    },
                    {
                        header: "Flight Class",
                        content: validateData(flightclass)
                    },
                    {
                        header: "Connection Flights",
                        content: connectionFlightsArray.join(", ")
                    }
                ];
            }
        },
        {
            groupHeader: "Flight & Segment",
            Header: "Segment",
            accessor: "segment",
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
            searchKeys: ["segment.from", "segment.to"],
            width: isHorizontalGrid ? 250 : 10,
            disableSortBy: true,
            displayCell: (rowData, DisplayTag, isDesktop, isColumnExpanded) => {
                const { segment } = rowData;
                if (segment) {
                    const { from, to } = segment;
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
                }
                return null;
            },
            editCell: (
                rowData,
                DisplayTag,
                rowUpdateCallBack,
                isDesktop,
                isColumnExpanded
            ) => {
                if (fixedRowHeight !== true) {
                    return (
                        <SegmentEdit
                            airportCodeList={airportCodeList}
                            rowData={rowData}
                            DisplayTag={DisplayTag}
                            rowUpdateCallBack={rowUpdateCallBack}
                        />
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
            onlyInDesktop: true,
            width: isHorizontalGrid ? 450 : 15,
            widthGrow: 1,
            disableSortBy: true,
            searchKeys: [
                "details.flightModel",
                "details.bodyType",
                "details.type",
                "details.startTime",
                "details.endTime",
                "details.status",
                "details.timeStatus"
            ],
            displayCell: (rowData, DisplayTag, isDesktop, isColumnExpanded) => {
                return (
                    <DetailsView
                        rowData={rowData}
                        DisplayTag={DisplayTag}
                        isDesktop={isDesktop}
                        isColumnExpanded={isColumnExpanded}
                        fixedRowHeight={fixedRowHeight}
                    />
                );
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
            width: isHorizontalGrid ? 250 : 10,
            sortValue: "percentage",
            searchKeys: ["weight.percentage", "weight.value"],
            displayCell: (rowData, DisplayTag, isDesktop, isColumnExpanded) => {
                const { weight } = rowData;
                if (weight) {
                    const { percentage, value } = weight;
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
            width: isHorizontalGrid ? 250 : 10,
            isSortable: true,
            sortValue: "percentage",
            searchKeys: ["volume.percentage", "volume.value"],
            displayCell: (rowData, DisplayTag, isDesktop, isColumnExpanded) => {
                const { volume } = rowData;
                if (volume) {
                    const { percentage, value } = volume;
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
            width: isHorizontalGrid ? 250 : 10,
            disableSortBy: true,
            searchKeys: ["uldPositions.*.position", "uldPositions.*.value"],
            displayCell: (rowData, DisplayTag, isDesktop, isColumnExpanded) => {
                const { uldPositions } = rowData;
                if (uldPositions && uldPositions.length > 0) {
                    return (
                        <div className="uld-details">
                            <ul>
                                {uldPositions.map((positions, index) => {
                                    const { position, value } = positions;
                                    return (
                                        <li key={index}>
                                            <DisplayTag
                                                columnKey="uldPositions"
                                                cellKey="position"
                                            >
                                                <span>{position}</span>
                                            </DisplayTag>
                                            <DisplayTag
                                                columnKey="uldPositions"
                                                cellKey="value"
                                            >
                                                <strong>{value}</strong>
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
        },
        {
            Header: "Revenue/Yield",
            accessor: "revenue",
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
            width: isHorizontalGrid ? 250 : 10,
            sortValue: "revenue",
            searchKeys: ["revenue.revenue"],
            displayCell: (rowData, DisplayTag, isDesktop, isColumnExpanded) => {
                if (rowData.revenue) {
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
                }
                return null;
            },
            exportData: (rowData, isDesktop) => {
                const revenueData = rowData ? rowData.revenue : {};
                const { revenue, yeild } = revenueData;
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
            width: isHorizontalGrid ? 100 : 10,
            isSortable: true,
            searchKeys: ["sr"],
            displayCell: (rowData, DisplayTag, isDesktop, isColumnExpanded) => {
                const { sr } = rowData;
                if (sr) {
                    return (
                        <div className="sr-details">
                            <span>{sr}</span>
                        </div>
                    );
                }
                return null;
            },
            editCell: (
                rowData,
                DisplayTag,
                rowUpdateCallBack,
                isDesktop,
                isColumnExpanded
            ) => {
                if (fixedRowHeight !== true) {
                    return (
                        <SrEdit
                            rowData={rowData}
                            rowUpdateCallBack={rowUpdateCallBack}
                        />
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
            searchKeys: ["queuedBooking.sr", "queuedBooking.volume"],
            width: isHorizontalGrid ? 250 : 10,
            disableSortBy: true,
            displayCell: (rowData, DisplayTag, isDesktop, isColumnExpanded) => {
                const { queuedBooking } = rowData;
                if (queuedBooking) {
                    const { sr, volume } = queuedBooking;
                    return (
                        <div className="queued-details">
                            <DisplayTag columnKey="queuedBooking" cellKey="sr">
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
    const [columns, setColumns] = useState([]);

    const originalColumnToExpand = {
        Header: "Remarks",
        innerCells: [
            {
                Header: "Remarks",
                accessor: "remarks",
                searchKeys: ["remarks"]
            },
            {
                Header: "Details",
                onlyInTablet: true,
                accessor: "details",
                searchKeys: [
                    "details.flightModel",
                    "details.bodyType",
                    "details.type",
                    "details.startTime",
                    "details.endTime",
                    "details.status",
                    "details.timeStatus"
                ]
            }
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
                <div className="remarks-wrap details-wrap">
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
    const [columnToExpand, setColumnToExpand] = useState(null);

    const originalParentColumn = {
        Header: "ParentColumn",
        innerCells: [
            {
                Header: "Title Id",
                accessor: "titleId"
            },
            {
                Header: "Title",
                accessor: "parentTitle"
            },
            {
                Header: "Count",
                accessor: "count"
            }
        ],
        displayCell: (rowData, isExpanded) => {
            const { parentTitle, count, lastModified, date, time } = rowData;
            return (
                <div className="parentRow">
                    <h2 className="parentRowHead">
                        {parentTitle} (
                        {isExpanded
                            ? `Expanded - ${count}`
                            : `Collapsed - ${count}`}
                        )
                    </h2>
                    <div className="parentRowInfo">
                        <span className="parentRowInfoType">
                            Last Modified : {lastModified}
                        </span>
                        <span className="parentRowInfoType">{date}</span>
                        <span className="parentRowInfoType">{time}</span>
                    </div>
                </div>
            );
        },
        exportData: (rowData, isDesktop) => {
            const { titleId, parentTitle, count } = rowData;
            return [
                {
                    header: "Title ID",
                    content: validateData(titleId)
                },
                {
                    header: "Title",
                    content: validateData(parentTitle)
                },
                {
                    header: "Total Count",
                    content: validateData(count)
                }
            ];
        }
    };
    const [parentColumn, setParentColumn] = useState(null);

    const originalSubComponentColumns = [
        {
            Header: "HAWB No",
            accessor: "hawbId",
            width: isHorizontalGrid ? 200 : 100,
            widthGrow: 1,
            isSortable: true,
            searchKeys: ["hawbId"],
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
            },
            exportData: (rowData, isDesktop) => {
                const { hawbId } = rowData;
                return [
                    {
                        header: "HAWB ID",
                        content: validateData(hawbId)
                    }
                ];
            }
        },
        {
            groupHeader: "Other Details",
            Header: "AWB Details",
            accessor: "hawb",
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
                }
            ],
            onlyInDesktop: true,
            width: isHorizontalGrid ? 800 : 400,
            displayCell: (rowData, DisplayTag, isDesktop, isColumnExpanded) => {
                const { hawb } = rowData;
                const {
                    from,
                    to,
                    goodsType,
                    hawbNo,
                    ports,
                    status,
                    std,
                    type
                } = hawb;
                const { item1, item2, item3, item4 } = std;
                if (
                    fixedRowHeight !== true &&
                    (isColumnExpanded === null || isColumnExpanded === true)
                ) {
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
                                    <DisplayTag
                                        columnKey="hawb"
                                        cellKey="status"
                                    >
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
                                    <DisplayTag
                                        columnKey="hawb"
                                        cellKey="hawbNo"
                                    >
                                        {hawbNo}
                                    </DisplayTag>
                                </li>
                                <li className="divider">|</li>
                                <li>
                                    <DisplayTag
                                        columnKey="hawb"
                                        cellKey="ports"
                                    >
                                        {ports}
                                    </DisplayTag>
                                </li>
                                <li className="divider">|</li>
                                <li>
                                    <span>
                                        <DisplayTag
                                            columnKey="hawb"
                                            cellKey="type"
                                        >
                                            {type}
                                        </DisplayTag>
                                    </span>
                                </li>
                                <li className="divider">|</li>
                                <li>
                                    <strong>{item1} </strong>
                                    <span>{item2}</span>
                                    <strong> {item3} </strong>
                                    <span>{item4}</span>
                                </li>
                            </ul>
                        </div>
                    );
                }
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
            },
            exportData: (rowData, isDesktop) => {
                const { hawb } = rowData;
                const {
                    from,
                    to,
                    goodsType,
                    hawbNo,
                    ports,
                    status,
                    std,
                    type
                } = hawb;
                const { item1, item2, item3, item4 } = std;
                return [
                    {
                        header: "HAWB Origin",
                        content: validateData(from)
                    },
                    {
                        header: "HAWB Destination",
                        content: validateData(to)
                    },
                    {
                        header: "Goods Type",
                        content: validateData(goodsType)
                    },
                    {
                        header: "HAWB No",
                        content: validateData(hawbNo)
                    },
                    {
                        header: "HAWB Ports",
                        content: validateData(ports)
                    },
                    {
                        header: "HAWB Status",
                        content: validateData(status)
                    },
                    {
                        header: "Standard Item 1",
                        content: validateData(item1)
                    },
                    {
                        header: "Standard Item 2",
                        content: validateData(item2)
                    },
                    {
                        header: "Standard Item 3",
                        content: validateData(item3)
                    },
                    {
                        header: "Standard Item 4",
                        content: validateData(item4)
                    },
                    {
                        header: "HAWB Type",
                        content: validateData(type)
                    }
                ];
            }
        },
        {
            groupHeader: "Other Details",
            Header: "SCR Details",
            accessor: "scr",
            innerCells: [
                {
                    Header: "ACK",
                    accessor: "ack"
                },
                {
                    Header: "NUM",
                    accessor: "num",
                    isSortable: true
                },
                {
                    Header: "Status",
                    accessor: "status"
                }
            ],
            width: isHorizontalGrid ? 600 : 300,
            searchKeys: ["scr.num"],
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
            },
            editCell: (
                rowData,
                DisplayTag,
                rowUpdateCallBack,
                isDesktop,
                isColumnExpanded
            ) => {
                if (fixedRowHeight !== true) {
                    return (
                        <ScrNumEdit
                            rowData={rowData}
                            rowUpdateCallBack={rowUpdateCallBack}
                        />
                    );
                }
                return null;
            },
            exportData: (rowData, isDesktop) => {
                const { scr } = rowData;
                const { ack, num, status } = scr;
                return [
                    {
                        header: "SCR Acknowledgement",
                        content: validateData(ack)
                    },
                    {
                        header: "SCR Number",
                        content: validateData(num)
                    },
                    {
                        header: "SCR Status",
                        content: validateData(status)
                    }
                ];
            }
        }
    ];
    const [subComponentColumns, setSubComponentColumns] = useState([]);

    const originalSubComponentColumnToExpand = {
        Header: "Additional Column",
        innerCells: [
            {
                Header: "Remarks",
                accessor: "remarks",
                searchKeys: ["remarks"]
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
        },
        exportData: (rowData, isDesktop) => {
            const { remarks } = rowData;
            return [
                {
                    header: "HAWB Remarks",
                    content: validateData(remarks)
                }
            ];
        }
    };
    const [
        subComponentColumnToExpand,
        setSubComponentColumnToExpand
    ] = useState(null);

    const updateData = (data, originalRow, updatedRow) => {
        return data.map((row) => {
            let newRow = row;
            if (newRow[idAttribute] === originalRow[idAttribute]) {
                newRow = updatedRow;
            }
            return newRow;
        });
    };

    const onRowUpdate = (originalRow, updatedRow, isSubComponentRow) => {
        setGridData((old) =>
            old.map((row) => {
                if (row) {
                    let rowToUpdate = { ...row };
                    if (treeStructure) {
                        const { childData } = row;
                        if (childData) {
                            const { data } = childData;
                            if (data && data.length > 0) {
                                const newData = updateData(
                                    data,
                                    originalRow,
                                    updatedRow
                                );
                                rowToUpdate.childData.data = newData;
                            }
                        }
                    } else if (
                        rowToUpdate[idAttribute] === originalRow[idAttribute]
                    ) {
                        if (isSubComponentRow) {
                            rowToUpdate.subComponentData = [
                                ...rowToUpdate.subComponentData
                            ].map((data) => {
                                let dataToUpdate = { ...data };
                                if (
                                    dataToUpdate[subComponentIdAttribute] ===
                                    updatedRow[subComponentIdAttribute]
                                ) {
                                    dataToUpdate = updatedRow;
                                }
                                return dataToUpdate;
                            });
                        } else {
                            rowToUpdate = updatedRow;
                        }
                    }
                    return rowToUpdate;
                }
                return row;
            })
        );
        setOriginalGridData((old) =>
            old.map((row) => {
                if (row) {
                    let rowToUpdate = { ...row };
                    if (treeStructure) {
                        const { childData } = row;
                        if (childData) {
                            const { data } = childData;
                            if (data && data.length > 0) {
                                const newData = updateData(
                                    data,
                                    originalRow,
                                    updatedRow
                                );
                                rowToUpdate.childData.data = newData;
                            }
                        }
                    } else if (
                        rowToUpdate[idAttribute] === originalRow[idAttribute]
                    ) {
                        if (isSubComponentRow) {
                            rowToUpdate.subComponentData = [
                                ...rowToUpdate.subComponentData
                            ].map((data) => {
                                let dataToUpdate = { ...data };
                                if (
                                    dataToUpdate[subComponentIdAttribute] ===
                                    updatedRow[subComponentIdAttribute]
                                ) {
                                    dataToUpdate = updatedRow;
                                }
                                return dataToUpdate;
                            });
                        } else {
                            rowToUpdate = updatedRow;
                        }
                    }
                    return rowToUpdate;
                }
                return row;
            })
        );
    };

    const onRowDelete = (originalRow, isSubComponentRow) => {
        if (treeStructure) {
            setGridData((old) =>
                old.map((row) => {
                    if (row) {
                        const rowToUpdate = row;
                        const { childData } = row;
                        if (childData) {
                            const { data } = childData;
                            if (data && data.length > 0) {
                                rowToUpdate.childData.data = data.filter(
                                    (dataItem) => {
                                        return (
                                            dataItem[idAttribute] !==
                                            originalRow[idAttribute]
                                        );
                                    }
                                );
                            }
                        }
                        return rowToUpdate;
                    }
                    return row;
                })
            );
            setOriginalGridData((old) =>
                old.map((row) => {
                    if (row) {
                        const rowToUpdate = row;
                        const { childData } = row;
                        if (childData) {
                            const { data } = childData;
                            if (data && data.length > 0) {
                                rowToUpdate.childData.data = data.filter(
                                    (dataItem) => {
                                        return (
                                            dataItem[idAttribute] !==
                                            originalRow[idAttribute]
                                        );
                                    }
                                );
                            }
                        }
                        return rowToUpdate;
                    }
                    return row;
                })
            );
        } else if (isSubComponentRow) {
            setGridData((old) =>
                old.map((row) => {
                    const oldRow = { ...row };
                    if (
                        oldRow &&
                        oldRow.subComponentData &&
                        oldRow.subComponentData.length > 0
                    ) {
                        oldRow.subComponentData = [
                            ...oldRow.subComponentData
                        ].filter((subRow) => {
                            return (
                                subRow[subComponentIdAttribute] !==
                                originalRow[subComponentIdAttribute]
                            );
                        });
                    }
                    return oldRow;
                })
            );
            setOriginalGridData((old) =>
                old.map((row) => {
                    const oldRow = { ...row };
                    if (
                        oldRow &&
                        oldRow.subComponentData &&
                        oldRow.subComponentData.length > 0
                    ) {
                        oldRow.subComponentData = [
                            ...oldRow.subComponentData
                        ].filter((subRow) => {
                            return (
                                subRow[subComponentIdAttribute] !==
                                originalRow[subComponentIdAttribute]
                            );
                        });
                    }
                    return oldRow;
                })
            );
        } else {
            setGridData((old) =>
                old.filter((row) => {
                    return row[idAttribute] !== originalRow[idAttribute];
                })
            );
            setOriginalGridData((old) =>
                old.filter((row) => {
                    return row[idAttribute] !== originalRow[idAttribute];
                })
            );
            if (paginationType === "index") {
                setIndexPageInfo({
                    ...indexPageInfo,
                    total: indexPageInfo.total - 1
                });
            } else {
                setCursorPageInfo({
                    ...cursorPageInfo,
                    total: indexPageInfo.total - 1
                });
            }
        }
    };

    const onSubComponentRowSelect = (selectedRows, deSelectedRows) => {
        console.log("Sub component Rows selected: ");
        console.log(selectedRows);
        console.log("Sub component Rows deselected: ");
        console.log(deSelectedRows);
    };

    const onRowSelect = (selectedRows, deSelectedRows) => {
        console.log("Rows selected: ");
        console.log(selectedRows);
        console.log("Rows deselected: ");
        console.log(deSelectedRows);
        if (allProps || passIdAttribute) {
            setUserSelectedRows(selectedRows);
            // If a row is deselected, remove that row details from 'rowsToSelect' prop value (if present).
            if (deSelectedRows && deSelectedRows.length > 0) {
                const rowExistingSelection = rowsToSelect.find((rowId) => {
                    const deselectedRow = deSelectedRows.find(
                        (row) => row.travelId === rowId
                    );
                    if (deselectedRow) {
                        return true;
                    }
                    return false;
                });
                if (rowExistingSelection) {
                    setRowsToSelect(
                        rowsToSelect.filter((rowId) => {
                            const deselectedRow = deSelectedRows.find(
                                (row) => row.travelId === rowId
                            );
                            if (deselectedRow) {
                                return false;
                            }
                            return true;
                        })
                    );
                }
            }
            // If a row is selected, remove that row details from 'rowsToDeselect' prop value (if present).
            if (selectedRows && selectedRows.length > 0) {
                const rowExistingDeselection = rowsToDeselect.find((rowId) => {
                    const selectedRow = selectedRows.find(
                        (row) => row.travelId === rowId
                    );
                    if (selectedRow) {
                        return true;
                    }
                    return false;
                });
                if (rowExistingDeselection) {
                    setRowsToDeselect(
                        rowsToDeselect.filter((rowId) => {
                            const selectedRow = selectedRows.find(
                                (row) => row.travelId === rowId
                            );
                            if (selectedRow) {
                                return false;
                            }
                            return true;
                        })
                    );
                }
            }
        }
    };

    const onGridRefresh = () => {
        console.log("Grid Refreshed");
    };

    const bindRowEditOverlay = (rowData, isSubComponentRow) => {
        setRowDataToEdit(rowData);
        setIsEditOverlayOpened(true);
        setIsSubComponentRowForEditAndDelete(isSubComponentRow);
    };
    const unbindRowEditOverlay = () => {
        setRowDataToEdit(null);
        setIsEditOverlayOpened(false);
        setIsSubComponentRowForEditAndDelete(false);
    };

    const bindRowDeleteOverlay = (rowData, isSubComponentRow) => {
        setRowDataToDelete(rowData);
        setIsDeleteOverlayOpened(true);
        setIsSubComponentRowForEditAndDelete(isSubComponentRow);
    };
    const unbindRowDeleteOverlay = () => {
        setRowDataToDelete(null);
        setIsDeleteOverlayOpened(false);
        setIsSubComponentRowForEditAndDelete(false);
    };

    const rowActions = (rowData, closeOverlay, isSubComponentRow) => {
        return (
            <RowAction
                rowData={rowData}
                isSubComponentRow={isSubComponentRow}
                fixedRowHeight={fixedRowHeight}
                closeOverlay={closeOverlay}
                bindRowEditOverlay={bindRowEditOverlay}
                bindRowDeleteOverlay={bindRowDeleteOverlay}
            />
        );
    };

    const loadMoreData = (updatedPageInfo, parentId) => {
        if (parentId !== null && parentId !== undefined) {
            // Tree structure
            if (updatedPageInfo !== null && updatedPageInfo !== undefined) {
                // Next page loading
                const pageInfoForApi = { ...updatedPageInfo };
                if (paginationType === "cursor") {
                    pageInfoForApi.endCursor += pageInfoForApi.pageSize;
                }
                fetchData(pageInfoForApi).then((apiData) => {
                    if (apiData && apiData.length > 0) {
                        const updatedGridData = gridData.map((dataItem) => {
                            const updatedData = dataItem;
                            if (
                                updatedData[parentIdAttribute] === parentId &&
                                updatedData.childData &&
                                updatedData.childData.data &&
                                updatedData.childData.data.length > 0
                            ) {
                                updatedData.childData.data = [
                                    ...updatedData.childData.data,
                                    ...apiData
                                ];
                                if (paginationType === "index") {
                                    updatedData.childData.pageNum =
                                        pageInfoForApi.pageNum;
                                    if (
                                        pageInfoForApi.pageNum ===
                                        (parentId + 1) * 10
                                    ) {
                                        updatedData.childData.lastPage = true;
                                    }
                                } else {
                                    updatedData.childData.endCursor =
                                        pageInfoForApi.endCursor;
                                    if (
                                        pageInfoForApi.endCursor ===
                                        (parentId + 1) *
                                            10 *
                                            pageInfoForApi.pageSize -
                                            1
                                    ) {
                                        updatedData.childData.lastPage = true;
                                    }
                                }
                            }
                            return updatedData;
                        });
                        setGridData(updatedGridData);
                        setOriginalGridData(updatedGridData);
                    }
                });
            } else {
                // First load
                const currentPageNum = parentId * 10 + 1;
                const pageInfoForApi =
                    paginationType === "index"
                        ? {
                              pageNum: currentPageNum,
                              pageSize: gridPageSize
                          }
                        : {
                              endCursor: currentPageNum * gridPageSize - 1,
                              pageSize: gridPageSize
                          };

                fetchData(pageInfoForApi).then((apiData) => {
                    if (apiData && apiData.length > 0) {
                        const updatedGridData = gridData.map((dataItem) => {
                            const updatedData = dataItem;
                            if (updatedData[parentIdAttribute] === parentId) {
                                updatedData.childData = {
                                    pageNum: currentPageNum,
                                    pageSize: gridPageSize,
                                    lastPage: parentId === 2,
                                    data: apiData
                                };
                                if (paginationType === "index") {
                                    updatedData.childData.pageNum =
                                        pageInfoForApi.pageNum;
                                } else {
                                    updatedData.childData.endCursor =
                                        pageInfoForApi.endCursor;
                                }
                            }
                            return updatedData;
                        });
                        setGridData(updatedGridData);
                        setOriginalGridData(updatedGridData);
                    }
                });
            }
        } else {
            const info = { ...updatedPageInfo };
            if (paginationType === "cursor") {
                info.endCursor += info.pageSize;
            }
            fetchData(info).then((data) => {
                if (data && data.length > 0) {
                    let isThisReload = false;
                    if (paginationType === "index") {
                        isThisReload = loadedPages.current.includes(
                            info.pageNum
                        );
                    } else {
                        isThisReload = loadedEndCursors.current.includes(
                            info.endCursor
                        );
                    }
                    if (isSubComponentGrid) {
                        let pageNumner =
                            info.pageNum ||
                            Math.ceil(info.endCursor / gridPageSize);
                        if (pageNumner > 15) {
                            pageNumner -= 15;
                        }
                        fetchSubComponentData({
                            pageNum: pageNumner,
                            pageSize: gridPageSize
                        }).then((subComponentData) => {
                            if (
                                subComponentData &&
                                subComponentData.length > 0
                            ) {
                                const updatedData = [...data].map(
                                    (item, itemIndex) => {
                                        const updatedItem = { ...item };
                                        if (itemIndex % 10 !== 0) {
                                            const { travelId } = updatedItem;
                                            let subCompData = subComponentData.filter(
                                                (ite, ind) =>
                                                    ind >= itemIndex &&
                                                    ind <
                                                        itemIndex +
                                                            Math.floor(
                                                                Math.random() *
                                                                    11
                                                            )
                                            );
                                            subCompData = subCompData.map(
                                                (dat) => {
                                                    const updatedDat = {
                                                        ...dat
                                                    };
                                                    updatedDat.travelId = travelId;
                                                    return updatedDat;
                                                }
                                            );
                                            updatedItem.subComponentData = subCompData;
                                        }
                                        return updatedItem;
                                    }
                                );
                                if (isThisReload) {
                                    const updatedGridData = [...gridData].map(
                                        (dataItem) => {
                                            let updatedDataItem = {
                                                ...dataItem
                                            };
                                            if (updatedDataItem) {
                                                const newDataItem = updatedData.find(
                                                    (item) => {
                                                        return (
                                                            item[
                                                                idAttribute
                                                            ] ===
                                                            updatedDataItem[
                                                                idAttribute
                                                            ]
                                                        );
                                                    }
                                                );
                                                if (newDataItem) {
                                                    updatedDataItem = newDataItem;
                                                }
                                            }
                                            return updatedDataItem;
                                        }
                                    );
                                    const updatedOriginalGridData = [
                                        ...originalGridData
                                    ].map((dataItem) => {
                                        let updatedDataItem = { ...dataItem };
                                        if (updatedDataItem) {
                                            const newDataItem = updatedData.find(
                                                (item) => {
                                                    return (
                                                        item[idAttribute] ===
                                                        updatedDataItem[
                                                            idAttribute
                                                        ]
                                                    );
                                                }
                                            );
                                            if (newDataItem) {
                                                updatedDataItem = newDataItem;
                                            }
                                        }
                                        return updatedDataItem;
                                    });
                                    setGridData(
                                        getSortedData(
                                            updatedGridData,
                                            sortOptions
                                        )
                                    );
                                    setOriginalGridData(
                                        updatedOriginalGridData
                                    );
                                } else {
                                    if (paginationType === "index") {
                                        const thisPageList = [
                                            ...loadedPages.current
                                        ];
                                        thisPageList.push(info.pageNum);
                                        loadedPages.current = [...thisPageList];
                                    } else {
                                        const thisCursorList = [
                                            ...loadedEndCursors.current
                                        ];
                                        thisCursorList.push(info.endCursor);
                                        loadedEndCursors.current = [
                                            ...thisCursorList
                                        ];
                                    }
                                    setGridData(
                                        getSortedData(
                                            gridData.concat(updatedData),
                                            sortOptions
                                        )
                                    );
                                    setOriginalGridData(
                                        originalGridData.concat(updatedData)
                                    );
                                }
                                if (paginationType === "index") {
                                    const isReloadRequired =
                                        previousPageRefresh === true &&
                                        !(
                                            reloadedPages &&
                                            reloadedPages.current &&
                                            reloadedPages.current.includes(
                                                info.pageNum
                                            )
                                        ) &&
                                        info.pageNum % 3 === 0;
                                    if (
                                        isReloadRequired &&
                                        reloadedPages &&
                                        reloadedPages.current
                                    ) {
                                        reloadedPages.current = [
                                            ...reloadedPages.current,
                                            info.pageNum
                                        ];
                                    }
                                    setIndexPageInfo({
                                        ...indexPageInfo,
                                        pageNum: info.pageNum,
                                        total: isReloadRequired
                                            ? indexPageInfo.total + 1
                                            : indexPageInfo.total
                                    });
                                } else {
                                    const cursorPageNum =
                                        (info.endCursor + 1) / gridPageSize;
                                    const isReloadRequired =
                                        previousPageRefresh === true &&
                                        !(
                                            reloadedPages &&
                                            reloadedPages.current &&
                                            reloadedPages.current.includes(
                                                cursorPageNum
                                            )
                                        ) &&
                                        cursorPageNum % 3 === 0;
                                    if (
                                        isReloadRequired &&
                                        reloadedPages &&
                                        reloadedPages.current
                                    ) {
                                        reloadedPages.current = [
                                            ...reloadedPages.current,
                                            cursorPageNum
                                        ];
                                    }
                                    setCursorPageInfo({
                                        ...cursorPageInfo,
                                        endCursor: info.endCursor,
                                        total: isReloadRequired
                                            ? cursorPageInfo.total + 1
                                            : cursorPageInfo.total
                                    });
                                }
                            }
                        });
                    } else {
                        if (isThisReload) {
                            const updatedGridData = [...gridData].map(
                                (dataItem) => {
                                    let updatedDataItem = { ...dataItem };
                                    if (updatedDataItem) {
                                        const newDataItem = data.find(
                                            (item) => {
                                                return (
                                                    item[idAttribute] ===
                                                    updatedDataItem[idAttribute]
                                                );
                                            }
                                        );
                                        if (newDataItem) {
                                            updatedDataItem = newDataItem;
                                        }
                                    }
                                    return updatedDataItem;
                                }
                            );
                            const updatedOriginalGridData = [
                                ...originalGridData
                            ].map((dataItem) => {
                                let updatedDataItem = { ...dataItem };
                                if (updatedDataItem) {
                                    const newDataItem = data.find((item) => {
                                        return (
                                            item[idAttribute] ===
                                            updatedDataItem[idAttribute]
                                        );
                                    });
                                    if (newDataItem) {
                                        updatedDataItem = newDataItem;
                                    }
                                }
                                return updatedDataItem;
                            });
                            setGridData(
                                getSortedData(updatedGridData, sortOptions)
                            );
                            setOriginalGridData(updatedOriginalGridData);
                        } else {
                            if (paginationType === "index") {
                                const thisPageList = [...loadedPages.current];
                                thisPageList.push(info.pageNum);
                                loadedPages.current = [...thisPageList];
                            } else {
                                const thisCursorList = [
                                    ...loadedEndCursors.current
                                ];
                                thisCursorList.push(info.endCursor);
                                loadedEndCursors.current = [...thisCursorList];
                            }
                            setGridData(
                                getSortedData(
                                    gridData.concat(data),
                                    sortOptions
                                )
                            );
                            setOriginalGridData(originalGridData.concat(data));
                        }
                        if (paginationType === "index") {
                            const isReloadRequired =
                                previousPageRefresh === true &&
                                !(
                                    reloadedPages &&
                                    reloadedPages.current &&
                                    reloadedPages.current.includes(info.pageNum)
                                ) &&
                                info.pageNum % 3 === 0;
                            if (
                                isReloadRequired &&
                                reloadedPages &&
                                reloadedPages.current
                            ) {
                                reloadedPages.current = [
                                    ...reloadedPages.current,
                                    info.pageNum
                                ];
                            }
                            setIndexPageInfo({
                                ...indexPageInfo,
                                pageNum: info.pageNum,
                                total: isReloadRequired
                                    ? indexPageInfo.total + 1
                                    : indexPageInfo.total
                            });
                        } else {
                            const cursorPageNum =
                                (info.endCursor + 1) / gridPageSize;
                            const isReloadRequired =
                                previousPageRefresh === true &&
                                !(
                                    reloadedPages &&
                                    reloadedPages.current &&
                                    reloadedPages.current.includes(
                                        cursorPageNum
                                    )
                                ) &&
                                cursorPageNum % 3 === 0;
                            if (
                                isReloadRequired &&
                                reloadedPages &&
                                reloadedPages.current
                            ) {
                                reloadedPages.current = [
                                    ...reloadedPages.current,
                                    cursorPageNum
                                ];
                            }
                            setCursorPageInfo({
                                ...cursorPageInfo,
                                endCursor: info.endCursor,
                                total: isReloadRequired
                                    ? cursorPageInfo.total + 1
                                    : cursorPageInfo.total
                            });
                        }
                    }
                } else if (paginationType === "index") {
                    setIndexPageInfo({
                        ...indexPageInfo,
                        pageNum: info.pageNum,
                        lastPage: true
                    });
                } else {
                    setCursorPageInfo({
                        ...cursorPageInfo,
                        endCursor: info.endCursor,
                        lastPage: true
                    });
                }
            });
        }
    };

    const serverSideSorting = (groupSortOptions) => {
        console.log("Server side sort", groupSortOptions);
        if (groupSortOptions && groupSortOptions.length > 0) {
            setSortOptions(groupSortOptions);
            setGridData(getSortedData([...gridData], groupSortOptions));
        } else {
            setSortOptions([]);
            setGridData(originalGridData);
        }
    };

    useEffect(() => {
        const mappedOriginalColumns = originalColumns.map((column) => {
            const updatedColumn = column;
            if (!(allProps || enableGroupHeaders) && column.groupHeader) {
                delete updatedColumn.groupHeader;
            }
            if (!(allProps || enableJsxHeaders) && column.title) {
                // We know that jsx Header is been provided only for Flight column
                // Hence update the Header value to string "Flight" and delete title
                updatedColumn.Header = "Flight";
                delete updatedColumn.title;
            }
            return updatedColumn;
        });
        if (treeStructure) {
            if (
                parentRowExpandable !== false &&
                isParentExpandedByDefault !== true
            ) {
                setGridData(parentData);
                setOriginalGridData(parentData);
                setParentColumn(originalParentColumn);
                setColumns(mappedOriginalColumns);
                setColumnToExpand(originalColumnToExpand);
                setIndexPageInfo(null);
                setCursorPageInfo(null);
            } else {
                const newPageSize = 5;
                const newGridData = [...parentData];
                fetchData({ pageNum: 1, pageSize: newPageSize }).then(
                    (firstData) => {
                        if (firstData && firstData.length > 0) {
                            newGridData[0].childData = {
                                pageNum: 1,
                                pageSize: newPageSize,
                                lastPage: false,
                                data: firstData
                            };
                        }
                        fetchData({ pageNum: 11, pageSize: newPageSize }).then(
                            (secondData) => {
                                if (secondData && secondData.length > 0) {
                                    newGridData[1].childData = {
                                        pageNum: 11,
                                        pageSize: newPageSize,
                                        lastPage: false,
                                        data: secondData
                                    };
                                }
                                fetchData({
                                    pageNum: 21,
                                    pageSize: newPageSize
                                }).then((thirdData) => {
                                    if (thirdData && thirdData.length > 0) {
                                        newGridData[2].childData = {
                                            pageNum: 21,
                                            pageSize: newPageSize,
                                            lastPage: false,
                                            data: thirdData
                                        };
                                    }
                                    setGridData(newGridData);
                                    setOriginalGridData(newGridData);
                                    setParentColumn(originalParentColumn);
                                    setColumns(mappedOriginalColumns);
                                    setColumnToExpand(originalColumnToExpand);
                                    setIndexPageInfo(null);
                                    setCursorPageInfo(null);
                                });
                            }
                        );
                    }
                );
            }
        } else {
            const pageInfo =
                paginationType === "index" ? indexPageInfo : cursorPageInfo;
            fetchData(pageInfo).then((data) => {
                if (data && data.length > 0) {
                    let defaultSelectedRows = [];
                    const rowsForSelectionProps =
                        rowsForSelection && rowsForSelection.length > 0
                            ? rowsForSelection
                            : [];
                    if (
                        rowsForSelectionProps &&
                        rowsForSelectionProps.length > 0
                    ) {
                        defaultSelectedRows = data.filter((initialData) => {
                            const { travelId } = initialData;
                            return rowsForSelectionProps.includes(travelId);
                        });
                    }
                    if (isSubComponentGrid) {
                        let pageNumner =
                            pageInfo.pageNum ||
                            Math.ceil(pageInfo.endCursor / gridPageSize);
                        if (pageNumner > 15) {
                            pageNumner -= 15;
                        }
                        fetchSubComponentData({
                            pageNum: pageNumner,
                            pageSize: gridPageSize
                        }).then((subComponentData) => {
                            if (
                                subComponentData &&
                                subComponentData.length > 0
                            ) {
                                const updatedData = [...data].map(
                                    (item, itemIndex) => {
                                        const updatedItem = { ...item };
                                        if (itemIndex % 10 !== 0) {
                                            const { travelId } = updatedItem;
                                            let subCompData = subComponentData.filter(
                                                (ite, ind) =>
                                                    ind >= itemIndex &&
                                                    ind <
                                                        itemIndex +
                                                            Math.floor(
                                                                Math.random() *
                                                                    11
                                                            )
                                            );
                                            subCompData = subCompData.map(
                                                (dat) => {
                                                    const updatedDat = {
                                                        ...dat
                                                    };
                                                    updatedDat.travelId = travelId;
                                                    return updatedDat;
                                                }
                                            );
                                            updatedItem.subComponentData = subCompData;
                                        }
                                        return updatedItem;
                                    }
                                );
                                if (paginationType === "index") {
                                    loadedPages.current = [
                                        indexPageInfo.pageNum
                                    ];
                                } else {
                                    loadedEndCursors.current = [
                                        cursorPageInfo.endCursor
                                    ];
                                }
                                setGridData(updatedData);
                                setOriginalGridData(updatedData);
                                setSubComponentColumns(
                                    originalSubComponentColumns
                                );
                                setSubComponentColumnToExpand(
                                    originalSubComponentColumnToExpand
                                );
                                setColumns(mappedOriginalColumns);
                                setColumnToExpand(originalColumnToExpand);
                                setRowsToSelect(rowsForSelectionProps);
                                setUserSelectedRows(defaultSelectedRows);
                            }
                        });
                    } else {
                        if (paginationType === "index") {
                            loadedPages.current = [indexPageInfo.pageNum];
                        } else {
                            loadedEndCursors.current = [
                                cursorPageInfo.endCursor
                            ];
                        }
                        setGridData(data);
                        setOriginalGridData(data);
                        setColumns(mappedOriginalColumns);
                        setColumnToExpand(originalColumnToExpand);
                        setRowsToSelect(rowsForSelectionProps);
                        setUserSelectedRows(defaultSelectedRows);
                    }
                } else if (paginationType === "index") {
                    setIndexPageInfo({
                        ...indexPageInfo,
                        lastPage: true
                    });
                } else {
                    setCursorPageInfo({
                        ...cursorPageInfo,
                        lastPage: true
                    });
                }
            });
        }
    }, []);

    const removeRowSelection = (event) => {
        const rowId = event.currentTarget.dataset.id;
        setRowsToDeselect([Number(rowId)]);
        // If a row is deselected, remove that row details from 'rowsToSelect' prop value (if present).
        setRowsToSelect(
            rowsToSelect.filter((selectedRowId) => {
                return selectedRowId !== Number(rowId);
            })
        );
        // Update local state based on updated rowsToSelect
        setUserSelectedRows(
            userSelectedRows.filter((row) => {
                const { travelId } = row;
                return travelId !== Number(rowId);
            })
        );
    };

    const theme = "portal";

    const gridPageInfo =
        paginationType === "index" ? indexPageInfo : cursorPageInfo;

    const getRowInfo = (rowData, isSubComponentRow) => {
        if (isSubComponentRow) {
            const { hawbId } = rowData;
            return {
                isRowExpandable: hawbId % 2 === 0,
                isRowSelectable: hawbId % 3 !== 0,
                className: hawbId % 5 === 0 ? "disabled" : ""
            };
        }
        const { travelId } = rowData;
        return {
            isRowExpandable: travelId % 2 === 0,
            isRowSelectable: travelId % 3 !== 0,
            className: travelId % 10 === 0 ? "disabled" : ""
        };
    };

    if (gridData && gridData.length > 0 && columns && columns.length > 0) {
        return (
            <div className="screen-container">
                <div className="selectedRows">
                    {userSelectedRows.map((row) => {
                        return (
                            <div className="selectedRow" key={row.travelId}>
                                <p>Travel Id : {row.travelId}</p>
                                <button
                                    type="button"
                                    onClick={removeRowSelection}
                                    data-id={row.travelId}
                                >
                                    Remove
                                </button>
                            </div>
                        );
                    })}
                </div>
                {isEditOverlayOpened && rowDataToEdit !== null ? (
                    <div className="overlay">
                        {isSubComponentRowForEditAndDelete === true ? (
                            <SubRowEdit
                                rowData={rowDataToEdit}
                                airportCodeList={airportCodeList}
                                onRowUpdate={onRowUpdate}
                                unbindRowEditOverlay={unbindRowEditOverlay}
                            />
                        ) : (
                            <RowEdit
                                rowData={rowDataToEdit}
                                airportCodeList={airportCodeList}
                                onRowUpdate={onRowUpdate}
                                unbindRowEditOverlay={unbindRowEditOverlay}
                            />
                        )}
                    </div>
                ) : null}
                {isDeleteOverlayOpened && rowDataToDelete !== null ? (
                    <div className="overlay">
                        <RowDelete
                            rowData={rowDataToDelete}
                            isSubComponentRowForEditAndDelete={
                                isSubComponentRowForEditAndDelete
                            }
                            onRowDelete={onRowDelete}
                            unbindRowDeleteOverlay={unbindRowDeleteOverlay}
                        />
                    </div>
                ) : null}
                <Grid
                    className={className}
                    theme={passTheme ? theme : null}
                    title={title}
                    gridWidth={gridWidth}
                    gridData={gridData}
                    rowsToOverscan={isSubComponentGrid ? 5 : rowsToOverscan}
                    idAttribute={allProps || passIdAttribute ? idAttribute : ""}
                    paginationType={
                        allProps || hasPagination ? paginationType : null
                    }
                    pageInfo={allProps || hasPagination ? gridPageInfo : null}
                    loadMoreData={loadMoreData}
                    serverSideSorting={
                        enableServersideSorting ? serverSideSorting : null
                    }
                    columns={columns}
                    columnToExpand={
                        (allProps && fixedRowHeight !== true) ||
                        passColumnToExpand
                            ? columnToExpand
                            : null
                    }
                    parentColumn={treeStructure ? parentColumn : null}
                    parentIdAttribute={treeStructure ? parentIdAttribute : null}
                    parentRowExpandable={
                        treeStructure === true && parentRowExpandable === false
                            ? parentRowExpandable
                            : null
                    }
                    parentRowsToExpand={
                        parentRowsToExpand && parentRowsToExpand.length > 0
                            ? parentRowsToExpand
                            : null
                    }
                    subComponentColumns={subComponentColumns}
                    subComponentColumnToExpand={subComponentColumnToExpand}
                    subComponentIdAttribute={
                        allProps || passIdAttribute
                            ? subComponentIdAttribute
                            : ""
                    }
                    onSubComponentRowSelect={onSubComponentRowSelect}
                    subComponentHeader={subComponentHeader}
                    rowActions={allProps || passRowActions ? rowActions : null}
                    expandableColumn={
                        (allProps && fixedRowHeight !== true) ||
                        expandableColumn
                    }
                    onRowUpdate={onRowUpdate}
                    onRowSelect={onRowSelect}
                    getRowInfo={allProps || passGetRowInfo ? getRowInfo : null}
                    onGridRefresh={
                        allProps || passOnGridRefresh ? onGridRefresh : null
                    }
                    CustomPanel={CustomPanel}
                    rowsToSelect={rowsToSelect}
                    rowsToDeselect={rowsToDeselect}
                    fixedRowHeight={fixedRowHeight}
                    multiRowSelection={multiRowSelection}
                    gridHeader={allProps || gridHeader}
                    showTitle={allProps || showTitle}
                    rowSelector={allProps || rowSelector}
                    globalSearch={allProps || globalSearch}
                    columnFilter={allProps || columnFilter}
                    groupSort={allProps || groupSort}
                    columnChooser={allProps || columnChooser}
                    exportData={allProps || exportData}
                    fileName={fileName || null}
                    pdfPaperSize={pdfPaperSize || null}
                    enablePinColumn={passPinColumn || false}
                />
            </div>
        );
    }
    return (
        <h2 style={{ textAlign: "center", marginTop: "70px" }}>
            Initializing Grid...
        </h2>
    );
};

export default GridComponent;
