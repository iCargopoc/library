/* eslint-disable no-undef */
import React from "react";
import ReactDOM from "react-dom";
import { render, cleanup, fireEvent } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import "@testing-library/jest-dom/extend-expect";
import GroupSort from "../../../src/Overlays/groupsort/index";

describe("Group Sort-index test Cases", () => {
    const columns = [
        {
            Header: "Flight",
            accessor: "flight",
            columnId: "column_1",
            isSortable: true,
            width: 100,
            innerCells: [
                {
                    Header: "Flight No",
                    accessor: "flightno",
                    cellId: "column_1_cell_0",
                    display: true,
                    isSortable: true,
                    isSearchable: true
                },
                {
                    Header: "Date",
                    accessor: "date",
                    cellId: "column_1_cell_1",
                    display: true,
                    isSortable: true,
                    isSearchable: true
                }
            ],
            sortValue: "flightno",
            display: true,
            isSearchable: true
        },
        {
            Header: "Flight1",
            accessor: "flight1",
            columnId: "column_2",
            width: 100,
            isSortable: true,
            innerCells: [
                {
                    Header: "Flight No1",
                    accessor: "flightno1",
                    cellId: "column_2_cell_0",
                    display: true,
                    isSortable: true,
                    isSearchable: true
                },
                {
                    Header: "Date1",
                    accessor: "date1",
                    cellId: "column_2_cell_1",
                    display: true,
                    isSortable: true,
                    isSearchable: true
                }
            ],
            sortValue: "flightno1",
            display: true,
            isSearchable: true
        }
    ];

    let container;
    beforeEach(() => {
        // setup a DOM element as a render target
        container = document.createElement("div");
        // container *must* be attached to document so events work correctly.
        document.body.appendChild(container);
    });

    afterEach(cleanup);

    const mockTableGroupSortOverLay = jest.fn();
    const mockApplyGroupSortOverlay = jest.fn();
    const mockGroupSortOptions = [];

    it("Add New Sort And Clear Sort Options", () => {
        act(() => {
            ReactDOM.render(
                <GroupSort
                    groupSortOptions={mockGroupSortOptions}
                    toggleGroupSortOverLay={mockTableGroupSortOverLay}
                    gridColumns={columns}
                    applyGroupSort={mockApplyGroupSortOverlay}
                />,
                container
            );
        });

        // Check if overlay is opened
        const groupSortOverlay = container.querySelectorAll(
            "[data-testid='groupsortoverlay']"
        );
        expect(groupSortOverlay.length).toBe(1);

        // Check number of sort options before adding sort, should be 0
        let sortOptionsCount = container.querySelectorAll(
            "[data-testid='sortItem']"
        ).length;
        expect(sortOptionsCount).toBe(0);

        // adding a new sort
        const addSortLink = container.querySelectorAll(
            "[data-testid='addSort']"
        )[0];
        act(() => {
            addSortLink.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });
        // Check number of sort options before adding sort, should be 1
        sortOptionsCount = container.querySelectorAll(
            "[data-testid='sortItem']"
        ).length;
        expect(sortOptionsCount).toBe(1);

        // Clear all sort options
        const clearAllButton = container.querySelectorAll(
            "[data-testid='clearSort']"
        )[0];
        act(() => {
            clearAllButton.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });
        // Check number of sort options before adding sort, should be back to 0
        sortOptionsCount = container.querySelectorAll(
            "[data-testid='sortItem']"
        ).length;
        expect(sortOptionsCount).toBe(0);
    });

    it("Update A Sort Parameter And Apply", () => {
        act(() => {
            ReactDOM.render(
                <GroupSort
                    groupSortOptions={mockGroupSortOptions}
                    toggleGroupSortOverLay={mockTableGroupSortOverLay}
                    gridColumns={columns}
                    applyGroupSort={mockApplyGroupSortOverlay}
                />,
                container
            );
        });

        // Add new sort
        const addNewSortLink = container.querySelectorAll(
            "[data-testid='addSort']"
        )[0];
        act(() => {
            addNewSortLink.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });

        // Change Sort By
        const sortBySelect = container.querySelectorAll(
            "[data-testid='groupSort-sortBy']"
        )[0];
        fireEvent.change(sortBySelect, {
            target: { value: "flight1" }
        });

        // Change Sort On
        const sortOnSelect = container.querySelectorAll(
            "[data-testid='groupSort-sortOn']"
        )[0];
        fireEvent.change(sortOnSelect, {
            target: { value: "flightno1" }
        });

        // Change Sort Order
        const sortOrderSelect = container.querySelectorAll(
            "[data-testid='groupSort-order']"
        )[0];
        fireEvent.change(sortOrderSelect, {
            target: { value: "Descending" }
        });

        // Apply sort
        const applySortButton = container.querySelectorAll(
            "[data-testid='saveSort']"
        )[0];
        act(() => {
            applySortButton.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });

        // Mock function should have been called
        expect(mockApplyGroupSortOverlay).toBeCalled();
    });

    it("Copy and Delete A Sort Parameter", () => {
        act(() => {
            ReactDOM.render(
                <GroupSort
                    groupSortOptions={mockGroupSortOptions}
                    toggleGroupSortOverLay={mockTableGroupSortOverLay}
                    gridColumns={columns}
                    applyGroupSort={mockApplyGroupSortOverlay}
                />,
                container
            );
        });

        // Check number of sort options before adding sort, should be 0
        let sortOptionsCount = container.querySelectorAll(
            "[data-testid='sortItem']"
        ).length;
        expect(sortOptionsCount).toBe(0);

        // adding a new sort
        const addSortLink = container.querySelectorAll(
            "[data-testid='addSort']"
        )[0];
        act(() => {
            addSortLink.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });
        // Check number of sort options before adding sort, should be 1
        sortOptionsCount = container.querySelectorAll(
            "[data-testid='sortItem']"
        ).length;
        expect(sortOptionsCount).toBe(1);

        // Copy sort option
        const copyIcon = container.querySelectorAll(
            "[data-testid='sort-copy-icon']"
        )[0];
        act(() => {
            copyIcon.dispatchEvent(new MouseEvent("click", { bubbles: true }));
        });

        // Sort items count should be 2 now
        sortOptionsCount = container.querySelectorAll(
            "[data-testid='sortItem']"
        ).length;
        expect(sortOptionsCount).toBe(2);

        // Delete Sort option
        const deleteIcon = container.querySelectorAll(
            "[data-testid='sort-delete-icon']"
        )[0];
        act(() => {
            deleteIcon.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });

        // Sort items count should be back to 1 now
        sortOptionsCount = container.querySelectorAll(
            "[data-testid='sortItem']"
        ).length;
        expect(sortOptionsCount).toBe(1);
    });

    it("Apply duplicate sort options", () => {
        act(() => {
            ReactDOM.render(
                <GroupSort
                    groupSortOptions={mockGroupSortOptions}
                    toggleGroupSortOverLay={mockTableGroupSortOverLay}
                    gridColumns={columns}
                    applyGroupSort={mockApplyGroupSortOverlay}
                />,
                container
            );
        });

        // adding a new sort
        const addSortLink = container.querySelectorAll(
            "[data-testid='addSort']"
        )[0];
        act(() => {
            addSortLink.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });

        // Copy sort option
        const copyIcon = container.querySelectorAll(
            "[data-testid='sort-copy-icon']"
        )[0];
        act(() => {
            copyIcon.dispatchEvent(new MouseEvent("click", { bubbles: true }));
        });

        // Apply sort
        const applySortButton = container.querySelectorAll(
            "[data-testid='saveSort']"
        )[0];
        act(() => {
            applySortButton.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });

        // Check for error
        const errorMessages = container.querySelectorAll(
            "[data-testid='duplicate-sort-error']"
        );
        expect(errorMessages.length).toBe(1);
    });

    it("Drag and Drop", () => {
        const createBubbledEvent = (type, props = {}) => {
            const event = new Event(type, { bubbles: true });
            Object.assign(event, props);
            return event;
        };
        act(() => {
            ReactDOM.render(
                <GroupSort
                    groupSortOptions={mockGroupSortOptions}
                    toggleGroupSortOverLay={mockTableGroupSortOverLay}
                    gridColumns={columns}
                    applyGroupSort={mockApplyGroupSortOverlay}
                />,
                container
            );
        });

        // adding a new sort
        const addSortLink = container.querySelectorAll(
            "[data-testid='addSort']"
        )[0];
        act(() => {
            addSortLink.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });

        // Copy sort option
        const copyIcon = container.querySelectorAll(
            "[data-testid='sort-copy-icon']"
        )[0];
        act(() => {
            copyIcon.dispatchEvent(new MouseEvent("click", { bubbles: true }));
        });

        // Check if drag and drop options are available
        const dndOptions = container.querySelectorAll(
            "[data-testid='sortItemDnd']"
        );
        expect(dndOptions.length).toBe(2);

        // Do drag and drop
        const startingNode = dndOptions[0];
        const endingNode = dndOptions[1];
        act(() => {
            startingNode.dispatchEvent(
                createBubbledEvent("dragstart", { clientX: 0, clientY: 0 })
            );
        });
        act(() => {
            endingNode.dispatchEvent(
                createBubbledEvent("drop", { clientX: 0, clientY: 1 })
            );
        });

        // Do drag and don't do drop - false case
        act(() => {
            startingNode.dispatchEvent(
                createBubbledEvent("dragstart", { clientX: 0, clientY: 0 })
            );
        });
        fireEvent.dragEnd(startingNode);
    });
});
