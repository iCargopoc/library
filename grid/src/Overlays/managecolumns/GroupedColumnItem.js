// @flow
import React from "react";

const GroupedColumnItem = ({
    id,
    Header,
    title,
    display,
    isadditionalcolumn,
    innerCells,
    isSubComponentColumn,
    onInnerCellChange
}: {
    id: string,
    Header: any,
    title: string,
    display: boolean,
    isadditionalcolumn: boolean,
    innerCells: Array<Object>,
    isSubComponentColumn: boolean,
    onInnerCellChange: Function
}): React$Element<*> => {
    const isItemToBeDisplayed =
        innerCells && innerCells.length > 0 && display === true;

    return (
        <div className="ng-popover--column__list ng-popover--column__list--group">
            {isItemToBeDisplayed ? (
                <strong className="ng-popover--column__title">
                    {title || Header}
                </strong>
            ) : null}
            {isItemToBeDisplayed
                ? innerCells.map((cell: Object): Object => {
                      const { cellId } = cell;
                      return (
                          <div
                              className="ng-popover--column__wrap"
                              key={cellId}
                          >
                              <div className="ng-popover--column__check">
                                  <div className="neo-form-check">
                                      <input
                                          type="checkbox"
                                          id={`chk_selectInnerCell_${cellId}`}
                                          className="neo-checkbox form-check-input"
                                          data-testid={`selectInnerCell_${id}_${cellId}`}
                                          data-columnid={id}
                                          data-cellid={cellId}
                                          data-isadditionalcolumn={
                                              isadditionalcolumn
                                          }
                                          checked={cell.display}
                                          onChange={(event: String): Object =>
                                              onInnerCellChange(
                                                  event,
                                                  isSubComponentColumn
                                              )
                                          }
                                      />
                                      <label
                                          htmlFor={`chk_selectInnerCell_${cellId}`}
                                          className="neo-form-check__label"
                                      >
                                          {cell.Header}
                                      </label>
                                  </div>
                              </div>
                          </div>
                      );
                  })
                : null}
        </div>
    );
};
export default GroupedColumnItem;
