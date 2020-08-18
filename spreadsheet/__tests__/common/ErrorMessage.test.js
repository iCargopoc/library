/* eslint-disable no-undef */

import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import ErrorMessage from "../../src/common/ErrorMessage";
import "@testing-library/jest-dom/extend-expect";

let container = null;
beforeEach(() => {
    // setup a DOM element as a render target
    container = document.createElement("div");
    // container *must* be attached to document so events work correctly.
    document.body.appendChild(container);
});

afterEach(() => {
    // cleanup on exiting
    unmountComponentAtNode(container);
    container.remove();
    container = null;
});

test("ErrorMessage test", () => {
    act(() => {
        render(
            <ErrorMessage className="errorDiv" status="invalid" />,
            container
        );
    });

    const component = document.querySelector("[role=alert]");

    expect(component.innerHTML).toEqual("No Records found!");
});

test("ErrorMessage on-close test", () => {
    // mock callback
    const mockCloseWarningStatus = jest.fn();
    const mockClearSearchValue = jest.fn();

    act(() => {
        render(
            <ErrorMessage
                className="errorDiv"
                status="invalid"
                closeWarningStatus={mockCloseWarningStatus}
                clearSearchValue={mockClearSearchValue}
            />,
            container
        );
    });

    const component = document.querySelector("[class=notification-close]")
        .firstChild;

    act(() => {
        component.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });

    expect(mockCloseWarningStatus.mock.calls.length).toBe(1);
    expect(mockClearSearchValue.mock.calls.length).toBe(1);
});

test("ErrorMessage no error test", () => {
    act(() => {
        render(<ErrorMessage className="errorDiv" status="valid" />, container);
    });

    expect(container.innerHTML).toEqual("<div></div>");
});
