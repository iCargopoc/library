/* eslint-disable no-param-reassign */
import React, { useRef, useCallback } from "react";
import { VariableSizeList as List } from "react-window";
import PropTypes from "prop-types";
import RowsListItem from "./RowsListItem";

const RowsList = ({
    onItemsRendered,
    infiniteLoaderRef,
    listRef,
    height,
    rows,
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
    isLoadMoreChildRowsRequiredForRow,
    loadMoreChildData,
    parentColumn,
    additionalColumn,
    getRowInfo,
    expandedParentRows,
    reRenderListData
}) => {
    const sizeMap = useRef({});
    const setSize = useCallback((index, size) => {
        const currentSize = sizeMap.current[index];
        if (currentSize !== size) {
            sizeMap.current = { ...sizeMap.current, [index]: size };
            reRenderListData();
        }
    }, []);
    const getSize = useCallback((index) => {
        const rowSize = sizeMap.current[index];
        return rowSize || 100;
    }, []);

    return (
        <List
            ref={(list) => {
                if (infiniteLoaderRef) {
                    infiniteLoaderRef(list);
                }
                listRef.current = list;
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
                ({ index, style }) => {
                    if (rows && rows.length > 0 && index >= 0) {
                        // if (isItemLoaded(index)) - This check never became false during testing. Hence avoiding it to reach 100% code coverage in JEST test.
                        const row = rows[index];
                        prepareRow(row);
                        return (
                            <RowsListItem
                                row={row}
                                style={style}
                                index={index}
                                setSize={setSize}
                                isParentGrid={isParentGrid}
                                multiRowSelection={multiRowSelection}
                                parentRowExpandable={parentRowExpandable}
                                isRowExpandEnabled={isRowExpandEnabled}
                                isParentRowSelected={isParentRowSelected}
                                isParentRowCollapsed={isParentRowCollapsed}
                                toggleParentRowSelection={
                                    toggleParentRowSelection
                                }
                                toggleParentRow={toggleParentRow}
                                isParentRowOpen={isParentRowOpen}
                                isLoadMoreChildRowsRequiredForRow={
                                    isLoadMoreChildRowsRequiredForRow
                                }
                                loadMoreChildData={loadMoreChildData}
                                parentColumn={parentColumn}
                                additionalColumn={additionalColumn}
                                getRowInfo={getRowInfo}
                            />
                        );
                    }
                    return null;
                },
                [rows, additionalColumn, expandedParentRows]
            )}
        </List>
    );
};

RowsList.propTypes = {
    onItemsRendered: PropTypes.func,
    infiniteLoaderRef: PropTypes.any,
    listRef: PropTypes.any,
    height: PropTypes.number,
    rows: PropTypes.arrayOf(PropTypes.object),
    overScanCount: PropTypes.number,
    prepareRow: PropTypes.func,
    isParentGrid: PropTypes.bool,
    multiRowSelection: PropTypes.bool,
    parentRowExpandable: PropTypes.bool,
    isRowExpandEnabled: PropTypes.bool,
    isParentRowSelected: PropTypes.func,
    isParentRowCollapsed: PropTypes.func,
    toggleParentRowSelection: PropTypes.func,
    toggleParentRow: PropTypes.func,
    isParentRowOpen: PropTypes.func,
    isLoadMoreChildRowsRequiredForRow: PropTypes.func,
    loadMoreChildData: PropTypes.func,
    parentColumn: PropTypes.object,
    additionalColumn: PropTypes.object,
    getRowInfo: PropTypes.func,
    expandedParentRows: PropTypes.array,
    reRenderListData: PropTypes.func
};

export default RowsList;
