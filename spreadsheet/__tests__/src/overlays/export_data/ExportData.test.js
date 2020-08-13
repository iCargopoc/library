import React from "react";
import ReactDOM from "react-dom";
import ReactTestUtils, { act } from "react-dom/test-utils";
import {
    render,
    screen,
    fireEvent,
    getByRole,
    querySelector
} from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import ExportData from "../../../../src/overlays/export_data/ExportData";
import { element } from "prop-types";

let container;

beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
});

afterEach(() => {
    document.body.removeChild(container);
    container = null;
});

const rows = [
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
        filterType: "autoCompleteFilter"
    }
];
const columnsList = [
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
        filterType: "autoCompleteFilter"
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
        filterType: "autoCompleteFilter"
    }
];
const closeExport = jest.fn();

const setup = () => {
    const utils = render(
        <ExportData
            closeExport={closeExport}
            columnsList={columnsList}
            rows={rows}
        />
    );
    const input1 = utils.getByTestId("searchExport");
    const input2 = utils.getByTestId("selectColumns");
    return {
        input1,
        input2,
        ...utils
    };
};
test("onChange Trigger for SearchExport", () => {
    const { input1 } = setup();
    fireEvent.change(input1, { target: { value: "fli" } });
    expect(input1.value).toBe("fli");
});
test("onChange Trigger for selectColumns", () => {
    const { input2, utils } = setup();
    fireEvent.change(input2, { target: { checked: true } });
    expect(input2.checked).toBe(true);
    utils.getAllby
});

test("<ExportData />", () => {
    global.URL.createObjectURL = jest.fn();
    const rows = [
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
            filterType: "autoCompleteFilter"
        }
    ];
    const columnsList = [
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
            filterType: "autoCompleteFilter"
        }
    ];
    const closeExport = jest.fn();
    act(() => {
        ReactDOM.render(
            <ExportData
                closeExport={closeExport}
                columnsList={columnsList}
                rows={rows}
            />,
            container
        );
    });
    act(() => {
        let component = ReactTestUtils.renderIntoDocument(
            <ExportData
                closeExport={closeExport}
                columnsList={columnsList}
                rows={rows}
            />
        );
        component.addToColumnEntityList();
        component.selectDownLoadType({ target: { value: "pdf" } });
        component.selectDownLoadType({ target: { value: "csv" } });
        component.selectDownLoadType({ target: { value: "excel" } });
        component.exportRowData();
        component.downloadPDF(["data"], "data");
        component.downloadCSVFile(["data"]);
        component.downloadXLSFile(["data"]);
        component.columnSearchLogic({ target: { value: "fli" } });
        component.exportValidation();
    });
});

