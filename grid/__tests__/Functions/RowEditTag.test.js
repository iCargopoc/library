/* eslint-disable no-undef */
import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import RowEditTag from "../../src/Functions/RowEditTag";
import { RowEditContext } from "../../src/Utilities/TagsContext";

const columnsdata = [
    {
        Header: "Id",
        accessor: "travelId",
        width: 50,
        disableFilters: true,
        columnId: "column_0"
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
        columnId: "column_1",
        originalInnerCells: [
            {
                Header: "Flight No",
                accessor: "flightno"
            },
            {
                Header: "Date",
                accessor: "date"
            }
        ]
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
        columnId: "column_2",
        originalInnerCells: [
            {
                Header: "From",
                accessor: "from"
            },
            {
                Header: "To",
                accessor: "to"
            }
        ]
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
        columnId: "column_3",
        originalInnerCells: [
            {
                Header: "Percentage",
                accessor: "percentage"
            },
            {
                Header: "Value",
                accessor: "value"
            }
        ]
    }
];

const additionalColumndata = {
    Header: "Remarks",
    innerCells: [
        {
            Header: "Remarks",
            accessor: "remarks"
        },
        {
            Header: "Details",
            accessor: "details"
        }
    ],
    columnId: "ExpandColumn",
    originalInnerCells: [
        {
            Header: "Remarks",
            accessor: "remarks"
        },
        {
            Header: "Details",
            accessor: "details"
        }
    ]
};

test("should render", () => {
    const componnet = render(
        <RowEditContext.Provider
            value={{
                columns: columnsdata,
                additionalColumn: additionalColumndata,
                isRowExpandEnabled: false
            }}
        >
            <RowEditTag columnKey="flight" cellKey="flightno" />
        </RowEditContext.Provider>
    );
    expect(componnet).toBeDefined();
});
test("should render expanded content", () => {
    const componnet = render(
        <RowEditContext.Provider
            value={{
                columns: columnsdata,
                additionalColumn: additionalColumndata,
                isRowExpandEnabled: true
            }}
        >
            <RowEditTag columnKey="remarks" cellKey="remarks" />
        </RowEditContext.Provider>
    );
    expect(componnet).toBeDefined();
});
test("should render without cellkey ReactDOM", () => {
    const componnet = render(
        <RowEditContext.Provider
            value={{
                columns: columnsdata,
                additionalColumn: additionalColumndata,
                isRowExpandEnabled: false
            }}
        >
            <RowEditTag columnKey="flight" />
        </RowEditContext.Provider>
    );
    expect(componnet).toBeDefined();
});

test("should render without Columns", () => {
    const componnet = render(
        <RowEditContext.Provider
            value={{
                columns: null,
                additionalColumn: additionalColumndata,
                isRowExpandEnabled: false
            }}
        >
            <RowEditTag columnKey="flight" />
        </RowEditContext.Provider>
    );
    expect(componnet).toBeDefined();
});
