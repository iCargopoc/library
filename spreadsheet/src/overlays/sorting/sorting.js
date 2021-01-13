import React from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";
import MultiBackend, { TouchTransition } from "react-dnd-multi-backend";
import PropTypes from "prop-types";
import ClickAwayListener from "react-click-away-listener";
import SortingList from "./sortingList";
import {
    IconNav,
    SortCopy,
    IconClose,
    SortDelete
} from "../../utilities/svgUtilities";

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

class App extends React.Component {
    constructor(props) {
        super(props);
        const { sortingParamsObjectList } = this.props;
        this.state = {
            rowList: [true],
            sortingOrderList:
                sortingParamsObjectList === undefined
                    ? []
                    : sortingParamsObjectList,
            errorMessage: false
        };
    }

    add = () => {
        const { rowList, sortingOrderList } = this.state;
        const { columnFieldValue } = this.props;
        const rowLists = [...rowList];
        rowLists.push(true);
        const existingSortingOrderList = sortingOrderList;
        existingSortingOrderList.push({
            sortBy: columnFieldValue[0],
            order: "Ascending",
            sortOn: "Value"
        });
        this.setState({
            rowList: rowLists,
            sortingOrderList: existingSortingOrderList
        });
    };

    copy = (i) => {
        const { sortingOrderList } = this.state;
        const rowList = [...sortingOrderList];
        rowList.push(JSON.parse(JSON.stringify(rowList[i])));
        this.setState({ sortingOrderList: rowList });
    };

    clearAll = () => {
        const { clearAllSortingParams } = this.props;
        this.setState({
            sortingOrderList: [],
            errorMessage: false
        });
        clearAllSortingParams();
    };

    remove = (i) => {
        const { sortingOrderList } = this.state;
        const sortingOrderLists = [...sortingOrderList];
        sortingOrderLists.splice(i, 1);
        this.setState({ sortingOrderList: sortingOrderLists });
        if (sortingOrderList.length <= 1) {
            this.setState({ errorMessage: false });
        }
    };

