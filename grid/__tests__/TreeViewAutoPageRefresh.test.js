/* eslint-disable no-undef */
import React, { useState, useEffect } from "react";
import { render, cleanup } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import "@testing-library/jest-dom/extend-expect";
import Grid from "../src/index";

const GridScreen = () => {
    const [gridData, setGridData] = useState([]);

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
            titleId: undefined,
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

    const firstPageData = [];
    for (let i = 0; i < 2; i++) {
        firstPageData.push({
            travelId: i,
            flight: {
                flightno: "XX2225",
                date: "31-Aug-2016"
            },
            sr: "74/ AWBs"
        });
    }

    const secondPageData = [];
    for (let i = 3000; i < 3002; i++) {
        secondPageData.push({
            travelId: i,
            flight: {
                flightno: "XX2225",
                date: "31-Aug-2016"
            },
            sr: "74/ AWBs"
        });
    }

    const thirdPageData = [];
    for (let i = 6000; i < 6002; i++) {
        thirdPageData.push({
            travelId: i,
            flight: {
                flightno: "XX2225",
                date: "31-Aug-2016"
            },
            sr: "74/ AWBs"
        });
    }

    const fourthPageData = [];
    for (let i = 9000; i < 9002; i++) {
        fourthPageData.push({
            travelId: i,
            flight: {
                flightno: "XX2225",
                date: "31-Aug-2016"
            },
            sr: "74/ AWBs"
        });
    }

    const parentColumn = {
        Header: "ParentColumn",
        innerCells: [
            {
                Header: "Title Id",
                accessor: "titleId"
            },
            {
                Header: "Title",
                accessor: "parentTitle"
            }
        ],
        displayCell: (rowData) => {
            return <span>Parent Row</span>;
        }
    };

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

    const loadMoreData = (updatedPageInfo, parentId, isReload) => {
        const currentGridData = [...gridData];
        if (isReload) {
            currentGridData[0].childData.data = firstPageData.filter(
                (item, index) => index < 1
            );
        } else if (updatedPageInfo !== null && updatedPageInfo !== undefined) {
            // Next page loading
            const { pageNum } = updatedPageInfo;
            if (pageNum === 2) {
                currentGridData[0].childData.pageNum = 2;
                currentGridData[0].childData.data = [
                    ...firstPageData,
                    ...secondPageData
                ];
            } else if (pageNum === 3) {
                currentGridData[0].childData.pageNum = 3;
                currentGridData[0].childData.total = 200;
                currentGridData[0].childData.data = [
                    ...firstPageData,
                    ...secondPageData,
                    ...thirdPageData
                ];
            } else {
                currentGridData[0].childData.pageNum = 4;
                currentGridData[0].childData.total = 200;
                currentGridData[0].childData.lastPage = true;
                currentGridData[0].childData.data = [
                    ...firstPageData,
                    ...secondPageData,
                    ...thirdPageData,
                    ...fourthPageData
                ];
            }
        } else {
            // First load
            currentGridData[0].childData = {
                pageNum: 1,
                pageSize: 2,
                lastPage: false,
                total: 100,
                data: firstPageData
            };
        }
        setGridData(currentGridData);
    };

    useEffect(() => {
        setGridData(parentData);
    }, []);

    if (gridData.length > 0) {
        return (
            <Grid
                gridData={gridData}
                parentColumn={parentColumn}
                parentIdAttribute="titleId"
                columns={gridColumns}
                idAttribute="travelId"
                paginationType="index"
                loadMoreData={loadMoreData}
            />
        );
    }
    return null;
};

describe("test auto page refresh functionality", () => {
    function mockOffsetSize(width, height) {
        jest.setTimeout(30000);
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

    it("load grid screen component", () => {
        mockOffsetSize(1700, 1700);
        const { container, getAllByTestId, getByTestId } = render(
            <GridScreen />
        );

        // Check if Grid id rendered.
        expect(container).toBeInTheDocument();

        // Open first parent
        const firstParentAccordion = getAllByTestId(
            "acccordion-expand-collapse"
        )[0];
        act(() => {
            firstParentAccordion.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });

        // Check rows count - 2
        let rowsCount = getAllByTestId("gridrow").length;
        expect(rowsCount).toBe(2);

        // Load second page
        let loadMoreButtton = getByTestId("load-more-childdata");
        act(() => {
            loadMoreButtton.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });

        // Check rows count - 4
        rowsCount = getAllByTestId("gridrow").length;
        expect(rowsCount).toBe(4);

        // Load third page
        loadMoreButtton = getByTestId("load-more-childdata");
        act(() => {
            loadMoreButtton.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });

        // Check rows count - 1 (After reload only 1 row will be present)
        rowsCount = getAllByTestId("gridrow").length;
        expect(rowsCount).toBe(1);

        // Load fourth page
        loadMoreButtton = getByTestId("load-more-childdata");
        act(() => {
            loadMoreButtton.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });

        // Check rows count - 8
        rowsCount = getAllByTestId("gridrow").length;
        expect(rowsCount).toBe(8);

        // Open second parent
        const secondParentAccordion = getAllByTestId(
            "acccordion-expand-collapse"
        )[1];
        act(() => {
            secondParentAccordion.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });

        // Check rows count - 8 (No change as load child datrra function should be called because of undefined paernt id)
        rowsCount = getAllByTestId("gridrow").length;
        expect(rowsCount).toBe(8);
    });
});
