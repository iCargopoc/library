/* eslint-disable no-undef */
import React from "react";
import { render, cleanup, fireEvent, waitFor } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import "@testing-library/jest-dom/extend-expect";
import Grid from "../src/index";

describe("test passing pinLeft and display of column by default", () => {
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
        Object.defineProperty(window, "innerWidth", {
            configurable: true,
            value: width
        });
    }

    const dafaultsForSingleCols = [
        {
            Header: "Id",
            accessor: "travelId",
            pinLeft: true,
            width: 50,
            displayCell: () => {
                return <span>Id</span>;
            }
        },
        {
            groupHeader: "Flight & Segment",
            Header: "Flight",
            accessor: "flight",
            width: 100,
            displayCell: () => {
                return <span>Flight</span>;
            }
        },
        {
            groupHeader: "Flight & Segment",
            Header: "Segment",
            accessor: "segment",
            display: false,
            width: 100,
            displayCell: () => {
                return <span>Segment</span>;
            }
        },
        {
            Header: "SR",
            accessor: "sr",
            display: false,
            width: 90,
            displayCell: () => {
                return <span>SR</span>;
            }
        }
    ];

    const pinLeftGroupedCols = [
        {
            Header: "Id",
            accessor: "travelId",
            width: 50,
            displayCell: () => {
                return <span>Id</span>;
            }
        },
        {
            groupHeader: "Flight & Segment",
            Header: "Flight",
            accessor: "flight",
            width: 100,
            pinLeft: true,
            displayCell: () => {
                return <span>Flight</span>;
            }
        },
        {
            groupHeader: "Flight & Segment",
            Header: "Segment",
            accessor: "segment",
            width: 100,
            displayCell: () => {
                return <span>Segment</span>;
            }
        },
        {
            Header: "SR",
            accessor: "sr",
            display: false,
            width: 90,
            displayCell: () => {
                return <span>SR</span>;
            }
        }
    ];

    const data = [];
    for (let i = 0; i < 5; i++) {
        data.push({
            travelId: i,
            flight: {
                flightno: "XX2225",
                date: "31-Aug-2016"
            },
            segment: {
                from: "AAA",
                to: "ZZZ"
            },
            sr: "74/ AWBs"
        });
    }

    it("test grid with default display=false and pinLeft=true only for single column", async () => {
        mockOffsetSize(600, 600);
        const { container, getByTestId, getAllByTestId } = render(
            <Grid
                gridData={data}
                idAttribute="travelId"
                columns={dafaultsForSingleCols}
                enablePinColumn
                rowSelector={false}
            />
        );
        const gridContainer = container;

        // Check if Grid id rendered.
        expect(gridContainer).toBeInTheDocument();

        // Check number of columns - 2 (2 columns are hidden)
        expect(getAllByTestId("grid-header").length).toBe(2);

        // Check pinned columns count - 1
        const gridHeader = getByTestId("grid-headersList");
        const stickyHeaderColumns = gridHeader.querySelectorAll(
            ".ng-sticky--left"
        );
        expect(stickyHeaderColumns.length).toBe(1);
    });

    it("test grid with default pinLeft=true in one of the grouped columns", async () => {
        mockOffsetSize(600, 600);
        const { container, getByTestId } = render(
            <Grid
                gridData={data}
                idAttribute="travelId"
                columns={pinLeftGroupedCols}
                enablePinColumn
                rowSelector={false}
            />
        );
        const gridContainer = container;

        // Check if Grid id rendered.
        expect(gridContainer).toBeInTheDocument();

        // Check pinned columns count - 2 (2 columns in grouped columns)
        const gridHeader = getByTestId("grid-headersList");
        const stickyHeaderColumns = gridHeader.querySelectorAll(
            ".ng-sticky--left"
        );
        expect(stickyHeaderColumns.length).toBe(2);
    });
});
