/* eslint-disable react/destructuring-assignment */
/* eslint no-unused-expressions: ["error", {"allowTernary": true }] */
/* eslint-disable react/no-access-state-in-setstate */
import React from "react";
import { DndProvider } from "react-dnd";
import { TouchBackend } from "react-dnd-touch-backend";
import PropTypes from "prop-types";
import SortingList from "./SortingList";
import IconClose from "../../Images/icon-close.svg";
import IconNav from "../../Images/icon-nav.svg";
import SortCopy from "../../Images/SortCopy.svg";
import SortDelete from "../../Images/SortDelete.svg";

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            rowList: [true],
            sortingOrderList:
                this.props.sortingParamsObjectList === undefined
                    ? []
                    : this.props.sortingParamsObjectList,
            errorMessage: false
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

    add = () => {
        const rowList = [...this.state.rowList];
        rowList.push(true);
        const existingSortingOrderList = this.state.sortingOrderList;
        existingSortingOrderList.push({
            sortBy: this.props.columnFieldValue[0],
            order: "Ascending",
            sortOn: "Value"
        });
        this.setState({
            rowList,
            sortingOrderList: existingSortingOrderList
        });
    };

    copy = (i) => {
        const rowList = [...this.state.sortingOrderList];
        rowList.push(JSON.parse(JSON.stringify(rowList[i])));
        this.setState({ sortingOrderList: rowList });
    };

    clearAll = () => {
        this.setState({ sortingOrderList: [], errorMessage: false });
        this.props.clearAllSortingParams();
    };

    remove = (i) => {
        const sortingOrderList = [...this.state.sortingOrderList];
        sortingOrderList.splice(i, 1);
        this.setState({ sortingOrderList });
        if (sortingOrderList.length <= 1) {
            this.setState({ errorMessage: false });
        }
    };

    createColumnsArrayFromProps = (rowsValue) => {
        return rowsValue.map((row, index) => {
            return {
                id: index,
                text: (
                    <div className="sort__bodyContent" key={row}>
                        <div className="sort__reorder">
                            <div className="">
                                <div>&nbsp;</div>
                            </div>

                            <div className="sort__icon">
                                <i>
                                    <img
                                        src={IconNav}
                                        alt="Group Sort Drag Icon"
                                    />
                                </i>
                            </div>
                        </div>

                        <div className="sort__reorder">
                            <div className="">
                                <div>Sort by</div>
                            </div>

                            <div className="sort__file">
                                <select
                                    className="custom__ctrl"
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
                                    {this.props.columnFieldValue.map((item) => (
                                        <option key={item}>{item}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="sort__reorder">
                            <div className="">
                                <div>Sort on</div>
                            </div>

                            <div className="sort__file">
                                <select
                                    className="custom__ctrl"
                                    name="sortOn"
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

                        <div className="sort__reorder">
                            <div className="">
                                <div>Order</div>
                            </div>

                            <div className="sort__file">
                                <select
                                    className="custom__ctrl"
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

                        <div className="sort__reorder">
                            <div className="">
                                <div>&nbsp;</div>
                            </div>

                            <div className="sort__icon">
                                <i>
                                    <img src={SortCopy} alt="copy sort" />
                                </i>
                            </div>
                        </div>

                        <div className="sort__reorder">
                            <div className="">
                                <div>&nbsp;</div>
                            </div>

                            <div className="sort__icon">
                                <i>
                                    <img src={SortDelete} alt="copy sort" />
                                </i>
                            </div>
                        </div>
                    </div>
                )
            };
        });
    };

    captureSortingFeildValues = (event, index, sortingKey) => {
        const existingSortingOrderList = this.state.sortingOrderList;

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
        const unique = new Set();
        const showError = this.state.sortingOrderList.some(
            (element) => unique.size === unique.add(element.sortBy).size
        );
        showError
            ? this.setState({
                  errorMessage: true
              })
            : this.setState({
                  errorMessage: false
              });
        if (!showError) {
            this.props.setTableAsPerSortingParams(this.state.sortingOrderList);
        }
    };

    /**
     *
     * @param {*} reOrderedSortingList
     */
    handleReorderListOfSort = (reOrderedIndexList) => {
        this.props.handleTableSortSwap(reOrderedIndexList);
    };

    handleClickOutside(event) {
        if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
            this.props.closeSorting();
        }
    }

    render() {
        return (
            <div className="neo-popover" ref={this.setWrapperRef}>
                <div className="neo-popover__sort">
                    <div className="neo-popover__title">
                        <h2>Sort</h2>
                        <div className="neo-popover__close">
                            <i onClick={() => this.props.closeSorting()}>
                                <img
                                    src={IconClose}
                                    alt="Group Sort Close Icon"
                                />
                            </i>
                        </div>
                    </div>

                    <div className="neo-popover__content">
                        <DndProvider
                            backend={TouchBackend}
                            options={{ enableMouseEvents: true }}
                        >
                            <SortingList
                                handleReorderListOfSort={
                                    this.handleReorderListOfSort
                                }
                                sortsArray={this.createColumnsArrayFromProps(
                                    this.state.sortingOrderList
                                )}
                            />
                        </DndProvider>
                    </div>
                    <div className="sort-warning">
                        {this.state.errorMessage ? (
                            <span className="alert alert-danger">
                                Sort by opted are same, Please choose different
                                one.
                            </span>
                        ) : (
                            ""
                        )}
                    </div>
                    <div className="sort__new">
                        <div
                            role="presentation"
                            className="sort__section"
                            onClick={() => this.add()}
                            onKeyDown={() => this.add()}
                        >
                            <span>+</span>
                            <div className="sort__txt">New Sort</div>
                        </div>
                    </div>
                    <div className="sort__footer">
                        <div className="sort__btns">
                            <button
                                type="button"
                                className="btns"
                                onClick={this.clearAll}
                            >
                                Clear All
                            </button>

                            <button
                                type="button"
                                className="btns btns__save"
                                onClick={() =>
                                    this.updateTableAsPerSortCondition()
                                }
                            >
                                Ok
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

App.propTypes = {
    sortingParamsObjectList: PropTypes.any,
    closeSorting: PropTypes.any,
    columnFieldValue: PropTypes.any,
    clearAllSortingParams: PropTypes.any,
    setTableAsPerSortingParams: PropTypes.any,
    handleTableSortSwap: PropTypes.any
};

export default App;
