/* eslint-disable no-undef */
import { render, fireEvent, waitFor } from "@testing-library/react";
import React from "react";
import "@testing-library/jest-dom/extend-expect";
/* eslint-disable no-unused-vars */
import regeneratorRuntime from "regenerator-runtime";
import GlobalFilter from "../../src/Functions/GlobalFilter";

describe("render global search", () => {
    const mockSetGlobalFilter = jest.fn();
    const globalFilter = "XX2225";
    it("should search the given value", async () => {
        const { container } = render(
            <GlobalFilter
                globalFilter={globalFilter}
                setGlobalFilter={mockSetGlobalFilter}
            />
        );
        const input = container.getElementsByClassName("txt").item(0);
        fireEvent.change(input, { target: { value: "ABC1178" } });
        expect(input.value).toBe("ABC1178");
        await waitFor(() => expect(mockSetGlobalFilter).toBeCalled());
        fireEvent.change(input, { target: { value: "" } });
        expect(input.value).toBe("");
        await waitFor(() => expect(mockSetGlobalFilter).toBeCalled());
    });
});
