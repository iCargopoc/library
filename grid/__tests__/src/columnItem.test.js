import React from 'react'
import ColumnItem from '../../src/Overlays/managecolumns/columnItem'
import ColumnsList from '../../src/Overlays/managecolumns/columnsList'
import { render } from '@testing-library/react'
import { DndProvider } from "react-dnd"
import { TouchBackend } from "react-dnd-touch-backend"
import { HTML5Backend } from "react-dnd-html5-backend"
import MultiBackend, { TouchTransition } from "react-dnd-multi-backend"
import "@testing-library/jest-dom/extend-expect";

const HTML5toTouch = {
    backends: [
        {
            backend: HTML5Backend
        },
        {
            backend: TouchBackend,
            options: { enableMouseEvents: true },
            preview: true,
            transition: TouchTransition
        }
    ]
};

const managedColumns = [
    {
        Header: 'Id',
        accessor: 'travelId',
        width: 50,
        disableFilters: true,
        columnId: 'column_0',
        displayInExpandedRegion: false
    },
    {
        Header: 'Flight',
        accessor: 'flight',
        width: 100,
        innerCells: [
            {
                Header: 'Flight No',
                accessor: 'flightno'
            },
            {
                Header: 'Date',
                accessor: 'date'
            }
        ],
        sortValue: 'flightno',
        columnId: 'column_1',
        displayInExpandedRegion: false,
        originalInnerCells: [
            {
                Header: 'Flight No',
                accessor: 'flightno'
            },
            {
                Header: 'Date',
                accessor: 'date'
            }
        ]
    }
]
const props = {
    columnsToManage: [...managedColumns]
}
const updateColumnsInState = jest.fn()
const isInnerCellSelected = jest.fn()
const selectInnerCells = jest.fn()
const data = {
    "id": 1,
    "Header": "Flight",
    "moveColumn": jest.fn(),
    "findColumn": jest.fn(() => 1),
    "originalInnerCells": [{
        "Header": "Flight No",
        "accessor": "flightno"
    },
    {
        "Header": "Date",
        "accessor": "date"
    }
    ],
    "isInnerCellSelected": jest.fn(),
    "selectInnerCells": jest.fn()
}

describe('render ColumnItem', () => {

    it('should renders parent component', () => {
        const { getByText, container } = render(<DndProvider backend={MultiBackend} options={HTML5toTouch} >
            <ColumnsList columnsToManage={managedColumns} updateColumnsInState={updateColumnsInState} isInnerCellSelected={isInnerCellSelected} selectInnerCells={selectInnerCells} />
        </DndProvider>);
        const childComponent = container.querySelector('div')
        expect(childComponent).toBeInTheDocument()
        expect(getByText('Flight')).toBeInTheDocument()
    });

    it('should renders child component', () => {
        const { getByText, container } = render(<DndProvider backend={MultiBackend} options={HTML5toTouch} columnsToManage={managedColumns} updateColumnsInState={updateColumnsInState} isInnerCellSelected={isInnerCellSelected} selectInnerCells={selectInnerCells}>
            <ColumnItem {...data} />
        </DndProvider>);
        const childComponent = container.querySelector('div')
        expect(childComponent).toBeInTheDocument()
    });
});
