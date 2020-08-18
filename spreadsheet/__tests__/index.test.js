/* eslint-disable no-undef */

import React from "react";
import ReactTestUtils, { act } from "react-dom/test-utils";
import Spreadsheet from "../src/index";
import "@testing-library/jest-dom/extend-expect";
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
        filterType: "autoCompleteFilter",
        dataSource: []
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

const pageSize = 10;

let container;

beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
});

afterEach(() => {
    document.body.removeChild(container);
    container = null;
});

const updateCellData = jest.fn();
const selectBulkData = jest.fn();
const saveRows = jest.fn();
let props = {
    rows: [...data.slice(0, pageSize)],
    dataSet: [...data],
    pageSize,
    count: pageSize,
    columns: [...columns],
    gridHeight: "90vh",
    maxLeftPinnedColumn: 3,
    updateCellData,
    selectBulkData,
    saveRows,
    updatedRows: jest.fn()
};

test("<Spreadsheet />", () => {
    act(() => {
        const component = ReactTestUtils.renderIntoDocument(
            <Spreadsheet {...props} />
        );
        expect(component).not.toBeNull();
    });
});
test("Spreadsheet - setStateAsync", () => {
    act(() => {
        const component = ReactTestUtils.renderIntoDocument(
            <Spreadsheet {...props} />
        );
        component.setStateAsync({ rows: [...data.slice(0, 5)] }).then((d) => {
            expect(d).not.toBeNull();
        });
    });
});
test("Spreadsheet - UNSAFE_componentWillReceiveProps", () => {
    act(() => {
        const component = ReactTestUtils.renderIntoDocument(
            <Spreadsheet {...props} />
        );
        const d = component.UNSAFE_componentWillReceiveProps(props);
        expect(d).not.toBeNull();
    });
});
test("Spreadsheet - getValidFilterValues", () => {
    act(() => {
        const component = ReactTestUtils.renderIntoDocument(
            <Spreadsheet {...props} />
        );
        const d = component.getValidFilterValues(data.slice(0, 5), "flightno");
        expect(d).not.toBeNull();
    });
});

test("Spreadsheet - handleTableSortSwap", () => {
    act(() => {
        const component = ReactTestUtils.renderIntoDocument(
            <Spreadsheet {...props} />
        );
        const d = component.handleTableSortSwap([]);
        expect(d).not.toBeNull();
    });
});

test("Spreadsheet - updateTableAsPerRowChooser", () => {
    props = {
        rows: [...data.slice(0, pageSize)],
        dataSet: [...data],
        pageSize,
        count: pageSize,
        gridHeight: "90vh",
        maxLeftPinnedColumn: 3,
        updateCellData,
        selectBulkData,
        saveRows
    };
    act(() => {
        const colVal = [...columns];
        colVal[0].frozen = true;
        const incoming = ["FlightNo", "Date", "Segment From"];
        const pinned = ["FlightNo"];
        const component = ReactTestUtils.renderIntoDocument(
            <Spreadsheet {...props} columns={[...colVal]} />
        );

        const d = component.updateTableAsPerRowChooser(incoming, pinned);
        expect(d).not.toBeNull();
    });
});

test("Spreadsheet - updateTableAsPerRowChooser 2", () => {
    act(() => {
        const colVal = [...columns];
        colVal[0].frozen = true;
        const incoming = ["FlightNo", "Date", "Segment From"];
        const pinned = ["FlightNo", "Date"];
        const component = ReactTestUtils.renderIntoDocument(
            <Spreadsheet {...props} columns={[...colVal]} />
        );

        component.handleheaderNameList(columns.slice(0, 1).reverse());
        const d = component.updateTableAsPerRowChooser(incoming, pinned);
        expect(d).not.toBeNull();
    });
});

test("Spreadsheet - columnReorderingPannel", () => {
    act(() => {
        const component = ReactTestUtils.renderIntoDocument(
            <Spreadsheet {...props} columns={[...columns]} />
        );

        const d = component.columnReorderingPannel();
        expect(d).not.toBeNull();
    });
});

test("Spreadsheet - closeColumnReOrdering ", () => {
    act(() => {
        const component = ReactTestUtils.renderIntoDocument(
            <Spreadsheet {...props} columns={[...columns]} />
        );

        const d = component.closeColumnReOrdering();
        expect(d).not.toBeNull();
    });
});

test("Spreadsheet - handleSearchValue ", () => {
    act(() => {
        const component = ReactTestUtils.renderIntoDocument(
            <Spreadsheet {...props} columns={[...columns]} />
        );

        const d = component.handleSearchValue("test");
        expect(d).not.toBeNull();
    });
});

test("Spreadsheet - clearSearchValue  ", () => {
    act(() => {
        const component = ReactTestUtils.renderIntoDocument(
            <Spreadsheet {...props} columns={[...columns]} />
        );

        const d = component.clearSearchValue();
        expect(d).not.toBeNull();
    });
});

test("Spreadsheet - sortingPanel  ", () => {
    act(() => {
        const component = ReactTestUtils.renderIntoDocument(
            <Spreadsheet {...props} columns={[...columns]} />
        );

        const d = component.sortingPanel();
        expect(d).not.toBeNull();
    });
});

test("Spreadsheet - closeSorting  ", () => {
    act(() => {
        const component = ReactTestUtils.renderIntoDocument(
            <Spreadsheet {...props} columns={[...columns]} />
        );

        const d = component.closeSorting();
        expect(d).not.toBeNull();
    });
});

test("Spreadsheet - clearAllSortingParams  ", () => {
    act(() => {
        const component = ReactTestUtils.renderIntoDocument(
            <Spreadsheet {...props} columns={[...columns]} />
        );
        component
            .setStateAsync({
                dataSet: [...data.slice(0, pageSize)],
                searchValue: "AAA",
                sortDirection: "ASC",
                sortColumn: "Date"
            })
            .then(() => {
                const d = component.clearAllSortingParams();
                expect(d).not.toBeNull();
            });
    });
});

test("Spreadsheet - exportColumnData  ", () => {
    act(() => {
        const component = ReactTestUtils.renderIntoDocument(
            <Spreadsheet {...props} columns={[...columns]} />
        );
        component
            .setStateAsync({
                subDataSet: [...data.slice(0, 5)],
                searchValue: "AAA"
            })
            .then(() => {
                const d = component.exportColumnData();
                expect(d).not.toBeNull();
            });
    });
});

test("Spreadsheet - closeExport", () => {
    act(() => {
        const component = ReactTestUtils.renderIntoDocument(
            <Spreadsheet {...props} columns={[...columns]} />
        );

        const d = component.closeExport();
        expect(d).not.toBeNull();
    });
});

