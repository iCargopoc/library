import React, { Component } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";
import MultiBackend, { TouchTransition } from "react-dnd-multi-backend";
import PropTypes from "prop-types";
import ClickAwayListener from "react-click-away-listener";
import ColumnsList from "./columnsList";
import { IconClose, IconJustify } from "../../utilities/svgUtilities";

const HTML5toTouch = {
    backends: [
        {
            backend: HTML5Backend
        },
        {
            backend: TouchBackend,
            options: { enableMouseEvents: true },
            preview: true,
            transition: TouchTransition
        }
    ]
};

class ColumnReordering extends Component {
    constructor(props) {
        super(props);
        const {
            headerKeys,
            columns,
            existingPinnedHeadersList,
            maxLeftPinnedColumn
        } = this.props;
        this.state = {
            columnReorderEntityList: headerKeys,
            columnSelectList: columns.map((item) => item.name),
            leftPinnedColumList: existingPinnedHeadersList,
            isAllSelected: true,
            maxLeftPinnedColumns: maxLeftPinnedColumn
        };

        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        const { closeColumnReOrdering } = this.props;
        closeColumnReOrdering();
    }

    /**
     * Method to reset the coloumn list onClick of Reset button
     */
    resetColumnReorderList = () => {
        const { columns } = this.props;
        this.setState({
            columnReorderEntityList: columns.map((item) => item.name),
            leftPinnedColumList: [],
            isAllSelected: true
        });
    };

    /**
     * Method to Select all options in the coloumn list onClick of Select All button
     */

    selectAllToColumnReOrderList = () => {
        this.resetColumnReorderList();
        const { columnReorderEntityList, isAllSelected } = this.state;
        let existingColumnReorderEntityList = columnReorderEntityList;
        const { columns } = this.props;
        let isExistingAllSelect = isAllSelected;
        if (!isExistingAllSelect) {
            existingColumnReorderEntityList = columns.map((item) => item.name);
            isExistingAllSelect = true;
        } else {
            existingColumnReorderEntityList = [];
            isExistingAllSelect = false;
        }
        this.setState({
            columnReorderEntityList: existingColumnReorderEntityList,
            isAllSelected: isExistingAllSelect,
            leftPinnedColumList: []
        });
    };

    /**
     * Method To add a column to columnReorderEntityList when selected.
     * @param {String} typeToBeAdded
     */
    addToColumnReorderEntityList = (typeToBeAdded) => {
        const {
            columnReorderEntityList,
            leftPinnedColumList,
            columnSelectList
        } = this.state;
        let existingColumnReorderEntityList = columnReorderEntityList;
        let existingLeftPinnedList = leftPinnedColumList;
        if (!existingColumnReorderEntityList.includes(typeToBeAdded)) {
            let indexOfInsertion = columnSelectList.findIndex(
                (item) => item === typeToBeAdded
            );
            while (indexOfInsertion > 0) {
                let check = indexOfInsertion;
                if (
                    existingColumnReorderEntityList.includes(
                        columnSelectList[check - 1]
                    )
                ) {
                    if (
                        !existingLeftPinnedList.includes(
                            columnSelectList[check - 1]
                        )
                    ) {
                        check = existingColumnReorderEntityList.findIndex(
                            (item) => item === columnSelectList[check - 1]
                        );
                        indexOfInsertion += 1;
                        break;
                    } else {
                        indexOfInsertion -= 1;
                    }
                } else {
                    indexOfInsertion -= 1;
                }
            }
            existingColumnReorderEntityList.splice(
                indexOfInsertion,
                0,
                typeToBeAdded
            );
        } else {
            existingColumnReorderEntityList = existingColumnReorderEntityList.filter(
                (item) => {
                    if (item !== typeToBeAdded) return item;
                    return "";
                }
            );
            if (existingLeftPinnedList.includes(typeToBeAdded)) {
                existingLeftPinnedList = existingLeftPinnedList.filter(
                    (item) => item !== typeToBeAdded
                );
            }
        }
        this.setState({
            columnReorderEntityList: existingColumnReorderEntityList,
            isAllSelected: false,
            leftPinnedColumList: existingLeftPinnedList
        });
    };

