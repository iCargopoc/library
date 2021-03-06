// @flow
/* eslint-disable prefer-destructuring */
/* eslint-disable no-param-reassign */
import React, { useRef, useCallback, useEffect } from "react";
import { VariableSizeList as List } from "react-window";
import ListItem from "./ListItem";

const RowsList = ({
    gridRef,
    onItemsRendered,
    infiniteLoaderRef,
    listRef,
    height,
    width,
    theme,
    rows,
    estimatedRowHeight,
    isAtleastOneColumnPinned,
    idAttribute,
    overScanCount,
    prepareRow,
    isParentGrid,
    multiRowSelection,
    parentRowExpandable,
    isRowExpandEnabled,
    isParentRowSelected,
    isParentRowCollapsed,
    toggleParentRowSelection,
    toggleParentRow,
    isParentRowOpen,
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
    isLoadMoreChildRowsRequiredForRow,
    loadMoreChildData,
    parentColumn,
    additionalColumn,
    getRowInfo,
    expandedParentRows,
    reRenderListData,
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
    onItemsRendered?: Function,
    infiniteLoaderRef?: any,
    listRef: any,
    height: number,
    width: number,
    theme: string,
    rows: Array<Object>,
    estimatedRowHeight: number,
    isAtleastOneColumnPinned: boolean,
    idAttribute: string,
    overScanCount: number,
    prepareRow: Function,
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
    expandedParentRows: Array<Object>,
    reRenderListData: Function,
    fixedRowHeight: boolean,
    isLoadMoreRequiredForNormalRow: Function,
    subComponentColumns: Array<Object>,
    subComponentAdditionalColumn: Object,
    subComponentColumnsAccessorList: any,
    subComponentAdditionalColumnAccessorList: any,
    isSubComponentGrid: boolean,
    subComponentIdAttribute: string,
    userSelectedSubCompRowIdentifiers: any,
    updateSubCompRowIdentifiers: Function,
    subComponentHeader: boolean,
    rowsWithExpandedSubComponents: Array<Object>,
    rowSelector: boolean,
    rowActions: Function,
    expandableColumn: boolean,
    isRowActionsColumnNeeded: boolean,
    enablePinColumn: boolean,
    gridGlobalFilterValue: any
}): any => {
    const sizeMap = useRef({});

    const setSize = (index: number, size: number) => {
        const currentSize = sizeMap.current[index];
        if (currentSize !== size) {
            sizeMap.current = { ...sizeMap.current, [index]: size };
            reRenderListData(index); // For fixing row height issue while scrolling down fast
        }
    };

    const getSize = (index: number): Object => {
        const currentRow = rows[index];
        const { original } = currentRow;
        const { lastPage, isParent } = original;
        const isParentRow = isParent === true;
        if (isParentRowCollapsed(currentRow)) {
            return 0;
        }
        const { current } = sizeMap;
        const firstRowSize = current[0];
        const secondRowSize = current[1];
        const defaultParentRowSize = 50;
        const defaultRowSize =
            estimatedRowHeight && typeof estimatedRowHeight === "number"
                ? estimatedRowHeight
                : 50;

        if (fixedRowHeight === true && !isParentRow) {
            if (isParentGrid) {
                if (isLoadMoreChildRowsRequiredForRow(index, lastPage)) {
                    return secondRowSize + 52 || defaultRowSize + 52;
                }
                return secondRowSize || defaultRowSize;
            }
            return firstRowSize || defaultRowSize;
        }

        const currentRowSize = current[index];
        let rowSizeToReturn = null;
        if (currentRowSize !== undefined && currentRowSize !== null) {
            rowSizeToReturn = currentRowSize;
        } else if (isParentRow) {
            rowSizeToReturn = firstRowSize || defaultParentRowSize;
        } else {
            rowSizeToReturn = secondRowSize;
        }
        return rowSizeToReturn || defaultRowSize;
    };

    useEffect((): Object => {
        return () => {
            if (infiniteLoaderRef) {
                infiniteLoaderRef(null);
            }
            listRef.current = null;
        };
    }, []);

    return (
        <List
            ref={(list: Object) => {
                if (list !== null && list !== undefined) {
                    if (infiniteLoaderRef) {
                        infiniteLoaderRef(list);
                    }
                    listRef.current = list;
                }
            }}
            style={{
                overflow: false,
                height: "100%"
            }}
            height={height}
            itemCount={rows.length}
            itemSize={getSize}
            onItemsRendered={onItemsRendered}
            overscanCount={overScanCount}
            className="neo-grid__tbody-list"
        >
            {useCallback(
                ({ index, style }: Object): any => {
                    // if (isItemLoaded(index)) - This check never became false during testing. Hence avoiding it to reach 100% code coverage in JEST test.
                    const row = rows[index];
                    prepareRow(row);
                    return (
                        <ListItem
                            gridRef={gridRef}
                            row={row}
                            isAtleastOneColumnPinned={isAtleastOneColumnPinned}
                            idAttribute={idAttribute}
                            style={style}
                            width={width}
                            theme={theme}
                            index={index}
                            setSize={setSize}
                            isParentGrid={isParentGrid}
                            multiRowSelection={multiRowSelection}
                            parentRowExpandable={parentRowExpandable}
                            isRowExpandEnabled={isRowExpandEnabled}
                            isParentRowSelected={isParentRowSelected}
                            isParentRowCollapsed={isParentRowCollapsed}
                            toggleParentRowSelection={toggleParentRowSelection}
                            toggleParentRow={toggleParentRow}
                            isParentRowOpen={isParentRowOpen}
                            isLoadMoreChildRowsRequiredForRow={
                                isLoadMoreChildRowsRequiredForRow
                            }
                            loadMoreChildData={loadMoreChildData}
                            parentColumn={parentColumn}
                            additionalColumn={additionalColumn}
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
                            userSelectedSubCompRowIdentifiers={
                                userSelectedSubCompRowIdentifiers
                            }
                            updateSubCompRowIdentifiers={
                                updateSubCompRowIdentifiers
                            }
                            isSubComponentGrid={isSubComponentGrid}
                            subComponentHeader={subComponentHeader}
                            rowsWithExpandedSubComponents={
                                rowsWithExpandedSubComponents
                            }
                            getRowInfo={getRowInfo}
                            fixedRowHeight={fixedRowHeight}
                            isLoadMoreRequiredForNormalRow={
                                isLoadMoreRequiredForNormalRow
                            }
                            rowSelector={rowSelector}
                            rowActions={rowActions}
                            expandableColumn={expandableColumn}
                            isRowActionsColumnNeeded={isRowActionsColumnNeeded}
                            enablePinColumn={enablePinColumn}
                            gridGlobalFilterValue={gridGlobalFilterValue}
                        />
                    );
                },
                [rows, additionalColumn, expandedParentRows]
            )}
        </List>
    );
};
export default RowsList;
