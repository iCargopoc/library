// @flow
import React, { useState } from "react";
import RowItem from "./RowItem";
import { getRowClassname, getGridElement } from "../Utilities/GridUtilities";

const PinnedRowsList = ({
    gridRef,
    pinnedRows,
    prepareRow,
    getRowInfo,
    isRowExpandEnabled,
    isAtleastOneColumnPinned,
    additionalColumn,
    enablePinColumn,
    isRowActionsColumnNeeded,
    idAttribute,
    theme,
    width,
    isLoadMoreChildRowsRequiredForRow,
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
    loadMoreChildData,
    isParentGrid,
    fixedRowHeight,
    isLoadMoreRequiredForNormalRow,
    rowActions,
    expandableColumn,
    rowSelector,
    multiRowSelection,
    gridGlobalFilterValue
}: Object): any => {
    const [rowsHeightMap, setRowsHeightMap] = useState({});

    const setRowHeight = (index: number, size: number) => {
        const currentSize = rowsHeightMap[index];
        if (currentSize !== size) {
            setRowsHeightMap({ ...rowsHeightMap, [index]: size });
        }
    };

    const getRowTop = (index: number): Object => {
        const gridElement = getGridElement(gridRef);
        const gridColHeaderElement = gridElement.querySelector(
            "[data-testid='gridColumnHeader']"
        );
        const gridColHeaderElementHeight = gridColHeaderElement
            ? gridColHeaderElement.offsetHeight
            : 0;
        let rowTopValue = gridColHeaderElementHeight;
        if (index > 0) {
            for (let i = 0; i < index; i++) {
                rowTopValue += (rowsHeightMap[i] || 0) + 1; // 1 is to compensate the 1 px border size
            }
        }
        return rowTopValue;
    };

    const pinnedRowsLastIndex = pinnedRows.length - 1;

    return (
        <>
            {pinnedRows.map((pinnedRow: Object, index: number): any => {
                prepareRow(pinnedRow);
                const { original } = pinnedRow;
                const { lastPage } = original;

                return (
                    <div
                        {...pinnedRow.getRowProps()}
                        data-testid="pinned-gridrow"
                        className={`neo-grid__tr neo-grid__pinnedtr ${
                            index === pinnedRowsLastIndex
                                ? "neo-grid__pinnedtr--lasttr"
                                : ""
                        } ${getRowClassname(getRowInfo, original, false)}`} // Add classname passed by developer from getRowInfo prop to required rows
                        style={{
                            top: getRowTop(index)
                        }}
                    >
                        <RowItem
                            gridRef={gridRef}
                            row={pinnedRow}
                            isAtleastOneColumnPinned={isAtleastOneColumnPinned}
                            idAttribute={idAttribute}
                            theme={theme}
                            index={index}
                            width={width}
                            setSize={setRowHeight}
                            isRowExpandEnabled={isRowExpandEnabled}
                            additionalColumn={additionalColumn}
                            isLoadMoreChildRowsRequiredForRow={
                                isLoadMoreChildRowsRequiredForRow
                            }
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
                            lastPage={lastPage}
                            loadMoreChildData={loadMoreChildData}
                            isParentGrid={isParentGrid}
                            fixedRowHeight={fixedRowHeight}
                            isLoadMoreRequiredForNormalRow={
                                isLoadMoreRequiredForNormalRow
                            }
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
            })}
        </>
    );
};
export default PinnedRowsList;
