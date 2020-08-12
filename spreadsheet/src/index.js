/* eslint-disable lines-between-class-members */
/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react/destructuring-assignment */
import React, { Component } from "react";

import { Toolbar, Data, Filters, Editors } from "react-data-grid-addons";
import { FormControl } from "react-bootstrap";
import PropTypes from "prop-types";
import ExtDataGrid from "./common/extDataGrid";
import { applyFormula } from "./utilities/utils";
import DatePicker from "./functions/DatePicker";
import ErrorMessage from "./common/ErrorMessage";
import ColumnReordering from "./overlays/column_chooser/Chooser";
import Sorting from "./overlays/sorting/Sorting";
import ExportData from "./overlays/export_data/ExportData";
import { ReactComponent as IconColumns } from "./images/icon-columns.svg";
import { ReactComponent as IconShare } from "./images/icon-share.svg";
import { ReactComponent as IconGroupSort } from "./images/icon-group-sort.svg";
import { ReactComponent as IconFilter } from "./images/icon-filter.svg";
import { ReactComponent as IconSearch } from "./images/icon-search.svg";

// eslint-disable-next-line import/no-unresolved
import "!style-loader!css-loader!sass-loader!./Styles/main.scss";

const { DropDownEditor } = Editors;
const selectors = Data.Selectors;
let swapList = [];
let swapSortList = [];
const { AutoCompleteFilter, NumericFilter } = Filters;

class Spreadsheet extends Component {
    constructor(props) {
        super(props);
        const airportCodes = [];
        const { dataSet, pageSize } = this.props;

        const dataSetVar = JSON.parse(JSON.stringify(dataSet));
        this.state = {
            warningStatus: "",
            height: 680,
            searchValue: "",
            sortColumn: "",
            sortDirection: "NONE",
            pageRowCount: pageSize,
            pageIndex: 1,
            dataSet: dataSetVar,
            subDataSet: [],
            rows: dataSetVar ? dataSetVar.slice(0, 500) : [],
            selectedIndexes: [],
            junk: {},
            columnReorderingComponent: null,
            exportComponent: null,
            filteringRows: this.props.rows,
            tempRows: this.props.rows,
            sortingPanelComponent: null,
            count: this.props.rows.length,
            sortingOrderSwapList: [],
            sortingParamsObjectList: [],
            // eslint-disable-next-line react/no-unused-state
            pinnedReorder: false,
            columns: this.props.columns.map((item) => {
                const colItem = item;
                if (colItem.editor === "DatePicker") {
                    colItem.editor = DatePicker;
                } else if (
                    colItem.editor === "DropDown" &&
                    colItem.dataSource
                ) {
                    colItem.editor = (
                        <DropDownEditor options={colItem.dataSource} />
                    );
                } else if (colItem.editor === "Text") {
                    colItem.editor = "text";
                } else {
                    colItem.editor = null;
                }
                if (colItem.filterType === "numeric") {
                    colItem.filterRenderer = NumericFilter;
                } else {
                    colItem.filterRenderer = AutoCompleteFilter;
                }
                return colItem;
            })
        };
        // document.addEventListener("copy", this.handleCopy);
        // document.addEventListener("paste", this.handlePaste);
        this.handleSearchValue = this.handleSearchValue.bind(this);
        this.clearSearchValue = this.clearSearchValue.bind(this);
        this.handleFilterChange = this.handleFilterChange.bind(this);

        this.formulaAppliedCols = this.props.columns.filter((item) => {
            return item.formulaApplicable;
        });
    }

    // updateRows = (startIdx, newRows) => {
    //   this.setState((state) => {
    //     const rows = state.rows.slice();
    //     for (let i = 0; i < newRows.length; i++) {
    //       if (startIdx + i < rows.length) {
    //         rows[startIdx + i] = {
    //           ...rows[startIdx + i],
    //           ...newRows[i],
    //         };
    //       }
    //     }
    //     return {
    //       rows,
    //     };
    //   });
    // };

    // rowGetter = (i) => {
    // console.log(i)
    //   const { rows } = this.state;
    //   return rows[i];
    // };

    // handleCopy = (e) => {
    //   e.preventDefault();
    //   const { topLeft, botRight } = this.state;
    //   const text = range(topLeft.rowIdx, botRight.rowIdx + 1)
    //     .map((rowIdx) =>
    //       this.state.columns
    //         .slice(topLeft.colIdx - 1, botRight.colIdx)
    //         .map((col) => this.rowGetter(rowIdx)[col.key])
    //         .join("\t")
    //     )
    //     .join("\n");
    //   e.clipboardData.setData("text/plain", text);
    // };

    // handlePaste = (e) => {
    //   e.preventDefault();
    //   const { topLeft } = this.state;
    //   const newRows = [];
    //   const pasteData = defaultParsePaste(e.clipboardData.getData("text/plain"));
    //   pasteData.forEach((row) => {
    //     const rowData = {};
    //     // Merge the values from pasting and the keys from the columns
    //     this.state.columns
    //       .slice(topLeft.colIdx - 1, topLeft.colIdx - 1 + row.length)
    //       .forEach((col, j) => {
    //         rowData[col.key] = row[j];
    //       });
    //     newRows.push(rowData);
    //   });
    //   this.updateRows(topLeft.rowIdx, newRows);
    // };

