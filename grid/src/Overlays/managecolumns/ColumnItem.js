// @flow
import React from "react";
import { useDrag, useDrop } from "react-dnd";
import { ItemTypes } from "./ItemTypes";
import { IconDragHorizontal } from "../../Utilities/SvgUtilities";
import GroupedColumnItem from "./GroupedColumnItem";

const ColumnItem = ({
    id,
    columnHeader,
    columnTitle,
    pinLeft,
    moveColumn,
    findColumn,
    isadditionalcolumn,
    isGroupHeader,
    columns,
    innerCells,
    isSubComponentColumn,
    onPinColumnChange,
    onInnerCellChange,
    enablePinColumn
}: {
    id: string,
    columnHeader: any,
    columnTitle: string,
    pinLeft: boolean,
    moveColumn: Function,
    findColumn: Function,
    isadditionalcolumn: boolean,
    isGroupHeader: boolean,
    columns: Array<Object>,
    innerCells: Array<Object>,
    isSubComponentColumn: boolean,
    onPinColumnChange: Function,
    onInnerCellChange: Function,
    enablePinColumn: boolean
}): React$Element<*> => {
    const originalIndex = findColumn(id).index;

    const [{ isDragging }, drag] = useDrag({
        item: { type: ItemTypes.COLUMN, id, originalIndex },
        collect: (monitor: Object): Object => ({
            isDragging: monitor.isDragging()
        }),
        end: (dropResult: Object, monitor: Object) => {
            const monitorGetItemValue = monitor.getItem();
            const { id: droppedId } = monitorGetItemValue;
            const newOriginalIndex = monitorGetItemValue.originalIndex;
            const didDrop = monitor.didDrop();
            if (!didDrop) {
                moveColumn(droppedId, newOriginalIndex);
            }
        }
    });

    const [, drop] = useDrop({
        accept: ItemTypes.COLUMN,
        canDrop: (): boolean => false,
        hover({ id: draggedId }: Object) {
            if (draggedId !== id) {
                const { index: overIndex } = findColumn(id);
                moveColumn(draggedId, overIndex);
            }
        }
    });

    const opacity = isDragging ? 0.1 : 1;

    return (
        <div style={{ opacity }}>
            <div
                className="ng-popover--column__reorder"
                data-testid="column-box"
            >
                <div
                    className="ng-popover--column__drag"
                    data-testid={
                        isSubComponentColumn
                            ? "subcomponentcolumnItemDnd"
                            : "columnItemDnd"
                    }
                    ref={(node: Object): Object => drag(drop(node))}
                >
                    <i>
                        <IconDragHorizontal className="ng-icon" />
                    </i>
                </div>
                <span>{columnTitle || columnHeader}</span>
                {enablePinColumn ? (
                    <div className="ng-popover--column__pin">
                        <div className="neo-form-check">
                            <input
                                type="checkbox"
                                id={`chk_pinColumn_${id}`}
                                className="neo-checkbox"
                                data-testid={`pinColumn_${id}`}
                                checked={pinLeft}
                                onChange={(event: Object): Object =>
                                    onPinColumnChange(
                                        event,
                                        isSubComponentColumn,
                                        id
                                    )
                                }
                            />
                            <label
                                htmlFor={`chk_pinColumn_${id}`}
                                className="neo-form-check__label"
                            >
                                Pin Left
                            </label>
                        </div>
                    </div>
                ) : null}
                {isGroupHeader === true && columns && columns.length > 0 ? (
                    columns.map((col: Object): Object => {
                        const {
                            columnId,
                            Header,
                            title,
                            display,
                            isDisplayInExpandedRegion
                        } = col;
                        return (
                            <GroupedColumnItem
                                key={columnId}
                                id={columnId}
                                Header={Header}
                                title={title}
                                display={display}
                                isadditionalcolumn={isDisplayInExpandedRegion}
                                innerCells={col.innerCells}
                                isSubComponentColumn={isSubComponentColumn}
                                onInnerCellChange={onInnerCellChange}
                            />
                        );
                    })
                ) : (
                    <div className="ng-popover--column__list">
                        {innerCells && innerCells.length > 0
                            ? innerCells.map((cell: Object): Object => {
                                  const { cellId, Header, display } = cell;
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
                                                      className="neo-checkbox"
                                                      data-testid={`selectInnerCell_${id}_${cellId}`}
                                                      checked={display}
                                                      onChange={(
                                                          event: Object
                                                      ): Object =>
                                                          onInnerCellChange(
                                                              event,
                                                              isSubComponentColumn,
                                                              id,
                                                              cellId,
                                                              isadditionalcolumn
                                                          )
                                                      }
                                                  />
                                                  <label
                                                      htmlFor={`chk_selectInnerCell_${cellId}`}
                                                      className="neo-form-check__label"
                                                  >
                                                      {Header}
                                                  </label>
                                              </div>
                                          </div>
                                      </div>
                                  );
                              })
                            : null}
                    </div>
                )}
            </div>
        </div>
    );
};
export default ColumnItem;
