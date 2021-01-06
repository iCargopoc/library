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
                    <div className="column__reorder" key={item}>
                        <div style={{ cursor: "move" }} className="column_drag">
                            <i>
                                <IconJustify />
                            </i>
                        </div>
                        <div className="column__reorder__name">{item}</div>
                        <div className="column__innerCells__wrap">
                            <div className="column__wrap">
                                <div className="column__checkbox">
                                    <input
                                        data-testid="reArrangeLeftPin"
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
            <ClickAwayListener onClickAway={this.handleClick}>
                <div className="neo-spreadsheet-popover neo-spreadsheet-popover--column columns--grid">
                    <div className="neo-spreadsheet-popover__column column__grid">
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
                                            data-testid="selectAllCheckBox"
                                            id="selectallcolumncheckbox"
                                            onChange={() =>
                                                this.selectAllToColumnReOrderList()
                                            }
                                            checked={
                                                columnReorderEntityList.length ===
                                                columns.length
                                            }
                                        />
                                    </div>
                                    <div className="column__txt">
                                        Select all
                                    </div>
                                </div>
                                {columnSelectList.map((item) => {
                                    return (
                                        <div
                                            className="column__wrap"
                                            key={item}
                                        >
                                            <div className="column__checkbox">
                                                <input
                                                    data-testid="addToColumnReorderEntityList"
                                                    type="checkbox"
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
                                <div
                                    role="presentation"
                                    data-testid="closeColumnReordering"
                                    className="column__close"
                                    onClick={() => closeColumnReOrdering()}
                                >
                                    <i>
                                        <IconClose />
                                    </i>
                                </div>
                            </div>

                            <div className="column__body">
                                <div className="column__info">
                                    <strong>
                                        &nbsp; &nbsp; Selected Column Count :{" "}
                                        {columnReorderEntityList.length}
                                    </strong>
                                    {maxLeftPinnedColumns -
                                        leftPinnedColumList.length >
                                    0 ? (
                                        <strong>
                                            &nbsp; &nbsp; Left Pinned Column
                                            Count Remaining :{" "}
                                            {maxLeftPinnedColumns -
                                                leftPinnedColumList.length}
                                        </strong>
                                    ) : (
                                        <strong style={{ color: "red" }}>
                                            &nbsp; &nbsp; Maximum Count Of Left
                                            Pin Columns REACHED
                                        </strong>
                                    )}
                                </div>
                                <DndProvider
                                    backend={MultiBackend}
                                    options={HTML5toTouch}
                                >
                                    <ColumnsList
                                        columnsArray={this.createColumnsArrayFromProps(
                                            columnReorderEntityList
                                        )}
                                        handleReorderList={
                                            this.handleReorderList
                                        }
                                    />
                                </DndProvider>
                            </div>
                            <div className="column__footer">
                                <div className="column__btns">
                                    <button
                                        data-testid="resetButton"
                                        type="button"
                                        className="btns"
                                        onClick={() =>
                                            this.resetColumnReorderList()
                                        }
                                    >
                                        Reset
                                    </button>
                                    <button
                                        data-testid="cancelButton"
                                        type="button"
                                        className="btns"
                                        onClick={() => closeColumnReOrdering()}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        data-testid="saveButton"
                                        type="button"
                                        className="btns btns__save"
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
                        </div>
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