    // setSelection = (args) => {
    //   this.setState({
    //     topLeft: {
    //       rowIdx: args.topLeft.rowIdx,
    //       colIdx: args.topLeft.idx,
    //     },
    //     botRight: {
    //       rowIdx: args.bottomRight.rowIdx,
    //       colIdx: args.bottomRight.idx,
    //     },
    //   });
    // };

    // eslint-disable-next-line camelcase
    UNSAFE_componentWillReceiveProps(props) {
        this.setState({
            rows: props.rows,
            count: props.count,
            warningStatus: props.status
        });
    }

    setStateAsync(stateObj) {
        return new Promise((resolve) => {
            this.setState(stateObj, resolve);
        });
    }

    /**
     * Method To render the filter values for filtering rows
     * @param {*} rows is the row data to be considered for filtering
     * @param {*} columnId is the specific columnId for which the row datas are being considered
     */
    getValidFilterValues(rows, columnId) {
        this.setState({ selectedIndexes: [] });
        return rows
            .map((r) => r[columnId])
            .filter((item, i, a) => {
                return i === a.indexOf(item);
            });
    }

    /**
     * Method To swap the columns
     * @param {*} source is source column
     * @param {*} target is the target column
     */
    // onHeaderDrop = (source, target) => {
    //   const stateCopy = Object.assign({}, this.state);
    //   const columnSourceIndex = this.state.columns.findIndex(
    //     (i) => i.key === source
    //   );
    //   const columnTargetIndex = this.state.columns.findIndex(
    //     (i) => i.key === target
    //   );

    //   stateCopy.columns.splice(
    //     columnTargetIndex,
    //     0,
    //     stateCopy.columns.splice(columnSourceIndex, 1)[0]
    //   );

    //   const emptyColumns = Object.assign({}, this.state, {
    //     columns: [],
    //   });
    //   this.setState(emptyColumns);

    //   const reorderedColumns = Object.assign({}, this.state, {
    //     columns: stateCopy.columns,
    //   });
    //   this.setState(reorderedColumns);
    // };

    // eslint-disable-next-line react/sort-comp
    handleTableSortSwap = (reorderedSwap) => {
        swapSortList = reorderedSwap;
    };

    updateTableAsPerRowChooser = (
        inComingColumnsHeaderList,
        pinnedColumnsList
    ) => {
        let existingColumnsHeaderList = this.props.columns;
        existingColumnsHeaderList = existingColumnsHeaderList.filter((item) => {
            return inComingColumnsHeaderList.includes(item.name);
        });
        let rePositionedArray = existingColumnsHeaderList;
        let singleHeaderOneList;
        if (pinnedColumnsList.length > 0) {
            pinnedColumnsList
                .slice(0)
                .reverse()
                .forEach((item, index) => {
                    singleHeaderOneList = existingColumnsHeaderList.filter(
                        (subItem) => item === subItem.name
                    );
                    rePositionedArray = this.arrayMove(
                        existingColumnsHeaderList,
                        existingColumnsHeaderList.indexOf(
                            singleHeaderOneList[0]
                        ),
                        index
                    );
                });
        }
        if (swapList.length > 0) {
            swapList.slice(0).forEach((item, index) => {
                singleHeaderOneList = existingColumnsHeaderList.filter(
                    (subItem) => {
                        return item === subItem.name;
                    }
                );
                rePositionedArray = this.arrayMove(
                    existingColumnsHeaderList,
                    existingColumnsHeaderList.indexOf(singleHeaderOneList[0]),
                    index
                );
            });
        }

        existingColumnsHeaderList = rePositionedArray;
        /**
       making all the frozen attribute as false for all the columns and then 
       setting items of pinnedColumnsList as frozen = true
       */
        existingColumnsHeaderList.forEach((headerItem, index) => {
            if (headerItem.frozen !== undefined && headerItem.frozen === true) {
                existingColumnsHeaderList[index].frozen = false;
            }
            if (pinnedColumnsList.includes(headerItem.name)) {
                existingColumnsHeaderList[index].frozen = true;
            }
        });

        const toTop = (key, value) => (a, b) =>
            (b[key] === value) - (a[key] === value);
        existingColumnsHeaderList.sort(toTop("frozen", true));

        this.setState({
            columns: existingColumnsHeaderList
        });

        const tempList = [];
        existingColumnsHeaderList.forEach((item) => {
            tempList.push(item.name);
        });

        if (swapList.length > 0) {
            for (let i = 0; i < tempList.length; i++) {
                if (tempList[i] === swapList[i])
                    // eslint-disable-next-line react/no-unused-state
                    this.setState({ pinnedReorder: true });
            }
        }
        this.closeColumnReOrdering();
        swapList = [];
        // eslint-disable-next-line react/no-unused-state
        this.setState({ pinnedReorder: false });
    };

