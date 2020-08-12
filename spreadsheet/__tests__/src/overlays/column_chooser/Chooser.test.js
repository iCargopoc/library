import React from "react";
import ReactDOM from "react-dom";
import ColumnReordering from "../../../../src/overlays/column_chooser/Chooser";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import ReactTestUtils, { act } from "react-dom/test-utils";
import { render, screen, fireEvent, getByRole } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { DndProvider } from "react-dnd";
import ColumnsList from "../../../../src/overlays/column_chooser/columnsList";

let container;

beforeEach(() => {
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  document.body.removeChild(container);
  container = null;
});

test("chooser", () => {
  const props = {
    closeColumnReOrdering: jest.fn(),
    columns: [
      {
        key: "flightno",
        name: "FlightNo",
        draggable: false,
        editor: "Text",
        formulaApplicable: false,
        sortable: true,
        resizable: true,
        filterable: true,
        width: 150,
        filterType: "autoCompleteFilter",
      },
      {
        key: "date",
        name: "Date",
        draggable: false,
        editor: "DatePicker",
        formulaApplicable: false,
        sortable: true,
        resizable: true,
        filterable: true,
        width: 150,
        filterType: "autoCompleteFilter",
      },
      {
        key: "segmentfrom",
        name: "Segment From",
        draggable: false,
        editor: "DropDown",
        formulaApplicable: false,
        sortable: true,
        resizable: true,
        filterable: true,
        width: 150,
        filterType: "autoCompleteFilter",
      },
    ],
    headerKeys: ["FlightNo", "Date", "Segment From"],
    existingPinnedHeadersList: ["FlightNo", "Date", "Segment From"],
    maxLeftPinnedColumn: 5,
    updateTableAsPerRowChooser: jest.fn(),
    handleheaderNameList: jest.fn(),
  };
  act(() => {
    ReactDOM.render(<ColumnReordering {...props} />, container);
  });
  let component = ReactDOM.render(<ColumnReordering {...props} />, container);
  component.resetColumnReorderList();
  component.componentWillUnmount();
  component.resetColumnReorderList();
  component.selectAllToColumnReOrderList();
  component.selectAllToColumnReOrderList();
  component.addToColumnReorderEntityList("Segment From");
  component.filterColumnReorderList({ target: { value: "FlightNo" } });
  component.filterColumnReorderList({ target: { value: "" } });
  component.reArrangeLeftPinnedColumn("Segment From");
  component.setWrapperRef("div.columns--grid");
  component.handleClickOutside({
    target: "div.parentDiv",
  });
  
});
describe("chooser", () => {
  const props = {
    closeColumnReOrdering: jest.fn(),
    columns: [
      {
        key: "flightno",
        name: "FlightNo",
        draggable: false,
        editor: "Text",
        formulaApplicable: false,
        sortable: true,
        resizable: true,
        filterable: true,
        width: 150,
        filterType: "autoCompleteFilter",
      },
      {
        key: "date",
        name: "Date",
        draggable: false,
        editor: "DatePicker",
        formulaApplicable: false,
        sortable: true,
        resizable: true,
        filterable: true,
        width: 150,
        filterType: "autoCompleteFilter",
      },
      {
        key: "segmentfrom",
        name: "Segment From",
        draggable: false,
        editor: "DropDown",
        formulaApplicable: false,
        sortable: true,
        resizable: true,
        filterable: true,
        width: 150,
        filterType: "autoCompleteFilter",
      },
    ],
    headerKeys: ["FlightNo", "Date", "Segment From"],
    existingPinnedHeadersList: ["FlightNo", "Date", "Segment From"],
    maxLeftPinnedColumn: 5,
    updateTableAsPerRowChooser: jest.fn(),
    handleheaderNameList: jest.fn(),
  };
  // test("renderscolumnList", () => {
  //   const mockcolumnArray = jest.fn();
  //   const mockHandleReorderList = jest.fn();
  //   const wrapper = render(
  //     <DndProvider backend="backend" options={{ enableMouseEvents: true }}>
  //       <ColumnsList
  //         columnsArray={mockcolumnArray}
  //         handleReorderList={mockHandleReorderList}
  //       />
  //     </DndProvider>
  //   );
  // });
  test("triggers onChange event", () => {
    let component = ReactDOM.render(<ColumnReordering {...props} />, container);
    //screen.debug();
    //const element = screen.getByTestId("checkboxFlightNo");
    const name=screen.getByTestId("one")
    fireEvent.change(name, {
      target: { checked: true },
    });
    const named=screen.getByTestId("addPin")
    fireEvent.change(named, {
      target: { checked: true },
    });
    // screen.debug();

    // fireEvent.change(screen.getByRole("check1", input), {
    //   target: { value: ["FlightNo", "Date", "Segment From"] },
    // });

    // screen.debug();
  });
});

