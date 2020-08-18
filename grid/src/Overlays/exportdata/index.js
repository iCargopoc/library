import React, { memo, useState, useEffect } from "react";
import ClickAwayListener from "react-click-away-listener";
import PropTypes from "prop-types";
import JsPdf from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import { ReactComponent as IconCsv } from "../../Images/icon-csv.svg";
import { ReactComponent as IconExcel } from "../../Images/icon-excel.svg";
import { ReactComponent as IconPdf } from "../../Images/icon-pdf.svg";
import { ReactComponent as IconClose } from "../../Images/icon-close.svg";

const ExportData = memo((props) => {
    const {
        isExportOverlayOpen,
        toggleExportDataOverlay,
        rows,
        originalColumns,
        columns,
        isRowExpandEnabled,
        isExpandContentAvailable,
        additionalColumn
    } = props;

    // Check if row expand is configured by developer
    const getRemarksColumnIfAvailable = () => {
        return isExpandContentAvailable ? additionalColumn : [];
    };

    // Check if row expand is set visible from manage overlay
    const getRemarksColumnIfSelectedByUser = () => {
        return isRowExpandEnabled ? additionalColumn : [];
    };

    // Full list of columns + expand column
    const updatedColumns = [...originalColumns].concat(
        getRemarksColumnIfAvailable()
    );

    // List of columns + expand based on user selection from manage overlay
    const updatedColumnsPerUserSelection = [...columns].concat(
        getRemarksColumnIfSelectedByUser()
    );

    const [managedColumns, setManagedColumns] = useState(
        updatedColumnsPerUserSelection
    );
    const [searchedColumns, setSearchedColumns] = useState(updatedColumns);
    const [downloadTypes, setDownloadTypes] = useState([]);
    const [warning, setWarning] = useState("");

    let isDownload = false;

    const downloadPDF = (rowFilteredValues, rowFilteredHeader) => {
        const unit = "pt";
        const size = "A4"; // Use A1, A2, A3 or A4
        const orientation = "landscape"; // portrait or landscape

        const doc = new JsPdf(orientation, unit, size);

        doc.setFontSize(12);
        const title = "iCargo Neo Report";

        const content = {
            startY: 50,
            head: rowFilteredHeader,
            body: rowFilteredValues,
            tableWidth: "wrap", // 'auto'|'wrap'|'number'
            headStyles: { fillColor: [102, 102, 255] },
            theme: "grid", // 'striped'|'grid'|'plain'|'css'
            margin: { top: 30, right: 30, bottom: 10, left: 30 }
        };

        doc.text(title, 30, 40);
        doc.autoTable(content);
        doc.save("iCargo Neo Report.pdf");

        isDownload = false;
    };

    const downloadCSVFile = async (filteredRowValue) => {
        const fileType =
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
        const fileExtension = ".csv";
        const fileName = "iCargo Neo Report";
        const ws = XLSX.utils.json_to_sheet(filteredRowValue);
        const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
        const excelBuffer = XLSX.write(wb, { bookType: "csv", type: "array" });
        const data = new Blob([excelBuffer], { type: fileType });
        const href = await URL.createObjectURL(data);
        const link = document.createElement("a");
        link.href = href;
        link.download = fileName + fileExtension;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const downloadXLSFile = async (filteredRowValue) => {
        const fileType =
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
        const fileExtension = ".xlsx";
        const fileName = "iCargo Neo Report";
        const ws = XLSX.utils.json_to_sheet(filteredRowValue);
        const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
        const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
        const data = new Blob([excelBuffer], { type: fileType });
        const href = await URL.createObjectURL(data);
        const link = document.createElement("a");
        link.href = href;
        link.download = fileName + fileExtension;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const exportRowData = () => {
        isDownload = true;
        const filteredRow = [];
        const filteredRowValues = [];
        const filteredRowHeader = [];

        setWarning("");

        if (managedColumns.length > 0 && downloadTypes.length > 0) {
            const rowLength = rows && rows.length > 0 ? rows.length : 0;
            rows.forEach((rowDetails, index) => {
                const row = rowDetails.original;
                const filteredColumnVal = {};
                const rowFilteredValues = [];
                const rowFilteredHeader = [];
                managedColumns.forEach((columnName) => {
                    const {
                        Header,
                        accessor,
                        originalInnerCells,
                        displayInExpandedRegion
                    } = columnName;
                    const isInnerCellsPresent =
                        originalInnerCells && originalInnerCells.length > 0;
                    const accessorRowValue = row[accessor];
                    let columnValue = "";
                    let columnHeader = "";
                    // For grid columns (not the one in expanded section)
                    if (accessor) {
                        if (
                            isInnerCellsPresent &&
                            typeof accessorRowValue === "object"
                        ) {
                            originalInnerCells.forEach((cell) => {
                                const innerCellAccessor = cell.accessor;
                                const innerCellHeader = cell.Header;
                                const innerCellAccessorValue =
                                    accessorRowValue[innerCellAccessor];
                                if (accessorRowValue.length > 0) {
                                    accessorRowValue.forEach(
                                        (item, itemIndex) => {
                                            columnValue = item[
                                                innerCellAccessor
                                            ].toString();
                                            columnHeader = `${Header} - ${innerCellHeader}_${itemIndex}`;
                                            filteredColumnVal[
                                                columnHeader
                                            ] = columnValue;
                                            rowFilteredValues.push(columnValue);
                                            rowFilteredHeader.push(
                                                columnHeader
                                            );
                                        }
                                    );
                                } else if (innerCellAccessorValue) {
                                    columnValue = innerCellAccessorValue;
                                    columnHeader = `${Header} - ${innerCellHeader}`;
                                    filteredColumnVal[
                                        columnHeader
                                    ] = columnValue;
                                    rowFilteredValues.push(columnValue);
                                    rowFilteredHeader.push(columnHeader);
                                }
                            });
                        } else {
                            columnValue = accessorRowValue;
                            columnHeader = Header;
                            filteredColumnVal[columnHeader] = columnValue;
                            rowFilteredValues.push(columnValue);
                            rowFilteredHeader.push(columnHeader);
                        }
                    } else if (displayInExpandedRegion && isInnerCellsPresent) {
                        // For column in the expanded section
                        originalInnerCells.forEach((expandedCell) => {
                            const expandedCellAccessor = expandedCell.accessor;
                            const expandedCellHeader = expandedCell.Header;
                            const expandedCellValue = row[expandedCellAccessor];
                            let formattedValue = expandedCellValue;
                            if (typeof expandedCellValue === "object") {
                                if (expandedCellValue.length > 0) {
                                    const newValues = [];
                                    expandedCellValue.forEach((cellValue) => {
                                        newValues.push(
                                            Object.values(cellValue).join("--")
                                        );
                                    });
                                    formattedValue = newValues.join("||");
                                } else {
                                    formattedValue = Object.values(
                                        expandedCellValue
                                    ).join("||");
                                }
                            }
                            columnValue = formattedValue;
                            columnHeader = expandedCellHeader;
                            filteredColumnVal[columnHeader] = columnValue;
                            rowFilteredValues.push(columnValue);
                            rowFilteredHeader.push(columnHeader);
                        });
                    }
                });
                filteredRow.push(filteredColumnVal);
                filteredRowValues.push(rowFilteredValues);
                if (rowLength === index + 1)
                    filteredRowHeader.push(rowFilteredHeader);
            });

            downloadTypes.forEach((item) => {
                if (item === "pdf") {
                    downloadPDF(filteredRowValues, filteredRowHeader);
                } else if (item === "excel") {
                    downloadXLSFile(filteredRow);
                } else {
                    downloadCSVFile(filteredRow);
                }
            });
        } else if (managedColumns.length === 0 && downloadTypes.length === 0) {
            setWarning("Select at least one column and a file type");
        } else if (managedColumns.length === 0) {
            setWarning("Select at least one column");
        } else if (downloadTypes.length === 0) {
            setWarning("Select at least one file type");
        }
    };

    const filterColumnsList = (event) => {
        let { value } = event ? event.target : "";
        value = value ? value.toLowerCase() : "";
        if (value !== "") {
            setSearchedColumns(
                originalColumns
                    .filter((column) => {
                        return column.Header.toLowerCase().includes(value);
                    })
                    .concat(
                        getRemarksColumnIfAvailable().filter((column) => {
                            return column.Header.toLowerCase().includes(value);
                        })
                    )
            );
        } else {
            setSearchedColumns(updatedColumns);
        }
    };

    const isCheckboxSelected = (header) => {
        if (header === "Select All") {
            return managedColumns.length === searchedColumns.length;
        }
        const selectedColumn = managedColumns.filter((column) => {
            return column.Header === header;
        });
        return selectedColumn && selectedColumn.length > 0;
    };

    const selectAllColumns = (event) => {
        if (event.target.checked) {
            setManagedColumns(updatedColumns);
        } else {
            setManagedColumns([]);
        }
    };

    const selectSingleColumn = (event) => {
        const { currentTarget } = event;
        const { checked, value } = currentTarget;

        // If column checkbox is checked
        if (checked) {
            // Find the index of selected column from original column array and also find the user selected column
            const indexOfColumnToAdd = updatedColumns.findIndex((column) => {
                return column.Header === value;
            });
            const itemToAdd = updatedColumns[indexOfColumnToAdd];

            // Loop through the managedColumns array to find the position of the column that is present previous to the user selected column
            // Find index of that previous column and push the new column to add in that position
            let prevItemIndex = -1;
            for (let i = indexOfColumnToAdd; i > 0; i--) {
                if (prevItemIndex === -1) {
                    prevItemIndex = managedColumns.findIndex((column) => {
                        return (
                            column.Header ===
                            updatedColumns[indexOfColumnToAdd - 1].Header
                        );
                    });
                }
            }

            const newColumnsList = managedColumns.slice(0); // Copying state value
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

    const changeDownloadType = (event) => {
        const { value, checked } = event ? event.currentTarget : "";
        if (checked) {
            setDownloadTypes(downloadTypes.concat([value]));
        } else {
            setDownloadTypes(
                downloadTypes.filter((type) => {
                    return type !== value;
                })
            );
        }
    };

    useEffect(() => {
        setManagedColumns(updatedColumnsPerUserSelection);
    }, [columns, isRowExpandEnabled]);

    if (isExportOverlayOpen) {
        return (
            <ClickAwayListener onClickAway={toggleExportDataOverlay}>
                <div className="neo-popover neo-popover--exports exports--grid">
                    <div className="neo-popover__export export__grid">
                        <div className="export__chooser">
                            <div className="export__header">
                                <div>
                                    <strong>Export Data</strong>
                                </div>
                            </div>
                            <div className="export__body">
                                <div>
                                    <input
                                        type="text"
                                        data-testid="search"
                                        placeholder="Search column"
                                        className="custom__ctrl"
                                        onChange={filterColumnsList}
                                    />
                                </div>
                                <div className="export__wrap export__headertxt">
                                    <div className="export__checkbox">
                                        <input
                                            type="checkbox"
                                            value="Select All"
                                            data-testid="select-all-checkbox"
                                            checked={isCheckboxSelected(
                                                "Select All"
                                            )}
                                            onChange={selectAllColumns}
                                        />
                                    </div>
                                    <div className="export__txt">
                                        Select All
                                    </div>
                                </div>
                                {searchedColumns.map((column) => {
                                    return (
                                        <div
                                            className="export__wrap"
                                            key={column.columnId}
                                        >
                                            <div className="export__checkbox">
                                                <input
                                                    type="checkbox"
                                                    data-testid={`${column.Header}`}
                                                    value={column.Header}
                                                    checked={isCheckboxSelected(
                                                        column.Header
                                                    )}
                                                    onChange={
                                                        selectSingleColumn
                                                    }
                                                />
                                            </div>
                                            <div className="export__txt">
                                                {column.Header}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                        <div className="export__settings">
                            <div className="export__header">
                                <div className="export__headerTxt" />
                                <div className="export__close">
                                    <i
                                        aria-hidden="true"
                                        onClick={toggleExportDataOverlay}
                                    >
                                        <IconClose />
                                    </i>
                                </div>
                            </div>
                            <div className="export__as">Export As</div>
                            <div className="export__body">
                                <div className="export__reorder">
                                    <div className="check-wrap">
                                        <input
                                            type="checkbox"
                                            id="chk_pdf"
                                            data-testid="chk_pdf_test"
                                            value="pdf"
                                            checked={downloadTypes.includes(
                                                "pdf"
                                            )}
                                            onChange={changeDownloadType}
                                        />
                                    </div>
                                    <div className="export__file">
                                        <i>
                                            <IconPdf />
                                        </i>
                                        <strong>PDF</strong>
                                    </div>
                                </div>
                                <div className="export__reorder">
                                    <div className="check-wrap">
                                        <input
                                            type="checkbox"
                                            id="chk_excel"
                                            data-testid="chk_excel_test"
                                            value="excel"
                                            checked={downloadTypes.includes(
                                                "excel"
                                            )}
                                            onChange={changeDownloadType}
                                        />
                                    </div>
                                    <div className="export__file">
                                        <i>
                                            <IconExcel />
                                        </i>
                                        <strong>Excel</strong>
                                    </div>
                                </div>
                                <div className="export__reorder">
                                    <div className="check-wrap">
                                        <input
                                            type="checkbox"
                                            id="chk_csv"
                                            data-testid="chk_csv_test"
                                            value="csv"
                                            checked={downloadTypes.includes(
                                                "csv"
                                            )}
                                            onChange={changeDownloadType}
                                        />
                                    </div>
                                    <div className="export__file">
                                        <i>
                                            <IconCsv />
                                        </i>
                                        <strong>CSV</strong>
                                    </div>
                                </div>
                                <div className="exportWarning">
                                    <span className="alert alert-danger">
                                        <strong>{warning}</strong>
                                    </span>
                                </div>
                                <div>
                                    {isDownload ? (
                                        <h2 style={{ textAlign: "center" }}>
                                            Loading...
                                        </h2>
                                    ) : null}
                                </div>
                            </div>
                            <div className="export__footer">
                                <div className="export__btns">
                                    <button
                                        type="button"
                                        data-testid="cancel_button"
                                        className="btns"
                                        onClick={toggleExportDataOverlay}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        data-testid="export_button"
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
            </ClickAwayListener>
        );
    }
    return <div />;
});

ExportData.propTypes = {
    isExportOverlayOpen: PropTypes.any,
    toggleExportDataOverlay: PropTypes.any,
    rows: PropTypes.any,
    columns: PropTypes.any,
    originalColumns: PropTypes.any,
    isExpandContentAvailable: PropTypes.any,
    additionalColumn: PropTypes.any,
    isRowExpandEnabled: PropTypes.any
};

export default ExportData;
