/* eslint-disable no-undef */

import React from "react";
import ReactDOM from "react-dom";
import ReactTestUtils, { act } from "react-dom/test-utils";
import { render, fireEvent } from "@testing-library/react";
import Sorting from "../../../src/overlays/sorting/Sorting";
import "@testing-library/jest-dom/extend-expect";

let container;

beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
});

afterEach(() => {
    document.body.removeChild(container);
    container = null;
});

const closeSorting = jest.fn();
let sortingParamsObjectList = [];
const columnFieldValue = [
    "FlightNo",
    "Date",
    "Segment From",
    "Revenue",
    "Yeild",
    "Segment To",
    "Flight Model",
    "Body Type",
    "Type",
    "Start Time",
    "End Time"
];
const clearAllSortingParams = jest.fn();
const setTableAsPerSortingParams = jest.fn(() => {});
const handleTableSortSwap = jest.fn(() => {});

test("<Sorting />", () => {
    sortingParamsObjectList = [
        {
            order: "Ascending",
            sortBy: "FlightNo",
            sortOn: "Value"
        }
    ];
    act(() => {
        ReactDOM.render(
            <Sorting
                closeSorting={closeSorting}
                sortingParamsObjectList={sortingParamsObjectList}
                columnFieldValue={columnFieldValue}
                clearAllSortingParams={clearAllSortingParams}
                setTableAsPerSortingParams={setTableAsPerSortingParams}
                handleTableSortSwap={handleTableSortSwap}
            />,
            container
        );
    });
    let component = ReactTestUtils.renderIntoDocument(
        <Sorting
            closeSorting={closeSorting}
            sortingParamsObjectList={sortingParamsObjectList}
            columnFieldValue={columnFieldValue}
            clearAllSortingParams={clearAllSortingParams}
            setTableAsPerSortingParams={setTableAsPerSortingParams}
            handleTableSortSwap={handleTableSortSwap}
        />
    );

    component.add();
    component.copy(0);
    component.captureSortingFeildValues(
        { target: { value: "Ascending" } },
        0,
        "sortBy"
    );
    component.captureSortingFeildValues(
        { target: { value: "Descending" } },
        0,
        "order"
    );
    component.captureSortingFeildValues(
        { target: { value: "Descending" } },
        0,
        "order"
    );
    component.updateTableAsPerSortCondition();
    component.handleReorderListOfSort([
        "FlightNo",
        "Date",
        "Segment From",
        "Revenue",
        "Yeild"
    ]);
    sortingParamsObjectList = [];
    component = ReactTestUtils.renderIntoDocument(
        <Sorting
            closeSorting={closeSorting}
            sortingParamsObjectList={sortingParamsObjectList}
            columnFieldValue={columnFieldValue}
            clearAllSortingParams={clearAllSortingParams}
            setTableAsPerSortingParams={setTableAsPerSortingParams}
            handleTableSortSwap={handleTableSortSwap}
        />
    );
    component.remove(0);
    component.clearAll();
    sortingParamsObjectList = [
        {
            order: "Ascending",
            sortBy: "FlightNo",
            sortOn: ""
        }
    ];
    component = ReactTestUtils.renderIntoDocument(
        <Sorting
            closeSorting={closeSorting}
            sortingParamsObjectList={sortingParamsObjectList}
            columnFieldValue={columnFieldValue}
            clearAllSortingParams={clearAllSortingParams}
            setTableAsPerSortingParams={setTableAsPerSortingParams}
            handleTableSortSwap={handleTableSortSwap}
        />
    );
    component.captureSortingFeildValues(
        { target: { value: "Descending" } },
        0,
        "sortBy"
    );
});
it("close sorting event trigger", () => {
    sortingParamsObjectList = [
        {
            order: "Ascending",
            sortBy: "FlightNo",
            sortOn: "Value"
        }
    ];
    const { getByTestId } = render(
        <Sorting
            closeSorting={closeSorting}
            sortingParamsObjectList={sortingParamsObjectList}
            columnFieldValue={columnFieldValue}
            clearAllSortingParams={clearAllSortingParams}
            setTableAsPerSortingParams={setTableAsPerSortingParams}
            handleTableSortSwap={handleTableSortSwap}
        />
    );
    fireEvent.click(getByTestId("closeSorting"));
});