// const columns = [
//   {
//     key: "flightno",
//     name: "FlightNo",
//     draggable: false,
//     editor: "Text",
//     formulaApplicable: false,
//     sortable: true,
//     resizable: true,
//     filterable: true,
//     width: 150,
//     filterType: "autoCompleteFilter",
//   },
//   {
//     key: "date",
//     name: "Date",
//     draggable: false,
//     editor: "DatePicker",
//     formulaApplicable: false,
//     sortable: true,
//     resizable: true,
//     filterable: true,
//     width: 150,
//     filterType: "autoCompleteFilter",
//   },
//   {
//     key: "segmentfrom",
//     name: "Segment From",
//     draggable: false,
//     editor: "DropDown",
//     formulaApplicable: false,
//     sortable: true,
//     resizable: true,
//     filterable: true,
//     width: 150,
//     filterType: "autoCompleteFilter",
//   },
//   {
//     key: "revenue",
//     name: "Revenue",
//     draggable: false,
//     editor: "Text",
//     formulaApplicable: true,
//     sortable: true,
//     resizable: true,
//     filterable: true,
//     width: 150,
//     filterType: "autoCompleteFilter",
//   },
//   {
//     key: "yeild",
//     name: "Yeild",
//     draggable: false,
//     editor: "Text",
//     formulaApplicable: true,
//     sortable: true,
//     resizable: true,
//     filterable: true,
//     width: 150,
//     filterType: "autoCompleteFilter",
//   },
//   {
//     key: "segmentto",
//     name: "Segment To",
//     draggable: false,
//     editor: "DropDown",
//     formulaApplicable: false,
//     sortable: true,
//     resizable: true,
//     filterable: true,
//     width: 150,
//     filterType: "autoCompleteFilter",
//   },
//   {
//     key: "flightModel",
//     name: "Flight Model",
//     draggable: false,
//     formulaApplicable: false,
//     sortable: true,
//     resizable: true,
//     filterable: true,
//     width: 150,
//     filterType: "numeric",
//   },
//   {
//     key: "bodyType",
//     name: "Body Type",
//     draggable: false,
//     editor: "Text",
//     formulaApplicable: false,
//     sortable: true,
//     resizable: true,
//     filterable: true,
//     width: 150,
//     filterType: "autoCompleteFilter",
//   },
//   {
//     key: "type",
//     name: "Type",
//     draggable: false,
//     editor: "Text",
//     formulaApplicable: false,
//     sortable: true,
//     resizable: true,
//     filterable: true,
//     width: 150,
//     filterType: "autoCompleteFilter",
//   },
//   {
//     key: "startTime",
//     name: "Start Time",
//     draggable: false,
//     editor: "Text",
//     formulaApplicable: false,
//     sortable: true,
//     resizable: true,
//     filterable: true,
//     width: 150,
//     filterType: "autoCompleteFilter",
//   },
//   {
//     key: "endTime",
//     name: "End Time",
//     draggable: false,
//     editor: "Text",
//     formulaApplicable: false,
//     sortable: true,
//     resizable: true,
//     filterable: true,
//     width: 150,
//     filterType: "autoCompleteFilter",
//   },
//   {
//     key: "status",
//     name: "Status",
//     draggable: false,
//     editor: "Text",
//     formulaApplicable: false,
//     sortable: true,
//     resizable: true,
//     filterable: true,
//     width: 150,
//     filterType: "autoCompleteFilter",
//   },
//   {
//     key: "additionalStatus",
//     name: "Additional Status",
//     draggable: false,
//     editor: "Text",
//     formulaApplicable: false,
//     sortable: true,
//     resizable: true,
//     filterable: true,
//     width: 150,
//     filterType: "autoCompleteFilter",
//   },
//   {
//     key: "timeStatus",
//     name: "Time Status",
//     draggable: false,
//     editor: "Text",
//     formulaApplicable: false,
//     sortable: true,
//     resizable: true,
//     filterable: true,
//     width: 150,
//     filterType: "autoCompleteFilter",
//   },
//   {
//     key: "weightpercentage",
//     name: "Weight Percentage",
//     draggable: false,
//     editor: "Text",
//     formulaApplicable: false,
//     sortable: true,
//     resizable: true,
//     filterable: true,
//     width: 150,
//     filterType: "autoCompleteFilter",
//   },
//   {
//     key: "weightvalue",
//     name: "Weight Value",
//     draggable: false,
//     editor: "Text",
//     formulaApplicable: true,
//     sortable: true,
//     resizable: true,
//     filterable: true,
//     width: 150,
//     filterType: "autoCompleteFilter",
//   },
//   {
//     key: "volumepercentage",
//     name: "Volume Percentage",
//     draggable: false,
//     editor: "Text",
//     formulaApplicable: true,
//     sortable: true,
//     resizable: true,
//     filterable: true,
//     width: 150,
//     filterType: "autoCompleteFilter",
//   },
//   {
//     key: "volumevalue",
//     name: "Volume Value",
//     draggable: false,
//     editor: "Text",
//     formulaApplicable: false,
//     sortable: true,
//     resizable: true,
//     filterable: true,
//     width: 150,
//     filterType: "autoCompleteFilter",
//   },
//   {
//     key: "uldposition1",
//     name: "uldposition1",
//     draggable: false,
//     editor: "Text",
//     formulaApplicable: false,
//     sortable: true,
//     resizable: true,
//     filterable: true,
//     width: 150,
//     filterType: "autoCompleteFilter",
//   },
//   {
//     key: "uldvalue1",
//     name: "uldvalue1",
//     draggable: false,
//     editor: "Text",
//     formulaApplicable: false,
//     sortable: true,
//     resizable: true,
//     filterable: true,
//     width: 150,
//     filterType: "autoCompleteFilter",
//   },
//   {
//     key: "uldposition2",
//     name: "uldposition2",
//     draggable: false,
//     editor: "Text",
//     formulaApplicable: false,
//     sortable: true,
//     resizable: true,
//     filterable: true,
//     width: 150,
//     filterType: "autoCompleteFilter",
//   },
//   {
//     key: "uldvalue2",
//     name: "uldvalue2",
//     draggable: false,
//     editor: "Text",
//     formulaApplicable: false,
//     sortable: true,
//     resizable: true,
//     filterable: true,
//     width: 150,
//     filterType: "autoCompleteFilter",
//   },
//   {
//     key: "uldposition3",
//     name: "uldposition3",
//     draggable: false,
//     editor: "Text",
//     formulaApplicable: false,
//     sortable: true,
//     resizable: true,
//     filterable: true,
//     width: 150,
//     filterType: "autoCompleteFilter",
//   },
//   {
//     key: "uldvalue3",
//     name: "uldvalue3",
//     draggable: false,
//     editor: "Text",
//     formulaApplicable: false,
//     sortable: true,
//     resizable: true,
//     filterable: true,
//     width: 150,
//     filterType: "autoCompleteFilter",
//   },
//   {
//     key: "uldposition4",
//     name: "uldposition4",
//     draggable: false,
//     editor: "Text",
//     formulaApplicable: false,
//     sortable: true,
//     resizable: true,
//     filterable: true,
//     width: 150,
//     filterType: "autoCompleteFilter",
//   },
//   {
//     key: "uldvalue4",
//     name: "uldvalue4",
//     draggable: false,
//     editor: "Text",
//     formulaApplicable: false,
//     sortable: true,
//     resizable: true,
//     filterable: true,
//     width: 150,
//     filterType: "autoCompleteFilter",
//   },

