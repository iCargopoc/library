import React from "react";
import PropTypes from "prop-types";
import { IconExpand, IconCollapse } from "../Utilities/SvgUtilities";

const ParentItem = ({
    row,
    index,
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
        <>
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
            <div className="ng-accordion__content">
                {parentColumn.displayCell(original)}
            </div>
        </>
    );
};

ParentItem.propTypes = {
    row: PropTypes.object,
    index: PropTypes.number,
    multiRowSelection: PropTypes.bool,
    parentRowExpandable: PropTypes.bool,
    isParentRowSelected: PropTypes.func,
    toggleParentRowSelection: PropTypes.func,
    toggleParentRow: PropTypes.func,
    isParentRowOpen: PropTypes.func,
    parentColumn: PropTypes.object
};

export default ParentItem;
