import React from "react";
import { render, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";

import MainFilterPanel from "../../../src/panel/MainFilterPanel";

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
        applyFilterChip: {
            applyFilter: [
                {
                    name: "Arrival Port",
                    type: "Airport",
                    dataType: "AutoComplete",
                    enabled: true,
                    value: [
                        {
                            key: "AAB",
                            value: "AAB"
                        },
                        {
                            key: "ABA",
                            value: "ABA"
                        }
                    ]
                }
            ]
        }
    };

    const showDrawer = jest.fn();
    const addAppliedFilters = jest.fn();
    const addSavedFilters = jest.fn();
    const addingToFavourite = jest.fn();
    const setCountShow = jest.fn();

    it("Should be available in MainFilterPanel ", () => {
        const wrapper = render(
            <MainFilterPanel
                showDrawer={showDrawer}
                applyFilterChip={props.applyFilterChip}
                addAppliedFilters={addAppliedFilters}
                addSavedFilters={addSavedFilters}
                addingToFavourite={addingToFavourite}
            />
        );
    });

    it(" Check type click ", () => {
        const wrapper = render(
            <MainFilterPanel
                showDrawer={showDrawer}
                applyFilterChip={props.applyFilterChip}
                addAppliedFilters={addAppliedFilters}
                addSavedFilters={addSavedFilters}
                addingToFavourite={addingToFavourite}
            />
        );
        const createTextComponentsArrayElm = wrapper.getByTestId("type-check");
        fireEvent.click(createTextComponentsArrayElm, props.applyFilterChip.applyFilter);
    });

    it(" Check condition click ", () => {
        const wrapper = render(
            <MainFilterPanel
                showDrawer={showDrawer}
                applyFilterChip={props.applyFilterChip}
                addAppliedFilters={addAppliedFilters}
                addSavedFilters={addSavedFilters}
                addingToFavourite={addingToFavourite}
            />
        );
        const createTextComponentsArrayElm = wrapper.getByTestId("conditionValue-check");
        fireEvent.click(createTextComponentsArrayElm, props.applyFilterChip.applyFilter);
    });

    it(" Check fieldValue click ", () => {
        const wrapper = render(
            <MainFilterPanel
                showDrawer={showDrawer}
                applyFilterChip={props.applyFilterChip}
                addAppliedFilters={addAppliedFilters}
                addSavedFilters={addSavedFilters}
                addingToFavourite={addingToFavourite}
            />
        );
        const createTextComponentsArrayElm = wrapper.getByTestId("fieldValue-check");
        fireEvent.click(createTextComponentsArrayElm, props.applyFilterChip.applyFilter);
    });

    it("Chip Count ", () => {
        const wrapper = render(
            <MainFilterPanel
                showDrawer={showDrawer}
                applyFilterChip={props.applyFilterChip}
                addAppliedFilters={addAppliedFilters}
                addSavedFilters={addSavedFilters}
                addingToFavourite={addingToFavourite}
            />
        );

        const createTextComponentsArrayElm = wrapper.getByTestId("chipCount-check");
        fireEvent.click(createTextComponentsArrayElm, props.applyFilterChip.applyFilter);
    });
});
