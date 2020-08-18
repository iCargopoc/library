/* eslint-disable no-undef */
import React from "react";
import { render, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { AdditionalColumnContext } from "../../src/Utilities/TagsContext";
import AdditionalColumnTag from "../../src/Functions/AdditionalColumnTag";

describe("AdditionalColumnTag unit test", () => {
    const additionalColumnMockData = {
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
    };
    let container;
    beforeEach(() => {
        container = document.createElement("div");
        document.body.appendChild(container);
    });
    afterEach(cleanup);
    it("should renders component with cellkey and columnkey", () => {
        const componnet = render(
            <AdditionalColumnContext.Provider
                value={{
                    additionalColumn: additionalColumnMockData
                }}
            >
                <AdditionalColumnTag cellKey="remarks" />
            </AdditionalColumnContext.Provider>,
            container
        );
        expect(componnet).toBeDefined();
    });
    it("should return null when cellkey is not passed", () => {
        const component = render(
            <AdditionalColumnContext.Provider
                value={{
                    additionalColumn: additionalColumnMockData
                }}
            >
                <AdditionalColumnTag />
            </AdditionalColumnContext.Provider>,
            container
        );
        expect(component).toBeDefined();
    });
});
