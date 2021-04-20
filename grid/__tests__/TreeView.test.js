/* eslint-disable no-undef */
import React from "react";
import { render, cleanup, fireEvent, waitFor } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import "@testing-library/jest-dom/extend-expect";
/* eslint-disable no-unused-vars */
import regeneratorRuntime from "regenerator-runtime";
import Grid from "../src/index";

describe("render Index file ", () => {
    jest.setTimeout(30000);
    HTMLCanvasElement.prototype.getContext = () => {
        // return whatever getContext has to return
        return [];
    };
    global.URL.createObjectURL = jest.fn();

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
    }

    const validateData = (value) => {
        if (value !== null && value !== undefined) {
            return value.toString();
        }
        return "";
    };

    const mockDisplayCell = jest.fn(() => {
        return (
            <div className="flight-details">
                <strong>XX2225</strong>
                <span>31-Aug-2016</span>
            </div>
        );
    });
    const mockUpdateDateValue = jest.fn();
    const mockEditCell = jest.fn((rowData, DisplayTag, rowUpdateCallBack) => {
        const { flightno, date } = rowData.flight || {};
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

    const gridColumns = [
        {
            Header: "Id",
            accessor: "travelId",
            width: 50,
            isSortable: true,
            searchKeys: ["travelId"],
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
            Header: () => {
                return <span className="flightHeader">Flight</span>;
            },
            title: "Flight",
            accessor: "flight",
            width: 100,
            isSortable: true,
            innerCells: [
                {
                    Header: "Flight No",
                    accessor: "flightno",
                    isSortable: true
                },
                {
                    Header: "Date",
                    accessor: "date",
                    isSortable: true
                }
            ],
            sortValue: "flightno",
            displayCell: mockDisplayCell,
            editCell: mockEditCell
        },
        {
            Header: "SR",
            accessor: "sr",
            width: 90,
            isSortable: true
        },
        {
            Header: "ULD Positions",
            accessor: "uldPositions",
            width: 120,
            isSortable: true,
            innerCells: [
                {
                    Header: "Position",
                    accessor: "position",
                    isSortable: true
                },
                {
                    Header: "Value",
                    accessor: "value",
                    isSortable: true
                }
            ],
            displayCell: (rowData, DisplayTag) => {
                const { uldPositions } = rowData;
                return (
                    <div className="uld-details">
                        <ul>
                            {uldPositions.map((positions, index) => {
                                return (
                                    <li key={index}>
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
        }
    ];

    const mockAdditionalColumn = {
        Header: "Remarks",
        innerCells: [
            {
                Header: "Remarks",
                accessor: "remarks"
            }
        ],
        displayCell: (rowData, DisplayTag) => {
            const { remarks } = rowData;
            return (
                <div className="details-wrap">
                    <DisplayTag columnKey="remarks" cellKey="remarks">
                        <ul>
                            <li>{remarks}</li>
                        </ul>
                    </DisplayTag>
                </div>
            );
        }
    };

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
            },
            {
                Header: "Count",
                accessor: null
            }
        ],
        displayCell: (rowData) => {
            const { title, count, lastModified, date, time } = rowData;
            return (
                <div className="parentRow">
                    <h2 className="parentRowHead">
                        {title} ({count})
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
            // To create an empty entry in the export content
            if (titleId === 0) {
                return [];
            }
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

    const parentIdAttribute = "titleId";

    const firstChildData = [];
    for (let i = 0; i < 5; i++) {
        firstChildData.push({
            travelId: i,
            flight: {
                flightno: "XX2225",
                date: "31-Aug-2016"
            },
            segment: {
                from: "BCC",
                to: "ZZY"
            },
            details: {
                flightModel: 6518,
                bodyType: "Big Body",
                type: "Van",
                startTime: "01:23 (S)",
                endTime: "11:29 (E)",
                status: "To Be Cancelled",
                additionalStatus:
                    "Elit est consectetur deserunt et sit officia eu. Qui minim quis exercitation in irure elit velit nisi officia cillum laborum reprehenderit.aliqua ex sint cupidatat non",
                timeStatus: "10:02 hrs to depart"
            },
            weight: {
                percentage: "16%",
                value: "35490/20000 kg"
            },
            volume: {
                percentage: "54%",
                value: "31/60 cbm"
            },
            uldPositions: [
                {
                    position: "L1",
                    value: "7/9"
                },
                {
                    position: "Q1",
                    value: "9/3"
                },
                {
                    position: "L6",
                    value: "8/4"
                },
                {
                    position: "Q7",
                    value: "4/9"
                }
            ],
            revenue: {
                revenue: "$63,474.27",
                yeild: "$7.90"
            },
            sr: "74/ AWBs",
            queuedBooking: {
                sr: "88/ AWBs",
                volume: "7437 kg / 31 cbm"
            },
            remarks: "Enim aute magna."
        });
    }

    const secondChildData = [];
    for (let i = 3000; i < 3005; i++) {
        secondChildData.push({
            travelId: i,
            flight: {
                flightno: "XX2225",
                date: "31-Aug-2016"
            },
            segment: {
                from: "BCC",
                to: "ZZY"
            },
            details: {
                flightModel: 6518,
                bodyType: "Big Body",
                type: "Van",
                startTime: "01:23 (S)",
                endTime: "11:29 (E)",
                status: "To Be Cancelled",
                additionalStatus:
                    "Elit est consectetur deserunt et sit officia eu. Qui minim quis exercitation in irure elit velit nisi officia cillum laborum reprehenderit.aliqua ex sint cupidatat non",
                timeStatus: "10:02 hrs to depart"
            },
            weight: {
                percentage: "16%",
                value: "35490/20000 kg"
            },
            volume: {
                percentage: "54%",
                value: "31/60 cbm"
            },
            uldPositions: [
                {
                    position: "L1",
                    value: "7/9"
                },
                {
                    position: "Q1",
                    value: "9/3"
                },
                {
                    position: "L6",
                    value: "8/4"
                },
                {
                    position: "Q7",
                    value: "4/9"
                }
            ],
            revenue: {
                revenue: "$63,474.27",
                yeild: "$7.90"
            },
            sr: "74/ AWBs",
            queuedBooking: {
                sr: "88/ AWBs",
                volume: "7437 kg / 31 cbm"
            },
            remarks: "Enim aute magna."
        });
    }

    const thirdChildData = [];
    for (let i = 6000; i < 6005; i++) {
        thirdChildData.push({
            titleId: 2,
            travelId: i,
            flight: null,
            segment: {
                from: "BCC",
                to: "ZZY"
            },
            details: {
                flightModel: 6518,
                bodyType: "Big Body",
                type: "Van",
                startTime: "01:23 (S)",
                endTime: "11:29 (E)",
                status: "To Be Cancelled",
                additionalStatus:
                    "Elit est consectetur deserunt et sit officia eu. Qui minim quis exercitation in irure elit velit nisi officia cillum laborum reprehenderit.aliqua ex sint cupidatat non",
                timeStatus: "10:02 hrs to depart"
            },
            weight: {
                percentage: "16%",
                value: "35490/20000 kg"
            },
            volume: {
                percentage: "54%",
                value: "31/60 cbm"
            },
            uldPositions: [
                {
                    position: "L1",
                    value: "7/9"
                },
                {
                    position: "Q1",
                    value: "9/3"
                },
                {
                    position: "L6",
                    value: "8/4"
                },
                {
                    position: "Q7",
                    value: "4/9"
                }
            ],
            revenue: {
                revenue: "$63,474.27",
                yeild: "$7.90"
            },
            sr: "74/ AWBs",
            queuedBooking: {
                sr: "88/ AWBs",
                volume: "7437 kg / 31 cbm"
            },
            remarks: "Enim aute magna."
        });
    }

    const parentDataWithAllChildData = [
        {
            titleId: 0,
            parentTitle: "EXCVGRATES",
            count: 3,
            lastModified: "User name",
            date: "21 Jul 2020",
            time: "18:39",
            childData: {
                pageNum: 1,
                pageSize: 5,
                lastPage: false,
                data: firstChildData
            }
        },
        {
            titleId: 1,
            parentTitle: "EXCVGRATES",
            count: 3,
            lastModified: "User name",
            date: "21 Jul 2020",
            time: "18:39",
            childData: {
                endCursor: 3004,
                pageSize: 5,
                lastPage: false,
                data: secondChildData
            }
        },
        {
            titleId: 2,
            parentTitle: "EXCVGRATES",
            count: 1,
            lastModified: "User name",
            date: "21 Jul 2020",
            time: "18:39",
            childData: {
                pageNum: 21,
                pageSize: 5,
                lastPage: false,
                data: thirdChildData
            }
        }
    ];

    const parentDataWithInvalidValue = [
        {
            titleId: undefined,
            parentTitle: "EXCVGRATES",
            count: 3,
            lastModified: "User name",
            date: "21 Jul 2020",
            time: "18:39",
            childData: {
                pageNum: 1,
                pageSize: 5,
                lastPage: false,
                data: firstChildData
            }
        },
        {
            titleId: 1,
            parentTitle: "EXCVGRATES",
            count: 3,
            lastModified: "User name",
            date: "21 Jul 2020",
            time: "18:39"
        },
        {
            titleId: 2,
            parentTitle: "EXCVGRATES",
            count: 1,
            lastModified: "User name",
            date: "21 Jul 2020",
            time: "18:39"
        }
    ];

    const parentDataWithOnlyLastChildData = [
        {
            titleId: 0,
            parentTitle: "EXCVGRATES",
            count: 3,
            lastModified: "User name",
            date: "21 Jul 2020",
            time: "18:39"
        },
        {
            titleId: 1,
            parentTitle: "EXCVGRATES",
            count: 3,
            lastModified: "User name",
            date: "21 Jul 2020",
            time: "18:39",
            childData: {
                pageNum: 21,
                pageSize: 5,
                lastPage: false,
                data: []
            }
        },
        {
            titleId: 2,
            parentTitle: "EXCVGRATES",
            count: 1,
            lastModified: "User name",
            date: "21 Jul 2020",
            time: "18:39",
            childData: {
                pageNum: 21,
                pageSize: 5,
                lastPage: false,
                data: thirdChildData.filter((item, index) => index < 2)
            }
        }
    ];

    const mockGetRowInfo = (rowData) => {
        const { travelId } = rowData;
        return {
            isRowSelectable: travelId !== 0
        };
    };

    const mockGridWidth = "100%";
    const mockTitle = "AWBs";

    const mockRowsToDeselect = [1, 2];
    const mockRowActions = jest.fn();
    const mockUpdateRowData = jest.fn();
    const mockSelectBulkData = jest.fn();
    const mockLoadMoreData = jest.fn();
    const mockOnSearch = jest.fn();

    let mockContainer;
    beforeEach(() => {
        mockContainer = document.createElement("div");
        document.body.appendChild(mockContainer);
    });
    afterEach(cleanup);

    it("test grid with empty parent data", () => {
        mockOffsetSize(600, 600);
        const { container, getAllByTestId } = render(
            <Grid
                title={mockTitle}
                gridWidth={mockGridWidth}
                gridData={[]}
                idAttribute="travelId"
                paginationType="index"
                loadMoreData={mockLoadMoreData}
                columns={gridColumns}
                columnToExpand={mockAdditionalColumn}
                parentColumn={parentColumn}
                parentIdAttribute={parentIdAttribute}
                rowActions={mockRowActions}
                onRowUpdate={mockUpdateRowData}
                onRowSelect={mockSelectBulkData}
                rowsToDeselect={mockRowsToDeselect}
            />
        );
        const gridContainer = container;

        // Check if Grid id rendered.
        expect(gridContainer).toBeInTheDocument();

        // Error message should be found
        const errorMessage = getAllByTestId("nodataerror");
        expect(errorMessage.length).toBe(1);
    });

    it("test grid with simple parent data - index pagination and single row selection", () => {
        mockOffsetSize(600, 600);
        const { container, getAllByTestId } = render(
            <Grid
                title={mockTitle}
                gridWidth={mockGridWidth}
                gridData={parentData}
                idAttribute="travelId"
                paginationType="index"
                loadMoreData={mockLoadMoreData}
                columns={gridColumns}
                columnToExpand={mockAdditionalColumn}
                parentColumn={parentColumn}
                parentIdAttribute={parentIdAttribute}
                rowActions={mockRowActions}
                onRowUpdate={mockUpdateRowData}
                onRowSelect={mockSelectBulkData}
                rowsToDeselect={mockRowsToDeselect}
                multiRowSelection={false}
            />
        );
        const gridContainer = container;

        // Check if Grid id rendered.
        expect(gridContainer).toBeInTheDocument();

        // Find accordion expand/collapse icons
        const accordionExpandCollapse = getAllByTestId(
            "acccordion-expand-collapse"
        );
        // There should be 3 for each parent
        expect(accordionExpandCollapse.length).toBe(3);

        // Expand first parent
        const firstParentAccordion = accordionExpandCollapse[0];
        act(() => {
            firstParentAccordion.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });

        // Call for child data fetching has to be fired
        expect(mockLoadMoreData).toHaveBeenCalled();
    });

    it("test grid with simple parent data - cursor pagination", () => {
        mockOffsetSize(600, 600);
        const { container, getAllByTestId } = render(
            <Grid
                title={mockTitle}
                gridWidth={mockGridWidth}
                gridData={parentData}
                idAttribute="travelId"
                paginationType="cursor"
                loadMoreData={mockLoadMoreData}
                columns={gridColumns}
                columnToExpand={mockAdditionalColumn}
                parentColumn={parentColumn}
                parentIdAttribute={parentIdAttribute}
                rowActions={mockRowActions}
                onRowUpdate={mockUpdateRowData}
                onRowSelect={mockSelectBulkData}
                rowsToDeselect={mockRowsToDeselect}
            />
        );
        const gridContainer = container;

        // Check if Grid id rendered.
        expect(gridContainer).toBeInTheDocument();

        // Find accordion expand/collapse icons
        const accordionExpandCollapse = getAllByTestId(
            "acccordion-expand-collapse"
        );
        // There should be 3 for each parent
        expect(accordionExpandCollapse.length).toBe(3);

        // Expand first parent
        const firstParentAccordion = accordionExpandCollapse[0];
        act(() => {
            firstParentAccordion.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });

        // Call for child data fetching has to be fired
        expect(mockLoadMoreData).toHaveBeenCalled();
    });

    it("test grid with invalid parent id - group sort", () => {
        mockOffsetSize(600, 900);
        const { container, getAllByTestId, getByTestId } = render(
            <Grid
                title={mockTitle}
                gridWidth={mockGridWidth}
                gridData={parentDataWithInvalidValue}
                idAttribute="travelId"
                paginationType="index"
                loadMoreData={mockLoadMoreData}
                columns={gridColumns}
                columnToExpand={mockAdditionalColumn}
                parentColumn={parentColumn}
                parentIdAttribute={parentIdAttribute}
                parentRowExpandable={false}
                rowActions={mockRowActions}
                onRowUpdate={mockUpdateRowData}
                onRowSelect={mockSelectBulkData}
                rowsToDeselect={mockRowsToDeselect}
                fixedRowHeight
            />
        );
        const gridContainer = container;

        // Check if Grid id rendered.
        expect(gridContainer).toBeInTheDocument();

        // Open Group sort overlay
        const groupSortIcon = getAllByTestId("toggleGroupSortOverLay");
        expect(groupSortIcon.length).toBe(1);
        act(() => {
            groupSortIcon[0].dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });

        // Add sort option
        const addSortLink = getByTestId("addSort");
        act(() => {
            addSortLink.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });

        // Apply sort options
        const applySortButton = getByTestId("saveSort");
        act(() => {
            applySortButton.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });
    });

    it("test grid with parent data and child data and parentRowExpandable as false - load more - index pagination for fixedRowHeight Grid", () => {
        mockOffsetSize(600, 900);
        const { container, getAllByTestId, getByTestId } = render(
            <Grid
                title={mockTitle}
                gridWidth={mockGridWidth}
                gridData={parentDataWithAllChildData}
                idAttribute="travelId"
                paginationType="index"
                loadMoreData={mockLoadMoreData}
                columns={gridColumns}
                columnToExpand={mockAdditionalColumn}
                parentColumn={parentColumn}
                parentIdAttribute={parentIdAttribute}
                parentRowExpandable={false}
                rowActions={mockRowActions}
                onRowUpdate={mockUpdateRowData}
                onRowSelect={mockSelectBulkData}
                rowsToDeselect={mockRowsToDeselect}
                fixedRowHeight
            />
        );
        const gridContainer = container;

        // Check if Grid id rendered.
        expect(gridContainer).toBeInTheDocument();

        // Open Group sort overlay
        const groupSortIcon = getAllByTestId("toggleGroupSortOverLay");
        expect(groupSortIcon.length).toBe(1);
        act(() => {
            groupSortIcon[0].dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });

        // Add sort option
        const addSortLink = getByTestId("addSort");
        act(() => {
            addSortLink.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });

        // Apply sort options
        const applySortButton = getByTestId("saveSort");
        act(() => {
            applySortButton.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });

        // Check if expand/collapse icons are not present
        const expandCollapseIcons = document.querySelectorAll(
            "[data-testid='ng-accordion__icon']"
        );
        expect(expandCollapseIcons.length).toBe(0);

        // Find load more buttons
        const loadMoreButttons = getAllByTestId("load-more-childdata");
        expect(loadMoreButttons.length).toBe(3);

        // Click first parent's load more
        act(() => {
            loadMoreButttons[0].dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });
        // Call for child data fetching has to be fired
        expect(mockLoadMoreData).toHaveBeenCalled();
    });

    it("test next page without providing parentIdAttribute", () => {
        mockOffsetSize(600, 900);
        const { container, getAllByTestId } = render(
            <Grid
                title={mockTitle}
                gridWidth={mockGridWidth}
                gridData={parentDataWithAllChildData}
                idAttribute="travelId"
                paginationType="index"
                loadMoreData={mockLoadMoreData}
                columns={gridColumns}
                columnToExpand={mockAdditionalColumn}
                parentColumn={parentColumn}
                parentRowExpandable={false}
                rowActions={mockRowActions}
                onRowUpdate={mockUpdateRowData}
                onRowSelect={mockSelectBulkData}
                rowsToDeselect={mockRowsToDeselect}
                fixedRowHeight
            />
        );
        const gridContainer = container;

        // Check if Grid id rendered.
        expect(gridContainer).toBeInTheDocument();

        // Find load more buttons
        const loadMoreButttons = getAllByTestId("load-more-childdata");
        expect(loadMoreButttons.length).toBe(3);

        // Click first parent's load more
        act(() => {
            loadMoreButttons[0].dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });
        // Call for child data fetching has to be fired
        expect(mockLoadMoreData).toHaveBeenCalled();
    });

    it("test grid with parent data and child data and parentRowExpandable as false - load more - cursor pagination", () => {
        mockOffsetSize(600, 900);
        const { container, getAllByTestId } = render(
            <Grid
                title={mockTitle}
                gridWidth={mockGridWidth}
                gridData={parentDataWithAllChildData}
                idAttribute="travelId"
                paginationType="cursor"
                loadMoreData={mockLoadMoreData}
                columns={gridColumns}
                columnToExpand={mockAdditionalColumn}
                parentColumn={parentColumn}
                parentIdAttribute={parentIdAttribute}
                parentRowExpandable={false}
                rowActions={mockRowActions}
                onRowUpdate={mockUpdateRowData}
                onRowSelect={mockSelectBulkData}
                rowsToDeselect={mockRowsToDeselect}
            />
        );
        const gridContainer = container;

        // Check if Grid id rendered.
        expect(gridContainer).toBeInTheDocument();

        // Check if expand/collapse icons are not present
        const expandCollapseIcons = document.querySelectorAll(
            "[data-testid='ng-accordion__icon']"
        );
        expect(expandCollapseIcons.length).toBe(0);

        // Find load more buttons
        const loadMoreButttons = getAllByTestId("load-more-childdata");
        expect(loadMoreButttons.length).toBe(3);

        // Click first parent's load more
        act(() => {
            loadMoreButttons[1].dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });
        // Call for child data fetching has to be fired
        expect(mockLoadMoreData).toHaveBeenCalled();
    });

    it("test grid with parent data and only last parent's child data and parentRowExpandable as false - test load more coming in the last row", () => {
        mockOffsetSize(600, 1200);
        const { container, getAllByTestId } = render(
            <Grid
                title={mockTitle}
                gridWidth={mockGridWidth}
                gridData={parentDataWithOnlyLastChildData}
                idAttribute="travelId"
                paginationType="index"
                loadMoreData={mockLoadMoreData}
                columns={gridColumns}
                columnToExpand={mockAdditionalColumn}
                parentColumn={parentColumn}
                parentIdAttribute={parentIdAttribute}
                parentRowExpandable={false}
                rowActions={mockRowActions}
                onRowUpdate={mockUpdateRowData}
                onRowSelect={mockSelectBulkData}
                rowsToDeselect={mockRowsToDeselect}
            />
        );
        const gridContainer = container;

        // Check if Grid id rendered.
        expect(gridContainer).toBeInTheDocument();

        // Check if expand/collapse icons are not present
        const expandCollapseIcons = document.querySelectorAll(
            "[data-testid='ng-accordion__icon']"
        );
        expect(expandCollapseIcons.length).toBe(0);

        // Find load more buttons (Only 1 - for the last parent)
        const loadMoreButttons = getAllByTestId("load-more-childdata");
        expect(loadMoreButttons.length).toBe(1);
    });

    it("test grid with parent data and child data and parentRowExpandable as false - filtering, group sort and export", async () => {
        mockOffsetSize(600, 600);
        const { container, getByTestId, getAllByTestId } = render(
            <Grid
                title={mockTitle}
                gridWidth={mockGridWidth}
                gridData={parentDataWithOnlyLastChildData}
                idAttribute="travelId"
                paginationType="index"
                loadMoreData={mockLoadMoreData}
                columns={gridColumns}
                columnToExpand={mockAdditionalColumn}
                parentColumn={parentColumn}
                parentIdAttribute={parentIdAttribute}
                parentRowExpandable={false}
                rowActions={mockRowActions}
                onRowUpdate={mockUpdateRowData}
                onRowSelect={mockSelectBulkData}
                rowsToDeselect={mockRowsToDeselect}
                onSearch={mockOnSearch}
            />
        );
        const gridContainer = container;

        // Check if Grid id rendered.
        expect(gridContainer).toBeInTheDocument();

        // Get Child Rows count
        const childRowsCount = getAllByTestId("gridrowWrap").length;

        // Apply global filter
        let input = getByTestId("globalFilter-textbox");
        expect(input.value).toBe("");
        fireEvent.change(input, { target: { value: "6000" } });
        expect(input.value).toBe("6000");

        // Check child rows count now. It should not be same
        await waitFor(() =>
            expect(getAllByTestId("gridrowWrap").length).toBeLessThan(
                childRowsCount
            )
        );
        // Check parent rows count now. It should be greater than 1
        await waitFor(() =>
            expect(getAllByTestId("parentrowWrap").length).toBeGreaterThan(1)
        );
        // Expect call back to be called
        await waitFor(() => expect(mockOnSearch).toHaveBeenCalled());

        // Clear global filter
        input = getByTestId("globalFilter-textbox");
        expect(input.value).toBe("6000");
        fireEvent.change(input, { target: { value: "" } });
        expect(input.value).toBe("");

        // Check child rows count now. It should be same now
        await waitFor(() =>
            expect(getAllByTestId("gridrowWrap").length).toBe(childRowsCount)
        );
        // Check parent rows count now. It should be greater than 1
        await waitFor(() =>
            expect(getAllByTestId("parentrowWrap").length).toBeGreaterThan(1)
        );
        // Expect call back to be called
        await waitFor(() => expect(mockOnSearch).toHaveBeenCalled());

        // Open Column Filter
        const toggleColumnFilter = getByTestId("toggleColumnFilter");
        act(() => {
            toggleColumnFilter.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });

        // Apply Id Column filter
        let columnInput = getByTestId("columnFilter-textbox");
        fireEvent.change(columnInput, { target: { value: "6000" } });
        expect(columnInput.value).toBe("6000");

        // Check child rows count now. It should not be same
        expect(getAllByTestId("gridrowWrap").length).toBeLessThan(
            childRowsCount
        );
        // Check parent rows count now. It should be greater than 1
        expect(getAllByTestId("parentrowWrap").length).toBeGreaterThan(1);
        // Expect call back to be called
        expect(mockOnSearch).toHaveBeenCalled();

        // Clear Id Column filter
        columnInput = getByTestId("columnFilter-textbox");
        fireEvent.change(columnInput, { target: { value: "" } });
        expect(columnInput.value).toBe("");

        // Check child rows count now. It should not be same
        expect(getAllByTestId("gridrowWrap").length).toBe(childRowsCount);
        // Check parent rows count now. It should be greater than 1
        expect(getAllByTestId("parentrowWrap").length).toBeGreaterThan(1);
        // Expect call back to be called
        expect(mockOnSearch).toHaveBeenCalled();

        // Open Group sort Icon
        const groupSortIcon = getByTestId("toggleGroupSortOverLay");
        act(() => {
            groupSortIcon.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });

        // Check if sort overlay is opened
        let sortOverlay = document.querySelectorAll(
            "[data-testid='groupsortoverlay']"
        );
        expect(sortOverlay.length).toBe(1);

        // Add sort link
        let addSortLink = getByTestId("addSort");
        act(() => {
            addSortLink.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });

        // Add one more sort option
        addSortLink = getByTestId("addSort");
        act(() => {
            addSortLink.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });

        // Change Sort By
        const sortBySelect = document.querySelectorAll(
            "[data-testid='groupSort-sortBy']"
        )[0];
        fireEvent.change(sortBySelect, {
            target: { value: "flight" }
        });

        // Change Sort On
        const sortOnSelect = document.querySelectorAll(
            "[data-testid='groupSort-sortOn']"
        )[0];
        fireEvent.change(sortOnSelect, {
            target: { value: "flightno" }
        });

        // Change Sort Order
        const sortOrderSelect = document.querySelectorAll(
            "[data-testid='groupSort-order']"
        )[0];
        fireEvent.change(sortOrderSelect, {
            target: { value: "Descending" }
        });

        // Apply sort
        const applySortButton = document.querySelectorAll(
            "[data-testid='saveSort']"
        )[0];
        act(() => {
            applySortButton.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });

        // Check if sort overlay is closed
        sortOverlay = document.querySelectorAll(
            "[data-testid='groupsortoverlay']"
        );
        expect(sortOverlay.length).toBe(0);

        // Open export overlay
        const toggleExportDataOverlay = getByTestId("toggleExportDataOverlay");
        act(() => {
            toggleExportDataOverlay.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });
        const exportOverlay = getByTestId("exportoverlay");
        expect(exportOverlay).toBeInTheDocument();

        // Select excel file type
        const selectPdf = getByTestId("chk_csv_test");
        fireEvent.click(selectPdf);
        expect(selectPdf.checked).toEqual(true);

        // Click export data button
        fireEvent.click(getByTestId("export_button"));
    });

    it("test grid with parent data and child data and parentRowsToExpand - parent row selection", () => {
        mockOffsetSize(600, 200);
        const { container, getAllByTestId } = render(
            <Grid
                title={mockTitle}
                gridWidth={mockGridWidth}
                gridData={parentDataWithAllChildData}
                idAttribute="travelId"
                paginationType="index"
                loadMoreData={mockLoadMoreData}
                columns={gridColumns}
                columnToExpand={mockAdditionalColumn}
                parentColumn={parentColumn}
                parentIdAttribute={parentIdAttribute}
                parentRowsToExpand={[0]}
                rowActions={mockRowActions}
                onRowUpdate={mockUpdateRowData}
                onRowSelect={mockSelectBulkData}
                rowsToDeselect={mockRowsToDeselect}
                getRowInfo={mockGetRowInfo}
            />
        );
        const gridContainer = container;

        // Check if Grid id rendered.
        expect(gridContainer).toBeInTheDocument();

        // Select first parent
        let firstParentRowSelector = getAllByTestId("rowSelector-parentRow")[0];
        act(() => {
            firstParentRowSelector.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });

        // Selected checkboxes count should be 5 (1 parent row + 4 child rows).
        // Row with travel id 0 doesn't have checkbox because of rwInfo.
        let selectedCheckboxes = gridContainer.querySelectorAll(
            'input[type="checkbox"]:checked'
        );
        expect(selectedCheckboxes.length).toBe(5);

        // Unelect first parent
        firstParentRowSelector = getAllByTestId("rowSelector-parentRow")[0];
        act(() => {
            firstParentRowSelector.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });

        // Selected checkboxes count should be 0
        selectedCheckboxes = gridContainer.querySelectorAll(
            'input[type="checkbox"]:checked'
        );
        expect(selectedCheckboxes.length).toBe(0);

        // Find collapse icons
        // Actually there should be 3, but only 2 are rendered by react-window
        let accordionIcons = getAllByTestId("acccordion-expand-collapse");
        expect(accordionIcons.length).toBe(2);

        // Collapse first parent
        act(() => {
            accordionIcons[0].dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });

        // Find collapse icons
        // There should be 3 as all parent rows are now in collapsed state
        accordionIcons = getAllByTestId("acccordion-expand-collapse");
        expect(accordionIcons.length).toBe(3);
    });

    it("test grid with parent data and child data and parentRowsToExpand - parent row selection without idAttribute", () => {
        mockOffsetSize(600, 200);
        const { container, getAllByTestId } = render(
            <Grid
                title={mockTitle}
                gridWidth={mockGridWidth}
                gridData={parentDataWithAllChildData}
                paginationType="index"
                loadMoreData={mockLoadMoreData}
                columns={gridColumns}
                columnToExpand={mockAdditionalColumn}
                parentColumn={parentColumn}
                parentIdAttribute={parentIdAttribute}
                parentRowsToExpand={[0]}
                rowActions={mockRowActions}
                onRowUpdate={mockUpdateRowData}
                onRowSelect={mockSelectBulkData}
                rowsToDeselect={mockRowsToDeselect}
            />
        );
        const gridContainer = container;

        // Check if Grid id rendered.
        expect(gridContainer).toBeInTheDocument();

        // Select first parent
        const firstParentRowSelector = getAllByTestId(
            "rowSelector-parentRow"
        )[0];
        act(() => {
            firstParentRowSelector.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });

        // Selected checkboxes count should be 0
        const selectedCheckboxes = gridContainer.querySelectorAll(
            'input[type="checkbox"]:checked'
        );
        expect(selectedCheckboxes.length).toBe(0);
    });
});
