/* eslint-disable no-param-reassign */
import React from "react";
import { VariableSizeList as List } from "react-window";
import PropTypes from "prop-types";

const RowsList = ({
    onItemsRendered,
    infiniteLoaderRef,
    listRef,
    height,
    isParentRowExpanded,
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
                if (currentRow) {
                    if (!isParentRowExpanded(currentRow)) {
                        return 0;
                    }
                    return (
                        calculateRowHeight(
                            rows[index],
                            headerGroups && headerGroups.length
                                ? headerGroups[headerGroups.length - 1].headers
                                : []
                        ) + (theme === "portal" ? 10 : 0)
                    );
                }
                return 0;
            }}
            onItemsRendered={onItemsRendered}
            overscanCount={overScanCount}
            className="tableContainer__List"
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
    isParentRowExpanded: PropTypes.func,
    calculateRowHeight: PropTypes.func,
    rows: PropTypes.arrayOf(PropTypes.object),
    headerGroups: PropTypes.arrayOf(PropTypes.object),
    theme: PropTypes.string,
    overScanCount: PropTypes.number,
    RenderRow: PropTypes.func
};

export default RowsList;
