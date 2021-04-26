/* eslint-disable no-undef */
import React, { useState, useEffect } from "react";
import { render, cleanup, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
/* eslint-disable no-unused-vars */
import regeneratorRuntime from "regenerator-runtime";
import { act } from "react-dom/test-utils";
import Grid from "../src/index";

const GridScreen = (props) => {
    const { paginationType, isLastPageEmpty } = props;
    const [gridData, setGridData] = useState([]);
    const isIndexBasedPagination = paginationType === "index";
    const firstPageInfo = isIndexBasedPagination
        ? {
              pageNum: 1,
              pageSize: 2,
              total: 10,
              lastPage: false
          }
        : {
              endCursor: 1,
              pageSize: 2,
              total: 10,
              lastPage: false
          };
    const [pageInfo, setPageInfo] = useState(null);

    const gridColumns = [
        {
            Header: "Id",
            accessor: "travelId",
            width: 50,
            displayCell: (rowData) => {
                const { travelId } = rowData;
                return <span>Travel Id {travelId}</span>;
            }
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
            displayCell: () => {
                return <span>Flight</span>;
            }
        },
        {
            Header: "SR",
            accessor: "sr",
            width: 90,
            displayCell: () => {
                return <span>SR</span>;
            }
        }
    ];

    const firstPageData = [
        {
            travelId: 0,
            flight: {
                flightno: "XX2225",
                date: "31-Aug-2016"
            },
            sr: "74/ AWBs"
        },
        {
            travelId: 1,
            flight: {
                flightno: "XX2225",
                date: "31-Aug-2016"
            },
            sr: "74/ AWBs"
        }
    ];

    const secondPageData = [
        {
            travelId: 2,
            flight: {
                flightno: "XX2225",
                date: "31-Aug-2016"
            },
            sr: "74/ AWBs"
        },
        {
            travelId: 3,
            flight: {
                flightno: "XX2225",
                date: "31-Aug-2016"
            },
            sr: "74/ AWBs"
        }
    ];

    const fetchData = (pageInfoObj) => {
        const { pageNum, endCursor } = pageInfoObj;
        if (pageNum === 1 || endCursor === 1) {
            return firstPageData;
        }
        if (pageNum === 2 || endCursor === 3) {
            return secondPageData;
        }
        return [];
    };

    const loadMoreData = () => {
        setGridData(gridData.concat(secondPageData));
        setPageInfo({
            ...pageInfo,
            pageNum: 2,
            total: 20,
            lastPage: true
        });
    };

    const serverSideExporting = async (updatedPageInfo): any => {
        const currentPageInfo = { ...firstPageInfo };
        if (updatedPageInfo !== null && updatedPageInfo !== undefined) {
            const { pageSize, endCursor, pageNum } = updatedPageInfo;
            if (paginationType === "cursor") {
                currentPageInfo.endCursor = endCursor + pageSize;
            } else {
                currentPageInfo.pageNum = pageNum;
            }
        }
        if (
            isLastPageEmpty === false &&
            (currentPageInfo.pageNum === 2 || currentPageInfo.endCursor === 3)
        ) {
            currentPageInfo.lastPage = true;
        }
        const searchedData = await fetchData(currentPageInfo);
        if (searchedData && searchedData.length > 0) {
            return { data: searchedData, pageInfo: currentPageInfo };
        }
        currentPageInfo.lastPage = true;
        return {
            data: [],
            pageInfo: currentPageInfo
        };
    };

    useEffect(() => {
        setGridData(firstPageData);
        setPageInfo(firstPageInfo);
    }, []);

    if (gridData.length > 0) {
        return (
            <Grid
                gridData={gridData}
                columns={gridColumns}
                idAttribute="travelId"
                paginationType={paginationType}
                pageInfo={pageInfo}
                loadMoreData={loadMoreData}
                serverSideExporting={serverSideExporting}
            />
        );
    }
    return null;
};

describe("test server side exporting functionality", () => {
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

    let mockContainer;
    beforeEach(() => {
        mockContainer = document.createElement("div");
        document.body.appendChild(mockContainer);
    });
    afterEach(cleanup);

    it("index based pagination", async () => {
        mockOffsetSize(600, 600);
        const { container, getByTestId, getAllByTestId } = render(
            <GridScreen paginationType="index" />
        );
        const gridContainer = container;

        // Check if Grid id rendered.
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

        // Click export data button
        const exportButton = getByTestId("export_button");
        act(() => {
            exportButton.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });
    });

    it("cursor based pagination", async () => {
        mockOffsetSize(600, 600);
        const { container, getByTestId, getAllByTestId } = render(
            <GridScreen paginationType="cursor" />
        );
        const gridContainer = container;

        // Check if Grid id rendered.
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

        // Click export data button
        const exportButton = getByTestId("export_button");
        act(() => {
            exportButton.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });
    });

    it("index based pagination without empty data for last page", async () => {
        mockOffsetSize(600, 600);
        const { container, getByTestId, getAllByTestId } = render(
            <GridScreen paginationType="index" isLastPageEmpty={false} />
        );
        const gridContainer = container;

        // Check if Grid id rendered.
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

        // Click export data button
        const exportButton = getByTestId("export_button");
        act(() => {
            exportButton.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });
    });
});
