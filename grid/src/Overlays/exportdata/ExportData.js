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
    const [clickTag, setClickTag] = useState("none");

    var downLaodFileType = [];

    const selectDownLoadType = (event) => {
        if (event.target.checked && !downLaodFileType.includes(event.target.value)) {
            downLaodFileType.push(event.target.value);
        } else {
            downLaodFileType.map(function (value, index) {
                if (value === event.target.value) {
                    downLaodFileType = downLaodFileType.splice(index, value);
                }
            });
        }
    };

    const exportRowData = () => {
      debugger
        let filteredRow = [];
        if (searchedColumns.length > 0 && downLaodFileType.length > 0) {
            props.rows.forEach((row) => {
                const keys = Object.getOwnPropertyNames(row);
                let filteredColumnVal = {};
                keys.forEach(function (key) {
                    searchedColumns.forEach((columnName) => {
                        if (columnName.accessor === key) {
                            let columnVlaue = "";
                            if (typeof row[key] === "object") {
                                if (row[key].length === undefined)
                                    columnVlaue = Object.values(row[key]).toString().replace(",", " | ");
                                if (row[key].length > 0) {
                                    columnVlaue = row[key].map((item) => {
                                        return columnVlaue != " "
                                            ? " | " + item.position + " " + item.value
                                            : item.position + " " + item.value;
                                    });
                                }
                            } else {
                                columnVlaue = row[key];
                            }
                            filteredColumnVal[key] = columnVlaue;
                        }
                    });
                });
                filteredRow.push(filteredColumnVal);
            });

            downLaodFileType.map((item) => {
                if (item === "pdf") downloadPDF();
                else if (item === "excel") downloadXLSFile(filteredRow);
                else downloadCSVFile(filteredRow);
            });
        } else {
            if (searchedColumns.length === 0 && downLaodFileType.length === 0) {
                setWarning("You haven't selected File Type & Column");
                setClickTag("");
            }
            if (searchedColumns.length === 0) {
                setWarning("You haven't selected Column ");
                setClickTag("");
            }
            if (downLaodFileType.length === 0) {
                setWarning("You haven't selected File Type");
                setClickTag("");
            }
        }
    };

    const downloadPDF = () => {
        const unit = "pt";
        const size = "A4"; // Use A1, A2, A3 or A4
        const orientation = "landscape"; // portrait or landscape

        const marginLeft = 300;
        const doc = new jsPDF(orientation, unit, size);

        doc.setFontSize(15);

        const title = "iCargo Report";
        const headers = [
            searchedColumns.map((column) => {
                return column.Header;
            })
        ];
        let dataValues = [];
        props.rows.forEach((row) => {
            const keys = Object.keys(row);
            let filteredColumnVal = [];
            searchedColumns.forEach((columnName) => {
                keys.forEach((key) => {
                    if (columnName.accessor === key) {
                        let columnVlaue = "";
                        if (typeof row[key] === "object") {
                            if (row[key].length === undefined)
                                columnVlaue = Object.values(row[key]).toString().replace(",", " | ");
                            if (row[key].length > 0) {
                                columnVlaue = row[key].map((item) => {
                                    return columnVlaue != " "
                                        ? " | " + item.position + " " + item.value
                                        : item.position + " " + item.value;
                                });
                            }
                        } else {
                            columnVlaue = row[key];
                        }
                        filteredColumnVal.push(columnVlaue);
                    }
                });
            });
            dataValues.push(filteredColumnVal);
        });

        let content = {
            startY: 50,
            head: headers,
            body: dataValues
        };

        doc.text(title, marginLeft, 40);
        doc.autoTable(content);
        doc.save("report.pdf");
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
        if (event.currentTarget.checked) {
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

    // const exportValidation = () => {
    //     let columnLength = searchedColumns.length;
    //     let fileLength = downLaodFileType.length;
    //     if (columnLength > 0 && fileLength > 0) {
    //         exportRowData();
    //         setClickTag("none");
    //     } else if (columnLength === 0) {
    //         setWarning("You haven't selected Column ");
    //         setClickTag("");
    //     } else if (fileLength === 0) {
    //         setWarning("You haven't selected File Type");
    //         setClickTag("");
    //     }
    //     if (columnLength === 0 && fileLength === 0) {
    //         setWarning("You haven't selected File Type & Column");
    //         setClickTag("");
    //     }
    // };

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
                                <input type="checkbox" name="pdf" value="pdf" onChange={selectDownLoadType}></input>
                            </div>
                            <div className="export__file">
                                <FontAwesomeIcon icon={faFilePdf} className="temp"></FontAwesomeIcon>
                            </div>
                        </div>
                        <div className="export__reorder">
                            <div className="">
                                <input type="checkbox" name="excel" value="excel" onChange={selectDownLoadType}></input>
                            </div>
                            <div className="export__file">
                                <FontAwesomeIcon icon={faFileExcel} className="temp"></FontAwesomeIcon>
                            </div>
                        </div>
                        <div className="export__reorder">
                            <div className="">
                                <input type="checkbox" name="csv" value="csv" onChange={selectDownLoadType}></input>
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
                    </div>
                    <div className="export__footer">
                        <div className="export__btns">
                            <button className="btns" onClick={props.closeExport}>
                                Cancel
                            </button>
                            <button
                                className="btns btns__save"
                                onClick={exportRowData}
                            >
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