it("selecting order dropDown", () => {
    const component = ReactTestUtils.renderIntoDocument(
        <Sorting
            closeSorting={closeSorting}
            sortingParamsObjectList={sortingParamsObjectList}
            columnFieldValue={columnFieldValue}
            clearAllSortingParams={clearAllSortingParams}
            setTableAsPerSortingParams={setTableAsPerSortingParams}
            handleTableSortSwap={handleTableSortSwap}
        />
    );
    component.createColumnsArrayFromProps([
        {
            order: "Ascending",
            sortBy: "FlightNo",
            sortOn: "Value"
        }
    ]);
});
it("ApplySort event trigger", () => {
    const { getByTestId } = render(
        <Sorting
            closeSorting={closeSorting}
            sortingParamsObjectList={sortingParamsObjectList}
            columnFieldValue={columnFieldValue}
            clearAllSortingParams={clearAllSortingParams}
            setTableAsPerSortingParams={setTableAsPerSortingParams}
            handleTableSortSwap={handleTableSortSwap}
        />
    );
    fireEvent.click(getByTestId("applySort"));
    const element = getByTestId("applySort");
    expect(element).toHaveTextContent("Ok");
});
it("Add Sorting event trigger", () => {
    const { getByTestId } = render(
        <Sorting
            closeSorting={closeSorting}
            sortingParamsObjectList={sortingParamsObjectList}
            columnFieldValue={columnFieldValue}
            clearAllSortingParams={clearAllSortingParams}
            setTableAsPerSortingParams={setTableAsPerSortingParams}
            handleTableSortSwap={handleTableSortSwap}
        />
    );
    fireEvent.click(getByTestId("addSort"));
    fireEvent.keyDown(getByTestId("addSort"), { key: "Enter", code: "Enter" });
});
it("selecting Value from dropDown", () => {
    const { getAllByTestId } = render(
        <Sorting
            closeSorting={closeSorting}
            sortingParamsObjectList={sortingParamsObjectList}
            columnFieldValue={columnFieldValue}
            clearAllSortingParams={clearAllSortingParams}
            setTableAsPerSortingParams={setTableAsPerSortingParams}
            handleTableSortSwap={handleTableSortSwap}
        />
    );
    fireEvent.change(getAllByTestId("selectingValue")[0], {
        target: { value: "FlightNo" }
    });
    const element = getAllByTestId("selectingValue")[0];
    expect(element).toHaveTextContent("Value");
});
it("testing capturing of sorting field values", () => {
    const { getAllByTestId } = render(
        <Sorting
            closeSorting={closeSorting}
            sortingParamsObjectList={sortingParamsObjectList}
            columnFieldValue={columnFieldValue}
            clearAllSortingParams={clearAllSortingParams}
            setTableAsPerSortingParams={setTableAsPerSortingParams}
            handleTableSortSwap={handleTableSortSwap}
        />
    );
    fireEvent.change(
        getAllByTestId("selectSortingField")[0],
        { target: { value: "FlightNo" } },
        0,
        "sortBy"
    );
});
it("testing selecting the order of the sort", () => {
    const { getAllByTestId } = render(
        <Sorting
            closeSorting={closeSorting}
            sortingParamsObjectList={sortingParamsObjectList}
            columnFieldValue={columnFieldValue}
            clearAllSortingParams={clearAllSortingParams}
            setTableAsPerSortingParams={setTableAsPerSortingParams}
            handleTableSortSwap={handleTableSortSwap}
        />
    );
    fireEvent.change(
        getAllByTestId("selectOrder")[0],
        { target: { value: "FlightNo" } },
        0,
        "order"
    );
});
it("testing copying of the sort", () => {
    const { getAllByTestId } = render(
        <Sorting
            closeSorting={closeSorting}
            sortingParamsObjectList={sortingParamsObjectList}
            columnFieldValue={columnFieldValue}
            clearAllSortingParams={clearAllSortingParams}
            setTableAsPerSortingParams={setTableAsPerSortingParams}
            handleTableSortSwap={handleTableSortSwap}
        />
    );
    fireEvent.click(getAllByTestId("copySort")[0]);
});
it("testing removal of sort", () => {
    const { getAllByTestId } = render(
        <Sorting
            closeSorting={closeSorting}
            sortingParamsObjectList={sortingParamsObjectList}
            columnFieldValue={columnFieldValue}
            clearAllSortingParams={clearAllSortingParams}
            setTableAsPerSortingParams={setTableAsPerSortingParams}
            handleTableSortSwap={handleTableSortSwap}
        />
    );
    fireEvent.click(getAllByTestId("removeSort")[0]);
});
