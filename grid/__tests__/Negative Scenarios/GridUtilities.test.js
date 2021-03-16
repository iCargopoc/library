/* eslint-disable no-undef */
import { cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import {
    findSelectedRows,
    findSelectedRowIdFromIdAttribute,
    findDeSelectedRows
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
});
