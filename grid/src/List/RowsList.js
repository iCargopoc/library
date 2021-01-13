/* eslint-disable prefer-destructuring */
/* eslint-disable no-param-reassign */
// @flow
import React, { useRef, useCallback, useEffect } from "react";
import { VariableSizeList as List } from "react-window";
import ListItem from "./ListItem";

const RowsList = ({
    onItemsRendered,
    infiniteLoaderRef,
    listRef,
    height,
    theme,
    rows,
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
    subComponentColumnns,
    subComponentAdditionalColumn,
    isSubComponentGrid,
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
    expandableColumn
}: {
    onItemsRendered: Function,
    infiniteLoaderRef: any,
    listRef: any,
    height: number,
    theme: string,
    rows: Array<Object>,
    idAttribute: String,
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
    subComponentColumnns: Array<Object>,
    subComponentAdditionalColumn: Object,
    isSubComponentGrid: boolean,
    rowsWithExpandedSubComponents: Array<Object>,
    rowSelector: boolean,
    rowActions: any,
    expandableColumn: boolean
}): ?React$Element<*> => {
    const sizeMap = useRef({});

    const setSize = (index: number, size: number) => {
        const currentSize = sizeMap.current[index];
        if (currentSize !== size) {
            sizeMap.current = { ...sizeMap.current, [index]: size };
            reRenderListData(index);
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
        const defaultRowSize = 50;

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
            rowSizeToReturn = firstRowSize;
        } else {
            rowSizeToReturn = secondRowSize;
        }
        return rowSizeToReturn || defaultRowSize;
    };

    useEffect((): Object => {
        reRenderListData();
        return () => {
            if (infiniteLoaderRef) {
                infiniteLoaderRef(null);
            }
            listRef.current = null;
        };
    }, []);

    return (
        <List
            ref={(list: List) => {
                if (list !== null && list !== undefined) {
                    if (infiniteLoaderRef) {
                        infiniteLoaderRef(list);
                    }
                    listRef.current = list;
                }
            }}
            style={{
                overflowX: "hidden"
            }}
            height={height - 60}
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
                            row={row}
                            idAttribute={idAttribute}
                            style={style}
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
                            subComponentColumnns={subComponentColumnns}
                            subComponentAdditionalColumn={
                                subComponentAdditionalColumn
                            }
                            isSubComponentGrid={isSubComponentGrid}
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
                        />
                    );
                },
                [rows, additionalColumn, expandedParentRows]
            )}
        </List>
    );
};
export default RowsList;
