import React from "react";
import ReactDOM from "react-dom";
import ColumnReordering from "../../../../src/overlays/column_chooser/Chooser";
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
                filterType: "autoCompleteFilter"
            }
        ],
        headerKeys: ["FlightNo", "Date", "Segment From"],
        existingPinnedHeadersList: ["FlightNo", "Date", "Segment From"],
        maxLeftPinnedColumn: 5,
        updateTableAsPerRowChooser: jest.fn(),
        handleheaderNameList: jest.fn()
    };
    act(() => {
        ReactDOM.render(<ColumnReordering {...props} />, container);
    });
    let component = ReactDOM.render(<ColumnReordering {...props} />, container);
    component.resetColumnReorderList();
    component.componentWillUnmount();
    component.resetColumnReorderList();
    component.selectAllToColumnReOrderList();
    component.addToColumnReorderEntityList("Segment From");
    component.filterColumnReorderList({ target: { value: "FlightNo" } });
    component.filterColumnReorderList({ target: { value: "" } });
    component.reArrangeLeftPinnedColumn("Segment From");
    component.setWrapperRef("columns--grid");
    component.handleClickOutside({
        target: "parentDiv"
    });
});
test("render the chooser", () => {
    const columns = [
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
            filterType: "autoCompleteFilter"
        }
    ];
    const maxLeftPinnedColumn = 5;
    const closeColumnReOrdering = jest.fn();
    const headerKeys = ["FlightNo", "Date", "Segment From"];
    const existingPinnedHeadersList = ["FlightNo", "Date", "Segment From"];
    const updateTableAsPerRowChooser = jest.fn();
    const handleheaderNameList = jest.fn();
    const { asFragment } = render(
        <ColumnReordering
            columns={columns}
            maxLeftPinnedColumn={maxLeftPinnedColumn}
            updateTableAsPerRowChooser={updateTableAsPerRowChooser}
            headerKeys={headerKeys}
            closeColumnReOrdering={closeColumnReOrdering}
            existingPinnedHeadersList={existingPinnedHeadersList}
            handleheaderNameList={handleheaderNameList}
        />
    );
    expect(
        asFragment(
            <ColumnReordering
                columns={columns}
                maxLeftPinnedColumn={maxLeftPinnedColumn}
                updateTableAsPerRowChooser={updateTableAsPerRowChooser}
                headerKeys={headerKeys}
                closeColumnReOrdering={closeColumnReOrdering}
                existingPinnedHeadersList={existingPinnedHeadersList}
                handleheaderNameList={handleheaderNameList}
            />
        )
    ).toMatchSnapshot();
});
it("reset button click event", () => {
    const columns = [
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
            filterType: "autoCompleteFilter"
        }
    ];
    const maxLeftPinnedColumn = 5;
    const closeColumnReOrdering = jest.fn();
    const headerKeys = ["FlightNo", "Date", "Segment From"];
    const existingPinnedHeadersList = ["FlightNo", "Date", "Segment From"];
    const updateTableAsPerRowChooser = jest.fn();
    const handleheaderNameList = jest.fn();
    const { getByTestId } = render(
        <ColumnReordering
            columns={columns}
            maxLeftPinnedColumn={maxLeftPinnedColumn}
            updateTableAsPerRowChooser={updateTableAsPerRowChooser}
            headerKeys={headerKeys}
            closeColumnReOrdering={closeColumnReOrdering}
            existingPinnedHeadersList={existingPinnedHeadersList}
            handleheaderNameList={handleheaderNameList}
        />
    );
    fireEvent.click(getByTestId("resetButton"));
});
it("cancel button click event", () => {
    const columns = [
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
            filterType: "autoCompleteFilter"
        }
    ];
    const maxLeftPinnedColumn = 5;
    const closeColumnReOrdering = jest.fn();
    const headerKeys = ["FlightNo", "Date", "Segment From"];
    const existingPinnedHeadersList = ["FlightNo", "Date", "Segment From"];
    const updateTableAsPerRowChooser = jest.fn();
    const handleheaderNameList = jest.fn();
    const { getByTestId } = render(
        <ColumnReordering
            columns={columns}
            maxLeftPinnedColumn={maxLeftPinnedColumn}
            updateTableAsPerRowChooser={updateTableAsPerRowChooser}
            headerKeys={headerKeys}
            closeColumnReOrdering={closeColumnReOrdering}
            existingPinnedHeadersList={existingPinnedHeadersList}
            handleheaderNameList={handleheaderNameList}
        />
    );
    fireEvent.click(getByTestId("cancelButton"));
});
it("save button click event", () => {
    const columns = [
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
            filterType: "autoCompleteFilter"
        }
    ];
    const maxLeftPinnedColumn = 5;
    const closeColumnReOrdering = jest.fn();
    const headerKeys = ["FlightNo", "Date", "Segment From"];
    const existingPinnedHeadersList = ["FlightNo", "Date", "Segment From"];
    const updateTableAsPerRowChooser = jest.fn();
    const handleheaderNameList = jest.fn();
    const { getByTestId } = render(
        <ColumnReordering
            columns={columns}
            maxLeftPinnedColumn={maxLeftPinnedColumn}
            updateTableAsPerRowChooser={updateTableAsPerRowChooser}
            headerKeys={headerKeys}
            closeColumnReOrdering={closeColumnReOrdering}
            existingPinnedHeadersList={existingPinnedHeadersList}
            handleheaderNameList={handleheaderNameList}
        />
    );
    fireEvent.click(getByTestId("saveButton"));
});
it("checkBox change event", () => {
    const columns = [
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
            filterType: "autoCompleteFilter"
        }
    ];
    const maxLeftPinnedColumn = 5;
    const closeColumnReOrdering = jest.fn();
    const headerKeys = ["FlightNo", "Date", "Segment From"];
    const existingPinnedHeadersList = ["FlightNo", "Date", "Segment From"];
    const updateTableAsPerRowChooser = jest.fn();
    const handleheaderNameList = jest.fn();
    const { getAllByTestId } = render(
        <ColumnReordering
            columns={columns}
            maxLeftPinnedColumn={maxLeftPinnedColumn}
            updateTableAsPerRowChooser={updateTableAsPerRowChooser}
            headerKeys={headerKeys}
            closeColumnReOrdering={closeColumnReOrdering}
            existingPinnedHeadersList={existingPinnedHeadersList}
            handleheaderNameList={handleheaderNameList}
        />
    );
    expect(getAllByTestId("checkBox")).toHaveLength(3);
    fireEvent.change(getAllByTestId("checkBox")[0], {
        target: { checked: true }
    });
    fireEvent.change(getAllByTestId("checkBox")[0], {
        target: { checked: false }
    });
});
it("select All Columns checkBox change event", () => {
    const columns = [
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
            filterType: "autoCompleteFilter"
        }
    ];
    const maxLeftPinnedColumn = 5;
    const closeColumnReOrdering = jest.fn();
    const headerKeys = ["FlightNo", "Date", "Segment From"];
    const existingPinnedHeadersList = ["FlightNo", "Date", "Segment From"];
    const updateTableAsPerRowChooser = jest.fn();
    const handleheaderNameList = jest.fn();
    const { getAllByTestId } = render(
        <ColumnReordering
            columns={columns}
            maxLeftPinnedColumn={maxLeftPinnedColumn}
            updateTableAsPerRowChooser={updateTableAsPerRowChooser}
            headerKeys={headerKeys}
            closeColumnReOrdering={closeColumnReOrdering}
            existingPinnedHeadersList={existingPinnedHeadersList}
            handleheaderNameList={handleheaderNameList}
        />
    );
    expect(getAllByTestId("selectAllColumns")).toHaveLength(1);
    fireEvent.change(getAllByTestId("selectAllColumns")[0], {
        target: { checked: true }
    });
    fireEvent.change(getAllByTestId("selectAllColumns")[0], {
        target: { checked: false }
    });
});
