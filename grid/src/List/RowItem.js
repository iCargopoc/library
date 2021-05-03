// @flow
import React from "react";
import Measure from "react-measure";
import Loader from "../Common/Loader";
import GridRow from "./GridRow";
import SubComponent from "./SubComponent";

const RowItem = ({
    gridRef,
    row,
    isAtleastOneColumnPinned,
    idAttribute,
    theme,
    index,
    width,
    setSize,
    isRowExpandEnabled,
    additionalColumn,
    isLoadMoreChildRowsRequiredForRow,
    lastPage,
    loadMoreChildData,
    isParentGrid,
    fixedRowHeight,
    isLoadMoreRequiredForNormalRow,
    subComponentColumns,
    subComponentHeader,
    subComponentAdditionalColumn,
    subComponentColumnsAccessorList,
    subComponentAdditionalColumnAccessorList,
    subComponentIdAttribute,
    userSelectedSubCompRowIdentifiers,
    updateSubCompRowIdentifiers,
    isSubComponentGrid,
    rowsWithExpandedSubComponents,
    getRowInfo,
    rowActions,
    expandableColumn,
    rowSelector,
    multiRowSelection,
    isRowActionsColumnNeeded,
    enablePinColumn,
    gridGlobalFilterValue
}: {
    gridRef: any,
    row: Object,
    isAtleastOneColumnPinned: boolean,
    idAttribute: string,
    theme: string,
    index: number,
    width: number,
    setSize: Function,
    isRowExpandEnabled: boolean,
    additionalColumn: Object,
    isLoadMoreChildRowsRequiredForRow: Function,
    lastPage: boolean,
    loadMoreChildData: Function,
    isParentGrid: boolean,
    fixedRowHeight: boolean,
    isLoadMoreRequiredForNormalRow: Function,
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
    getRowInfo: Function,
    rowActions: Function,
    expandableColumn: boolean,
    rowSelector: boolean,
    multiRowSelection: boolean,
    isRowActionsColumnNeeded: boolean,
    enablePinColumn: boolean,
    gridGlobalFilterValue: any
}): React$Element<*> => {
    const { original } = row;
    const { subComponentData } = original;
    const rowIdAttrValue = original[idAttribute];
    const isSubComponentRowsPresent =
        isSubComponentGrid &&
        subComponentData !== null &&
        subComponentData !== undefined &&
        subComponentData.length > 0 &&
        rowsWithExpandedSubComponents.includes(rowIdAttrValue);

    const existingRowIdentifierValue = userSelectedSubCompRowIdentifiers.find(
        (identifier: Object): boolean => {
            const { rowId } = identifier;
            return rowId === rowIdAttrValue;
        }
    );
    const userSelectedCurrentRowSubCompRows =
        existingRowIdentifierValue !== null &&
        existingRowIdentifierValue !== undefined
            ? existingRowIdentifierValue.rowIdentifiers
            : [];
    const userSelectedCurrentRowSubCompRowIds =
        existingRowIdentifierValue !== null &&
        existingRowIdentifierValue !== undefined
            ? existingRowIdentifierValue.rowIds
            : {};

    return (
        <Measure
            bounds
            onResize={(contentRect: Object) => {
                if (
                    fixedRowHeight !== true || // Calcualte if not fixedRowHeight
                    (!isParentGrid && index === 0) || // calculate if fixedRowHeight and index is 0 of normal Grid
                    (isParentGrid && index === 1) // calculate if fixedRowHeight and index is 1 of parent Grid
                ) {
                    let rowItemHeight = contentRect.bounds.height;
                    if (theme === "portal") {
                        rowItemHeight += 10;
                    }
                    setSize(index, rowItemHeight);
                }
            }}
        >
            {({ measureRef }: Object): Object => (
                <div ref={measureRef} className="neo-grid__row-container">
                    <GridRow
                        gridRef={gridRef}
                        isRowExpandEnabled={isRowExpandEnabled}
                        row={row}
                        isAtleastOneColumnPinned={isAtleastOneColumnPinned}
                        additionalColumn={additionalColumn}
                        enablePinColumn={enablePinColumn}
                        isRowActionsColumnNeeded={isRowActionsColumnNeeded}
                    />
                    {isSubComponentRowsPresent ? (
                        <SubComponent
                            gridRef={gridRef}
                            subComponentData={subComponentData}
                            subComponentColumns={subComponentColumns}
                            subComponentAdditionalColumn={
                                subComponentAdditionalColumn
                            }
                            subComponentColumnsAccessorList={
                                subComponentColumnsAccessorList
                            }
                            subComponentAdditionalColumnAccessorList={
                                subComponentAdditionalColumnAccessorList
                            }
                            subComponentIdAttribute={subComponentIdAttribute}
                            rowIdAttrValue={rowIdAttrValue}
                            userSelectedCurrentRowSubCompRows={
                                userSelectedCurrentRowSubCompRows
                            }
                            userSelectedCurrentRowSubCompRowIds={
                                userSelectedCurrentRowSubCompRowIds
                            }
                            updateSubCompRowIdentifiers={
                                updateSubCompRowIdentifiers
                            }
                            subComponentHeader={subComponentHeader}
                            getRowInfo={getRowInfo}
                            rowActions={rowActions}
                            expandableColumn={expandableColumn}
                            rowSelector={rowSelector}
                            multiRowSelection={multiRowSelection}
                            enablePinColumn={enablePinColumn}
                            gridGlobalFilterValue={gridGlobalFilterValue}
                        />
                    ) : null}
                    {isLoadMoreRequiredForNormalRow(index) ? (
                        <div className="neo-grid__row-loader" style={{ width }}>
                            <Loader />
                        </div>
                    ) : null}
                    {isLoadMoreChildRowsRequiredForRow(index, lastPage) ? (
                        <div className="ng-loadmore" style={{ width }}>
                            <button
                                type="button"
                                className="neo-btn neo-btn-default btn btn-secondary"
                                data-testid="load-more-childdata"
                                onClick={(): Object => loadMoreChildData(row)}
                            >
                                Load more....
                            </button>
                        </div>
                    ) : null}
                </div>
            )}
        </Measure>
    );
};
export default RowItem;
