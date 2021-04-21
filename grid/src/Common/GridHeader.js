// @flow
import React, { useState } from "react";
import GlobalFilter from "../Functions/GlobalFilter";
import ColumnReordering from "../Overlays/managecolumns";
import GroupSort from "../Overlays/groupsort";
import ExportData from "../Overlays/exportdata";
import {
    IconColumns,
    IconFilter,
    IconShare,
    IconGroupSort,
    IconRefresh
} from "../Utilities/SvgUtilities";
import {
    checkIfGroupsortIsApplicable,
    findAllChildRows
} from "../Utilities/GridUtilities";

const GridHeader = ({
    gridHeader,
    multiRowSelection,
    rowSelector,
    isAllRowsSelected,
    toggleAllRowsSelection,
    showTitle,
    totalRecordsCount,
    rows,
    gridDataLength,
    title,
    CustomPanel,
    globalSearch,
    globalFilter,
    setGlobalFilter,
    filterEventRef,
    columnFilter,
    toggleColumnFilter,
    groupSort,
    groupSortOptions,
    managableColumns,
    managableSubComponentColumnns,
    applyGroupSort,
    columnChooser,
    gridColumns,
    additionalColumn,
    expandedRowData,
    isSubComponentGrid,
    subComponentColumns,
    subComponentAdditionalColumn,
    managableSubComponentAdditionalColumn,
    updateColumnStructure,
    enablePinColumn,
    exportData,
    gridRef,
    isParentGrid,
    parentColumn,
    fileName,
    pdfPaperSize,
    isDesktop,
    onGridRefresh
}: Object): any => {
    // Local state value for checking if group Sort Overlay is open/closed.
    const [isGroupSortOverLayOpen, setGroupSortOverLay] = useState(false);

    // Local state value for hiding/unhiding column management overlay
    const [isManageColumnOverlayOpen, setManageColumnOpen] = useState(false);

    // Toggle group Sort state value based on UI clicks
    const toggleGroupSortOverLay = () => {
        // Make sure manage column overlay is closed whenever user opens/hides group sort overlay.
        // This is to avoid conflicts of 2 components being rendered that uses DnD library.
        setManageColumnOpen(false);
        setGroupSortOverLay(!isGroupSortOverLayOpen);
    };

    // Toggle column manage overlay show/hide state value based on UI clicks
    const toggleManageColumnsOverlay = () => {
        // Make sure group sort overlay is closed whenever user opens/hides manage column overlay.
        // This is to avoid conflicts of 2 components being rendered that uses DnD library.
        setGroupSortOverLay(false);
        setManageColumnOpen(!isManageColumnOverlayOpen);
    };

    // Local state value for hiding/unhiding export data overlay
    const [isExportOverlayOpen, setIsExportOverlayOpen] = useState(false);
    // Toggle export overlay show/hide state value based on UI clicks
    const toggleExportDataOverlay = () => {
        setIsExportOverlayOpen(!isExportOverlayOpen);
    };

    // Check if atleast 1 column has group sort option enabled, and display group sort icon only if there is atleast 1.
    const isGroupSortNeeded = checkIfGroupsortIsApplicable(managableColumns);
    return (
        <div
            className={`neo-grid__header ${
                gridHeader === false ? "neo-grid__header--borderless" : ""
            }`}
        >
            {gridHeader === false &&
            multiRowSelection !== false &&
            rowSelector !== false ? (
                <div className="neo-form-check ng-header-results__check">
                    <input
                        type="checkbox"
                        data-testid="rowSelector-allRows-fromHeaderTitle"
                        className="neo-checkbox form-check-input"
                        checked={isAllRowsSelected()}
                        onChange={toggleAllRowsSelection}
                    />
                </div>
            ) : null}
            {showTitle !== false ? (
                <div
                    className="ng-header-results"
                    data-testid="grid-title-container"
                >
                    <span className="ng-header-results__count">
                        {totalRecordsCount > 0 && rows.length === gridDataLength
                            ? totalRecordsCount
                            : findAllChildRows(rows).length}
                    </span>
                    <span className="ng-header-results__title">
                        {title || "Rows"}
                    </span>
                </div>
            ) : null}
            {CustomPanel ? (
                <div className="neo-grid__customPanel">
                    <CustomPanel />
                </div>
            ) : null}
            <div className="ng-header-utils">
                {globalSearch !== false ? (
                    <GlobalFilter
                        globalFilter={globalFilter}
                        setGlobalFilter={setGlobalFilter}
                        filterEventRef={filterEventRef}
                    />
                ) : null}
                {gridHeader !== false && columnFilter !== false ? (
                    <div className="ng-header-utils__items keyword-search-container">
                        <div
                            className="ng-header-utils__icons keyword-search"
                            role="presentation"
                            data-testid="toggleColumnFilter"
                            onClick={toggleColumnFilter}
                        >
                            <i className="ng-icon-block">
                                <IconFilter className="ng-icon ng-icon--filter" />
                            </i>
                        </div>
                    </div>
                ) : null}
                {isGroupSortNeeded !== false && groupSort !== false ? (
                    <div className="ng-header-utils__items group-sort-container">
                        <div
                            className="ng-header-utils__icons group-sort"
                            role="presentation"
                            data-testid="toggleGroupSortOverLay"
                            onClick={toggleGroupSortOverLay}
                        >
                            <i className="ng-icon-block">
                                <IconGroupSort className="ng-icon" />
                            </i>
                        </div>
                        {isGroupSortOverLayOpen ? (
                            <GroupSort
                                toggleGroupSortOverLay={toggleGroupSortOverLay}
                                groupSortOptions={groupSortOptions}
                                gridColumns={managableColumns}
                                gridSubComponentColumns={
                                    managableSubComponentColumnns
                                }
                                applyGroupSort={applyGroupSort}
                            />
                        ) : null}
                    </div>
                ) : null}
                {columnChooser !== false ? (
                    <div className="ng-header-utils__items">
                        <div
                            className="ng-header-utils__icons"
                            role="presentation"
                            data-testid="toggleManageColumnsOverlay"
                            onClick={toggleManageColumnsOverlay}
                        >
                            <i className="ng-icon-block">
                                <IconColumns className="ng-icon" />
                            </i>
                        </div>
                        {isManageColumnOverlayOpen ? (
                            <ColumnReordering
                                toggleManageColumnsOverlay={
                                    toggleManageColumnsOverlay
                                }
                                columns={gridColumns}
                                originalColumns={managableColumns}
                                additionalColumn={additionalColumn}
                                originalAdditionalColumn={expandedRowData}
                                isSubComponentGrid={isSubComponentGrid}
                                subComponentColumns={subComponentColumns}
                                originalSubComponentColumns={
                                    managableSubComponentColumnns
                                }
                                subComponentAdditionalColumn={
                                    subComponentAdditionalColumn
                                }
                                originalSubComponentAdditionalColumn={
                                    managableSubComponentAdditionalColumn
                                }
                                updateColumnStructure={updateColumnStructure}
                                enablePinColumn={enablePinColumn}
                            />
                        ) : null}
                    </div>
                ) : null}
                {exportData !== false ? (
                    <div className="ng-header-utils__items">
                        <div
                            className="ng-header-utils__icons export-data"
                            role="presentation"
                            data-testid="toggleExportDataOverlay"
                            onClick={toggleExportDataOverlay}
                        >
                            <i className="ng-icon-block">
                                <IconShare className="ng-icon" />
                            </i>
                        </div>
                        {isExportOverlayOpen ? (
                            <ExportData
                                gridRef={gridRef}
                                toggleExportDataOverlay={
                                    toggleExportDataOverlay
                                }
                                rows={rows}
                                columns={gridColumns}
                                additionalColumn={additionalColumn}
                                isParentGrid={isParentGrid}
                                parentColumn={parentColumn}
                                isSubComponentGrid={isSubComponentGrid}
                                subComponentColumns={subComponentColumns}
                                subComponentAdditionalColumn={
                                    subComponentAdditionalColumn
                                }
                                fileName={fileName}
                                pdfPaperSize={pdfPaperSize}
                                isDesktop={isDesktop}
                            />
                        ) : null}
                    </div>
                ) : null}
                {typeof onGridRefresh === "function" ? (
                    <div className="ng-header-utils__items">
                        <div
                            className="ng-header-utils__icons"
                            role="presentation"
                            data-testid="refreshGrid"
                            onClick={onGridRefresh}
                        >
                            <i className="ng-icon-block">
                                <IconRefresh className="ng-icon" />
                            </i>
                        </div>
                    </div>
                ) : null}
            </div>
        </div>
    );
};

export default GridHeader;
