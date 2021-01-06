import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import update from "immutability-helper";
import { convertToIndividualColumns } from "../../Utilities/GridUtilities";

const ColumnSearch = ({
    columns,
    additionalColumn,
    managedColumns,
    managedAdditionalColumn,
    isSubComponentGrid,
    subComponentColumnns,
    subComponentAdditionalColumn,
    managedSubComponentColumns,
    managedSubComponentAdditionalColumn,
    updateColumns
}) => {
    const gridColumns = convertToIndividualColumns(columns);
    const gridSubComponentColumns = convertToIndividualColumns(
        subComponentColumnns
    );

    // Returns a single array that contains main columns as well as the expanded columns
    const getAllColumns = (columnsList, additionalColumnItem) => {
        let allCoulmns = [];
        if (columnsList && columnsList.length > 0) {
            allCoulmns = [...columnsList];
        }
        if (
            additionalColumnItem &&
            Object.keys(additionalColumnItem).length > 0 &&
            additionalColumnItem.innerCells &&
            additionalColumnItem.innerCells.length > 0
        ) {
            allCoulmns.push(additionalColumnItem);
        }
        return allCoulmns;
    };

    const [searchableColumns, setSearchableColumns] = useState([]);
    const [
        searchableSubComponentColumns,
        setSearchableSubComponentColumns
    ] = useState([]);

    // Update searched columns state based on the searched value
    const onColumnSearch = (event) => {
        let { value } = event.target;
        value = value ? value.toLowerCase() : "";
        const allColumns = getAllColumns(gridColumns, additionalColumn);
        const allSubComponentColumns = getAllColumns(
            gridSubComponentColumns,
            subComponentAdditionalColumn
        );
        if (value !== "") {
            setSearchableColumns(
                allColumns.filter((column) => {
                    if (column.title) {
                        return column.title.toLowerCase().includes(value);
                    }
                    return column.Header.toLowerCase().includes(value);
                })
            );
            if (isSubComponentGrid) {
                setSearchableSubComponentColumns(
                    allSubComponentColumns.filter((column) => {
                        if (column.title) {
                            return column.title.toLowerCase().includes(value);
                        }
                        return column.Header.toLowerCase().includes(value);
                    })
                );
            }
        } else {
            setSearchableColumns(allColumns);
            if (isSubComponentGrid) {
                setSearchableSubComponentColumns(allSubComponentColumns);
            }
        }
    };

    // Check if the display value of column or all columns in managedColumns state is true/false
    const isSearchableColumnSelected = (columnId) => {
        const allManagedColumns = getAllColumns(
            convertToIndividualColumns(managedColumns),
            managedAdditionalColumn
        );
        const filteredAllManagedColumns = allManagedColumns.filter((column) => {
            return column.display === true;
        });
        if (columnId === "all") {
            const allColumns = getAllColumns(gridColumns, additionalColumn);
            return filteredAllManagedColumns.length === allColumns.length;
        }
        const selectedColumn = filteredAllManagedColumns.find((column) => {
            return column.columnId === columnId;
        });
        return selectedColumn !== null && selectedColumn !== undefined;
    };

    // Check if the display value of sub component column or all columns in managedSubComponentColumns state is true/false
    const isSearchableSubComponentColumnSelected = (columnId) => {
        const allManagedColumns = getAllColumns(
            convertToIndividualColumns(managedSubComponentColumns),
            managedSubComponentAdditionalColumn
        );
        const filteredAllManagedColumns = allManagedColumns.filter((column) => {
            return column.display === true;
        });
        if (columnId === "all") {
            const allColumns = getAllColumns(
                gridSubComponentColumns,
                subComponentAdditionalColumn
            );
            return filteredAllManagedColumns.length === allColumns.length;
        }
        const selectedColumn = filteredAllManagedColumns.find((column) => {
            return column.columnId === columnId;
        });
        return selectedColumn !== null && selectedColumn !== undefined;
    };

    // update the display flag value of column or all columns in managedColumns state, based on the selection
    const onSearchableColumnChange = (event) => {
        const { checked, dataset } = event.currentTarget;
        const { columnid, isadditionalcolumn } = dataset;
        updateColumns(columnid, isadditionalcolumn, checked, false);
    };

    // update the display flag value of sub component column or all columns in managedSubComponentColumns state, based on the selection
    const onSearchableSubComponentColumnChange = (event) => {
        const { checked, dataset } = event.currentTarget;
        const { columnid, isadditionalcolumn } = dataset;
        updateColumns(columnid, isadditionalcolumn, checked, true);
    };

    useEffect(() => {
        setSearchableColumns(
            update(searchableColumns, {
                $set: getAllColumns(gridColumns, additionalColumn)
            })
        );
        if (isSubComponentGrid) {
            setSearchableSubComponentColumns(
                update(searchableSubComponentColumns, {
                    $set: getAllColumns(
                        gridSubComponentColumns,
                        subComponentAdditionalColumn
                    )
                })
            );
        }
    }, []);

    const isSearchableColumnsAvailable =
        searchableColumns && searchableColumns.length > 0;

    const isSearchableSubComponentColumnsAvailable =
        isSubComponentGrid &&
        searchableSubComponentColumns &&
        searchableSubComponentColumns.length > 0;

    return (
        <div className="ng-chooser-body">
            <input
                type="text"
                placeholder="Search column"
                className="ng-chooser-body__txt"
                data-testid="filterColumnsList"
                onChange={onColumnSearch}
            />
            {isSearchableColumnsAvailable ? (
                <div className="ng-chooser-body__selectall">
                    <span className="ng-chooser-body__head">Parent Column</span>
                    <div className="neo-form-check">
                        <input
                            type="checkbox"
                            id="chk_selectAllSearchableColumns"
                            className="neo-checkbox form-check-input"
                            data-testid="selectAllSearchableColumns"
                            data-columnid="all"
                            checked={isSearchableColumnSelected("all")}
                            onChange={onSearchableColumnChange}
                        />
                        <label
                            htmlFor="chk_selectAllSearchableColumns"
                            className="neo-form-check__label"
                        >
                            Select All
                        </label>
                    </div>
                </div>
            ) : null}
            {isSearchableColumnsAvailable
                ? searchableColumns.map((column) => {
                      const {
                          columnId,
                          Header,
                          title,
                          isDisplayInExpandedRegion
                      } = column;
                      return (
                          <div className="ng-chooser-body__wrap" key={columnId}>
                              <div className="ng-chooser-body__checkwrap">
                                  <div className="neo-form-check">
                                      <input
                                          type="checkbox"
                                          id={`chk_selectSearchableColumn_${columnId}`}
                                          className="neo-checkbox form-check-input"
                                          data-testid="selectSingleSearchableColumn"
                                          data-columnid={columnId}
                                          data-isadditionalcolumn={
                                              isDisplayInExpandedRegion
                                          }
                                          checked={isSearchableColumnSelected(
                                              columnId
                                          )}
                                          onChange={onSearchableColumnChange}
                                      />
                                      <label
                                          htmlFor={`chk_selectSearchableColumn_${columnId}`}
                                          className="neo-form-check__label"
                                      >
                                          {title || Header}
                                      </label>
                                  </div>
                              </div>
                          </div>
                      );
                  })
                : null}

            {isSearchableSubComponentColumnsAvailable ? (
                <div className="ng-chooser-body__selectall">
                    <span className="ng-chooser-body__head">Child Column</span>
                    <div className="neo-form-check">
                        <input
                            type="checkbox"
                            id="chk_selectAllSearchableSubComponentColumns"
                            className="neo-checkbox form-check-input"
                            data-testid="selectAllSearchableSubComponentColumns"
                            data-columnid="all"
                            checked={isSearchableSubComponentColumnSelected(
                                "all"
                            )}
                            onChange={onSearchableSubComponentColumnChange}
                        />
                        <label
                            htmlFor="chk_selectAllSearchableSubComponentColumns"
                            className="neo-form-check__label"
                        >
                            Select All
                        </label>
                    </div>
                </div>
            ) : null}
            {isSearchableSubComponentColumnsAvailable
                ? searchableSubComponentColumns.map((column) => {
                      const {
                          columnId,
                          Header,
                          title,
                          isDisplayInExpandedRegion
                      } = column;
                      return (
                          <div className="ng-chooser-body__wrap" key={columnId}>
                              <div className="ng-chooser-body__checkwrap">
                                  <div className="neo-form-check">
                                      <input
                                          type="checkbox"
                                          id={`chk_selectSearchableSubComponentColumn_${columnId}`}
                                          className="neo-checkbox form-check-input"
                                          data-testid="selectSingleSearchableSubComponentColumn"
                                          data-columnid={columnId}
                                          data-isadditionalcolumn={
                                              isDisplayInExpandedRegion
                                          }
                                          checked={isSearchableSubComponentColumnSelected(
                                              columnId
                                          )}
                                          onChange={
                                              onSearchableSubComponentColumnChange
                                          }
                                      />
                                      <label
                                          htmlFor={`chk_selectSearchableSubComponentColumn_${columnId}`}
                                          className="neo-form-check__label"
                                      >
                                          {title || Header}
                                      </label>
                                  </div>
                              </div>
                          </div>
                      );
                  })
                : null}
        </div>
    );
};

ColumnSearch.propTypes = {
    columns: PropTypes.arrayOf(PropTypes.object),
    additionalColumn: PropTypes.object,
    managedColumns: PropTypes.arrayOf(PropTypes.object),
    managedAdditionalColumn: PropTypes.object,
    isSubComponentGrid: PropTypes.bool,
    subComponentColumnns: PropTypes.arrayOf(PropTypes.object),
    subComponentAdditionalColumn: PropTypes.object,
    managedSubComponentColumns: PropTypes.arrayOf(PropTypes.object),
    managedSubComponentAdditionalColumn: PropTypes.object,
    updateColumns: PropTypes.func
};

export default ColumnSearch;
