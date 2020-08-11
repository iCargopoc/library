import React from "react";
import {render,screen,fireEvent} from '@testing-library/react';
import RowEditOverLay from "../../../src/Functions/RowEditOverLay";
import '@testing-library/jest-dom';

describe("render row edit overlay", () => {

const rowdata ={
    travelId: 0,
    flight: {
      flightno: "XX2225",
      date: "31-Aug-2016"
    },
    segment: {
      from: "BCC",
      to: "ZZY"
    },
    details: {
      flightModel: 6518,
      bodyType: "Big Body",
      type: "Van",
      startTime: "01:23 (S)",
      endTime: "11:29 (E)",
      status: "To Be Cancelled",
      additionalStatus: "Elit est consectetur deserunt et sit officia eu. Qui minim quis exercitation in irure elit velit nisi officia cillum laborum reprehenderit.aliqua ex sint cupidatat non",
      timeStatus: "10:02 hrs to depart"
    },
    weight: {
      percentage: "16%",
      value: "35490/20000 kg"
    },
    volume: {
      percentage: "54%",
      value: "31/60 cbm"
    },
    uldPositions: [
      {
        position: "L1",
        value: "7/9"
      },
      {
        position: "Q1",
        value: "9/3"
      },
      {
        position: "L6",
        value: "8/4"
      },
      {
        position: "Q7",
        value: "4/9"
      }
    ],
    revenue: {
      revenue: "$63,474.27",
      yeild: "$7.90"
    },
    sr: "74/ AWBs",
    queuedBooking: {
      sr: "88/ AWBs",
      volume: "7437 kg / 31 cbm"
    },
    remarks: "Enim aute magna ipsum magna commodo qui aute et elit aliqua nostrud ea nulla duis. Proident dolore aliqua sint nostrud aliquip exercitation anim nulla quis cupidatat dolor nostrud aliqua incididunt. Mollit ut cillum Lorem laborum dolore proident."
}
    
const newrowdata ={
  travelId: 0,
  flight: {
    flightno: 'XX222',
    date: '31-Aug-2016'
  },
  segment: {
    from: 'BCC',
    to: 'ZZY'
  },
  details: {
    flightModel: 6518,
    bodyType: 'Big Body',
    type: 'Van',
    startTime: '01:23 (S)',
    endTime: '11:29 (E)',
    status: 'To Be Cancelled',
    additionalStatus: 'Elit est consectetur deserunt et sit officia eu. Qui minim quis exercitation in irure elit velit nisi officia cillum laborum reprehenderit.aliqua ex sint cupidatat non',
    timeStatus: '10:02 hrs to depart'
  },
  weight: {
    percentage: '16%',
    value: '35490/20000 kg'
  },
  volume: {
    percentage: '54%',
    value: '31/60 cbm'
  },
  uldPositions: [
    {
      position: 'L1',
      value: '7/9'
    },
    {
      position: 'Q1',
      value: '9/3'
    },
    {
      position: 'L6',
      value: '8/4'
    },
    {
      position: 'Q7',
      value: '4/9'
    }
  ],
  revenue: {
    revenue: '$63,474.27',
    yeild: '$7.90'
  },
  sr: '74/ AWBs',
  queuedBooking: {
    sr: '88/ AWBs',
    volume: '7437 kg / 31 cbm'
  },
  remarks: 'Enim aute magna ipsum magna commodo qui aute et elit aliqua nostrud ea nulla duis. Proident dolore aliqua sint nostrud aliquip exercitation anim nulla quis cupidatat dolor nostrud aliqua incididunt. Mollit ut cillum Lorem laborum dolore proident.'
}

const columnsdata = [
  {
    Header: "Id",
    accessor: "travelId",
    width: 50,
    disableFilters: true,
    columnId: "column_0"
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
  }
]

const additionalColumndata = {
  Header: "Remarks",
  innerCells: [
    {
      Header: "Remarks",
      accessor: "remarks"
    },
    {
      Header: "Details",
      onlyInTablet: true,
      accessor: "details"
    }
  ],
  columnId: "ExpandColumn",
  originalInnerCells: [
    {
      Header: "Remarks",
      accessor: "remarks"
    },
    {
      Header: "Details",
      onlyInTablet: true,
      accessor: "details"
    }
  ]
}


const  getRowEditOverlayMock = jest.fn();
const  closeRowEditOverlayMock = jest.fn();
const  updateRowInGridMock = jest.fn();

it("Should render", () => {
  const { getByText,queryByTestId,container} = render(
  <RowEditOverLay row={rowdata} columns={columnsdata} isRowExpandEnabled={true} additionalColumn={additionalColumndata} getRowEditOverlay={getRowEditOverlayMock} closeRowEditOverlay={closeRowEditOverlayMock} updateRowInGrid={updateRowInGridMock} />);
  expect(getByText('Save')).toBeInTheDocument(); 
  expect(getByText('Cancel')).toBeInTheDocument();
});


it("Save function should be called", () => {

 const { getByText,queryByTestId,container} = render(
 <RowEditOverLay row={rowdata} columns={columnsdata} isRowExpandEnabled={true} additionalColumn={additionalColumndata} getRowEditOverlay={getRowEditOverlayMock} closeRowEditOverlay={closeRowEditOverlayMock} updateRowInGrid={updateRowInGridMock} />);
 
 const setState = jest.fn();
 const useStateSpy = jest.spyOn(React, 'useState')
 useStateSpy.mockImplementation((init) => [init=newrowdata, setState]);
 

 fireEvent.click(getByText('Save'));
 expect(getRowEditOverlayMock).toHaveBeenCalledTimes(2);
}); 

it("Cancel function should be called", () => {
  const { getByText,queryByTestId,container} = render(
  <RowEditOverLay row={rowdata} columns={columnsdata} isRowExpandEnabled={true} additionalColumn={additionalColumndata} getRowEditOverlay={getRowEditOverlayMock} closeRowEditOverlay={closeRowEditOverlayMock} updateRowInGrid={updateRowInGridMock} />);
  fireEvent.click(getByText('Cancel'));
  expect(closeRowEditOverlayMock).toHaveBeenCalledTimes(2);
}); 

});
