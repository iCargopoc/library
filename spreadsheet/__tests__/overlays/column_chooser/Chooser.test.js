/* eslint-disable no-undef */

import React from "react";
import ReactDOM from "react-dom";
import ReactTestUtils, { act } from "react-dom/test-utils";
import { render, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { DndProvider } from "react-dnd";
import { TouchBackend } from "react-dnd-touch-backend";
import ColumnReordering from "../../../src/overlays/column_chooser/Chooser";
import ColumnsList from "../../../src/overlays/column_chooser/columnsList";

let container;

beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
});

afterEach(() => {
    document.body.removeChild(container);
    container = null;
});

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
let headerKeys = ["FlightNo", "Date", "Segment From"];
let existingPinnedHeadersList = [];
const updateTableAsPerRowChooser = jest.fn();
const handleheaderNameList = jest.fn();

test("addToColumnReorderEntityList change trigger", () => {
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
    fireEvent.click(getAllByTestId("addToColumnReorderEntityList")[0], {
        target: { checked: true }
    });
});
test("selectAllCheckBox change trigger", () => {
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
    fireEvent.click(getByTestId("selectAllCheckBox"), {
        target: { checked: true }
    });
});
test("chooser", () => {
    act(() => {
        ReactDOM.render(
            <ColumnReordering
                columns={columns}
                maxLeftPinnedColumn={maxLeftPinnedColumn}
                updateTableAsPerRowChooser={updateTableAsPerRowChooser}
                headerKeys={headerKeys}
                closeColumnReOrdering={closeColumnReOrdering}
                existingPinnedHeadersList={existingPinnedHeadersList}
                handleheaderNameList={handleheaderNameList}
            />,
            container
        );
    });
    const component = ReactTestUtils.renderIntoDocument(
        <ColumnReordering
            columns={columns}
            maxLeftPinnedColumn={maxLeftPinnedColumn}
            updateTableAsPerRowChooser={updateTableAsPerRowChooser}
            headerKeys={headerKeys}
            closeColumnReOrdering={closeColumnReOrdering}
            existingPinnedHeadersList={existingPinnedHeadersList}
            handleheaderNameList={handleheaderNameList}
        />,
        container
    );
    component.resetColumnReorderList();
    component.resetColumnReorderList();
    component.selectAllToColumnReOrderList();
    component.selectAllToColumnReOrderList();
    component.addToColumnReorderEntityList("Segment From");
    component.filterColumnReorderList({ target: { value: "FlightNo" } });
    component.filterColumnReorderList({ target: { value: "" } });
    component.reArrangeLeftPinnedColumn("Segment From");
    component.handleReorderList([
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
    ]);
});
test("render the chooser", () => {
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
    const element = getByTestId("resetButton");
    expect(element).toHaveTextContent("Reset");
});
it("cancel button click event", () => {
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
    const element = getByTestId("cancelButton");
    expect(element).toHaveTextContent("Cancel");
});
it("save button click event", () => {
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
    const element = getByTestId("saveButton");
    expect(element).toHaveTextContent("Save");
});
it("close column reordering event", () => {
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
    fireEvent.click(getByTestId("closeColumnReordering"));
});
test("testing addToColumnReorderEntityList ", () => {
    existingPinnedHeadersList = ["FlightNo"];
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
    fireEvent.click(getAllByTestId("addToColumnReorderEntityList")[0], {
        target: { checked: true }
    });
    const element = getAllByTestId("addToColumnReorderEntityList")[0];
    expect(element).toBeInTheDocument();
});
test("testing reArrangeLeftPin event trigger ", () => {
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
    fireEvent.click(getAllByTestId("reArrangeLeftPin")[0], {
        target: { checked: true }
    });
    const element = getAllByTestId("reArrangeLeftPin")[0];
    expect(element).toBeInTheDocument();
});
test("testing addToColumnReorderEntityList 1 ", () => {
    headerKeys = ["FlightNo", "Segment From"];
    existingPinnedHeadersList = ["Segment From"];
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
    fireEvent.click(getAllByTestId("addToColumnReorderEntityList")[1], {
        target: { checked: true }
    });
    const element = getAllByTestId("addToColumnReorderEntityList")[1];
    expect(element).toBeInTheDocument();
});
test("testing addToColumnReorderEntityList 2 ", () => {
    headerKeys = ["FlightNo", "Segment From"];
    existingPinnedHeadersList = ["FlightNo"];
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
    fireEvent.click(getAllByTestId("addToColumnReorderEntityList")[1], {
        target: { checked: true }
    });
    const element = getAllByTestId("addToColumnReorderEntityList")[1];
    expect(element).toBeInTheDocument();
});

it("should work drag and drop functionality", () => {
    const columns_ = [
        {
            id: "FlightNo",
            text: (
                <div className="column__reorder" key={1}>
                    <div style={{ cursor: "move" }} className="column_drag" />
                    <div className="column__reorder__name">FlightNo</div>
                    <div className="column__innerCells__wrap">
                        <div className="column__wrap">
                            <div className="column__checkbox">
                                <input
                                    data-testid="reArrangeLeftPin"
                                    role="button"
                                    type="checkbox"
                                    id={`checkBoxToPinLeft_${"FlightNo"}`}
                                    disabled={false}
                                />
                            </div>
                            <div className="column__txt">Pin Left</div>
                        </div>
                    </div>
                </div>
            )
        },
        {
            id: "Date",
            text: (
                <div className="column__reorder" key={2}>
                    <div style={{ cursor: "move" }} className="column_drag" />
                    <div className="column__reorder__name">Date</div>
                    <div className="column__innerCells__wrap">
                        <div className="column__wrap">
                            <div className="column__checkbox">
                                <input
                                    data-testid="reArrangeLeftPin"
                                    role="button"
                                    type="checkbox"
                                    id={`checkBoxToPinLeft_${"Date"}`}
                                    disabled={false}
                                />
                            </div>
                            <div className="column__txt">Pin Left</div>
                        </div>
                    </div>
                </div>
            )
        },
        {
            id: "SegmentFrom",
            text: (
                <div className="column__reorder" key={3}>
                    <div style={{ cursor: "move" }} className="column_drag" />
                    <div className="column__reorder__name">SegmentFrom</div>
                    <div className="column__innerCells__wrap">
                        <div className="column__wrap">
                            <div className="column__checkbox">
                                <input
                                    data-testid="reArrangeLeftPin"
                                    role="button"
                                    type="checkbox"
                                    id={`checkBoxToPinLeft_${"SegmentFrom"}`}
                                    disabled={false}
                                />
                            </div>
                            <div className="column__txt">Pin Left</div>
                        </div>
                    </div>
                </div>
            )
        }
    ];

    const handleReorderList = jest.fn(() => {});
    const createBubbledEvent = (type, props = {}) => {
        const event = new Event(type, { bubbles: true });
        Object.assign(event, props);
        return event;
    };
    const { getAllByTestId } = render(
        <DndProvider
            backend={TouchBackend}
            options={{ enableMouseEvents: true }}
        >
            <ColumnsList
                columnsArray={columns_}
                handleReorderList={handleReorderList}
            />
        </DndProvider>
    );
    expect(getAllByTestId("columnItem")).toHaveLength(3);
    const startingNode = getAllByTestId("columnItem")[0];
    const endingNode = getAllByTestId("columnItem")[1];
    startingNode.dispatchEvent(
        createBubbledEvent("dragstart", { clientX: 0, clientY: 0 })
    );
    endingNode.dispatchEvent(
        createBubbledEvent("drop", { clientX: 0, clientY: 2 })
    );
    fireEvent.dragEnd(startingNode);
});
