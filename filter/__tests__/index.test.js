import React from "react";
import ReactDOM from "react-dom";
import { MockedProvider } from "@apollo/react-testing";
import userEvent from "@testing-library/user-event";
import { render, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { act } from "react-dom/test-utils";
import Filter from "../src/index";
import FilterData from "./data.json";
import { mockData } from "../__mocks__/graphqlDataMock";
import saveFilter from "./saveFilter.json";
import listView from "./listView.json";
import oneTimeValues from "./oneTimeValues.json";
import components from "../__stories__/components";

let container_;
let mockCustomPanel = () => {
    const CS = () => {
        alert("Close Segment");
    };
    const OS = () => {
        alert("Open Segment");
    };
    const Segment = () => {
        alert("Segment");
    };

    const Summary = () => {
        alert("Summary");
    };
    const OSEG = () => {
        alert("Open Seg");
    };
    const CSEG = () => {
        alert("Close Seg");
    };

    const buttonPanelData = [
        {
            label: "Close Segment",
            value: "CS",
            handleEvent: CS,
            children: []
        },
        {
            label: "Open Segment",
            value: "OS",
            handleEvent: OS,
            children: []
        },
        {
            label: "...",
            value: "SegmentSummary",
            children: [
                {
                    label: "Segment",
                    value: "segment",
                    handleEvent: Segment
                },
                {
                    label: "Summary",
                    value: "summary",
                    handleEvent: Summary
                },
                {
                    label: "Open Segment",
                    value: "OSEG",
                    handleEvent: OSEG
                },
                {
                    label: "Close Segment",
                    value: "CSEG",
                    handleEvent: CSEG
                }
            ]
        }
    ];

    const isbuttonPanelDataPresent =
        buttonPanelData && buttonPanelData.length > 0;

    return (
        <div className="row-options-overlay">
            {isbuttonPanelDataPresent
                ? buttonPanelData.map((action) => {
                      const { label, children, handleEvent } = action;
                      const isChildrenPresent = children && children.length > 0;
                      return (
                          <div className="dropdown" key={label}>
                              <button
                                  type="button"
                                  className="dropbtn"
                                  onClick={handleEvent}
                              >
                                  {label}
                              </button>

                              <div className="dropdown-content">
                                  {isChildrenPresent
                                      ? children.map((childAction) => {
                                            const {
                                                label,
                                                handleEvent
                                            } = childAction;
                                            return (
                                                <div
                                                    className="dropdown"
                                                    key={label}
                                                >
                                                    <button
                                                        type="button"
                                                        className="dropbtn"
                                                        onClick={handleEvent}
                                                    >
                                                        {label}
                                                    </button>
                                                </div>
                                            );
                                        })
                                      : null}
                              </div>
                          </div>
                      );
                  })
                : null}
        </div>
    );
};

beforeEach(() => {
    container_ = document.createElement("div");
    document.body.appendChild(container_);
});

afterEach(() => {
    document.body.removeChild(container_);
    container_ = null;
});

const appliedFilters = jest.fn();
const renderMockComponent = (
    <MockedProvider addTypename={false} mocks={mockData}>
        <Filter
            filterDataProp={FilterData}
            appliedFiltersProp={appliedFilters}
            CustomPanel={mockCustomPanel}
            listView={listView}
            savedFilters={saveFilter}
            oneTimeValues={oneTimeValues}
            components={components}
        />
    </MockedProvider>
);

it("renders without crashing", () => {
    ReactDOM.render(renderMockComponent, container_);
    expect(container_).not.toBeInvalid;
    ReactDOM.unmountComponentAtNode(container_);
});

it("applyFilter - validation", async () => {
    const { container } = render(renderMockComponent);

    const component1 = container.querySelector("[data-testId='addFilter']");
    act(() => {
        component1.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    const component2 = container.querySelector("[data-testId='reset']");
    act(() => {
        component2.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    const component3 = container.querySelector("[data-testId='Date']");
    act(() => {
        component3.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    await waitFor(() => document.getElementsByName("Date"), { document });
    const component4 = container.querySelector("[data-testId='closeField']");
    act(() => {
        component4.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    const component5 = container.querySelector("[data-testId='applyFilter']");
    act(() => {
        component5.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    const validationText = Array.from(container.querySelectorAll("div")).find(
        (el) => el.textContent === "No filter selected!"
    );
    expect(validationText).toBeInTheDocument();
});

it("handleSavePopup", () => {
    const { container } = render(renderMockComponent);

    const component1 = container.querySelector("[data-testId='addFilter']");
    act(() => {
        component1.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    const component2 = container.querySelector("[data-testId='savePopUp']");
    act(() => {
        component2.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    const component3 = container.querySelector(
        "[data-testId='cancelSavePopup-button']"
    );
    act(() => {
        component3.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
});

it("handleListFilterCheck", () => {
    const wrapper = render(renderMockComponent);
    const left = wrapper.getByTestId("handleListFilterCheck");
    act(() => {
        fireEvent.click(left);
    });
    expect(left).not.toBeNull();
});

it("showDrawer-check", () => {
    const wrapper = render(renderMockComponent);
    const addfilter = wrapper.getByText("+ Add Filter");
    act(() => {
        fireEvent.click(addfilter);
    });
    expect(addfilter).not.toBeNull();
    expect(wrapper.getByTestId("searchFilterHandler-input")).toBeInTheDocument;
});

it("resetFilter-check", () => {
    const wrapper = render(renderMockComponent);
    const addfilter = wrapper.getByText("+ Add Filter");
    act(() => {
        fireEvent.click(addfilter);
    });
    expect(addfilter).not.toBeNull();
    const resetfilter = wrapper.getByText("Reset");
    act(() => {
        fireEvent.click(resetfilter);
    });
    expect(wrapper.getByText("Recent Filters")).toBeInTheDocument;
});

it("searchFilter", () => {
    const { container, getByTestId } = render(renderMockComponent);
    const component1 = container.querySelector("[data-testId='addFilter']");
    act(() => {
        component1.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });

    const component2 = container.querySelector(
        "[data-testId='searchFilterHandler-input']"
    );
    act(() => {
        fireEvent.change(component2, { target: { value: "air" } });
    });
    expect(getByTestId("searchFilterHandler-input")).toBeInTheDocument();
});

it("applyFilter - dateTime", async () => {
    const { container } = render(renderMockComponent);

    const component1 = container.querySelector("[data-testId='addFilter']");
    act(() => {
        component1.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });

    const component2 = container.querySelector("[data-testId='Date']");
    act(() => {
        component2.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    await waitFor(() => document.getElementsByName("Date"), { document });
    const component3 = container.querySelector("[id='Date']");
    act(() => {
        fireEvent.focus(component3);
        fireEvent.click(component3);
        fireEvent.change(component3, {
            target: { value: "01092019" }
        });
        fireEvent.blur(component3);
    });
    const component4 = container.querySelector("[data-testId='applyFilter']");
    act(() => {
        component4.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    await waitFor(() => document.getElementsByClassName("listContent"), {
        document
    });
    const component5 = container.querySelector("[class='listContent']");
    expect(component5).toBeInTheDocument;
    act(() => {
        component5.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    expect(container.querySelector("[data-testId='searchFilterHandler-input']"))
        .toBeInTheDocument;
});

it("applyFilter - dateTime clicked twice", async () => {
    const { container } = render(renderMockComponent);

    const component1 = container.querySelector("[data-testId='addFilter']");
    act(() => {
        component1.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });

    const component2 = container.querySelector("[data-testId='Date']");
    act(() => {
        component2.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    const component3 = container.querySelector("[data-testId='Date']");
    act(() => {
        component3.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    await waitFor(() => document.getElementsByName("Date"), { document });
    const component4 = container.querySelector("[id='Date']");
    act(() => {
        fireEvent.focus(component4);
        fireEvent.click(component4);
        fireEvent.change(component4, {
            target: { value: "01092019" }
        });
        fireEvent.blur(component4);
    });
    const component5 = container.querySelector("[data-testId='applyFilter']");
    act(() => {
        component5.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    await waitFor(() => document.getElementsByClassName("listContent"), {
        document
    });
    const component6 = container.querySelector("[class='listContent']");
    expect(component6).toBeInTheDocument();
    act(() => {
        component6.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    expect(container.querySelector("[data-testId='searchFilterHandler-input']"))
        .toBeInTheDocument;
});

it("close - dateTime", async () => {
    const { container } = render(renderMockComponent);

    const component1 = container.querySelector("[data-testId='addFilter']");
    act(() => {
        component1.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });

    const component2 = container.querySelector("[data-testId='Date']");
    act(() => {
        component2.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    await waitFor(() => document.getElementsByName("Date"), { document });
    const component3 = container.querySelector("[data-testId='closeField']");
    act(() => {
        component3.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    expect(
        container.querySelector("[name='Date>check']")
    ).not.toBeInTheDocument();
});
it("change value - Departure Port > Airport Group", async () => {
    const { container } = render(renderMockComponent);

    const component1 = container.querySelector("[data-testId='addFilter']");
    act(() => {
        component1.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    const component2 = Array.from(container.querySelectorAll("div")).find(
        (el) => el.textContent === "Departure Port"
    );
    act(() => {
        component2.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    const component3 = container.querySelector(
        "[data-testId='Airport Group:Departure Port']"
    );
    act(() => {
        component3.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    await waitFor(() => document.getElementsByName("airportGroup"), {
        document
    });
    const component4 = container.querySelector("[id='airportGroup']");

    act(() => {
        fireEvent.focus(component4);
        userEvent.type(component4, "5");
    });
    await waitFor(() => {
        expect(component4.value).toBe("5");
    });

    const component5 = container.querySelector("[data-testId='closeField']");
    act(() => {
        component5.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    expect(
        container.querySelector("[name='airportGroup,check']")
    ).not.toBeInTheDocument();
});

it("enable condition and selecting two filters", async () => {
    const { container } = render(renderMockComponent);
    const component1 = container.querySelector("[data-testId='addFilter']");
    act(() => {
        component1.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    const component2 = Array.from(container.querySelectorAll("div")).find(
        (el) => el.textContent === "Departure Port"
    );
    act(() => {
        component2.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    const component3 = container.querySelector(
        "[data-testId='Airport Group:Departure Port']"
    );
    act(() => {
        component3.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    const component4 = container.querySelector(
        "[data-testId='City:Departure Port']"
    );

    act(() => {
        component4.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    await waitFor(() => document.getElementsByName("airportGroup"), {
        document
    });
    const component5 = container.querySelector("[name='airportGroup']");
    act(() => {
        fireEvent.change(component5, { target: { value: "deployed" } });
    });
    await waitFor(() => {
        expect(component5.value).toBe("deployed");
    });

    await waitFor(
        () => document.getElementsByName("Departure PortAirport Group,check"),
        {
            document
        }
    );
    const component6 = container.querySelector(
        "[name='Departure PortAirport Group,check']"
    );
    act(() => {
        fireEvent.click(component6);
    });
    const conditionField = container.querySelector(
        "[name='airportGroup.condition']"
    );
    fireEvent.focus(conditionField);
    fireEvent.keyDown(conditionField, {
        key: "ArrowDown",
        code: 40
    });
    fireEvent.keyDown(conditionField, {
        key: "ArrowDown",
        code: 40
    });

    fireEvent.keyDown(conditionField, {
        key: "Enter",
        code: 13
    });

    await waitFor(() => expect(conditionField.value).toBe("greater than"));
    act(() => {
        fireEvent.click(
            container.querySelector("[id='Departure PortAirport Group,check']")
        );
    });
    const component7 = container.querySelector(
        "[id='Departure PortAirport Group,check']"
    );
    act(() => {
        fireEvent.click(component7);
    });
    const conditionsField = container.querySelector(
        "[name='airportGroup.condition']"
    );
    fireEvent.focus(conditionsField);
    fireEvent.keyDown(conditionsField, {
        key: "ArrowDown",
        code: 40
    });
    fireEvent.keyDown(conditionsField, {
        key: "ArrowDown",
        code: 40
    });

    fireEvent.keyDown(conditionsField, {
        key: "Enter",
        code: 13
    });

    await waitFor(() => expect(conditionsField.value).toBe("greater than"));
    expect(
        container.querySelector("[name='Departure PortAirport Group,check']")
    ).toBeInTheDocument;
    const component8 = container.querySelector("[data-testId='applyFilter']");
    act(() => {
        component8.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    const component9 = container.querySelector(
        "[data-testId='deployed,airportGroup']"
    );
    await waitFor(() => {
        expect(component9).toBeInTheDocument;
    });
});

it("applyFilter validation", () => {
    const { container } = render(renderMockComponent);

    const component1 = container.querySelector("[data-testId='addFilter']");
    act(() => {
        component1.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    const component2 = container.querySelector("[data-testId='applyFilter']");
    act(() => {
        component2.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    expect(container.querySelector("[id='fieldWarning']")).toBeInTheDocument;
});

it("close Departure Port > Airport", async () => {
    const { container } = render(renderMockComponent);
    const component1 = container.querySelector("[data-testId='addFilter']");
    act(() => {
        component1.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    const component2 = Array.from(container.querySelectorAll("div")).find(
        (el) => el.textContent === "Departure Port"
    );
    act(() => {
        component2.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    const component3 = container.querySelector(
        "[data-testId='Airport:Departure Port']"
    );
    act(() => {
        component3.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    await waitFor(() => document.getElementsByName("airport.value"), {
        document
    });
    () => document.getElementsByName("departurePortAirport.value"),
        expect(container.querySelector("[name='airport.value']"))
            .toBeInTheDocument;
    const component4 = container.querySelector("[data-testId='Flight No']");
    act(() => {
        component4.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    await waitFor(() => document.getElementsByName("flightNo.value"), {
        document
    });
    expect(container.querySelector("[name='flightNo.value']"))
        .toBeInTheDocument;
    const component5 = container.querySelector("[data-testId='AWB Number']");
    act(() => {
        component5.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    await waitFor(() => document.getElementsByName("awbNumber.value"), {
        document
    });
    expect(container.querySelector("[name='awbNumber.value']"))
        .toBeInTheDocument;
    const component6 = container.querySelector("[data-testId='Products']");
    act(() => {
        component6.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    await waitFor(() => document.getElementsByName("products.value"), {
        document
    });
    expect(container.querySelector("[name='products.value']"))
        .toBeInTheDocument;
    const component7 = container.querySelector("[data-testId='Commodities']");
    act(() => {
        component7.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    await waitFor(() => document.getElementsByName("commodities.value"), {
        document
    });
    expect(container.querySelector("[name='commodities.value']"))
        .toBeInTheDocument;
    const component8 = container.querySelector("[data-testId='Master Select']");
    act(() => {
        component8.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    await waitFor(() => document.getElementsByName("masterSelect.value"), {
        document
    });
    expect(container.querySelector("[name='masterSelect.value']"))
        .toBeInTheDocument;
});

it("applyFilter - textField", async () => {
    const { container } = render(renderMockComponent);

    const component1 = container.querySelector("[data-testId='addFilter']");
    act(() => {
        component1.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    const component2 = container.querySelector(
        "[ data-testId='Segment Status']"
    );
    act(() => {
        component2.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    await waitFor(() => document.getElementsByName("segmentStatus"), {
        document
    });
    const component3 = container.querySelector("[name='segmentStatus']");
    act(() => {
        fireEvent.change(component3, { target: { value: "deployed" } });
    });
    await waitFor(() => {
        expect(component3.value).toBe("deployed");
    });
    const component4 = container.querySelector("[data-testId='applyFilter']");
    act(() => {
        component4.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    const component5 = container.querySelector(
        "[data-testId='deployed,segmentStatus']"
    );
    await waitFor(() => {
        expect(component5).toBeInTheDocument;
    });
});

it("applyFilter - textField selected multiple fields", async () => {
    const { container, getAllByText } = render(renderMockComponent);
    const component1 = container.querySelector("[data-testId='addFilter']");
    act(() => {
        component1.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });

    const component2 = container.querySelector(
        "[ data-testId='Booking Profile']"
    );
    act(() => {
        component2.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    await waitFor(() => document.getElementsByName("bookingProfile.value"), {
        document
    });
    const component3 = container.querySelector("[name='bookingProfile.value']");
    act(() => {
        fireEvent.change(component3, { target: { value: "valid" } });
    });
    await waitFor(() => {
        expect(component3.value).toBe("valid");
    });
    const component4 = container.querySelector("[ data-testId='Flight Group']");
    act(() => {
        component4.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    await waitFor(() => document.getElementsByName("flightGroup.value"), {
        document
    });
    const component5 = container.querySelector("[name='flightGroup']");
    act(() => {
        userEvent.type(component5, "valid");
    });
    await waitFor(() => {
        expect(component5.value).toBe("valid");
    });
    const component6 = container.querySelector(
        "[ data-testId='Master Select']"
    );
    act(() => {
        component6.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    await waitFor(() => document.getElementsByName("masterSelect"), {
        document
    });

    const inputComp = container.querySelector("[name='masterSelect']");
    act(() => {
        fireEvent.focus(inputComp);
        fireEvent.keyDown(inputComp, {
            key: "ArrowDown",
            code: 40
        });
    });
    await waitFor(() => {
        expect(getAllByText(/FLOWERS/)[0]).toBeInTheDocument();
    });
    act(() => {
        fireEvent.change(inputComp, "LOBSTERS");
    });
    await waitFor(() => {
        expect(getAllByText(/LOBSTERS/)[0]).toBeInTheDocument();
    });
    const component8 = container.querySelector("[data-testId='applyFilter']");
    act(() => {
        component8.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    const component9 = container.querySelector(
        "[data-testId='valid,bookingProfile']"
    );
    await waitFor(() => {
        expect(component9).toBeInTheDocument;
    });
    const component10 = container.querySelector(
        "[data-testId='valid,flightGroup']"
    );
    await waitFor(() => {
        expect(component10).toBeInTheDocument;
    });
    const component11 = container.querySelector(
        "[data-testId='FLW,LOB,masterSelect']"
    );
    await waitFor(() => {
        expect(component11).toBeInTheDocument;
    });
});
it("applyFilter - groupFilter", async () => {
    const { container } = render(renderMockComponent);

    const component1 = container.querySelector("[data-testId='addFilter']");
    act(() => {
        component1.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    const resetButton = container.querySelector("[data-testId='reset']");
    act(() => {
        resetButton.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    const component2 = container.querySelector("[ data-testId='Date Range']");
    act(() => {
        component2.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    await waitFor(() => document.getElementsByName("fromDate"), {
        document
    });
    await waitFor(() => document.getElementsByName("toDate"), {
        document
    });
    const component3 = container.querySelector("[name='fromDate']");
    act(() => {
        fireEvent.focus(component3);
        fireEvent.click(component3);
        fireEvent.change(component3, {
            target: { value: "01092019" }
        });
        fireEvent.blur(component3);
    });
    const component4 = container.querySelector("[name='toDate']");
    act(() => {
        fireEvent.focus(component4);
        fireEvent.click(component4);
        fireEvent.change(component4, {
            target: { value: "01092019" }
        });
        fireEvent.blur(component4);
    });
    // const popComponent = container.querySelectorAll(
    //     "[class='react-datepicker__day react-datepicker__day--015']"
    // )[0];
    // act(() => {
    //     fireEvent.click(popComponent);
    // });
    act(() => {
        fireEvent.click(container.querySelector("[ data-testId='closeField']"));
    });
    const component5 = container.querySelector(
        "[ data-testId='Booking Profile']"
    );
    act(() => {
        component5.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    await waitFor(() => document.getElementsByName("bookingProfile"), {
        document
    });
    const component6 = container.querySelector("[name='bookingProfile']");
    act(() => {
        fireEvent.change(component6, { target: { value: "valid" } });
    });
    await waitFor(() => {
        expect(component6.value).toBe("valid");
    });
    const component7 = container.querySelector("[ data-testId='Date Range']");
    act(() => {
        component7.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    await waitFor(() => document.getElementsByName("toDate"), {
        document
    });
    await waitFor(() => document.getElementsByName("fromDate"), {
        document
    });
    act(() =>
        fireEvent.click(container.querySelector("[name='From Date,check']"))
    );
    act(() =>
        fireEvent.click(container.querySelector("[name='To Date,check']"))
    );
    act(() =>
        fireEvent.click(container.querySelector("[name='From Date,check']"))
    );
    act(() =>
        fireEvent.click(container.querySelector("[name='To Date,check']"))
    );
    const component8 = container.querySelector("[name='toDate']");
    act(() => {
        fireEvent.focus(component8);
        fireEvent.click(component8);
        fireEvent.change(component8, {
            target: { value: "01092019" }
        });
        fireEvent.blur(component8);
    });
    const component9 = container.querySelector("[name='fromDate']");
    act(() => {
        fireEvent.focus(component9);
        fireEvent.click(component9);
        fireEvent.change(component9, {
            target: { value: "01092019" }
        });
        fireEvent.blur(component9);
    });
    const component10 = container.querySelector("[data-testId='applyFilter']");
    act(() => {
        component10.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
});

it("Test for list view", () => {
    const { container } = render(renderMockComponent);

    const leftIcon = container.querySelector(
        "[data-testId='handleListFilterCheck']"
    );
    act(() => {
        fireEvent.click(leftIcon);
    });
    const item1 = container.querySelector("[data-testId='Flights']");
    act(() => {
        fireEvent.click(item1);
    });
    const chipItem = container.querySelector(
        "[data-testId='test,bookingProfile']"
    );
    expect(chipItem).toBeInTheDocument;
});
it("Test for saved Filter", () => {
    const { container } = render(renderMockComponent);

    const leftIcon = container.querySelector(
        "[ data-testId='handleListFilterCheck']"
    );
    act(() => {
        fireEvent.click(leftIcon);
    });
    const item1 = container.querySelector(
        "[data-testId='Flights under 2500 kg capacity']"
    );
    act(() => {
        fireEvent.click(item1);
    });
    const chipItem = container.querySelector(
        "[data-testId='test,bookingProfile']"
    );
    expect(chipItem).toBeInTheDocument;
});
it("change value - Departure Port > Date Range port", async () => {
    const { container } = render(renderMockComponent);

    const component1 = container.querySelector("[data-testId='addFilter']");
    act(() => {
        component1.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    const component2 = Array.from(container.querySelectorAll("div")).find(
        (el) => el.textContent === "Departure Port"
    );
    act(() => {
        component2.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    const component3 = container.querySelector(
        "[data-testId='Date Range Port:Departure Port']"
    );
    act(() => {
        component3.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
});
it("createSelect and Iselect binding", async () => {
    const { container } = render(renderMockComponent);

    const component1 = container.querySelector("[data-testId='addFilter']");
    act(() => {
        component1.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    const component2 = container.querySelector("[data-testId='reset']");
    act(() => {
        component2.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    const component3 = container.querySelector("[data-testId='Date']");
    act(() => {
        component3.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    await waitFor(() => document.getElementsByName("Date"), { document });
    const component4 = container.querySelector("[data-testId='closeField']");
    act(() => {
        component4.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    const component5 = container.querySelector("[data-testId='Create Select']");
    act(() => {
        component5.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    const component6 = Array.from(container.querySelectorAll("div")).find(
        (el) => el.textContent === "Arrival Terminal"
    );
    act(() => {
        component6.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    const component7 = container.querySelector(
        "[data-testId='Create Select Terminal:Arrival Terminal']"
    );
    act(() => {
        component7.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    const component8 = container.querySelector(
        "[data-testId='ISelect Terminal:Arrival Terminal']"
    );
    act(() => {
        component8.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    const component9 = container.querySelector("[data-testId='I Select']");
    act(() => {
        component9.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    const checkField = container.querySelector(
        "[name='Arrival TerminalCreate Select Terminal,check']"
    );
    expect(checkField).toBeInTheDocument();
});
it("createSelect and Iselect binding at starting", async () => {
    const { container } = render(renderMockComponent);

    const component1 = container.querySelector("[data-testId='addFilter']");
    act(() => {
        component1.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    const component2 = container.querySelector("[data-testId='reset']");
    act(() => {
        component2.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    const component3 = container.querySelector("[data-testId='Date']");
    act(() => {
        component3.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    await waitFor(() => document.getElementsByName("Date"), { document });
    const component4 = container.querySelector("[data-testId='closeField']");
    act(() => {
        component4.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    const component5 = Array.from(container.querySelectorAll("div")).find(
        (el) => el.textContent === "Arrival Terminal"
    );
    act(() => {
        component5.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    const component6 = container.querySelector(
        "[data-testId='Create Select Terminal:Arrival Terminal']"
    );
    act(() => {
        component6.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    const checkField = container.querySelector(
        "[name='Arrival TerminalCreate Select Terminal,check']"
    );
    expect(checkField).toBeInTheDocument();
});
it("close GroupFilter", async () => {
    const { container } = render(renderMockComponent);

    const component1 = container.querySelector("[data-testId='addFilter']");
    act(() => {
        component1.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    const component2 = container.querySelector("[data-testId='reset']");
    act(() => {
        component2.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    const component3 = container.querySelector("[data-testId='Date Range']");
    act(() => {
        component3.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    await waitFor(() => document.getElementsByName("fromDate"), { document });
    const component4 = container.querySelector("[data-testId='closeField']");
    act(() => {
        component4.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    expect(
        container.querySelector("[name='fromDate']")
    ).not.toBeInTheDocument();
});
it("enable condition and closing filter", async () => {
    const { container } = render(renderMockComponent);
    const component1 = container.querySelector("[data-testId='addFilter']");
    act(() => {
        component1.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    const reset = container.querySelector("[data-testId='reset']");
    act(() => {
        reset.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    const component2 = Array.from(container.querySelectorAll("div")).find(
        (el) => el.textContent === "Departure Port"
    );
    act(() => {
        component2.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    const component3 = container.querySelector(
        "[data-testId='Airport Group:Departure Port']"
    );
    act(() => {
        component3.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    await waitFor(() => document.getElementsByName("airportGroup"), {
        document
    });
    const component5 = container.querySelector("[name='airportGroup']");
    act(() => {
        fireEvent.change(component5, { target: { value: "deployed" } });
    });
    await waitFor(() => {
        expect(component5.value).toBe("deployed");
    });

    await waitFor(
        () => document.getElementsByName("Departure PortAirport Group,check"),
        {
            document
        }
    );
    const component6 = container.querySelector(
        "[name='Departure PortAirport Group,check']"
    );
    act(() => {
        fireEvent.click(component6);
    });
    const conditionField = container.querySelector(
        "[name='airportGroup.condition']"
    );
    fireEvent.focus(conditionField);
    fireEvent.keyDown(conditionField, {
        key: "ArrowDown",
        code: 40
    });
    fireEvent.keyDown(conditionField, {
        key: "ArrowDown",
        code: 40
    });

    fireEvent.keyDown(conditionField, {
        key: "Enter",
        code: 13
    });
    await waitFor(() => expect(conditionField.value).toBe("greater than"));
    const closeField = container.querySelector("[data-testId='closeField']");
    act(() => {
        closeField.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    expect(component5).not.toBeInTheDocument();
});
