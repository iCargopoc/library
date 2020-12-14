import React from "react";
import PropTypes from "prop-types";
import Measure from "react-measure";
import { IconExpand, IconCollapse } from "../Utilities/SvgUtilities";

const ParentItem = ({
    row,
    theme,
    index,
    setSize,
    multiRowSelection,
    parentRowExpandable,
    isParentRowSelected,
    toggleParentRowSelection,
    toggleParentRow,
    isParentRowOpen,
    parentColumn
}) => {
    const { original } = row;
    return (
        <Measure
            bounds
            onResize={(contentRect) => {
                let rowItemHeight = contentRect.bounds.height;
                if (theme === "portal") {
                    rowItemHeight += 10;
                }
                setSize(index, rowItemHeight);
            }}
        >
            {({ measureRef }) => (
                <div ref={measureRef} className="ng-accordion__container">
                    <div className="ng-accordion__session">
                        <div className="ng-accordion__block">
                            {multiRowSelection !== false ? (
                                <div className="neo-form-check">
                                    <input
                                        type="checkbox"
                                        data-testid="rowSelector-parentRow"
                                        className="neo-checkbox form-check-input"
                                        checked={isParentRowSelected(row)}
                                        onChange={(event) =>
                                            toggleParentRowSelection(event, row)
                                        }
                                    />
                                </div>
                            ) : null}
                            {parentRowExpandable !== false ? (
                                <i
                                    role="presentation"
                                    className="ng-accordion__icon"
                                    onClick={() => toggleParentRow(row, index)}
                                    data-testid="acccordion-expand-collapse"
                                >
                                    {isParentRowOpen(row) ? (
                                        <IconCollapse />
                                    ) : (
                                        <IconExpand />
                                    )}
                                </i>
                            ) : null}
                        </div>
                        <div
                            className="ng-accordion__content"
                            data-testid="parentRowContent"
                        >
                            {parentColumn.displayCell(original)}
                        </div>
                    </div>
                </div>
            )}
        </Measure>
    );
};

ParentItem.propTypes = {
    row: PropTypes.object,
    theme: PropTypes.string,
    index: PropTypes.number,
    setSize: PropTypes.func,
    multiRowSelection: PropTypes.bool,
    parentRowExpandable: PropTypes.bool,
    isParentRowSelected: PropTypes.func,
    toggleParentRowSelection: PropTypes.func,
    toggleParentRow: PropTypes.func,
    isParentRowOpen: PropTypes.func,
    parentColumn: PropTypes.object
};

export default ParentItem;
