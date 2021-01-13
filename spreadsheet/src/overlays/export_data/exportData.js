import React, { Component } from "react";
import JsPdf from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import PropTypes from "prop-types";
import ClickAwayListener from "react-click-away-listener";
import {
    IconCsv,
    IconExcel,
    IconClose,
    IconPdf
} from "../../utilities/svgUtilities";

class ExportData extends Component {
    constructor(props) {
        super(props);
        const { columnsList } = this.props;
        this.state = {
            columnValueList: columnsList,
            columnEntityList: columnsList,
            isAllSelected: true,
            downLaodFileType: [],
            warning: "",
            clickTag: "none"
        };
        this.handleClick = this.handleClick.bind(this);
        this.selectDownLoadType = this.selectDownLoadType.bind(this);
        this.exportValidation = this.exportValidation.bind(this);
    }

    handleClick() {
        const { closeExport } = this.props;
        closeExport();
    }

    resetColumnExportList = () => {
        this.setState({
            columnEntityList: [],
            isAllSelected: false
        });
    };

    selectAllToColumnList = () => {
        const { isAllSelected } = this.state;
        const { columnsList } = this.props;
        this.resetColumnExportList();
        this.setState({
            columnEntityList: !isAllSelected ? columnsList : [],
            isAllSelected: !isAllSelected
        });
    };

    addToColumnEntityList = (typeToBeAdded) => {
        const { columnEntityList } = this.state;
        let existingColumnEntityList = columnEntityList;
        if (!existingColumnEntityList.includes(typeToBeAdded)) {
            existingColumnEntityList.push(typeToBeAdded);
        } else {
            existingColumnEntityList = existingColumnEntityList.filter(
                (item) => {
                    return item !== typeToBeAdded;
                }
            );
        }
        this.setState({
            columnEntityList: existingColumnEntityList,
            isAllSelected: false
        });
    };

    selectDownLoadType = (event) => {
        let { downLaodFileType } = this.state;
        if (
            event.target.checked &&
            !downLaodFileType.includes(event.target.value)
        ) {
            downLaodFileType.push(event.target.value);
            this.setState({ downLaodFileType });
        } else {
            const temp = [];
            downLaodFileType.forEach(function (value) {
                if (value !== event.target.value) {
                    temp.push(value);
                }
            });
            downLaodFileType = temp;
            this.setState({ downLaodFileType });
        }
    };

    exportRowData = () => {
        const { columnEntityList, downLaodFileType } = this.state;
        const columnValueList = columnEntityList;
        const filteredRow = [];
        const filteredRowValues = [];
        const filteredRowHeader = [];

        if (columnValueList.length > 0 && downLaodFileType.length > 0) {
            const { rows } = this.props;
            const rowLength = rows && rows.length > 0 ? rows.length : 0;
            rows.forEach((row, index) => {
                const filteredColumnVal = {};
                const rowFilteredValues = [];
                const rowFilteredHeader = [];
                columnValueList.forEach((columnName) => {
                    const { key, name } = columnName;
                    filteredColumnVal[name] = row[key];
                    rowFilteredValues.push(row[key]);
                    rowFilteredHeader.push(name);
                });
                filteredRow.push(filteredColumnVal);
                filteredRowValues.push(rowFilteredValues);
                if (rowLength === index + 1)
                    filteredRowHeader.push(rowFilteredHeader);
            });

            downLaodFileType.forEach((item) => {
                if (item === "pdf") {
                    this.downloadPDF(filteredRowValues, filteredRowHeader);
                } else if (item === "excel") {
                    this.downloadXLSFile(filteredRow);
                } else {
                    this.downloadCSVFile(filteredRow);
                }
            });
        }
    };

    downloadPDF = (rowFilteredValues, rowFilteredHeader) => {
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
    };

