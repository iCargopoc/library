/* eslint-disable no-undef */
import React from "react";
import { render, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { CellDisplayAndEditContext } from "../../src/Utilities/TagsContext";
import CellDisplayAndEditTag from "../../src/Functions/CellDisplayAndEditTag";

describe("CellDisplayAndEditTag unit test", () => {
    const columnsMockData = [
        {
            Header: "Id",
            accessor: "travelId",
            width: 50,
            disableFilters: true,
            columnId: "column_0",
            displayInExpandedRegion: false
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
            displayInExpandedRegion: false,
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
        }
    ];
    const columnMockData = {
        id: "flight",
        depth: 0,
        innerCells: [
            { Header: "Flight No", accessor: "flightno" },
            { Header: "Date", accessor: "date" }
        ],
        isVisible: true,
        originalInnerCells: [
            { Header: "Flight No", accessor: "flightno" },
            { Header: "Date", accessor: "date" }
        ]
    };

    let container;
    beforeEach(() => {
        container = document.createElement("div");
        document.body.appendChild(container);
    });
    afterEach(cleanup);
    it("should renders component with cellkey and columnkey", () => {
        const componnet = render(
            <CellDisplayAndEditContext.Provider
                value={{
                    column: columnMockData,
                    columns: columnsMockData
                }}
            >
                <CellDisplayAndEditTag columnKey="flight" cellKey="flightno" />
            </CellDisplayAndEditContext.Provider>,
            container
        );
        expect(componnet).toBeDefined();
    });
    it("should renders component with cellkey only", () => {
        const componnet = render(
            <CellDisplayAndEditContext.Provider
                value={{
                    column: columnMockData,
                    columns: columnsMockData
                }}
            >
                <CellDisplayAndEditTag cellKey="flightno" />
            </CellDisplayAndEditContext.Provider>,
            container
        );
        expect(componnet).toBeDefined();
    });
    it("should return null when cellkey and columnkey is not passed", () => {
        const componnet = render(
            <CellDisplayAndEditContext.Provider
                value={{
                    column: columnMockData,
                    columns: columnsMockData
                }}
            >
                <CellDisplayAndEditTag />
            </CellDisplayAndEditContext.Provider>,
            container
        );
        expect(componnet).toBeDefined();
    });
});
