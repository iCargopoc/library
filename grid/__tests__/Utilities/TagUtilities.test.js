/* eslint-disable no-undef */
import { checkInnerCells } from "../../src/Utilities/TagUtilities";

test("Test checkInnerCells without column", () => {
    const mockCheckInnerCells = jest.fn().mockImplementation(checkInnerCells);
    mockCheckInnerCells(null, "flight");
    expect(mockCheckInnerCells).toHaveBeenCalled();
});
test("Test checkInnerCells with column", () => {
    const column = {
        innerCells: [
            {
                Header: "Flight No",
                accessor: "flightno"
            },
            {
                Header: "Date",
                accessor: "date"
            }
        ]
    };
    const mockCheckInnerCells = jest.fn().mockImplementation(checkInnerCells);
    mockCheckInnerCells(column, "flightno");
    expect(mockCheckInnerCells).toHaveBeenCalled();
});
