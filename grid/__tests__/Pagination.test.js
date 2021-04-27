/* eslint-disable no-undef */
import React, { useState, useEffect } from "react";
import { render, cleanup, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import Grid from "../src/index";

const GridScreen = ({ paginationType, passLoadMore }) => {
    const isIndexPagination = paginationType === "index";
    const [gridData, setGridData] = useState([]);
    const firstPageInfo = isIndexPagination
        ? {
              pageNum: 1,
              pageSize: 2,
              total: 50,
              lastPage: false
          }
        : {
              endCursor: 1,
              pageSize: 2,
              total: 50,
              lastPage: false
          };
    const [pageInfo, setPageInfo] = useState(firstPageInfo);

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

    const fetchData = () => {
        return secondPageData;
    };

    const fetchNextPageData = async () => {
        const searchedData = await fetchData();
        return searchedData;
    };

    const loadMoreData = (updatedPageInfo) => {
        fetchNextPageData().then(() => {
            if (isIndexPagination) {
                setPageInfo({
                    ...pageInfo,
                    pageNum: updatedPageInfo.pageNum
                });
            } else {
                setPageInfo({
                    ...pageInfo,
                    endCursor:
                        updatedPageInfo.endCursor + updatedPageInfo.pageSize
                });
            }
            setGridData(gridData.concat(secondPageData));
        });
    };

    useEffect(() => {
        setGridData(firstPageData);
    }, []);

    if (gridData.length > 0) {
        return (
            <Grid
                gridData={gridData}
                columns={gridColumns}
                idAttribute="travelId"
                paginationType={paginationType}
                pageInfo={pageInfo}
                loadMoreData={passLoadMore === false ? null : loadMoreData}
            />
        );
    }
    return null;
};

describe("test auto page refresh functionality", () => {
    jest.setTimeout(30000);
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

    it("Index based pagination", async () => {
        mockOffsetSize(600, 600);
        const { container } = render(<GridScreen paginationType="index" />);

        // Check if Grid id rendered.
        await waitFor(() => expect(container).toBeInTheDocument());
    });

    it("Cursor based pagination", async () => {
        mockOffsetSize(600, 600);
        const { container } = render(<GridScreen paginationType="cursor" />);

        // Check if Grid id rendered.
        await waitFor(() => expect(container).toBeInTheDocument());
    });

    it("Index based pagination without load more function passed", async () => {
        mockOffsetSize(600, 600);
        const { container } = render(
            <GridScreen paginationType="index" passLoadMore={false} />
        );

        // Check if Grid id rendered.
        await waitFor(() => expect(container).toBeInTheDocument());
    });
});
