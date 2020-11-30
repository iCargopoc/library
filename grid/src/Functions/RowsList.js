/* eslint-disable no-param-reassign */
import React from "react";
import { VariableSizeList as List } from "react-window";
import PropTypes from "prop-types";

const RowsList = ({
    onItemsRendered,
    infiniteLoaderRef,
    listRef,
    height,
    isParentRowCollapsed,
    calculateRowHeight,
    rows,
    headerGroups,
    theme,
    overScanCount,
    RenderRow
}) => {
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
            itemSize={(index) => {
                const currentRow = rows[index];
                // If this is a child row in tree grid and its parent is in collapsed state, this row height should be 0.
                if (isParentRowCollapsed(currentRow)) {
                    return 0;
                }
                return (
                    calculateRowHeight(
                        currentRow,
                        headerGroups && headerGroups.length
                            ? headerGroups[headerGroups.length - 1].headers
                            : []
                    ) + (theme === "portal" ? 10 : 0)
                );
            }}
            onItemsRendered={onItemsRendered}
            overscanCount={overScanCount}
            className="neo-grid__tbody-list"
        >
            {RenderRow}
        </List>
    );
};

RowsList.propTypes = {
    onItemsRendered: PropTypes.func,
    infiniteLoaderRef: PropTypes.any,
    listRef: PropTypes.any,
    height: PropTypes.number,
    isParentRowCollapsed: PropTypes.func,
    calculateRowHeight: PropTypes.func,
    rows: PropTypes.arrayOf(PropTypes.object),
    headerGroups: PropTypes.arrayOf(PropTypes.object),
    theme: PropTypes.string,
    overScanCount: PropTypes.number,
    RenderRow: PropTypes.func
};

export default RowsList;
