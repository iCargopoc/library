import React, { memo, useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faFilePdf, faFileExcel, faFileCsv } from "@fortawesome/free-solid-svg-icons";

import jsPDF from "jspdf";
import "jspdf-autotable";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";

const ColumnReordering = memo((props) => {
    const { originalColumns } = props;

    const [managedColumns, setManagedColumns] = useState(originalColumns);
    const [searchedColumns, setSearchedColumns] = useState(originalColumns);

    const [warning, setWarning] = useState("");

    let isDownload = false;

    const exportRowData = () => {
        isDownload = true;
        let filteredRow = [];
        let filteredRowValues = [];
        let downLaodFileType = [];
        let downLaodFileTypeCount = document.getElementsByName("fileType[]").length;
        for (let i = 0; i < downLaodFileTypeCount; i++) {
            if (document.getElementsByName("fileType[]")[i].checked == true) {
                downLaodFileType.push(document.getElementsByName("fileType[]")[i].value);
            }
        }

        setWarning("");
        if (managedColumns.length > 0 && downLaodFileType.length > 0) {
            props.rows.forEach((rowDetails) => {
                let row = rowDetails.original;
                const keys = Object.getOwnPropertyNames(row);
                let filteredColumnVal = {};
                let rowFilteredValues = [];
                keys.forEach(function (key) {
                    managedColumns.forEach((columnName) => {
                        if (columnName.accessor === key) {
                            let columnValue = "";
                            if (typeof row[key] === "object") {
                                if (row[key].length === undefined)
                                    columnValue = Object.values(row[key]).toString().replace(",", " | ");
                                if (row[key].length > 0) {
                                    let arrObj = "";
                                    row[key].forEach((item, index) => {
                                        arrObj = index != 0 ? arrObj + " | " + Object.values(item) : Object.values(item);
                                    });
                                    columnValue = arrObj;
                                }
                            } else {
                                columnValue = row[key];
                            }
                            filteredColumnVal[key] = columnValue;
                            rowFilteredValues.push(columnValue);
                        }
                    });
                });
                filteredRow.push(filteredColumnVal);
                filteredRowValues.push(rowFilteredValues);
            });

            downLaodFileType.map((item) => {
                if (item === "pdf") downloadPDF(filteredRowValues);
                else if (item === "excel") downloadXLSFile(filteredRow);
                else downloadCSVFile(filteredRow);
            });
        } else {
            if (managedColumns.length === 0 && downLaodFileType.length === 0) {
                setWarning("You haven't selected File Type & Column");
            } else if (managedColumns.length === 0) {
                setWarning("You haven't selected Column ");
            } else if (downLaodFileType.length === 0) {
                setWarning("You haven't selected File Type");
            }
        }
    };

    const downloadPDF = (rowFilteredValues) => {
        const unit = "pt";
        const size = "A4"; // Use A1, A2, A3 or A4
        const orientation = "landscape"; // portrait or landscape

        const marginLeft = 300;
        const doc = new jsPDF(orientation, unit, size);

        doc.setFontSize(15);

        const title = "iCargo Report";
        const headers = [
            managedColumns.map((column) => {
                return column.Header;
            })
        ];

        let content = {
            startY: 50,
            head: headers,
            body: rowFilteredValues
        };

        doc.text(title, marginLeft, 40);
        doc.autoTable(content);
        doc.save("report.pdf");

        isDownload = false;
    };

    const downloadCSVFile = (filteredRowValue) => {
        const fileType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
        const fileExtension = ".csv";
        const fileName = "CSVDownload";
        const ws = XLSX.utils.json_to_sheet(filteredRowValue);
        const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
        const excelBuffer = XLSX.write(wb, { bookType: "csv", type: "array" });
        const data = new Blob([excelBuffer], { type: fileType });
        FileSaver.saveAs(data, fileName + fileExtension);
    };

    const downloadXLSFile = (filteredRowValue) => {
        const fileType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
        const fileExtension = ".xlsx";
        const fileName = "XLSXDownload";
        const ws = XLSX.utils.json_to_sheet(filteredRowValue);
        const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
        const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
        const data = new Blob([excelBuffer], { type: fileType });
        FileSaver.saveAs(data, fileName + fileExtension);
    };

    const columnSearchLogic = (event) => {
        let { value } = event ? event.target : "";
        value = value.toLowerCase();
        if (value != "") {
            setSearchedColumns(
                originalColumns.filter((column) => {
                    return column.Header.toLowerCase().includes(value);
                })
            );
        } else {
            setSearchedColumns(originalColumns);
        }
    };

    const isCheckboxSelected = (header) => {
        if (header === "Select All") {
            return managedColumns.length === searchedColumns.length;
        } else {
            const selectedColumn = managedColumns.filter((column) => {
                return column.Header === header;
            });
            return selectedColumn && selectedColumn.length > 0;
        }
    };

    const selectAllColumns = (event) => {
        if (event.target.checked) {
            setManagedColumns(searchedColumns);
        } else {
            setManagedColumns([]);
        }
    };

    const selectSingleColumn = (event) => {
        const { currentTarget } = event;
        const { checked, value } = currentTarget;

        //If column checkbox is checked
        if (checked) {
            //Find the index of selected column from original column array and also find the user selected column
            let indexOfColumnToAdd = originalColumns.findIndex((column) => {
                return column.Header == value;
            });
            const itemToAdd = originalColumns[indexOfColumnToAdd];

            //Loop through the managedColumns array to find the position of the column that is present previous to the user selected column
            //Find index of that previous column and push the new column to add in that position
            let prevItemIndex = -1;
            while (indexOfColumnToAdd > 0 && prevItemIndex === -1) {
                prevItemIndex = managedColumns.findIndex((column) => {
                    return column.Header == originalColumns[indexOfColumnToAdd - 1].Header;
                });
                indexOfColumnToAdd = indexOfColumnToAdd - 1;
            }

            const newColumnsList = managedColumns.slice(0); //Copying state value
            newColumnsList.splice(prevItemIndex + 1, 0, itemToAdd);
            setManagedColumns(newColumnsList);
        } else {
            setManagedColumns(
                managedColumns.filter((column) => {
                    return column.Header !== value;
                })
            );
        }
    };

    return (
        <div className="exports--grid">
            <div className="export__grid">
                <div className="export__chooser">
                    <div className="export__header">
                        <div className="">
                            <strong>Export Data</strong>
                        </div>
                    </div>
                    <div className="export__body">
                        <div>
                            <input
                                type="text"
                                placeholder="Search export"
                                className="custom__ctrl"
                                onChange={columnSearchLogic}
                            ></input>
                        </div>
                        <div className="export__wrap export__headertxt">
                            <div className="export__checkbox">
                                <input
                                    type="checkbox"
                                    value="Select All"
                                    checked={isCheckboxSelected("Select All")}
                                    onChange={selectAllColumns}
                                />
                            </div>
                            <div className="export__txt">Select All</div>
                        </div>
                        {searchedColumns.map((column, index) => {
                            return (
                                <div className="export__wrap" key={index}>
                                    <div className="export__checkbox">
                                        <input
                                            type="checkbox"
                                            value={column.Header}
                                            checked={isCheckboxSelected(column.Header)}
                                            onChange={selectSingleColumn}
                                        ></input>
                                    </div>
                                    <div className="export__txt">{column.Header}</div>
                                </div>
                            );
                        })}
                    </div>
                </div>
                <div className="export__settings">
                    <div className="export__header">
                        <div className="export__headerTxt"></div>
                        <div className="export__close">
                            <FontAwesomeIcon icon={faTimes} className="icon-close" onClick={props.closeExport}></FontAwesomeIcon>
                        </div>
                    </div>
                    <div className="export__as">Export as</div>
                    <div className="export__body">
                        <div className="export__reorder">
                            <div className="">
                                <input type="checkbox" id="fileType[]" name="fileType[]" value="pdf"></input>
                            </div>
                            <div className="export__file">
                                <FontAwesomeIcon icon={faFilePdf} className="temp"></FontAwesomeIcon>
                            </div>
                        </div>
                        <div className="export__reorder">
                            <div className="">
                                <input type="checkbox" id="fileType[]" name="fileType[]" value="excel"></input>
                            </div>
                            <div className="export__file">
                                <FontAwesomeIcon icon={faFileExcel} className="temp"></FontAwesomeIcon>
                            </div>
                        </div>
                        <div className="export__reorder">
                            <div className="">
                                <input type="checkbox" id="fileType[]" name="fileType[]" value="csv"></input>
                            </div>
                            <div className="export__file">
                                <FontAwesomeIcon icon={faFileCsv} className="temp"></FontAwesomeIcon>
                            </div>
                        </div>
                        <div className="exportWarning">
                            <span className="alert alert-danger">
                                <strong>{warning}</strong>
                            </span>
                        </div>
                        <div>{isDownload ? <h2 style={{ textAlign: "center" }}>Loading...</h2> : null}</div>
                    </div>
                    <div className="export__footer">
                        <div className="export__btns">
                            <button className="btns" onClick={props.closeExport}>
                                Cancel
                            </button>
                            <button className="btns btns__save" onClick={exportRowData}>
                                Export
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
});

export default ColumnReordering;