test("Spreadsheet - setTableAsPerSortingParams", () => {
    act(() => {
        const component = ReactTestUtils.renderIntoDocument(
            <Spreadsheet {...props} columns={[...columns]} />
        );
        component.handleTableSortSwap([1, 0]);
        component
            .setStateAsync({
                subDataSet: [...data.slice(0, pageSize)],
                searchValue: "AAA",
                sortingOrderSwapList: []
            })
            .then(() => {
                const d = component.setTableAsPerSortingParams([
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
        const component = ReactTestUtils.renderIntoDocument(
            <Spreadsheet {...props} columns={[...columns]} />
        );
        component.handleTableSortSwap([1, 0]);
        component
            .setStateAsync({
                subDataSet: [...data.slice(0, pageSize)],
                searchValue: "AAA",
                sortingOrderSwapList: []
            })
            .then(() => {
                const d = component.groupSort(
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
        const component = ReactTestUtils.renderIntoDocument(
            <Spreadsheet {...props} columns={[...columns]} />
        );
        component.handleTableSortSwap([1, 0]);
        component
            .setStateAsync({
                dataSet: [...data.slice(0, pageSize)],
                searchValue: ""
            })
            .then(() => {
                const d = component.getSearchRecords({
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
        const component = ReactTestUtils.renderIntoDocument(
            <Spreadsheet {...props} columns={[...columns]} />
        );
        component.handleTableSortSwap([1, 0]);
        component
            .setStateAsync({
                subDataSet: [...data.slice(0, pageSize)],
                searchValue: "AA"
            })
            .then(() => {
                const d = component.getSearchRecords({
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
        const component = ReactTestUtils.renderIntoDocument(
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
            .then(() => {
                const d = component.getSearchRecords({
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
        const component = ReactTestUtils.renderIntoDocument(
            <Spreadsheet {...props} columns={[...columns]} />
        );
        component.handleTableSortSwap([1, 0]);
        component
            .setStateAsync({
                dataSet: [...data.slice(0, pageSize)],
                searchValue: "a"
            })
            .then(() => {
                const d = component.getSearchRecords({
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
        const component = ReactTestUtils.renderIntoDocument(
            <Spreadsheet {...props} columns={[...columns]} />
        );
        component.handleTableSortSwap([1, 0]);
        component
            .setStateAsync({
                dataSet: [...data.slice(0, pageSize)],
                sortDirection: "DESC",
                sortColumn: "FlightNo"
            })
            .then(() => {
                const d = component.getSingleSortResult([
                    ...data.slice(0, pageSize)
                ]);
                expect(d).not.toBeNull();
            });
    });
});
test("Spreadsheet - getSingleSortResult 1", () => {
    act(() => {
        const component = ReactTestUtils.renderIntoDocument(
            <Spreadsheet {...props} columns={[...columns]} />
        );
        component.handleTableSortSwap([1, 0]);
        component
            .setStateAsync({
                dataSet: [...data.slice(0, pageSize)],
                sortDirection: "test",
                sortColumn: "FlightNo"
            })
            .then(() => {
                const d = component.getSingleSortResult([
                    ...data.slice(0, pageSize)
                ]);
                expect(d).not.toBeNull();
            });
    });
});

test("Spreadsheet - getSingleSortResult 2", () => {
    act(() => {
        const component = ReactTestUtils.renderIntoDocument(
            <Spreadsheet {...props} columns={[...columns]} />
        );
        component.handleTableSortSwap([1, 0]);
        component
            .setStateAsync({
                dataSet: [...data.slice(0, pageSize)],
                sortDirection: ""
            })
            .then(() => {
                const d = component.getSingleSortResult([
                    ...data.slice(0, pageSize)
                ]);
                expect(d).not.toBeNull();
            });
    });
});

test("Spreadsheet - sortRows", () => {
    act(() => {
        const component = ReactTestUtils.renderIntoDocument(
            <Spreadsheet {...props} columns={[...columns]} />
        );
        component
            .setStateAsync({
                dataSet: [...data.slice(0, pageSize)]
            })
            .then(() => {
                const d = component.sortRows(
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
        const component = ReactTestUtils.renderIntoDocument(
            <Spreadsheet {...props} columns={[...columns]} />
        );
        component
            .setStateAsync({
                subDataSet: [...data.slice(0, pageSize)],
                searchValue: "a"
            })
            .then(() => {
                const d = component.sortRows(
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
        const component = ReactTestUtils.renderIntoDocument(
            <Spreadsheet {...props} columns={[...columns]} />
        );
        const filters = JSON.parse(
            '{"segmentto":{"filterTerm":[{"value":"ZYY","label":"ZYY"}],"column":{"rowType":"filter","key":"segmentto","name":"Segment To","draggable":false,"editor":{"key":null,"ref":null,"props":{"options":[{"id":"AAA","value":"AAA"},{"id":"AAB","value":"AAB"},{"id":"AAC","value":"AAC"},{"id":"ABA","value":"ABA"},{"id":"ABB","value":"ABB"},{"id":"ABC","value":"ABC"},{"id":"ACA","value":"ACA"},{"id":"ACB","value":"ACB"},{"id":"ACC","value":"ACC"},{"id":"BAA","value":"BAA"},{"id":"BAB","value":"BAB"},{"id":"BAC","value":"BAC"},{"id":"BBA","value":"BBA"},{"id":"BBB","value":"BBB"},{"id":"BBC","value":"BBC"},{"id":"BCA","value":"BCA"},{"id":"BCB","value":"BCB"},{"id":"BCC","value":"BCC"},{"id":"CAA","value":"CAA"},{"id":"CAB","value":"CAB"},{"id":"CAC","value":"CAC"},{"id":"CBA","value":"CBA"},{"id":"CBB","value":"CBB"},{"id":"CBC","value":"CBC"},{"id":"CCA","value":"CCA"},{"id":"CCB","value":"CCB"},{"id":"CCC","value":"CCC"},{"id":"XXX","value":"XXX"},{"id":"XXY","value":"XXY"},{"id":"XXZ","value":"XXZ"},{"id":"XYX","value":"XYX"},{"id":"XYY","value":"XYY"},{"id":"XYZ","value":"XYZ"},{"id":"XZX","value":"XZX"},{"id":"XZY","value":"XZY"},{"id":"XZZ","value":"XZZ"},{"id":"YXX","value":"YXX"},{"id":"YXY","value":"YXY"},{"id":"YXZ","value":"YXZ"},{"id":"YYX","value":"YYX"},{"id":"YYY","value":"YYY"},{"id":"YYZ","value":"YYZ"},{"id":"YZX","value":"YZX"},{"id":"YZY","value":"YZY"},{"id":"YZZ","value":"YZZ"},{"id":"ZXX","value":"ZXX"},{"id":"ZXY","value":"ZXY"},{"id":"ZXZ","value":"ZXZ"},{"id":"ZYX","value":"ZYX"},{"id":"ZYY","value":"ZYY"},{"id":"ZYZ","value":"ZYZ"},{"id":"ZZX","value":"ZZX"},{"id":"ZZY","value":"ZZY"},{"id":"ZZZ","value":"ZZZ"}]},"_owner":null,"_store":{}},"formulaApplicable":false,"sortable":true,"resizable":true,"filterable":true,"width":150,"filterType":"autoCompleteFilter","dataSource":[{"id":"AAA","value":"AAA"},{"id":"AAB","value":"AAB"},{"id":"AAC","value":"AAC"},{"id":"ABA","value":"ABA"},{"id":"ABB","value":"ABB"},{"id":"ABC","value":"ABC"},{"id":"ACA","value":"ACA"},{"id":"ACB","value":"ACB"},{"id":"ACC","value":"ACC"},{"id":"BAA","value":"BAA"},{"id":"BAB","value":"BAB"},{"id":"BAC","value":"BAC"},{"id":"BBA","value":"BBA"},{"id":"BBB","value":"BBB"},{"id":"BBC","value":"BBC"},{"id":"BCA","value":"BCA"},{"id":"BCB","value":"BCB"},{"id":"BCC","value":"BCC"},{"id":"CAA","value":"CAA"},{"id":"CAB","value":"CAB"},{"id":"CAC","value":"CAC"},{"id":"CBA","value":"CBA"},{"id":"CBB","value":"CBB"},{"id":"CBC","value":"CBC"},{"id":"CCA","value":"CCA"},{"id":"CCB","value":"CCB"},{"id":"CCC","value":"CCC"},{"id":"XXX","value":"XXX"},{"id":"XXY","value":"XXY"},{"id":"XXZ","value":"XXZ"},{"id":"XYX","value":"XYX"},{"id":"XYY","value":"XYY"},{"id":"XYZ","value":"XYZ"},{"id":"XZX","value":"XZX"},{"id":"XZY","value":"XZY"},{"id":"XZZ","value":"XZZ"},{"id":"YXX","value":"YXX"},{"id":"YXY","value":"YXY"},{"id":"YXZ","value":"YXZ"},{"id":"YYX","value":"YYX"},{"id":"YYY","value":"YYY"},{"id":"YYZ","value":"YYZ"},{"id":"YZX","value":"YZX"},{"id":"YZY","value":"YZY"},{"id":"YZZ","value":"YZZ"},{"id":"ZXX","value":"ZXX"},{"id":"ZXY","value":"ZXY"},{"id":"ZXZ","value":"ZXZ"},{"id":"ZYX","value":"ZYX"},{"id":"ZYY","value":"ZYY"},{"id":"ZYZ","value":"ZYZ"},{"id":"ZZX","value":"ZZX"},{"id":"ZZY","value":"ZZY"},{"id":"ZZZ","value":"ZZZ"}],"dataSourceType":"segmentto","left":810,"idx":6},"rawValue":[{"value":"ZYY","label":"ZYY"}]}}'
        );
        component
            .setStateAsync({
                subDataSet: [...data.slice(0, pageSize)]
            })
            .then(() => {
                const d = component.getSlicedRows(
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
        const component = ReactTestUtils.renderIntoDocument(
            <Spreadsheet {...props} columns={[...columns]} />
        );
        const filters = JSON.parse(
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
            .then(() => {
                const d = component.getSlicedRows(
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
        const component = ReactTestUtils.renderIntoDocument(
            <Spreadsheet {...props} columns={[...columns]} />
        );

        component.getRowsAsync([...data.slice(0, pageSize)], {}).then((d) => {
            expect(d).not.toBeNull();
        });
    });
});

test("Spreadsheet - getrows ", () => {
    act(() => {
        const component = ReactTestUtils.renderIntoDocument(
            <Spreadsheet {...props} columns={[...columns]} />
        );

        const d = component.getrows([...data.slice(0, pageSize)], {});
        expect(d).not.toBeNull();
    });
});

test("Spreadsheet - onRowsDeselected", () => {
    act(() => {
        const component = ReactTestUtils.renderIntoDocument(
            <Spreadsheet {...props} columns={[...columns]} />
        );

        const d = component.onRowsDeselected([...data.slice(0, pageSize)]);
        expect(d).not.toBeNull();
    });
});

test("Spreadsheet - onRowsDeselected 1", () => {
    act(() => {
        const component = ReactTestUtils.renderIntoDocument(
            <Spreadsheet {...props} columns={[...columns]} />
        );
        let arr = [];
        for (let i = 0; i < 5; i++) {
            arr.push({ rowIdx: i });
        }
        component
            .setStateAsync({
                selectedIndexes: [0, 1, 2, 3, 4]
            })
            .then(() => {
                const d = component.onRowsDeselected(arr);
                expect(d).not.toBeNull();
            });
    });
});

test("Spreadsheet - onGridRowsUpdated", () => {
    const updatedRows = jest.fn();
    act(() => {
        const component = ReactTestUtils.renderIntoDocument(
            <Spreadsheet
                {...props}
                columns={[...columns]}
                updatedRows={updatedRows}
            />
        );

        component
            .setStateAsync({
                rows: [...data.slice(0, pageSize)],
                tempRows: [...data.slice(0, pageSize)],
                filteringRows: [...data.slice(0, pageSize)]
            })
            .then(() => {
                const val = {
                    fromRow: 0,
                    toRow: 0,
                    updated: { revenue: "$60,485.34" },
                    action: "CELL_UPDATE"
                };
                const d = component.onGridRowsUpdated({ ...val });
                expect(d).not.toBeNull();
            });
    });
});

test("Spreadsheet - onRowsSelected", () => {
    act(() => {
        const component = ReactTestUtils.renderIntoDocument(
            <Spreadsheet {...props} columns={[...columns]} />
        );

        const d = component.onRowsSelected([...data.slice(0, pageSize)]);
        expect(d).not.toBeNull();
    });
});

test("Spreadsheet - handleFilterChange ", () => {
    act(() => {
        const component = ReactTestUtils.renderIntoDocument(
            <Spreadsheet {...props} columns={[...columns]} />
        );
        const filter = JSON.parse(
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
            .then(() => {
                const d = component.handleFilterChange(filter);
                expect(d).not.toBeNull();
            });
    });
});

test("Spreadsheet - handleFilterChange 2", () => {
    act(() => {
        const component = ReactTestUtils.renderIntoDocument(
            <Spreadsheet {...props} columns={[...columns]} />
        );
        const junk = JSON.parse(
            '{"segmentto":{"filterTerm":[{"value":"ZYY","label":"ZYY"}],"column":{"rowType":"filter","key":"segmentto","name":"Segment To","draggable":false,"editor":{"key":null,"ref":null,"props":{"options":[{"id":"AAA","value":"AAA"},{"id":"AAB","value":"AAB"},{"id":"AAC","value":"AAC"},{"id":"ABA","value":"ABA"},{"id":"ABB","value":"ABB"},{"id":"ABC","value":"ABC"},{"id":"ACA","value":"ACA"},{"id":"ACB","value":"ACB"},{"id":"ACC","value":"ACC"},{"id":"BAA","value":"BAA"},{"id":"BAB","value":"BAB"},{"id":"BAC","value":"BAC"},{"id":"BBA","value":"BBA"},{"id":"BBB","value":"BBB"},{"id":"BBC","value":"BBC"},{"id":"BCA","value":"BCA"},{"id":"BCB","value":"BCB"},{"id":"BCC","value":"BCC"},{"id":"CAA","value":"CAA"},{"id":"CAB","value":"CAB"},{"id":"CAC","value":"CAC"},{"id":"CBA","value":"CBA"},{"id":"CBB","value":"CBB"},{"id":"CBC","value":"CBC"},{"id":"CCA","value":"CCA"},{"id":"CCB","value":"CCB"},{"id":"CCC","value":"CCC"},{"id":"XXX","value":"XXX"},{"id":"XXY","value":"XXY"},{"id":"XXZ","value":"XXZ"},{"id":"XYX","value":"XYX"},{"id":"XYY","value":"XYY"},{"id":"XYZ","value":"XYZ"},{"id":"XZX","value":"XZX"},{"id":"XZY","value":"XZY"},{"id":"XZZ","value":"XZZ"},{"id":"YXX","value":"YXX"},{"id":"YXY","value":"YXY"},{"id":"YXZ","value":"YXZ"},{"id":"YYX","value":"YYX"},{"id":"YYY","value":"YYY"},{"id":"YYZ","value":"YYZ"},{"id":"YZX","value":"YZX"},{"id":"YZY","value":"YZY"},{"id":"YZZ","value":"YZZ"},{"id":"ZXX","value":"ZXX"},{"id":"ZXY","value":"ZXY"},{"id":"ZXZ","value":"ZXZ"},{"id":"ZYX","value":"ZYX"},{"id":"ZYY","value":"ZYY"},{"id":"ZYZ","value":"ZYZ"},{"id":"ZZX","value":"ZZX"},{"id":"ZZY","value":"ZZY"},{"id":"ZZZ","value":"ZZZ"}]},"_owner":null,"_store":{}},"formulaApplicable":false,"sortable":true,"resizable":true,"filterable":true,"width":150,"filterType":"autoCompleteFilter","dataSource":[{"id":"AAA","value":"AAA"},{"id":"AAB","value":"AAB"},{"id":"AAC","value":"AAC"},{"id":"ABA","value":"ABA"},{"id":"ABB","value":"ABB"},{"id":"ABC","value":"ABC"},{"id":"ACA","value":"ACA"},{"id":"ACB","value":"ACB"},{"id":"ACC","value":"ACC"},{"id":"BAA","value":"BAA"},{"id":"BAB","value":"BAB"},{"id":"BAC","value":"BAC"},{"id":"BBA","value":"BBA"},{"id":"BBB","value":"BBB"},{"id":"BBC","value":"BBC"},{"id":"BCA","value":"BCA"},{"id":"BCB","value":"BCB"},{"id":"BCC","value":"BCC"},{"id":"CAA","value":"CAA"},{"id":"CAB","value":"CAB"},{"id":"CAC","value":"CAC"},{"id":"CBA","value":"CBA"},{"id":"CBB","value":"CBB"},{"id":"CBC","value":"CBC"},{"id":"CCA","value":"CCA"},{"id":"CCB","value":"CCB"},{"id":"CCC","value":"CCC"},{"id":"XXX","value":"XXX"},{"id":"XXY","value":"XXY"},{"id":"XXZ","value":"XXZ"},{"id":"XYX","value":"XYX"},{"id":"XYY","value":"XYY"},{"id":"XYZ","value":"XYZ"},{"id":"XZX","value":"XZX"},{"id":"XZY","value":"XZY"},{"id":"XZZ","value":"XZZ"},{"id":"YXX","value":"YXX"},{"id":"YXY","value":"YXY"},{"id":"YXZ","value":"YXZ"},{"id":"YYX","value":"YYX"},{"id":"YYY","value":"YYY"},{"id":"YYZ","value":"YYZ"},{"id":"YZX","value":"YZX"},{"id":"YZY","value":"YZY"},{"id":"YZZ","value":"YZZ"},{"id":"ZXX","value":"ZXX"},{"id":"ZXY","value":"ZXY"},{"id":"ZXZ","value":"ZXZ"},{"id":"ZYX","value":"ZYX"},{"id":"ZYY","value":"ZYY"},{"id":"ZYZ","value":"ZYZ"},{"id":"ZZX","value":"ZZX"},{"id":"ZZY","value":"ZZY"},{"id":"ZZZ","value":"ZZZ"}],"dataSourceType":"segmentto","left":810,"idx":6},"rawValue":[{"value":"ZYY","label":"ZYY"}]}}'
        );
        const filterVal = JSON.parse(
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
            .then(() => {
                const d = component.handleFilterChange(filterVal);
                expect(d).not.toBeNull();
            });
    });
});

test("Spreadsheet - isAtBottom", () => {
    act(() => {
        const component = ReactTestUtils.renderIntoDocument(
            <Spreadsheet {...props} columns={[...columns]} />
        );
        const event = {
            target: {
                clientHeight: 582,
                scrollTop: 25,
                scrollHeight: 17500
            }
        };
        const d = component.isAtBottom(event);
        expect(d).not.toBeNull();
    });
});

test("Spreadsheet - isSubset", () => {
    act(() => {
        const component = ReactTestUtils.renderIntoDocument(
            <Spreadsheet {...props} columns={[...columns]} />
        );
        component
            .setStateAsync({
                sortingParamsObjectList: []
            })
            .then(() => {
                const event = {
                    target: {
                        clientHeight: 582,
                        scrollTop: 25,
                        scrollHeight: 17500
                    }
                };
                const d = component.isSubset(event);
                expect(d).toBeFalsy();
            });
    });
});

test("Spreadsheet - loadMoreRows ", () => {
    act(() => {
        const component = ReactTestUtils.renderIntoDocument(
            <Spreadsheet {...props} columns={[...columns]} />
        );
        component
            .setStateAsync({
                subDataSet: [...data.slice(0, pageSize)],
                dataSet: [...data.slice(0, pageSize)],
                pageRowCount: 10,
                searchValue: ""
            })
            .then(() => {
                component.loadMoreRows(0, 10).then((r) => {
                    expect(r.length).toBeGreaterThan(0);
                });
            });
    });
});

test("Spreadsheet - loadMoreRows 2", () => {
    act(() => {
        const component = ReactTestUtils.renderIntoDocument(
            <Spreadsheet {...props} columns={[...columns]} />
        );
        component
            .setStateAsync({
                subDataSet: [...data.slice(0, pageSize)],
                dataSet: [...data.slice(0, pageSize)],
                pageRowCount: 10,
                searchValue: "aaa"
            })
            .then(() => {
                component.loadMoreRows(0, 10).then((r) => {
                    expect(r.length).toBeGreaterThan(0);
                });
            });
    });
});

test("Spreadsheet - handleScroll", () => {
    act(() => {
        const component = ReactTestUtils.renderIntoDocument(
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
            .then(async () => {
                const event = {
                    target: {
                        clientHeight: 582,
                        scrollTop: 25,
                        scrollHeight: 17500
                    }
                };
                const d = await component.handleScroll(event);
                expect(d).not.toBeNull();
            });
    });
});

test("Spreadsheet - globalSearchLogic", async () => {
    act(async () => {
        const component = ReactTestUtils.renderIntoDocument(
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
            .then(async () => {
                const event = {
                    target: {
                        value: "aaa"
                    }
                };
                const d = await component.globalSearchLogic(event, [
                    ...data.slice(0, pageSize)
                ]);
                expect(d).not.toBeNull();
            });
    });
});

test("Spreadsheet - handleWarningStatus ", () => {
    act(() => {
        const component = ReactTestUtils.renderIntoDocument(
            <Spreadsheet {...props} columns={[...columns]} />
        );

        const d = component.handleWarningStatus();
        expect(d).not.toBeNull();
    });
});

test("Spreadsheet - closeWarningStatus", () => {
    act(() => {
        const component = ReactTestUtils.renderIntoDocument(
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
            .then(() => {
                const r = component.closeWarningStatus();
                expect(r).not.toBeNull();
            });
    });
});

test("Spreadsheet - closeWarningStatus 2", () => {
    act(() => {
        const component = ReactTestUtils.renderIntoDocument(
            <Spreadsheet {...props} columns={[...columns]} />
        );
        component
            .setStateAsync({
                dataSet: [...data.slice(0, 3)],
                sortDirection: "DESC",
                sortColumn: "FlightNo",
                pageIndex: 1,
                pageRowCount: 1,
                sortingParamsObjectList: [
                    {
                        order: "Ascending",
                        sortBy: "FlightNo",
                        sortOn: "Value"
                    }
                ]
            })
            .then(() => {
                const r = component.closeWarningStatus();
                expect(r).not.toBeNull();
            });
    });
});
test("Spreadsheet - save", () => {
    act(() => {
        const component = ReactTestUtils.renderIntoDocument(
            <Spreadsheet {...props} columns={[...columns]} />
        );

        const d = component.save();
        expect(d).not.toBeNull();
    });
});

test("Spreadsheet - clearAllFilters", () => {
    act(() => {
        const component = ReactTestUtils.renderIntoDocument(
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
            .then(() => {
                const r = component.clearAllFilters();
                expect(r).not.toBeNull();
            });
    });
});

test("Spreadsheet - getFilterResult ", () => {
    act(() => {
        const component = ReactTestUtils.renderIntoDocument(
            <Spreadsheet {...props} columns={[...columns]} />
        );
        const junk = JSON.parse(
            '{"segmentto":{"filterTerm":[{"value":"ZYY","label":"ZYY"}],"column":{"rowType":"filter","key":"segmentto","name":"Segment To","draggable":false,"editor":{"key":null,"ref":null,"props":{"options":[{"id":"AAA","value":"AAA"},{"id":"AAB","value":"AAB"},{"id":"AAC","value":"AAC"},{"id":"ABA","value":"ABA"},{"id":"ABB","value":"ABB"},{"id":"ABC","value":"ABC"},{"id":"ACA","value":"ACA"},{"id":"ACB","value":"ACB"},{"id":"ACC","value":"ACC"},{"id":"BAA","value":"BAA"},{"id":"BAB","value":"BAB"},{"id":"BAC","value":"BAC"},{"id":"BBA","value":"BBA"},{"id":"BBB","value":"BBB"},{"id":"BBC","value":"BBC"},{"id":"BCA","value":"BCA"},{"id":"BCB","value":"BCB"},{"id":"BCC","value":"BCC"},{"id":"CAA","value":"CAA"},{"id":"CAB","value":"CAB"},{"id":"CAC","value":"CAC"},{"id":"CBA","value":"CBA"},{"id":"CBB","value":"CBB"},{"id":"CBC","value":"CBC"},{"id":"CCA","value":"CCA"},{"id":"CCB","value":"CCB"},{"id":"CCC","value":"CCC"},{"id":"XXX","value":"XXX"},{"id":"XXY","value":"XXY"},{"id":"XXZ","value":"XXZ"},{"id":"XYX","value":"XYX"},{"id":"XYY","value":"XYY"},{"id":"XYZ","value":"XYZ"},{"id":"XZX","value":"XZX"},{"id":"XZY","value":"XZY"},{"id":"XZZ","value":"XZZ"},{"id":"YXX","value":"YXX"},{"id":"YXY","value":"YXY"},{"id":"YXZ","value":"YXZ"},{"id":"YYX","value":"YYX"},{"id":"YYY","value":"YYY"},{"id":"YYZ","value":"YYZ"},{"id":"YZX","value":"YZX"},{"id":"YZY","value":"YZY"},{"id":"YZZ","value":"YZZ"},{"id":"ZXX","value":"ZXX"},{"id":"ZXY","value":"ZXY"},{"id":"ZXZ","value":"ZXZ"},{"id":"ZYX","value":"ZYX"},{"id":"ZYY","value":"ZYY"},{"id":"ZYZ","value":"ZYZ"},{"id":"ZZX","value":"ZZX"},{"id":"ZZY","value":"ZZY"},{"id":"ZZZ","value":"ZZZ"}]},"_owner":null,"_store":{}},"formulaApplicable":false,"sortable":true,"resizable":true,"filterable":true,"width":150,"filterType":"autoCompleteFilter","dataSource":[{"id":"AAA","value":"AAA"},{"id":"AAB","value":"AAB"},{"id":"AAC","value":"AAC"},{"id":"ABA","value":"ABA"},{"id":"ABB","value":"ABB"},{"id":"ABC","value":"ABC"},{"id":"ACA","value":"ACA"},{"id":"ACB","value":"ACB"},{"id":"ACC","value":"ACC"},{"id":"BAA","value":"BAA"},{"id":"BAB","value":"BAB"},{"id":"BAC","value":"BAC"},{"id":"BBA","value":"BBA"},{"id":"BBB","value":"BBB"},{"id":"BBC","value":"BBC"},{"id":"BCA","value":"BCA"},{"id":"BCB","value":"BCB"},{"id":"BCC","value":"BCC"},{"id":"CAA","value":"CAA"},{"id":"CAB","value":"CAB"},{"id":"CAC","value":"CAC"},{"id":"CBA","value":"CBA"},{"id":"CBB","value":"CBB"},{"id":"CBC","value":"CBC"},{"id":"CCA","value":"CCA"},{"id":"CCB","value":"CCB"},{"id":"CCC","value":"CCC"},{"id":"XXX","value":"XXX"},{"id":"XXY","value":"XXY"},{"id":"XXZ","value":"XXZ"},{"id":"XYX","value":"XYX"},{"id":"XYY","value":"XYY"},{"id":"XYZ","value":"XYZ"},{"id":"XZX","value":"XZX"},{"id":"XZY","value":"XZY"},{"id":"XZZ","value":"XZZ"},{"id":"YXX","value":"YXX"},{"id":"YXY","value":"YXY"},{"id":"YXZ","value":"YXZ"},{"id":"YYX","value":"YYX"},{"id":"YYY","value":"YYY"},{"id":"YYZ","value":"YYZ"},{"id":"YZX","value":"YZX"},{"id":"YZY","value":"YZY"},{"id":"YZZ","value":"YZZ"},{"id":"ZXX","value":"ZXX"},{"id":"ZXY","value":"ZXY"},{"id":"ZXZ","value":"ZXZ"},{"id":"ZYX","value":"ZYX"},{"id":"ZYY","value":"ZYY"},{"id":"ZYZ","value":"ZYZ"},{"id":"ZZX","value":"ZZX"},{"id":"ZZY","value":"ZZY"},{"id":"ZZZ","value":"ZZZ"}],"dataSourceType":"segmentto","left":810,"idx":6},"rawValue":[{"value":"ZYY","label":"ZYY"}]}}'
        );
        component
            .setStateAsync({
                dataSet: [...data.slice(0, pageSize)],
                junk
            })
            .then(() => {
                const r = component.getFilterResult([
                    ...data.slice(0, pageSize)
                ]);
                expect(r).not.toBeNull();
            });
    });
});

test("Spreadsheet - globalSearch - onChange ", () => {
    act(() => {
        const component = ReactTestUtils.renderIntoDocument(
            <Spreadsheet {...props} columns={[...columns]} />
        );

        const inputElm = ReactTestUtils.scryRenderedDOMComponentsWithClass(
            component,
            "globalSeachInput"
        );
        expect(inputElm).not.toBeNull();
    });
});
test("Spreadsheet - arrayMove", () => {
    act(() => {
        const component = ReactTestUtils.renderIntoDocument(
            <Spreadsheet {...props} columns={[...columns]} />
        );

        let arr = [];
        for (let i = 0; i < 10; i++) {
            arr.push({ id: i + 1 });
        }
        const d = component.arrayMove(arr, 2, arr.length);
        expect(d).not.toBeNull();
    });
});
test("Spreadsheet - clearAllFilters", () => {
    act(() => {
        const component = ReactTestUtils.renderIntoDocument(
            <Spreadsheet {...props} columns={[...columns]} />
        );
        component
            .setStateAsync({
                dataSet: [...data.slice(0, 1)],
                pageIndex: 1,
                pageRowCount: 1
            })
            .then(() => {
                const r = component.clearAllFilters();
                expect(r).not.toBeNull();
            });
    });
});
test("Spreadsheet - globalSearchLogic", async () => {
    act(async () => {
        const component = ReactTestUtils.renderIntoDocument(
            <Spreadsheet {...props} columns={[...columns]} />
        );
        await component
            .setStateAsync({
                subDataSet: [...data.slice(0, pageSize)],
                dataSet: [...data.slice(0, pageSize)],
                rows: [...data.slice(0, pageSize)],
                pageRowCount: 10,
                searchValue: "CC",
                pageIndex: 0
            })
            .then(async () => {
                const event = {
                    target: {
                        value: "CCC"
                    }
                };
                const d = await component.globalSearchLogic(event, [
                    ...data.slice(0, pageSize)
                ]);
                expect(d).not.toBeNull();
            });
    });
});
test("Spreadsheet - handleScroll", () => {
    act(async () => {
        const component = ReactTestUtils.renderIntoDocument(
            <Spreadsheet {...props} columns={[...columns]} />
        );
        component
            .setStateAsync({
                subDataSet: [...data.slice(0, pageSize)],
                dataSet: [...data.slice(0, pageSize)],
                rows: [...data.slice(0, pageSize)],
                pageRowCount: 1,
                searchValue: "",
                pageIndex: 0
            })
            .then(async () => {
                const event = {
                    target: {
                        clientHeight: 582,
                        scrollTop: 25,
                        scrollHeight: 500
                    }
                };
                const d = await component.handleScroll(event);
                expect(d).not.toBeNull();
            });
    });
});

test("Spreadsheet - handleFilterChange 5", () => {
    act(() => {
        const component = ReactTestUtils.renderIntoDocument(
            <Spreadsheet {...props} columns={[...columns]} />
        );
        const junk = JSON.parse(
            '{"segmentto":{"filterTerm":[{"value":"ZYY","label":"ZYY"}],"column":{"rowType":"filter","key":"segmentto","name":"Segment To","draggable":false,"editor":{"key":null,"ref":null,"props":{"options":[{"id":"AAA","value":"AAA"},{"id":"AAB","value":"AAB"},{"id":"AAC","value":"AAC"},{"id":"ABA","value":"ABA"},{"id":"ABB","value":"ABB"},{"id":"ABC","value":"ABC"},{"id":"ACA","value":"ACA"},{"id":"ACB","value":"ACB"},{"id":"ACC","value":"ACC"},{"id":"BAA","value":"BAA"},{"id":"BAB","value":"BAB"},{"id":"BAC","value":"BAC"},{"id":"BBA","value":"BBA"},{"id":"BBB","value":"BBB"},{"id":"BBC","value":"BBC"},{"id":"BCA","value":"BCA"},{"id":"BCB","value":"BCB"},{"id":"BCC","value":"BCC"},{"id":"CAA","value":"CAA"},{"id":"CAB","value":"CAB"},{"id":"CAC","value":"CAC"},{"id":"CBA","value":"CBA"},{"id":"CBB","value":"CBB"},{"id":"CBC","value":"CBC"},{"id":"CCA","value":"CCA"},{"id":"CCB","value":"CCB"},{"id":"CCC","value":"CCC"},{"id":"XXX","value":"XXX"},{"id":"XXY","value":"XXY"},{"id":"XXZ","value":"XXZ"},{"id":"XYX","value":"XYX"},{"id":"XYY","value":"XYY"},{"id":"XYZ","value":"XYZ"},{"id":"XZX","value":"XZX"},{"id":"XZY","value":"XZY"},{"id":"XZZ","value":"XZZ"},{"id":"YXX","value":"YXX"},{"id":"YXY","value":"YXY"},{"id":"YXZ","value":"YXZ"},{"id":"YYX","value":"YYX"},{"id":"YYY","value":"YYY"},{"id":"YYZ","value":"YYZ"},{"id":"YZX","value":"YZX"},{"id":"YZY","value":"YZY"},{"id":"YZZ","value":"YZZ"},{"id":"ZXX","value":"ZXX"},{"id":"ZXY","value":"ZXY"},{"id":"ZXZ","value":"ZXZ"},{"id":"ZYX","value":"ZYX"},{"id":"ZYY","value":"ZYY"},{"id":"ZYZ","value":"ZYZ"},{"id":"ZZX","value":"ZZX"},{"id":"ZZY","value":"ZZY"},{"id":"ZZZ","value":"ZZZ"}]},"_owner":null,"_store":{}},"formulaApplicable":false,"sortable":true,"resizable":true,"filterable":true,"width":150,"filterType":"autoCompleteFilter","dataSource":[{"id":"AAA","value":"AAA"},{"id":"AAB","value":"AAB"},{"id":"AAC","value":"AAC"},{"id":"ABA","value":"ABA"},{"id":"ABB","value":"ABB"},{"id":"ABC","value":"ABC"},{"id":"ACA","value":"ACA"},{"id":"ACB","value":"ACB"},{"id":"ACC","value":"ACC"},{"id":"BAA","value":"BAA"},{"id":"BAB","value":"BAB"},{"id":"BAC","value":"BAC"},{"id":"BBA","value":"BBA"},{"id":"BBB","value":"BBB"},{"id":"BBC","value":"BBC"},{"id":"BCA","value":"BCA"},{"id":"BCB","value":"BCB"},{"id":"BCC","value":"BCC"},{"id":"CAA","value":"CAA"},{"id":"CAB","value":"CAB"},{"id":"CAC","value":"CAC"},{"id":"CBA","value":"CBA"},{"id":"CBB","value":"CBB"},{"id":"CBC","value":"CBC"},{"id":"CCA","value":"CCA"},{"id":"CCB","value":"CCB"},{"id":"CCC","value":"CCC"},{"id":"XXX","value":"XXX"},{"id":"XXY","value":"XXY"},{"id":"XXZ","value":"XXZ"},{"id":"XYX","value":"XYX"},{"id":"XYY","value":"XYY"},{"id":"XYZ","value":"XYZ"},{"id":"XZX","value":"XZX"},{"id":"XZY","value":"XZY"},{"id":"XZZ","value":"XZZ"},{"id":"YXX","value":"YXX"},{"id":"YXY","value":"YXY"},{"id":"YXZ","value":"YXZ"},{"id":"YYX","value":"YYX"},{"id":"YYY","value":"YYY"},{"id":"YYZ","value":"YYZ"},{"id":"YZX","value":"YZX"},{"id":"YZY","value":"YZY"},{"id":"YZZ","value":"YZZ"},{"id":"ZXX","value":"ZXX"},{"id":"ZXY","value":"ZXY"},{"id":"ZXZ","value":"ZXZ"},{"id":"ZYX","value":"ZYX"},{"id":"ZYY","value":"ZYY"},{"id":"ZYZ","value":"ZYZ"},{"id":"ZZX","value":"ZZX"},{"id":"ZZY","value":"ZZY"},{"id":"ZZZ","value":"ZZZ"}],"dataSourceType":"segmentto","left":810,"idx":6},"rawValue":[{"value":"ZYY","label":"ZYY"}]}}'
        );
        const filterVal = JSON.parse(
            '{"filterTerm":[],"column":{"rowType":"filter","key":"segmentto","name":"Segment To","draggable":false,"editor":{"key":null,"ref":null,"props":{"options":[{"id":"AAA","value":"AAA"},{"id":"AAB","value":"AAB"},{"id":"AAC","value":"AAC"},{"id":"ABA","value":"ABA"},{"id":"ABB","value":"ABB"},{"id":"ABC","value":"ABC"},{"id":"ACA","value":"ACA"},{"id":"ACB","value":"ACB"},{"id":"ACC","value":"ACC"},{"id":"BAA","value":"BAA"},{"id":"BAB","value":"BAB"},{"id":"BAC","value":"BAC"},{"id":"BBA","value":"BBA"},{"id":"BBB","value":"BBB"},{"id":"BBC","value":"BBC"},{"id":"BCA","value":"BCA"},{"id":"BCB","value":"BCB"},{"id":"BCC","value":"BCC"},{"id":"CAA","value":"CAA"},{"id":"CAB","value":"CAB"},{"id":"CAC","value":"CAC"},{"id":"CBA","value":"CBA"},{"id":"CBB","value":"CBB"},{"id":"CBC","value":"CBC"},{"id":"CCA","value":"CCA"},{"id":"CCB","value":"CCB"},{"id":"CCC","value":"CCC"},{"id":"XXX","value":"XXX"},{"id":"XXY","value":"XXY"},{"id":"XXZ","value":"XXZ"},{"id":"XYX","value":"XYX"},{"id":"XYY","value":"XYY"},{"id":"XYZ","value":"XYZ"},{"id":"XZX","value":"XZX"},{"id":"XZY","value":"XZY"},{"id":"XZZ","value":"XZZ"},{"id":"YXX","value":"YXX"},{"id":"YXY","value":"YXY"},{"id":"YXZ","value":"YXZ"},{"id":"YYX","value":"YYX"},{"id":"YYY","value":"YYY"},{"id":"YYZ","value":"YYZ"},{"id":"YZX","value":"YZX"},{"id":"YZY","value":"YZY"},{"id":"YZZ","value":"YZZ"},{"id":"ZXX","value":"ZXX"},{"id":"ZXY","value":"ZXY"},{"id":"ZXZ","value":"ZXZ"},{"id":"ZYX","value":"ZYX"},{"id":"ZYY","value":"ZYY"},{"id":"ZYZ","value":"ZYZ"},{"id":"ZZX","value":"ZZX"},{"id":"ZZY","value":"ZZY"},{"id":"ZZZ","value":"ZZZ"}]},"_owner":null,"_store":{}},"formulaApplicable":false,"sortable":true,"resizable":true,"filterable":true,"width":150,"filterType":"autoCompleteFilter","dataSource":[{"id":"AAA","value":"AAA"},{"id":"AAB","value":"AAB"},{"id":"AAC","value":"AAC"},{"id":"ABA","value":"ABA"},{"id":"ABB","value":"ABB"},{"id":"ABC","value":"ABC"},{"id":"ACA","value":"ACA"},{"id":"ACB","value":"ACB"},{"id":"ACC","value":"ACC"},{"id":"BAA","value":"BAA"},{"id":"BAB","value":"BAB"},{"id":"BAC","value":"BAC"},{"id":"BBA","value":"BBA"},{"id":"BBB","value":"BBB"},{"id":"BBC","value":"BBC"},{"id":"BCA","value":"BCA"},{"id":"BCB","value":"BCB"},{"id":"BCC","value":"BCC"},{"id":"CAA","value":"CAA"},{"id":"CAB","value":"CAB"},{"id":"CAC","value":"CAC"},{"id":"CBA","value":"CBA"},{"id":"CBB","value":"CBB"},{"id":"CBC","value":"CBC"},{"id":"CCA","value":"CCA"},{"id":"CCB","value":"CCB"},{"id":"CCC","value":"CCC"},{"id":"XXX","value":"XXX"},{"id":"XXY","value":"XXY"},{"id":"XXZ","value":"XXZ"},{"id":"XYX","value":"XYX"},{"id":"XYY","value":"XYY"},{"id":"XYZ","value":"XYZ"},{"id":"XZX","value":"XZX"},{"id":"XZY","value":"XZY"},{"id":"XZZ","value":"XZZ"},{"id":"YXX","value":"YXX"},{"id":"YXY","value":"YXY"},{"id":"YXZ","value":"YXZ"},{"id":"YYX","value":"YYX"},{"id":"YYY","value":"YYY"},{"id":"YYZ","value":"YYZ"},{"id":"YZX","value":"YZX"},{"id":"YZY","value":"YZY"},{"id":"YZZ","value":"YZZ"},{"id":"ZXX","value":"ZXX"},{"id":"ZXY","value":"ZXY"},{"id":"ZXZ","value":"ZXZ"},{"id":"ZYX","value":"ZYX"},{"id":"ZYY","value":"ZYY"},{"id":"ZYZ","value":"ZYZ"},{"id":"ZZX","value":"ZZX"},{"id":"ZZY","value":"ZZY"},{"id":"ZZZ","value":"ZZZ"}],"dataSourceType":"segmentto","left":810,"idx":6},"rawValue":[{"value":"ZYY","label":"ZYY"}]}'
        );
        component
            .setStateAsync({
                subDataSet: [...data.slice(0, pageSize)],
                pageRowCount: 10,
                searchValue: "c",
                junk: { segmentto: [] },
                dataSet: [...data.slice(0, pageSize)]
            })
            .then(() => {
                const d = component.handleFilterChange(filterVal);
                expect(d).not.toBeNull();
            });
    });
});
test("Spreadsheet - handleFilterChange 6 ", () => {
    act(() => {
        const component = ReactTestUtils.renderIntoDocument(
            <Spreadsheet {...props} columns={[...columns]} />
        );
        const junk = JSON.parse(
            '{"segmentto":{"filterTerm":[{"value":"ZYY","label":"ZYY"}],"column":{"rowType":"filter","key":"segmentto","name":"Segment To","draggable":false,"editor":{"key":null,"ref":null,"props":{"options":[{"id":"AAA","value":"AAA"},{"id":"AAB","value":"AAB"},{"id":"AAC","value":"AAC"},{"id":"ABA","value":"ABA"},{"id":"ABB","value":"ABB"},{"id":"ABC","value":"ABC"},{"id":"ACA","value":"ACA"},{"id":"ACB","value":"ACB"},{"id":"ACC","value":"ACC"},{"id":"BAA","value":"BAA"},{"id":"BAB","value":"BAB"},{"id":"BAC","value":"BAC"},{"id":"BBA","value":"BBA"},{"id":"BBB","value":"BBB"},{"id":"BBC","value":"BBC"},{"id":"BCA","value":"BCA"},{"id":"BCB","value":"BCB"},{"id":"BCC","value":"BCC"},{"id":"CAA","value":"CAA"},{"id":"CAB","value":"CAB"},{"id":"CAC","value":"CAC"},{"id":"CBA","value":"CBA"},{"id":"CBB","value":"CBB"},{"id":"CBC","value":"CBC"},{"id":"CCA","value":"CCA"},{"id":"CCB","value":"CCB"},{"id":"CCC","value":"CCC"},{"id":"XXX","value":"XXX"},{"id":"XXY","value":"XXY"},{"id":"XXZ","value":"XXZ"},{"id":"XYX","value":"XYX"},{"id":"XYY","value":"XYY"},{"id":"XYZ","value":"XYZ"},{"id":"XZX","value":"XZX"},{"id":"XZY","value":"XZY"},{"id":"XZZ","value":"XZZ"},{"id":"YXX","value":"YXX"},{"id":"YXY","value":"YXY"},{"id":"YXZ","value":"YXZ"},{"id":"YYX","value":"YYX"},{"id":"YYY","value":"YYY"},{"id":"YYZ","value":"YYZ"},{"id":"YZX","value":"YZX"},{"id":"YZY","value":"YZY"},{"id":"YZZ","value":"YZZ"},{"id":"ZXX","value":"ZXX"},{"id":"ZXY","value":"ZXY"},{"id":"ZXZ","value":"ZXZ"},{"id":"ZYX","value":"ZYX"},{"id":"ZYY","value":"ZYY"},{"id":"ZYZ","value":"ZYZ"},{"id":"ZZX","value":"ZZX"},{"id":"ZZY","value":"ZZY"},{"id":"ZZZ","value":"ZZZ"}]},"_owner":null,"_store":{}},"formulaApplicable":false,"sortable":true,"resizable":true,"filterable":true,"width":150,"filterType":"autoCompleteFilter","dataSource":[{"id":"AAA","value":"AAA"},{"id":"AAB","value":"AAB"},{"id":"AAC","value":"AAC"},{"id":"ABA","value":"ABA"},{"id":"ABB","value":"ABB"},{"id":"ABC","value":"ABC"},{"id":"ACA","value":"ACA"},{"id":"ACB","value":"ACB"},{"id":"ACC","value":"ACC"},{"id":"BAA","value":"BAA"},{"id":"BAB","value":"BAB"},{"id":"BAC","value":"BAC"},{"id":"BBA","value":"BBA"},{"id":"BBB","value":"BBB"},{"id":"BBC","value":"BBC"},{"id":"BCA","value":"BCA"},{"id":"BCB","value":"BCB"},{"id":"BCC","value":"BCC"},{"id":"CAA","value":"CAA"},{"id":"CAB","value":"CAB"},{"id":"CAC","value":"CAC"},{"id":"CBA","value":"CBA"},{"id":"CBB","value":"CBB"},{"id":"CBC","value":"CBC"},{"id":"CCA","value":"CCA"},{"id":"CCB","value":"CCB"},{"id":"CCC","value":"CCC"},{"id":"XXX","value":"XXX"},{"id":"XXY","value":"XXY"},{"id":"XXZ","value":"XXZ"},{"id":"XYX","value":"XYX"},{"id":"XYY","value":"XYY"},{"id":"XYZ","value":"XYZ"},{"id":"XZX","value":"XZX"},{"id":"XZY","value":"XZY"},{"id":"XZZ","value":"XZZ"},{"id":"YXX","value":"YXX"},{"id":"YXY","value":"YXY"},{"id":"YXZ","value":"YXZ"},{"id":"YYX","value":"YYX"},{"id":"YYY","value":"YYY"},{"id":"YYZ","value":"YYZ"},{"id":"YZX","value":"YZX"},{"id":"YZY","value":"YZY"},{"id":"YZZ","value":"YZZ"},{"id":"ZXX","value":"ZXX"},{"id":"ZXY","value":"ZXY"},{"id":"ZXZ","value":"ZXZ"},{"id":"ZYX","value":"ZYX"},{"id":"ZYY","value":"ZYY"},{"id":"ZYZ","value":"ZYZ"},{"id":"ZZX","value":"ZZX"},{"id":"ZZY","value":"ZZY"},{"id":"ZZZ","value":"ZZZ"}],"dataSourceType":"segmentto","left":810,"idx":6},"rawValue":[{"value":"ZYY","label":"ZYY"}]}}'
        );
        const filterVal = JSON.parse(
            '{"filterTerm":[],"column":{"rowType":"filter","key":"segmentto","name":"Segment To","draggable":false,"editor":{"key":null,"ref":null,"props":{"options":[{"id":"AAA","value":"AAA"},{"id":"AAB","value":"AAB"},{"id":"AAC","value":"AAC"},{"id":"ABA","value":"ABA"},{"id":"ABB","value":"ABB"},{"id":"ABC","value":"ABC"},{"id":"ACA","value":"ACA"},{"id":"ACB","value":"ACB"},{"id":"ACC","value":"ACC"},{"id":"BAA","value":"BAA"},{"id":"BAB","value":"BAB"},{"id":"BAC","value":"BAC"},{"id":"BBA","value":"BBA"},{"id":"BBB","value":"BBB"},{"id":"BBC","value":"BBC"},{"id":"BCA","value":"BCA"},{"id":"BCB","value":"BCB"},{"id":"BCC","value":"BCC"},{"id":"CAA","value":"CAA"},{"id":"CAB","value":"CAB"},{"id":"CAC","value":"CAC"},{"id":"CBA","value":"CBA"},{"id":"CBB","value":"CBB"},{"id":"CBC","value":"CBC"},{"id":"CCA","value":"CCA"},{"id":"CCB","value":"CCB"},{"id":"CCC","value":"CCC"},{"id":"XXX","value":"XXX"},{"id":"XXY","value":"XXY"},{"id":"XXZ","value":"XXZ"},{"id":"XYX","value":"XYX"},{"id":"XYY","value":"XYY"},{"id":"XYZ","value":"XYZ"},{"id":"XZX","value":"XZX"},{"id":"XZY","value":"XZY"},{"id":"XZZ","value":"XZZ"},{"id":"YXX","value":"YXX"},{"id":"YXY","value":"YXY"},{"id":"YXZ","value":"YXZ"},{"id":"YYX","value":"YYX"},{"id":"YYY","value":"YYY"},{"id":"YYZ","value":"YYZ"},{"id":"YZX","value":"YZX"},{"id":"YZY","value":"YZY"},{"id":"YZZ","value":"YZZ"},{"id":"ZXX","value":"ZXX"},{"id":"ZXY","value":"ZXY"},{"id":"ZXZ","value":"ZXZ"},{"id":"ZYX","value":"ZYX"},{"id":"ZYY","value":"ZYY"},{"id":"ZYZ","value":"ZYZ"},{"id":"ZZX","value":"ZZX"},{"id":"ZZY","value":"ZZY"},{"id":"ZZZ","value":"ZZZ"}]},"_owner":null,"_store":{}},"formulaApplicable":false,"sortable":true,"resizable":true,"filterable":true,"width":150,"filterType":"autoCompleteFilter","dataSource":[{"id":"AAA","value":"AAA"},{"id":"AAB","value":"AAB"},{"id":"AAC","value":"AAC"},{"id":"ABA","value":"ABA"},{"id":"ABB","value":"ABB"},{"id":"ABC","value":"ABC"},{"id":"ACA","value":"ACA"},{"id":"ACB","value":"ACB"},{"id":"ACC","value":"ACC"},{"id":"BAA","value":"BAA"},{"id":"BAB","value":"BAB"},{"id":"BAC","value":"BAC"},{"id":"BBA","value":"BBA"},{"id":"BBB","value":"BBB"},{"id":"BBC","value":"BBC"},{"id":"BCA","value":"BCA"},{"id":"BCB","value":"BCB"},{"id":"BCC","value":"BCC"},{"id":"CAA","value":"CAA"},{"id":"CAB","value":"CAB"},{"id":"CAC","value":"CAC"},{"id":"CBA","value":"CBA"},{"id":"CBB","value":"CBB"},{"id":"CBC","value":"CBC"},{"id":"CCA","value":"CCA"},{"id":"CCB","value":"CCB"},{"id":"CCC","value":"CCC"},{"id":"XXX","value":"XXX"},{"id":"XXY","value":"XXY"},{"id":"XXZ","value":"XXZ"},{"id":"XYX","value":"XYX"},{"id":"XYY","value":"XYY"},{"id":"XYZ","value":"XYZ"},{"id":"XZX","value":"XZX"},{"id":"XZY","value":"XZY"},{"id":"XZZ","value":"XZZ"},{"id":"YXX","value":"YXX"},{"id":"YXY","value":"YXY"},{"id":"YXZ","value":"YXZ"},{"id":"YYX","value":"YYX"},{"id":"YYY","value":"YYY"},{"id":"YYZ","value":"YYZ"},{"id":"YZX","value":"YZX"},{"id":"YZY","value":"YZY"},{"id":"YZZ","value":"YZZ"},{"id":"ZXX","value":"ZXX"},{"id":"ZXY","value":"ZXY"},{"id":"ZXZ","value":"ZXZ"},{"id":"ZYX","value":"ZYX"},{"id":"ZYY","value":"ZYY"},{"id":"ZYZ","value":"ZYZ"},{"id":"ZZX","value":"ZZX"},{"id":"ZZY","value":"ZZY"},{"id":"ZZZ","value":"ZZZ"}],"dataSourceType":"segmentto","left":810,"idx":6},"rawValue":[{"value":"ZYY","label":"ZYY"}]}'
        );
        component
            .setStateAsync({
                subDataSet: [...data.slice(0, pageSize)],
                pageRowCount: 10,
                searchValue: "test",
                junk: { segmentto: [] },
                dataSet: [...data.slice(0, pageSize)]
            })
            .then(() => {
                const d = component.handleFilterChange(filterVal);
                expect(d).not.toBeNull();
            });
    });
});
test("Spreadsheet - setTableAsPerSortingParams 2", () => {
    act(() => {
        const component = ReactTestUtils.renderIntoDocument(
            <Spreadsheet {...props} columns={[...columns]} />
        );
        component.handleTableSortSwap([1, 0]);
        component
            .setStateAsync({
                dataSet: [...data.slice(0, pageSize)],
                searchValue: "",
                sortDirection: "ASC",
                sortColumn: "",
                sortingOrderSwapList: []
            })
            .then(() => {
                const d = component.setTableAsPerSortingParams([
                    {},
                    {
                        order: "Ascending",
                        sortBy: "bodyType",
                        sortOn: "Value"
                    }
                ]);
                expect(d).not.toBeNull();
            });
    });
});
test("Spreadsheet - getSlicedRows 3", () => {
    act(() => {
        const component = ReactTestUtils.renderIntoDocument(
            <Spreadsheet {...props} columns={[...columns]} />
        );
        const filters = JSON.parse(
            '{"segmentto":{"filterTerm":[{"value":"CCC","label":"CCC"}],"column":{"rowType":"filter","key":"segmentto","name":"Segment To","draggable":false,"editor":{"key":null,"ref":null,"props":{"options":[{"id":"AAA","value":"AAA"},{"id":"AAB","value":"AAB"},{"id":"AAC","value":"AAC"},{"id":"ABA","value":"ABA"},{"id":"ABB","value":"ABB"},{"id":"ABC","value":"ABC"},{"id":"ACA","value":"ACA"},{"id":"ACB","value":"ACB"},{"id":"ACC","value":"ACC"},{"id":"BAA","value":"BAA"},{"id":"BAB","value":"BAB"},{"id":"BAC","value":"BAC"},{"id":"BBA","value":"BBA"},{"id":"BBB","value":"BBB"},{"id":"BBC","value":"BBC"},{"id":"BCA","value":"BCA"},{"id":"BCB","value":"BCB"},{"id":"BCC","value":"BCC"},{"id":"CAA","value":"CAA"},{"id":"CAB","value":"CAB"},{"id":"CAC","value":"CAC"},{"id":"CBA","value":"CBA"},{"id":"CBB","value":"CBB"},{"id":"CBC","value":"CBC"},{"id":"CCA","value":"CCA"},{"id":"CCB","value":"CCB"},{"id":"CCC","value":"CCC"},{"id":"XXX","value":"XXX"},{"id":"XXY","value":"XXY"},{"id":"XXZ","value":"XXZ"},{"id":"XYX","value":"XYX"},{"id":"XYY","value":"XYY"},{"id":"XYZ","value":"XYZ"},{"id":"XZX","value":"XZX"},{"id":"XZY","value":"XZY"},{"id":"XZZ","value":"XZZ"},{"id":"YXX","value":"YXX"},{"id":"YXY","value":"YXY"},{"id":"YXZ","value":"YXZ"},{"id":"YYX","value":"YYX"},{"id":"YYY","value":"YYY"},{"id":"YYZ","value":"YYZ"},{"id":"YZX","value":"YZX"},{"id":"YZY","value":"YZY"},{"id":"YZZ","value":"YZZ"},{"id":"ZXX","value":"ZXX"},{"id":"ZXY","value":"ZXY"},{"id":"ZXZ","value":"ZXZ"},{"id":"ZYX","value":"ZYX"},{"id":"ZYY","value":"ZYY"},{"id":"ZYZ","value":"ZYZ"},{"id":"ZZX","value":"ZZX"},{"id":"ZZY","value":"ZZY"},{"id":"ZZZ","value":"ZZZ"}]},"_owner":null,"_store":{}},"formulaApplicable":false,"sortable":true,"resizable":true,"filterable":true,"width":150,"filterType":"autoCompleteFilter","dataSource":[{"id":"AAA","value":"AAA"},{"id":"AAB","value":"AAB"},{"id":"AAC","value":"AAC"},{"id":"ABA","value":"ABA"},{"id":"ABB","value":"ABB"},{"id":"ABC","value":"ABC"},{"id":"ACA","value":"ACA"},{"id":"ACB","value":"ACB"},{"id":"ACC","value":"ACC"},{"id":"BAA","value":"BAA"},{"id":"BAB","value":"BAB"},{"id":"BAC","value":"BAC"},{"id":"BBA","value":"BBA"},{"id":"BBB","value":"BBB"},{"id":"BBC","value":"BBC"},{"id":"BCA","value":"BCA"},{"id":"BCB","value":"BCB"},{"id":"BCC","value":"BCC"},{"id":"CAA","value":"CAA"},{"id":"CAB","value":"CAB"},{"id":"CAC","value":"CAC"},{"id":"CBA","value":"CBA"},{"id":"CBB","value":"CBB"},{"id":"CBC","value":"CBC"},{"id":"CCA","value":"CCA"},{"id":"CCB","value":"CCB"},{"id":"CCC","value":"CCC"},{"id":"XXX","value":"XXX"},{"id":"XXY","value":"XXY"},{"id":"XXZ","value":"XXZ"},{"id":"XYX","value":"XYX"},{"id":"XYY","value":"XYY"},{"id":"XYZ","value":"XYZ"},{"id":"XZX","value":"XZX"},{"id":"XZY","value":"XZY"},{"id":"XZZ","value":"XZZ"},{"id":"YXX","value":"YXX"},{"id":"YXY","value":"YXY"},{"id":"YXZ","value":"YXZ"},{"id":"YYX","value":"YYX"},{"id":"YYY","value":"YYY"},{"id":"YYZ","value":"YYZ"},{"id":"YZX","value":"YZX"},{"id":"YZY","value":"YZY"},{"id":"YZZ","value":"YZZ"},{"id":"ZXX","value":"ZXX"},{"id":"ZXY","value":"ZXY"},{"id":"ZXZ","value":"ZXZ"},{"id":"ZYX","value":"ZYX"},{"id":"ZYY","value":"ZYY"},{"id":"ZYZ","value":"ZYZ"},{"id":"ZZX","value":"ZZX"},{"id":"ZZY","value":"ZZY"},{"id":"ZZZ","value":"ZZZ"}],"dataSourceType":"segmentto","left":810,"idx":6},"rawValue":[{"value":"ZYY","label":"ZYY"}]}}'
        );
        console.log("getSlicedRows 3");
        component
            .setStateAsync({
                subDataSet: [...data.slice(0, 1)],
                dataSet: [...data.slice(0, 1)],
                searchValue: "testttststt",
                pageIndex: 1,
                pageRowCount: 1,
                sortingParamsObjectList: [],
                junk: []
            })
            .then(() => {
                const d = component.getSlicedRows(
                    filters,
                    [...data.slice(0, 1)],
                    []
                );
                expect(d).not.toBeNull();
            });
    });
});
