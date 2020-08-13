import React from "react";
import { act } from "react-dom/test-utils";
import ReactTestUtils from "react-dom/test-utils";
import SortingList from "../../../../src/overlays/sorting/SortingList";
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
// const cards = [
//   {
//     id: 1,
//     key: "flightno",
//     text: "FlightNo",
//   },
//   {
//     id: 2,
//     key: "yield",
//     text: "Yield",
//   },
//   {
//     id: 3,
//     key: "revenue",
//     text: "Revenue",
//   },
// ];
// const props = {
//   sortsArray: [...cards],
// };

// it("mount", () => {
//   const handleReorderList = (p) => {};

//   const wrapper = mount(
//     <DndProvider backend={TouchBackend} options={{ enableMouseEvents: true }}>
//       <SortingList
//         props={props}
//         sortsArray={cards}
//         handleReorderListOfSort={handleReorderList}
//       />
//     </DndProvider>
//   );
//   expect(wrapper.find("SortItem")).not.toBeNull();
// });

// it("CardList item length", () => {
//   let valuesUpdated = [];
//   const handleReorderList = (values) => (valuesUpdated = [...values]);
//   const wrapper = mount(
//     <DndProvider backend={TouchBackend} options={{ enableMouseEvents: true }}>
//       <SortingList
//         props={props}
//         sortsArray={cards}
//         handleReorderListOfSort={handleReorderList}
//       />
//     </DndProvider>
//   );
//   expect(wrapper.find("Card").length).toEqual(3);
// });

// it("CardList moveCard()", () => {
//   let valuesUpdated = [];
//   const handleReorderListOfSort = jest.fn();
//   const onMoveCard = jest.fn();
//   const onFindCard = jest.fn();
//   let card = [];
//   cards.forEach((a) =>
//     card.push({ ...a, moveCard: onMoveCard, findCard: onFindCard })
//   );
//   props.sortsArray = card;

//   act(() => {
//     let wrapper = mount(
//       <DndProvider backend={TouchBackend} options={{ enableMouseEvents: true }}>
//         <SortingList
//           moveCard={onMoveCard}
//           findCard={onFindCard}
//           sortsArray={cards}
//           handleReorderListOfSort={handleReorderListOfSort}
//         />
//       </DndProvider>
//     );

//     expect(wrapper.find("Card").at(0).props().id).toEqual("1");

//     wrapper.find("Card").at(0).props().moveCard(1, 2);
//   });

//   expect(onMoveColumn).toHaveBeenCalledTimes(1);

//   expect(handleReorderList).toHaveBeenCalledTimes(1);
// });
