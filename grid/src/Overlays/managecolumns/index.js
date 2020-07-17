import React, { memo, useState, useEffect } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";
import MultiBackend, { TouchTransition } from "react-dnd-multi-backend";
import ColumnsList from "./columnsList";

const ColumnReordering = memo((props) => {
    const { isManageColumnOpen, toggleManageColumns, originalColumns } = props;

    const [managedColumns, setManagedColumns] = useState(originalColumns);
    const [searchedColumns, setSearchedColumns] = useState(originalColumns);

    const HTML5toTouch = {
        backends: [
            {
                backend: HTML5Backend
            },
            {
                backend: TouchBackend,
                options: { enableMouseEvents: true },
                preview: true,
                transition: TouchTransition
            }
        ]
    };

    const filterColumnsList = (event) => {
        let { value } = event ? event.target : "";
        value = value.toLowerCase();
        if (value != "") {
            setSearchedColumns(
                originalColumns.filter((column) => {
                    return column.Header.toLowerCase().includes(value);
                })
            );
        } else {
            setSearchedColumns(originalColumns);
        }
    };

    const updateColumnsInState = (columns) => {
        setManagedColumns(columns);
    };

    const isCheckboxSelected = (header) => {
        if (header === "Select All") {
            return managedColumns.length === searchedColumns.length;
        } else {
            const selectedColumn = managedColumns.filter((column) => {
                return column.Header === header;
            });
            return selectedColumn && selectedColumn.length > 0;
        }
    };

    const selectAllColumns = (event) => {
        if (event.currentTarget.checked) {
            setManagedColumns(searchedColumns);
        } else {
            setManagedColumns([]);
        }
    };

    const selectSingleColumn = (event) => {
        const { currentTarget } = event;
        const { checked, value } = currentTarget;

        //If column checkbox is checked
        if (checked) {
            //Find the index of selected column from original column array and also find the user selected column
            let indexOfColumnToAdd = originalColumns.findIndex((column) => {
                return column.Header == value;
            });
            const itemToAdd = originalColumns[indexOfColumnToAdd];

            //Loop through the managedColumns array to find the position of the column that is present previous to the user selected column
            //Find index of that previous column and push the new column to add in that position
            let prevItemIndex = -1;
            while (indexOfColumnToAdd > 0 && prevItemIndex === -1) {
                prevItemIndex = managedColumns.findIndex((column) => {
                    return column.Header == originalColumns[indexOfColumnToAdd - 1].Header;
                });
                indexOfColumnToAdd = indexOfColumnToAdd - 1;
            }

            const newColumnsList = managedColumns.slice(0); //Copying state value
            newColumnsList.splice(prevItemIndex + 1, 0, itemToAdd);
            setManagedColumns(newColumnsList);
        } else {
            setManagedColumns(
                managedColumns.filter((column) => {
                    return column.Header !== value;
                })
            );
        }
    };

    const doColumnUpdate = () => {
        setSearchedColumns(originalColumns);
        props.updateColumnStructure(managedColumns);
    };

    const resetColumnUpdate = () => {
        setManagedColumns(originalColumns);
        setSearchedColumns(originalColumns);
        props.updateColumnStructure(originalColumns);
    };

    if (isManageColumnOpen) {
        return (
            <div className="columns--grid">
                <div className="column__grid">
                    <div className="column__chooser">
                        <div className="column__header">
                            <div className="">
                                <strong>Column Chooser</strong>
                            </div>
                        </div>
                        <div className="column__body">
                            <div>
                                <input
                                    type="text"
                                    placeholder="Search column"
                                    className="custom__ctrl"
                                    onChange={filterColumnsList}
                                ></input>
                            </div>
                            <div className="column__selectAll">
                                <div className="column__checkbox">
                                    <input
                                        type="checkbox"
                                        value="Select All"
                                        checked={isCheckboxSelected("Select All")}
                                        onChange={selectAllColumns}
                                    ></input>
                                </div>
                                <div className="column__selectTxt">Select All</div>
                            </div>
                            {searchedColumns.map((column, index) => {
                                return (
                                    <div className="column__wrap" key={index}>
                                        <div className="column__checkbox">
                                            <input
                                                type="checkbox"
                                                value={column.Header}
                                                checked={isCheckboxSelected(column.Header)}
                                                onChange={selectSingleColumn}
                                            ></input>
                                        </div>
                                        <div className="column__txt">{column.Header}</div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    <div className="column__settings">
                        <div className="column__header">
                            <div className="column__headerTxt">
                                <strong>Column Setting</strong>
                            </div>
                            <div className="column__close" onClick={toggleManageColumns}>
                                <i className="fa fa-times" aria-hidden="true"></i>
                            </div>
                        </div>
                        <div className="column__body">
                            <DndProvider backend={MultiBackend} options={HTML5toTouch}>
                                <ColumnsList columnsToManage={managedColumns} updateColumnsInState={updateColumnsInState} />
                            </DndProvider>
                        </div>
                        <div className="column__footer">
                            <div className="column__btns">
                                <button className="btns" onClick={resetColumnUpdate}>
                                    Reset
                                </button>
                                <button className="btns" onClick={toggleManageColumns}>
                                    Cancel
                                </button>
                                <button className="btns btns__save" onClick={doColumnUpdate}>
                                    Save
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    } else {
        return <div></div>;
    }
});

export default ColumnReordering;