    /**
     * Method To re-position a particular object in an Array from oldIndex to newIndex
     * @param {*} arr inComing array
     * @param {*} oldIndex initial index
     * @param {*} newIndex final index
     */
    arrayMove = (arr, oldIndex, newIndex) => {
        if (newIndex >= arr.length) {
            let k = newIndex - arr.length + 1;
            while (k--) {
                arr.push(undefined);
            }
        }
        arr.splice(newIndex, 0, arr.splice(oldIndex, 1)[0]);
        return arr;
    };

    /**
     * Method to render the column Selector Pannel
     */
    columnReorderingPannel = () => {
        this.setState({ selectedIndexes: [] });
        const headerNameList = [];
        const existingPinnedHeadersList = [];
        this.state.columns
            .filter((item) => item.frozen !== undefined && item.frozen === true)
            .map((item) => existingPinnedHeadersList.push(item.name));
        this.state.columns.map((item) => headerNameList.push(item.name));
        this.setState({
            columnReorderingComponent: (
                <ColumnReordering
                    maxLeftPinnedColumn={this.props.maxLeftPinnedColumn}
                    updateTableAsPerRowChooser={this.updateTableAsPerRowChooser}
                    headerKeys={headerNameList}
                    closeColumnReOrdering={this.closeColumnReOrdering}
                    existingPinnedHeadersList={existingPinnedHeadersList}
                    handleheaderNameList={this.handleheaderNameList}
                    {...this.props}
                />
            )
        });
    };

    /**
     * Method to stop the render the column Selector Pannel
     */
    closeColumnReOrdering = () => {
        this.setState({
            columnReorderingComponent: null
        });
    };

    handleSearchValue = (value) => {
        this.setState({ searchValue: value });
    };

    clearSearchValue = () => {
        this.setState({ searchValue: "" });
        this.setState({ filteringRows: this.state.filteringRows });
    };

    sortingPanel = () => {
        this.setState({ selectedIndexes: [] });
        const columnField = [];
        this.state.columns.map((item) => columnField.push(item.name));
        this.setState({
            sortingPanelComponent: (
                <Sorting
                    setTableAsPerSortingParams={(args) =>
                        this.setTableAsPerSortingParams(args)
                    }
                    sortingParamsObjectList={this.state.sortingParamsObjectList}
                    handleTableSortSwap={this.handleTableSortSwap}
                    clearAllSortingParams={this.clearAllSortingParams}
                    columnFieldValue={columnField}
                    closeSorting={this.closeSorting}
                />
            )
        });
    };

    closeSorting = () => {
        this.setState({
            sortingPanelComponent: null,
            sortingOrderSwapList: []
        });
        swapSortList = [];
    };

    clearAllSortingParams = () => {
        const hasSingleSortkey =
            this.state.sortDirection !== "NONE" && this.state.sortColumn !== "";

        let dataRows = this.getFilterResult([...this.state.dataSet]);
        if (this.state.searchValue !== "") {
            const searchKey = String(this.state.searchValue).toLowerCase();
            dataRows = dataRows.filter((item) => {
                return Object.values(item)
                    .toString()
                    .toLowerCase()
                    .includes(searchKey);
            });
        }
        if (hasSingleSortkey) {
            dataRows = this.getSingleSortResult(dataRows);
        }
        this.setState({
            rows: dataRows.slice(
                0,
                this.state.pageIndex * this.state.pageRowCount
            ),
            subDataSet: dataRows
        });
    };

    // Export Data Logic
    exportColumnData = () => {
        let exportData = this.state.dataSet;
        if (this.isSubset()) {
            exportData = this.state.subDataSet;
        }
        this.setState({ selectedIndexes: [] });
        this.setState({
            exportComponent: (
                <ExportData
                    rows={exportData}
                    columnsList={this.state.columns}
                    closeExport={this.closeExport}
                />
            )
        });
    };

    closeExport = () => {
        this.setState({
            exportComponent: null
        });
    };

