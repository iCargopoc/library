// @flow
import React, { useState, useEffect } from "react";
import ClickAwayListener from "react-click-away-listener";
import update from "immutability-helper";
import JsPdf from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import ColumnSearch from "../common/columnsSearch";
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
        filteredRowValue: Object,
        extensionType: string
    ) => {
        const isExcelFile = extensionType === "excel";
        const fileType =
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
        const fileExtension = isExcelFile ? ".xlsx" : ".csv";
        const ws = XLSX.utils.json_to_sheet(filteredRowValue);
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
        exportOverlay.appendChild(link);
        const linkToDownload = isExcelFile
            ? document.querySelector("[data-testid='excel-file-download-link']")
            : document.querySelector("[data-testid='csv-file-download-link']");
        linkToDownload.click();
        exportOverlay.removeChild(link);
    };

    const exportRowData = () => {
        const filteredRow = [];
        const filteredRowValues = [];
        let filteredRowHeader = [];

        setWarning("");

        const filteredManagedColumns = convertToIndividualColumns(
            managedColumns
        ).filter((column: Object): boolean => {
            return column.display === true;
        });

        const filteredManagedSubComponentColumns = managedSubComponentColumns.filter(
            (column: Object): boolean => {
                return column.display === true;
            }
        );

        if (
            rows &&
            rows.length > 0 &&
            filteredManagedColumns.length > 0 &&
            downloadTypes.length > 0
        ) {
            let isHeaderCreated = false;
            let isSubCompHeaderCreated = false;

            // Loop through all rows
            rows.forEach((rowDetails: Object) => {
                const row = rowDetails.original;
                if (row.isParent !== true) {
                    const filteredColumnVal = {};
                    const rowFilteredValues = [];
                    const rowFilteredHeader = [];

                    // Loop through all parent columns
                    filteredManagedColumns.forEach((columnName: any) => {
                        const {
                            Header,
                            title,
                            accessor,
                            innerCells
                        } = columnName;
                        const isInnerCellsPresent =
                            innerCells && innerCells.length > 0;
                        const accessorRowValue = row[accessor];
                        let columnValue = "";
                        let columnHeader = "";
                        if (accessor) {
                            // If inner cells are present and column value is an object or array
                            if (
                                isInnerCellsPresent &&
                                accessorRowValue !== null &&
                                accessorRowValue !== undefined &&
                                typeof accessorRowValue === "object"
                            ) {
                                // Loop through all inner cells
                                innerCells.forEach((cell: Object) => {
                                    if (cell.display === true) {
                                        const innerCellAccessor = cell.accessor;
                                        const innerCellHeader = cell.Header;
                                        const innerCellAccessorValue =
                                            accessorRowValue[innerCellAccessor];

                                        // If column value is an array
                                        if (accessorRowValue.length > 0) {
                                            accessorRowValue.forEach(
                                                (
                                                    item: Object,
                                                    itemIndex: string
                                                ) => {
                                                    const itemInnerCellAccessor =
                                                        item[innerCellAccessor];
                                                    columnValue = itemInnerCellAccessor
                                                        ? itemInnerCellAccessor.toString()
                                                        : "";
                                                    columnHeader = `${
                                                        title || Header
                                                    } - ${innerCellHeader}_${itemIndex}`;
                                                    // Create object required for Excel and CSV export
                                                    filteredColumnVal[
                                                        columnHeader
                                                    ] = columnValue;
                                                    // Create value array required for PDF export
                                                    rowFilteredValues.push(
                                                        columnValue
                                                    );
                                                    // Create header array required for PDF export (only 1 time required)
                                                    if (!isHeaderCreated) {
                                                        rowFilteredHeader.push(
                                                            columnHeader
                                                        );
                                                    }
                                                }
                                            );
                                        } else if (innerCellAccessorValue) {
                                            // If column value is an object
                                            columnValue = innerCellAccessorValue;
                                            columnHeader = `${
                                                title || Header
                                            } - ${innerCellHeader}`;
                                            // Create object required for Excel and CSV export
                                            filteredColumnVal[
                                                columnHeader
                                            ] = columnValue;
                                            // Create value array required for PDF export
                                            rowFilteredValues.push(columnValue);
                                            // Create header array required for PDF export (only 1 time required)
                                            if (!isHeaderCreated) {
                                                rowFilteredHeader.push(
                                                    columnHeader
                                                );
                                            }
                                        }
                                    }
                                });
                            } else {
                                // If inner cells are not present and column value is not an object or array
                                columnValue = accessorRowValue;
                                columnHeader = title || Header;
                                // Create object required for Excel and CSV export
                                filteredColumnVal[columnHeader] = columnValue;
                                // Create value array required for PDF export
                                rowFilteredValues.push(columnValue);
                                // Create header array required for PDF export (only 1 time required)
                                if (!isHeaderCreated) {
                                    rowFilteredHeader.push(columnHeader);
                                }
                            }
                        }
                    });

                    // Loop through parent additional column
                    if (
                        managedAdditionalColumn &&
                        managedAdditionalColumn.display === true
                    ) {
                        const { innerCells } = managedAdditionalColumn;
                        // Loop through inner cells
                        innerCells.forEach((expandedCell: Object) => {
                            if (expandedCell.display === true) {
                                const expandedCellAccessor =
                                    expandedCell.accessor;
                                const expandedCellHeader = expandedCell.Header;
                                const expandedCellValue =
                                    row[expandedCellAccessor];
                                let formattedValue = expandedCellValue;
                                // If column value is an object or array
                                if (
                                    expandedCellValue !== null &&
                                    expandedCellValue !== undefined &&
                                    typeof expandedCellValue === "object"
                                ) {
                                    // If column value is an array
                                    if (expandedCellValue.length > 0) {
                                        const newValues = [];
                                        expandedCellValue.forEach(
                                            (cellValue: Object) => {
                                                newValues.push(
                                                    Object.values(
                                                        cellValue
                                                    ).join("--")
                                                );
                                            }
                                        );
                                        formattedValue = newValues.join("||");
                                    } else {
                                        // If column value is an object
                                        formattedValue = Object.values(
                                            expandedCellValue
                                        ).join("||");
                                    }
                                }
                                // Create object required for Excel and CSV export
                                filteredColumnVal[
                                    expandedCellHeader
                                ] = formattedValue;
                                // Create value array required for PDF export
                                rowFilteredValues.push(formattedValue);
                                // Create header array required for PDF export (only 1 time required)
                                if (!isHeaderCreated) {
                                    rowFilteredHeader.push(expandedCellHeader);
                                }
                            }
                        });
                    }

                    // Push all objects created into final varialbe, which corresponds to each row
                    filteredRow.push(filteredColumnVal);
                    filteredRowValues.push(rowFilteredValues);
                    if (!isHeaderCreated) {
                        filteredRowHeader.push(rowFilteredHeader);
                    }
                    isHeaderCreated = true;

                    // Check if grid has sub component column provided and corresponding row has sub component data
                    const { subComponentData } = row;
                    if (
                        subComponentData &&
                        subComponentData.length > 0 &&
                        filteredManagedSubComponentColumns &&
                        filteredManagedSubComponentColumns.length > 0
                    ) {
                        // Copy value object (excel and csv) and value array (pdf) and update all existing values to ""
                        // This is to create empty column value under parent column name, in case of sub component rows
                        const nullFilteredColumnVal = { ...filteredColumnVal };
                        let nullRowFilteredValues = [...rowFilteredValues];
                        const subCompRowFilteredHeader = [];
                        Object.keys(nullFilteredColumnVal).forEach(
                            (val: any) => {
                                nullFilteredColumnVal[val] = "";
                            }
                        );
                        nullRowFilteredValues = nullRowFilteredValues.map(
                            (rowVal: any): any => {
                                let updatedRowVal = rowVal;
                                updatedRowVal = "";
                                return updatedRowVal;
                            }
                        );

                        // Loop through sub component data
                        subComponentData.forEach((subCompRow: Object) => {
                            const subCompFilteredColumnVal = {
                                ...nullFilteredColumnVal
                            };
                            const subCompRowFilteredValues = [
                                ...nullRowFilteredValues
                            ];
                            // Loop through sub component columns
                            // Logic is same as above (parent columns)
                            filteredManagedSubComponentColumns.forEach(
                                (subCompColumnName: any) => {
                                    const subCompHeader =
                                        subCompColumnName.Header;
                                    const subCompTitle =
                                        subCompColumnName.title;
                                    const subCompAccessor =
                                        subCompColumnName.accessor;
                                    const subCompInnerCells =
                                        subCompColumnName.innerCells;
                                    const isSubCompInnerCellsPresent =
                                        subCompInnerCells &&
                                        subCompInnerCells.length > 0;
                                    const subCompAccessorRowValue =
                                        subCompRow[subCompAccessor];
                                    let subCompColumnValue = "";
                                    let subCompColumnHeader = "";
                                    if (subCompAccessor) {
                                        if (
                                            isSubCompInnerCellsPresent &&
                                            subCompAccessorRowValue !== null &&
                                            subCompAccessorRowValue !==
                                                undefined &&
                                            typeof subCompAccessorRowValue ===
                                                "object"
                                        ) {
                                            subCompInnerCells.forEach(
                                                (cell: Object) => {
                                                    if (cell.display === true) {
                                                        const innerCellAccessor =
                                                            cell.accessor;
                                                        const innerCellHeader =
                                                            cell.Header;
                                                        const innerCellAccessorValue =
                                                            subCompAccessorRowValue[
                                                                innerCellAccessor
                                                            ];
                                                        if (
                                                            subCompAccessorRowValue.length >
                                                            0
                                                        ) {
                                                            subCompAccessorRowValue.forEach(
                                                                (
                                                                    item: Object,
                                                                    itemIndex: any
                                                                ) => {
                                                                    const itemInnerCellAccessor =
                                                                        item[
                                                                            innerCellAccessor
                                                                        ];
                                                                    subCompColumnValue = itemInnerCellAccessor
                                                                        ? itemInnerCellAccessor.toString()
                                                                        : "";
                                                                    subCompColumnHeader = `SubRow - ${
                                                                        subCompTitle ||
                                                                        subCompHeader
                                                                    } - ${innerCellHeader}_${itemIndex}`;
                                                                    subCompFilteredColumnVal[
                                                                        subCompColumnHeader
                                                                    ] = subCompColumnValue;
                                                                    subCompRowFilteredValues.push(
                                                                        subCompColumnValue
                                                                    );
                                                                    if (
                                                                        !isSubCompHeaderCreated
                                                                    ) {
                                                                        subCompRowFilteredHeader.push(
                                                                            subCompColumnHeader
                                                                        );
                                                                    }
                                                                }
                                                            );
                                                        } else if (
                                                            innerCellAccessorValue
                                                        ) {
                                                            subCompColumnValue = innerCellAccessorValue;
                                                            subCompColumnHeader = `SubRow - ${
                                                                subCompTitle ||
                                                                subCompHeader
                                                            } - ${innerCellHeader}`;
                                                            subCompFilteredColumnVal[
                                                                subCompColumnHeader
                                                            ] = subCompColumnValue;
                                                            subCompRowFilteredValues.push(
                                                                subCompColumnValue
                                                            );
                                                            if (
                                                                !isSubCompHeaderCreated
                                                            ) {
                                                                subCompRowFilteredHeader.push(
                                                                    subCompColumnHeader
                                                                );
                                                            }
                                                        }
                                                    }
                                                }
                                            );
                                        } else {
                                            subCompColumnValue = subCompAccessorRowValue;
                                            subCompColumnHeader = `SubRow - ${
                                                subCompTitle || subCompHeader
                                            }`;
                                            subCompFilteredColumnVal[
                                                subCompColumnHeader
                                            ] = subCompColumnValue;
                                            subCompRowFilteredValues.push(
                                                subCompColumnValue
                                            );
                                            if (!isSubCompHeaderCreated) {
                                                subCompRowFilteredHeader.push(
                                                    subCompColumnHeader
                                                );
                                            }
                                        }
                                    }
                                }
                            );
                            // If additional column is present for sub component data
                            // Logic remains same as that of parent additional column
                            if (
                                managedSubComponentAdditionalColumn &&
                                managedSubComponentAdditionalColumn.display ===
                                    true
                            ) {
                                const {
                                    innerCells
                                } = managedSubComponentAdditionalColumn;
                                innerCells.forEach((expandedCell: Object) => {
                                    if (expandedCell.display === true) {
                                        const expandedCellAccessor =
                                            expandedCell.accessor;
                                        const expandedCellHeader = `SubRow - ${expandedCell.Header}`;
                                        const expandedCellValue =
                                            subCompRow[expandedCellAccessor];
                                        let formattedValue = expandedCellValue;
                                        if (
                                            expandedCellValue !== null &&
                                            expandedCellValue !== undefined &&
                                            typeof expandedCellValue ===
                                                "object"
                                        ) {
                                            if (expandedCellValue.length > 0) {
                                                const newValues = [];
                                                expandedCellValue.forEach(
                                                    (cellValue: Object) => {
                                                        newValues.push(
                                                            Object.values(
                                                                cellValue
                                                            ).join("--")
                                                        );
                                                    }
                                                );
                                                formattedValue = newValues.join(
                                                    "||"
                                                );
                                            } else {
                                                formattedValue = Object.values(
                                                    expandedCellValue
                                                ).join("||");
                                            }
                                        }
                                        subCompFilteredColumnVal[
                                            expandedCellHeader
                                        ] = formattedValue;
                                        subCompRowFilteredValues.push(
                                            formattedValue
                                        );
                                        if (!isSubCompHeaderCreated) {
                                            subCompRowFilteredHeader.push(
                                                expandedCellHeader
                                            );
                                        }
                                    }
                                });
                            }
                            filteredRow.push({
                                ...subCompFilteredColumnVal
                            });
                            filteredRowValues.push(subCompRowFilteredValues);
                            if (!isSubCompHeaderCreated) {
                                const newHeaderArray = filteredRowHeader[0].concat(
                                    subCompRowFilteredHeader
                                );
                                filteredRowHeader = [];
                                filteredRowHeader.push(newHeaderArray);
                            }
                            isSubCompHeaderCreated = true;
                        });
                    }
                }
            });

            downloadTypes.forEach((item: Object) => {
                if (item === "pdf") {
                    downloadPDF(filteredRowValues, filteredRowHeader);
                } else if (item === "excel") {
                    downloadSheetFile(filteredRow, item);
                } else {
                    downloadSheetFile(filteredRow, item);
                }
            });
        } else if (!(rows && rows.length > 0)) {
            setWarning("No rows available to export");
        } else if (filteredManagedColumns.length === 0) {
            setWarning("Select at least one parent column");
        } else if (
            isSubComponentGrid &&
            filteredManagedSubComponentColumns.length === 0
        ) {
            setWarning("Select at least one sub component column");
        } else {
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
                    <ColumnSearch
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
                            onClick={exportRowData}
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
