/* eslint-disable no-undef */
import { cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import {
    findSelectedRows,
    findSelectedRowIdFromIdAttribute,
    findDeSelectedRows,
    getColumnElementsForPinColumn,
    getSelectedAndDeselectedSubCompRows
} from "../../src/Utilities/GridUtilities";

describe("Grid utility file test", () => {
    const mockGridRows = [
        {
            id: "0",
            original: {
                travelId: 0,
                isParent: true
            }
        },
        {
            id: "1",
            original: {
                travelId: 1,
                isParent: true
            }
        }
    ];
    const mockGridRowsWithSubComp = [
        {
            id: "0",
            original: {
                travelId: 0,
                subComponentData: [
                    {
                        hawbId: 0
                    },
                    {
                        hawbId: 1
                    },
                    {
                        hawbId: 2
                    }
                ]
            }
        },
        {
            id: "1",
            original: {
                travelId: 1,
                subComponentData: [
                    {
                        hawbId: 3
                    },
                    {
                        hawbId: 4
                    },
                    {
                        hawbId: 5
                    }
                ]
            }
        }
    ];
    const mockInvalidCurrentRowIdAttributes = [
        { rowId: 5, rowIdentifiers: [3] }
    ];
    const mockCurrentRowIdAttributes = [{ rowId: 1, rowIdentifiers: [6] }];
    const mockOldRowIdentifiers = [{ rowId: 1, rowIdentifiers: [3] }];
    let container;
    beforeEach(() => {
        container = document.createElement("div");
        document.body.appendChild(container);
    });
    afterEach(cleanup);
    it("should test findSelectedRows with undefined parameters", () => {
        const value = findSelectedRows(
            undefined,
            undefined,
            undefined,
            undefined
        );
        expect(value.length).toBe(0);
    });

    it("should test findSelectedRows with selectedRowIds having false values", () => {
        const value = findSelectedRows(
            mockGridRows,
            { 0: false },
            undefined,
            undefined
        );
        expect(value.length).toBe(0);
    });

    it("should test findSelectedRows with parent row values", () => {
        const value = findSelectedRows(
            mockGridRows,
            { 0: true },
            undefined,
            undefined
        );
        expect(value.length).toBe(0);
    });

    it("should test findSelectedRowIdFromIdAttribute with invalid row value", () => {
        const value = findSelectedRowIdFromIdAttribute(
            mockGridRows,
            "travelId",
            [5]
        );
        expect(value).toBe("");
    });

    it("should test findDeSelectedRows with invalid oldUserSelectedRowIdentifiers", () => {
        const value = findDeSelectedRows(
            mockGridRows,
            undefined,
            [],
            undefined
        );
        expect(value.length).toBe(0);
    });

    it("should test findDeSelectedRows with invalid deSelectedRow", () => {
        const value = findDeSelectedRows(mockGridRows, [5], [], "travelId");
        expect(value.length).toBe(0);
    });

    it("should test getColumnElementsForPinColumn with invalid parameters", () => {
        const value = getColumnElementsForPinColumn();
        expect(value.length).toBe(0); // Empty array should be returned
    });

    it("should test getSelectedAndDeselectedSubCompRows with old selection row values not present in current list", () => {
        const rowsList = getSelectedAndDeselectedSubCompRows(
            mockGridRowsWithSubComp,
            null,
            [],
            mockOldRowIdentifiers,
            "travelId",
            "hawbId"
        );
        const { selectedRows, deselectedRows } = rowsList;
        expect(selectedRows.length).toBe(0);
        expect(deselectedRows.length).toBe(1);
    });

    it("should test getSelectedAndDeselectedSubCompRows with empty gridRows", () => {
        const rowsList = getSelectedAndDeselectedSubCompRows(
            [],
            null,
            [],
            mockOldRowIdentifiers,
            "travelId",
            "hawbId"
        );
        const { selectedRows, deselectedRows } = rowsList;
        expect(selectedRows.length).toBe(0);
        expect(deselectedRows.length).toBe(0);
    });

    it("should test getSelectedAndDeselectedSubCompRows with current row select list with invalid rowId", () => {
        const rowsList = getSelectedAndDeselectedSubCompRows(
            mockGridRowsWithSubComp,
            null,
            mockInvalidCurrentRowIdAttributes,
            [],
            "travelId",
            "hawbId"
        );
        const { selectedRows, deselectedRows } = rowsList;
        expect(selectedRows.length).toBe(0);
        expect(deselectedRows.length).toBe(0);
    });

    it("should test getSelectedAndDeselectedSubCompRows with current row select list with invalid sub comp rowId", () => {
        const rowsList = getSelectedAndDeselectedSubCompRows(
            mockGridRowsWithSubComp,
            null,
            mockCurrentRowIdAttributes,
            [],
            "travelId",
            "hawbId"
        );
        const { selectedRows, deselectedRows } = rowsList;
        expect(selectedRows.length).toBe(0);
        expect(deselectedRows.length).toBe(0);
    });
});
