import React from "react";
import { render, cleanup, fireEvent, screen, getByTestId } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import "@testing-library/jest-dom";

import SavedFilters from "../../../src/panel/SavedFilters";

describe("Main Filter Panel component", () => {
    const item = [
        {
            name: "Booking Profile",
            dataType: "Text",
            enabled: false,
            validated: false,
            warning: "This field is required*"
        }
    ];

    const props = {
        onSelectSavedFilter: item,
        showFilter: false
    };

    const handleListFilter = jest.fn();
    const addSavedFilters = jest.fn();
    const addingToFavourite = jest.fn();

    let container;
    beforeEach(() => {
        // setup a DOM element as a render target
        container = document.createElement("div");
        // container *must* be attached to document so events work correctly.
        document.body.appendChild(container);
    });
    afterEach(cleanup);

    it("Should be available in TextComponents ", () => {
        const wrapper = render(
            <SavedFilters
                onSelectSavedFilter={props.onSelectSavedFilter}
                showFilter={props.showFilter}
                handleListFilter={handleListFilter}
                addSavedFilters={addSavedFilters}
                addingToFavourite={addingToFavourite}
            />
        );
        const createTextComponentsArrayElm = wrapper.findAllByText("Saved Filters");
        // const deleteTextComponentElementElm = wrapper.getByTestId("deleteTextComponentElement-button");
        // const handleTextComponentEnabledElm = wrapper.getByTestId("handleTextComponentEnabled-check");
        // expect(createTextComponentsArrayElm).toBeInTheDocument;
        // expect(deleteTextComponentElementElm).toBeTruthy;
        // expect(handleTextComponentEnabledElm).toBeTruthy;
        expect(props.deleteTextComponentElement).toBeInTheDocument;

        // fireEvent.change(handleTextComponentEnabledElm, {
        //     target: { item }
        // });
        // fireEvent.change(createTextComponentsArrayElm, {
        //     target: { item }
        // });
        // fireEvent.click(props.showFilter, handleListFilter, addSavedFilters);
    });

    it("Save Filter ", () => {
        const wrapper = render(
            <SavedFilters
                onSelectSavedFilter={props.onSelectSavedFilter}
                showFilter={props.showFilter}
                handleListFilter={handleListFilter}
                addSavedFilters={addSavedFilters}
                addingToFavourite={addingToFavourite}
            />
        );
        const component = wrapper.getByTestId("addSavedFilters-check");

        act(() => {
            component.dispatchEvent(new MouseEvent("click", { bubbles: true }));
        });
    });
});
