/* eslint-disable no-undef */
import React from "react";
import { render, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { AdditionalColumnContext } from "../../src/Utilities/TagsContext";
import AdditionalColumnTag from "../../src/Functions/AdditionalColumnTag";

describe("AdditionalColumnTag unit test", () => {
    const additionalColumnMockData = {
        Header: "Remarks",
        display: true,
        innerCells: [
            {
                Header: "Remarks",
                accessor: "remarks",
                display: true,
                cellId: "rowExpand_cell_0"
            }
        ],
        columnId: "rowExpand",
        isDisplayInExpandedRegion: true
    };

    const mockDivContainer = document.createElement("div");
    let container;

    beforeEach(() => {
        container = mockDivContainer;
        document.body.appendChild(container);
    });
    afterEach(cleanup);

    it("should return null when additionalColumn is not passed", () => {
        render(
            <AdditionalColumnContext.Provider
                value={{
                    additionalColumn: null
                }}
            >
                <AdditionalColumnTag cellKey="remarks" />
            </AdditionalColumnContext.Provider>,
            container
        );
        // Nothing should have been rendered
        expect(container).toBe(mockDivContainer);
    });

    it("should return null when cell key is not passed", () => {
        render(
            <AdditionalColumnContext.Provider
                value={{
                    additionalColumn: additionalColumnMockData
                }}
            >
                <AdditionalColumnTag />
            </AdditionalColumnContext.Provider>,
            container
        );
        // Nothing should have been rendered
        expect(container).toBe(mockDivContainer);
    });

    it("should return null when invalid cell key is passed", () => {
        render(
            <AdditionalColumnContext.Provider
                value={{
                    additionalColumn: additionalColumnMockData
                }}
            >
                <AdditionalColumnTag cellKey="invalid" />
            </AdditionalColumnContext.Provider>,
            container
        );
        // Nothing should have been rendered
        expect(container).toBe(mockDivContainer);
    });
});
