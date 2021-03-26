// @flow
import React from "react";
import ParentItem from "./ParentItem";
import RowItem from "./RowItem";

const ListItem = ({
    gridRef,
    row,
    idAttribute,
    style,
    theme,
    index,
    setSize,
    isParentGrid,
    multiRowSelection,
    parentRowExpandable,
    isRowExpandEnabled,
    isParentRowSelected,
    isParentRowCollapsed,
    toggleParentRowSelection,
    toggleParentRow,
    isParentRowOpen,
    isLoadMoreChildRowsRequiredForRow,
    loadMoreChildData,
    parentColumn,
    additionalColumn,
    subComponentColumnns,
    subComponentAdditionalColumn,
    isSubComponentGrid,
    rowsWithExpandedSubComponents,
    getRowInfo,
    fixedRowHeight,
    isLoadMoreRequiredForNormalRow,
    rowSelector,
    rowActions,
    expandableColumn
}: {
    gridRef: any,
    row: Object,
    idAttribute: string,
    style: Object,
    theme: string,
    index: number,
    setSize: Function,
    isParentGrid: boolean,
    multiRowSelection: boolean,
    parentRowExpandable: boolean,
    isRowExpandEnabled: boolean,
    isParentRowSelected: Function,
    isParentRowCollapsed: Function,
    toggleParentRowSelection: Function,
    toggleParentRow: Function,
    isParentRowOpen: Function,
    isLoadMoreChildRowsRequiredForRow: Function,
    loadMoreChildData: Function,
    parentColumn: Object,
    additionalColumn: Object,
    getRowInfo: Function,
    subComponentColumnns: Array<Object>,
    subComponentAdditionalColumn: Object,
    isSubComponentGrid: boolean,
    rowsWithExpandedSubComponents: Array<Object>,
    fixedRowHeight: boolean,
    isLoadMoreRequiredForNormalRow: Function,
    rowSelector: boolean,
    rowActions: Function,
    expandableColumn: boolean
}): any => {
    if (isParentRowCollapsed(row)) {
        return null;
    }

    const { original } = row;
    const { isParent, lastPage } = original;
    if (isParent === true && isParentGrid) {
        return (
            <div className="ng-accordion" style={style}>
                <ParentItem
                    row={row}
                    index={index}
                    setSize={setSize}
                    multiRowSelection={multiRowSelection}
                    parentRowExpandable={parentRowExpandable}
                    isParentRowSelected={isParentRowSelected}
                    toggleParentRowSelection={toggleParentRowSelection}
                    toggleParentRow={toggleParentRow}
                    isParentRowOpen={isParentRowOpen}
                    parentColumn={parentColumn}
                    rowSelector={rowSelector}
                />
            </div>
        );
    }

    // Add classname passed by developer from getRowInfo prop to required rows
    let rowClassName = "";
    if (getRowInfo && typeof getRowInfo === "function") {
        const rowInfo = getRowInfo(original, false);
        if (rowInfo && rowInfo.className) {
            rowClassName = rowInfo.className;
        }
    }

    return (
        <div
            {...row.getRowProps({ style })}
            data-testid="gridrow"
            className={`neo-grid__tr ${
                isParentGrid ? "neo-grid__child" : ""
            } ${rowClassName}`}
        >
            <RowItem
                gridRef={gridRef}
                row={row}
                idAttribute={idAttribute}
                theme={theme}
                index={index}
                setSize={setSize}
                isRowExpandEnabled={isRowExpandEnabled}
                additionalColumn={additionalColumn}
                isLoadMoreChildRowsRequiredForRow={
                    isLoadMoreChildRowsRequiredForRow
                }
                subComponentColumnns={subComponentColumnns}
                subComponentAdditionalColumn={subComponentAdditionalColumn}
                isSubComponentGrid={isSubComponentGrid}
                rowsWithExpandedSubComponents={rowsWithExpandedSubComponents}
                lastPage={lastPage}
                loadMoreChildData={loadMoreChildData}
                isParentGrid={isParentGrid}
                fixedRowHeight={fixedRowHeight}
                isLoadMoreRequiredForNormalRow={isLoadMoreRequiredForNormalRow}
                getRowInfo={getRowInfo}
                rowActions={rowActions}
                expandableColumn={expandableColumn}
                rowSelector={rowSelector}
                multiRowSelection={multiRowSelection}
            />
        </div>
    );
};
export default ListItem;