    setTableAsPerSortingParams = (tableSortList) => {
        const hasFilter = Object.keys(this.state.junk).length > 0;
        const hasSearchKey =
            String(this.state.searchValue).toLowerCase() !== "";
        const hasSingleSortkey =
            this.state.sortDirection !== "NONE" && this.state.sortColumn !== "";
        let existingRows = [...this.state.dataSet];
        if (hasFilter || hasSearchKey || hasSingleSortkey) {
            existingRows = [...this.state.subDataSet];
        }

        let sortingOrderNameList = [];
        tableSortList.forEach((item) => {
            let nameOfItem = "";
            Object.keys(this.state.rows[0]).forEach((rowItem) => {
                if (
                    rowItem.toLowerCase() ===
                    this.toCamelCase(item.sortBy).toLowerCase()
                ) {
                    nameOfItem = rowItem;
                }
            });
            const typeOfItem = this.state.rows[0][item.sortBy === nameOfItem];
            if (typeof typeOfItem === "number") {
                sortingOrderNameList.push({
                    name: nameOfItem,
                    primer: parseInt,
                    reverse: item.order !== "Ascending"
                });
            } else {
                sortingOrderNameList.push({
                    name: nameOfItem,
                    reverse: item.order !== "Ascending"
                });
            }
        });

        if (swapSortList.length > 0) {
            const existingSortingOrderSwapList = this.state
                .sortingOrderSwapList;
            swapSortList.forEach((item, index) => {
                const stringOfItemIndex = `${item}${index}`;
                if (
                    item !== index &&
                    !existingSortingOrderSwapList.includes(
                        stringOfItemIndex.split("").reverse().join("")
                    )
                ) {
                    existingSortingOrderSwapList.push(stringOfItemIndex);
                    sortingOrderNameList = this.arrayMove(
                        sortingOrderNameList,
                        item,
                        index
                    );
                    // eslint-disable-next-line no-param-reassign
                    tableSortList = this.arrayMove(tableSortList, item, index);
                }
                this.setState({
                    sortingOrderSwapList: existingSortingOrderSwapList
                });
            });
        }

        // eslint-disable-next-line no-use-before-define
        existingRows.sort(sortBy(...sortingOrderNameList));
        this.setState({
            rows: existingRows.slice(
                0,
                this.state.pageIndex * this.state.pageRowCount
            ),
            subDataSet: existingRows,
            sortingParamsObjectList: tableSortList
        });

        this.closeSorting();
    };

    // Group sort - while updating conditions like search, filter or sorting; copy of setTableAsPerSortingParams.
    groupSort = (tableSortList, existingRows) => {
        let sortingOrderNameList = [];
        tableSortList.forEach((item) => {
            let nameOfItem = "";
            Object.keys(this.state.rows[0]).forEach((rowItem) => {
                if (
                    rowItem.toLowerCase() ===
                    this.toCamelCase(item.sortBy).toLowerCase()
                ) {
                    nameOfItem = rowItem;
                }
            });
            const typeOfItem = this.state.rows[0][item.sortBy === nameOfItem];
            if (typeof typeOfItem === "number") {
                sortingOrderNameList.push({
                    name: nameOfItem,
                    primer: parseInt,
                    reverse: item.order !== "Ascending"
                });
            } else {
                sortingOrderNameList.push({
                    name: nameOfItem,
                    reverse: item.order !== "Ascending"
                });
            }
        });

        if (swapSortList.length > 0) {
            const existingSortingOrderSwapList = this.state
                .sortingOrderSwapList;
            swapSortList.forEach((item, index) => {
                const stringOfItemIndex = `${item}${index}`;
                if (
                    item !== index &&
                    !existingSortingOrderSwapList.includes(
                        stringOfItemIndex.split("").reverse().join("")
                    )
                ) {
                    existingSortingOrderSwapList.push(stringOfItemIndex);
                    sortingOrderNameList = this.arrayMove(
                        sortingOrderNameList,
                        item,
                        index
                    );
                    // eslint-disable-next-line no-param-reassign
                    tableSortList = this.arrayMove(tableSortList, item, index);
                }
                this.setState({
                    sortingOrderSwapList: existingSortingOrderSwapList
                });
            });
        }

        // eslint-disable-next-line no-use-before-define
        return existingRows.sort(sortBy(...sortingOrderNameList));
    };

    toCamelCase = (str) => {
        return str
            .replace(/\s(.)/g, function ($1) {
                return $1.toUpperCase();
            })
            .replace(/\s/g, "")
            .replace(/^(.)/, function ($1) {
                return $1.toLowerCase();
            });
    };

    // eslint-disable-next-line react/sort-comp
    componentDidUpdate() {
        // Fix for column re-order and pin left issue (functionality was working only after doing a window re-size)
        const resizeEvent = document.createEvent("HTMLEvents");
        resizeEvent.initEvent("resize", true, false);
        window.dispatchEvent(resizeEvent);
    }

    getSearchRecords(e) {
        const searchKey = String(e.target.value).toLowerCase();
        const hasFilter = Object.keys(this.state.junk).length > 0;
        const hasSingleSortkey =
            this.state.sortDirection !== "NONE" && this.state.sortColumn !== "";
        const hasGropSortKeys =
            this.state.sortingParamsObjectList &&
            this.state.sortingParamsObjectList.length > 0;
        let rowsToSearch = [];
        // Remove search key
        if (this.state.searchValue.startsWith(searchKey) || searchKey === "") {
            rowsToSearch = this.getFilterResult([...this.state.dataSet]);
            if (hasSingleSortkey) {
                rowsToSearch = this.getSingleSortResult(rowsToSearch);
            }
            if (hasGropSortKeys) {
                rowsToSearch = this.groupSort(
                    this.state.sortingParamsObjectList,
                    rowsToSearch
                );
            }
            return rowsToSearch;
        }
        // Set search key

        if (
            hasFilter ||
            hasSingleSortkey ||
            searchKey.length > 1 ||
            hasGropSortKeys
        )
            return this.state.subDataSet;
        return this.state.dataSet;
    }

