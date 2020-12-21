import React, { useMemo } from "react";
import { useTable, useFlexLayout } from "react-table";
import PropTypes from "prop-types";

const SubComponent = (props) => {
    const { subComponentData, subComponentColumnns } = props;

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
            data
        },
        useFlexLayout
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
    subComponentColumnns: PropTypes.arrayOf(PropTypes.object)
};