    downloadCSVFile = async (filteredRowValue) => {
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

    downloadXLSFile = async (filteredRowValue) => {
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

    columnSearchLogic = (e) => {
        const { columnsList } = this.props;
        const searchKey = String(e.target.value).toLowerCase();
        const filteredRows = columnsList.filter((item) => {
            return item.name.toLowerCase().includes(searchKey);
        });
        if (!filteredRows.length) {
            this.setState({ columnValueList: columnsList });
        } else {
            this.setState({ columnValueList: filteredRows });
        }
    };

    exportValidation = () => {
        const { columnEntityList, downLaodFileType } = this.state;
        const columnLength = columnEntityList.length;
        const fileLength = downLaodFileType.length;
        if (columnLength > 0 && fileLength > 0) {
            this.exportRowData();
            this.setState({ clickTag: "none" });
        } else if (columnLength === 0) {
            this.setState({ warning: "Column" });
            this.setState({ clickTag: "" });
        } else if (fileLength === 0) {
            this.setState({ warning: "File Type" });
            this.setState({ clickTag: "" });
        }
        if (columnLength === 0 && fileLength === 0) {
            this.setState({ warning: "File Type & Column" });
            this.setState({ clickTag: "" });
        }
    };

    render() {
        const {
            isAllSelected,
            columnValueList,
            columnEntityList,
            clickTag,
            warning
        } = this.state;
        const { closeExport } = this.props;
        return (
            <ClickAwayListener
                onClickAway={this.handleClick}
                className="ng-popover ng-popover--exports"
                data-testid="exportoverlay"
            >
                <div className="ng-popover__chooser">
                    <div className="ng-popover__header">
                        <div className="">
                            <strong>Export Data</strong>
                        </div>
                    </div>
                    <div className="ng-chooser-body">
                        <div>
                            <input
                                data-testid="searchExport"
                                type="text"
                                placeholder="Search export"
                                className="ng-chooser-body__txt"
                                onChange={this.columnSearchLogic}
                            />
                        </div>
                        <div className="ng-chooser-body__selectall">
                            <div className="neo-form-check">
                                <input
                                    id="chk_selectAllSearchableColumns"
                                    data-testid="selectColumns"
                                    className="neo-checkbox form-check-input"
                                    type="checkbox"
                                    onChange={() =>
                                        this.selectAllToColumnList()
                                    }
                                    checked={isAllSelected}
                                />
                                <label
                                    htmlFor="chk_selectAllSearchableColumns"
                                    className="neo-form-check__label"
                                >
                                    Select All
                                </label>
                            </div>
                        </div>
                        {columnValueList && columnValueList.length > 0
                            ? columnValueList.map((column) => {
                                  return (
                                      <div
                                          className="ng-chooser-body__wrap"
                                          key={column.key}
                                      >
                                          <div className="ng-chooser-body__checkwrap">
                                              <div className="neo-form-check">
                                                  <input
                                                      id={`chk_selectSearchableColumn_${column.key}`}
                                                      data-testid="addToColumn"
                                                      className="neo-checkbox form-check-input"
                                                      type="checkbox"
                                                      checked={columnEntityList.includes(
                                                          column
                                                      )}
                                                      onChange={() =>
                                                          this.addToColumnEntityList(
                                                              column
                                                          )
                                                      }
                                                  />
                                                  <label
                                                      htmlFor={`chk_selectSearchableColumn_${column.key}`}
                                                      className="neo-form-check__label"
                                                  >
                                                      {column.name}
                                                  </label>
                                              </div>
                                          </div>
                                      </div>
                                  );
                              })
                            : ""}
                    </div>
                </div>
                <div className="ng-popover__settings">
                    <div className="ng-popover__header">
                        <div className="ng-popover--exports__close">
                            <i role="presentation" onClick={closeExport}>
                                <IconClose className="ng-icon" />
                            </i>
                        </div>
                    </div>
                    <div className="ng-popover--exports__title">Export as</div>
                    <div className="ng-popover--exports__body">
                        <div className="ng-popover--exports__reorder">
                            <div className="neo-form-check">
                                <input
                                    data-testid="addpdfDownloadType"
                                    type="checkbox"
                                    name="pdf"
                                    value="pdf"
                                    className="neo-checkbox form-check-input"
                                    onChange={this.selectDownLoadType}
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
                                    name="excel"
                                    value="excel"
                                    onChange={this.selectDownLoadType}
                                    className="neo-checkbox form-check-input"
                                    id="chk_excel"
                                    data-testid="chk_excel_test"
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
                                    name="csv"
                                    value="csv"
                                    onChange={this.selectDownLoadType}
                                    className="neo-checkbox form-check-input"
                                    id="chk_csv"
                                    data-testid="chk_csv_test"
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
                        <div className="ng-popover--exports__warning">
                            <span style={{ display: clickTag }}>
                                <strong>Select at least one {warning}</strong>
                            </span>
                        </div>
                    </div>
                    <div className="ng-popover__footer">
                        <button
                            data-testid="closeExport"
                            type="button"
                            className="neo-btn neo-btn-primary btn btn-secondary"
                            onClick={() => closeExport()}
                        >
                            Cancel
                        </button>
                        <button
                            data-testid="exportValidationClick"
                            type="button"
                            className="neo-btn neo-btn-default btn btn-secondary"
                            onClick={() => {
                                this.exportValidation();
                            }}
                        >
                            Export
                        </button>
                    </div>
                </div>
            </ClickAwayListener>
        );
    }
}

ExportData.propTypes = {
    columnsList: PropTypes.arrayOf(PropTypes.object),
    closeExport: PropTypes.func,
    rows: PropTypes.arrayOf(PropTypes.object)
};

export default ExportData;