    /**
     * Method To dynamically swap the column from column chooser
     * @param {*} reordered is the swapped array of columns
     */
    handleheaderNameList = (reordered) => {
        swapList = reordered;
    };

    getSingleSortResult = (data) => {
        if (
            this.state.sortDirection !== "NONE" &&
            this.state.sortColumn !== ""
        ) {
            // eslint-disable-next-line prefer-destructuring
            const sortColumn = this.state.sortColumn;
            // eslint-disable-next-line prefer-destructuring
            const sortDirection = this.state.sortDirection;
            this.setState({ selectedIndexes: [] });
            const comparer = (a, b) => {
                if (sortDirection === "ASC") {
                    return a[sortColumn] > b[sortColumn] ? 1 : -1;
                }
                if (sortDirection === "DESC") {
                    return a[sortColumn] < b[sortColumn] ? 1 : -1;
                }
                return 0;
            };
            return sortDirection === "NONE" ? data : [...data].sort(comparer);
        }
        return data;
    };

    /**
     * Method To sort the rows for a particular column
     * @param {*} data is the row datas to be considered for sorting
     * @param {*} sortColumn is the specific column for which the row sort is being triggered
     * @param {*} sortDirection is the type of sort
     */
    sortRows = (data, sortColumn, sortDirection) => {
        this.setState({ selectedIndexes: [] });
        // eslint-disable-next-line consistent-return
        const comparer = (a, b) => {
            if (sortDirection === "ASC") {
                return a[sortColumn] > b[sortColumn] ? 1 : -1;
            }
            if (sortDirection === "DESC") {
                return a[sortColumn] < b[sortColumn] ? 1 : -1;
            }
        };
        const hasFilter = Object.keys(this.state.junk).length > 0;
        const hasSearchKey =
            String(this.state.searchValue).toLowerCase() !== "";
        const hasGropSortKeys =
            this.state.sortingParamsObjectList &&
            this.state.sortingParamsObjectList.length > 0;
        let dtRows = [];
        if (hasFilter || hasSearchKey || hasGropSortKeys) {
            dtRows = this.state.subDataSet;
        } else {
            dtRows = this.state.dataSet;
        }
        const result = [...dtRows].sort(comparer);
        this.setState({
            rows: result.slice(
                0,
                this.state.pageIndex * this.state.pageRowCount
            ),
            subDataSet: result,
            selectedIndexes: [],
            sortColumn: sortDirection === "NONE" ? "" : sortColumn,
            sortDirection
        });
        return sortDirection === "NONE" ? data : this.state.rows;
    };

    getSlicedRows = async (filters, rowsToSplit, firstResult) => {
        let data = [];
        if (rowsToSplit.length > 0) {
            const chunks = [];
            while (rowsToSplit.length) {
                chunks.push(rowsToSplit.splice(0, 500));
            }
            let index = 0;
            chunks.forEach(async (arr) => {
                this.getRowsAsync(arr, filters).then(async (dt) => {
                    index++;
                    data = [...data, ...dt];
                    if (index === chunks.length) {
                        let dtSet = [...firstResult, ...data];
                        if (this.state.searchValue !== "") {
                            const searchKey = String(
                                this.state.searchValue
                            ).toLowerCase();
                            dtSet = dtSet.filter((item) => {
                                return Object.values(item)
                                    .toString()
                                    .toLowerCase()
                                    .includes(searchKey);
                            });
                        }

                        dtSet = this.getSingleSortResult(dtSet);
                        if (
                            this.state.sortingParamsObjectList &&
                            this.state.sortingParamsObjectList.length > 0
                        ) {
                            dtSet = this.groupSort(
                                this.state.sortingParamsObjectList,
                                dtSet
                            );
                        }
                        const rw = dtSet.slice(
                            0,
                            this.state.pageIndex * this.state.pageRowCount
                        );
                        await this.setStateAsync({
                            subDataSet: dtSet,
                            rows: rw,
                            tempRows: rw,
                            count: rw.length
                        });
                        if (dtSet.length === 0) {
                            this.handleWarningStatus();
                        } else {
                            this.closeWarningStatus(rw);
                        }
                    }
                });
            });
        }
    };

    getRowsAsync = async (rows, filters) => {
        let filterVal = { ...filters };
        if (Object.keys(filters).length <= 0) {
            filterVal = {};
        }
        selectors.getRows({ rows: [], filters: {} });
        // eslint-disable-next-line object-shorthand
        return selectors.getRows({ rows: rows, filters: filterVal });
    };

    getrows = (rows, filters) => {
        let filterVal = { ...filters };
        if (Object.keys(filters).length <= 0) {
            filterVal = {};
        }
        selectors.getRows({ rows: [], filters: {} });
        // eslint-disable-next-line object-shorthand
        return selectors.getRows({ rows: rows, filters: filterVal });
    };

