// @flow
import React from "react";
import Measure from "react-measure";
import { IconExpand, IconCollapse } from "../Utilities/SvgUtilities";

const ParentItem = ({
    row,
    index,
    width,
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
    index: number,
    width: number,
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
    const isParentRowOpened = isParentRowOpen(row);

    return (
        <Measure
            bounds
            onResize={(contentRect: Object) => {
                setSize(index, contentRect.bounds.height);
            }}
        >
            {({ measureRef }: Object): Object => (
                <div ref={measureRef} className="ng-accordion__container">
                    <div
                        className="ng-accordion__session"
                        data-testid="parentrowWrap"
                        style={{ width }}
                    >
                        <div className="ng-accordion__block">
                            {multiRowSelection !== false &&
                            rowSelector !== false ? (
                                <div className="neo-form-check">
                                    <input
                                        type="checkbox"
                                        data-testid="rowSelector-parentRow"
                                        className="neo-checkbox"
                                        checked={isParentRowSelected(row)}
                                        onChange={(event: Object): Object =>
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
                                    {isParentRowOpened ? (
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
                            {parentColumn.displayCell(
                                original,
                                isParentRowOpened
                            )}
                        </div>
                    </div>
                </div>
            )}
        </Measure>
    );
};
export default ParentItem;
