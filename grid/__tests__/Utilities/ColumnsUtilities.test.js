/* eslint-disable no-undef */
import React from "react";
import {
    extractColumns,
    extractAdditionalColumn
} from "../../src/Utilities/ColumnsUtilities";

const mockFlightDisplayCell = jest.fn((rowData, DisplayTag) => {
    const { flightno, date } = rowData.flight;
    return (
        <div className="flight-details">
            <DisplayTag cellKey="flightno" columnKey="flight">
                <strong>{flightno}</strong>
            </DisplayTag>
            <DisplayTag columnKey="flight" cellKey="date">
                <span>{date}</span>
            </DisplayTag>
        </div>
    );
});
const mockFlightEditCell = jest.fn((rowData, DisplayTag, rowUpdateCallBack) => {
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
const mockSegmentDisplayCell = jest.fn((rowData, DisplayTag) => {
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
});
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
        displayCell: mockFlightDisplayCell,
        editCell: mockFlightEditCell
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
        displayCell: mockSegmentDisplayCell
    }
];
const additionalColumn = {
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
        } = details;
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
                            <span>{timeStatus}</span>
                        </li>
                    </ul>
                </DisplayTag>
            </div>
        );
    }
};
const searchColumn = jest.fn();
const isDesktop = false;
const updateRowInGrid = jest.fn();
test("Test extractColumns", () => {
    const mockExtractColumns = jest.fn().mockImplementation(extractColumns);
    mockExtractColumns(columns, searchColumn, isDesktop, updateRowInGrid);
    expect(mockExtractColumns).toHaveBeenCalled();
});

test("Test extractAdditionalColumn", () => {
    const mockExtractColumns = jest
        .fn()
        .mockImplementation(extractAdditionalColumn);
    mockExtractColumns(additionalColumn, isDesktop);
    expect(mockExtractColumns).toHaveBeenCalled();
});

test("Test empty extractAdditionalColumn", () => {
    const mockExtractColumns = jest
        .fn()
        .mockImplementation(extractAdditionalColumn);
    mockExtractColumns(undefined, isDesktop);
    expect(mockExtractColumns).toHaveBeenCalled();
});
