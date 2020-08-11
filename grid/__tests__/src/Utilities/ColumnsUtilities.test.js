import React from "react";
import {extractColumns,extractAdditionalColumn} from '../../../src/Utilities/ColumnsUtilities';

const mockDisplayCell = jest.fn();
const columns = [  {
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
    displayCell: mockDisplayCell,
    columnId: 'column_0',
    displayInExpandedRegion: false
    }
]
const searchColumn = jest.fn();
const isDesktop = false;
const updateRowInGrid = jest.fn();
test('Test extractColumns', () => {
    const mockExtractColumns = jest.fn().mockImplementation(extractColumns);
    mockExtractColumns(columns,
        searchColumn,
        isDesktop,
        updateRowInGrid);
    expect(mockExtractColumns).toHaveBeenCalled();
});

test('Test extractAdditionalColumn', () => {
    const mockExtractColumns = jest.fn().mockImplementation(extractAdditionalColumn);
    mockExtractColumns(columns,
        isDesktop);
    expect(mockExtractColumns).toHaveBeenCalled();
});