    createColumnsArrayFromProps = (rowsValue) => {
        const { columnFieldValue } = this.props;
        return rowsValue.map((row, index) => {
            return {
                id: index,
                text: (
                    <div
                        className="ng-popover--sort__items"
                        data-testid="sortItem"
                        key={row}
                    >
                        <div className="ng-popover__reorder">
                            <div
                                className="ng-popover__drag"
                                data-testid="sortItemDnd"
                            >
                                <i className="ng-icon-block">
                                    <IconNav className="ng-icon" />
                                </i>
                            </div>
                        </div>
                        <div className="ng-popover--sort__reorder">
                            <div>
                                <select
                                    data-testid="selectSortingField"
                                    className="ng-popover--sort__select"
                                    name="sortBy"
                                    onChange={(e) =>
                                        this.captureSortingFeildValues(
                                            e,
                                            index,
                                            "sortBy"
                                        )
                                    }
                                    value={row.sortBy}
                                >
                                    {columnFieldValue.map((item) => (
                                        <option key={item}>{item}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="ng-popover--sort__reorder">
                            <div>
                                <select
                                    className="ng-popover--sort__select"
                                    name="sortOn"
                                    data-testid="selectingValue"
                                    onChange={(e) =>
                                        this.captureSortingFeildValues(
                                            e,
                                            index,
                                            "sortOn"
                                        )
                                    }
                                    value={row.sortOn}
                                >
                                    <option>Value</option>
                                </select>
                            </div>
                        </div>
                        <div className="ng-popover--sort__reorder">
                            <div>
                                <select
                                    data-testid="selectOrder"
                                    className="ng-popover--sort__select"
                                    name="order"
                                    onChange={(e) =>
                                        this.captureSortingFeildValues(
                                            e,
                                            index,
                                            "order"
                                        )
                                    }
                                    value={row.order}
                                >
                                    <option>Ascending</option>
                                    <option>Descending</option>
                                </select>
                            </div>
                        </div>
                        <div className="ng-popover--sort__reorder">
                            <div
                                data-testid="copySort"
                                role="presentation"
                                className="ng-popover--sort__icon"
                                onClick={() => this.copy(index)}
                            >
                                <i>
                                    <SortCopy className="ng-icon" />
                                </i>
                            </div>
                        </div>
                        <div className="ng-popover--sort__reorder">
                            <div
                                data-testid="removeSort"
                                role="presentation"
                                className="ng-popover--sort__icon"
                                onClick={() => this.remove(index)}
                            >
                                <i>
                                    <SortDelete className="ng-icon" />
                                </i>
                            </div>
                        </div>
                    </div>
                )
            };
        });
    };

    captureSortingFeildValues = (event, index, sortingKey) => {
        const { sortingOrderList } = this.state;
        const existingSortingOrderList = sortingOrderList;

        if (sortingKey === "sortBy") {
            existingSortingOrderList[index].sortBy = event.target.value;
        }
        if (sortingKey === "order") {
            existingSortingOrderList[index].order = event.target.value;
        }
        if (
            existingSortingOrderList[index].sortOn === "" ||
            existingSortingOrderList[index].sortOn === undefined
        ) {
            existingSortingOrderList[index].sortOn = "Value";
        }
        this.setState({
            sortingOrderList: existingSortingOrderList
        });
    };

    updateTableAsPerSortCondition = () => {
        const { sortingOrderList } = this.state;
        const unique = new Set();
        const showError = sortingOrderList.some(
            (element) => unique.size === unique.add(element.sortBy).size
        );
        const { setTableAsPerSortingParams } = this.props;
        if (showError) {
            this.setState({ errorMessage: true });
        } else {
            this.setState({ errorMessage: false });
            setTableAsPerSortingParams(sortingOrderList);
        }
    };

    /**
     *
     * @param {*} reOrderedSortingList
     */
    handleReorderListOfSort = (reOrderedIndexList) => {
        const { handleTableSortSwap } = this.props;
        handleTableSortSwap(reOrderedIndexList);
    };

    handleClick = () => {
        const { closeSorting } = this.props;
        closeSorting();
    };

    render() {
        const { sortingOrderList, errorMessage } = this.state;
        const { closeSorting } = this.props;
        return (
            <ClickAwayListener
                onClickAway={this.handleClick}
                className="ng-popover ng-popover--sort"
                data-testid="groupsortoverlay"
            >
                <div className="ng-popover__header">
                    <span>Group Sort</span>
                    <div className="ng-popover__close">
                        <i
                            role="presentation"
                            data-testid="closeSorting"
                            onClick={() => closeSorting()}
                        >
                            <IconClose className="ng-icon" />
                        </i>
                    </div>
                </div>
                <div className="ng-popover__content">
                    <DndProvider backend={MultiBackend} options={HTML5toTouch}>
                        <SortingList
                            handleReorderListOfSort={
                                this.handleReorderListOfSort
                            }
                            sortsArray={this.createColumnsArrayFromProps(
                                sortingOrderList
                            )}
                        />
                    </DndProvider>
                </div>
                <div className="ng-popover--sort__warning">
                    {errorMessage ? (
                        <span className="alert alert-danger">
                            Duplicate sort options found.
                        </span>
                    ) : (
                        ""
                    )}
                </div>
                <div className="ng-popover--sort__new">
                    <div
                        role="presentation"
                        className="ng-popover--sort__section"
                        data-testid="addSort"
                        onClick={() => this.add()}
                        onKeyDown={() => this.add()}
                    >
                        <span className="ng-popover--sort__icon-plus">+</span>
                        <div className="ng-popover__txt">New Sort</div>
                    </div>
                </div>
                <div className="ng-popover__footer">
                    <button
                        type="button"
                        className="neo-btn neo-btn-link btn btn-secondary"
                        onClick={this.clearAll}
                    >
                        Clear All
                    </button>

                    <button
                        data-testid="applySort"
                        type="button"
                        className="neo-btn neo-btn-primary btn btn-secondary"
                        onClick={() => this.updateTableAsPerSortCondition()}
                    >
                        Ok
                    </button>
                </div>
            </ClickAwayListener>
        );
    }
}

App.propTypes = {
    sortingParamsObjectList: PropTypes.arrayOf(PropTypes.object),
    closeSorting: PropTypes.func,
    columnFieldValue: PropTypes.any,
    clearAllSortingParams: PropTypes.func,
    setTableAsPerSortingParams: PropTypes.func,
    handleTableSortSwap: PropTypes.func
};

export default App;