//   {
//     key: "sr",
//     name: "SR",
//     draggable: false,
//     editor: "Text",
//     formulaApplicable: false,
//     sortable: true,
//     resizable: true,
//     filterable: true,
//     width: 150,
//     filterType: "autoCompleteFilter",
//   },
//   {
//     key: "queuedBookingSR",
//     name: "Queued Booking SR",
//     draggable: false,
//     editor: "Text",
//     formulaApplicable: false,
//     sortable: true,
//     resizable: true,
//     filterable: true,
//     width: 150,
//     filterType: "autoCompleteFilter",
//   },
//   {
//     key: "queuedBookingvolume",
//     name: "Queued Booking Volume",
//     draggable: false,
//     editor: "Text",
//     formulaApplicable: false,
//     sortable: true,
//     resizable: true,
//     filterable: true,
//     width: 150,
//     filterType: "autoCompleteFilter",
//   },
// ];

// describe("<ColumnReordering />", () => {
//   const props = {
//     closeColumnReOrdering: jest.fn(),
//     handleheaderNameList: jest.fn(),
//     columns: [
//       {
//         key: "flightno",
//         name: "FlightNo",
//         draggable: false,
//         editor: "Text",
//         formulaApplicable: false,
//         sortable: true,
//         resizable: true,
//         filterable: true,
//         width: 150,
//         filterType: "autoCompleteFilter",
//       },
//       {
//         key: "date",
//         name: "Date",
//         draggable: false,
//         editor: "DatePicker",
//         formulaApplicable: false,
//         sortable: true,
//         resizable: true,
//         filterable: true,
//         width: 150,
//         filterType: "autoCompleteFilter",
//       },
//       {
//         key: "segmentfrom",
//         name: "Segment From",
//         draggable: false,
//         editor: "DropDown",
//         formulaApplicable: false,
//         sortable: true,
//         resizable: true,
//         filterable: true,
//         width: 150,
//         filterType: "autoCompleteFilter",
//       },
//     ],
//     headerKeys: ["FlightNo", "Date", "Segment From"],
//     existingPinnedHeadersList: ["FlightNo", "Date"],
//   };
//   it("mount", () => {
//     const mockUpdateTableAsPerRowChooser = jest.fn();
//     const mockCloseColumnReOrdering = jest.fn();
//     const mockHandleheaderNameList = jest.fn();

