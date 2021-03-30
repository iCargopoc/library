// @flow
import React, { useState, useEffect } from "react";
import update from "immutability-helper";
import { convertToIndividualColumns } from "../../Utilities/GridUtilities";

const ColumnsSearch = ({
    columns,
    additionalColumn,
    managedColumns,
    managedAdditionalColumn,
    isSubComponentGrid,
    subComponentColumns,
    subComponentAdditionalColumn,
    managedSubComponentColumns,
    managedSubComponentAdditionalColumn,
    updateColumns
}: {
    columns: [],
    additionalColumn: any,
    managedColumns: any,
    managedAdditionalColumn: any,
    isSubComponentGrid: boolean,
    subComponentColumns: [],
    subComponentAdditionalColumn: any,
    managedSubComponentColumns: any,
    managedSubComponentAdditionalColumn: any,
    updateColumns: Function
}): any => {
    const gridColumns = convertToIndividualColumns(columns);
    const gridSubComponentColumns = convertToIndividualColumns(
        subComponentColumns
    );

    // Returns a single array that contains main columns as well as the expanded columns
    const getAllColumns = (
        columnsList: [],
        additionalColumnItem: Object
    ): any => {
        let allCoulmns = [];
        if (columnsList && columnsList.length > 0) {
            allCoulmns = [...columnsList];
        }
        if (
            additionalColumnItem !== null &&
            additionalColumnItem !== undefined
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
    const onColumnSearch = (event: Object) => {
        let { value } = event.target;
        value = value ? value.toLowerCase() : "";
        const allColumns = getAllColumns(gridColumns, additionalColumn);
        const allSubComponentColumns = getAllColumns(
            gridSubComponentColumns,
            subComponentAdditionalColumn
        );
        if (value !== "") {
            setSearchableColumns(
                allColumns.filter((column: Object): boolean => {
                    if (column.title) {
                        return column.title.toLowerCase().includes(value);
                    }
                    return column.Header.toLowerCase().includes(value);
                })
            );
            if (isSubComponentGrid) {
                setSearchableSubComponentColumns(
                    allSubComponentColumns.filter((column: Object): boolean => {
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
    const isSearchableColumnSelected = (columnId: string): boolean => {
        const allManagedColumns = getAllColumns(
            convertToIndividualColumns(managedColumns),
            managedAdditionalColumn
        );
        const filteredAllManagedColumns = allManagedColumns.filter(
            (column: Object): boolean => {
                return column.display === true;
            }
        );
        if (columnId === "all") {
            const allColumns = getAllColumns(gridColumns, additionalColumn);
            return filteredAllManagedColumns.length === allColumns.length;
        }
        const selectedColumn = filteredAllManagedColumns.find(
            (column: Object): boolean => {
                return column.columnId === columnId;
            }
        );
        return selectedColumn !== null && selectedColumn !== undefined;
    };

    // Check if the display value of sub component column or all columns in managedSubComponentColumns state is true/false
    const isSearchableSubComponentColumnSelected = (
        columnId: string
    ): boolean => {
        const allManagedColumns = getAllColumns(
            convertToIndividualColumns(managedSubComponentColumns),
            managedSubComponentAdditionalColumn
        );
        const filteredAllManagedColumns = allManagedColumns.filter(
            (column: Object): boolean => {
                return column.display === true;
            }
        );
        if (columnId === "all") {
            const allColumns = getAllColumns(
                gridSubComponentColumns,
                subComponentAdditionalColumn
            );
            return filteredAllManagedColumns.length === allColumns.length;
        }
        const selectedColumn = filteredAllManagedColumns.find(
            (column: Object): boolean => {
                return column.columnId === columnId;
            }
        );
        return selectedColumn !== null && selectedColumn !== undefined;
    };

    // update the display flag value of column or all columns in managedColumns state, based on the selection
    const onSearchableColumnChange = (event: Object) => {
        const { checked, dataset } = event.currentTarget;
        const { columnid, isadditionalcolumn } = dataset;
        updateColumns(columnid, isadditionalcolumn, checked, false);
    };

    // update the display flag value of sub component column or all columns in managedSubComponentColumns state, based on the selection
    const onSearchableSubComponentColumnChange = (event: Object) => {
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
                ? searchableColumns.map((column: Object): Object => {
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
                ? searchableSubComponentColumns.map(
                      (column: Object): Object => {
                          const {
                              columnId,
                              Header,
                              title,
                              isDisplayInExpandedRegion
                          } = column;
                          return (
                              <div
                                  className="ng-chooser-body__wrap"
                                  key={columnId}
                              >
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
                      }
                  )
                : null}
        </div>
    );
};

export default ColumnsSearch;
