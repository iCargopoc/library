/* eslint-disable react/destructuring-assignment */
/* eslint no-unused-expressions: ["error", {"allowTernary": true }] */
/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable no-loop-func */
/* eslint-disable no-else-return */

import React from "react";
import { DndProvider } from "react-dnd";
import { TouchBackend } from "react-dnd-touch-backend";
import PropTypes from "prop-types";
import ColumnsList from "./columnsList";
import IconClose from "../../Images/icon-close.svg";
import IconJustify from "../../Images/icon-align-justify.svg";

class ColumnReordering extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            columnReorderEntityList: this.props.headerKeys,
            columnSelectList: this.props.columns.map((item) => item.name),
            leftPinnedColumList: this.props.existingPinnedHeadersList,
            isAllSelected: true,
            maxLeftPinnedColumn: this.props.maxLeftPinnedColumn
        };
        this.setWrapperRef = this.setWrapperRef.bind(this);
        this.handleClickOutside = this.handleClickOutside.bind(this);
    }

    componentDidMount() {
        document.addEventListener("mousedown", this.handleClickOutside);
    }

    componentWillUnmount() {
        document.removeEventListener("mousedown", this.handleClickOutside);
    }

    setWrapperRef(node) {
        this.wrapperRef = node;
    }

    /**
     * Method to reset the coloumn list onClick of Reset button
     */
    resetColumnReorderList = () => {
        this.setState({
            columnReorderEntityList: this.props.columns.map(
                (item) => item.name
            ),
            leftPinnedColumList: [],
            isAllSelected: true
        });
    };

    /**
     * Method to Select all options in the coloumn list onClick of Select All button
     */
    selectAllToColumnReOrderList = () => {
        this.resetColumnReorderList();
        let existingColumnReorderEntityList = this.state
            .columnReorderEntityList;
        let isExistingAllSelect = this.state.isAllSelected;
        if (!isExistingAllSelect) {
            existingColumnReorderEntityList = this.props.columns.map(
                (item) => item.name
            );
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
        let existingColumnReorderEntityList = this.state
            .columnReorderEntityList;
        let existingLeftPinnedList = this.state.leftPinnedColumList;
        if (!existingColumnReorderEntityList.includes(typeToBeAdded)) {
            let indexOfInsertion = this.state.columnSelectList.findIndex(
                (item) => item === typeToBeAdded
            );
            while (indexOfInsertion > 0) {
                if (
                    existingColumnReorderEntityList.includes(
                        this.state.columnSelectList[indexOfInsertion - 1]
                    )
                ) {
                    if (
                        !existingLeftPinnedList.includes(
                            this.state.columnSelectList[indexOfInsertion - 1]
                        )
                    ) {
                        indexOfInsertion = existingColumnReorderEntityList.findIndex(
                            (item) =>
                                item ===
                                this.state.columnSelectList[
                                    indexOfInsertion - 1
                                ]
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
                    else return "";
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
        const searchKey = String(e.target.value).toLowerCase();
        const existingList = this.props.columns.map((item) => item.name);
        let filtererdColumnReorderList = [];
        if (searchKey.length > 0) {
            filtererdColumnReorderList = existingList.filter((item) => {
                return item.toLowerCase().includes(searchKey);
            });
        } else {
            filtererdColumnReorderList = this.props.columns.map(
                (item) => item.name
            );
        }
        this.setState({
            columnSelectList: filtererdColumnReorderList
        });
    };

    createColumnsArrayFromProps = (colsList) => {
        return colsList.map((item) => {
            return {
                id: item,
                text: (
                    <div className="column__reorder" key={item}>
                        <div style={{ cursor: "move" }} className="column_drag">
                            <i>
                                <img
                                    src={IconJustify}
                                    alt="Column Chooser Drag Icon"
                                />
                            </i>
                        </div>
                        <div className="column__reorder__name">{item}</div>
                        <div className="column__innerCells__wrap">
                            <div className="column__wrap">
                                <div className="column__checkbox">
                                    <input
                                        role="button"
                                        type="checkbox"
                                        id={`checkBoxToPinLeft_${item}`}
                                        checked={this.state.leftPinnedColumList.includes(
                                            item
                                        )}
                                        disabled={
                                            this.state.maxLeftPinnedColumn -
                                                this.state.leftPinnedColumList
                                                    .length <=
                                            0
                                                ? !this.state.leftPinnedColumList.includes(
                                                      item
                                                  )
                                                : false
                                        }
                                        onChange={() =>
                                            this.reArrangeLeftPinnedColumn(item)
                                        }
                                    />
                                </div>
                                <div className="column__txt">Pin Left</div>
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
        let existingLeftPinnedList = this.state.leftPinnedColumList;
        let existingColumnReorderEntityList = this.state
            .columnReorderEntityList;
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
        this.props.handleheaderNameList(reordered);
    };

    handleClickOutside(event) {
        if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
            this.props.closeColumnReOrdering();
        }
    }

    render() {
        return (
            <div
                className="neo-popover neo-popover--column columns--grid"
                ref={this.setWrapperRef}
            >
                <div className="neo-popover__column column__grid">
                    <div className="column__chooser">
                        <div className="column__header">
                            <div className="">
                                <strong>Column Chooser</strong>
                            </div>
                        </div>
                        <div className="column__body">
                            <div>
                                <input
                                    type="text"
                                    placeholder="Search column"
                                    className="custom__ctrl"
                                    onChange={this.filterColumnReorderList}
                                />
                            </div>
                            <div className="column__selectAll">
                                <div className="column__checkbox">
                                    <input
                                        type="checkbox"
                                        id="selectallcolumncheckbox"
                                        onChange={() =>
                                            this.selectAllToColumnReOrderList()
                                        }
                                        checked={
                                            this.state.columnReorderEntityList
                                                .length ===
                                            this.props.columns.length
                                        }
                                    />
                                </div>
                                <div className="column__txt">Select all</div>
                            </div>
                            {this.state.columnSelectList.map((item) => {
                                return (
                                    <div className="column__wrap" key={item}>
                                        <div className="column__checkbox">
                                            <input
                                                type="checkbox"
                                                id={`checkboxtoselectreorder_${item}`}
                                                checked={this.state.columnReorderEntityList.includes(
                                                    item
                                                )}
                                                onChange={() =>
                                                    this.addToColumnReorderEntityList(
                                                        item
                                                    )
                                                }
                                            />
                                        </div>
                                        <div className="column__txt">
                                            {item}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    <div className="column__settings">
                        <div className="column__header">
                            <div className="column__headerTxt">
                                <strong>Column Settings</strong>
                            </div>
                            <div className="column__close">
                                <i>
                                    <img
                                        src={IconClose}
                                        alt="Column chooser Close Icon"
                                    />
                                </i>
                            </div>
                        </div>

                        <div className="column__body">
                            <div className="column__info">
                                <strong>
                                    &nbsp; &nbsp; Selected Column Count :{" "}
                                    {this.state.columnReorderEntityList.length}
                                </strong>
                                {this.state.maxLeftPinnedColumn -
                                    this.state.leftPinnedColumList.length >
                                0 ? (
                                    <strong>
                                        &nbsp; &nbsp; Left Pinned Column Count
                                        Remaining :{" "}
                                        {this.state.maxLeftPinnedColumn -
                                            this.state.leftPinnedColumList
                                                .length}
                                    </strong>
                                ) : (
                                    <strong style={{ color: "red" }}>
                                        &nbsp; &nbsp; Maximum Count Of Left Pin
                                        Columns REACHED
                                    </strong>
                                )}
                            </div>
                            <DndProvider
                                backend={TouchBackend}
                                options={{ enableMouseEvents: true }}
                            >
                                <ColumnsList
                                    columnsArray={this.createColumnsArrayFromProps(
                                        this.state.columnReorderEntityList
                                    )}
                                    handleReorderList={this.handleReorderList}
                                />
                            </DndProvider>
                        </div>
                        <div className="column__footer">
                            <div className="column__btns">
                                <button
                                    type="button"
                                    className="btns"
                                    onClick={() =>
                                        this.resetColumnReorderList()
                                    }
                                >
                                    Reset
                                </button>
                                <button
                                    type="button"
                                    className="btns"
                                    onClick={() =>
                                        this.props.closeColumnReOrdering()
                                    }
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    className="btns btns__save"
                                    onClick={() =>
                                        this.props.updateTableAsPerRowChooser(
                                            this.state.columnReorderEntityList,
                                            this.state.leftPinnedColumList
                                        )
                                    }
                                >
                                    Save
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

ColumnReordering.propTypes = {
    headerKeys: PropTypes.any,
    columns: PropTypes.any,
    existingPinnedHeadersList: PropTypes.any,
    maxLeftPinnedColumn: PropTypes.any,
    closeColumnReOrdering: PropTypes.any,
    handleheaderNameList: PropTypes.any,
    updateTableAsPerRowChooser: PropTypes.any
};

export default ColumnReordering;
