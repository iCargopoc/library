// @flow
import React from "react";
import Measure from "react-measure";
import GridRow from "./GridRow";

const PinnedRow = ({
    gridRef,
    pinnedRow,
    index,
    getRowTop,
    getRowInfo,
    setRowHeight,
    isRowExpandEnabled,
    isAtleastOneColumnPinned,
    additionalColumn,
    enablePinColumn,
    isRowActionsColumnNeeded
}: Object): any => {
    const { original } = pinnedRow;
    // Add classname passed by developer from getRowInfo prop to required rows
    let rowClassName = "";
    if (getRowInfo && typeof getRowInfo === "function") {
        const rowInfo = getRowInfo(original, false);
        if (rowInfo && rowInfo.className) {
            rowClassName = rowInfo.className;
        }
    }

    return (
        <Measure
            bounds
            onResize={(contentRect: Object) => {
                setRowHeight(index, contentRect.bounds.height);
            }}
        >
            {({ measureRef }: Object): Object => (
                <div
                    ref={measureRef}
                    {...pinnedRow.getRowProps()}
                    data-testid="pinned-gridrow"
                    className={`neo-grid__tr neo-grid__pinnedtr ${rowClassName}`}
                    style={{
                        top: getRowTop(index)
                    }}
                >
                    <div className="neo-grid__row-container">
                        <GridRow
                            gridRef={gridRef}
                            isRowExpandEnabled={isRowExpandEnabled}
                            row={pinnedRow}
                            isAtleastOneColumnPinned={isAtleastOneColumnPinned}
                            additionalColumn={additionalColumn}
                            enablePinColumn={enablePinColumn}
                            isRowActionsColumnNeeded={isRowActionsColumnNeeded}
                        />
                    </div>
                </div>
            )}
        </Measure>
    );
};
export default PinnedRow;