//     var mockPinnedHeadersList = [];
//     columns
//       .filter((item) => item.frozen !== undefined && item.frozen === true)
//       .map((item) => mockPinnedHeadersList.push(item.name));
//     var mockHeaderNameList = [];
//     columns.map((item) => mockHeaderNameList.push(item.name));

//     const wrapper = mount(
//       <ColumnReordering
//         maxLeftPinnedColumn={5}
//         headerKeys={mockHeaderNameList}
//         existingPinnedHeadersList={mockPinnedHeadersList}
//         updateTableAsPerRowChooser={mockUpdateTableAsPerRowChooser}
//         closeColumnReOrdering={mockCloseColumnReOrdering}
//         handleheaderNameList={mockHandleheaderNameList}
//         columns={columns}
//       />
//     );
//     expect(wrapper).not.toBeNull();
//   });
//   test("Coloumn Chooser on-close --TEST", () => {
//     const mockUpdateTableAsPerRowChooser = jest.fn();
//     const mockCloseColumnReOrdering = jest.fn();
//     const mockHandleheaderNameList = jest.fn();

//     var mockPinnedHeadersList = [];
//     columns
//       .filter((item) => item.frozen !== undefined && item.frozen === true)
//       .map((item) => mockPinnedHeadersList.push(item.name));
//     var mockHeaderNameList = [];
//     columns.map((item) => mockHeaderNameList.push(item.name));

//     const component = mount(
//       <ColumnReordering
//         maxLeftPinnedColumn={5}
//         headerKeys={mockHeaderNameList}
//         existingPinnedHeadersList={mockPinnedHeadersList}
//         updateTableAsPerRowChooser={mockUpdateTableAsPerRowChooser}
//         closeColumnReOrdering={mockCloseColumnReOrdering}
//         handleheaderNameList={mockHandleheaderNameList}
//         columns={columns}
//       />
//     );

