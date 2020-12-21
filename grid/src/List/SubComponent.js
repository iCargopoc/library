import React, { useMemo } from "react";
import { useTable, useFlexLayout, useExpanded } from "react-table";
import PropTypes from "prop-types";
import { IconAngle } from "../Utilities/SvgUtilities";

const SubComponent = (props) => {
    const {
        subComponentData,
        subComponentColumnns,
        subComponentAdditionalColumn
    } = props;

    const columns = useMemo(() => subComponentColumnns);
    const data = useMemo(() => [...subComponentData]);

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow
    } = useTable(
        {
            columns,
            data,
            autoResetExpanded: false
        },
        useFlexLayout,
        useExpanded,
        (hooks) => {
            hooks.allColumns.push((hookColumns) => [
                ...hookColumns,
                {
                    id: "custom",
                    columnId: "column_custom_1",
                    disableResizing: true,
                    disableFilters: true,
                    disableSortBy: true,
                    display: true,
                    isGroupHeader: false,
                    minWidth: 35,
                    width: 35,
                    maxWidth: 35,
                    Cell: (cellCustomProps) => {
                        const { row } = cellCustomProps;
                        return (
                            <div className="ng-action">
                                <span
                                    className="ng-action__expander"
                                    data-testid="rowExpanderIcon"
                                    {...row.getToggleRowExpandedProps()}
                                >
                                    <i>
                                        <IconAngle
                                            className={
                                                row.isExpanded
                                                    ? "ng-icon ng-action__arrow-up"
                                                    : "ng-icon ng-action__arrow-down"
                                            }
                                        />
                                    </i>
                                </span>
                            </div>
                        );
                    }
                }
            ]);
        }
    );
    return (
        <div {...getTableProps()} className="neo-grid__content">
            <div className="neo-grid__thead">
                {headerGroups.map((headerGroup) => {
                    return (
                        <div
                            {...headerGroup.getHeaderGroupProps()}
                            className="neo-grid__tr"
                        >
                            {headerGroup.headers.map((column) => {
                                // If header is group header only render header value and not sort/filter/resize
                                return (
                                    <div
                                        {...column.getHeaderProps()}
                                        className="neo-grid__th"
                                    >
                                        <div
                                            className="neo-grid__th-title"
                                            data-testid="column-header-sort"
                                        >
                                            {column.render("Header")}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    );
                })}
            </div>
            {rows && rows.length > 0 ? (
                <div {...getTableBodyProps()} className="neo-grid__tbody">
                    {rows.map((row) => {
                        prepareRow(row);
                        return (
                            <div className="neo-grid__row-container">
                                <div
                                    data-testid="gridrowWrap"
                                    className="neo-grid__row-wrap"
                                >
                                    {row.cells.map((cell) => {
                                        if (cell.column.display === true) {
                                            return (
                                                <div
                                                    {...cell.getCellProps()}
                                                    className="neo-grid__td"
                                                    data-testid="gridrowcell"
                                                >
                                                    {cell.render("Cell")}
                                                </div>
                                            );
                                        }
                                        return null;
                                    })}
                                </div>

                                {row.isExpanded ? (
                                    <div
                                        className="neo-grid__row-expand"
                                        data-testid="rowExpandedRegion"
                                    >
                                        {subComponentAdditionalColumn.Cell(
                                            row,
                                            subComponentAdditionalColumn
                                        )}
                                    </div>
                                ) : null}
                            </div>
                        );
                    })}
                </div>
            ) : (
                <h2 data-testid="nodataerror" className="ng-error">
                    No Records Found
                </h2>
            )}
        </div>
    );
};

export default SubComponent;

SubComponent.propTypes = {
    subComponentData: PropTypes.arrayOf(PropTypes.object),
    subComponentColumnns: PropTypes.arrayOf(PropTypes.object),
    subComponentAdditionalColumn: PropTypes.object
};
