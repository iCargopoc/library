/* eslint-disable no-undef */
import React from "react";
import ReactDOM from "react-dom";
import { render, cleanup, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { act } from "react-dom/test-utils";
/* eslint-disable no-unused-vars */
import regeneratorRuntime from "regenerator-runtime";
import ColumnReordering from "../../../src/Overlays/managecolumns/index";

describe("ColumnReordering unit test", () => {
    const mockUpdateColumnStructure = jest.fn();
    const toggleManageColumns = jest.fn();
    const mockAdditionalColumn = [
        {
            Header: "Remarks",
            innerCells: [
                {
                    Header: "Remarks",
                    accessor: "remarks"
                }
            ],
            columnId: "ExpandColumn",
            displayInExpandedRegion: true,
            originalInnerCells: [
                {
                    Header: "Remarks",
                    accessor: "remarks"
                }
            ]
        }
    ];

    const mockOriginalColumns = [
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
            displayInExpandedRegion: false,
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
            displayInExpandedRegion: false,
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
            sortValue: "percentage",
            columnId: "column_4",
            displayInExpandedRegion: false,
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
        },
        {
            Header: "ULD Positions",
            accessor: "uldPositions",
            width: 120,
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
            disableSortBy: true,
            columnId: "column_5",
            displayInExpandedRegion: false,
            originalInnerCells: [
                {
                    Header: "Position",
                    accessor: "position"
                },
                {
                    Header: "Value",
                    accessor: "value"
                }
            ]
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
            sortValue: "revenue",
            columnId: "column_6",
            displayInExpandedRegion: false,
            originalInnerCells: [
                {
                    Header: "Revenue",
                    accessor: "revenue"
                },
                {
                    Header: "Yeild",
                    accessor: "yeild"
                }
            ]
        },
        {
            Header: "SR",
            accessor: "sr",
            width: 90,
            columnId: "column_7",
            displayInExpandedRegion: false
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
            columnId: "column_8",
            displayInExpandedRegion: false,
            originalInnerCells: [
                {
                    Header: "Sr",
                    accessor: "sr"
                },
                {
                    Header: "Volume",
                    accessor: "volume"
                }
            ]
        }
    ];
    afterEach(cleanup);
    let mockContainer;
    beforeAll(() => {
        mockContainer = document.createElement("div");
        document.body.appendChild(mockContainer);
    });

    it("should not render ColumnReordering component", () => {
        render(
            <ColumnReordering
                isManageColumnOpen={false}
                toggleManageColumns={toggleManageColumns}
                originalColumns={mockOriginalColumns}
                isExpandContentAvailable
                additionalColumn={mockAdditionalColumn}
                updateColumnStructure={mockUpdateColumnStructure}
            />,
            mockContainer
        );
        const overlay = document.getElementsByClassName("neo-popover--column");
        expect(overlay.innerHTML).toBeUndefined();
    });

    it("should render ColumnReordering component", () => {
        const component = render(
            <ColumnReordering
                isManageColumnOpen
                toggleManageColumns={toggleManageColumns}
                originalColumns={mockOriginalColumns}
                isExpandContentAvailable
                additionalColumn={mockAdditionalColumn}
                updateColumnStructure={mockUpdateColumnStructure}
            />,
            mockContainer
        );
        expect(component).toBeDefined();
    });

    it("should render ColumnReordering search component", () => {
        const { getByTestId } = render(
            <ColumnReordering
                isManageColumnOpen
                toggleManageColumns={toggleManageColumns}
                originalColumns={mockOriginalColumns}
                isExpandContentAvailable
                additionalColumn={mockAdditionalColumn}
                updateColumnStructure={mockUpdateColumnStructure}
            />
        );
        const filterList = getByTestId("filterColumnsList");
        fireEvent.change(filterList, { target: { value: "id" } });
        expect(filterList.value).toBe("id");
        fireEvent.change(filterList, { target: { value: "" } });
        const coloumnBodyInnerHtml = document
            .getElementsByClassName("column__settings")[0]
            .getElementsByClassName("column__body")[0]
            .getElementsByClassName("column__reorder");

        expect(coloumnBodyInnerHtml.length).toBe(10);
    });

    it("Click on Save button For Default Select", () => {
        render(
            <ColumnReordering
                isManageColumnOpen
                toggleManageColumns={toggleManageColumns}
                originalColumns={mockOriginalColumns}
                isExpandContentAvailable
                additionalColumn={mockAdditionalColumn}
                updateColumnStructure={mockUpdateColumnStructure}
            />,
            mockContainer
        );

        const saveButton = document.getElementsByClassName(
            "btns btns__save"
        )[0];

        // triggering Save button Click
        act(() => {
            saveButton.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });
    });

    it("Un-select and Select All coloumns", () => {
        // LOGIC-->> UnSelect All Columns by unchecking the select All checkBox
        // expect the coloumn body (on showing all chosen coloumns) to be empty
        const { getByTestId } = render(
            <ColumnReordering
                isManageColumnOpen
                toggleManageColumns={toggleManageColumns}
                originalColumns={mockOriginalColumns}
                isExpandContentAvailable
                additionalColumn={mockAdditionalColumn}
                updateColumnStructure={mockUpdateColumnStructure}
            />,
            mockContainer
        );
        const selectAllCheckBox = getByTestId("selectAllCheckbox");

        // unchecking the select all checkbox
        fireEvent.click(selectAllCheckBox);

        // checking the select all checkbox
        fireEvent.click(selectAllCheckBox);

        const coloumnBodyInnerHtml = document
            .getElementsByClassName("column__settings")[0]
            .getElementsByClassName("column__body")[0]
            .getElementsByClassName("column__reorder");

        expect(coloumnBodyInnerHtml.length).toBe(10);
    });

    it("UnSelect The Segment Coloumn From Column Chooser", () => {
        act(() => {
            ReactDOM.render(
                <ColumnReordering
                    isManageColumnOpen
                    toggleManageColumns={toggleManageColumns}
                    originalColumns={mockOriginalColumns}
                    isExpandContentAvailable
                    additionalColumn={mockAdditionalColumn}
                    updateColumnStructure={mockUpdateColumnStructure}
                />,
                mockContainer
            );
        });

        const segmentColumCheckBox = document
            .getElementsByClassName("column__chooser")[0]
            .getElementsByClassName("column__checkbox")[3]
            .getElementsByTagName("input")[0];

        act(() => {
            segmentColumCheckBox.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });

        const isSegmentIncludedInBody = document
            .getElementsByClassName("column__settings")[0]
            .getElementsByClassName("column__body")[0]
            .innerHTML.includes("Segment");

        expect(isSegmentIncludedInBody).toBe(false);

        const saveButton = document.getElementsByClassName(
            "btns btns__save"
        )[0];

        // triggering Save button Click
        act(() => {
            saveButton.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });
    });

    it("UnSelect and Select Segment Column ", () => {
        // LOGIC-->> UnSelect and then select segment Column
        // expect no of coloumns to be as same before and after select
        act(() => {
            ReactDOM.render(
                <ColumnReordering
                    isManageColumnOpen
                    toggleManageColumns={toggleManageColumns}
                    originalColumns={mockOriginalColumns}
                    isExpandContentAvailable
                    additionalColumn={mockAdditionalColumn}
                    updateColumnStructure={mockUpdateColumnStructure}
                />,
                mockContainer
            );
        });

        const noOfColoumnsBeforeSelect = document
            .getElementsByClassName("column__settings")[0]
            .getElementsByClassName("column__body")[0]
            .getElementsByClassName("column__reorder").length;

        const segmentColumCheckBox = document
            .getElementsByClassName("column__chooser")[0]
            .getElementsByClassName("column__checkbox")[3]
            .getElementsByTagName("input")[0];

        // unchecking segment checkbox
        act(() => {
            segmentColumCheckBox.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });

        // checking segment checkbox
        act(() => {
            segmentColumCheckBox.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });

        const noOfColoumnsAfterSelect = document
            .getElementsByClassName("column__settings")[0]
            .getElementsByClassName("column__body")[0]
            .getElementsByClassName("column__reorder").length;

        expect(noOfColoumnsAfterSelect).toEqual(noOfColoumnsBeforeSelect);
    });

    it("UnSelect and Select Remarks Column ", () => {
        act(() => {
            ReactDOM.render(
                <ColumnReordering
                    isManageColumnOpen
                    toggleManageColumns={toggleManageColumns}
                    originalColumns={mockOriginalColumns}
                    isExpandContentAvailable
                    additionalColumn={mockAdditionalColumn}
                    updateColumnStructure={mockUpdateColumnStructure}
                />,
                mockContainer
            );
        });

        const noOfColoumnsBeforeSelect = document
            .getElementsByClassName("column__settings")[0]
            .getElementsByClassName("column__body")[0]
            .getElementsByClassName("column__reorder").length;

        const segmentColumCheckBox = document
            .getElementsByClassName("column__chooser")[0]
            .getElementsByClassName("column__checkbox")[10]
            .getElementsByTagName("input")[0];

        // unchecking segment checkbox
        act(() => {
            segmentColumCheckBox.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });

        // checking segment checkbox
        act(() => {
            segmentColumCheckBox.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });

        const noOfColoumnsAfterSelect = document
            .getElementsByClassName("column__settings")[0]
            .getElementsByClassName("column__body")[0]
            .getElementsByClassName("column__reorder").length;

        expect(noOfColoumnsAfterSelect).toEqual(noOfColoumnsBeforeSelect);
    });

    it("Unselect and Select Flight no Inner Cell", () => {
        const { container } = render(
            <ColumnReordering
                isManageColumnOpen
                toggleManageColumns={toggleManageColumns}
                originalColumns={mockOriginalColumns}
                isExpandContentAvailable
                additionalColumn={mockAdditionalColumn}
                updateColumnStructure={mockUpdateColumnStructure}
            />
        );
        const flightNoInnerCell = container.querySelectorAll(
            "[type='checkbox']"
        )[12];
        act(() => {
            flightNoInnerCell.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });
        expect(flightNoInnerCell.checked).toBeFalsy();
        act(() => {
            flightNoInnerCell.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });
        expect(flightNoInnerCell.checked).toBeTruthy();
    });

    it("UnSelect All and Click Reset Button without columns to expand", () => {
        act(() => {
            ReactDOM.render(
                <ColumnReordering
                    isManageColumnOpen
                    toggleManageColumns={toggleManageColumns}
                    originalColumns={mockOriginalColumns}
                    isExpandContentAvailable={false}
                    additionalColumn={mockAdditionalColumn}
                    updateColumnStructure={mockUpdateColumnStructure}
                />,
                mockContainer
            );
        });
        const selectAllCheckBox = document
            .getElementsByClassName("column__chooser")[0]
            .getElementsByClassName("column__body")[0]
            .getElementsByTagName("input")[1];
        // un-checking selectAll checkbox
        act(() => {
            selectAllCheckBox.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });
        const resetButton = document
            .getElementsByClassName("column__settings")[0]
            .getElementsByClassName("btns")[0];
        // clicking Reset button
        act(() => {
            resetButton.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });
        const noOfColoumnsAfterReset = document
            .getElementsByClassName("column__settings")[0]
            .getElementsByClassName("column__body")[0]
            .getElementsByClassName("column__reorder").length;

        expect(noOfColoumnsAfterReset).toEqual(9);
    });

    it("Error scenario for no Coloumns Selected", () => {
        act(() => {
            ReactDOM.render(
                <ColumnReordering
                    isManageColumnOpen
                    toggleManageColumns={toggleManageColumns}
                    originalColumns={mockOriginalColumns}
                    isExpandContentAvailable
                    additionalColumn={mockAdditionalColumn}
                    updateColumnStructure={mockUpdateColumnStructure}
                />,
                mockContainer
            );
        });

        const selectAllCheckBox = document
            .getElementsByClassName("column__chooser")[0]
            .getElementsByClassName("column__body")[0]
            .getElementsByTagName("input")[1];

        act(() => {
            selectAllCheckBox.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });

        expect(selectAllCheckBox.checked).toBeFalsy();

        const saveButton = document.getElementsByClassName(
            "btns btns__save"
        )[0];

        // un-checking selectAll checkbox
        act(() => {
            saveButton.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });
    });

    it("Select InnerCell Of Remarks", () => {
        const { container } = render(
            <ColumnReordering
                isManageColumnOpen
                toggleManageColumns={toggleManageColumns}
                originalColumns={mockOriginalColumns}
                isExpandContentAvailable
                additionalColumn={mockAdditionalColumn}
                updateColumnStructure={mockUpdateColumnStructure}
            />
        );

        const remarksInnerCellCheckBox = container
            .getElementsByClassName("column__reorder")[9]
            .getElementsByClassName("column__checkbox")[0]
            .getElementsByTagName("input")[0];
        act(() => {
            remarksInnerCellCheckBox.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });
    });

    it("Trigger search of columns onChnage", () => {
        act(() => {
            ReactDOM.render(
                <ColumnReordering
                    isManageColumnOpen
                    toggleManageColumns={toggleManageColumns}
                    originalColumns={mockOriginalColumns}
                    isExpandContentAvailable
                    additionalColumn={mockAdditionalColumn}
                    updateColumnStructure={mockUpdateColumnStructure}
                />,
                mockContainer
            );
        });

        const searchColoumnInputField = document
            .getElementsByClassName("column__chooser")[0]
            .getElementsByClassName("column__body")[0]
            .getElementsByTagName("input")[0];

        act(() => {
            searchColoumnInputField.dispatchEvent(
                new KeyboardEvent("keyDown", {
                    event: { target: { value: "id" } }
                })
            );
        });
    });

    it("should work drag and drop functionality", async () => {
        const createBubbledEvent = (type, props = {}) => {
            const event = new Event(type, { bubbles: true });
            Object.assign(event, props);
            return event;
        };
        const { getAllByTestId } = render(
            <ColumnReordering
                isManageColumnOpen
                toggleManageColumns={toggleManageColumns}
                originalColumns={mockOriginalColumns}
                isExpandContentAvailable
                additionalColumn={mockAdditionalColumn}
                updateColumnStructure={mockUpdateColumnStructure}
            />
        );
        expect(getAllByTestId("columnItem")).toHaveLength(9);
        const startingNode = getAllByTestId("columnItem")[0];
        const endingNode = getAllByTestId("columnItem")[1];
        act(() => {
            startingNode.dispatchEvent(
                createBubbledEvent("dragstart", { clientX: 0, clientY: 0 })
            );
            endingNode.dispatchEvent(
                createBubbledEvent("drop", { clientX: 0, clientY: 1 })
            );
        });
        await waitFor(() => expect(mockUpdateColumnStructure).toBeCalled());
    });
});
