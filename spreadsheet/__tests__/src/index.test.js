import React from "react";
import Spreadsheet from "../../src/index";
import { unmountComponentAtNode } from "react-dom";
import { render, cleanup } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import ReactTestUtils from "react-dom/test-utils";
import "idempotent-babel-polyfill";
const data = [
    {
        travelId: 0,
        flightno: "XX6576",
        date: "2015-05-01",
        segmentfrom: "ABC",
        segmentto: "ZYY",
        flightModel: 115,
        bodyType: "Small Body",
        type: "Car",
        startTime: "03:34 (A)",
        endTime: "03:05 (S)",
        status: "To Be Cancelled",
        additionalStatus: "",
        timeStatus: "04:58|hrs to depart",
        weightpercentage: "65%",
        weightvalue: "52098/20000 kg",
        volumepercentage: "32%",
        volumevalue: "33/60 cbm",
        uldposition1: "L4",
        uldvalue1: "6/1",
        uldposition2: "Q4",
        uldvalue2: "2/7",
        uldposition3: "L8",
        uldvalue3: "7/5",
        uldposition4: "Q8",
        uldvalue4: "3/2",
        revenue: "$60,485.33",
        yeild: "$6.28",
        sr: "52/ AWBs",
        queuedBookingSR: "23/ AWBs",
        queuedBookingvolume: "8023 kg / 35 cbm"
    },
    {
        travelId: 1,
        flightno: "XX5177",
        date: "2018-02-09",
        segmentfrom: "CCC",
        segmentto: "YXZ",
        flightModel: 197,
        bodyType: "Small Body",
        type: "Van",
        startTime: "01:23 (E)",
        endTime: "12:31 (E)",
        status: "Cancelled",
        additionalStatus: "Arrived",
        timeStatus: "12:57|hrs to depart",
        weightpercentage: "37%",
        weightvalue: "49689/20000 kg",
        volumepercentage: "47%",
        volumevalue: "49/60 cbm",
        uldposition1: "L3",
        uldvalue1: "1/1",
        uldposition2: "Q2",
        uldvalue2: "3/4",
        uldposition3: "L6",
        uldvalue3: "8/1",
        uldposition4: "Q6",
        uldvalue4: "4/2",
        revenue: "$62,830.60",
        yeild: "$8.39",
        sr: "34/ AWBs",
        queuedBookingSR: "75/ AWBs",
        queuedBookingvolume: "8893 kg / 43 cbm"
    }
];

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
        filterType: "autoCompleteFilter"
    },
    {
        key: "yeild",
        name: "Yeild",
        draggable: false,
        editor: "Text",
        formulaApplicable: true,
        sortable: true,
        resizable: true,
        filterable: true,
        width: 150,
        filterType: "autoCompleteFilter"
    },
    {
        key: "segmentto",
        name: "Segment To",
        draggable: false,
        editor: "DropDown",
        formulaApplicable: false,
        sortable: true,
        resizable: true,
        filterable: true,
        width: 150,
        filterType: "autoCompleteFilter"
    },
    {
        key: "flightModel",
        name: "Flight Model",
        draggable: false,
        formulaApplicable: false,
        sortable: true,
        resizable: true,
        filterable: true,
        width: 150,
        filterType: "numeric"
    },
    {
        key: "bodyType",
        name: "Body Type",
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
        key: "type",
        name: "Type",
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
        key: "startTime",
        name: "Start Time",
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
        key: "endTime",
        name: "End Time",
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
        key: "status",
        name: "Status",
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
        key: "additionalStatus",
        name: "Additional Status",
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
        key: "timeStatus",
        name: "Time Status",
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
        key: "weightpercentage",
        name: "Weight Percentage",
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
        key: "weightvalue",
        name: "Weight Value",
        draggable: false,
        editor: "Text",
        formulaApplicable: true,
        sortable: true,
        resizable: true,
        filterable: true,
        width: 150,
        filterType: "autoCompleteFilter"
    },
    {
        key: "volumepercentage",
        name: "Volume Percentage",
        draggable: false,
        editor: "Text",
        formulaApplicable: true,
        sortable: true,
        resizable: true,
        filterable: true,
        width: 150,
        filterType: "autoCompleteFilter"
    },
    {
        key: "volumevalue",
        name: "Volume Value",
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
        key: "uldposition1",
        name: "uldposition1",
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
        key: "uldvalue1",
        name: "uldvalue1",
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
        key: "uldposition2",
        name: "uldposition2",
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
        key: "uldvalue2",
        name: "uldvalue2",
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
        key: "uldposition3",
        name: "uldposition3",
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

const gridHeight = "90vh";
const pageSize = 10;

let container = null;
// beforeEach(() => {
//   cleanup();
//     // setup a DOM element as a render target
//     container = document.createElement("div");
//     // container *must* be attached to document so events work correctly.
//     document.body.appendChild(container);
// });

// afterEach(() => {
//     // cleanup on exiting
//     unmountComponentAtNode(container);
//     container.remove();
//     container = null;
// });

beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
});

afterEach(() => {
    document.body.removeChild(container);
    container = null;
});

// HTMLCanvasElement.prototype.getContext = () => {
//     // return whatever getContext has to return
// };
const updateCellData = jest.fn();
const selectBulkData = jest.fn();
const saveRows = jest.fn();
const props = {
    //column: [...columns],
    rows: [...data.slice(0, pageSize)],
    dataSet: [...data],
    pageSize: pageSize,
    count: pageSize,
    columns: [...columns],
    gridHeight: "90vh",
    maxLeftPinnedColumn: 3,
    updateCellData: updateCellData,
    selectBulkData: selectBulkData,
    saveRows: saveRows
};
test("<Spreadsheet />", () => {
    act(() => {
        let component = ReactTestUtils.renderIntoDocument(
            <Spreadsheet {...props} />
        );
        expect(component).not.toBeNull();
    });
});
test("Spreadsheet - setStateAsync", () => {
    act(() => {
        let component = ReactTestUtils.renderIntoDocument(
            <Spreadsheet {...props} />
        );
        component.setStateAsync({ rows: [...data.slice(0, 5)] }).then((d) => {
            expect(d).not.toBeNull();
        });
    });
});
test("Spreadsheet - UNSAFE_componentWillReceiveProps", () => {
    act(() => {
        let component = ReactTestUtils.renderIntoDocument(
            <Spreadsheet {...props} />
        );
        let d = component.UNSAFE_componentWillReceiveProps(props);
        expect(d).not.toBeNull();
    });
});
test("Spreadsheet - getValidFilterValues", () => {
    act(() => {
        let component = ReactTestUtils.renderIntoDocument(
            <Spreadsheet {...props} />
        );
        let d = component.getValidFilterValues(data.slice(0, 5), "flightno");
        expect(d).not.toBeNull();
    });
});

test("Spreadsheet - handleTableSortSwap", () => {
    act(() => {
        let component = ReactTestUtils.renderIntoDocument(
            <Spreadsheet {...props} />
        );
        let d = component.handleTableSortSwap([]);
        expect(d).not.toBeNull();
    });
});

