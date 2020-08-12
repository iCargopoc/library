import React from "react";
import ReactDOM from "react-dom";
import { render, fireEvent } from "@testing-library/react";
import ColumnsList from "../../../../src/overlays/column_chooser/columnsList";
import ColumnItem from "../../../../src/overlays/column_chooser/columnItem";
import { DndProvider } from "react-dnd";
import { TouchBackend } from "react-dnd-touch-backend";

let container;

beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
});

afterEach(() => {
    document.body.removeChild(container);
    container = null;
});

describe("<ColumnsList />", () => {
    const columns = [
        {
            id: 1,
            key: "flightno",
            text: "FlightNo"
        },
        {
            id: 2,
            key: "date",
            text: "Date"
        },
        {
            id: 3,
            key: "segmentfrom",
            text: "Segment From"
        }
    ];
    const props = {
        columnsArray: [...columns]
    };
    const handleReorderList = jest.fn((p) => {});

    it("mount and render", () => {
        ReactDOM.render(
            <DndProvider
                backend={TouchBackend}
                options={{ enableMouseEvents: true }}
            >
                <ColumnsList
                    props={props}
                    columnsArray={columns}
                    handleReorderList={handleReorderList}
                />
            </DndProvider>,
            container
        );
        const { getAllByTestId } = render(
            <DndProvider
                backend={TouchBackend}
                options={{ enableMouseEvents: true }}
            >
                <ColumnsList
                    columnsArray={columns}
                    handleReorderList={handleReorderList}
                />
            </DndProvider>
        );
        expect(getAllByTestId("columnItem")).toHaveLength(2);
        const item = getAllByTestId("columnItem")[0];
        fireEvent.drag(item);
    });
});

// it('mount', () => {
//     const wrapper = mount(<ColumnsList  props={props}/>)
//     expect(wrapper).not.toBeNull();
// });

// it('mount', () => {
//     const handleReorderList = (p) => { };

//     const wrapper = mount(<DndProvider
//         backend={TouchBackend}
//         options={{ enableMouseEvents: true }}>
//         <ColumnsList props={props}
//             columnsArray={columns}
//             handleReorderList={handleReorderList}
//         />
//     </DndProvider>)
//     expect(wrapper.find('ColumnItem')).not.toBeNull();
// });

// it('ColumnsList item length', () => {
//     let valuesUpdated = []
//     const handleReorderList = (values) => valuesUpdated = [...values];
//     const wrapper = mount(<DndProvider
//         backend={TouchBackend}
//         options={{ enableMouseEvents: true }}>
//         <ColumnsList props={props}
//             columnsArray={columns}
//             handleReorderList={handleReorderList}
//         />
//     </DndProvider>)
//     expect(wrapper.find('ColumnItem').length).toEqual(3)

// });

// it('ColumnsList moveColumn()', () => {
//     let valuesUpdated = []
//     const handleReorderList = jest.fn();
//     const onMoveColumn = jest.fn()
//     const onFindColumn = jest.fn()
//     let col = []
//     columns.forEach(a => col.push({ ...a, moveColumn: onMoveColumn, findColumn: onFindColumn }))
//     props.columnsArray = col;

//     act(() => {
//         let wrapper = mount(<DndProvider
//             backend={TouchBackend}
//             options={{ enableMouseEvents: true }}>
//             <ColumnsList moveColumn={onMoveColumn} findColumn={onFindColumn}
//                 columnsArray={col}
//                 handleReorderList={handleReorderList}
//             />
//         </DndProvider>)

//         expect(wrapper.find("ColumnItem").at(0).props().id).toEqual("1")

//         wrapper.find("ColumnItem").at(0).props().moveColumn(1, 2)
//     });

//     expect(onMoveColumn).toHaveBeenCalledTimes(1);

//     expect(handleReorderList).toHaveBeenCalledTimes(1);
// });
