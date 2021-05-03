// @flow
import React from "react";
import ParentItem from "./ParentItem";
import RowItem from "./RowItem";
import { getRowClassname } from "../Utilities/GridUtilities";

const ListItem = ({
    gridRef,
    row,
    isAtleastOneColumnPinned,
    idAttribute,
    style,
    width,
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
    subComponentColumns,
    subComponentAdditionalColumn,
    subComponentColumnsAccessorList,
    subComponentAdditionalColumnAccessorList,
    subComponentIdAttribute,
    userSelectedSubCompRowIdentifiers,
    updateSubCompRowIdentifiers,
    isSubComponentGrid,
    subComponentHeader,
    rowsWithExpandedSubComponents,
    getRowInfo,
    fixedRowHeight,
    isLoadMoreRequiredForNormalRow,
    rowSelector,
    rowActions,
    expandableColumn,
    isRowActionsColumnNeeded,
    enablePinColumn,
    gridGlobalFilterValue
}: {
    gridRef: any,
    row: Object,
    isAtleastOneColumnPinned: boolean,
    idAttribute: string,
    style: Object,
    width: number,
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
    subComponentColumns: Array<Object>,
    subComponentAdditionalColumn: Object,
    subComponentColumnsAccessorList: any,
    subComponentAdditionalColumnAccessorList: any,
    subComponentIdAttribute: string,
    userSelectedSubCompRowIdentifiers: any,
    updateSubCompRowIdentifiers: Function,
    isSubComponentGrid: boolean,
    subComponentHeader: boolean,
    rowsWithExpandedSubComponents: Array<Object>,
    fixedRowHeight: boolean,
    isLoadMoreRequiredForNormalRow: Function,
    rowSelector: boolean,
    rowActions: Function,
    expandableColumn: boolean,
    isRowActionsColumnNeeded: boolean,
    enablePinColumn: boolean,
    gridGlobalFilterValue: any
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
                    width={width}
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

    return (
        <div
            {...row.getRowProps({ style })}
            data-testid="gridrow"
            className={`neo-grid__tr ${
                isParentGrid ? "neo-grid__child" : ""
            } ${getRowClassname(getRowInfo, original, false)}`} // Add classname passed by developer from getRowInfo prop to required rows
        >
            <RowItem
                gridRef={gridRef}
                row={row}
                isAtleastOneColumnPinned={isAtleastOneColumnPinned}
                idAttribute={idAttribute}
                theme={theme}
                index={index}
                width={width}
                setSize={setSize}
                isRowExpandEnabled={isRowExpandEnabled}
                additionalColumn={additionalColumn}
                isLoadMoreChildRowsRequiredForRow={
                    isLoadMoreChildRowsRequiredForRow
                }
                subComponentColumns={subComponentColumns}
                subComponentAdditionalColumn={subComponentAdditionalColumn}
                subComponentColumnsAccessorList={
                    subComponentColumnsAccessorList
                }
                subComponentAdditionalColumnAccessorList={
                    subComponentAdditionalColumnAccessorList
                }
                subComponentIdAttribute={subComponentIdAttribute}
                userSelectedSubCompRowIdentifiers={
                    userSelectedSubCompRowIdentifiers
                }
                updateSubCompRowIdentifiers={updateSubCompRowIdentifiers}
                isSubComponentGrid={isSubComponentGrid}
                subComponentHeader={subComponentHeader}
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
                isRowActionsColumnNeeded={isRowActionsColumnNeeded}
                enablePinColumn={enablePinColumn}
                gridGlobalFilterValue={gridGlobalFilterValue}
            />
        </div>
    );
};
export default ListItem;
