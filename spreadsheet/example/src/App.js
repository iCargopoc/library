import React, { useState, useEffect } from "react";
import Spreadsheet from "spreadsheet";
import CargoData from "./data.json";
//import { fetchData } from "./getData";

const App = (props) => {
    //Get spreadsheet height value, which is a required value
    const gridHeight = "90vh";
    //Set state value for variable to hold grid data
    const [data, setData] = useState();
    const rows = CargoData;

    // Spreadsheet page size
    const pageSize = 500;
    const maxLeftPinnedColumn = 5;
    //Configure columns and its related featues such as editor(Text/DropDown), FormulaApplicable(True/False)
    //Editable, Draggable, sortable, resizable, filterable, default width
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
        },
        {
            key: "uldvalue3",
            name: "uldvalue3",
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
            key: "uldposition4",
            name: "uldposition4",
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
            key: "uldvalue4",
            name: "uldvalue4",
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
            key: "sr",
            name: "SR",
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
            key: "queuedBookingSR",
            name: "Queued Booking SR",
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
            key: "queuedBookingvolume",
            name: "Queued Booking Volume",
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

    //Configure columns and its related functions
    const airportCodeList = [
        "AAA",
        "AAB",
        "AAC",
        "ABA",
        "ABB",
        "ABC",
        "ACA",
        "ACB",
        "ACC",
        "BAA",
        "BAB",
        "BAC",
        "BBA",
        "BBB",
        "BBC",
        "BCA",
        "BCB",
        "BCC",
        "CAA",
        "CAB",
        "CAC",
        "CBA",
        "CBB",
        "CBC",
        "CCA",
        "CCB",
        "CCC",
        "XXX",
        "XXY",
        "XXZ",
        "XYX",
        "XYY",
        "XYZ",
        "XZX",
        "XZY",
        "XZZ",
        "YXX",
        "YXY",
        "YXZ",
        "YYX",
        "YYY",
        "YYZ",
        "YZX",
        "YZY",
        "YZZ",
        "ZXX",
        "ZXY",
        "ZXZ",
        "ZYX",
        "ZYY",
        "ZYZ",
        "ZZX",
        "ZZY",
        "ZZZ"
    ];

    //Gets called when there is a cell edit
    const updateCellData = (fromRow, toRow, value, updateType) => {
        if (updateType === "CELL_UPDATE") {
            console.log(
                "Starting row:",
                fromRow,
                "updated-Value:",
                value,
                "Updation-Type:",
                updateType,
                "Ending Row:",
                toRow
            );
        }
        if (updateType === "CELL_DRAG") {
            console.log(
                "fromRow:",
                fromRow,
                "toRow:",
                toRow,
                "updated-Value:",
                value,
                "Updation-Type:",
                updateType
            );
        }
    };

    //Gets called when row bulk edit is done
    const selectBulkData = (selectedRows) => {
        console.log("selectedRows:", selectedRows);
    };

    useEffect(() => {
        //Make API call to fetch initial set of data, uncomment below code to use API call
        // fetchData(0).then((data) => {
        //   setItems(data);
        // });
        setData(rows);
    }, [rows]);

    if (data) {
        return (
            <div>
                <Spreadsheet
                    rows={data.slice(0, pageSize)}
                    dataSet={data}
                    pageSize={pageSize}
                    count={pageSize}
                    columns={columns}
                    airportCodes={airportCodeList}
                    gridHeight={gridHeight}
                    updateCellData={updateCellData}
                    selectBulkData={selectBulkData}
                    maxLeftPinnedColumn={maxLeftPinnedColumn}
                />
            </div>
        );
    } else if (data === undefined) {
        return <h2>Loading Data</h2>;
    } else {
        return null;
    }
};

export default App;
