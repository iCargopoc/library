/* eslint-disable no-undef */

import React from "react";
import ReactDOM from "react-dom";
import ReactTestUtils, { act } from "react-dom/test-utils";
import ExtDataGrid from "../../src/common/extDataGrid";
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

it("Render mount the component and unmount the ExtDataGrid", () => {
    const mockgetValidFilters = jest.fn();
    const mockGridRowUpdate = jest.fn();
    const mockClearFilters = jest.fn();
    const mockColumnResize = jest.fn();
    const mockAddFilter = jest.fn();
    const mockRowSelected = jest.fn();
    const mockRowDeselected = jest.fn();
    const mockGridSort = jest.fn();
    const mockGlobalSearchLogic = jest.fn();
    const mockRowGetter = jest.fn();
    const mockSetSelection = jest.fn();
    act(() => {
        ReactDOM.render(
            <ExtDataGrid
                toolbar={<div />}
                getValidFilterValues={mockgetValidFilters}
                minHeight={10}
                columns={["name", "place", "origin"]}
                rowGetter={mockRowGetter}
                rowsCount={10}
                onGridRowsUpdated={mockGridRowUpdate}
                enableCellSelect
                onClearFilters={mockClearFilters}
                onColumnResize={mockColumnResize}
                onAddFilter={mockAddFilter}
                rowSelection={{
                    showCheckbox: true,
                    enableShiftSelect: true,
                    onRowsSelected: mockRowSelected,
                    onRowsDeselected: mockRowDeselected,
                    selectBy: {
                        indexes: 1
                    }
                }}
                onGridSort={mockGridSort}
                globalSearch={mockGlobalSearchLogic}
                handleWarningStatus=""
                closeWarningStatus=""
                enableRowSelect={null}
            />,
            container
        );
    });
    const component = ReactTestUtils.renderIntoDocument(
        <ExtDataGrid
            toolbar={<div />}
            getValidFilterValues={mockgetValidFilters}
            minHeight={10}
            columns={["name", "place", "origin"]}
            rowGetter={mockRowGetter}
            rowsCount={10}
            onGridRowsUpdated={mockGridRowUpdate}
            enableCellSelect
            onClearFilters={mockClearFilters}
            onColumnResize={mockColumnResize}
            onAddFilter={mockAddFilter}
            rowSelection={{
                showCheckbox: true,
                enableShiftSelect: true,
                onRowsSelected: mockRowSelected,
                onRowsDeselected: mockRowDeselected,
                selectBy: {
                    indexes: 1
                }
            }}
            onGridSort={mockGridSort}
            globalSearch={mockGlobalSearchLogic}
            handleWarningStatus=""
            closeWarningStatus=""
            enableRowSelect={null}
            cellRangeSelection={{
                onComplete: mockSetSelection
            }}
        />
    );
    component.componentDidMount();
    component.componentWillUnmount();
});