    /**
     * Method To bulk/individual deselect of rows
     * @param {*} rows is the deselected row
     */
    onRowsDeselected = (rows) => {
        const rowIndexes = rows.map((r) => r.rowIdx);
        this.setState({
            selectedIndexes: this.state.selectedIndexes.filter(
                (i) => rowIndexes.indexOf(i) === -1
            )
        });
    };

    /**
     * Method To update the cell/cells with the edited values
     * @param {*} fromRow is the row from which this edit is performed
     * @param {*} toRow is the row upto which this edit is performed
     * @param {*} updated is the value of change
     * @param {*} action is type of edit action performed
     */
    onGridRowsUpdated = ({ fromRow, toRow, updated, action }) => {
        let columnName = "";
        const filter = this.formulaAppliedCols.filter((item) => {
            if (updated[item.key] !== null && updated[item.key] !== undefined) {
                columnName = item.key;
                return true;
            }
            return false;
        });

        if (filter.length > 0) {
            // eslint-disable-next-line no-param-reassign
            updated = applyFormula(updated, columnName);
        }

        if (action !== "COPY_PASTE") {
            this.props.updatedRows({ fromRow, toRow, updated, action });
            this.setState((state) => {
                const rows = state.rows.slice();
                for (let i = fromRow; i <= toRow; i++) {
                    rows[i] = {
                        ...rows[i],
                        ...updated
                    };
                }

                return {
                    rows
                };
            });

            this.setState((state) => {
                const filteringRows = state.filteringRows.slice();
                for (let i = fromRow; i <= toRow; i++) {
                    filteringRows[i] = {
                        ...filteringRows[i],
                        ...updated
                    };
                }

                return {
                    filteringRows
                };
            });
            this.setState((state) => {
                const tempRows = state.tempRows.slice();
                for (let i = fromRow; i <= toRow; i++) {
                    tempRows[i] = {
                        ...tempRows[i],
                        ...updated
                    };
                }

                return {
                    tempRows
                };
            });
        }
        if (this.props.updateCellData) {
            this.props.updateCellData(
                this.state.tempRows[fromRow],
                this.state.tempRows[toRow],
                updated,
                action
            );
        }
    };

    /**
     * Method To bulk/individual select of rows
     * @param {*} rows is the selected row
     */
    onRowsSelected = (rows) => {
        this.setState({
            selectedIndexes: this.state.selectedIndexes.concat(
                rows.map((r) => r.rowIdx)
            )
        });
        if (this.props.selectBulkData) {
            this.props.selectBulkData(rows);
        }
    };

    /**
     * Method To filter the multiple columns
     * @param {*} value is the  incoming filtering event
     */
    handleFilterChange = async (value) => {
        const { junk } = this.state;
        if (!(value.filterTerm == null) && !(value.filterTerm.length <= 0)) {
            junk[value.column.key] = value;
        } else {
            delete junk[value.column.key];
        }
        this.setState({ junk });
        const hasFilter = Object.keys(junk).length > 0;
        const firstPage = this.state.dataSet.slice(0, this.state.pageRowCount);
        let data = this.getrows(firstPage, this.state.junk);
        await this.setStateAsync({
            rows: data,
            tempRows: data,
            count: data.length,
            subDataSet: hasFilter ? data : [],
            pageIndex: hasFilter ? this.state.pageIndex : 1
        });
        if (hasFilter) {
            const rowsRemaining = this.state.dataSet.slice(
                this.state.pageRowCount,
                this.state.dataSet.length
            );
            this.getSlicedRows(this.state.junk, rowsRemaining, data);
        } else {
            let rowsRemaining = this.state.dataSet; // .slice(this.state.pageRowCount, this.state.dataSet.length);
            if (this.state.searchValue !== "") {
                const searchKey = String(this.state.searchValue).toLowerCase();
                rowsRemaining = rowsRemaining.filter((item) => {
                    return Object.values(item)
                        .toString()
                        .toLowerCase()
                        .includes(searchKey);
                });
            }
            rowsRemaining = this.getSingleSortResult(rowsRemaining);

            if (
                this.state.sortingParamsObjectList &&
                this.state.sortingParamsObjectList.length > 0
            ) {
                rowsRemaining = this.groupSort(
                    this.state.sortingParamsObjectList,
                    rowsRemaining
                );
            }

            const rw = rowsRemaining.slice(
                0,
                this.state.pageIndex * this.state.pageRowCount
            );
            await this.setStateAsync({
                subDataSet: rowsRemaining,
                rows: rw,
                tempRows: rw,
                count: rw.length
            });
            data = rw;
        }
        if (data.length === 0) {
            this.handleWarningStatus();
        } else {
            this.closeWarningStatus(data);
        }
    };

    isAtBottom = (event) => {
        const { target } = event; // as HTMLDivElement;
        const isbtm =
            target.clientHeight + target.scrollTop >= target.scrollHeight - 10;
        return isbtm;
    };

