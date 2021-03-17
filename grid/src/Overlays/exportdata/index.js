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
        pdfPaperSize,
        isDesktop
    } = props;

    const exportedFileName = fileName || "iCargo Neo Report";
    const exportedPdfPaperSize = pdfPaperSize || "A4"; // Use A1, A2, A3, A4 or A5 - Default value is A4

    // Check if additional Column is present or not
    const isAdditionalColumnPresent =
        additionalColumn !== null && additionalColumn !== undefined;

    // Check if sub component additional Column is present or not
    const isSubComponentAdditionalColumnPresent =
        isSubComponentGrid &&
        subComponentAdditionalColumn !== null &&
        subComponentAdditionalColumn !== undefined;

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

    const getExportDataFromColumns = (
        columns: Array<Object>,
        rowData: Object,
        isHeaderCreated: boolean,
        headersArray: any,
        valuesArray: any,
        headersCopyArray: any
    ) => {
        // Loop through available columns
        columns.forEach((column: Object) => {
            const { exportData } = column;
            // If exportData is valid function
            if (typeof exportData === "function") {
                // Get export content from the function
                const exportContent = exportData(rowData, isDesktop);
                // If export content is valid
                if (
                    typeof exportContent === "object" &&
                    exportContent.length > 0
                ) {
                    // Loop through export content
                    exportContent.forEach((content: Object) => {
                        // Get header and body values
                        const { header, body } = content;
                        // If header is not already created, push it to the header array
                        if (!isHeaderCreated) {
                            headersArray.push(header || "");
                            // If headers copy array is present, push data into it
                            if (
                                headersCopyArray !== null &&
                                headersCopyArray !== undefined
                            ) {
                                headersCopyArray.push(header || "");
                            }
                        }
                        // Push body to the values array
                        valuesArray.push(body || "");
                    });
                }
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
            // Variables to check if header entries are already created
            let isParentHeaderCreated = false;
            let isGridHeaderCreated = false;
            let isSubCompHeaderCreated = false;

            // A copy of parent column header, which can be used to create empty values in child rows, corresponding to parent columns
            const parentHeadersCopy = [];
            // A copy of grid column header, which can be used to create empty values in subcomponent rows, corresponding to columns
            const gridHeadersCopy = [];

            // Variable to store final Export data
            const headerValues = [];
            const rowValues = [];

            // Loop through all rows
            rows.forEach((row: Object) => {
                const { original } = row;
                const { isParent } = original;

                // If tree grid and row is parent row
                if (isParentGrid === true && isParent === true) {
                    // #region - parent row - Tree Grid

                    // Variables to hold column header and values of tree grid
                    const parentRowValues = [];
                    // Get export data from parent column
                    getExportDataFromColumns(
                        [parentColumn],
                        original,
                        isParentHeaderCreated,
                        headerValues,
                        parentRowValues,
                        parentHeadersCopy
                    );
                    if (parentRowValues.length > 0) {
                        isParentHeaderCreated = true;
                    }
                    rowValues.push(parentRowValues);

                    // #endregion
                } else {
                    // #region - grid columns

                    // Check if entries for parent row is already present
                    const isParentRowPresent =
                        isParentGrid === true && parentHeadersCopy.length > 0;

                    // If parent row exist, create values array with empty values for parent columns, and push data into it.
                    let gridRowValues = [];
                    if (isParentRowPresent) {
                        gridRowValues = parentHeadersCopy.map((): string => {
                            return "";
                        });
                    }

                    // Columns from which export data has to be collected
                    const gridColumnsList =
                        managedAdditionalColumn &&
                        managedAdditionalColumn.display === true
                            ? [
                                  ...filteredManagedColumns,
                                  managedAdditionalColumn
                              ]
                            : [...filteredManagedColumns];

                    // Get export data from parent column
                    getExportDataFromColumns(
                        gridColumnsList,
                        original,
                        isGridHeaderCreated,
                        headerValues,
                        gridRowValues,
                        gridHeadersCopy
                    );
                    if (gridRowValues.length > 0) {
                        isGridHeaderCreated = true;
                    }
                    rowValues.push(gridRowValues);

                    // #endregion

                    // #region - Sub component grid

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
                                // Check if entries for grid row is already present
                                const isGridRowPresent =
                                    gridHeadersCopy.length > 0;

                                // If grid row exist, create values array with empty values for grid columns, and push data into it.
                                let subCompRowValues = [];
                                if (isGridRowPresent) {
                                    subCompRowValues = gridHeadersCopy.map(
                                        (): string => {
                                            return "";
                                        }
                                    );
                                }

                                // Columns from which export data has to be collected
                                const subCompColumnsList =
                                    managedSubComponentAdditionalColumn &&
                                    managedSubComponentAdditionalColumn.display ===
                                        true
                                        ? [
                                              ...filteredManagedSubComponentColumns,
                                              managedSubComponentAdditionalColumn
                                          ]
                                        : [
                                              ...filteredManagedSubComponentColumns
                                          ];

                                // Get export data from parent column
                                getExportDataFromColumns(
                                    subCompColumnsList,
                                    subCompRow,
                                    isSubCompHeaderCreated,
                                    headerValues,
                                    subCompRowValues
                                );
                                if (subCompRowValues.length > 0) {
                                    isSubCompHeaderCreated = true;
                                }
                                rowValues.push(subCompRowValues);
                            });
                        }
                    }
                    // #endregion
                }
            });

            // Call functions corresponding to selected download type
            downloadTypes.forEach((item: Object) => {
                if (item === "pdf") {
                    downloadPDF(rowValues, [headerValues]);
                } else {
                    downloadSheetFile(rowValues, [headerValues], item);
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
