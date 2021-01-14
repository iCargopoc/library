// @flow
import React from "react";
import Measure from "react-measure";
import { IconExpand, IconCollapse } from "../Utilities/SvgUtilities";

const ParentItem = ({
    row,
    index,
    setSize,
    multiRowSelection,
    parentRowExpandable,
    isParentRowSelected,
    toggleParentRowSelection,
    toggleParentRow,
    isParentRowOpen,
    parentColumn,
    rowSelector
}: {
    row: Object,
    index: Number,
    setSize: Function,
    multiRowSelection: boolean,
    parentRowExpandable: boolean,
    isParentRowSelected: Function,
    toggleParentRowSelection: Function,
    toggleParentRow: Function,
    isParentRowOpen: Function,
    parentColumn: Object,
    rowSelector: boolean
}): React$Element<*> => {
    const { original } = row;
    return (
        <Measure
            bounds
            onResize={(contentRect: Object) => {
                setSize(index, contentRect.bounds.height);
            }}
        >
            {({ measureRef }: Object): Object => (
                <div ref={measureRef} className="ng-accordion__container">
                    <div className="ng-accordion__session">
                        <div className="ng-accordion__block">
                            {multiRowSelection !== false &&
                            rowSelector !== false ? (
                                <div className="neo-form-check">
                                    <input
                                        type="checkbox"
                                        data-testid="rowSelector-parentRow"
                                        className="neo-checkbox form-check-input"
                                        checked={isParentRowSelected(row)}
                                        onChange={(event: String): Object =>
                                            toggleParentRowSelection(event, row)
                                        }
                                    />
                                </div>
                            ) : null}
                            {parentRowExpandable !== false ? (
                                <i
                                    role="presentation"
                                    className="ng-accordion__icon"
                                    onClick={(): void =>
                                        toggleParentRow(row, index)
                                    }
                                    data-testid="acccordion-expand-collapse"
                                >
                                    {isParentRowOpen(row) ? (
                                        <IconCollapse className="ng-icon" />
                                    ) : (
                                        <IconExpand className="ng-icon" />
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
export default ParentItem;