    isSubset() {
        if (
            Object.keys(this.state.junk).length > 0 ||
            this.state.sortDirection !== "NONE" ||
            this.state.searchValue !== "" ||
            (this.state.sortingParamsObjectList &&
                this.state.sortingParamsObjectList.length > 0)
        ) {
            return true;
        }
        return false;
    }

    loadMoreRows = (from, newRowsCount) => {
        return new Promise((resolve) => {
            // const hasFilter = Object.keys(this.state.junk).length > 0;
            let to = from + newRowsCount;
            if (this.isSubset() && this.state.subDataSet.length > 0) {
                to =
                    to < this.state.subDataSet.length
                        ? to
                        : this.state.subDataSet.length;
                resolve(this.state.subDataSet.slice(from, to));
            } else {
                resolve(this.state.dataSet.slice(from, to));
            }
        });
    };

    handleScroll = async (event) => {
        if (!this.isAtBottom(event)) return;
        const newRows = await this.loadMoreRows(
            this.state.pageIndex * this.state.pageRowCount,
            this.state.pageRowCount
        );
        if (newRows && newRows.length > 0) {
            let length = 0;
            this.setState((prev) => {
                length = prev.rows.length + newRows.length;
            });
            this.setState({
                rows: [...this.state.rows, ...newRows],
                count: length,
                pageIndex: this.state.pageIndex + 1
            });
        }
    };

    globalSearchLogic = (e, updatedRows) => {
        const searchKey = String(e.target.value).toLowerCase();
        const filteredRows = updatedRows.filter((item) => {
            return Object.values(item)
                .toString()
                .toLowerCase()
                .includes(searchKey);
        });
        if (!filteredRows.length) {
            this.setState({ warningStatus: "invalid", rows: [], count: 0 });
        } else {
            const rowSlice = filteredRows.slice(
                0,
                this.state.pageIndex * this.state.pageRowCount
            );
            this.setState({
                warningStatus: "",
                rows: rowSlice,
                subDataSet: filteredRows,
                count: rowSlice.length
            });
        }
    };

    handleWarningStatus = () => {
        this.setState({ warningStatus: "invalid" });
    };

    closeWarningStatus = (val) => {
        let rVal = val;
        if (!rVal) {
            const hasSingleSortkey =
                this.state.sortDirection !== "NONE" &&
                this.state.sortColumn !== "";
            const hasGropSortKeys =
                this.state.sortingParamsObjectList &&
                this.state.sortingParamsObjectList.length > 0;

            let dataRows = this.getFilterResult([...this.state.dataSet]);
            if (hasSingleSortkey) {
                dataRows = this.getSingleSortResult(dataRows);
            }
            if (hasGropSortKeys) {
                dataRows = this.groupSort(
                    this.state.sortingParamsObjectList,
                    dataRows
                );
            }
            rVal = dataRows.slice(
                0,
                this.state.pageIndex * this.state.pageRowCount
            );
        }
        this.setState({ warningStatus: "", rows: rVal, count: rVal.length });
    };

    save = () => {
        this.props.saveRows(this.state.dataSet);
    };