//     component.find(".column__close FontAwesomeIcon").simulate("click");
//     expect(mockCloseColumnReOrdering.mock.calls.length).toBe(1);
//   });

//   test("Select all to ColumReorderList --TEST", () => {
//     const mockUpdateTableAsPerRowChooser = jest.fn();
//     const mockCloseColumnReOrdering = jest.fn();
//     const mockHandleheaderNameList = jest.fn();
//     var mockPinnedHeadersList = [];
//     columns
//       .filter((item) => item.frozen !== undefined && item.frozen === true)
//       .map((item) => mockPinnedHeadersList.push(item.name));
//     var mockHeaderNameList = [];
//     columns.map((item) => mockHeaderNameList.push(item.name));

//     const component = mount(
//       <ColumnReordering
//         maxLeftPinnedColumn={5}
//         headerKeys={mockHeaderNameList}
//         existingPinnedHeadersList={mockPinnedHeadersList}
//         updateTableAsPerRowChooser={mockUpdateTableAsPerRowChooser}
//         closeColumnReOrdering={mockCloseColumnReOrdering}
//         handleheaderNameList={mockHandleheaderNameList}
//         columns={columns}
//       />
//     );
//     component.find("input#selectallcolumncheckbox").simulate("change");
//     let checkBoxBelowSelectAll = component.find(
//       "input#checkboxtoselectreorder_FlightNo"
//     );
//     /*as select all will be checked by default. A simulate change on it will deselect it.
//     So asserting false */
//     expect(checkBoxBelowSelectAll.props().checked).toBe(false);
//   });

//   test("un-Selecting FlightNo to Column Reorder Entity List --Test", () => {
//     const mockUpdateTableAsPerRowChooser = jest.fn();
//     const mockCloseColumnReOrdering = jest.fn();
//     const mockHandleheaderNameList = jest.fn();
//     var mockPinnedHeadersList = [];
//     columns
//       .filter((item) => item.frozen !== undefined && item.frozen === true)
//       .map((item) => mockPinnedHeadersList.push(item.name));
//     var mockHeaderNameList = [];
//     columns.map((item) => mockHeaderNameList.push(item.name));

//     const component = mount(
//       <ColumnReordering
//         maxLeftPinnedColumn={5}
//         headerKeys={mockHeaderNameList}
//         existingPinnedHeadersList={mockPinnedHeadersList}
//         updateTableAsPerRowChooser={mockUpdateTableAsPerRowChooser}
//         closeColumnReOrdering={mockCloseColumnReOrdering}
//         handleheaderNameList={mockHandleheaderNameList}
//         columns={columns}
//       />
//     );
//     component.find("input#checkboxtoselectreorder_FlightNo").simulate("change");
//     let checkBoxSelectAll = component.find("input#selectallcolumncheckbox");
//     /*as on un selecting the Flight No check-box, select All
//   Check Box will be unselected */
//     expect(checkBoxSelectAll.props().checked).toBe(false);
//   });

//   test("select Yeild check Box after un selecting All --TEST", () => {
//     const mockUpdateTableAsPerRowChooser = jest.fn();
//     const mockCloseColumnReOrdering = jest.fn();
//     const mockHandleheaderNameList = jest.fn();
//     var mockPinnedHeadersList = [];
//     columns
//       .filter((item) => item.frozen !== undefined && item.frozen === true)
//       .map((item) => mockPinnedHeadersList.push(item.name));
//     var mockHeaderNameList = [];
//     columns.map((item) => mockHeaderNameList.push(item.name));
//     const component = mount(
//       <ColumnReordering
//         maxLeftPinnedColumn={5}
//         headerKeys={mockHeaderNameList}
//         existingPinnedHeadersList={mockPinnedHeadersList}
//         updateTableAsPerRowChooser={mockUpdateTableAsPerRowChooser}
//         closeColumnReOrdering={mockCloseColumnReOrdering}
//         handleheaderNameList={mockHandleheaderNameList}
//         columns={columns}
//       />
//     );

//     //unselecting all
//     component.find("input#selectallcolumncheckbox").simulate("change");

//     //selecting Yeild checkbox
//     component.find("input#checkboxtoselectreorder_Yeild").simulate("change");