    /**
     * Method to handle the like-search on key stroke.
     * @param {Event} e
     */
    filterColumnReorderList = (e) => {
        const { columns } = this.props;
        const searchKey = String(e.target.value).toLowerCase();
        const existingList = columns.map((item) => item.name);
        let filtererdColumnReorderList = [];
        if (searchKey.length > 0) {
            filtererdColumnReorderList = existingList.filter((item) => {
                return item.toLowerCase().includes(searchKey);
            });
        } else {
            filtererdColumnReorderList = columns.map((item) => item.name);
        }
        this.setState({
            columnSelectList: filtererdColumnReorderList
        });
    };

    createColumnsArrayFromProps = (colsList) => {
        const { leftPinnedColumList, maxLeftPinnedColumns } = this.state;
        return colsList.map((item) => {
            return {
                id: item,
                text: (
                    <div className="ng-popover--column__reorder" key={item}>
                        <div
                            style={{ cursor: "move" }}
                            className="ng-popover--column__drag"
                        >
                            <i>
                                <IconJustify className="ng-icon" />
                            </i>
                        </div>
                        <span>{item}</span>
                        <div className="ng-popover--column__list">
                            <div className="ng-popover--column__wrap">
                                <div className="ng-popover--column__check">
                                    <div className="neo-form-check">
                                        <input
                                            data-testid="reArrangeLeftPin"
                                            className="neo-checkbox form-check-input"
                                            role="button"
                                            type="checkbox"
                                            id={`checkBoxToPinLeft_${item}`}
                                            checked={leftPinnedColumList.includes(
                                                item
                                            )}
                                            disabled={
                                                maxLeftPinnedColumns -
                                                    leftPinnedColumList.length <=
                                                0
                                                    ? !leftPinnedColumList.includes(
                                                          item
                                                      )
                                                    : false
                                            }
                                            onChange={() =>
                                                this.reArrangeLeftPinnedColumn(
                                                    item
                                                )
                                            }
                                        />
                                        <label
                                            htmlFor={`checkBoxToPinLeft_${item}`}
                                            className="neo-form-check__label"
                                        >
                                            Pin Left
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            };
        });
    };

    /**
     * Method to handle the position of columns Names when left pinned in coloumn selector view.
     * @param {String} columHeaderName
     */
    reArrangeLeftPinnedColumn = (columHeaderName) => {
        const { leftPinnedColumList, columnReorderEntityList } = this.state;
        let existingLeftPinnedList = leftPinnedColumList;
        let existingColumnReorderEntityList = columnReorderEntityList;
        if (!existingLeftPinnedList.includes(columHeaderName)) {
            existingLeftPinnedList.unshift(columHeaderName);
        } else {
            existingLeftPinnedList = existingLeftPinnedList.filter(
                (item) => item !== columHeaderName
            );
        }
        this.setState({
            leftPinnedColumList: existingLeftPinnedList
        });

        existingLeftPinnedList.forEach((item) => {
            existingColumnReorderEntityList = existingColumnReorderEntityList.filter(
                (subItem) => subItem !== item
            );
            existingColumnReorderEntityList.unshift(item);
            return null;
        });
        this.setState({
            columnReorderEntityList: existingColumnReorderEntityList
        });
    };

    handleReorderList = (reordered) => {
        const { handleheaderNameList } = this.props;
        handleheaderNameList(reordered);
    };

    render() {
        const {
            columnReorderEntityList,
            columnSelectList,
            maxLeftPinnedColumns,
            leftPinnedColumList
        } = this.state;
        const {
            columns,
            closeColumnReOrdering,
            updateTableAsPerRowChooser
        } = this.props;
        return (
            <ClickAwayListener
                onClickAway={this.handleClick}
                className="ng-popover ng-popover--column"
                data-testid="managecolumnoverlay"
            >
                <div className="ng-popover__chooser">
                    <div className="ng-popover__header">
                        <span>Column Chooser</span>
                    </div>
                    <div className="ng-chooser-body">
                        <input
                            type="text"
                            placeholder="Search column"
                            className="ng-chooser-body__txt"
                            data-testid="filterColumnsList"
                            onChange={this.filterColumnReorderList}
                        />
                        <div className="ng-chooser-body__selectall">
                            <div className="neo-form-check">
                                <input
                                    type="checkbox"
                                    data-testid="selectAllCheckBox"
                                    className="neo-checkbox form-check-input"
                                    id="selectallcolumncheckbox"
                                    onChange={() =>
                                        this.selectAllToColumnReOrderList()
                                    }
                                    checked={
                                        columnReorderEntityList.length ===
                                        columns.length
                                    }
                                />
                                <label
                                    htmlFor="chk_selectAllSearchableColumns"
                                    className="neo-form-check__label"
                                >
                                    Select All
                                </label>
                            </div>
                        </div>
                        {columnSelectList.map((item) => {
                            return (
                                <div
                                    className="ng-chooser-body__wrap"
                                    key={item}
                                >
                                    <div className="ng-chooser-body__checkwrap">
                                        <div className="neo-form-check">
                                            <input
                                                data-testid="addToColumnReorderEntityList"
                                                type="checkbox"
                                                className="neo-checkbox form-check-input"
                                                id={`checkboxtoselectreorder_${item}`}
                                                checked={columnReorderEntityList.includes(
                                                    item
                                                )}
                                                onChange={() =>
                                                    this.addToColumnReorderEntityList(
                                                        item
                                                    )
                                                }
                                            />
                                            <label
                                                htmlFor={`chk_selectSearchableColumn_${item}`}
                                                className="neo-form-check__label"
                                            >
                                                {item}
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
                <div className="ng-popover__settings">
                    <div className="ng-popover__header">
                        <span>Column Settings</span>
                        <div
                            role="presentation"
                            data-testid="closeColumnReordering"
                            className="ng-popover--column__close"
                            onClick={() => closeColumnReOrdering()}
                        >
                            <i>
                                <IconClose className="ng-icon" />
                            </i>
                        </div>
                    </div>
                    <div className="ng-popover--column__body">
                        <strong>
                            &nbsp; &nbsp; Selected Column Count :{" "}
                            {columnReorderEntityList.length}
                        </strong>
                        {maxLeftPinnedColumns - leftPinnedColumList.length >
                        0 ? (
                            <strong>
                                &nbsp; &nbsp; Left Pinned Column Count Remaining
                                :{" "}
                                {maxLeftPinnedColumns -
                                    leftPinnedColumList.length}
                            </strong>
                        ) : (
                            <strong style={{ color: "red" }}>
                                &nbsp; &nbsp; Maximum Count Of Left Pin Columns
                                REACHED
                            </strong>
                        )}

                        <DndProvider
                            backend={MultiBackend}
                            options={HTML5toTouch}
                        >
                            <ColumnsList
                                columnsArray={this.createColumnsArrayFromProps(
                                    columnReorderEntityList
                                )}
                                handleReorderList={this.handleReorderList}
                            />
                        </DndProvider>
                    </div>
                    <div className="ng-popover__footer">
                        <button
                            data-testid="resetButton"
                            type="button"
                            className="neo-btn neo-btn-default btn btn-secondary"
                            onClick={() => this.resetColumnReorderList()}
                        >
                            Reset
                        </button>
                        <button
                            data-testid="cancelButton"
                            type="button"
                            className="neo-btn neo-btn-default btn btn-secondary"
                            onClick={() => closeColumnReOrdering()}
                        >
                            Cancel
                        </button>
                        <button
                            data-testid="saveButton"
                            type="button"
                            className="neo-btn neo-btn-primary btn btn-secondary"
                            onClick={() =>
                                updateTableAsPerRowChooser(
                                    columnReorderEntityList,
                                    leftPinnedColumList
                                )
                            }
                        >
                            Save
                        </button>
                    </div>
                </div>
            </ClickAwayListener>
        );
    }
}

ColumnReordering.propTypes = {
    headerKeys: PropTypes.array,
    columns: PropTypes.arrayOf(PropTypes.object),
    existingPinnedHeadersList: PropTypes.arrayOf(PropTypes.object),
    maxLeftPinnedColumn: PropTypes.number,
    closeColumnReOrdering: PropTypes.func,
    handleheaderNameList: PropTypes.func,
    updateTableAsPerRowChooser: PropTypes.func
};

export default ColumnReordering;
