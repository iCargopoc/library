/* eslint-disable import/no-unresolved */
import React, { useState, useEffect } from "react";

import Spreadsheet from "../src/index";
import CargoData from "./data.json";
import "./example.css";
import "./variables.css";

const GridComponent = (props) => {
    const {
        isTitle,
        gridHeight,
        isGlobalSearch,
        columnFilterStyle,
        isGroupSort,
        isColumnChooser,
        isExportData,
        isSelectAll,
        isHeader,
        noBorderClassName,
        isAddRow,
        isDeleteRow
    } = props;
    const rows = CargoData;
    const pageSize = 500;
    const maxLeftPinnedColumn = 5;

    const [data, setData] = useState();

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
            filterType: "autoCompleteFilter",
            dataSource: []
        },
        {
            key: "tiltable",
            name: "Tiltable",
            draggable: false,
            editor: "Checkbox",
            formulaApplicable: false,
            sortable: true,
            resizable: false,
            filterable: true,
            width: 150
        },
        {
            key: "stackable",
            name: "Stackable",
            draggable: false,
            editor: "Checkbox",
            formulaApplicable: false,
            sortable: true,
            resizable: false,
            filterable: true,
            width: 150
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
            filterType: "autoCompleteFilter",
            dataSource: []
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
            filterType: "numeric",
            dataSource: []
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
            filterType: "autoCompleteFilter",
            dataSource: []
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
            filterType: "autoCompleteFilter",
            dataSource: []
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
            filterType: "autoCompleteFilter",
            dataSource: []
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
            filterType: "autoCompleteFilter",
            dataSource: []
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
            filterType: "autoCompleteFilter",
            dataSource: []
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
            filterType: "autoCompleteFilter",
            dataSource: []
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
            filterType: "autoCompleteFilter",
            dataSource: []
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
            filterType: "autoCompleteFilter",
            dataSource: []
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
            filterType: "autoCompleteFilter",
            dataSource: []
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
            filterType: "autoCompleteFilter",
            dataSource: []
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
            filterType: "autoCompleteFilter",
            dataSource: []
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
            filterType: "autoCompleteFilter",
            dataSource: []
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
            filterType: "autoCompleteFilter",
            dataSource: []
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
            filterType: "autoCompleteFilter",
            dataSource: []
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
            filterType: "autoCompleteFilter",
            dataSource: []
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
            filterType: "autoCompleteFilter",
            dataSource: []
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
            filterType: "autoCompleteFilter",
            dataSource: []
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
            filterType: "autoCompleteFilter",
            dataSource: []
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
            filterType: "autoCompleteFilter",
            dataSource: []
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
            filterType: "autoCompleteFilter",
            dataSource: []
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
            filterType: "autoCompleteFilter",
            dataSource: []
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
            filterType: "autoCompleteFilter",
            dataSource: []
        }
    ];

    const segmenToCode = [
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

    const segmentFromCode = [
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
        "CCC"
    ];

    const addNewRow = (updatedRowsList) => {
        setData(updatedRowsList);
    };

    const deleteRow = (updatedRowsList, selectedIndexes) => {
        console.log(selectedIndexes);
        setData(updatedRowsList);
    };

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

    const selectBulkData = (selectedRows) => {
        console.log("selectedRows:", selectedRows);
    };

    columns.forEach((item) => {
        if (item.key === "segmentto") {
            const tempArray = [];
            segmenToCode.forEach((it) => {
                tempArray.push({ id: it, value: it });
            });
            item.dataSource = tempArray;
        } else if (item.key === "segmentfrom") {
            const tempArray = [];
            segmentFromCode.forEach((it) => {
                tempArray.push({ id: it, value: it });
            });
            item.dataSource = tempArray;
        }
    });

    useEffect(() => {
        // Make API call to fetch initial set of data, uncomment below code to use API call
        // fetchData(0).then((data) => {
        //   setItems(data);
        // });
        setData(rows);
    }, [rows]);

    /**
     * Method To render updated rows
     * @param {*} rows is the updated row values
     */
    const updatedRows = ({ fromRow, toRow, updated }) => {
        const tempData = [...data];
        const temp = tempData.slice();
        for (let i = fromRow; i <= toRow; i++) {
            temp[i] = {
                ...temp[i],
                ...updated
            };
        }
        setData(temp);
        console.log("UpdatedRows:", temp);
    };

    if (data === undefined) {
        return <h2>Loading Data</h2>;
    }

    if (data) {
        return (
            <Spreadsheet
                isTitle={isTitle}
                rows={data.slice(0, pageSize)}
                dataSet={data}
                pageSize={pageSize}
                count={pageSize}
                columns={columns}
                gridHeight={gridHeight}
                updateCellData={updateCellData}
                selectBulkData={selectBulkData}
                maxLeftPinnedColumn={maxLeftPinnedColumn}
                updatedRows={updatedRows}
                isGlobalSearch={isGlobalSearch}
                columnFilterStyle={columnFilterStyle}
                isGroupSort={isGroupSort}
                isColumnChooser={isColumnChooser}
                isExportData={isExportData}
                isSelectAll={isSelectAll}
                isHeader={isHeader}
                isAddRow={isAddRow}
                isDeleteRow={isDeleteRow}
                noBorderClassName={noBorderClassName}
                addNewRows={addNewRow}
                deleteRows={deleteRow}
            />
        );
    }
    return null;
};

export default GridComponent;
