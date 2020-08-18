/* eslint-disable no-undef */
import React from "react";
import { render, fireEvent } from "@testing-library/react";
import DefaultColumnFilter from "../../src/Functions/DefaultColumnFilter";
import "@testing-library/jest-dom/extend-expect";

describe("DefaultColumnFilter component", () => {
    it("should search the given value", () => {
        const newSetFilter = jest.fn();
        const newFilterValue = "XX2225";

        const { container } = render(
            <DefaultColumnFilter
                column={{
                    filterValue: newFilterValue,
                    setFilter: newSetFilter
                }}
            />
        );

        const input = container.getElementsByClassName("txt").item(0);
        fireEvent.change(input, { target: { value: "ABC1178" } });
        expect(newSetFilter).toHaveBeenCalledTimes(1);
    });
});