test("Spreadsheet - updateTableAsPerRowChooser", () => {
    act(() => {
        let colVal = [...columns];
        colVal[0].frozen = true;
        let incoming = ["FlightNo", "Date", "Segment From"];
        let pinned = ["FlightNo", "Date"];
        let component = ReactTestUtils.renderIntoDocument(
            <Spreadsheet {...props} columns={[...colVal]} />
        );
        const pinnedColumnsList = [
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
        let d = component.updateTableAsPerRowChooser(incoming, pinned);
        expect(d).not.toBeNull();
    });
});

test("Spreadsheet - updateTableAsPerRowChooser 2", () => {
    act(() => {
        let colVal = [...columns];
        colVal[0].frozen = true;
        let incoming = ["FlightNo", "Date", "Segment From"];
        let pinned = ["FlightNo", "Date"];
        let component = ReactTestUtils.renderIntoDocument(
            <Spreadsheet {...props} columns={[...colVal]} />
        );
        const pinnedColumnsList = [
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
        component.handleheaderNameList(columns.slice(0.1).reverse());
        let d = component.updateTableAsPerRowChooser(incoming, pinned);
        expect(d).not.toBeNull();
    });
});

test("Spreadsheet - columnReorderingPannel", () => {
    act(() => {
        let component = ReactTestUtils.renderIntoDocument(
            <Spreadsheet {...props} columns={[...columns]} />
        );

        let d = component.columnReorderingPannel();
        expect(d).not.toBeNull();
    });
});

test("Spreadsheet - closeColumnReOrdering ", () => {
    act(() => {
        let component = ReactTestUtils.renderIntoDocument(
            <Spreadsheet {...props} columns={[...columns]} />
        );

        let d = component.closeColumnReOrdering();
        expect(d).not.toBeNull();
    });
});

test("Spreadsheet - handleSearchValue ", () => {
    act(() => {
        let component = ReactTestUtils.renderIntoDocument(
            <Spreadsheet {...props} columns={[...columns]} />
        );

        let d = component.handleSearchValue("test");
        expect(d).not.toBeNull();
    });
});

test("Spreadsheet - clearSearchValue  ", () => {
    act(() => {
        let component = ReactTestUtils.renderIntoDocument(
            <Spreadsheet {...props} columns={[...columns]} />
        );

        let d = component.clearSearchValue();
        expect(d).not.toBeNull();
    });
});

test("Spreadsheet - sortingPanel  ", () => {
    act(() => {
        let component = ReactTestUtils.renderIntoDocument(
            <Spreadsheet {...props} columns={[...columns]} />
        );

        let d = component.sortingPanel();
        expect(d).not.toBeNull();
    });
});

test("Spreadsheet - closeSorting  ", () => {
    act(() => {
        let component = ReactTestUtils.renderIntoDocument(
            <Spreadsheet {...props} columns={[...columns]} />
        );

        let d = component.closeSorting();
        expect(d).not.toBeNull();
    });
});

test("Spreadsheet - clearAllSortingParams  ", () => {
    act(() => {
        let component = ReactTestUtils.renderIntoDocument(
            <Spreadsheet {...props} columns={[...columns]} />
        );
        component
            .setStateAsync({
                dataSet: [...data.slice(0, pageSize)],
                searchValue: "AAA",
                sortDirection: "ASC",
                sortColumn: "Date"
            })
            .then((rst) => {
                let d = component.clearAllSortingParams();
                console.log(d);
                expect(d).not.toBeNull();
            });
    });
});

test("Spreadsheet - exportColumnData  ", () => {
    act(() => {
        let component = ReactTestUtils.renderIntoDocument(
            <Spreadsheet {...props} columns={[...columns]} />
        );
        component
            .setStateAsync({
                subDataSet: [...data.slice(0, 5)],
                searchValue: "AAA"
            })
            .then((rst) => {
                let d = component.exportColumnData();
                console.log(d);
                expect(d).not.toBeNull();
            });
    });
});

test("Spreadsheet - closeExport", () => {
    act(() => {
        let component = ReactTestUtils.renderIntoDocument(
            <Spreadsheet {...props} columns={[...columns]} />
        );

        let d = component.closeExport();
        console.log(d);
        expect(d).not.toBeNull();
    });
});

test("Spreadsheet - setTableAsPerSortingParams", () => {
    act(() => {
        let component = ReactTestUtils.renderIntoDocument(
            <Spreadsheet {...props} columns={[...columns]} />
        );
        component.handleTableSortSwap([1, 0]);
        component
            .setStateAsync({
                subDataSet: [...data.slice(0, pageSize)],
                searchValue: "AAA",
                sortingOrderSwapList: []
            })
            .then((rst) => {
                let d = component.setTableAsPerSortingParams([
                    {
                        order: "Ascending",
                        sortBy: "FlightNo",
                        sortOn: "Value"
                    },
                    {
                        order: "Descending",
                        sortBy: "Flight Model",
                        sortOn: "Value"
                    }
                ]);
                expect(d).not.toBeNull();
            });
    });
});

test("Spreadsheet - groupSort", () => {
    act(() => {
        let component = ReactTestUtils.renderIntoDocument(
            <Spreadsheet {...props} columns={[...columns]} />
        );
        component.handleTableSortSwap([1, 0]);
        component
            .setStateAsync({
                subDataSet: [...data.slice(0, pageSize)],
                searchValue: "AAA",
                sortingOrderSwapList: []
            })
            .then((rst) => {
                let d = component.groupSort(
                    [
                        {
                            order: "Ascending",
                            sortBy: "FlightNo",
                            sortOn: "Value"
                        },
                        {
                            order: "Descending",
                            sortBy: "Flight Model",
                            sortOn: "Value"
                        }
                    ],
                    [...data.slice(0, pageSize)]
                );
                expect(d).not.toBeNull();
            });
    });
});

test("Spreadsheet - getSearchRecords 1", () => {
    act(() => {
        let component = ReactTestUtils.renderIntoDocument(
            <Spreadsheet {...props} columns={[...columns]} />
        );
        component.handleTableSortSwap([1, 0]);
        component
            .setStateAsync({
                dataSet: [...data.slice(0, pageSize)],
                searchValue: ""
            })
            .then((rst) => {
                let d = component.getSearchRecords({
                    target: {
                        value: "A"
                    }
                });
                expect(d).not.toBeNull();
            });
    });
});

test("Spreadsheet - getSearchRecords 2", () => {
    act(() => {
        let component = ReactTestUtils.renderIntoDocument(
            <Spreadsheet {...props} columns={[...columns]} />
        );
        component.handleTableSortSwap([1, 0]);
        component
            .setStateAsync({
                subDataSet: [...data.slice(0, pageSize)],
                searchValue: "AA"
            })
            .then((rst) => {
                let d = component.getSearchRecords({
                    target: {
                        value: "AAA"
                    }
                });
                expect(d).not.toBeNull();
            });
    });
});

test("Spreadsheet - getSearchRecords 3", () => {
    act(() => {
        let component = ReactTestUtils.renderIntoDocument(
            <Spreadsheet {...props} columns={[...columns]} />
        );
        component.handleTableSortSwap([1, 0]);
        component
            .setStateAsync({
                subDataSet: [...data.slice(0, pageSize)],
                searchValue: "aaa",
                sortDirection: "ASC",
                sortColumn: "Flight Model",
                sortingParamsObjectList: [
                    {
                        order: "Ascending",
                        sortBy: "FlightNo",
                        sortOn: "Value"
                    }
                ]
            })
            .then((rst) => {
                let d = component.getSearchRecords({
                    target: {
                        value: "AA"
                    }
                });
                expect(d).not.toBeNull();
            });
    });
});

test("Spreadsheet - getSearchRecords 4", () => {
    act(() => {
        let component = ReactTestUtils.renderIntoDocument(
            <Spreadsheet {...props} columns={[...columns]} />
        );
        component.handleTableSortSwap([1, 0]);
        component
            .setStateAsync({
                dataSet: [...data.slice(0, pageSize)],
                searchValue: "a"
            })
            .then((rst) => {
                let d = component.getSearchRecords({
                    target: {
                        value: ""
                    }
                });
                expect(d).not.toBeNull();
            });
    });
});

test("Spreadsheet - getSingleSortResult", () => {
    act(() => {
        let component = ReactTestUtils.renderIntoDocument(
            <Spreadsheet {...props} columns={[...columns]} />
        );
        component.handleTableSortSwap([1, 0]);
        component
            .setStateAsync({
                dataSet: [...data.slice(0, pageSize)],
                sortDirection: "DESC",
                sortColumn: "FlightNo"
            })
            .then((rst) => {
                let d = component.getSingleSortResult([
                    ...data.slice(0, pageSize)
                ]);
                expect(d).not.toBeNull();
            });
    });
});

test("Spreadsheet - getSingleSortResult 2", () => {
    act(() => {
        let component = ReactTestUtils.renderIntoDocument(
            <Spreadsheet {...props} columns={[...columns]} />
        );
        component.handleTableSortSwap([1, 0]);
        component
            .setStateAsync({
                dataSet: [...data.slice(0, pageSize)],
                sortDirection: ""
            })
            .then((rst) => {
                let d = component.getSingleSortResult([
                    ...data.slice(0, pageSize)
                ]);
                expect(d).not.toBeNull();
            });
    });
});

test("Spreadsheet - sortRows", () => {
    act(() => {
        let component = ReactTestUtils.renderIntoDocument(
            <Spreadsheet {...props} columns={[...columns]} />
        );
        component
            .setStateAsync({
                dataSet: [...data.slice(0, pageSize)]
            })
            .then((rst) => {
                let d = component.sortRows(
                    [...data.slice(0, pageSize)],
                    "FlightNo",
                    "ASC"
                );
                expect(d).not.toBeNull();
            });
    });
});

test("Spreadsheet - sortRows 2", () => {
    act(() => {
        let component = ReactTestUtils.renderIntoDocument(
            <Spreadsheet {...props} columns={[...columns]} />
        );
        component
            .setStateAsync({
                subDataSet: [...data.slice(0, pageSize)],
                searchValue: "a"
            })
            .then((rst) => {
                let d = component.sortRows(
                    [...data.slice(0, pageSize)],
                    "FlightNo",
                    "DESC"
                );
                expect(d).not.toBeNull();
            });
    });
});

test("Spreadsheet - getSlicedRows ", () => {
    act(() => {
        let component = ReactTestUtils.renderIntoDocument(
            <Spreadsheet {...props} columns={[...columns]} />
        );
        let filters = JSON.parse(
            '{"segmentto":{"filterTerm":[{"value":"ZYY","label":"ZYY"}],"column":{"rowType":"filter","key":"segmentto","name":"Segment To","draggable":false,"editor":{"key":null,"ref":null,"props":{"options":[{"id":"AAA","value":"AAA"},{"id":"AAB","value":"AAB"},{"id":"AAC","value":"AAC"},{"id":"ABA","value":"ABA"},{"id":"ABB","value":"ABB"},{"id":"ABC","value":"ABC"},{"id":"ACA","value":"ACA"},{"id":"ACB","value":"ACB"},{"id":"ACC","value":"ACC"},{"id":"BAA","value":"BAA"},{"id":"BAB","value":"BAB"},{"id":"BAC","value":"BAC"},{"id":"BBA","value":"BBA"},{"id":"BBB","value":"BBB"},{"id":"BBC","value":"BBC"},{"id":"BCA","value":"BCA"},{"id":"BCB","value":"BCB"},{"id":"BCC","value":"BCC"},{"id":"CAA","value":"CAA"},{"id":"CAB","value":"CAB"},{"id":"CAC","value":"CAC"},{"id":"CBA","value":"CBA"},{"id":"CBB","value":"CBB"},{"id":"CBC","value":"CBC"},{"id":"CCA","value":"CCA"},{"id":"CCB","value":"CCB"},{"id":"CCC","value":"CCC"},{"id":"XXX","value":"XXX"},{"id":"XXY","value":"XXY"},{"id":"XXZ","value":"XXZ"},{"id":"XYX","value":"XYX"},{"id":"XYY","value":"XYY"},{"id":"XYZ","value":"XYZ"},{"id":"XZX","value":"XZX"},{"id":"XZY","value":"XZY"},{"id":"XZZ","value":"XZZ"},{"id":"YXX","value":"YXX"},{"id":"YXY","value":"YXY"},{"id":"YXZ","value":"YXZ"},{"id":"YYX","value":"YYX"},{"id":"YYY","value":"YYY"},{"id":"YYZ","value":"YYZ"},{"id":"YZX","value":"YZX"},{"id":"YZY","value":"YZY"},{"id":"YZZ","value":"YZZ"},{"id":"ZXX","value":"ZXX"},{"id":"ZXY","value":"ZXY"},{"id":"ZXZ","value":"ZXZ"},{"id":"ZYX","value":"ZYX"},{"id":"ZYY","value":"ZYY"},{"id":"ZYZ","value":"ZYZ"},{"id":"ZZX","value":"ZZX"},{"id":"ZZY","value":"ZZY"},{"id":"ZZZ","value":"ZZZ"}]},"_owner":null,"_store":{}},"formulaApplicable":false,"sortable":true,"resizable":true,"filterable":true,"width":150,"filterType":"autoCompleteFilter","dataSource":[{"id":"AAA","value":"AAA"},{"id":"AAB","value":"AAB"},{"id":"AAC","value":"AAC"},{"id":"ABA","value":"ABA"},{"id":"ABB","value":"ABB"},{"id":"ABC","value":"ABC"},{"id":"ACA","value":"ACA"},{"id":"ACB","value":"ACB"},{"id":"ACC","value":"ACC"},{"id":"BAA","value":"BAA"},{"id":"BAB","value":"BAB"},{"id":"BAC","value":"BAC"},{"id":"BBA","value":"BBA"},{"id":"BBB","value":"BBB"},{"id":"BBC","value":"BBC"},{"id":"BCA","value":"BCA"},{"id":"BCB","value":"BCB"},{"id":"BCC","value":"BCC"},{"id":"CAA","value":"CAA"},{"id":"CAB","value":"CAB"},{"id":"CAC","value":"CAC"},{"id":"CBA","value":"CBA"},{"id":"CBB","value":"CBB"},{"id":"CBC","value":"CBC"},{"id":"CCA","value":"CCA"},{"id":"CCB","value":"CCB"},{"id":"CCC","value":"CCC"},{"id":"XXX","value":"XXX"},{"id":"XXY","value":"XXY"},{"id":"XXZ","value":"XXZ"},{"id":"XYX","value":"XYX"},{"id":"XYY","value":"XYY"},{"id":"XYZ","value":"XYZ"},{"id":"XZX","value":"XZX"},{"id":"XZY","value":"XZY"},{"id":"XZZ","value":"XZZ"},{"id":"YXX","value":"YXX"},{"id":"YXY","value":"YXY"},{"id":"YXZ","value":"YXZ"},{"id":"YYX","value":"YYX"},{"id":"YYY","value":"YYY"},{"id":"YYZ","value":"YYZ"},{"id":"YZX","value":"YZX"},{"id":"YZY","value":"YZY"},{"id":"YZZ","value":"YZZ"},{"id":"ZXX","value":"ZXX"},{"id":"ZXY","value":"ZXY"},{"id":"ZXZ","value":"ZXZ"},{"id":"ZYX","value":"ZYX"},{"id":"ZYY","value":"ZYY"},{"id":"ZYZ","value":"ZYZ"},{"id":"ZZX","value":"ZZX"},{"id":"ZZY","value":"ZZY"},{"id":"ZZZ","value":"ZZZ"}],"dataSourceType":"segmentto","left":810,"idx":6},"rawValue":[{"value":"ZYY","label":"ZYY"}]}}'
        );
        component
            .setStateAsync({
                subDataSet: [...data.slice(0, pageSize)]
            })
            .then((rst) => {
                let d = component.getSlicedRows(
                    filters,
                    [...data.slice(0, pageSize)],
                    []
                );
                expect(d).not.toBeNull();
            });
    });
});

test("Spreadsheet - getSlicedRows 2", () => {
    act(() => {
        let component = ReactTestUtils.renderIntoDocument(
            <Spreadsheet {...props} columns={[...columns]} />
        );
        let filters = JSON.parse(
            '{"segmentto":{"filterTerm":[{"value":"ZYY","label":"ZYY"}],"column":{"rowType":"filter","key":"segmentto","name":"Segment To","draggable":false,"editor":{"key":null,"ref":null,"props":{"options":[{"id":"AAA","value":"AAA"},{"id":"AAB","value":"AAB"},{"id":"AAC","value":"AAC"},{"id":"ABA","value":"ABA"},{"id":"ABB","value":"ABB"},{"id":"ABC","value":"ABC"},{"id":"ACA","value":"ACA"},{"id":"ACB","value":"ACB"},{"id":"ACC","value":"ACC"},{"id":"BAA","value":"BAA"},{"id":"BAB","value":"BAB"},{"id":"BAC","value":"BAC"},{"id":"BBA","value":"BBA"},{"id":"BBB","value":"BBB"},{"id":"BBC","value":"BBC"},{"id":"BCA","value":"BCA"},{"id":"BCB","value":"BCB"},{"id":"BCC","value":"BCC"},{"id":"CAA","value":"CAA"},{"id":"CAB","value":"CAB"},{"id":"CAC","value":"CAC"},{"id":"CBA","value":"CBA"},{"id":"CBB","value":"CBB"},{"id":"CBC","value":"CBC"},{"id":"CCA","value":"CCA"},{"id":"CCB","value":"CCB"},{"id":"CCC","value":"CCC"},{"id":"XXX","value":"XXX"},{"id":"XXY","value":"XXY"},{"id":"XXZ","value":"XXZ"},{"id":"XYX","value":"XYX"},{"id":"XYY","value":"XYY"},{"id":"XYZ","value":"XYZ"},{"id":"XZX","value":"XZX"},{"id":"XZY","value":"XZY"},{"id":"XZZ","value":"XZZ"},{"id":"YXX","value":"YXX"},{"id":"YXY","value":"YXY"},{"id":"YXZ","value":"YXZ"},{"id":"YYX","value":"YYX"},{"id":"YYY","value":"YYY"},{"id":"YYZ","value":"YYZ"},{"id":"YZX","value":"YZX"},{"id":"YZY","value":"YZY"},{"id":"YZZ","value":"YZZ"},{"id":"ZXX","value":"ZXX"},{"id":"ZXY","value":"ZXY"},{"id":"ZXZ","value":"ZXZ"},{"id":"ZYX","value":"ZYX"},{"id":"ZYY","value":"ZYY"},{"id":"ZYZ","value":"ZYZ"},{"id":"ZZX","value":"ZZX"},{"id":"ZZY","value":"ZZY"},{"id":"ZZZ","value":"ZZZ"}]},"_owner":null,"_store":{}},"formulaApplicable":false,"sortable":true,"resizable":true,"filterable":true,"width":150,"filterType":"autoCompleteFilter","dataSource":[{"id":"AAA","value":"AAA"},{"id":"AAB","value":"AAB"},{"id":"AAC","value":"AAC"},{"id":"ABA","value":"ABA"},{"id":"ABB","value":"ABB"},{"id":"ABC","value":"ABC"},{"id":"ACA","value":"ACA"},{"id":"ACB","value":"ACB"},{"id":"ACC","value":"ACC"},{"id":"BAA","value":"BAA"},{"id":"BAB","value":"BAB"},{"id":"BAC","value":"BAC"},{"id":"BBA","value":"BBA"},{"id":"BBB","value":"BBB"},{"id":"BBC","value":"BBC"},{"id":"BCA","value":"BCA"},{"id":"BCB","value":"BCB"},{"id":"BCC","value":"BCC"},{"id":"CAA","value":"CAA"},{"id":"CAB","value":"CAB"},{"id":"CAC","value":"CAC"},{"id":"CBA","value":"CBA"},{"id":"CBB","value":"CBB"},{"id":"CBC","value":"CBC"},{"id":"CCA","value":"CCA"},{"id":"CCB","value":"CCB"},{"id":"CCC","value":"CCC"},{"id":"XXX","value":"XXX"},{"id":"XXY","value":"XXY"},{"id":"XXZ","value":"XXZ"},{"id":"XYX","value":"XYX"},{"id":"XYY","value":"XYY"},{"id":"XYZ","value":"XYZ"},{"id":"XZX","value":"XZX"},{"id":"XZY","value":"XZY"},{"id":"XZZ","value":"XZZ"},{"id":"YXX","value":"YXX"},{"id":"YXY","value":"YXY"},{"id":"YXZ","value":"YXZ"},{"id":"YYX","value":"YYX"},{"id":"YYY","value":"YYY"},{"id":"YYZ","value":"YYZ"},{"id":"YZX","value":"YZX"},{"id":"YZY","value":"YZY"},{"id":"YZZ","value":"YZZ"},{"id":"ZXX","value":"ZXX"},{"id":"ZXY","value":"ZXY"},{"id":"ZXZ","value":"ZXZ"},{"id":"ZYX","value":"ZYX"},{"id":"ZYY","value":"ZYY"},{"id":"ZYZ","value":"ZYZ"},{"id":"ZZX","value":"ZZX"},{"id":"ZZY","value":"ZZY"},{"id":"ZZZ","value":"ZZZ"}],"dataSourceType":"segmentto","left":810,"idx":6},"rawValue":[{"value":"ZYY","label":"ZYY"}]}}'
        );
        component
            .setStateAsync({
                subDataSet: [...data.slice(0, pageSize)],
                searchValue: "test",
                sortingParamsObjectList: [
                    {
                        order: "Ascending",
                        sortBy: "FlightNo",
                        sortOn: "Value"
                    }
                ]
            })
            .then((rst) => {
                let d = component.getSlicedRows(
                    filters,
                    [...data.slice(0, pageSize)],
                    []
                );
                expect(d).not.toBeNull();
            });
    });
});

test("Spreadsheet - getRowsAsync", () => {
    act(() => {
        let component = ReactTestUtils.renderIntoDocument(
            <Spreadsheet {...props} columns={[...columns]} />
        );

        component.getRowsAsync([...data.slice(0, pageSize)], {}).then((d) => {
            expect(d).not.toBeNull();
        });
    });
});

test("Spreadsheet - getrows ", () => {
    act(() => {
        let component = ReactTestUtils.renderIntoDocument(
            <Spreadsheet {...props} columns={[...columns]} />
        );

        let d = component.getrows([...data.slice(0, pageSize)], {});
        expect(d).not.toBeNull();
    });
});

test("Spreadsheet - onRowsDeselected", () => {
    act(() => {
        let component = ReactTestUtils.renderIntoDocument(
            <Spreadsheet {...props} columns={[...columns]} />
        );

        let d = component.onRowsDeselected([...data.slice(0, pageSize)]);
        expect(d).not.toBeNull();
    });
});

test("Spreadsheet - onGridRowsUpdated", () => {
    act(() => {
        let component = ReactTestUtils.renderIntoDocument(
            <Spreadsheet {...props} columns={[...columns]} />
        );
        // let filters = JSON.parse(
        //     '{"segmentto":{"filterTerm":[{"value":"ZYY","label":"ZYY"}],"column":{"rowType":"filter","key":"segmentto","name":"Segment To","draggable":false,"editor":{"key":null,"ref":null,"props":{"options":[{"id":"AAA","value":"AAA"},{"id":"AAB","value":"AAB"},{"id":"AAC","value":"AAC"},{"id":"ABA","value":"ABA"},{"id":"ABB","value":"ABB"},{"id":"ABC","value":"ABC"},{"id":"ACA","value":"ACA"},{"id":"ACB","value":"ACB"},{"id":"ACC","value":"ACC"},{"id":"BAA","value":"BAA"},{"id":"BAB","value":"BAB"},{"id":"BAC","value":"BAC"},{"id":"BBA","value":"BBA"},{"id":"BBB","value":"BBB"},{"id":"BBC","value":"BBC"},{"id":"BCA","value":"BCA"},{"id":"BCB","value":"BCB"},{"id":"BCC","value":"BCC"},{"id":"CAA","value":"CAA"},{"id":"CAB","value":"CAB"},{"id":"CAC","value":"CAC"},{"id":"CBA","value":"CBA"},{"id":"CBB","value":"CBB"},{"id":"CBC","value":"CBC"},{"id":"CCA","value":"CCA"},{"id":"CCB","value":"CCB"},{"id":"CCC","value":"CCC"},{"id":"XXX","value":"XXX"},{"id":"XXY","value":"XXY"},{"id":"XXZ","value":"XXZ"},{"id":"XYX","value":"XYX"},{"id":"XYY","value":"XYY"},{"id":"XYZ","value":"XYZ"},{"id":"XZX","value":"XZX"},{"id":"XZY","value":"XZY"},{"id":"XZZ","value":"XZZ"},{"id":"YXX","value":"YXX"},{"id":"YXY","value":"YXY"},{"id":"YXZ","value":"YXZ"},{"id":"YYX","value":"YYX"},{"id":"YYY","value":"YYY"},{"id":"YYZ","value":"YYZ"},{"id":"YZX","value":"YZX"},{"id":"YZY","value":"YZY"},{"id":"YZZ","value":"YZZ"},{"id":"ZXX","value":"ZXX"},{"id":"ZXY","value":"ZXY"},{"id":"ZXZ","value":"ZXZ"},{"id":"ZYX","value":"ZYX"},{"id":"ZYY","value":"ZYY"},{"id":"ZYZ","value":"ZYZ"},{"id":"ZZX","value":"ZZX"},{"id":"ZZY","value":"ZZY"},{"id":"ZZZ","value":"ZZZ"}]},"_owner":null,"_store":{}},"formulaApplicable":false,"sortable":true,"resizable":true,"filterable":true,"width":150,"filterType":"autoCompleteFilter","dataSource":[{"id":"AAA","value":"AAA"},{"id":"AAB","value":"AAB"},{"id":"AAC","value":"AAC"},{"id":"ABA","value":"ABA"},{"id":"ABB","value":"ABB"},{"id":"ABC","value":"ABC"},{"id":"ACA","value":"ACA"},{"id":"ACB","value":"ACB"},{"id":"ACC","value":"ACC"},{"id":"BAA","value":"BAA"},{"id":"BAB","value":"BAB"},{"id":"BAC","value":"BAC"},{"id":"BBA","value":"BBA"},{"id":"BBB","value":"BBB"},{"id":"BBC","value":"BBC"},{"id":"BCA","value":"BCA"},{"id":"BCB","value":"BCB"},{"id":"BCC","value":"BCC"},{"id":"CAA","value":"CAA"},{"id":"CAB","value":"CAB"},{"id":"CAC","value":"CAC"},{"id":"CBA","value":"CBA"},{"id":"CBB","value":"CBB"},{"id":"CBC","value":"CBC"},{"id":"CCA","value":"CCA"},{"id":"CCB","value":"CCB"},{"id":"CCC","value":"CCC"},{"id":"XXX","value":"XXX"},{"id":"XXY","value":"XXY"},{"id":"XXZ","value":"XXZ"},{"id":"XYX","value":"XYX"},{"id":"XYY","value":"XYY"},{"id":"XYZ","value":"XYZ"},{"id":"XZX","value":"XZX"},{"id":"XZY","value":"XZY"},{"id":"XZZ","value":"XZZ"},{"id":"YXX","value":"YXX"},{"id":"YXY","value":"YXY"},{"id":"YXZ","value":"YXZ"},{"id":"YYX","value":"YYX"},{"id":"YYY","value":"YYY"},{"id":"YYZ","value":"YYZ"},{"id":"YZX","value":"YZX"},{"id":"YZY","value":"YZY"},{"id":"YZZ","value":"YZZ"},{"id":"ZXX","value":"ZXX"},{"id":"ZXY","value":"ZXY"},{"id":"ZXZ","value":"ZXZ"},{"id":"ZYX","value":"ZYX"},{"id":"ZYY","value":"ZYY"},{"id":"ZYZ","value":"ZYZ"},{"id":"ZZX","value":"ZZX"},{"id":"ZZY","value":"ZZY"},{"id":"ZZZ","value":"ZZZ"}],"dataSourceType":"segmentto","left":810,"idx":6},"rawValue":[{"value":"ZYY","label":"ZYY"}]}}'
        // );
        component
            .setStateAsync({
                rows: [...data.slice(0, pageSize)]
            })
            .then((rst) => {
                let val = {
                    fromRow: 0,
                    toRow: 0,
                    updated: { revenue: "$60,485.34" },
                    action: "CELL_UPDATE"
                };
                let d = component.onGridRowsUpdated({ ...val });
                expect(d).not.toBeNull();
            });
    });
});

test("Spreadsheet - onRowsSelected", () => {
    act(() => {
        let component = ReactTestUtils.renderIntoDocument(
            <Spreadsheet {...props} columns={[...columns]} />
        );

        let d = component.onRowsSelected([...data.slice(0, pageSize)]);
        expect(d).not.toBeNull();
    });
});

test("Spreadsheet - handleFilterChange ", () => {
    act(() => {
        let component = ReactTestUtils.renderIntoDocument(
            <Spreadsheet {...props} columns={[...columns]} />
        );
        let filter = JSON.parse(
            '{"filterTerm":[{"value":"ZYY","label":"ZYY"}],"column":{"rowType":"filter","key":"segmentto","name":"Segment To","draggable":false,"editor":{"key":null,"ref":null,"props":{"options":[{"id":"AAA","value":"AAA"},{"id":"AAB","value":"AAB"},{"id":"AAC","value":"AAC"},{"id":"ABA","value":"ABA"},{"id":"ABB","value":"ABB"},{"id":"ABC","value":"ABC"},{"id":"ACA","value":"ACA"},{"id":"ACB","value":"ACB"},{"id":"ACC","value":"ACC"},{"id":"BAA","value":"BAA"},{"id":"BAB","value":"BAB"},{"id":"BAC","value":"BAC"},{"id":"BBA","value":"BBA"},{"id":"BBB","value":"BBB"},{"id":"BBC","value":"BBC"},{"id":"BCA","value":"BCA"},{"id":"BCB","value":"BCB"},{"id":"BCC","value":"BCC"},{"id":"CAA","value":"CAA"},{"id":"CAB","value":"CAB"},{"id":"CAC","value":"CAC"},{"id":"CBA","value":"CBA"},{"id":"CBB","value":"CBB"},{"id":"CBC","value":"CBC"},{"id":"CCA","value":"CCA"},{"id":"CCB","value":"CCB"},{"id":"CCC","value":"CCC"},{"id":"XXX","value":"XXX"},{"id":"XXY","value":"XXY"},{"id":"XXZ","value":"XXZ"},{"id":"XYX","value":"XYX"},{"id":"XYY","value":"XYY"},{"id":"XYZ","value":"XYZ"},{"id":"XZX","value":"XZX"},{"id":"XZY","value":"XZY"},{"id":"XZZ","value":"XZZ"},{"id":"YXX","value":"YXX"},{"id":"YXY","value":"YXY"},{"id":"YXZ","value":"YXZ"},{"id":"YYX","value":"YYX"},{"id":"YYY","value":"YYY"},{"id":"YYZ","value":"YYZ"},{"id":"YZX","value":"YZX"},{"id":"YZY","value":"YZY"},{"id":"YZZ","value":"YZZ"},{"id":"ZXX","value":"ZXX"},{"id":"ZXY","value":"ZXY"},{"id":"ZXZ","value":"ZXZ"},{"id":"ZYX","value":"ZYX"},{"id":"ZYY","value":"ZYY"},{"id":"ZYZ","value":"ZYZ"},{"id":"ZZX","value":"ZZX"},{"id":"ZZY","value":"ZZY"},{"id":"ZZZ","value":"ZZZ"}]},"_owner":null,"_store":{}},"formulaApplicable":false,"sortable":true,"resizable":true,"filterable":true,"width":150,"filterType":"autoCompleteFilter","dataSource":[{"id":"AAA","value":"AAA"},{"id":"AAB","value":"AAB"},{"id":"AAC","value":"AAC"},{"id":"ABA","value":"ABA"},{"id":"ABB","value":"ABB"},{"id":"ABC","value":"ABC"},{"id":"ACA","value":"ACA"},{"id":"ACB","value":"ACB"},{"id":"ACC","value":"ACC"},{"id":"BAA","value":"BAA"},{"id":"BAB","value":"BAB"},{"id":"BAC","value":"BAC"},{"id":"BBA","value":"BBA"},{"id":"BBB","value":"BBB"},{"id":"BBC","value":"BBC"},{"id":"BCA","value":"BCA"},{"id":"BCB","value":"BCB"},{"id":"BCC","value":"BCC"},{"id":"CAA","value":"CAA"},{"id":"CAB","value":"CAB"},{"id":"CAC","value":"CAC"},{"id":"CBA","value":"CBA"},{"id":"CBB","value":"CBB"},{"id":"CBC","value":"CBC"},{"id":"CCA","value":"CCA"},{"id":"CCB","value":"CCB"},{"id":"CCC","value":"CCC"},{"id":"XXX","value":"XXX"},{"id":"XXY","value":"XXY"},{"id":"XXZ","value":"XXZ"},{"id":"XYX","value":"XYX"},{"id":"XYY","value":"XYY"},{"id":"XYZ","value":"XYZ"},{"id":"XZX","value":"XZX"},{"id":"XZY","value":"XZY"},{"id":"XZZ","value":"XZZ"},{"id":"YXX","value":"YXX"},{"id":"YXY","value":"YXY"},{"id":"YXZ","value":"YXZ"},{"id":"YYX","value":"YYX"},{"id":"YYY","value":"YYY"},{"id":"YYZ","value":"YYZ"},{"id":"YZX","value":"YZX"},{"id":"YZY","value":"YZY"},{"id":"YZZ","value":"YZZ"},{"id":"ZXX","value":"ZXX"},{"id":"ZXY","value":"ZXY"},{"id":"ZXZ","value":"ZXZ"},{"id":"ZYX","value":"ZYX"},{"id":"ZYY","value":"ZYY"},{"id":"ZYZ","value":"ZYZ"},{"id":"ZZX","value":"ZZX"},{"id":"ZZY","value":"ZZY"},{"id":"ZZZ","value":"ZZZ"}],"dataSourceType":"segmentto","left":810,"idx":6},"rawValue":[{"value":"ZYY","label":"ZYY"}]}'
        );
        component
            .setStateAsync({
                subDataSet: [...data.slice(0, pageSize)],
                pageRowCount: 10,
                searchValue: "",
                sortingParamsObjectList: [
                    {
                        order: "Ascending",
                        sortBy: "FlightNo",
                        sortOn: "Value"
                    }
                ]
            })
            .then((rst) => {
                let d = component.handleFilterChange(filter);
                expect(d).not.toBeNull();
            });
    });
});

test("Spreadsheet - handleFilterChange 2", () => {
    act(() => {
        let component = ReactTestUtils.renderIntoDocument(
            <Spreadsheet {...props} columns={[...columns]} />
        );
        let junk = JSON.parse(
            '{"segmentto":{"filterTerm":[{"value":"ZYY","label":"ZYY"}],"column":{"rowType":"filter","key":"segmentto","name":"Segment To","draggable":false,"editor":{"key":null,"ref":null,"props":{"options":[{"id":"AAA","value":"AAA"},{"id":"AAB","value":"AAB"},{"id":"AAC","value":"AAC"},{"id":"ABA","value":"ABA"},{"id":"ABB","value":"ABB"},{"id":"ABC","value":"ABC"},{"id":"ACA","value":"ACA"},{"id":"ACB","value":"ACB"},{"id":"ACC","value":"ACC"},{"id":"BAA","value":"BAA"},{"id":"BAB","value":"BAB"},{"id":"BAC","value":"BAC"},{"id":"BBA","value":"BBA"},{"id":"BBB","value":"BBB"},{"id":"BBC","value":"BBC"},{"id":"BCA","value":"BCA"},{"id":"BCB","value":"BCB"},{"id":"BCC","value":"BCC"},{"id":"CAA","value":"CAA"},{"id":"CAB","value":"CAB"},{"id":"CAC","value":"CAC"},{"id":"CBA","value":"CBA"},{"id":"CBB","value":"CBB"},{"id":"CBC","value":"CBC"},{"id":"CCA","value":"CCA"},{"id":"CCB","value":"CCB"},{"id":"CCC","value":"CCC"},{"id":"XXX","value":"XXX"},{"id":"XXY","value":"XXY"},{"id":"XXZ","value":"XXZ"},{"id":"XYX","value":"XYX"},{"id":"XYY","value":"XYY"},{"id":"XYZ","value":"XYZ"},{"id":"XZX","value":"XZX"},{"id":"XZY","value":"XZY"},{"id":"XZZ","value":"XZZ"},{"id":"YXX","value":"YXX"},{"id":"YXY","value":"YXY"},{"id":"YXZ","value":"YXZ"},{"id":"YYX","value":"YYX"},{"id":"YYY","value":"YYY"},{"id":"YYZ","value":"YYZ"},{"id":"YZX","value":"YZX"},{"id":"YZY","value":"YZY"},{"id":"YZZ","value":"YZZ"},{"id":"ZXX","value":"ZXX"},{"id":"ZXY","value":"ZXY"},{"id":"ZXZ","value":"ZXZ"},{"id":"ZYX","value":"ZYX"},{"id":"ZYY","value":"ZYY"},{"id":"ZYZ","value":"ZYZ"},{"id":"ZZX","value":"ZZX"},{"id":"ZZY","value":"ZZY"},{"id":"ZZZ","value":"ZZZ"}]},"_owner":null,"_store":{}},"formulaApplicable":false,"sortable":true,"resizable":true,"filterable":true,"width":150,"filterType":"autoCompleteFilter","dataSource":[{"id":"AAA","value":"AAA"},{"id":"AAB","value":"AAB"},{"id":"AAC","value":"AAC"},{"id":"ABA","value":"ABA"},{"id":"ABB","value":"ABB"},{"id":"ABC","value":"ABC"},{"id":"ACA","value":"ACA"},{"id":"ACB","value":"ACB"},{"id":"ACC","value":"ACC"},{"id":"BAA","value":"BAA"},{"id":"BAB","value":"BAB"},{"id":"BAC","value":"BAC"},{"id":"BBA","value":"BBA"},{"id":"BBB","value":"BBB"},{"id":"BBC","value":"BBC"},{"id":"BCA","value":"BCA"},{"id":"BCB","value":"BCB"},{"id":"BCC","value":"BCC"},{"id":"CAA","value":"CAA"},{"id":"CAB","value":"CAB"},{"id":"CAC","value":"CAC"},{"id":"CBA","value":"CBA"},{"id":"CBB","value":"CBB"},{"id":"CBC","value":"CBC"},{"id":"CCA","value":"CCA"},{"id":"CCB","value":"CCB"},{"id":"CCC","value":"CCC"},{"id":"XXX","value":"XXX"},{"id":"XXY","value":"XXY"},{"id":"XXZ","value":"XXZ"},{"id":"XYX","value":"XYX"},{"id":"XYY","value":"XYY"},{"id":"XYZ","value":"XYZ"},{"id":"XZX","value":"XZX"},{"id":"XZY","value":"XZY"},{"id":"XZZ","value":"XZZ"},{"id":"YXX","value":"YXX"},{"id":"YXY","value":"YXY"},{"id":"YXZ","value":"YXZ"},{"id":"YYX","value":"YYX"},{"id":"YYY","value":"YYY"},{"id":"YYZ","value":"YYZ"},{"id":"YZX","value":"YZX"},{"id":"YZY","value":"YZY"},{"id":"YZZ","value":"YZZ"},{"id":"ZXX","value":"ZXX"},{"id":"ZXY","value":"ZXY"},{"id":"ZXZ","value":"ZXZ"},{"id":"ZYX","value":"ZYX"},{"id":"ZYY","value":"ZYY"},{"id":"ZYZ","value":"ZYZ"},{"id":"ZZX","value":"ZZX"},{"id":"ZZY","value":"ZZY"},{"id":"ZZZ","value":"ZZZ"}],"dataSourceType":"segmentto","left":810,"idx":6},"rawValue":[{"value":"ZYY","label":"ZYY"}]}}'
        );
        let filterVal = JSON.parse(
            '{"filterTerm":[],"column":{"rowType":"filter","key":"segmentto","name":"Segment To","draggable":false,"editor":{"key":null,"ref":null,"props":{"options":[{"id":"AAA","value":"AAA"},{"id":"AAB","value":"AAB"},{"id":"AAC","value":"AAC"},{"id":"ABA","value":"ABA"},{"id":"ABB","value":"ABB"},{"id":"ABC","value":"ABC"},{"id":"ACA","value":"ACA"},{"id":"ACB","value":"ACB"},{"id":"ACC","value":"ACC"},{"id":"BAA","value":"BAA"},{"id":"BAB","value":"BAB"},{"id":"BAC","value":"BAC"},{"id":"BBA","value":"BBA"},{"id":"BBB","value":"BBB"},{"id":"BBC","value":"BBC"},{"id":"BCA","value":"BCA"},{"id":"BCB","value":"BCB"},{"id":"BCC","value":"BCC"},{"id":"CAA","value":"CAA"},{"id":"CAB","value":"CAB"},{"id":"CAC","value":"CAC"},{"id":"CBA","value":"CBA"},{"id":"CBB","value":"CBB"},{"id":"CBC","value":"CBC"},{"id":"CCA","value":"CCA"},{"id":"CCB","value":"CCB"},{"id":"CCC","value":"CCC"},{"id":"XXX","value":"XXX"},{"id":"XXY","value":"XXY"},{"id":"XXZ","value":"XXZ"},{"id":"XYX","value":"XYX"},{"id":"XYY","value":"XYY"},{"id":"XYZ","value":"XYZ"},{"id":"XZX","value":"XZX"},{"id":"XZY","value":"XZY"},{"id":"XZZ","value":"XZZ"},{"id":"YXX","value":"YXX"},{"id":"YXY","value":"YXY"},{"id":"YXZ","value":"YXZ"},{"id":"YYX","value":"YYX"},{"id":"YYY","value":"YYY"},{"id":"YYZ","value":"YYZ"},{"id":"YZX","value":"YZX"},{"id":"YZY","value":"YZY"},{"id":"YZZ","value":"YZZ"},{"id":"ZXX","value":"ZXX"},{"id":"ZXY","value":"ZXY"},{"id":"ZXZ","value":"ZXZ"},{"id":"ZYX","value":"ZYX"},{"id":"ZYY","value":"ZYY"},{"id":"ZYZ","value":"ZYZ"},{"id":"ZZX","value":"ZZX"},{"id":"ZZY","value":"ZZY"},{"id":"ZZZ","value":"ZZZ"}]},"_owner":null,"_store":{}},"formulaApplicable":false,"sortable":true,"resizable":true,"filterable":true,"width":150,"filterType":"autoCompleteFilter","dataSource":[{"id":"AAA","value":"AAA"},{"id":"AAB","value":"AAB"},{"id":"AAC","value":"AAC"},{"id":"ABA","value":"ABA"},{"id":"ABB","value":"ABB"},{"id":"ABC","value":"ABC"},{"id":"ACA","value":"ACA"},{"id":"ACB","value":"ACB"},{"id":"ACC","value":"ACC"},{"id":"BAA","value":"BAA"},{"id":"BAB","value":"BAB"},{"id":"BAC","value":"BAC"},{"id":"BBA","value":"BBA"},{"id":"BBB","value":"BBB"},{"id":"BBC","value":"BBC"},{"id":"BCA","value":"BCA"},{"id":"BCB","value":"BCB"},{"id":"BCC","value":"BCC"},{"id":"CAA","value":"CAA"},{"id":"CAB","value":"CAB"},{"id":"CAC","value":"CAC"},{"id":"CBA","value":"CBA"},{"id":"CBB","value":"CBB"},{"id":"CBC","value":"CBC"},{"id":"CCA","value":"CCA"},{"id":"CCB","value":"CCB"},{"id":"CCC","value":"CCC"},{"id":"XXX","value":"XXX"},{"id":"XXY","value":"XXY"},{"id":"XXZ","value":"XXZ"},{"id":"XYX","value":"XYX"},{"id":"XYY","value":"XYY"},{"id":"XYZ","value":"XYZ"},{"id":"XZX","value":"XZX"},{"id":"XZY","value":"XZY"},{"id":"XZZ","value":"XZZ"},{"id":"YXX","value":"YXX"},{"id":"YXY","value":"YXY"},{"id":"YXZ","value":"YXZ"},{"id":"YYX","value":"YYX"},{"id":"YYY","value":"YYY"},{"id":"YYZ","value":"YYZ"},{"id":"YZX","value":"YZX"},{"id":"YZY","value":"YZY"},{"id":"YZZ","value":"YZZ"},{"id":"ZXX","value":"ZXX"},{"id":"ZXY","value":"ZXY"},{"id":"ZXZ","value":"ZXZ"},{"id":"ZYX","value":"ZYX"},{"id":"ZYY","value":"ZYY"},{"id":"ZYZ","value":"ZYZ"},{"id":"ZZX","value":"ZZX"},{"id":"ZZY","value":"ZZY"},{"id":"ZZZ","value":"ZZZ"}],"dataSourceType":"segmentto","left":810,"idx":6},"rawValue":[]}'
        );
        component
            .setStateAsync({
                subDataSet: [...data.slice(0, pageSize)],
                pageRowCount: 10,
                searchValue: "aaa",
                sortingParamsObjectList: [
                    {
                        order: "Ascending",
                        sortBy: "FlightNo",
                        sortOn: "Value"
                    }
                ],
                junk: { ...junk }
            })
            .then((rst) => {
                let d = component.handleFilterChange(filterVal);
                expect(d).not.toBeNull();
            });
    });
});

test("Spreadsheet - isAtBottom", () => {
    act(() => {
        let component = ReactTestUtils.renderIntoDocument(
            <Spreadsheet {...props} columns={[...columns]} />
        );
        let event = {
            target: {
                clientHeight: 582,
                scrollTop: 25,
                scrollHeight: 17500
            }
        };
        let d = component.isAtBottom(event);
        expect(d).not.toBeNull();
    });
});

test("Spreadsheet - isSubset", () => {
    act(() => {
        let component = ReactTestUtils.renderIntoDocument(
            <Spreadsheet {...props} columns={[...columns]} />
        );
        component
            .setStateAsync({
                sortingParamsObjectList: []
            })
            .then((rs) => {
                let event = {
                    target: {
                        clientHeight: 582,
                        scrollTop: 25,
                        scrollHeight: 17500
                    }
                };
                let d = component.isSubset(event);
                expect(d).toBeFalsy();
            });
    });
});

test("Spreadsheet - loadMoreRows ", () => {
    act(() => {
        let component = ReactTestUtils.renderIntoDocument(
            <Spreadsheet {...props} columns={[...columns]} />
        );
        component
            .setStateAsync({
                subDataSet: [...data.slice(0, pageSize)],
                dataSet: [...data.slice(0, pageSize)],
                pageRowCount: 10,
                searchValue: ""
            })
            .then((rs) => {
                component.loadMoreRows(0, 10).then((r) => {
                    expect(r.length).toBeGreaterThan(0);
                });
            });
    });
});

test("Spreadsheet - loadMoreRows 2", () => {
    act(() => {
        let component = ReactTestUtils.renderIntoDocument(
            <Spreadsheet {...props} columns={[...columns]} />
        );
        component
            .setStateAsync({
                subDataSet: [...data.slice(0, pageSize)],
                dataSet: [...data.slice(0, pageSize)],
                pageRowCount: 10,
                searchValue: "aaa"
            })
            .then((rs) => {
                component.loadMoreRows(0, 10).then((r) => {
                    expect(r.length).toBeGreaterThan(0);
                });
            });
    });
});

test("Spreadsheet - handleScroll", () => {
    act(() => {
        let component = ReactTestUtils.renderIntoDocument(
            <Spreadsheet {...props} columns={[...columns]} />
        );
        component
            .setStateAsync({
                subDataSet: [...data.slice(0, pageSize)],
                dataSet: [...data.slice(0, pageSize)],
                rows: [...data.slice(0, pageSize)],
                pageRowCount: 10,
                searchValue: "aaa",
                pageIndex: 0
            })
            .then(async (rs) => {
                let event = {
                    target: {
                        clientHeight: 582,
                        scrollTop: 25,
                        scrollHeight: 17500
                    }
                };
                let d = await component.handleScroll(event);
                expect(d).not.toBeNull();
            });
    });
});

test("Spreadsheet - globalSearchLogic", async () => {
    act(async () => {
        let component = ReactTestUtils.renderIntoDocument(
            <Spreadsheet {...props} columns={[...columns]} />
        );
        await component
            .setStateAsync({
                subDataSet: [...data.slice(0, pageSize)],
                dataSet: [...data.slice(0, pageSize)],
                rows: [...data.slice(0, pageSize)],
                pageRowCount: 10,
                searchValue: "aaa",
                pageIndex: 0
            })
            .then(async (rs) => {
                let event = {
                    target: {
                        value: "aaa"
                    }
                };
                let d = await component.globalSearchLogic(event, [
                    ...data.slice(0, pageSize)
                ]);
                expect(d).not.toBeNull();
            });
    });
});

test("Spreadsheet - handleWarningStatus ", () => {
    act(() => {
        let component = ReactTestUtils.renderIntoDocument(
            <Spreadsheet {...props} columns={[...columns]} />
        );

        let d = component.handleWarningStatus();
        expect(d).not.toBeNull();
    });
});

test("Spreadsheet - closeWarningStatus", () => {
    act(() => {
        let component = ReactTestUtils.renderIntoDocument(
            <Spreadsheet {...props} columns={[...columns]} />
        );
        component
            .setStateAsync({
                dataSet: [...data.slice(0, pageSize)],
                sortDirection: "DESC",
                sortColumn: "FlightNo",
                sortingParamsObjectList: [
                    {
                        order: "Ascending",
                        sortBy: "FlightNo",
                        sortOn: "Value"
                    }
                ]
            })
            .then((rs) => {
                let r = component.closeWarningStatus();
                expect(r).not.toBeNull();
            });
    });
});

test("Spreadsheet - save", () => {
    act(() => {
        let component = ReactTestUtils.renderIntoDocument(
            <Spreadsheet {...props} columns={[...columns]} />
        );

        let d = component.save();
        expect(d).not.toBeNull();
    });
});

test("Spreadsheet - clearAllFilters", () => {
    act(() => {
        let component = ReactTestUtils.renderIntoDocument(
            <Spreadsheet {...props} columns={[...columns]} />
        );
        component
            .setStateAsync({
                dataSet: [...data.slice(0, pageSize)],
                sortDirection: "DESC",
                sortColumn: "FlightNo",
                searchValue: "aaa",
                sortingParamsObjectList: [
                    {
                        order: "Ascending",
                        sortBy: "FlightNo",
                        sortOn: "Value"
                    }
                ]
            })
            .then((rs) => {
                let r = component.clearAllFilters();
                expect(r).not.toBeNull();
            });
    });
});

test("Spreadsheet - getFilterResult ", () => {
    act(() => {
        let component = ReactTestUtils.renderIntoDocument(
            <Spreadsheet {...props} columns={[...columns]} />
        );
        let junk = JSON.parse(
            '{"segmentto":{"filterTerm":[{"value":"ZYY","label":"ZYY"}],"column":{"rowType":"filter","key":"segmentto","name":"Segment To","draggable":false,"editor":{"key":null,"ref":null,"props":{"options":[{"id":"AAA","value":"AAA"},{"id":"AAB","value":"AAB"},{"id":"AAC","value":"AAC"},{"id":"ABA","value":"ABA"},{"id":"ABB","value":"ABB"},{"id":"ABC","value":"ABC"},{"id":"ACA","value":"ACA"},{"id":"ACB","value":"ACB"},{"id":"ACC","value":"ACC"},{"id":"BAA","value":"BAA"},{"id":"BAB","value":"BAB"},{"id":"BAC","value":"BAC"},{"id":"BBA","value":"BBA"},{"id":"BBB","value":"BBB"},{"id":"BBC","value":"BBC"},{"id":"BCA","value":"BCA"},{"id":"BCB","value":"BCB"},{"id":"BCC","value":"BCC"},{"id":"CAA","value":"CAA"},{"id":"CAB","value":"CAB"},{"id":"CAC","value":"CAC"},{"id":"CBA","value":"CBA"},{"id":"CBB","value":"CBB"},{"id":"CBC","value":"CBC"},{"id":"CCA","value":"CCA"},{"id":"CCB","value":"CCB"},{"id":"CCC","value":"CCC"},{"id":"XXX","value":"XXX"},{"id":"XXY","value":"XXY"},{"id":"XXZ","value":"XXZ"},{"id":"XYX","value":"XYX"},{"id":"XYY","value":"XYY"},{"id":"XYZ","value":"XYZ"},{"id":"XZX","value":"XZX"},{"id":"XZY","value":"XZY"},{"id":"XZZ","value":"XZZ"},{"id":"YXX","value":"YXX"},{"id":"YXY","value":"YXY"},{"id":"YXZ","value":"YXZ"},{"id":"YYX","value":"YYX"},{"id":"YYY","value":"YYY"},{"id":"YYZ","value":"YYZ"},{"id":"YZX","value":"YZX"},{"id":"YZY","value":"YZY"},{"id":"YZZ","value":"YZZ"},{"id":"ZXX","value":"ZXX"},{"id":"ZXY","value":"ZXY"},{"id":"ZXZ","value":"ZXZ"},{"id":"ZYX","value":"ZYX"},{"id":"ZYY","value":"ZYY"},{"id":"ZYZ","value":"ZYZ"},{"id":"ZZX","value":"ZZX"},{"id":"ZZY","value":"ZZY"},{"id":"ZZZ","value":"ZZZ"}]},"_owner":null,"_store":{}},"formulaApplicable":false,"sortable":true,"resizable":true,"filterable":true,"width":150,"filterType":"autoCompleteFilter","dataSource":[{"id":"AAA","value":"AAA"},{"id":"AAB","value":"AAB"},{"id":"AAC","value":"AAC"},{"id":"ABA","value":"ABA"},{"id":"ABB","value":"ABB"},{"id":"ABC","value":"ABC"},{"id":"ACA","value":"ACA"},{"id":"ACB","value":"ACB"},{"id":"ACC","value":"ACC"},{"id":"BAA","value":"BAA"},{"id":"BAB","value":"BAB"},{"id":"BAC","value":"BAC"},{"id":"BBA","value":"BBA"},{"id":"BBB","value":"BBB"},{"id":"BBC","value":"BBC"},{"id":"BCA","value":"BCA"},{"id":"BCB","value":"BCB"},{"id":"BCC","value":"BCC"},{"id":"CAA","value":"CAA"},{"id":"CAB","value":"CAB"},{"id":"CAC","value":"CAC"},{"id":"CBA","value":"CBA"},{"id":"CBB","value":"CBB"},{"id":"CBC","value":"CBC"},{"id":"CCA","value":"CCA"},{"id":"CCB","value":"CCB"},{"id":"CCC","value":"CCC"},{"id":"XXX","value":"XXX"},{"id":"XXY","value":"XXY"},{"id":"XXZ","value":"XXZ"},{"id":"XYX","value":"XYX"},{"id":"XYY","value":"XYY"},{"id":"XYZ","value":"XYZ"},{"id":"XZX","value":"XZX"},{"id":"XZY","value":"XZY"},{"id":"XZZ","value":"XZZ"},{"id":"YXX","value":"YXX"},{"id":"YXY","value":"YXY"},{"id":"YXZ","value":"YXZ"},{"id":"YYX","value":"YYX"},{"id":"YYY","value":"YYY"},{"id":"YYZ","value":"YYZ"},{"id":"YZX","value":"YZX"},{"id":"YZY","value":"YZY"},{"id":"YZZ","value":"YZZ"},{"id":"ZXX","value":"ZXX"},{"id":"ZXY","value":"ZXY"},{"id":"ZXZ","value":"ZXZ"},{"id":"ZYX","value":"ZYX"},{"id":"ZYY","value":"ZYY"},{"id":"ZYZ","value":"ZYZ"},{"id":"ZZX","value":"ZZX"},{"id":"ZZY","value":"ZZY"},{"id":"ZZZ","value":"ZZZ"}],"dataSourceType":"segmentto","left":810,"idx":6},"rawValue":[{"value":"ZYY","label":"ZYY"}]}}'
        );
        component
            .setStateAsync({
                dataSet: [...data.slice(0, pageSize)],
                junk: junk
            })
            .then((rs) => {
                let r = component.getFilterResult([...data.slice(0, pageSize)]);
                expect(r).not.toBeNull();
            });
    });
});

test("Spreadsheet - globalSearch - onChange ", () => {
    act(() => {
        let component = ReactTestUtils.renderIntoDocument(
            <Spreadsheet {...props} columns={[...columns]} />
        );

        let inputElm = ReactTestUtils.scryRenderedDOMComponentsWithClass(
            component,
            "globalSeachInput"
        );
        console.log(inputElm);
        expect(inputElm).not.toBeNull();
    });
});

test("Spreadsheet - globalSearch - onChange ", () => {
    act(() => {
        let component = ReactTestUtils.renderIntoDocument(
            <Spreadsheet {...props} columns={[...columns]} />
        );

        let inputElm = ReactTestUtils.scryRenderedDOMComponentsWithClass(
            component,
            "globalSeachInput"
        );

        inputElm.simulate("change", { target: { value: "aa" } });
        //let d = inputElm.props.onChange({ target: { value: "aa" } });
        // inputElm.dispatchEvent(
        //     new MouseEvent("click", { target: { value: "aa" } })
        // );
        //inputElm.onChange({ target: { value: "aa" } });
        //ReactTestUtils.Simulate.onChange(inputElm, { target: { value: "aa" } });
        expect(inputElm).not.toBeNull();
    });
});

// //   console.log(componentttttt);

// // render(
// //           <Spreadsheet
// //               {...props}
// //               updateCellData={updateCellData}
// //               selectBulkData={selectBulkData}
// //               saveRows={saveRows}
// //           />,
// //           container
// //       );
//expect(wrapper).not.toBeNull();
//  screen.debug();

//const component = document.querySelector(".parentDiv");
// console.log(component);

// expect(component.innerHTML).toEqual("No Records found!");
//});

// // import React, { useState, useEffect } from "react";
// // import ReactDOM from "react-dom";
// // import PropTypes from "prop-types";
// // import { act } from "react-dom/test-utils";

// // import ReactTestUtils from "react-dom/test-utils";
// // import renderer from "react-test-renderer";
// // import Spreadsheet from "../../src/index";
// // import { applyFormula } from "../../src/utilities/utils";
// // import Sorting from "../../src/overlays/sorting/Sorting";
// // import ExportData from "../../src/overlays/export_data/ExportData";
// // import {
// //   faSortAmountDown,
// //   faColumns,
// //   // faSyncAlt,
// //   faShareAlt,
// //   // faAlignLeft,
// //   // faFilter,
// //   faSortDown,
// // } from "@fortawesome/free-solid-svg-icons";
// // import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// // const mockformula = [
// //   {
// //     draggable: true,
// //     editor: "text",
// //     filterRenderer: jest.fn(),
// //     filterType: "autoCompleteFilter",
// //     filterable: true,
// //     formulaApplicable: true,
// //     key: "revenue",
// //     name: "Revenue",
// //     resizable: true,
// //     sortable: true,
// //     width: 150,
// //   },
// //   {
// //     draggable: true,
// //     editor: "text",
// //     filterRenderer: jest.fn(),
// //     filterType: "autoCompleteFilter",
// //     filterable: true,
// //     formulaApplicable: true,
// //     key: "yeild",
// //     name: "Yeild",
// //     resizable: true,
// //     sortable: true,
// //     width: 150,
// //   },
// //   {
// //     draggable: true,
// //     editor: "text",
// //     filterRenderer: jest.fn(),
// //     filterType: "autoCompleteFilter",
// //     filterable: true,
// //     formulaApplicable: true,
// //     key: "weightvalue",
// //     name: "Weight Value",
// //     resizable: true,
// //     sortable: true,
// //     width: 150,
// //   },
// //   {
// //     draggable: true,
// //     editor: "text",
// //     filterRenderer: jest.fn(),
// //     filterType: "autoCompleteFilter",
// //     filterable: true,
// //     formulaApplicable: true,
// //     key: "volumepercentage",
// //     name: "Volume Percentage",
// //     resizable: true,
// //     sortable: true,
// //     width: 150,
// //   },
// // ];

// // const data = [
// //   {
// //     travelId: 0,
// //     flightno: "XX6576",
// //     date: "2015-05-01",
// //     segmentfrom: "ABC",
// //     segmentto: "ZYY",
// //     flightModel: 115,
// //     bodyType: "Small Body",
// //     type: "Car",
// //     startTime: "03:34 (A)",
// //     endTime: "03:05 (S)",
// //     status: "To Be Cancelled",
// //     additionalStatus: "",
// //     timeStatus: "04:58|hrs to depart",
// //     weightpercentage: "65%",
// //     weightvalue: "52098/20000 kg",
// //     volumepercentage: "32%",
// //     volumevalue: "33/60 cbm",
// //     uldposition1: "L4",
// //     uldvalue1: "6/1",
// //     uldposition2: "Q4",
// //     uldvalue2: "2/7",
// //     uldposition3: "L8",
// //     uldvalue3: "7/5",
// //     uldposition4: "Q8",
// //     uldvalue4: "3/2",
// //     revenue: "$60,485.33",
// //     yeild: "$6.28",
// //     sr: "52/ AWBs",
// //     queuedBookingSR: "23/ AWBs",
// //     queuedBookingvolume: "8023 kg / 35 cbm",
// //   },
// //   {
// //     travelId: 1,
// //     flightno: "XX5177",
// //     date: "2018-02-09",
// //     segmentfrom: "CCC",
// //     segmentto: "YXZ",
// //     flightModel: 197,
// //     bodyType: "Small Body",
// //     type: "Van",
// //     startTime: "01:23 (E)",
// //     endTime: "12:31 (E)",
// //     status: "Cancelled",
// //     additionalStatus: "Arrived",
// //     timeStatus: "12:57|hrs to depart",
// //     weightpercentage: "37%",
// //     weightvalue: "49689/20000 kg",
// //     volumepercentage: "47%",
// //     volumevalue: "49/60 cbm",
// //     uldposition1: "L3",
// //     uldvalue1: "1/1",
// //     uldposition2: "Q2",
// //     uldvalue2: "3/4",
// //     uldposition3: "L6",
// //     uldvalue3: "8/1",
// //     uldposition4: "Q6",
// //     uldvalue4: "4/2",
// //     revenue: "$62,830.60",
// //     yeild: "$8.39",
// //     sr: "34/ AWBs",
// //     queuedBookingSR: "75/ AWBs",
// //     queuedBookingvolume: "8893 kg / 43 cbm",
// //   },
// // ];

// // const gridHeight = "90vh";

// // let searchKey = "";

// // const maxLeftPinnedColumn = 5;
// // //Configure columns and its related featues such as editor(Text/DropDown), FormulaApplicable(True/False)
// // //Editable, Draggable, sortable, resizable, filterable, default width
// // const props = {
// //   columns: [
// //     {
// //       key: "flightno",
// //       name: "FlightNo",
// //       draggable: false,
// //       editor: "Text",
// //       formulaApplicable: false,
// //       sortable: true,
// //       resizable: true,
// //       filterable: true,
// //       width: 150,
// //       filterType: "autoCompleteFilter",
// //     },
// //     {
// //       key: "date",
// //       name: "Date",
// //       draggable: false,
// //       editor: "DatePicker",
// //       formulaApplicable: false,
// //       sortable: true,
// //       resizable: true,
// //       filterable: true,
// //       width: 150,
// //       filterType: "autoCompleteFilter",
// //     },
// //     {
// //       key: "segmentfrom",
// //       name: "Segment From",
// //       draggable: false,
// //       editor: "DropDown",
// //       formulaApplicable: false,
// //       sortable: true,
// //       resizable: true,
// //       filterable: true,
// //       width: 150,
// //       filterType: "autoCompleteFilter",
// //     },
// //     {
// //       key: "revenue",
// //       name: "Revenue",
// //       draggable: false,
// //       editor: "Text",
// //       formulaApplicable: true,
// //       sortable: true,
// //       resizable: true,
// //       filterable: true,
// //       width: 150,
// //       filterType: "autoCompleteFilter",
// //     },
// //     {
// //       key: "yeild",
// //       name: "Yeild",
// //       draggable: false,
// //       editor: "Text",
// //       formulaApplicable: true,
// //       sortable: true,
// //       resizable: true,
// //       filterable: true,
// //       width: 150,
// //       filterType: "autoCompleteFilter",
// //     },
// //   ],
// // };
// // const columns = [
// //   {
// //     key: "flightno",
// //     name: "FlightNo",
// //     draggable: false,
// //     editor: "Text",
// //     formulaApplicable: false,
// //     sortable: true,
// //     resizable: true,
// //     filterable: true,
// //     width: 150,
// //     filterType: "autoCompleteFilter",
// //   },
// //   {
// //     key: "date",
// //     name: "Date",
// //     draggable: false,
// //     editor: "DatePicker",
// //     formulaApplicable: false,
// //     sortable: true,
// //     resizable: true,
// //     filterable: true,
// //     width: 150,
// //     filterType: "autoCompleteFilter",
// //   },
// //   {
// //     key: "segmentfrom",
// //     name: "Segment From",
// //     draggable: false,
// //     editor: "DropDown",
// //     formulaApplicable: false,
// //     sortable: true,
// //     resizable: true,
// //     filterable: true,
// //     width: 150,
// //     filterType: "autoCompleteFilter",
// //   },
// //   {
// //     key: "revenue",
// //     name: "Revenue",
// //     draggable: false,
// //     editor: "Text",
// //     formulaApplicable: true,
// //     sortable: true,
// //     resizable: true,
// //     filterable: true,
// //     width: 150,
// //     filterType: "autoCompleteFilter",
// //   },
// //   {
// //     key: "yeild",
// //     name: "Yeild",
// //     draggable: false,
// //     editor: "Text",
// //     formulaApplicable: true,
// //     sortable: true,
// //     resizable: true,
// //     filterable: true,
// //     width: 150,
// //     filterType: "autoCompleteFilter",
// //   },
// //   {
// //     key: "segmentto",
// //     name: "Segment To",
// //     draggable: false,
// //     editor: "DropDown",
// //     formulaApplicable: false,
// //     sortable: true,
// //     resizable: true,
// //     filterable: true,
// //     width: 150,
// //     filterType: "autoCompleteFilter",
// //   },
// //   {
// //     key: "flightModel",
// //     name: "Flight Model",
// //     draggable: false,
// //     formulaApplicable: false,
// //     sortable: true,
// //     resizable: true,
// //     filterable: true,
// //     width: 150,
// //     filterType: "numeric",
// //   },
// //   {
// //     key: "bodyType",
// //     name: "Body Type",
// //     draggable: false,
// //     editor: "Text",
// //     formulaApplicable: false,
// //     sortable: true,
// //     resizable: true,
// //     filterable: true,
// //     width: 150,
// //     filterType: "autoCompleteFilter",
// //   },
// //   {
// //     key: "type",
// //     name: "Type",
// //     draggable: false,
// //     editor: "Text",
// //     formulaApplicable: false,
// //     sortable: true,
// //     resizable: true,
// //     filterable: true,
// //     width: 150,
// //     filterType: "autoCompleteFilter",
// //   },
// //   {
// //     key: "startTime",
// //     name: "Start Time",
// //     draggable: false,
// //     editor: "Text",
// //     formulaApplicable: false,
// //     sortable: true,
// //     resizable: true,
// //     filterable: true,
// //     width: 150,
// //     filterType: "autoCompleteFilter",
// //   },
// //   {
// //     key: "endTime",
// //     name: "End Time",
// //     draggable: false,
// //     editor: "Text",
// //     formulaApplicable: false,
// //     sortable: true,
// //     resizable: true,
// //     filterable: true,
// //     width: 150,
// //     filterType: "autoCompleteFilter",
// //   },
// //   {
// //     key: "status",
// //     name: "Status",
// //     draggable: false,
// //     editor: "Text",
// //     formulaApplicable: false,
// //     sortable: true,
// //     resizable: true,
// //     filterable: true,
// //     width: 150,
// //     filterType: "autoCompleteFilter",
// //   },
// //   {
// //     key: "additionalStatus",
// //     name: "Additional Status",
// //     draggable: false,
// //     editor: "Text",
// //     formulaApplicable: false,
// //     sortable: true,
// //     resizable: true,
// //     filterable: true,
// //     width: 150,
// //     filterType: "autoCompleteFilter",
// //   },
// //   {
// //     key: "timeStatus",
// //     name: "Time Status",
// //     draggable: false,
// //     editor: "Text",
// //     formulaApplicable: false,
// //     sortable: true,
// //     resizable: true,
// //     filterable: true,
// //     width: 150,
// //     filterType: "autoCompleteFilter",
// //   },
// //   {
// //     key: "weightpercentage",
// //     name: "Weight Percentage",
// //     draggable: false,
// //     editor: "Text",
// //     formulaApplicable: false,
// //     sortable: true,
// //     resizable: true,
// //     filterable: true,
// //     width: 150,
// //     filterType: "autoCompleteFilter",
// //   },
// //   {
// //     key: "weightvalue",
// //     name: "Weight Value",
// //     draggable: false,
// //     editor: "Text",
// //     formulaApplicable: true,
// //     sortable: true,
// //     resizable: true,
// //     filterable: true,
// //     width: 150,
// //     filterType: "autoCompleteFilter",
// //   },
// //   {
// //     key: "volumepercentage",
// //     name: "Volume Percentage",
// //     draggable: false,
// //     editor: "Text",
// //     formulaApplicable: true,
// //     sortable: true,
// //     resizable: true,
// //     filterable: true,
// //     width: 150,
// //     filterType: "autoCompleteFilter",
// //   },
// //   {
// //     key: "volumevalue",
// //     name: "Volume Value",
// //     draggable: false,
// //     editor: "Text",
// //     formulaApplicable: false,
// //     sortable: true,
// //     resizable: true,
// //     filterable: true,
// //     width: 150,
// //     filterType: "autoCompleteFilter",
// //   },
// //   {
// //     key: "uldposition1",
// //     name: "uldposition1",
// //     draggable: false,
// //     editor: "Text",
// //     formulaApplicable: false,
// //     sortable: true,
// //     resizable: true,
// //     filterable: true,
// //     width: 150,
// //     filterType: "autoCompleteFilter",
// //   },
// //   {
// //     key: "uldvalue1",
// //     name: "uldvalue1",
// //     draggable: false,
// //     editor: "Text",
// //     formulaApplicable: false,
// //     sortable: true,
// //     resizable: true,
// //     filterable: true,
// //     width: 150,
// //     filterType: "autoCompleteFilter",
// //   },
// //   {
// //     key: "uldposition2",
// //     name: "uldposition2",
// //     draggable: false,
// //     editor: "Text",
// //     formulaApplicable: false,
// //     sortable: true,
// //     resizable: true,
// //     filterable: true,
// //     width: 150,
// //     filterType: "autoCompleteFilter",
// //   },
// //   {
// //     key: "uldvalue2",
// //     name: "uldvalue2",
// //     draggable: false,
// //     editor: "Text",
// //     formulaApplicable: false,
// //     sortable: true,
// //     resizable: true,
// //     filterable: true,
// //     width: 150,
// //     filterType: "autoCompleteFilter",
// //   },
// //   {
// //     key: "uldposition3",
// //     name: "uldposition3",
// //     draggable: false,
// //     editor: "Text",
// //     formulaApplicable: false,
// //     sortable: true,
// //     resizable: true,
// //     filterable: true,
// //     width: 150,
// //     filterType: "autoCompleteFilter",
// //   },
// // ];

// // const airportCodeList = [
// //   "AAA",
// //   "AAB",
// //   "AAC",
// //   "ABA",
// //   "ABB",
// //   "ABC",
// //   "ACA",
// //   "ACB",
// //   "ACC",
// //   "BAA",
// //   "BAB",
// //   "BAC",
// //   "BBA",
// // ];

// // const setStatus = jest.fn();
// // const setData = jest.fn();

// // // const [status, setStatus] = useState("");

// // const closeWarningStatus = () => {
// //   setStatus("");
// //   setData(data);
// // };

// // const handleWarningStatus = () => {
// //   setStatus("invalid");
// // };

// // describe("DataSheet component", () => {
// //   HTMLCanvasElement.prototype.getContext = () => {
// //     // return whatever getContext has to return
// //   };
// //   const swapSortList = [
// //     {
// //       key: "flightno",
// //       name: "FlightNo",
// //       draggable: false,
// //       editor: "Text",
// //       formulaApplicable: false,
// //       sortable: true,
// //       resizable: true,
// //       filterable: true,
// //       width: 150,
// //       filterType: "autoCompleteFilter",
// //     },
// //     {
// //       key: "date",
// //       name: "Date",
// //       draggable: false,
// //       editor: "DatePicker",
// //       formulaApplicable: false,
// //       sortable: true,
// //       resizable: true,
// //       filterable: true,
// //       width: 150,
// //       filterType: "autoCompleteFilter",
// //     },
// //   ];
// //   const swapList = [
// //     {
// //       key: "flightno",
// //       name: "FlightNo",
// //       draggable: false,
// //       editor: "Text",
// //       formulaApplicable: false,
// //       sortable: true,
// //       resizable: true,
// //       filterable: true,
// //       width: 150,
// //       filterType: "autoCompleteFilter",
// //     },
// //     {
// //       key: "date",
// //       name: "Date",
// //       draggable: false,
// //       editor: "DatePicker",
// //       formulaApplicable: false,
// //       sortable: true,
// //       resizable: true,
// //       filterable: true,
// //       width: 150,
// //       filterType: "autoCompleteFilter",
// //     },
// //   ];
// //   const wrapper = shallow(
// //     <Spreadsheet
// //       rows={data}
// //       columns={columns}
// //       closeWarningStatus={closeWarningStatus}
// //       airportCodes={airportCodeList}
// //       swapSortList={swapSortList}
// //       swapList={swapList}
// //       props={props}
// //     />
// //   );
// //   // afterEach(() => {
// //   //   wrapper.instance().removeAllListeners()
// //   //   if (customWrapper) {
// //   //     if ('removeAllListeners' in customWrapper.instance()) {
// //   //       customWrapper.instance().removeAllListeners()
// //   //     }
// //   //     customWrapper = null
// //   //   }
// //   // })

// //   it("renders without crashing", () => {
// //     const div = document.createElement("div");
// //     ReactDOM.render(
// //       <Spreadsheet
// //         rows={data}
// //         columns={columns}
// //         closeWarningStatus={closeWarningStatus}
// //         airportCodes={airportCodeList}
// //       />,
// //       div
// //     );
// //     ReactDOM.unmountComponentAtNode(div);
// //   });

// //   describe("<Spreadsheet />", () => {
// //     it("mount", () => {
// //       const wrapper = mount(
// //         <Spreadsheet
// //           rows={data}
// //           columns={columns}
// //           closeWarningStatus={closeWarningStatus}
// //           airportCodes={airportCodeList}
// //         />
// //       );
// //       expect(wrapper).not.toBeNull();
// //     });
// //   });

// //   describe("check error message called", () => {
// //     it("mount", () => {
// //       const mockClearSearchValue = jest.fn();
// //       const wrapper = mount(
// //         <Spreadsheet
// //           rows={data}
// //           columns={columns}
// //           closeWarningStatus={closeWarningStatus}
// //           airportCodes={airportCodeList}
// //         />
// //       );
// //       wrapper.find("ErrorMessage").props().closeWarningStatus();
// //       expect(wrapper).not.toBeNull();
// //       wrapper.find("ErrorMessage").props().clearSearchValue();
// //       expect(wrapper).not.toBeNull();
// //     });
// //   });

// //   describe("check Form Control ", () => {
// //     it("mount", () => {
// //       const globalSearchLogic = jest.fn();

// //       const mockedEvent = { target: {} };
// //       const wrapper = mount(
// //         <Spreadsheet
// //           rows={data}
// //           columns={columns}
// //           closeWarningStatus={closeWarningStatus}
// //           globalSearchLogic={globalSearchLogic}
// //           airportCodes={airportCodeList}
// //         />
// //       );
// //       const modal = wrapper.find("FormControl").props().onChange(mockedEvent);
// //       expect(globalSearchLogic).toHaveBeenCalledTimes(1);
// //     });
// //   });

// //   // const setup = propOverrides => {
// //   //   const props = Object.assign({ leftBtn: MOCK_LEFT, rightBtn: MOCK_RIGHT }, propOverrides);
// //   //   const wrapper = shallow(<Spreadsheet rows={data} columns={columns} closeWarningStatus={closeWarningStatus} airportCodes={airportCodeList}  {...props} />);
// //   //   return wrapper;
// //   // };

// //   describe("check Font Awesome Icon click ", () => {
// //     it("mount", () => {
// //       const exportColumnData = jest.fn();
// //       const wrapper = mount(
// //         <FontAwesomeIcon
// //           title="Export"
// //           icon={faShareAlt}
// //           onClick={exportColumnData}
// //         />
// //       );
// //       const modal = wrapper.props().onClick();
// //       expect(exportColumnData).not.toBeNull();
// //     });
// //   });

// //   describe("check Export Data ", () => {
// //     it("shallow", () => {
// //       const exportComponent = null;
// //       const closeExport = jest.fn();
// //       const wrapper = shallow(
// //         <ExportData
// //           rows={data}
// //           columnsList={columns}
// //           closeExport={closeExport}
// //         />
// //       );
// //       const modal = wrapper.props();
// //       expect(closeExport).not.toBeNull();
// //     });
// //   });

// //   describe("check Sorting Panel ", () => {
// //     it("mount", () => {
// //       const sortingParamsObjectList = [
// //         { sortBy: "FlightNo", order: "Ascending", sortOn: "Value" },
// //       ];

// //       const state = {
// //         sortingParamsObjectList,
// //       };
// //       const sortingOrderList = sortingParamsObjectList;
// //       const setTableAsPerSortingParams = jest.fn();
// //       const handleTableSortSwap = jest.fn();
// //       const closeSorting = jest.fn();
// //       const clearAllSortingParams = jest.fn();
// //       const columnField = [];
// //       columns.map((item) => columnField.push(item.name));
// //       act((sortingOrderList) => {
// //         const wrapper = mount(
// //           <Sorting
// //             setTableAsPerSortingParams={setTableAsPerSortingParams}
// //             sortingParamsObjectList={sortingParamsObjectList}
// //             sortingOrderList={sortingParamsObjectList}
// //             handleTableSortSwap={handleTableSortSwap}
// //             clearAllSortingParams={clearAllSortingParams}
// //             columnFieldValue={columnField}
// //             closeSorting={closeSorting}
// //           />
// //         );
// //         const modal = wrapper
// //           .props()
// //           .setTableAsPerSortingParams(sortingParamsObjectList);
// //         expect(setTableAsPerSortingParams).not.toBeNull();
// //         const modal1 = wrapper
// //           .props()
// //           .handleTableSortSwap(sortingParamsObjectList);
// //         expect(handleTableSortSwap).not.toBeNull();
// //         const modal2 = wrapper.props().closeSorting(sortingParamsObjectList);
// //         expect(closeSorting).not.toBeNull();
// //       });
// //     });
// //   });

// //   describe("check Datagrid ", () => {
// //     it("mount", () => {
// //       const datagidfn = jest.fn();
// //       const junk = columns;
// //       const filtercol = {};
// //       const mockedEvent = { target: {} };
// //       const filtermock = {
// //         filterTerm: { value: "Wide Body", label: "Wide Body" },
// //         column: { key: "bodyType" },
// //       };
// //       const searchKey = "";
// //       const globalSearchLogic = jest.fn();
// //       const updateCellData = jest.fn();
// //       const selectBulkData = jest.fn();
// //       const length = 2;
// //       const maxLeftPinnedColumn = 5;

// //       const songLinkProps = {
// //         columns,
// //       };

// //       const status = "";

// //       const wrapper = mount(
// //         <Spreadsheet
// //           rows={data}
// //           columns={columns}
// //           junk={junk}
// //           closeWarningStatus={closeWarningStatus}
// //           airportCodes={airportCodeList}
// //           textValue={searchKey}
// //           globalSearchLogic={globalSearchLogic}
// //           status={status}
// //           closeWarningStatus={closeWarningStatus}
// //           handleWarningStatus={handleWarningStatus}
// //           count={length}
// //           gridHeight={gridHeight}
// //           updateCellData={updateCellData}
// //           selectBulkData={selectBulkData}
// //           maxLeftPinnedColumn={maxLeftPinnedColumn}
// //           {...songLinkProps}
// //         />
// //       );
// //       const getValidFilterValues = wrapper
// //         .find("ReactDataGrid")
// //         .props()
// //         .getValidFilterValues(columns[0].key);
// //       expect(getValidFilterValues).not.toBeNull();
// //       // const onRowsSelected = wrapper.find('ReactDataGrid').rowSelection;
// //       // const onRowsSelected = wrapper.find('ReactDataGrid');
// //       // console.log('ddddd')
// //       // console.log(...onRowsSelected)
// //       // expect(onRowsSelected).not.toBeNull();
// //       const onGridSort = wrapper
// //         .find("ReactDataGrid")
// //         .props()
// //         .onGridSort("flightno", "DESC");
// //       expect(onGridSort).not.toBeNull();
// //       const rowGetter = wrapper.find("ReactDataGrid").props().rowGetter(0);
// //       expect(rowGetter).not.toBeNull();
// //       const onColumnResize = wrapper
// //         .find("ReactDataGrid")
// //         .props()
// //         .onColumnResize(0, 100);
// //       expect(onColumnResize).not.toBeNull();
// //       const onAddFilter = wrapper
// //         .find("ReactDataGrid")
// //         .props()
// //         .onAddFilter(filtermock);
// //       expect(onAddFilter).not.toBeNull();
// //       const onClearFilters = wrapper
// //         .find("ReactDataGrid")
// //         .props()
// //         .onClearFilters();
// //       expect(onClearFilters).not.toBeNull();
// //     });
// //   });

// //   describe("On Grid Row updated ", () => {
// //     it("mount", () => {
// //       const datagidfn = jest.fn();
// //       const junk = columns;
// //       const filtercol = {};
// //       const mockedEvent = { target: {} };
// //       const songLinkProps = {
// //         columnns: columns,
// //       };
// //       const searchKey = "";
// //       const onRowsSelectedfn = jest.fn();
// //       const updateCellData = jest.fn();
// //       const selectBulkData = jest.fn();
// //       const length = 2;
// //       const maxLeftPinnedColumn = 5;
// //       const status = "";
// //       const wrapper = shallow(
// //         <Spreadsheet
// //           rows={data}
// //           columns={columns}
// //           junk={junk}
// //           closeWarningStatus={closeWarningStatus}
// //           airportCodes={airportCodeList}
// //           textValue={searchKey}
// //           onRowsSelected={onRowsSelectedfn}
// //           status={status}
// //           closeWarningStatus={closeWarningStatus}
// //           handleWarningStatus={handleWarningStatus}
// //           count={length}
// //           gridHeight={gridHeight}
// //           updateCellData={updateCellData}
// //           selectBulkData={selectBulkData}
// //           maxLeftPinnedColumn={maxLeftPinnedColumn}
// //         />
// //       );

// //       const onGridRowsUpdated = wrapper
// //         .find("ReactDataGrid")
// //         .props()
// //         .onGridRowsUpdated({
// //           fromRow: 0,
// //           toRow: 0,
// //           updated: { flightno: "dss55555" },
// //           action: "CELL_UPDATE",
// //         });
// //       // console.log(...onGridRowsUpdated)
// //       expect(onGridRowsUpdated).not.toBeNull();
// //     });
// //   });

// //   describe("On Row selected ", () => {
// //     it("mount", () => {
// //       const datagidfn = jest.fn();
// //       const junk = columns;
// //       const filtercol = {};
// //       const mockedEvent = { target: {} };

// //       const param = [
// //         {
// //           additionalStatus: "Arrived",
// //           bodyType: "Narrow Body",
// //           date: "21-Oct-2018",
// //           endTime: "09:00 (E)",
// //           flightModel: 520,
// //           flightno: "XX1001",
// //           queuedBookingSR: "36/ AWBs",
// //           queuedBookingvolume: "5875 kg / 24 cbm",
// //           revenue: "$51,490.42",
// //           segmentfrom: "CCB",
// //           segmentto: "XXY",
// //           sr: "72/ AWBs",
// //           startTime: "10:33 (E)",
// //           status: "Cancelled",
// //           timeStatus: "03:10|hrs to depart",
// //           travelId: 8945,
// //           type: "Truck",
// //           uldposition1: "L3",
// //           uldposition2: "Q2",
// //           uldposition3: "L6",
// //           uldposition4: "Q5",
// //           uldvalue1: "1/1",
// //           uldvalue2: "5/1",
// //           uldvalue3: "4/2",
// //           uldvalue4: "3/8",
// //           volumepercentage: "53%",
// //           volumevalue: "49/60 cbm",
// //           weightpercentage: "71%",
// //           weightvalue: "59565/20000 kg",
// //           yeild: "$3.54",

// //           rowIdx: 0,
// //         },
// //       ];

// //       const searchKey = "";
// //       const onRowsSelectedfn = jest.fn();
// //       const onRowsDeselectedfn = jest.fn();
// //       const updateCellData = jest.fn();
// //       const selectBulkData = jest.fn();
// //       const length = 2;
// //       const maxLeftPinnedColumn = 5;
// //       const status = "";
// //       const wrapper = mount(
// //         <Spreadsheet
// //           rows={data}
// //           columns={columns}
// //           junk={junk}
// //           closeWarningStatus={closeWarningStatus}
// //           airportCodes={airportCodeList}
// //           textValue={searchKey}
// //           onRowsSelected={onRowsSelectedfn}
// //           onRowsDeselected={onRowsDeselectedfn}
// //           status={status}
// //           closeWarningStatus={closeWarningStatus}
// //           handleWarningStatus={handleWarningStatus}
// //           count={length}
// //           gridHeight={gridHeight}
// //           updateCellData={updateCellData}
// //           selectBulkData={selectBulkData}
// //           maxLeftPinnedColumn={maxLeftPinnedColumn}
// //         />
// //       );
// //       const onRowsSelected = wrapper
// //         .find("ReactDataGrid")
// //         .props()
// //         .rowSelection.onRowsSelected(param);
// //       expect(onRowsSelectedfn).not.toBeNull();
// //       const onRowsDeselected = wrapper
// //         .find("ReactDataGrid")
// //         .props()
// //         .rowSelection.onRowsDeselected(param);
// //       expect(onRowsDeselected).not.toBeNull();
// //     });
// //   });

// //   describe("check sorting panel click ", () => {
// //     test("onClick is called when button is clicked", () => {
// //       const searchKey = "";
// //       const globalSearchLogic = jest.fn();
// //       const sortingPanel = jest.fn();
// //       const columnReorderingPannel = jest.fn();
// //       const updateCellData = jest.fn();
// //       const selectBulkData = jest.fn();
// //       const length = 2;
// //       const maxLeftPinnedColumn = 5;
// //       const status = "";
// //       // act(() => {
// //       const onClick = jest.fn();

// //       let tree = mount(
// //         <Spreadsheet
// //           rows={[...data]}
// //           columns={columns}
// //           airportCodes={airportCodeList}
// //           textValue={searchKey}
// //           globalSearchLogic={globalSearchLogic}
// //           status={status}
// //           closeWarningStatus={closeWarningStatus}
// //           handleWarningStatus={handleWarningStatus}
// //           count={length}
// //           gridHeight={gridHeight}
// //           updateCellData={updateCellData}
// //           selectBulkData={selectBulkData}
// //           maxLeftPinnedColumn={maxLeftPinnedColumn}
// //         />
// //       );

// //       const button = tree.find(".filterIcons").at(0).props().onClick();
// //       // expect(button.length).toBe(1);
// //       expect(sortingPanel).not.toBeNull();
// //       const button2 = tree.find(".filterIcons").at(1).props().onClick();
// //       // expect(button.length).toBe(1);
// //       expect(columnReorderingPannel).not.toBeNull();
// //       // });
// //       wrapper.instance().exportColumnData();
// //       wrapper.instance().closeSorting();
// //       wrapper.instance().clearAllSortingParams();
// //       wrapper.instance().closeExport();
// //       wrapper.instance().setTableAsPerSortingParams([{ sortBy: "type" }]);
// //       wrapper.instance().array_move(["element1", "element2"], 0, 4);
// //     });
// //     test("handleTableSortSwap", () => {
// //       wrapper.instance().handleTableSortSwap([
// //         {
// //           key: "flightno",
// //           name: "FlightNo",
// //           draggable: false,
// //           editor: "Text",
// //           formulaApplicable: false,
// //           sortable: true,
// //           resizable: true,
// //           filterable: true,
// //           width: 150,
// //           filterType: "autoCompleteFilter",
// //         },
// //         {
// //           key: "date",
// //           name: "Date",
// //           draggable: false,
// //           editor: "DatePicker",
// //           formulaApplicable: false,
// //           sortable: true,
// //           resizable: true,
// //           filterable: true,
// //           width: 150,
// //           filterType: "autoCompleteFilter",
// //         },
// //       ]);
// //       expect(swapSortList).toStrictEqual([
// //         {
// //           key: "flightno",
// //           name: "FlightNo",
// //           draggable: false,
// //           editor: "Text",
// //           formulaApplicable: false,
// //           sortable: true,
// //           resizable: true,
// //           filterable: true,
// //           width: 150,
// //           filterType: "autoCompleteFilter",
// //         },
// //         {
// //           key: "date",
// //           name: "Date",
// //           draggable: false,
// //           editor: "DatePicker",
// //           formulaApplicable: false,
// //           sortable: true,
// //           resizable: true,
// //           filterable: true,
// //           width: 150,
// //           filterType: "autoCompleteFilter",
// //         },
// //       ]);
// //       expect(props.columns).toStrictEqual([
// //         {
// //           key: "flightno",
// //           name: "FlightNo",
// //           draggable: false,
// //           editor: "Text",
// //           formulaApplicable: false,
// //           sortable: true,
// //           resizable: true,
// //           filterable: true,
// //           width: 150,
// //           filterType: "autoCompleteFilter",
// //         },
// //         {
// //           key: "date",
// //           name: "Date",
// //           draggable: false,
// //           editor: "DatePicker",
// //           formulaApplicable: false,
// //           sortable: true,
// //           resizable: true,
// //           filterable: true,
// //           width: 150,
// //           filterType: "autoCompleteFilter",
// //         },
// //         {
// //           key: "segmentfrom",
// //           name: "Segment From",
// //           draggable: false,
// //           editor: "DropDown",
// //           formulaApplicable: false,
// //           sortable: true,
// //           resizable: true,
// //           filterable: true,
// //           width: 150,
// //           filterType: "autoCompleteFilter",
// //         },
// //         {
// //           key: "revenue",
// //           name: "Revenue",
// //           draggable: false,
// //           editor: "Text",
// //           formulaApplicable: true,
// //           sortable: true,
// //           resizable: true,
// //           filterable: true,
// //           width: 150,
// //           filterType: "autoCompleteFilter",
// //         },
// //         {
// //           key: "yeild",
// //           name: "Yeild",
// //           draggable: false,
// //           editor: "Text",
// //           formulaApplicable: true,
// //           sortable: true,
// //           resizable: true,
// //           filterable: true,
// //           width: 150,
// //           filterType: "autoCompleteFilter",
// //         },
// //       ]);
// //       wrapper
// //         .instance()
// //         .updateTableAsPerRowChooser(
// //           ["FlightNo", "Date", "Segment From"],
// //           ["FlightNo", "Date"]
// //         );
// //     });
// //     test("handleWarningStatus ", () => {
// //       wrapper.instance().handleWarningStatus();
// //     });
// //     test("closeColumnReOrdering", () => {
// //       wrapper.instance().closeColumnReOrdering();
// //     });
// //     test("handleheaderNameList", () => {
// //       wrapper.instance().handleheaderNameList();
// //     });
// //     test("sortRows", () => {
// //       wrapper.instance().sortRows(
// //         [
// //           {
// //             key: "flightno",
// //             name: "FlightNo",
// //             draggable: false,
// //             editor: "Text",
// //             formulaApplicable: false,
// //             sortable: true,
// //             resizable: true,
// //             filterable: true,
// //             width: 150,
// //             filterType: "autoCompleteFilter",
// //           },
// //           {
// //             key: "date",
// //             name: "Date",
// //             draggable: false,
// //             editor: "DatePicker",
// //             formulaApplicable: false,
// //             sortable: true,
// //             resizable: true,
// //             filterable: true,
// //             width: 150,
// //             filterType: "autoCompleteFilter",
// //           },
// //         ],
// //         "Date",
// //         "ASC"
// //       );
// //     });
// //     test("getrows", () => {
// //       wrapper.instance().sortRows(
// //         [
// //           {
// //             key: "flightno",
// //             name: "FlightNo",
// //             draggable: false,
// //             editor: "Text",
// //             formulaApplicable: false,
// //             sortable: true,
// //             resizable: true,
// //             filterable: true,
// //             width: 150,
// //             filterType: "autoCompleteFilter",
// //           },
// //           {
// //             key: "date",
// //             name: "Date",
// //             draggable: false,
// //             editor: "DatePicker",
// //             formulaApplicable: false,
// //             sortable: true,
// //             resizable: true,
// //             filterable: true,
// //             width: 150,
// //             filterType: "autoCompleteFilter",
// //           },
// //         ],
// //         []
// //       );
// //     });
// //     test("sortingDiv", () => {
// //       const mockCallBack = jest.fn();
// //       const mockFunc = jest.fn();
// //       const component = shallow(
// //         <Sorting
// //           setTableAsPerSortingParams={mockCallBack}
// //           sortingParamsObjectList={[]}
// //           handleTableSortSwap={[]}
// //           clearAllSortingParams={[]}
// //           columnFieldValue={[]}
// //           closeSorting={mockFunc}
// //         />
// //       );
// //       expect(component).toMatchSnapshot();
// //     });
// //     test("toCamelCase", () => {
// //       wrapper.instance().toCamelCase("something");
// //     });
// //     test("sort_by", () => {
// //       wrapper.instance().sort_by();
// //     });
// //   });
// // });