    clearAllFilters = () => {
        const hasSingleSortkey =
            this.state.sortDirection !== "NONE" && this.state.sortColumn !== "";
        const hasGropSortKeys =
            this.state.sortingParamsObjectList &&
            this.state.sortingParamsObjectList.length > 0;

        let dtSet = this.getSearchResult(this.state.dataSet);
        if (hasSingleSortkey) {
            dtSet = this.getSingleSortResult(dtSet);
        }
        if (hasGropSortKeys) {
            dtSet = this.groupSort(this.state.sortingParamsObjectList, dtSet);
        }
        const rVal = dtSet.slice(
            0,
            this.state.pageIndex * this.state.pageRowCount
        );
        this.setState({
            rows: rVal,
            count: rVal.length,
            subDataSet: dtSet
        });
    };
    getSearchResult = (data) => {
        let dtSet = data;
        const searchKey = String(this.state.searchValue).toLowerCase();
        if (searchKey !== "") {
            dtSet = dtSet.filter((item) => {
                return Object.values(item)
                    .toString()
                    .toLowerCase()
                    .includes(searchKey);
            });
        }
        return dtSet;
    };
    getFilterResult = (data) => {
        let dataRows = [];
        if (Object.keys(this.state.junk).length > 0) {
            const rowsToSplit = [...data];
            const chunks = [];
            while (rowsToSplit.length) {
                chunks.push(rowsToSplit.splice(0, 500));
            }
            chunks.forEach((arr) => {
                const dt = this.getrows(arr, this.state.junk);
                dataRows = [...dataRows, ...dt];
            });
        } else {
            dataRows = [...data];
        }
        return dataRows;
    };
    render() {
        return (
            <div onScroll={this.handleScroll}>
                <div className="neo-grid-header">
                    <div className="neo-grid-header__results">
                        Showing &nbsp;<strong> {this.state.count} </strong>{" "}
                        &nbsp; records
                    </div>
                    <div className="neo-grid-header__utilities">
                        <div className="txt-wrap">
                            <input
                                type="text"
                                onChange={(e) => {
                                    this.handleSearchValue(e.target.value);
                                    const srchRows = this.getSearchRecords(e);
                                    this.globalSearchLogic(e, srchRows);
                                }}
                                value={this.state.searchValue}
                                className="txt"
                                placeholder="Search"
                            />
                            <i>
                                <IconSearch />
                            </i>
                        </div>
                        <div
                            className="filterIcons"
                            onClick={this.sortingPanel}
                        >
                            <IconGroupSort />
                        </div>
                        {this.state.sortingPanelComponent}
                        <div
                            className="filterIcons"
                            onClick={this.columnReorderingPannel}
                        >
                            <IconColumns />
                        </div>
                        {this.state.columnReorderingComponent}
                        <div
                            className="filterIcons"
                            onClick={this.exportColumnData}
                        >
                            <IconShare />
                        </div>
                        {this.state.exportComponent}
                    </div>
                </div>
                <ErrorMessage
                    className="errorDiv"
                    status={this.state.warningStatus}
                    closeWarningStatus={() => {
                        this.closeWarningStatus();
                    }}
                    clearSearchValue={this.clearSearchValue}
                />
                <ExtDataGrid
                    toolbar={<Toolbar enableFilter />}
                    getValidFilterValues={(columnKey) =>
                        this.getValidFilterValues(
                            this.state.filteringRows,
                            columnKey
                        )
                    }
                    minHeight={this.state.height}
                    columns={this.state.columns}
                    rowGetter={(i) => this.state.rows[i]}
                    rowsCount={this.state.rows.length}
                    onGridRowsUpdated={this.onGridRowsUpdated}
                    enableCellSelect
                    onClearFilters={() => {
                        this.setState({ junk: {} });
                        this.clearAllFilters();
                    }}
                    onColumnResize={(idx, width) =>
                        console.log(
                            `Column ${idx} has been resized to ${width}`
                        )
                    }
                    onAddFilter={(filter) => this.handleFilterChange(filter)}
                    rowSelection={{
                        showCheckbox: true,
                        enableShiftSelect: true,
                        onRowsSelected: this.onRowsSelected,
                        onRowsDeselected: this.onRowsDeselected,
                        selectBy: {
                            indexes: this.state.selectedIndexes
                        }
                    }}
                    onGridSort={(sortColumn, sortDirection) =>
                        this.sortRows(
                            this.state.filteringRows,
                            sortColumn,
                            sortDirection
                        )
                    }
                    globalSearch={this.globalSearchLogic}
                    handleWarningStatus={this.handleWarningStatus}
                    closeWarningStatus={this.closeWarningStatus}
                    // cellRangeSelection={{
                    //   onComplete: this.setSelection,
                    // }}
                />
            </div>
        );
    }
}

/**
 * Global Method To Sort The Grid.
 */
let sortBy;
(function () {
    // utility functions
    const defaultCmp = function (a, b) {
        if (a === b) return 0;
        return a < b ? -1 : 1;
    };
    const getCmpFunc = function (primer, reverse) {
        let cmp = defaultCmp;
        if (primer) {
            cmp = function (a, b) {
                return defaultCmp(primer(a), primer(b));
            };
        }
        if (reverse) {
            return function (a, b) {
                return -1 * cmp(a, b);
            };
        }
        return cmp;
    };

    // actual implementation
    sortBy = function () {
        const fields = [];
        const nFields = arguments.length;
        let field;
        let name;
        let cmp;

        // preprocess sorting options
        for (let i = 0; i < nFields; i++) {
            // eslint-disable-next-line prefer-rest-params
            field = arguments[i];
            if (typeof field === "string") {
                name = field;
                cmp = defaultCmp;
            } else {
                name = field.name;
                cmp = getCmpFunc(field.primer, field.reverse);
            }
            fields.push({
                name,
                cmp
            });
        }

        return function (A, B) {
            let result;
            for (let i = 0, l = nFields; i < l; i++) {
                result = 0;
                field = fields[i];
                name = field.name;
                cmp = field.cmp;

                result = cmp(A[name], B[name]);
                if (result !== 0) break;
            }
            return result;
        };
    };
})();

Spreadsheet.propTypes = {
    airportCodes: PropTypes.any,
    rows: PropTypes.any,
    columns: PropTypes.any,
    status: PropTypes.any,
    count: PropTypes.any,
    updateCellData: PropTypes.any,
    selectBulkData: PropTypes.any,
    pinnedReorder: PropTypes.any,
    maxLeftPinnedColumn: PropTypes.any,
    globalSearchLogic: PropTypes.any,
    closeWarningStatus: PropTypes.any,
    dataSet: PropTypes.any,
    pageSize: PropTypes.any
};

export default Spreadsheet;