//     /*checking whether Yeild column has been added to column_body div
//   column__reorder__name should have Yeild as text
//   */
//     let columAddedToBody = component.find(".column__reorder__name");
//     expect(columAddedToBody.text()).toBe("Yeild");
//   });

//   test("Pinn Left Status Column -- TEST", () => {
//     const mockUpdateTableAsPerRowChooser = jest.fn();
//     const mockCloseColumnReOrdering = jest.fn();
//     const mockHandleheaderNameList = jest.fn();
//     var mockPinnedHeadersList = [];
//     columns
//       .filter((item) => item.frozen !== undefined && item.frozen === true)
//       .map((item) => mockPinnedHeadersList.push(item.name));
//     var mockHeaderNameList = [];
//     columns.map((item) => mockHeaderNameList.push(item.name));
//     const component = mount(
//       <ColumnReordering
//         maxLeftPinnedColumn={5}
//         headerKeys={mockHeaderNameList}
//         existingPinnedHeadersList={mockPinnedHeadersList}
//         updateTableAsPerRowChooser={mockUpdateTableAsPerRowChooser}
//         closeColumnReOrdering={mockCloseColumnReOrdering}
//         handleheaderNameList={mockHandleheaderNameList}
//         columns={columns}
//       />
//     );

//     //left pinning Status Column
//     component.find("input#checkBoxToPinLeft_Status").simulate("change");

//     //checking whether the first element in column chooser body is Status or not.
//     let columAddedToBody = component.find(".column__reorder__name").at(0);
//     expect(columAddedToBody.text()).toBe("Status");
//   });

//   test("Click Of Save button --TEST", () => {
//     const mockUpdateTableAsPerRowChooser = jest.fn();
//     const mockCloseColumnReOrdering = jest.fn();
//     const mockHandleheaderNameList = jest.fn();
//     var mockPinnedHeadersList = [];
//     columns
//       .filter((item) => item.frozen !== undefined && item.frozen === true)
//       .map((item) => mockPinnedHeadersList.push(item.name));
//     var mockHeaderNameList = [];
//     columns.map((item) => mockHeaderNameList.push(item.name));
//     const component = mount(
//       <ColumnReordering
//         maxLeftPinnedColumn={5}
//         headerKeys={mockHeaderNameList}
//         existingPinnedHeadersList={mockPinnedHeadersList}
//         updateTableAsPerRowChooser={mockUpdateTableAsPerRowChooser}
//         closeColumnReOrdering={mockCloseColumnReOrdering}
//         handleheaderNameList={mockHandleheaderNameList}
//         columns={columns}
//       />
//     );

//     //clicking save button.
//     component.find(".column__btns .btns.btns__save").simulate("click");
//     expect(mockUpdateTableAsPerRowChooser.mock.calls.length).toBe(1);
//   });

//   test("Click Of Cancel button --TEST", () => {
//     const mockUpdateTableAsPerRowChooser = jest.fn();
//     const mockCloseColumnReOrdering = jest.fn();
//     const mockHandleheaderNameList = jest.fn();
//     var mockPinnedHeadersList = [];
//     columns
//       .filter((item) => item.frozen !== undefined && item.frozen === true)
//       .map((item) => mockPinnedHeadersList.push(item.name));
//     var mockHeaderNameList = [];
//     columns.map((item) => mockHeaderNameList.push(item.name));
//     const component = mount(
//       <ColumnReordering
//         maxLeftPinnedColumn={5}
//         headerKeys={mockHeaderNameList}
//         existingPinnedHeadersList={mockPinnedHeadersList}
//         updateTableAsPerRowChooser={mockUpdateTableAsPerRowChooser}
//         closeColumnReOrdering={mockCloseColumnReOrdering}
//         handleheaderNameList={mockHandleheaderNameList}
//         columns={columns}
//       />
//     );

//     //clicking cancel button.
//     component.find(".column__btns .btns").at(1).simulate("click");
//     expect(mockCloseColumnReOrdering.mock.calls.length).toBe(1);
//   });

