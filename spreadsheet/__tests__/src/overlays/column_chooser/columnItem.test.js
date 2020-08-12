import React from "react";
import ReactDOM from "react-dom";
import ReactTestUtils, { act } from "react-dom/test-utils";
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

it("Render mount the component and unmount the columnItem", () => {
    const id = 1;
    const text = { type: "div", id: "flightNo" };
    const moveColumn = jest.fn();
    const findColumn = jest.fn(() => 1);

    act("run functions", () => {
        ReactDOM.render(
            <DndProvider
                backend={TouchBackend}
                options={{
                    enableMouseEvents: true
                }}
            >
                <ColumnItem
                    id={id}
                    text={text}
                    moveColumn={moveColumn}
                    findColumn={findColumn}
                />
            </DndProvider>,
            container
        );
    });
    let component = ReactTestUtils.renderIntoDocument(
        <DndProvider
            backend={TouchBackend}
            options={{
                enableMouseEvents: true
            }}
        >
            <ColumnItem {...props} />
        </DndProvider>
    );
});

// describe("<ColumnItem />", () => {
//   const props = {
//     id: 1,
//     text: "text",
//     moveColumn: jest.fn(),
//     findColumn: jest.fn(() => 1),
//     useDrop: jest.fn(),
//   };
//   it("mount", () => {
//     const wrapper = mount(
//       <DndProvider backend={TouchBackend} options={{ enableMouseEvents: true }}>
//         <ColumnItem {...props} />
//       </DndProvider>
//     );

//   });
// });
