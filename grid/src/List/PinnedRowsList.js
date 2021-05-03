// @flow
import React, { useRef } from "react";
import PinnedRow from "./PinnedRow";

const PinnedRowsList = ({
    gridRef,
    pinnedRows,
    prepareRow,
    getRowInfo,
    isRowExpandEnabled,
    isAtleastOneColumnPinned,
    additionalColumn,
    enablePinColumn,
    isRowActionsColumnNeeded
}: Object): any => {
    const rowsHeightMap = useRef({});

    const setRowHeight = (index: number, size: number) => {
        const currentSize = rowsHeightMap.current[index];
        if (currentSize !== size) {
            rowsHeightMap.current = { ...rowsHeightMap.current, [index]: size };
        }
    };

    const getRowTop = (index: number): Object => {
        const gridElement =
            gridRef && gridRef.current ? gridRef.current : document;
        const gridColHeaderElement = gridElement.querySelector(
            "[data-testid='gridColumnHeader']"
        );
        const gridColHeaderElementHeight = gridColHeaderElement
            ? gridColHeaderElement.offsetHeight
            : 0;
        let rowTopValue = gridColHeaderElementHeight;
        const { current } = rowsHeightMap;
        if (index > 0 && current !== null && current !== undefined) {
            for (let i = 0; i < index; i++) {
                rowTopValue += current[i] || 0;
            }
        }
        return rowTopValue;
    };

    return (
        <>
            {pinnedRows.map((pinnedRow: Object, index: number): any => {
                prepareRow(pinnedRow);
                const { id } = pinnedRow;
                return (
                    <PinnedRow
                        key={id}
                        gridRef={gridRef}
                        pinnedRow={pinnedRow}
                        index={index}
                        getRowTop={getRowTop}
                        getRowInfo={getRowInfo}
                        setRowHeight={setRowHeight}
                        isRowExpandEnabled={isRowExpandEnabled}
                        isAtleastOneColumnPinned={isAtleastOneColumnPinned}
                        additionalColumn={additionalColumn}
                        enablePinColumn={enablePinColumn}
                        isRowActionsColumnNeeded={isRowActionsColumnNeeded}
                    />
                );
            })}
        </>
    );
};
export default PinnedRowsList;