//   test("Click Of Reset button --TEST", () => {
//     const mockUpdateTableAsPerRowChooser = jest.fn();
//     const mockCloseColumnReOrdering = jest.fn();
//     const mockHandleheaderNameList = jest.fn();
//     var mockPinnedHeadersList = [];
//     columns
//       .filter((item) => item.frozen !== undefined && item.frozen === true)
//       .map((item) => mockPinnedHeadersList.push(item.name));
//     var mockHeaderNameList = [];
//     columns.map((item) => mockHeaderNameList.push(item.name));
//     const component = mount(
//       <ColumnReordering
//         maxLeftPinnedColumn={5}
//         headerKeys={mockHeaderNameList}
//         existingPinnedHeadersList={mockPinnedHeadersList}
//         updateTableAsPerRowChooser={mockUpdateTableAsPerRowChooser}
//         closeColumnReOrdering={mockCloseColumnReOrdering}
//         handleheaderNameList={mockHandleheaderNameList}
//         columns={columns}
//       />
//     );

//     //clicking reset button.
//     component.find(".column__btns .btns").at(0).simulate("click");
//     //expect(component.instance().resetColumnReorderList()).equals(true);
//   });

//   test("On Change Text Box Search --TEST", () => {
//     const onSearchMock = jest.fn();
//     const event = {
//       preventDefault() {},
//       target: { value: "Flight" },
//     };

//     const mockUpdateTableAsPerRowChooser = jest.fn();
//     const mockCloseColumnReOrdering = jest.fn();
//     const mockHandleheaderNameList = jest.fn();
//     var mockPinnedHeadersList = [];
//     columns
//       .filter((item) => item.frozen !== undefined && item.frozen === true)
//       .map((item) => mockPinnedHeadersList.push(item.name));
//     var mockHeaderNameList = [];
//     columns.map((item) => mockHeaderNameList.push(item.name));
//     const component = mount(
//       <ColumnReordering
//         maxLeftPinnedColumn={5}
//         headerKeys={mockHeaderNameList}
//         existingPinnedHeadersList={mockPinnedHeadersList}
//         updateTableAsPerRowChooser={mockUpdateTableAsPerRowChooser}
//         closeColumnReOrdering={mockCloseColumnReOrdering}
//         handleheaderNameList={mockHandleheaderNameList}
//         columns={columns}
//       />
//     );

//     component.find(".column__body .custom__ctrl").simulate("change", event);
//     /**
//   checking text present in column chooser left pannel to be filtered as per
//   keyWord Flight. Select All is present by default
//    */
//     expect(component.find(".column__body").at(0).text()).toBe(
//       "Select allFlightNoFlight Model"
//     );
//   });

//   test("select and unselect checkbox --TEST", () => {
//     const mockUpdateTableAsPerRowChooser = jest.fn();
//     const mockCloseColumnReOrdering = jest.fn();
//     const mockHandleheaderNameList = jest.fn();
//     var mockPinnedHeadersList = [];
//     columns
//       .filter((item) => item.frozen !== undefined && item.frozen === true)
//       .map((item) => mockPinnedHeadersList.push(item.name));
//     var mockHeaderNameList = [];
//     columns.map((item) => mockHeaderNameList.push(item.name));

//     const component = mount(
//       <ColumnReordering
//         maxLeftPinnedColumn={5}
//         headerKeys={mockHeaderNameList}
//         existingPinnedHeadersList={mockPinnedHeadersList}
//         updateTableAsPerRowChooser={mockUpdateTableAsPerRowChooser}
//         closeColumnReOrdering={mockCloseColumnReOrdering}
//         handleheaderNameList={mockHandleheaderNameList}
//         columns={columns}
//       />
//     );

//     //unselect
//     component.find("input#selectallcolumncheckbox").simulate("change");
//     //select
//     component.find("input#selectallcolumncheckbox").simulate("change");

//     let checkBoxBelowSelectAll = component.find(
//       "input#checkboxtoselectreorder_FlightNo"
//     );
//     /*as select all will be checked by default. A simulate change on it will deselect it and .
//     So asserting true */
//     expect(checkBoxBelowSelectAll.props().checked).toBe(true);
//   });
//   it("Should not call action on/off click inside the ColumnReordering", () => {
//     const map = {};
//     document.addEventListener = jest.fn((event, cb) => {
//       map[event] = cb;
//     });

