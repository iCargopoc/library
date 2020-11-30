/* eslint-disable no-undef */
import React from "react";
import { render, cleanup, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { act } from "react-dom/test-utils";
import ColumnReordering from "../../../src/Overlays/managecolumns/index";

describe("ColumnReordering unit test", () => {
    const mockUpdateColumnStructure = jest.fn();
    const toggleManageColumnsOverlay = jest.fn();
    const mockAdditionalColumn = {
        Header: "Remarks",
        innerCells: [
            {
                Header: "Remarks",
                accessor: "remarks",
                display: true,
                cellId: "rowExpand_cell_0"
            }
        ],
        columnId: "rowExpand",
        isDisplayInExpandedRegion: true,
        display: true
    };

    const mockOriginalColumns = [
        {
            Header: "Id",
            accessor: "travelId",
            width: 50,
            disableFilters: true,
            columnId: "column_0",
            isDisplayInExpandedRegion: false,
            display: true
        },
        {
            Header: () => {
                return <span className="flightHeader">Flight</span>;
            },
            title: "Flight",
            accessor: "flight",
            width: 100,
            innerCells: [
                {
                    Header: "Flight No",
                    accessor: "flightno",
                    display: true,
                    cellId: "column_1_cell_0",
                    isSearchable: true
                },
                {
                    Header: "Date",
                    accessor: "date",
                    display: true,
                    cellId: "column_1_cell_1",
                    isSearchable: true
                }
            ],
            sortValue: "flightno",
            columnId: "column_1",
            isDisplayInExpandedRegion: false,
            display: true,
            isSearchable: true
        },
        {
            Header: "Segment",
            accessor: "segment",
            width: 100,
            innerCells: [
                {
                    Header: "From",
                    accessor: "from",
                    display: true,
                    cellId: "column_2_cell_0",
                    isSearchable: true
                },
                {
                    Header: "To",
                    accessor: "to",
                    display: true,
                    cellId: "column_2_cell_1",
                    isSearchable: true
                }
            ],
            disableSortBy: true,
            columnId: "column_2",
            isDisplayInExpandedRegion: false,
            display: true,
            isSearchable: true
        },
        {
            Header: "Weight",
            accessor: "weight",
            width: 130,
            innerCells: [
                {
                    Header: "Percentage",
                    accessor: "percentage",
                    display: true,
                    cellId: "column_3_cell_0",
                    isSearchable: true
                },
                {
                    Header: "Value",
                    accessor: "value",
                    display: true,
                    cellId: "column_3_cell_1",
                    isSearchable: true
                }
            ],
            sortValue: "percentage",
            columnId: "column_3",
            isDisplayInExpandedRegion: false,
            display: true,
            isSearchable: true
        },
        {
            Header: "Volume",
            accessor: "volume",
            width: 100,
            innerCells: [
                {
                    Header: "Percentage",
                    accessor: "percentage",
                    display: true,
                    cellId: "column_4_cell_0",
                    isSearchable: true
                },
                {
                    Header: "Value",
                    accessor: "value",
                    display: true,
                    cellId: "column_4_cell_1",
                    isSearchable: true
                }
            ],
            sortValue: "percentage",
            columnId: "column_4",
            isDisplayInExpandedRegion: false,
            display: true,
            isSearchable: true
        },
        {
            Header: "ULD Positions",
            accessor: "uldPositions",
            width: 120,
            innerCells: [
                {
                    Header: "Position",
                    accessor: "position",
                    display: true,
                    cellId: "column_5_cell_0",
                    isSearchable: true
                },
                {
                    Header: "Value",
                    accessor: "value",
                    display: true,
                    cellId: "column_5_cell_1",
                    isSearchable: true
                }
            ],
            disableSortBy: true,
            columnId: "column_5",
            isDisplayInExpandedRegion: false,
            display: true,
            isSearchable: true
        },
        {
            Header: "Revenue/Yield",
            accessor: "revenue",
            width: 120,
            innerCells: [
                {
                    Header: "Revenue",
                    accessor: "revenue",
                    display: true,
                    cellId: "column_6_cell_0",
                    isSearchable: true
                },
                {
                    Header: "Yeild",
                    accessor: "yeild",
                    display: true,
                    cellId: "column_6_cell_1",
                    isSearchable: true
                }
            ],
            sortValue: "revenue",
            columnId: "column_6",
            isDisplayInExpandedRegion: false,
            display: true,
            isSearchable: true
        },
        {
            Header: "SR",
            accessor: "sr",
            width: 90,
            columnId: "column_7",
            isDisplayInExpandedRegion: false,
            display: true,
            isSearchable: true
        },
        {
            Header: "Queued Booking",
            accessor: "queuedBooking",
            width: 130,
            innerCells: [
                {
                    Header: "Sr",
                    accessor: "sr",
                    display: true,
                    cellId: "column_8_cell_0",
                    isSearchable: true
                },
                {
                    Header: "Volume",
                    accessor: "volume",
                    display: true,
                    cellId: "column_8_cell_1",
                    isSearchable: true
                }
            ],
            disableSortBy: true,
            columnId: "column_8",
            isDisplayInExpandedRegion: false,
            display: true,
            isSearchable: true
        }
    ];
    afterEach(cleanup);
    let mockContainer;
    beforeAll(() => {
        mockContainer = document.createElement("div");
        document.body.appendChild(mockContainer);
    });

    it("should render ColumnReordering search component", () => {
        const { getByTestId, getAllByTestId } = render(
            <ColumnReordering
                toggleManageColumnsOverlay={toggleManageColumnsOverlay}
                columns={mockOriginalColumns}
                additionalColumn={mockAdditionalColumn}
                updateColumnStructure={mockUpdateColumnStructure}
            />
        );
        const columnsCount = getAllByTestId("column-box").length;
        const additionalColumnsCount = getAllByTestId("additional-column-box")
            .length;

        expect(columnsCount).toBe(9);
        expect(additionalColumnsCount).toBe(1);
        const cancelButton = getByTestId("cancel_columnsManage");
        // triggering Cancel button Click
        act(() => {
            cancelButton.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });
    });

    it("Click on Save button For Default Select", () => {
        const { getByTestId } = render(
            <ColumnReordering
                toggleManageColumnsOverlay={toggleManageColumnsOverlay}
                columns={mockOriginalColumns}
                additionalColumn={mockAdditionalColumn}
                updateColumnStructure={mockUpdateColumnStructure}
            />,
            mockContainer
        );

        const saveButton = getByTestId("save_columnsManage");
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
        const { getByTestId, getAllByTestId } = render(
            <ColumnReordering
                toggleManageColumnsOverlay={toggleManageColumnsOverlay}
                columns={mockOriginalColumns}
                additionalColumn={mockAdditionalColumn}
                updateColumnStructure={mockUpdateColumnStructure}
            />,
            mockContainer
        );
        const selectAllCheckBox = getByTestId("selectAllSearchableColumns");

        // unchecking the select all checkbox
        fireEvent.click(selectAllCheckBox);

        // Check column and additional column boxes count
        let columnsCount = document.querySelectorAll(
            "[data-testid='column-box']"
        ).length;
        let additionalColumnsCount = document.querySelectorAll(
            "[data-testid='additional-column-box']"
        ).length;
        expect(columnsCount).toBe(0);
        expect(additionalColumnsCount).toBe(0);

        // checking back the select all checkbox
        fireEvent.click(selectAllCheckBox);

        // Check column and additional column boxes count
        columnsCount = getAllByTestId("column-box").length;
        additionalColumnsCount = getAllByTestId("additional-column-box").length;
        expect(columnsCount).toBe(9);
        expect(additionalColumnsCount).toBe(1);

        const cancelButton = getByTestId("cancel_columnsManage");
        // triggering Save button Click
        act(() => {
            cancelButton.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });
    });

    it("UnSelect and Select The Segment Coloumn From Column Chooser", () => {
        const { getByTestId, getAllByTestId } = render(
            <ColumnReordering
                toggleManageColumnsOverlay={toggleManageColumnsOverlay}
                columns={mockOriginalColumns}
                additionalColumn={mockAdditionalColumn}
                updateColumnStructure={mockUpdateColumnStructure}
            />,
            mockContainer
        );

        // Check total column boxes count
        let columnsCount = document.querySelectorAll(
            "[data-testid='column-box']"
        ).length;
        expect(columnsCount).toBe(9);

        // Select segment column's checkbox
        let segmentColumCheckBox = getAllByTestId(
            "selectSingleSearchableColumn"
        )[2];
        act(() => {
            segmentColumCheckBox.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });

        // Check if 1 column box has been removed
        columnsCount = document.querySelectorAll("[data-testid='column-box']")
            .length;
        expect(columnsCount).toBe(8);

        // Check back the segment column checkbox
        segmentColumCheckBox = getAllByTestId(
            "selectSingleSearchableColumn"
        )[2];
        act(() => {
            segmentColumCheckBox.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });

        // Check if removed column box has been added back
        columnsCount = document.querySelectorAll("[data-testid='column-box']")
            .length;
        expect(columnsCount).toBe(9);

        // Save changes
        const saveButton = getByTestId("save_columnsManage");
        // triggering Save button Click
        act(() => {
            saveButton.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });
    });

    it("UnSelect and Select Remarks Column ", () => {
        const { getByTestId, getAllByTestId } = render(
            <ColumnReordering
                toggleManageColumnsOverlay={toggleManageColumnsOverlay}
                columns={mockOriginalColumns}
                additionalColumn={mockAdditionalColumn}
                updateColumnStructure={mockUpdateColumnStructure}
            />,
            mockContainer
        );

        // Check additional column box count
        let additionalColumnsCount = document.querySelectorAll(
            "[data-testid='additional-column-box']"
        ).length;
        expect(additionalColumnsCount).toBe(1);

        // Unchecking remarks column
        let remarksColumnCheckbox = getAllByTestId(
            "selectSingleSearchableColumn"
        )[9];
        act(() => {
            remarksColumnCheckbox.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });

        // Check if additional column box count is now 0
        additionalColumnsCount = document.querySelectorAll(
            "[data-testid='additional-column-box']"
        ).length;
        expect(additionalColumnsCount).toBe(0);

        // Checking remarks column again
        remarksColumnCheckbox = getAllByTestId(
            "selectSingleSearchableColumn"
        )[9];
        act(() => {
            remarksColumnCheckbox.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });

        // Check if additional column box count is now back to 1
        additionalColumnsCount = document.querySelectorAll(
            "[data-testid='additional-column-box']"
        ).length;
        expect(additionalColumnsCount).toBe(1);

        // Cancel changes
        const cancelButton = getByTestId("cancel_columnsManage");
        act(() => {
            cancelButton.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });
    });

    it("Unselect and Select Flight no Inner Cell", () => {
        const { container, getByTestId } = render(
            <ColumnReordering
                toggleManageColumnsOverlay={toggleManageColumnsOverlay}
                columns={mockOriginalColumns}
                additionalColumn={mockAdditionalColumn}
                updateColumnStructure={mockUpdateColumnStructure}
            />
        );

        // Uncheck inner cell
        let flightNoInnerCellCheckbox = container.querySelector(
            "[data-testid='selectInnerCell_column_1_column_1_cell_0']"
        );
        act(() => {
            flightNoInnerCellCheckbox.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });
        // Check if checkbox has been unselected
        expect(flightNoInnerCellCheckbox.checked).toBeFalsy();

        // Check back inner cell
        flightNoInnerCellCheckbox = container.querySelector(
            "[data-testid='selectInnerCell_column_1_column_1_cell_0']"
        );
        act(() => {
            flightNoInnerCellCheckbox.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });
        // Check if checkbox has been selected
        expect(flightNoInnerCellCheckbox.checked).toBeTruthy();

        // Cancel changes
        const cancelButton = getByTestId("cancel_columnsManage");
        act(() => {
            cancelButton.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });
    });

    it("UnSelect All and Click Reset Button", () => {
        const { getByTestId } = render(
            <ColumnReordering
                toggleManageColumnsOverlay={toggleManageColumnsOverlay}
                columns={mockOriginalColumns}
                additionalColumn={mockAdditionalColumn}
                updateColumnStructure={mockUpdateColumnStructure}
            />,
            mockContainer
        );

        // Check column and additional column boxes count
        let columnsCount = document.querySelectorAll(
            "[data-testid='column-box']"
        ).length;
        let additionalColumnsCount = document.querySelectorAll(
            "[data-testid='additional-column-box']"
        ).length;
        expect(columnsCount).toBe(9);
        expect(additionalColumnsCount).toBe(1);

        // un-checking selectAll checkbox
        const selectAllCheckBox = getByTestId("selectAllSearchableColumns");
        act(() => {
            selectAllCheckBox.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });

        // Check column and additional column boxes count
        columnsCount = document.querySelectorAll("[data-testid='column-box']")
            .length;
        additionalColumnsCount = document.querySelectorAll(
            "[data-testid='additional-column-box']"
        ).length;
        expect(columnsCount).toBe(0);
        expect(additionalColumnsCount).toBe(0);

        // Reset changes
        const resetButton = getByTestId("reset_columnsManage");
        act(() => {
            resetButton.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });
        columnsCount = document.querySelectorAll("[data-testid='column-box']")
            .length;
        additionalColumnsCount = document.querySelectorAll(
            "[data-testid='additional-column-box']"
        ).length;
        expect(columnsCount).toBe(9);
        expect(additionalColumnsCount).toBe(1);

        // Cancel changes
        const cancelButton = getByTestId("cancel_columnsManage");
        act(() => {
            cancelButton.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });
    });

    it("Error scenario for no Coloumns Selected", () => {
        const { getByTestId, getAllByTestId } = render(
            <ColumnReordering
                toggleManageColumnsOverlay={toggleManageColumnsOverlay}
                columns={mockOriginalColumns}
                additionalColumn={mockAdditionalColumn}
                updateColumnStructure={mockUpdateColumnStructure}
            />,
            mockContainer
        );

        // un-checking selectAll checkbox
        const selectAllCheckBox = getByTestId("selectAllSearchableColumns");
        act(() => {
            selectAllCheckBox.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });

        // Try to save
        const saveButton = getByTestId("save_columnsManage");
        act(() => {
            saveButton.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });

        // Check if error message is present
        const errorMessages = getAllByTestId("column-chooser-error");
        expect(errorMessages.length).toBe(1);

        // Cancel changes
        const cancelButton = getByTestId("cancel_columnsManage");
        act(() => {
            cancelButton.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });
    });

    it("Select InnerCell Of Remarks", () => {
        const { getByTestId } = render(
            <ColumnReordering
                toggleManageColumnsOverlay={toggleManageColumnsOverlay}
                columns={mockOriginalColumns}
                additionalColumn={mockAdditionalColumn}
                updateColumnStructure={mockUpdateColumnStructure}
            />
        );

        // Uncheck remarks inner cell
        let remarksInnerCellCheckBox = getByTestId(
            "selectInnerCell_rowExpand_rowExpand_cell_0"
        );
        act(() => {
            remarksInnerCellCheckBox.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });
        // Check if checkbox has been unchecked
        expect(remarksInnerCellCheckBox.checked).toBeFalsy();

        // Check it back
        remarksInnerCellCheckBox = getByTestId(
            "selectInnerCell_rowExpand_rowExpand_cell_0"
        );
        act(() => {
            remarksInnerCellCheckBox.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });
        // Check if checkbox has been checked
        expect(remarksInnerCellCheckBox.checked).toBeTruthy();
    });

    it("Trigger search of columns onChnage", () => {
        const { getByTestId, getAllByTestId } = render(
            <ColumnReordering
                toggleManageColumnsOverlay={toggleManageColumnsOverlay}
                columns={mockOriginalColumns}
                additionalColumn={mockAdditionalColumn}
                updateColumnStructure={mockUpdateColumnStructure}
            />
        );

        // Check total count of checkboxes available
        let columnCheckboxes = getAllByTestId("selectSingleSearchableColumn")
            .length;
        expect(columnCheckboxes).toBe(10);

        // Filter columns list
        const filterList = getByTestId("filterColumnsList");
        expect(filterList.value).toBe("");
        fireEvent.change(filterList, { target: { value: "id" } });
        expect(filterList.value).toBe("id");
        // Check total count of checkboxes available now
        columnCheckboxes = getAllByTestId("selectSingleSearchableColumn")
            .length;
        expect(columnCheckboxes).toBe(1);

        // Remove searched value
        fireEvent.change(filterList, { target: { value: "" } });
        expect(filterList.value).toBe("");
        // Check total count of checkboxes available now
        columnCheckboxes = getAllByTestId("selectSingleSearchableColumn")
            .length;
        expect(columnCheckboxes).toBe(10);
    });

    it("should work drag and drop functionality", () => {
        const createBubbledEvent = (type, props = {}) => {
            const event = new Event(type, { bubbles: true });
            Object.assign(event, props);
            return event;
        };
        const { getAllByTestId } = render(
            <ColumnReordering
                toggleManageColumnsOverlay={toggleManageColumnsOverlay}
                columns={mockOriginalColumns}
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
        expect(mockUpdateColumnStructure).toBeCalled();
    });
});