// global.URL.createObjectURL = jest.fn();
// test("selecting download type", () => {
//   const wrapper = shallow(<ExportData />);
//   wrapper.selectDownLoadType = jest.fn();
//   expect(wrapper.state("downLaodFileType")).toStrictEqual([]);
//   wrapper.instance().selectDownLoadType({
//     target: { name: "input", value: "pdf", checked: true },
//   });
//   expect(wrapper.state("downLaodFileType")).toStrictEqual(["pdf"]);
//   wrapper.instance().selectDownLoadType({
//     target: { name: "input", value: "pdf", checked: false },
//   });
//   expect(wrapper.state("downLaodFileType")).toStrictEqual([]);
// });
// test("addToColumnEntityList function", () => {
//   const wrapper = shallow(<ExportData />);
//   wrapper.addToColumnEntityList = jest.fn();
//   wrapper.setState({ columnEntityList: [] });
//   wrapper.setState({ isAllSelected: false });
//   wrapper.instance().addToColumnEntityList("bookingProfile");
//   expect(wrapper.state("columnEntityList")).toStrictEqual(["bookingProfile"]);
//   expect(wrapper.state("isAllSelected")).toStrictEqual(false);
//   wrapper.setState({ columnEntityList: ["bookingProfile"] });
//   wrapper.instance().addToColumnEntityList("bookingProfile");
//   expect(wrapper.state("columnEntityList")).toStrictEqual([]);
//   expect(wrapper.state("isAllSelected")).toStrictEqual(false);
// });
// test("selectAllToColumnList function", () => {
//   const wrapper = shallow(<ExportData />);
//   wrapper.selectAllToColumnList = jest.fn();
//   wrapper.setState({ columnEntityList: [] });
//   wrapper.setState({ isAllSelected: true });
//   expect(wrapper.state("columnEntityList")).toStrictEqual([]);
//   expect(wrapper.state("isAllSelected")).toStrictEqual(true);
//   wrapper.instance().selectAllToColumnList();
//   expect(wrapper.state("columnEntityList")).toStrictEqual(undefined);
//   expect(wrapper.state("isAllSelected")).toStrictEqual(true);
// });
// test("exportRowData as pdf function", () => {
//   // to fix the type error related to createObjectURL
//   global.URL.createObjectURL = jest.fn();
//   const rows = [
//     {
//       key: "flightno",
//       name: "FlightNo",
//       draggable: false,
//       editor: "Text",
//       formulaApplicable: false,
//       sortable: true,
//       resizable: true,
//       filterable: true,
//       width: 150,
//       filterType: "autoCompleteFilter",
//     },
//   ];
//   const wrapper = mount(<ExportData rows={rows} />);
//   wrapper.setState({
//     columnEntityList: [
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
//     ],
//   });
//   wrapper.exportRowData = jest.fn();
//   wrapper.setState({
//     columnEntityList: [
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
//     ],
//   });
//   expect(wrapper.state("columnEntityList")).toStrictEqual([
//     {
//       key: "flightno",
//       name: "FlightNo",
//       draggable: false,
//       editor: "Text",
//       formulaApplicable: false,
//       sortable: true,
//       resizable: true,
//       filterable: true,
//       width: 150,
//       filterType: "autoCompleteFilter",
//     },
//   ]);
//   wrapper.setState({ downLaodFileType: ["pdf"] });
//   expect(wrapper.state("downLaodFileType")).toStrictEqual(["pdf"]);
//   wrapper.instance().exportRowData();
//   expect(wrapper.state("filteredRow")).toStrictEqual([{}]);
// });
// test("exportRowData as csv function", () => {
//   const rows = [
//     {
//       key: "flightno",
//       name: "FlightNo",
//       draggable: false,
//       editor: "Text",
//       formulaApplicable: false,
//       sortable: true,
//       resizable: true,
//       filterable: true,
//       width: 150,
//       filterType: "autoCompleteFilter",
//     },
//   ];
//   const wrapper = shallow(<ExportData rows={rows} />);
//   wrapper.exportRowData = jest.fn();
//   wrapper.setState({
//     columnEntityList: [
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
//     ],
//   });
//   expect(wrapper.state("columnEntityList")).toStrictEqual([
//     {
//       key: "flightno",
//       name: "FlightNo",
//       draggable: false,
//       editor: "Text",
//       formulaApplicable: false,
//       sortable: true,
//       resizable: true,
//       filterable: true,
//       width: 150,
//       filterType: "autoCompleteFilter",
//     },
//   ]);
//   wrapper.setState({ downLaodFileType: ["csv"] });
//   expect(wrapper.state("downLaodFileType")).toStrictEqual(["csv"]);
//   wrapper.instance().exportRowData();
//   expect(wrapper.state("filteredRow")).toStrictEqual([{}]);
// });
// test("exportRowData as excel function", () => {
//   const rows = [
//     {
//       key: "flightno",
//       name: "FlightNo",
//       draggable: false,
//       editor: "Text",
//       formulaApplicable: false,
//       sortable: true,
//       resizable: true,
//       filterable: true,
//       width: 150,
//       filterType: "autoCompleteFilter",
//     },
//   ];
//   const wrapper = shallow(<ExportData rows={rows} />);
//   wrapper.exportRowData = jest.fn();
//   wrapper.setState({
//     columnEntityList: [
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
//     ],
//   });
//   expect(wrapper.state("columnEntityList")).toStrictEqual([
//     {
//       key: "flightno",
//       name: "FlightNo",
//       draggable: false,
//       editor: "Text",
//       formulaApplicable: false,
//       sortable: true,
//       resizable: true,
//       filterable: true,
//       width: 150,
//       filterType: "autoCompleteFilter",
//     },
//   ]);
//   wrapper.setState({ downLaodFileType: ["excel"] });
//   expect(wrapper.state("downLaodFileType")).toStrictEqual(["excel"]);
//   wrapper.instance().exportRowData();
//   expect(wrapper.state("filteredRow")).toStrictEqual([{}]);
// });
// test("columnSearchLogic function", () => {
//   const rows = [
//     {
//       key: "flightno",
//       name: "FlightNo",
//       draggable: false,
//       editor: "Text",
//       formulaApplicable: false,
//       sortable: true,
//       resizable: true,
//       filterable: true,
//       width: 150,
//       filterType: "autoCompleteFilter",
//     },
//     {
//       key: "date",
//       name: "Date",
//       draggable: false,
//       editor: "DatePicker",
//       formulaApplicable: false,
//       sortable: true,
//       resizable: true,
//       filterable: true,
//       width: 150,
//       filterType: "autoCompleteFilter",
//     },
//   ];
//   const wrapper = shallow(<ExportData columnsList={rows} />);
//   wrapper.columnSearchLogic = jest.fn();
//   wrapper.setState({
//     columnEntityList: [
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
//     ],
//   });
//   expect(wrapper.state("columnEntityList")).toStrictEqual([
//     {
//       key: "flightno",
//       name: "FlightNo",
//       draggable: false,
//       editor: "Text",
//       formulaApplicable: false,
//       sortable: true,
//       resizable: true,
//       filterable: true,
//       width: 150,
//       filterType: "autoCompleteFilter",
//     },
//   ]);
//   wrapper.setState({});
//   expect(wrapper.state("")).toStrictEqual();
//   wrapper.instance().columnSearchLogic({
//     target: { className: "custom__ctrl", value: "flightno" },
//   });
//   expect(wrapper.state("filteredRow")).toStrictEqual([]);
//   wrapper.instance().columnSearchLogic({
//     target: { className: "custom__ctrl", value: "book" },
//   });
//   expect(wrapper.state("filteredRow")).toStrictEqual([]);
// });
// test("exportValidation", () => {
//   const rows = [
//     {
//       key: "flightno",
//       name: "FlightNo",
//       draggable: false,
//       editor: "Text",
//       formulaApplicable: false,
//       sortable: true,
//       resizable: true,
//       filterable: true,
//       width: 150,
//       filterType: "autoCompleteFilter",
//     },
//     {
//       key: "date",
//       name: "Date",
//       draggable: false,
//       editor: "DatePicker",
//       formulaApplicable: false,
//       sortable: true,
//       resizable: true,
//       filterable: true,
//       width: 150,
//       filterType: "autoCompleteFilter",
//     },
//   ];
//   const wrapper = shallow(<ExportData rows={rows} />);
//   wrapper.exportValidation = jest.fn();
//   wrapper.setState({ columnEntityList: [1, 2, 3] });
//   wrapper.setState({ downLaodFileType: [1, 2, 3] });
//   wrapper.instance().exportValidation();
//   expect(wrapper.state("clickTag")).toStrictEqual("none");
//   wrapper.setState({ columnEntityList: [] });
//   wrapper.setState({ downLaodFileType: [1, 2, 3] });
//   wrapper.instance().exportValidation();
//   expect(wrapper.state("clickTag")).toStrictEqual("");
//   expect(wrapper.state("warning")).toStrictEqual("Column");
//   wrapper.setState({ columnEntityList: [1, 2, 3] });
//   wrapper.setState({ downLaodFileType: [] });
//   wrapper.instance().exportValidation();
//   expect(wrapper.state("clickTag")).toStrictEqual("");
//   expect(wrapper.state("warning")).toStrictEqual("File Type");
//   wrapper.setState({ columnEntityList: [] });
//   wrapper.setState({ downLaodFileType: [] });
//   wrapper.instance().exportValidation();
//   expect(wrapper.state("clickTag")).toStrictEqual("");
//   expect(wrapper.state("warning")).toStrictEqual("File Type & Column");
// });
// it("close icon click event", () => {
//   const mockCallBack = jest.fn();
//   const component = mount(
//     <FontAwesomeIcon
//       icon={faTimes}
//       className="icon-close"
//       onClick={mockCallBack}
//     />
//   );
//   component.find({ className: "icon-close" }).simulate("click");
//   expect(mockCallBack).toHaveBeenCalled();
//   component.unmount();
// });
// it("simulates pdf checkbox change event", () => {
//   const mockCallBack = jest.fn();
//   const component = shallow(
//     <input name="pdf" onChange={mockCallBack}></input>
//   );
//   component.find({ name: "pdf" }).simulate("change");
//   expect(mockCallBack).toHaveBeenCalled();
// });
// it("simulates all columncheckBox change event", () => {
//   const mockCallBack = jest.fn();
//   const component = shallow(
//     <input type="checkbox" onChange={mockCallBack} checked={true} />
//   );
//   component.find({ type: "checkbox" }).simulate("change");
//   expect(component).toMatchSnapshot();
// });
// it("simulates excel checkbox change event", () => {
//   const mockCallBack = jest.fn();
//   const component = shallow(
//     <input name="excel" onChange={mockCallBack}></input>
//   );
//   component.find({ name: "excel" }).simulate("change");
//   expect(component).toMatchSnapshot();
// });
// it("simulates csv checkbox change event", () => {
//   const mockCallBack = jest.fn();
//   const component = shallow(
//     <input name="csv" onChange={mockCallBack}></input>
//   );
//   component.find({ name: "csv" }).simulate("change");
//   expect(component).toMatchSnapshot();
// });
// it("simulates search export input field", () => {
//   const mockCallBack = jest.fn();
//   const component = shallow(
//     <input
//       type="text"
//       placeholder="Search export"
//       className="custom__ctrl"
//       onChange={mockCallBack}
//     ></input>
//   );
//   component.find({ className: "custom__ctrl" }).simulate("change");
//   expect(component).toMatchSnapshot();
// });
// it("simulates close of export click event", () => {
//   const mockCallBack = jest.fn();
//   const component = shallow(
//     <button className="btns" onClick={mockCallBack}>
//       Cancel
//     </button>
//   );
//   component.find({ className: "btns" }).simulate("click");
//   expect(component).toMatchSnapshot();
// });
// it("render correctly component", () => {
//   const Component = renderer
//     .create(<div className="export__settings" />)
//     .toJSON();
//   expect(Component).toMatchSnapshot();
// });
// it("Should not call action on/off click inside the ExportData", () => {
//   const map = {};
//   const mockCallBack = jest.fn();
//   document.addEventListener = jest.fn((event, cb) => {
//     map[event] = cb;
//   });
//   const props = {
//     closeExport: jest.fn(),
//   };
//   const wrapper = mount(<ExportData {...props} />);
//   const component = mount(
//     <input name="excel" onChange={mockCallBack}></input>
//   );
//   map.mousedown({
//     target: ReactDOM.findDOMNode(wrapper.instance()),
//   });
//   expect(props.closeExport).not.toHaveBeenCalled();
//   map.mousedown({
//     target: ReactDOM.findDOMNode(component.instance()),
//   });
//   expect(props.closeExport).toHaveBeenCalled();
//   wrapper.unmount();
// });
// it("render div component", () => {
//   const wrapper = mount(<ExportData />);
//   expect(wrapper.find("div").length).toEqual(28);
//   wrapper.unmount();
// });
// it("rendering input", () => {
//   const wrapper = mount(<ExportData />);
//   expect(wrapper.find("input").length).toEqual(5);
//   wrapper.unmount();
// });
// it("rendering input", () => {
//   const wrapper = mount(<ExportData />);
//   expect(wrapper.find("input").length).toEqual(5);
//   wrapper.unmount();
// });
// it("simulates all column select", () => {
//   const checkbox = shallow(<ExportData />);
//   checkbox.find({ className: "selectColumn" }).simulate("change");
//   expect(checkbox.text()).toEqual(
//     "Export DataSelect All<FontAwesomeIcon />Export as<FontAwesomeIcon /><FontAwesomeIcon /><FontAwesomeIcon />You have not selected CancelExport"
//   );
// });
