import React from "react";
import ReactDOM from "react-dom";
import { render, cleanup, fireEvent ,screen, getByTestId} from "@testing-library/react";
import {create} from 'react-test-renderer';
import { act } from "react-dom/test-utils";
import "@testing-library/jest-dom/extend-expect";
import CellDisplayAndEdit,{getUpdatedRowValue} from './../../../src/Functions/CellDisplayAndEdit';

describe('CellDisplayAndEdit unit test', () => {
    const mockrowUpdateCallBack = jest.fn();
    const mockUpdateDateValue = jest.fn();
    const mockUpdateFlightNo = jest.fn(); 
    const mockDisplayCell = jest.fn((rowData,DisplayTag) => {
        const { flightno, date } = rowData.flight;
       return( 
        <div className="flight-details">
                        <DisplayTag cellKey="flightno" columnKey="flight">
                            <strong>{flightno}</strong>
                        </DisplayTag>
                        <DisplayTag cellKey="date">
                            <span>{date}</span>
                        </DisplayTag>
                    </div>)
    });
    const mockEditCell = jest.fn((rowData,DisplayTag,mockrowUpdateCallBack)=>{
        const { flightno, date } = rowData.flight;
    return (
        <div>
            <DisplayTag cellKey="flightno">
                <input type="text" value={flightno} onChange={mockUpdateFlightNo} />
            </DisplayTag>
            <DisplayTag cellKey="date">
                <input type="date" value={date} onChange={mockUpdateDateValue} />
            </DisplayTag>
        </div>
    );
    });
    const row ={
        column: {
        id:"flight",
        Cell: jest.fn(),
        accessor: jest.fn(),
        columnId: "column_1",
        depth: 0,
        displayCell: mockDisplayCell,
        editCell: mockEditCell,
        innerCells: [
         {Header: "Flight No", accessor: "flightno"},
         {Header: "Date", accessor: "date"}],
        isVisible: true,
        originalInnerCells: [
         {Header: "Flight No", accessor: "flightno"},
         {Header: "Date", accessor: "date"}]},        
         row: {
            original: {
               travelId: 0,
               flight: {
                  flightno: "XX2225",
                  date: "31-Aug-2016"
               }
            }
         }
        }

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
    editCell: mockEditCell
}
    ]
    
let container ;
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement("div");
  // container *must* be attached to document so events work correctly.
  document.body.appendChild(container);
});
afterEach(cleanup);
 const mockupdateRowInGrid = jest.fn();
    it('renders component', () => {
        const {container} = render(<CellDisplayAndEdit row={row} columns={columns} updateRowInGrid={mockupdateRowInGrid}/>);
        const div = container.getElementsByClassName('table-cell--content table-cell--content__flight')
        expect(div).toBeDefined();
    
    });
    it('should display edit option on clicking edit button', () => {
        act(() => {
            render(<CellDisplayAndEdit row={row} columns={columns} updateRowInGrid={mockupdateRowInGrid}/>, container);
          });     
        const component = document.querySelector("[class=cell-edit]").firstChild;
        act(() => {
         component.dispatchEvent(new MouseEvent("click", { bubbles: true }));        
       });
       
       const editDiv = document.getElementsByClassName('table-cell--content-edit')      
       expect(editDiv).toBeDefined();            
    
    });
    it('should display data passed to component', () => {
        const {getByText,container} = render(<CellDisplayAndEdit row={row} columns={columns} updateRowInGrid={mockupdateRowInGrid}/>);
        
        expect(getByText('31-Aug-2016')).toBeInTheDocument();          
    
    });
    it('should close edit option by clicking on close button', () => {
        let component=null;
        act(() => {
            component= render(<CellDisplayAndEdit row={row} columns={columns} updateRowInGrid={mockupdateRowInGrid}/>, container);
          });    
        const editButton = document.querySelector("[class=cell-edit]").firstChild;
        act(() => {
            editButton.dispatchEvent(new MouseEvent("click", { bubbles: true })); 
       });
       fireEvent.click(component.getByTestId('cancel'))        
    
    });
    
    it("should return null from DispalyTag if cellKey nor columnKey is passed", () => {
        const mockEmptyDisplayCell = jest.fn((rowData,DisplayTag) => {
            const { flightno, date } = rowData.flight;
           return( 
            <div className="flight-details">
                            <DisplayTag >
                                <strong>{flightno}</strong>
                            </DisplayTag>
                            <DisplayTag >
                                <span>{date}</span>
                            </DisplayTag>
                        </div>)
        });
        const columnsEmpty = [  {
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
        displayCell: mockEmptyDisplayCell,
        editCell: jest.fn()
    }
        ]
       
        const rowEmptyData ={
            column: {
            id:"flight",
            Cell: jest.fn(),
            accessor: jest.fn(),
            displayCell: mockEmptyDisplayCell,
            editCell: jest.fn(),
            innerCells: [
             {Header: "Flight No", accessor: "flightno"},
             {Header: "Date", accessor: "date"}],
            isVisible: true,
            originalInnerCells: [
             {Header: "Flight No", accessor: "flightno"},
             {Header: "Date", accessor: "date"}]},
             
             row: {
                original: {
                   travelId: 0,
                   flight: {
                      flightno: "",
                      date: ""
                   }
                }
             }
            }
            const {container} = render(<CellDisplayAndEdit row={rowEmptyData} columns={columnsEmpty} updateRowInGrid={mockupdateRowInGrid}/>);
            
            expect(container.getElementsByClassName('table-cell--content table-cell--content__flight').firstChild).toBeUndefined()
      });
      it('should save values in edit option by clicking on save button', () => {
        let component=null;
        act(() => {
            component= render(<CellDisplayAndEdit row={row} columns={columns} updateRowInGrid={mockupdateRowInGrid}/>, container);
          });    
        const editButton = document.querySelector("[class=cell-edit]").firstChild;
        act(() => {
            editButton.dispatchEvent(new MouseEvent("click", { bubbles: true })); 
       });
      
    //    const inputElementText = document.querySelector("input[type=text]")
    //    expect(inputElementText.value).toBe('XX2225') // empty before
    //    inputElementText.value="Good Day"
    //    expect(inputElementText.value).toBe('Good Day') //empty after
       fireEvent.click(component.getByTestId('ok')) 

       //expect(mockupdateRowInGrid.mock.calls.length).toBe(1); 
    
    });
    

    
}); 