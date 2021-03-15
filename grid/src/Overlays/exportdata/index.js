// @flow
import React, { useState, useEffect } from "react";
import ClickAwayListener from "react-click-away-listener";
import update from "immutability-helper";
import JsPdf from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import ColumnsSearch from "../common/ColumnsSearch";
import {
    IconCsv,
    IconExcel,
    IconCancel,
    IconPdf
} from "../../Utilities/SvgUtilities";
import { convertToIndividualColumns } from "../../Utilities/GridUtilities";

const ExportData = (props: Object): any => {
    const {
        toggleExportDataOverlay,
        rows,
        columns,
        additionalColumn,
        isParentGrid,
        parentColumn,
        isSubComponentGrid,
        subComponentColumnns,
        subComponentAdditionalColumn,
        fileName,
        pdfPaperSize
    } = props;

    const exportedFileName = fileName || "iCargo Neo Report";
    const exportedPdfPaperSize = pdfPaperSize || "A4"; // Use A1, A2, A3, A4 or A5 - Default value is A4

    // Check if additional Column is present or not
    const isAdditionalColumnPresent =
        additionalColumn &&
        Object.keys(additionalColumn).length > 0 &&
        additionalColumn.innerCells &&
        additionalColumn.innerCells.length > 0;

    // Check if sub component additional Column is present or not
    const isSubComponentAdditionalColumnPresent =
        isSubComponentGrid &&
        subComponentAdditionalColumn !== null &&
        subComponentAdditionalColumn !== undefined &&
        Object.keys(subComponentAdditionalColumn).length > 0 &&
        subComponentAdditionalColumn.innerCells &&
        subComponentAdditionalColumn.innerCells.length > 0;

    // Set state variables for:
    // managedColumns - main columns displayed in colum setting region
    // managedAdditionalColumn - additional column displayed in colum setting region
    // managedSubComponentColumns - sub component columns displayed in colum setting region
    // managedSubComponentAdditionalColumn - sub component additional column displayed in colum setting region
    // downloadTypes - types of downloads user has selected
    // warning - error message to be displayed
    const [managedColumns, setManagedColumns] = useState([]);
    const [managedAdditionalColumn, setManagedAdditionalColumn] = useState(
        null
    );
    const [
        managedSubComponentColumns,
        setManagedSubComponentColumns
    ] = useState([]);
    const [
        managedSubComponentAdditionalColumn,
        setManagedSubComponentAdditionalColumn
    ] = useState(null);
    const [downloadTypes, setDownloadTypes] = useState([]);
    const [warning, setWarning] = useState("");

    // Update display value of column based on columnId
    const updatedDisplayOfColumn = (
        column: Object,
        columnid: string,
        flag: boolean
    ): any[] => {
        const updatedColumn = { ...column };
        const { isGroupHeader, columnId } = column;
        const groupedColumns = column.columns;
        if (
            isGroupHeader === true &&
            groupedColumns &&
            groupedColumns.length > 0
        ) {
            let atleastOneColumnDisplayed = false;
            const updatedColumns = [...groupedColumns].map(
                (col: Object): Object => {
                    const updatedCol = { ...col };
                    if (
                        (columnid &&
                            (columnid === "all" ||
                                columnid === col.columnId)) ||
                        columnid === undefined
                    ) {
                        updatedCol.display = flag;
                    }
                    atleastOneColumnDisplayed =
                        atleastOneColumnDisplayed || updatedCol.display;
                    return updatedCol;
                }
            );
            updatedColumn.display = atleastOneColumnDisplayed;
            updatedColumn.columns = updatedColumns;
        } else if (
            (columnid && (columnid === "all" || columnid === columnId)) ||
            columnid === undefined
        ) {
            updatedColumn.display = flag;
        }
        return updatedColumn;
    };

    // Update display value of managedAdditionalColumn state with given value
    const updatedDisplayOfAdditionalColumn = (
        flag: boolean,
        isSubComponentColumn: boolean
    ) => {
        if (isSubComponentColumn) {
            setManagedSubComponentAdditionalColumn(
                update(managedSubComponentAdditionalColumn, {
                    display: { $set: flag }
                })
            );
        } else {
            setManagedAdditionalColumn(
                update(managedAdditionalColumn, {
                    display: { $set: flag }
                })
            );
        }
    };

    // update the display flag value of column or all columns in managedColumns and managedAdditionalColumn state, based on the selection
    const updateColumns = (
        columnid: string,
        isadditionalcolumn: string,
        checked: boolean,
        isSubComponentColumn: boolean
    ): any => {
        if (
            columnid === "all" ||
            (isAdditionalColumnPresent && isadditionalcolumn === "true")
        ) {
            // Update additional column state if columnid is "all" or selected column has "isadditionalcolumn"
            updatedDisplayOfAdditionalColumn(checked, isSubComponentColumn);
        }
        if (isadditionalcolumn !== "true") {
            // Update main columns state based on selection and columnid, if selected column doesn't have "isadditionalcolumn"
            if (isSubComponentColumn) {
                const updatedManagedColumns = [
                    ...managedSubComponentColumns
                ].map((column: Object): any[] => {
                    return updatedDisplayOfColumn(column, columnid, checked);
                });
                setManagedSubComponentColumns(
                    update(managedSubComponentColumns, {
                        $set: updatedManagedColumns
                    })
                );
            } else {
                const updatedManagedColumns = [...managedColumns].map(
                    (column: Object): any[] => {
                        return updatedDisplayOfColumn(
                            column,
                            columnid,
                            checked
                        );
                    }
                );
                setManagedColumns(
                    update(managedColumns, {
                        $set: updatedManagedColumns
                    })
                );
            }
        }
    };

    const downloadPDF = (
        rowFilteredValues: Object,
        rowFilteredHeader: Object
    ): Object => {
        const unit = "mm";
        const size = exportedPdfPaperSize;
        const orientation = "landscape"; // portrait or landscape

        const doc = new JsPdf(orientation, unit, size);
        const content = {
            head: rowFilteredHeader,
            body: rowFilteredValues,
            tableWidth: "auto", // 'auto'|'wrap'|'number'
            headStyles: { fillColor: [102, 102, 255] },
            theme: "grid", // 'striped'|'grid'|'plain'|'css'
            margin: { top: 5, right: 5, bottom: 5, left: 5 }
        };
        doc.autoTable(content);
        doc.save(`${exportedFileName}.pdf`);
    };

    const downloadSheetFile = async (
        rowFilteredValues: Object,
        rowFilteredHeader: Object,
        extensionType: string
    ) => {
        const updatedRowFilteredValues = [...rowFilteredValues];
        const updatedRowFilteredHeader = [...rowFilteredHeader];
        updatedRowFilteredValues.unshift(updatedRowFilteredHeader[0]);
        const isExcelFile = extensionType === "excel";
        const fileType =
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
        const fileExtension = isExcelFile ? ".xlsx" : ".csv";
        const ws = XLSX.utils.aoa_to_sheet(updatedRowFilteredValues);
        const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
        const excelBuffer = XLSX.write(wb, {
            bookType: isExcelFile ? "xlsx" : "csv",
            type: "array"
        });
        const data = new Blob([excelBuffer], { type: fileType });
        const href = await URL.createObjectURL(data);
        const link = document.createElement("a");
        link.style.visibility = "hidden";
        link.dataset.testid = isExcelFile
            ? "excel-file-download-link"
            : "csv-file-download-link";
        link.href = href;
        link.download = exportedFileName + fileExtension;
        const exportOverlay = document.querySelector(
            "[data-testid='exportoverlay']"
        );
        if (exportOverlay != null) {
            exportOverlay.appendChild(link);
        }
        const linkToDownload = isExcelFile
            ? document.querySelector("[data-testid='excel-file-download-link']")
            : document.querySelector("[data-testid='csv-file-download-link']");
        if (linkToDownload != null) {
            linkToDownload.click();
        }
        if (exportOverlay != null) {
            exportOverlay.removeChild(link);
        }
    };

    const createColumnData = (
        column: Object,
        data: Object,
        isHeaderCreated: boolean,
        headerArray: any,
        valuesArray: any
    ) => {
        // Find column header and column value
        const { title, Header, accessor, display } = column;

        // If column is not hidden
        if (display !== false) {
            const cellHeader = title || Header;
            const cellValue = data[accessor];

            // Push data to header array (only 1 time required)
            if (!isHeaderCreated) {
                headerArray.push(cellHeader);
            }
            // Push data to values array
            valuesArray.push(cellValue);
        }
    };

    const createInnerCellObjectData = (
        currentInnerCells: Array<Object>,
        cellData: any,
        isHeaderCreated: boolean,
        headerArray: any,
        valuesArray: any
    ) => {
        // Loop through inner cells
        currentInnerCells.forEach((cell: Object) => {
            // Create export column for each cell
            createColumnData(
                cell,
                cellData,
                isHeaderCreated,
                headerArray,
                valuesArray
            );
        });
    };

    const createInnerCellArrayData = (
        currentInnerCells: Array<Object>,
        cellData: any,
        isHeaderCreated: boolean,
        headerArray: any,
        valuesArray: any
    ) => {
        const arrayDataHeader = [];
        const arrayDataValue = [];
        let isCellHeaderCreated = false;

        // Loop through array data
        cellData.forEach((data: any) => {
            // Loop through inner cells
            currentInnerCells.forEach((cell: Object, index: Number) => {
                const { title, Header, accessor, display } = cell;
                if (display !== false) {
                    if (!isCellHeaderCreated) {
                        const cellHeader = title || Header;
                        arrayDataHeader.push(cellHeader);
                        arrayDataValue.push(data[accessor]);
                    } else {
                        const currentValue = [arrayDataValue[index]];
                        currentValue.push(data[accessor]);
                        arrayDataValue[index] = currentValue.join(" | ");
                    }
                }
            });
            isCellHeaderCreated = true;
        });

        // Push data to header array (only 1 time required)
        if (!isHeaderCreated && arrayDataHeader.length > 0) {
            arrayDataHeader.forEach((head: String) => {
                headerArray.push(head);
            });
        }
        // Push data to values array
        arrayDataValue.forEach((value: String) => {
            valuesArray.push(value);
        });
    };

    const createDataFromColumns = (
        columnsList: Array<Object>,
        data: any,
        isGridHeaderCreated: boolean,
        headerArray: any,
        valuesArray: any
    ) => {
        // Loop through columns array
        columnsList.forEach((column: any) => {
            // If inner cells are present
            const { innerCells, accessor } = column;
            if (innerCells && innerCells.length > 0) {
                const columnValue = data[accessor];
                if (typeof columnValue === "object" && columnValue.length > 0) {
                    // Format and push value into header and value arrays or grid, if column value is an array
                    createInnerCellArrayData(
                        innerCells,
                        columnValue,
                        isGridHeaderCreated,
                        headerArray,
                        valuesArray
                    );
                } else {
                    // Format and push value into header and value arrays or grid, if column value is an object
                    createInnerCellObjectData(
                        innerCells,
                        columnValue,
                        isGridHeaderCreated,
                        headerArray,
                        valuesArray
                    );
                }
            } else {
                // If not create values from column config
                createColumnData(
                    column,
                    data,
                    isGridHeaderCreated,
                    headerArray,
                    valuesArray
                );
            }
        });
    };

    const prepareExportData = () => {
        // Clear existing warning
        setWarning("");

        // Filter columns that has display true
        const filteredManagedColumns = convertToIndividualColumns(
            managedColumns
        ).filter((column: Object): boolean => {
            return column.display === true;
        });

        // Filter subcomponent columns that has display true
        const filteredManagedSubComponentColumns = convertToIndividualColumns(
            managedSubComponentColumns
        ).filter((column: Object): boolean => {
            return column.display === true;
        });

        // If rows, columns and download options are available
        if (
            rows &&
            rows.length > 0 &&
            filteredManagedColumns.length > 0 &&
            downloadTypes.length > 0
        ) {
            // Variables for row header and row values
            let rowHeaders = [];
            const rowValues = [];

            // Variables to check if header entries are already created
            let isParentHeaderCreated = false;
            let isGridHeaderCreated = false;
            let isSubCompHeaderCreated = false;

            // A copy of parent column header, which can be used to create empty values in child rows, corresponding to parent columns
            let parentHeadersCopy = [];
            // A copy of grid column header, which can be used to create empty values in subcomponent rows, corresponding to columns
            let gridHeadersCopy = [];

            // Loop through all rows
            rows.forEach((rowDetails: Object) => {
                const { original } = rowDetails;
                const { isParent } = original;
                // If tree grid and row is parent row
                if (isParentGrid === true && isParent === true) {
                    // Variables to hold column header and values of tree grid
                    const parentHeaders = [];
                    const parentValues = [];

                    // If inner cells are present
                    const { innerCells } = parentColumn;
                    if (innerCells && innerCells.length > 0) {
                        // Format and push value into header and value arrays or tree grid
                        createInnerCellObjectData(
                            innerCells,
                            original,
                            isParentHeaderCreated,
                            parentHeaders,
                            parentValues
                        );

                        // Push formatted data into main array
                        if (!isParentHeaderCreated) {
                            rowHeaders.push(parentHeaders);
                            parentHeadersCopy = parentHeaders;
                        }
                        rowValues.push(parentValues);

                        // Update header data enry flag value to false
                        isParentHeaderCreated = true;
                    }
                } else {
                    // If the row is not parent row
                    // Check if entries for parent row is already present
                    const isParentRowPresent =
                        isParentGrid === true && parentHeadersCopy.length > 0;

                    // If parent row exist, create a copy from parent header array and push data into it
                    // Else start with a new array
                    const gridHeaders = isParentRowPresent
                        ? [...parentHeadersCopy]
                        : [];
                    // If parent row exist, create values array with empty values for parent columns, and push data into it.
                    // Else start with empty array and push data into it.
                    let gridValues = [];
                    if (isParentRowPresent) {
                        gridValues = parentHeadersCopy.map((): string => {
                            return "";
                        });
                    }

                    // Create rows based on columns
                    createDataFromColumns(
                        filteredManagedColumns,
                        original,
                        isGridHeaderCreated,
                        gridHeaders,
                        gridValues
                    );

                    // Loop through additional columns
                    if (
                        managedAdditionalColumn &&
                        managedAdditionalColumn.display === true
                    ) {
                        // If inner cells are present
                        const additionalColumns =
                            managedAdditionalColumn.innerCells;
                        if (additionalColumns && additionalColumns.length > 0) {
                            // Create rows based on columns
                            createDataFromColumns(
                                additionalColumns,
                                original,
                                isGridHeaderCreated,
                                gridHeaders,
                                gridValues
                            );
                        }
                    }

                    // Push formatted data into main array
                    if (!isGridHeaderCreated) {
                        rowHeaders = [gridHeaders];
                        gridHeadersCopy = gridHeaders;
                    }
                    rowValues.push(gridValues);

                    // Update header data enry flag value to false
                    isGridHeaderCreated = true;

                    // For sub component Grid
                    if (isSubComponentGrid) {
                        // Check if grid has sub component column provided and corresponding row has sub component data
                        const { subComponentData } = original;
                        if (
                            subComponentData &&
                            subComponentData.length > 0 &&
                            filteredManagedSubComponentColumns &&
                            filteredManagedSubComponentColumns.length > 0
                        ) {
                            // Loop through sub component data
                            subComponentData.forEach((subCompRow: Object) => {
                                // Create a copy from grid header array and push data into it
                                const subCompHeaders = [...gridHeadersCopy];
                                // Create values array with empty values for columns, and push data into it.
                                let subCompValues = [];
                                subCompValues = gridHeadersCopy.map(
                                    (): string => {
                                        return "";
                                    }
                                );

                                // Create rows based on subcomponent columns
                                createDataFromColumns(
                                    filteredManagedSubComponentColumns,
                                    subCompRow,
                                    isSubCompHeaderCreated,
                                    subCompHeaders,
                                    subCompValues
                                );

                                // Loop through additional columns
                                if (
                                    managedSubComponentAdditionalColumn &&
                                    managedSubComponentAdditionalColumn.display ===
                                        true
                                ) {
                                    // If inner cells are present
                                    const subCompAdditionalColumns =
                                        managedSubComponentAdditionalColumn.innerCells;
                                    if (
                                        subCompAdditionalColumns &&
                                        subCompAdditionalColumns.length > 0
                                    ) {
                                        // Create rows based on columns
                                        createDataFromColumns(
                                            subCompAdditionalColumns,
                                            subCompRow,
                                            isSubCompHeaderCreated,
                                            subCompHeaders,
                                            subCompValues
                                        );
                                    }
                                }

                                // Push formatted data into main array
                                if (!isSubCompHeaderCreated) {
                                    rowHeaders = [subCompHeaders];
                                }
                                rowValues.push(subCompValues);

                                // Update header data enry flag value to false
                                isSubCompHeaderCreated = true;
                            });
                        }
                    }
                }
            });

            downloadTypes.forEach((item: Object) => {
                if (item === "pdf") {
                    downloadPDF(rowValues, rowHeaders);
                } else {
                    downloadSheetFile(rowValues, rowHeaders, item);
                }
            });
        } else if (!(rows && rows.length > 0)) {
            // If no rows available to export
            setWarning("No rows available to export");
        } else if (filteredManagedColumns.length === 0) {
            // If no columns available to export
            setWarning("Select at least one parent column");
        } else if (
            isSubComponentGrid &&
            filteredManagedSubComponentColumns.length === 0
        ) {
            // If this is subcomponent grid and there are no subcomponent columns available to export
            setWarning("Select at least one sub component column");
        } else {
            // If no file types to export are selected
            setWarning("Select at least one file type");
        }
    };

    const changeDownloadType = (event: Object) => {
        const { value, checked } = event.currentTarget;
        if (checked) {
            setDownloadTypes(downloadTypes.concat([value]));
        } else {
            setDownloadTypes(
                downloadTypes.filter((type: Object): Object => {
                    return type !== value;
                })
            );
        }
    };

    useEffect(() => {
        setManagedColumns([...columns]);
        setManagedAdditionalColumn(
            isAdditionalColumnPresent ? { ...additionalColumn } : null
        );
        if (isSubComponentGrid) {
            setManagedSubComponentColumns([...subComponentColumnns]);
            setManagedSubComponentAdditionalColumn(
                isSubComponentAdditionalColumnPresent
                    ? { ...subComponentAdditionalColumn }
                    : null
            );
        }
    }, []);

    if (columns && columns.length > 0) {
        return (
            <ClickAwayListener
                onClickAway={toggleExportDataOverlay}
                className="ng-popover ng-popover--exports"
                data-testid="exportoverlay"
            >
                <div className="ng-popover__chooser">
                    <div className="ng-popover__header">
                        <span>Export Data</span>
                    </div>
                    <ColumnsSearch
                        columns={columns}
                        additionalColumn={additionalColumn}
                        managedColumns={managedColumns}
                        managedAdditionalColumn={managedAdditionalColumn}
                        isSubComponentGrid={isSubComponentGrid}
                        subComponentColumnns={[...subComponentColumnns]}
                        subComponentAdditionalColumn={
                            subComponentAdditionalColumn
                        }
                        managedSubComponentColumns={managedSubComponentColumns}
                        managedSubComponentAdditionalColumn={
                            managedSubComponentAdditionalColumn
                        }
                        updateColumns={updateColumns}
                    />
                </div>
                <div className="ng-popover__settings">
                    <div className="ng-popover__header">
                        <div className="ng-popover--exports__close">
                            <i
                                aria-hidden="true"
                                onClick={toggleExportDataOverlay}
                            >
                                <IconCancel className="ng-icon" />
                            </i>
                        </div>
                    </div>
                    <div className="ng-popover--exports__title">Export As</div>
                    <div className="ng-popover--exports__body">
                        <div className="ng-popover--exports__reorder">
                            <div className="neo-form-check">
                                <input
                                    type="checkbox"
                                    className="neo-checkbox form-check-input"
                                    id="chk_pdf"
                                    data-testid="chk_pdf_test"
                                    value="pdf"
                                    checked={downloadTypes.includes("pdf")}
                                    onChange={changeDownloadType}
                                />
                            </div>
                            <label
                                htmlFor="chk_pdf"
                                className="neo-form-check__label"
                            >
                                <div className="ng-popover--exports__file">
                                    <i>
                                        <IconPdf className="ng-icon ng-icon--pdf" />
                                    </i>
                                    <span className="ng-popover--exports__file-type">
                                        PDF
                                    </span>
                                </div>
                            </label>
                        </div>
                        <div className="ng-popover--exports__reorder">
                            <div className="neo-form-check">
                                <input
                                    type="checkbox"
                                    className="neo-checkbox form-check-input"
                                    id="chk_excel"
                                    data-testid="chk_excel_test"
                                    value="excel"
                                    checked={downloadTypes.includes("excel")}
                                    onChange={changeDownloadType}
                                />
                            </div>
                            <label
                                htmlFor="chk_excel"
                                className="neo-form-check__label"
                            >
                                <div className="ng-popover--exports__file">
                                    <i>
                                        <IconExcel className="ng-icon ng-icon--excel" />
                                    </i>
                                    <span className="ng-popover--exports__file-type">
                                        Excel
                                    </span>
                                </div>
                            </label>
                        </div>
                        <div className="ng-popover--exports__reorder">
                            <div className="neo-form-check">
                                <input
                                    type="checkbox"
                                    className="neo-checkbox form-check-input"
                                    id="chk_csv"
                                    data-testid="chk_csv_test"
                                    value="csv"
                                    checked={downloadTypes.includes("csv")}
                                    onChange={changeDownloadType}
                                />
                            </div>
                            <label
                                htmlFor="chk_csv"
                                className="neo-form-check__label"
                            >
                                <div className="ng-popover--exports__file">
                                    <i>
                                        <IconCsv className="ng-icon ng-icon--csv" />
                                    </i>
                                    <span className="ng-popover--exports__file-type">
                                        CSV
                                    </span>
                                </div>
                            </label>
                        </div>
                        {warning !== "" ? (
                            <div className="ng-popover--exports__warning">
                                <span>
                                    <strong>{warning}</strong>
                                </span>
                            </div>
                        ) : null}
                    </div>
                    <div className="ng-popover__footer">
                        <button
                            type="button"
                            data-testid="cancel_button"
                            className="neo-btn neo-btn-primary btn btn-secondary"
                            onClick={toggleExportDataOverlay}
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            data-testid="export_button"
                            className="neo-btn neo-btn-default btn btn-secondary"
                            onClick={prepareExportData}
                        >
                            Export
                        </button>
                    </div>
                </div>
            </ClickAwayListener>
        );
    }
    return null;
};

export default ExportData;
