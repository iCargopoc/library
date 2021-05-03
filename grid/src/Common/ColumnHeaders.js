// @flow
import React from "react";
import { IconSort, IconPinColumn } from "../Utilities/SvgUtilities";
import {
    checkdisplayOfGroupedColumns,
    getLeftOfColumn,
    isLastPinnedColumn
} from "../Utilities/GridUtilities";

const ColumnHeaders = ({
    headerGroups,
    gridRef,
    columnFilter,
    isFilterOpen
}: {
    headerGroups: any,
    gridRef: any,
    columnFilter: boolean,
    isFilterOpen: boolean
}): any => {
    return (
        <div className="neo-grid__thead" data-testid="gridColumnHeader">
            {headerGroups.map((headerGroup: Object, index: number): Object => {
                // If there are morthan 1 headerGroups, we consider 1st one as group header row
                const isGroupHeader =
                    headerGroups.length > 1 ? index === 0 : false;
                return (
                    <div
                        {...headerGroup.getHeaderGroupProps()}
                        className="neo-grid__tr"
                        data-testid={
                            isGroupHeader
                                ? "grid-groupHeadersList"
                                : "grid-headersList"
                        }
                    >
                        {headerGroup.headers.map(
                            (column: Object, headerIndex: number): Object => {
                                const {
                                    display,
                                    isSorted,
                                    isSortedDesc,
                                    filter,
                                    canResize,
                                    pinLeft,
                                    pinRight,
                                    isAutoPinned,
                                    headers
                                } = column;
                                let isColumnPinnedLeft = pinLeft === true;
                                let isColumnPinnedRight =
                                    !isColumnPinnedLeft && pinRight === true;
                                if (
                                    isGroupHeader &&
                                    headers &&
                                    headers.length > 0
                                ) {
                                    isColumnPinnedLeft =
                                        headers[0].pinLeft === true;
                                    isColumnPinnedRight =
                                        !isColumnPinnedLeft &&
                                        headers[0].pinRight === true;
                                }
                                if (
                                    display === true ||
                                    checkdisplayOfGroupedColumns(column)
                                ) {
                                    // If header is group header only render header value and not sort/filter/resize
                                    return (
                                        <div
                                            {...column.getHeaderProps(
                                                isColumnPinnedLeft
                                                    ? {
                                                          style: {
                                                              left: getLeftOfColumn(
                                                                  gridRef,
                                                                  headerIndex,
                                                                  false,
                                                                  isGroupHeader
                                                              )
                                                          }
                                                      }
                                                    : {}
                                            )}
                                            className={`neo-grid__th ${
                                                isGroupHeader === true
                                                    ? "neo-grid__th-group"
                                                    : ""
                                            } ${
                                                isColumnPinnedLeft
                                                    ? "ng-sticky ng-sticky--left"
                                                    : ""
                                            }  ${
                                                isColumnPinnedLeft &&
                                                isLastPinnedColumn(
                                                    gridRef,
                                                    headerIndex,
                                                    false,
                                                    isGroupHeader
                                                )
                                                    ? "ng-sticky--left__last"
                                                    : ""
                                            } ${
                                                isColumnPinnedRight
                                                    ? "ng-sticky ng-sticky--right"
                                                    : ""
                                            }`}
                                            data-testid={
                                                isGroupHeader === true
                                                    ? "grid-group-header"
                                                    : "grid-header"
                                            }
                                        >
                                            <div
                                                className="neo-grid__th-title"
                                                data-testid="column-header-sort"
                                                {...column.getSortByToggleProps()}
                                            >
                                                {column.render("Header")}
                                                {isGroupHeader === false ? (
                                                    <div className="neo-grid__th-iconblock">
                                                        {isSorted ? (
                                                            <i className="neo-grid__th-icon">
                                                                <IconSort
                                                                    className={`ng-icon neo-grid__sort-desc ${
                                                                        isSortedDesc
                                                                            ? "is-active"
                                                                            : ""
                                                                    }`}
                                                                />
                                                                <IconSort
                                                                    className={`ng-icon neo-grid__sort-asc ${
                                                                        isSortedDesc
                                                                            ? ""
                                                                            : "is-active"
                                                                    }`}
                                                                />
                                                            </i>
                                                        ) : null}
                                                        {!isAutoPinned &&
                                                        (isColumnPinnedLeft ||
                                                            isColumnPinnedRight) ? (
                                                            <i className="neo-grid__th-icon">
                                                                <IconPinColumn className="ng-icon neo-grid__pin" />
                                                            </i>
                                                        ) : null}
                                                    </div>
                                                ) : null}
                                            </div>
                                            {/* Don't render filter if header is group header or if column filter is disabled */}
                                            {/* If atleast 1 column filter is present, below div wrap has to be present, to maintain the alignment of header text in header cell */}
                                            {isGroupHeader === false &&
                                            columnFilter !== false ? (
                                                <div
                                                    className={`ng-txt-wrap ${
                                                        isFilterOpen
                                                            ? "ng-txt-wrap__open"
                                                            : ""
                                                    }`}
                                                >
                                                    {/* column.canFilter - should be used to identify if column is filterable */}
                                                    {/* But bug of react-table will set canFilter to true (even if it is false) after doing a global search */}
                                                    {/* Hence checking if filter logic is present as a function for a column */}
                                                    {typeof filter ===
                                                    "function"
                                                        ? column.render(
                                                              "Filter"
                                                          )
                                                        : null}
                                                </div>
                                            ) : null}
                                            {isGroupHeader === false &&
                                                canResize && (
                                                    <div
                                                        className="neo-grid__th-resizer"
                                                        {...column.getResizerProps()}
                                                    />
                                                )}
                                        </div>
                                    );
                                }
                                return null;
                            }
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default ColumnHeaders;
