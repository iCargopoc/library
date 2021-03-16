// @flow
import React, { useState, useEffect } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";
import MultiBackend, { TouchTransition } from "react-dnd-multi-backend";
import ClickAwayListener from "react-click-away-listener";
import SortingList from "./SortingList";
import { convertToIndividualColumns } from "../../Utilities/GridUtilities";
import { IconCancel } from "../../Utilities/SvgUtilities";

const GroupSort = (props: {
    toggleGroupSortOverLay: Function,
    groupSortOptions: Array<Object>,
    gridColumns: Array<Object>,
    gridSubComponentColumns: Array<Object>,
    applyGroupSort: Function
}): any => {
    const {
        toggleGroupSortOverLay,
        applyGroupSort,
        groupSortOptions,
        gridColumns,
        gridSubComponentColumns
    } = props;

    const parentColumns = convertToIndividualColumns(gridColumns);
    const subComponentColumns = convertToIndividualColumns(
        gridSubComponentColumns
    );
    const columns = [...parentColumns, ...subComponentColumns];

    if (parentColumns && parentColumns.length > 0) {
        const sortingOrders = ["Ascending", "Descending"];
        let defaultSortingOption = [];
        const defaultSortBy = parentColumns.find(
            (col: Object): boolean =>
                col.isSortable &&
                col.accessor !== null &&
                col.accessor !== undefined
        );
        if (defaultSortBy) {
            let defaultSortOn = "value";
            if (
                defaultSortBy.innerCells &&
                defaultSortBy.innerCells.length > 0
            ) {
                const sortableInnerCell = defaultSortBy.innerCells.find(
                    (cell: Object): boolean => cell.isSortable
                );
                if (sortableInnerCell && sortableInnerCell.accessor) {
                    defaultSortOn = sortableInnerCell.accessor;
                }
            }
            defaultSortingOption = [
                {
                    sortBy: defaultSortBy.accessor,
                    sortOn: defaultSortOn,
                    order: sortingOrders[0],
                    isSubComponentColumn: defaultSortBy.isSubComponentColumn
                }
            ];
        }

        const [sortOptions, setSortOptions] = useState([]);
        const [isErrorDisplayed, setIsErrorDisplayed] = useState(false);

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

        const updateSortingOptions = (sortingOptions: Object): Object => {
            setSortOptions(sortingOptions);
        };

        const addSortingOptions = () => {
            setSortOptions([...sortOptions, ...defaultSortingOption]);
        };

        const clearSortingOptions = () => {
            setIsErrorDisplayed(false);
            setSortOptions([]);
            applyGroupSort([]);
        };

        const updateSingleSortingOption = (
            sortIndex: number,
            sortByValue: string,
            sortOnValue: string,
            sortOrder: string,
            isSubComponentColumn: boolean
        ) => {
            const newOptionsList = sortOptions.slice(0);
            const newSortingOption = {
                sortBy: sortByValue,
                sortOn: sortOnValue,
                order: sortOrder,
                isSubComponentColumn
            };
            const updatedSortOptions = newOptionsList.map(
                (option: Object, index: number): Object =>
                    index === sortIndex ? newSortingOption : option
            );
            updateSortingOptions(updatedSortOptions);
        };

        const copySortOption = (sortIndex: number) => {
            const newOption = sortOptions.slice(0)[sortIndex];
            setSortOptions(sortOptions.concat(newOption));
        };

        const deleteSortOption = (sortIndex: number) => {
            setSortOptions(
                sortOptions.filter((option: Object, index: number): boolean => {
                    return index !== sortIndex;
                })
            );
        };

        const applySort = () => {
            let isError = false;
            sortOptions.map((option: Object, index: number): Object => {
                const { sortBy, sortOn, isSubComponentColumn } = option;
                const optionIndex = index;
                const duplicateSort = sortOptions.find(
                    (opt: Object, optIndex: number): boolean => {
                        return (
                            sortBy === opt.sortBy &&
                            sortOn === opt.sortOn &&
                            isSubComponentColumn === opt.isSubComponentColumn &&
                            optionIndex !== optIndex
                        );
                    }
                );
                if (duplicateSort) {
                    isError = true;
                }
                return null; // Added due to lint error expected to return a value in arrow function
            });
            if (!isError) {
                applyGroupSort(sortOptions);
                toggleGroupSortOverLay();
            }
            setIsErrorDisplayed(isError);
        };

        useEffect(() => {
            setSortOptions([...groupSortOptions]);
        }, []);

        return (
            <ClickAwayListener
                onClickAway={toggleGroupSortOverLay}
                className="ng-popover ng-popover--sort"
                data-testid="groupsortoverlay"
            >
                <div className="ng-popover__header">
                    <span>Group Sort</span>
                    <div className="ng-popover__close">
                        <i aria-hidden="true" onClick={toggleGroupSortOverLay}>
                            <IconCancel className="ng-icon" />
                        </i>
                    </div>
                </div>
                <div className="ng-popover__content">
                    <DndProvider backend={MultiBackend} options={HTML5toTouch}>
                        <SortingList
                            sortOptions={sortOptions}
                            sortingOrders={sortingOrders}
                            columns={columns}
                            updateSortingOptions={updateSortingOptions}
                            updateSingleSortingOption={
                                updateSingleSortingOption
                            }
                            copySortOption={copySortOption}
                            deleteSortOption={deleteSortOption}
                        />
                    </DndProvider>
                </div>
                <div className="ng-popover--sort__warning">
                    {isErrorDisplayed ? (
                        <span data-testid="duplicate-sort-error">
                            Duplicate sort options found.
                        </span>
                    ) : null}
                </div>
                <div className="ng-popover--sort__new">
                    <div
                        className="ng-popover--sort__section"
                        role="presentation"
                        data-testid="addSort"
                        onClick={addSortingOptions}
                    >
                        <span className="ng-popover--sort__icon-plus">+</span>
                        <div className="ng-popover__txt">New Sort</div>
                    </div>
                </div>
                <div className="ng-popover__footer">
                    <button
                        type="button"
                        data-testid="clearSort"
                        className="neo-btn neo-btn-link btn btn-secondary"
                        onClick={clearSortingOptions}
                    >
                        Clear All
                    </button>
                    <button
                        type="button"
                        data-testid="saveSort"
                        className="neo-btn neo-btn-primary btn btn-secondary"
                        onClick={applySort}
                    >
                        Ok
                    </button>
                </div>
            </ClickAwayListener>
        );
    }
    return null;
};
export default GroupSort;