//     const props = {
//       closeColumnReOrdering: jest.fn(),
//       columns: [
//         {
//           key: "flightno",
//           name: "FlightNo",
//           draggable: false,
//           editor: "Text",
//           formulaApplicable: false,
//           sortable: true,
//           resizable: true,
//           filterable: true,
//           width: 150,
//           filterType: "autoCompleteFilter",
//         },
//         {
//           key: "date",
//           name: "Date",
//           draggable: false,
//           editor: "DatePicker",
//           formulaApplicable: false,
//           sortable: true,
//           resizable: true,
//           filterable: true,
//           width: 150,
//           filterType: "autoCompleteFilter",
//         },
//         {
//           key: "segmentfrom",
//           name: "Segment From",
//           draggable: false,
//           editor: "DropDown",
//           formulaApplicable: false,
//           sortable: true,
//           resizable: true,
//           filterable: true,
//           width: 150,
//           filterType: "autoCompleteFilter",
//         },
//       ],
//       headerKeys: ["FlightNo", "Date", "Segment From"],
//       existingPinnedHeadersList: ["FlightNo", "Date"],
//     };

//     const wrapper = mount(<ColumnReordering {...props} />);
//     const mockFunc = jest.fn();
//     const component = mount(
//       <FontAwesomeIcon
//         className="icon-close"
//         icon={faTimes}
//         onClick={mockFunc}
//       ></FontAwesomeIcon>
//     );

//     map.mousedown({
//       target: ReactDOM.findDOMNode(wrapper.instance()),
//     });

//     expect(props.closeColumnReOrdering).not.toHaveBeenCalled();

//     map.mousedown({
//       target: ReactDOM.findDOMNode(component.instance()),
//     });
//     expect(props.closeColumnReOrdering).toHaveBeenCalled();
//     wrapper.unmount();
//   });
//   it("addToColumnReorderEntityList function negation part testing", () => {
//     const wrapper = shallow(<ColumnReordering {...props} />);
//     wrapper.addToColumnReorderEntityList = jest.fn();
//     wrapper.setState({
//       leftPinnedColumList: ["e", "c", "a"],
//     });
//     wrapper.setState({ columnSelectList: ["a", "c"] });
//     wrapper.setState({ columnReorderEntityList: ["a", "b", "c", "d", "e"] });
//     wrapper.instance().addToColumnReorderEntityList("c");
//     expect(wrapper.state("isAllSelected")).toStrictEqual(false);
//     expect(wrapper.state("columnSelectList")).toStrictEqual(["a", "c"]);
//     expect(wrapper.state("leftPinnedColumList")).toStrictEqual(["e", "a"]);
//     expect(wrapper.state("columnReorderEntityList")).toStrictEqual([
//       "a",
//       "b",
//       "d",
//       "e",
//     ]);
//   });
//   test("filterColumnReorderList else part", () => {
//     const wrapper = shallow(<ColumnReordering {...props} />);
//     wrapper.filterColumnReorderList = jest.fn();
//     wrapper.instance().filterColumnReorderList({ target: { value: "" } });
//   });
//   test("reArrangeLeftPinnedColumn else part", () => {
//     const wrapper = shallow(<ColumnReordering {...props} />);
//     wrapper.reArrangeLeftPinnedColumn = jest.fn();
//     expect(wrapper.state("leftPinnedColumList")).toStrictEqual([
//       "FlightNo",
//       "Date",
//     ]);
//     wrapper.instance().reArrangeLeftPinnedColumn("FlightNo");
//   });
//   test("handleReorderList else part", () => {
//     const wrapper = shallow(<ColumnReordering {...props} />);
//     wrapper.handleReorderList = jest.fn();
//     expect(wrapper.state("leftPinnedColumList")).toStrictEqual([
//       "FlightNo",
//       "Date",
//     ]);
//     wrapper.instance().handleReorderList(["a", "b", "c"]);
//   });
//   it("render correctly date component", () => {
//     const DateInputComponent = renderer
//       .create(<ColumnReordering {...props} />)
//       .toJSON();
//     expect(DateInputComponent).toMatchSnapshot();
//   });
// });
