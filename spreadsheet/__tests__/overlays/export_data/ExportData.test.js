/* eslint-disable no-unused-expressions */
/* eslint-disable no-undef */

import React from "react";
import ReactDOM from "react-dom";
import ReactTestUtils, { act } from "react-dom/test-utils";
import { render, fireEvent, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import ExportData from "../../../src/overlays/export_data/ExportData";

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
        travelId: 0,
        flightno: "XX6576",
        date: "2015-05-01",
        segmentfrom: "ABC"
    },
    {
        travelId: 1,
        flightno: "XX5177",
        date: "2018-02-09",
        segmentfrom: "CCC"
    },
    {
        travelId: 2,
        flightno: "XX7883",
        date: "2017-12-14",
        segmentfrom: "BCB"
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
        filterType: "autoCompleteFilter",
        dataSource: []
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
        dataSource: []
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
        dataSource: []
    },
    {
        key: "revenue",
        name: "Revenue",
        draggable: false,
        editor: "Text",
        formulaApplicable: true,
        sortable: true,
        resizable: true,
        filterable: true,
        width: 150,
        filterType: "autoCompleteFilter",
        dataSource: []
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
test("exportValidationClick", () => {
    // afterEach(cleanup)
    const { getByTestId } = render(
        <ExportData
            closeExport={closeExport}
            columnsList={columnsList}
            rows={rows}
        />
    );
    fireEvent.click(getByTestId("exportValidationClick"));
    const element = getByTestId("exportValidationClick");
    expect(element).toHaveTextContent("Export");
});
test("add to column change trigger", () => {
    // afterEach(cleanup)
    const { getAllByTestId } = render(
        <ExportData
            closeExport={closeExport}
            columnsList={columnsList}
            rows={rows}
        />
    );
    fireEvent.click(getAllByTestId("addToColumn")[0], {
        target: { checked: true }
    });
    const element = getAllByTestId("addToColumn");
    expect(element).not.tobeNull;
});
test("selectColumn onChange trigger", () => {
    const { getByTestId } = render(
        <ExportData
            closeExport={closeExport}
            columnsList={columnsList}
            rows={rows}
        />
    );
    fireEvent.click(getByTestId("selectColumns"), {
        target: { checked: true }
    });
    const element = getByTestId("selectColumns");
    expect(element).not.tobeNull;
});
test("close export click trigger", () => {
    const { getByTestId } = render(
        <ExportData
            closeExport={closeExport}
            columnsList={columnsList}
            rows={rows}
        />
    );
    fireEvent.click(getByTestId("closeExport"));
    const element = getByTestId("closeExport");
    expect(element).toHaveTextContent("Cancel");
});
test("onChange Trigger for SearchExport", () => {
    const { input1 } = setup();
    fireEvent.change(input1, { target: { value: "fli" } });
    expect(input1.value).toBe("fli");
});
test("onChange Trigger for selectColumns", () => {
    const { input2 } = setup();
    fireEvent.change(input2, { target: { checked: true } });
    expect(input2.checked).toBe(true);
});

test("<ExportData 1 />", () => {
    global.URL.createObjectURL = jest.fn();

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
});
test("<ExportData 2/>", () => {
    act(() => {
        const component = ReactTestUtils.renderIntoDocument(
            <ExportData
                closeExport={closeExport}
                columnsList={columnsList}
                rows={rows}
            />
        );
        expect(
            component.addToColumnEntityList({
                key: "yeild",
                name: "Yeild",
                draggable: false,
                editor: "Text",
                formulaApplicable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                width: 150,
                filterType: "autoCompleteFilter",
                dataSource: []
            })
        ).not.tobeNull;
        expect(
            component.addToColumnEntityList({
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
                dataSource: []
            })
        ).not.tobeNull;

        expect(
            component.selectDownLoadType({
                target: { checked: true, value: "pdf" }
            })
        ).not.tobeNull;
        expect(
            component.selectDownLoadType({
                target: { checked: false, value: "pdf" }
            })
        ).not.tobeNull;
        expect(
            component.selectDownLoadType({
                target: { checked: true, value: "csv" }
            })
        ).not.tobeNull;
        expect(
            component.selectDownLoadType({
                target: { checked: true, value: "excel" }
            })
        ).not.tobeNull;
        expect(component.exportRowData()).not.tobeNull;
        expect(
            component.downloadPDF(
                [
                    {
                        travelId: 0,
                        flightno: "XX6576",
                        date: "2015-05-01",
                        segmentfrom: "ABC"
                    },
                    {
                        travelId: 1,
                        flightno: "XX5177",
                        date: "2018-02-09",
                        segmentfrom: "CCC"
                    },
                    {
                        travelId: 2,
                        flightno: "XX7883",
                        date: "2017-12-14",
                        segmentfrom: "BCB"
                    }
                ],
                ["FlightNo", "Date", "Revenue"]
            )
        ).not.tobeNull;
        expect(
            component.downloadCSVFile([
                {
                    travelId: 0,
                    flightno: "XX6576",
                    date: "2015-05-01",
                    segmentfrom: "ABC"
                },
                {
                    travelId: 1,
                    flightno: "XX5177",
                    date: "2018-02-09",
                    segmentfrom: "CCC"
                },
                {
                    travelId: 2,
                    flightno: "XX7883",
                    date: "2017-12-14",
                    segmentfrom: "BCB"
                }
            ])
        ).not.tobeNull;
        expect(
            component.downloadXLSFile([
                {
                    travelId: 0,
                    flightno: "XX6576",
                    date: "2015-05-01",
                    segmentfrom: "ABC"
                },
                {
                    travelId: 1,
                    flightno: "XX5177",
                    date: "2018-02-09",
                    segmentfrom: "CCC"
                },
                {
                    travelId: 2,
                    flightno: "XX7883",
                    date: "2017-12-14",
                    segmentfrom: "BCB"
                }
            ])
        ).not.tobeNull;
        expect(component.exportValidation()).not.tobeNull;
        expect(component.selectAllToColumnList()).not.tobeNull;
    });
});

it("add to column list change event", () => {
    afterEach(cleanup);
    const { getAllByTestId } = render(
        <ExportData
            closeExport={closeExport}
            columnsList={columnsList}
            rows={rows}
        />
    );
    fireEvent.change(getAllByTestId("addToColumn")[2], {
        target: {
            value: {
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
                dataSource: []
            }
        }
    });
});
test("testing exportDatat by triggering events", () => {
    const { getByTestId } = render(
        <ExportData
            closeExport={closeExport}
            columnsList={columnsList}
            rows={rows}
        />
    );
    fireEvent.click(getByTestId("addpdfDownloadType"), {
        target: { checked: true, value: "pdf" }
    });
    fireEvent.click(getByTestId("exportValidationClick"));
});
test("testing exportValidation", () => {
    const { getByTestId } = render(
        <ExportData closeExport={closeExport} columnsList={[]} rows={rows} />
    );
    fireEvent.click(getByTestId("addpdfDownloadType"), {
        target: { checked: true, value: "pdf" }
    });
    fireEvent.click(getByTestId("exportValidationClick"));
});
test("testing exportValidation 1", () => {
    const { getByTestId } = render(
        <ExportData closeExport={closeExport} columnsList={[]} rows={rows} />
    );
    fireEvent.click(getByTestId("exportValidationClick"));
});
