import React from "react";
import ReactDOM from "react-dom";
import { MockedProvider } from "@apollo/react-testing";
import userEvent from "@testing-library/user-event";
import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { act } from "react-dom/test-utils";
import Filter from "../src/index";
import FilterData from "./data.json";
import { mockData } from "../__mocks__/graphqlDataMock";
import saveFilter from "./saveFilter.json";
import listView from "./listView.json";
import oneTimeValues from "./oneTimeValues.json";
import components from "../__stories__/components";
import recentFilter from "./recentFilter.json";

let container_;
const mockCustomPanel = () => {
    const CS = () => {
        // eslint-disable-next-line no-alert
        alert("Close Segment");
    };
    // eslint-disable-next-line no-alert
    const OS = () => {
        // eslint-disable-next-line no-alert
        alert("Open Segment");
    };
    const Segment = () => {
        // eslint-disable-next-line no-alert
        alert("Segment");
    };

    const Summary = () => {
        // eslint-disable-next-line no-alert
        alert("Summary");
    };
    const OSEG = () => {
        // eslint-disable-next-line no-alert
        alert("Open Seg");
    };
    const CSEG = () => {
        // eslint-disable-next-line no-alert
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
                                                childlabel,
                                                childhandleEvent
                                            } = childAction;
                                            return (
                                                <div
                                                    className="dropdown"
                                                    key={childlabel}
                                                >
                                                    <button
                                                        type="button"
                                                        className="dropbtn"
                                                        onClick={
                                                            childhandleEvent
                                                        }
                                                    >
                                                        {childlabel}
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

const listViewTemp = {
    predefinedFilters: [
        {
            name: "Flights",
            category: "FL",
            default: false,
            filters: {
                yield: "rerwe",
                flightNo: {
                    carrierCode: "dfd",
                    flightNumber: "00123",
                    flightDate: "2020-09-22"
                },
                bookingProfile: {
                    value: "test",
                    condition: "greater than"
                },
                masterSelect: ["GEN", "PIG", "VAL"]
            }
        },
        {
            name: "Bookings",
            category: "BK",
            default: false,
            filters: {
                yield: "rerwe",
                flightNo: {
                    value: {
                        carrierCode: "dfd",
                        flightNumber: "00123",
                        flightDate: "2020-09-22"
                    },
                    condition: "greater than"
                },
                bookingProfile: {
                    value: "test",
                    condition: "greater than"
                },
                masterSelect: ["LTF", "LOB"],
                airport: "TRV",
                country: { value: "KRL", condition: "greater than" },
                fromDatePort: "2020-09-22",
                toDatePort: "2020-10-22",
                fromDate: "2022-10-22",
                toDate: "12:00",
                iSelect: "2",
                iSelectTerminal: "1",
                custom1: { text: "jkl", date: "2022-10-23" },
                custom2: { text: "jkl", date: "2022-10-24" },
                custom1Port: { text: "jkl", date: "2022-10-25" },
                custom2Port: { text: "jkl", date: "2022-10-26" },
                createSelect: {
                    value: ["1", "2"],
                    condition: "greater than"
                }
            }
        },
        {
            name: "Cancellings",
            category: "CG",
            default: false,
            filters: {
                yield: "rerwe",
                flightNo: {
                    value: {
                        carrierCode: "dfd",
                        flightNumber: "00123",
                        flightDate: "2020-09-22"
                    },
                    condition: "greater than"
                },
                bookingProfile: {
                    value: "test",
                    condition: "greater than"
                },
                masterSelect: ["LTF", "LOB"]
            }
        },
        {
            name: "Delayed Flights",
            category: "FOA",
            default: true,
            filters: {
                yield: "rerwe",
                flightNo: {
                    value: {
                        carrierCode: "dfd",
                        flightNumber: "00123",
                        flightDate: "2020-09-22"
                    },
                    condition: "greater than"
                },
                bookingProfile: {
                    value: "test",
                    condition: "greater than"
                },
                masterSelect: ["LTF", "LOB"]
            }
        },
        {
            name: "Default",
            category: "default",
            filters: { itoggle: false }
        }
    ]
};

const dataTemp = [
    {
        name: "Bookings",
        category: "BK",
        filter: [
            {
                label: "Custom One",
                name: "custom1",
                dataType: "Custom"
            },
            {
                label: "Custom Two",
                name: "custom2",
                dataType: "Custom"
            },
            {
                label: "Date Range",
                isSubFilter: false,
                isGroupFilter: true,
                groupFilter: [
                    {
                        label: "From Date",
                        dataType: "IDatePicker",
                        isRequired: false,
                        condition: [
                            { label: "equal to", value: "equal to" },
                            {
                                label: "greater than",
                                value: "greater than"
                            },
                            {
                                label: "less than",
                                value: "less than"
                            }
                        ],
                        name: "fromDate"
                    },
                    {
                        label: "To Date",
                        dataType: "IDatePicker",
                        isRequired: false,
                        condition: [
                            { label: "equal to", value: "equal to" },
                            {
                                label: "greater than",
                                value: "greater than"
                            },
                            {
                                label: "less than",
                                value: "less than"
                            }
                        ],
                        name: "toDate"
                    }
                ]
            },
            {
                label: "Custom Fields",
                isSubFilter: false,
                isGroupFilter: true,
                groupFilter: [
                    {
                        label: "Date Picker",
                        dataType: "IDatePicker",
                        isRequired: false,
                        name: "datePicker"
                    },
                    {
                        label: "Airport Field",
                        dataType: "IAirport",
                        isRequired: false,
                        name: "airportField"
                    },
                    {
                        label: "Text Field",
                        dataType: "ITextField",
                        isRequired: false,
                        name: "textField"
                    },
                    {
                        label: "AWB Field",
                        dataType: "IAwbNumber",
                        isRequired: false,
                        name: "awbField"
                    }
                ]
            },
            {
                label: "Date",
                isSubFilter: false,
                isGroupFilter: false,
                dataType: "IDatePicker",
                isRequired: false,
                name: "Date",
                initialValue: ""
            },
            {
                label: "Booking Profile",
                isSubFilter: false,
                isGroupFilter: false,
                dataType: "ITextField",
                condition: [
                    { label: "equal to", value: "equal to" },
                    {
                        label: "greater than",
                        value: "greater than"
                    },
                    {
                        label: "less than",
                        value: "less than"
                    }
                ],
                isRequired: false,
                name: "bookingProfile",
                initialValue: ""
            },
            {
                label: "Toggle Field",
                isSubFilter: false,
                isGroupFilter: false,
                condition: [
                    { label: "equal to", value: "equal to" },
                    {
                        label: "greater than",
                        value: "greater than"
                    },
                    {
                        label: "less than",
                        value: "less than"
                    }
                ],
                dataType: "IToggle",
                isRequired: false,
                name: "itoggle"
            },
            {
                label: "Departure Port",
                isSubFilter: true,
                subFilters: [
                    {
                        label: "Airport",
                        isGroupFilter: false,
                        dataType: "IAirport",
                        isRequired: false,
                        name: "airport",
                        initialValue: ""
                    },
                    {
                        label: "Airport Group",
                        isGroupFilter: false,
                        dataType: "ITextField",
                        condition: [
                            { label: "equal to", value: "equal to" },
                            {
                                label: "greater than",
                                value: "greater than"
                            },
                            {
                                label: "less than",
                                value: "less than"
                            }
                        ],

                        name: "airportGroup",
                        initialValue: ""
                    },
                    {
                        label: "City",
                        isGroupFilter: false,
                        dataType: "ITextField",
                        condition: [
                            { label: "equal to", value: "equal to" },
                            {
                                label: "greater than",
                                value: "greater than"
                            },
                            {
                                label: "less than",
                                value: "less than"
                            }
                        ],
                        isRequired: false,
                        name: "city",
                        initialValue: ""
                    },
                    {
                        label: "City Group",
                        dataType: "ITextField",
                        isGroupFilter: false,
                        condition: [
                            { label: "equal to", value: "equal to" },
                            {
                                label: "greater than",
                                value: "greater than"
                            },
                            {
                                label: "less than",
                                value: "less than"
                            }
                        ],
                        isRequired: false,
                        name: "cityGroup",
                        initialValue: ""
                    },
                    {
                        label: "Country",
                        isGroupFilter: false,
                        dataType: "ITextField",
                        condition: [
                            { label: "equal to", value: "equal to" },
                            {
                                label: "greater than",
                                value: "greater than"
                            },
                            {
                                label: "less than",
                                value: "less than"
                            }
                        ],
                        isRequired: false,
                        name: "country",
                        initialValue: ""
                    },
                    {
                        label: "Date Range Port",
                        isGroupFilter: true,
                        groupFilter: [
                            {
                                label: "From Date Port",
                                dataType: "IDatePicker",
                                isRequired: false,
                                name: "fromDatePort"
                            },
                            {
                                label: "To Date Port",
                                dataType: "IDatePicker",
                                isRequired: false,
                                name: "toDatePort"
                            }
                        ]
                    },
                    {
                        label: "Custom One Port",
                        name: "custom1Port",
                        dataType: "Custom"
                    },
                    {
                        label: "Custom Two Port",
                        name: "custom2Port",
                        dataType: "Custom"
                    }
                ]
            },
            {
                label: "Arrival Terminal",
                isSubFilter: true,
                subFilters: [
                    {
                        label: "Terminal",
                        dataType: "IAirport",
                        isRequired: false,
                        name: "terminal",
                        initialValue: ""
                    },
                    {
                        label: "Terminal Group",
                        dataType: "ITextField",
                        condition: [
                            { label: "equal to", value: "equal to" },
                            {
                                label: "greater than",
                                value: "greater than"
                            },
                            {
                                label: "less than",
                                value: "less than"
                            }
                        ],
                        isRequired: false,
                        name: "terminalGroup",
                        initialValue: ""
                    },
                    {
                        label: "Cluster",
                        dataType: "ITextField",
                        condition: [
                            { label: "equal to", value: "equal to" },
                            {
                                label: "greater than",
                                value: "greater than"
                            },
                            {
                                label: "less than",
                                value: "less than"
                            }
                        ],
                        isRequired: false,
                        name: "cluster",
                        initialValue: ""
                    },
                    {
                        label: "Cluster Group",
                        dataType: "ITextField",
                        condition: [
                            { label: "equal to", value: "equal to" },
                            {
                                label: "greater than",
                                value: "greater than"
                            },
                            {
                                label: "less than",
                                value: "less than"
                            }
                        ],
                        isRequired: false,
                        name: "clusterGroup",
                        initialValue: ""
                    },
                    {
                        label: "state",
                        dataType: "ITextField",
                        condition: [
                            { label: "equal to", value: "equal to" },
                            {
                                label: "greater than",
                                value: "greater than"
                            },
                            {
                                label: "less than",
                                value: "less than"
                            }
                        ],
                        isRequired: false,
                        name: "state",
                        initialValue: ""
                    },
                    {
                        label: "Create Select Terminal",
                        isGroupFilter: false,
                        dataType: "CreateSelect",
                        condition: [
                            { label: "equal to", value: "equal to" },
                            {
                                label: "greater than",
                                value: "greater than"
                            },
                            {
                                label: "less than",
                                value: "less than"
                            }
                        ],
                        isRequired: false,
                        name: "createSelectTerminal",
                        initialValue: "",
                        oneTimeCode: "options1"
                    },
                    {
                        label: "ISelect Terminal",
                        isGroupFilter: false,
                        dataType: "ISelect",
                        condition: [
                            { label: "equal to", value: "equal to" },
                            {
                                label: "greater than",
                                value: "greater than"
                            },
                            {
                                label: "less than",
                                value: "less than"
                            }
                        ],
                        isRequired: false,
                        name: "iSelectTerminal",
                        initialValue: "",
                        oneTimeCode: "options2"
                    }
                ]
            },

            {
                label: "Flight Group",
                isSubFilter: false,
                isGroupFilter: false,
                dataType: "ITextField",
                condition: [
                    { label: "equal to", value: "equal to" },
                    {
                        label: "greater than",
                        value: "greater than"
                    },
                    {
                        label: "less than",
                        value: "less than"
                    }
                ],
                isRequired: false,
                name: "flightGroup",
                initialValue: ""
            },
            {
                label: "Flight No",
                isSubFilter: false,
                isGroupFilter: false,
                dataType: "IFlightNumber",
                condition: [
                    { label: "equal to", value: "equal to" },
                    {
                        label: "greater than",
                        value: "greater than"
                    },
                    {
                        label: "less than",
                        value: "less than"
                    }
                ],
                isRequired: false,
                name: "flightNo",
                initialValue: ""
            },
            {
                label: "Yield",
                isSubFilter: false,
                isGroupFilter: false,
                dataType: "ITextField",
                condition: [
                    { label: "equal to", value: "equal to" },
                    {
                        label: "greater than",
                        value: "greater than"
                    },
                    {
                        label: "less than",
                        value: "less than"
                    }
                ],
                isRequired: false,
                name: "yield",
                initialValue: ""
            },
            {
                label: "Service Recovery",
                isSubFilter: false,
                isGroupFilter: false,
                dataType: "ITextField",
                condition: [
                    { label: "equal to", value: "equal to" },
                    {
                        label: "greater than",
                        value: "greater than"
                    },
                    {
                        label: "less than",
                        value: "less than"
                    }
                ],
                required: false,
                name: "serviceRecovery",
                initialValue: ""
            },
            {
                label: "Queued Bookings",
                isSubFilter: false,
                isGroupFilter: false,
                dataType: "ITextField",
                condition: [
                    { label: "equal to", value: "equal to" },
                    {
                        label: "greater than",
                        value: "greater than"
                    },
                    {
                        label: "less than",
                        value: "less than"
                    }
                ],
                isRequired: false,
                name: "queuedBookings",
                initialValue: ""
            },
            {
                label: "Weight",
                isSubFilter: false,
                isGroupFilter: false,
                dataType: "ITextField",
                condition: [
                    { label: "equal to", value: "equal to" },
                    {
                        label: "greater than",
                        value: "greater than"
                    },
                    {
                        label: "less than",
                        value: "less than"
                    }
                ],
                isRequired: false,
                name: "weight",
                initialValue: ""
            },
            {
                label: "Volume",
                dataType: "ITextField",
                condition: [
                    { label: "equal to", value: "equal to" },
                    {
                        label: "greater than",
                        value: "greater than"
                    },
                    {
                        label: "less than",
                        value: "less than"
                    }
                ],
                isRequired: false,
                name: "volume",
                initialValue: ""
            },
            {
                label: "Aircraft",
                isSubFilter: false,
                isGroupFilter: false,
                dataType: "ITextField",
                condition: [
                    { label: "equal to", value: "equal to" },
                    {
                        label: "greater than",
                        value: "greater than"
                    },
                    {
                        label: "less than",
                        value: "less than"
                    }
                ],
                isRequired: false,
                name: "aircraft",
                initialValue: ""
            },
            {
                label: "Aircraft Classification",
                isSubFilter: false,
                isGroupFilter: false,
                dataType: "ITextField",
                condition: [
                    { label: "equal to", value: "equal to" },
                    {
                        label: "greater than",
                        value: "greater than"
                    },
                    {
                        label: "less than",
                        value: "less than"
                    }
                ],
                isRequired: false,
                name: "aircraftClassification",
                initialValue: ""
            },
            {
                label: "Flight Type",
                isSubFilter: false,
                isGroupFilter: false,
                dataType: "ITextField",
                condition: [
                    { label: "equal to", value: "equal to" },
                    {
                        label: "greater than",
                        value: "greater than"
                    },
                    {
                        label: "less than",
                        value: "less than"
                    }
                ],
                isRequired: false,
                name: "flightType",
                initialValue: ""
            },
            {
                label: "Flight Status",
                isSubFilter: false,
                isGroupFilter: false,
                dataType: "ITextField",
                condition: [
                    { label: "equal to", value: "equal to" },
                    {
                        label: "greater than",
                        value: "greater than"
                    },
                    {
                        label: "less than",
                        value: "less than"
                    }
                ],
                isRequired: false,
                name: "flightStatus",
                initialValue: ""
            },
            {
                label: "Segment Status",
                isSubFilter: false,
                isGroupFilter: false,
                dataType: "ITextField",
                condition: [
                    { label: "equal to", value: "equal to" },
                    {
                        label: "greater than",
                        value: "greater than"
                    },
                    {
                        label: "less than",
                        value: "less than"
                    }
                ],
                isRequired: false,
                name: "segmentStatus",
                initialValue: ""
            },
            {
                label: "AWB Number",
                isSubFilter: false,
                isGroupFilter: false,
                dataType: "IAwbNumber",
                condition: [
                    { label: "equal to", value: "equal to" },
                    {
                        label: "greater than",
                        value: "greater than"
                    },
                    {
                        label: "less than",
                        value: "less than"
                    }
                ],
                isRequired: false,
                name: "awbNumber",
                initialValue: ""
            },
            {
                label: "Products",
                isSubFilter: false,
                isGroupFilter: false,
                dataType: "IProducts",
                condition: [
                    { label: "equal to", value: "equal to" },
                    {
                        label: "greater than",
                        value: "greater than"
                    },
                    {
                        label: "less than",
                        value: "less than"
                    }
                ],
                isRequired: false,
                name: "products",
                initialValue: ""
            },
            {
                label: "Create Select",
                isSubFilter: false,
                isGroupFilter: false,
                dataType: "CreateSelect",
                condition: [
                    { label: "equal to", value: "equal to" },
                    {
                        label: "greater than",
                        value: "greater than"
                    },
                    {
                        label: "less than",
                        value: "less than"
                    }
                ],
                isRequired: false,
                name: "createSelect",
                initialValue: "",
                labelOnSelect: true,
                oneTimeCode: "options1",
                props: { multi: true }
            },
            {
                label: "I Select",
                isSubFilter: false,
                isGroupFilter: false,
                dataType: "ISelect",
                condition: [
                    { label: "equal to", value: "equal to" },
                    {
                        label: "greater than",
                        value: "greater than"
                    },
                    {
                        label: "less than",
                        value: "less than"
                    }
                ],
                isRequired: false,
                name: "iSelect",
                initialValue: "",
                labelOnSelect: true,
                oneTimeCode: "options2"
            },
            {
                label: "Commodities",
                isSubFilter: false,
                isGroupFilter: false,
                dataType: "ICommodities",
                condition: [
                    { label: "equal to", value: "equal to" },
                    {
                        label: "greater than",
                        value: "greater than"
                    },
                    {
                        label: "less than",
                        value: "less than"
                    }
                ],
                isRequired: false,
                name: "commodities",
                initialValue: ""
            },
            {
                label: "Master Select",
                isSubFilter: false,
                isGroupFilter: false,
                dataType: "MasterSelect",
                condition: [
                    { label: "equal to", value: "equal to" },
                    {
                        label: "greater than",
                        value: "greater than"
                    },
                    {
                        label: "less than",
                        value: "less than"
                    }
                ],
                isRequired: false,
                name: "masterSelect",
                initialValue: "",
                props: {
                    query: "commodities",
                    value: "commodityCode",
                    label: "commodityDescription",
                    multi: true
                }
            },
            {
                label: "Master Type Select",
                isSubFilter: false,
                isGroupFilter: false,
                dataType: "MasterTypeSelect",
                condition: [
                    { label: "equal to", " value": "equal to" },
                    {
                        label: "greater than",
                        value: "greater than"
                    },
                    {
                        label: "less than",
                        value: "less than"
                    }
                ],
                initialValue: "",
                props: {
                    selectOptions: [
                        {
                            label: "Airport",
                            value: "airports",
                            schema: {
                                query: "airports",
                                label: "airport_name",
                                value: "airport_code"
                            }
                        },
                        {
                            label: "Commodities",
                            value: "commodities",
                            schema: {
                                query: "commodities",
                                label: "commodityDescription",
                                value: "commodityCode"
                            }
                        },
                        {
                            label: "Products",
                            value: "products",
                            schema: {
                                query: "products",
                                label: "productName",
                                value: "productCode"
                            }
                        }
                    ],
                    initialType: "airports"
                },
                isRequired: false,
                name: "masterTypeSelect"
            }
        ]
    }
];

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
            recentFilter={recentFilter}
        />
    </MockedProvider>
);

it("renders without crashing", () => {
    ReactDOM.render(renderMockComponent, container_);
    expect(container_).not.toBeInvalid();
    ReactDOM.unmountComponentAtNode(container_);
});

it("applyFilter - validation", async () => {
    const { container } = render(
        // <MockedProvider addTypename={false} mocks={mockData}>
        <Filter
            filterDataProp={FilterData}
            appliedFiltersProp={appliedFilters}
            CustomPanel={mockCustomPanel}
            listView={listViewTemp}
            savedFilters={saveFilter}
            oneTimeValues={oneTimeValues}
            components={components}
            recentFilter={recentFilter}
        />
        // </MockedProvider>
    );

    const component1 = container.querySelector("[data-testid='addFilter']");
    act(() => {
        component1.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    const component2 = container.querySelector("[data-testid='reset']");
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
    const addfilter = wrapper.getByText("Add Filter");
    act(() => {
        fireEvent.click(addfilter);
    });
    expect(addfilter).not.toBeNull();
    expect(
        wrapper.getByTestId("searchFilterHandler-input")
    ).toBeInTheDocument();
});

it("resetFilter-check", () => {
    const wrapper = render(renderMockComponent);
    const addfilter = wrapper.getByText("Add Filter");
    act(() => {
        fireEvent.click(addfilter);
    });
    expect(addfilter).not.toBeNull();
    const resetfilter = wrapper.getByText("Clear");
    act(() => {
        fireEvent.click(resetfilter);
    });
    expect(wrapper.getByText("Recent Filters")).toBeInTheDocument();
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
    await waitFor(
        () => document.getElementsByClassName("nf-header__tags-list"),
        {
            document
        }
    );
    const component5 = container.querySelector(
        "[class='nf-header__tags-list']"
    );
    expect(component5).toBeInTheDocument();
    act(() => {
        component5.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    expect(
        container.querySelector("[data-testId='searchFilterHandler-input']")
    ).toBeInTheDocument();
}, 50000);

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
    await waitFor(
        () => document.getElementsByClassName("nf-header__tags-list"),
        {
            document
        }
    );
    const component6 = container.querySelector(
        "[class='nf-header__tags-list']"
    );
    expect(component6).toBeInTheDocument();
    act(() => {
        component6.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    expect(
        container.querySelector("[data-testId='searchFilterHandler-input']")
    ).toBeInTheDocument();
}, 50000);

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
}, 50000);
it("change value - Departure Port > Airport Group", async () => {
    const { container } = render(renderMockComponent);

    const component1 = container.querySelector("[data-testId='addFilter']");
    act(() => {
        fireEvent.click(component1);
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
}, 50000);

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
    ).toBeInTheDocument();
    const component8 = container.querySelector("[data-testId='applyFilter']");
    act(() => {
        component8.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
}, 50000);

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
    expect(container.querySelector("[id='fieldWarning']")).toBeInTheDocument();
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
    await waitFor(() => document.getElementsByName("airport"), {
        document
    });
    act(
        () => document.getElementsByName("airport"),
        expect(container.querySelector("[name='airport']")).toBeInTheDocument()
    );
    const component4 = container.querySelector("[data-testId='Flight No']");
    act(() => {
        component4.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    await waitFor(
        () => document.getElementsByName("flightNo.value.carrierCode"),
        {
            document
        }
    );
    expect(
        container.querySelector("[name='flightNo.value.carrierCode']")
    ).toBeInTheDocument();
    const component5 = container.querySelector("[data-testId='AWB Number']");
    act(() => {
        component5.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    await waitFor(
        () => document.getElementsByName("awbNumber.shipmentPrefix"),
        {
            document
        }
    );
    expect(
        container.querySelector("[name='awbNumber.shipmentPrefix']")
    ).toBeInTheDocument();

    const component6 = container.querySelector("[data-testId='Products']");
    act(() => {
        component6.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    await waitFor(() => document.getElementsByName("products"), {
        document
    });
    expect(container.querySelector("[name='products']")).toBeInTheDocument();
    const component7 = container.querySelector("[data-testId='Commodities']");
    act(() => {
        component7.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    await waitFor(() => document.getElementsByName("commodities"), {
        document
    });
    expect(container.querySelector("[name='commodities']")).toBeInTheDocument();
    const component8 = container.querySelector("[data-testId='Master Select']");
    act(() => {
        component8.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    await waitFor(() => document.getElementsByName("masterSelect"), {
        document
    });
    expect(
        container.querySelector("[name='masterSelect']")
    ).toBeInTheDocument();
}, 50000);

it("applyFilter - textField", async () => {
    const { container } = render(renderMockComponent);

    const component1 = container.querySelector("[data-testId='addFilter']");

    act(() => {
        component1.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    const resetButton = container.querySelector("[data-testId='reset']");

    act(() => {
        resetButton.dispatchEvent(new MouseEvent("click", { bubbles: true }));
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
        "[data-testId='Segment Status']"
    );
    await waitFor(() => {
        expect(component5).toBeInTheDocument();
    });
}, 50000);

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
        fireEvent.change(component5, {
            target: { value: "valid" }
        });
    });
    await waitFor(() => {
        expect(component5.value).toBe("valid");
    });
    const component6 = container.querySelector("[data-testId='Master Select']");
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
        expect(getAllByText(/LOB/)[0]).toBeInTheDocument();
    });
    const component8 = container.querySelector("[data-testId='applyFilter']");
    act(() => {
        component8.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    const component9 = container.querySelector(
        "[data-testId='Booking Profile']"
    );
    await waitFor(() => {
        expect(component9).toBeInTheDocument();
    });
    const component10 = container.querySelector("[data-testId='Flight Group']");

    expect(component10).toBeInTheDocument();
    const component11 = container.querySelector(
        "[data-testid='Master Select']"
    );

    expect(component11).toBeInTheDocument();
}, 50000);
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
    const component2 = container.querySelector("[data-testId='Date Range']");
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
    const component5 = container.querySelector(
        "[ data-testId='Booking Profile']"
    );
    act(() => {
        component5.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    await waitFor(() => document.getElementsByName("bookingProfile"), {
        document
    });
    const component7 = container.querySelector("[data-testId='Date Range']");
    component7.dispatchEvent(new MouseEvent("click", { bubbles: true }));

    fireEvent.click(container.querySelector("[name='From Date,check']"));

    fireEvent.click(container.querySelector("[name='To Date,check']"));

    const component9 = container.querySelector("input[name='fromDate.value']");

    fireEvent.focus(component9);
    fireEvent.click(component9);
    fireEvent.change(component9, {
        target: { value: "01092019" }
    });
    const component10 = container.querySelector("[data-testId='applyFilter']");
    fireEvent.click(component10);
}, 50000);

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

    act(() => {
        fireEvent.click(leftIcon);
    });
    act(() => {
        fireEvent.focus(item1);
        fireEvent.keyDown(item1, {
            key: "Enter",
            code: 13
        });
    });
    const chipItem = container.querySelector("[data-testId='Booking Profile']");
    expect(chipItem).toBeInTheDocument();
    const component1 = container.querySelector("[data-testId='addFilter']");
    act(() => {
        component1.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    const component10 = container.querySelector("[data-testId='applyFilter']");
    act(() => {
        component10.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
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
    const chipItem = container.querySelector("[data-testId='Booking Profile']");
    expect(chipItem).toBeInTheDocument();
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
}, 50000);
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
}, 50000);
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
}, 50000);
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
}, 50000);
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
}, 50000);
it("save Filter", () => {
    const { container } = render(renderMockComponent);

    const component1 = container.querySelector("[data-testId='addFilter']");
    act(() => {
        component1.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    const textInput = container.querySelector(
        "[data-testId='registersaveFilterName-input']"
    );
    act(() => {
        fireEvent.change(textInput, { target: { value: "save" } });
    });
    const component2 = container.querySelector("[data-testId='savePopUp']");
    act(() => {
        component2.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    const component3 = container.querySelector(
        "[data-testId='saveFilter-button']"
    );
    act(() => {
        component3.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
});
it("reset Filter", () => {
    const { getByTestId } = render(renderMockComponent);
    const resetFilter = getByTestId("resetFilters");
    fireEvent.click(resetFilter);
});
it("chip button click", () => {
    const { container } = render(renderMockComponent);
    const chipButton = container.getElementsByClassName("nf-header__tags-list");
    for (let i = 0; i < chipButton.length; i++) {
        fireEvent.click(chipButton[i]);
    }
});
it("Apply Filter click", () => {
    const { getByTestId } = render(
        // <MockedProvider addTypename={false} mocks={mockData}>
        <Filter
            filterDataProp={FilterData}
            appliedFiltersProp={appliedFilters}
            CustomPanel={mockCustomPanel}
            listView={listViewTemp}
            savedFilters={saveFilter}
            oneTimeValues={oneTimeValues}
            components={components}
            recentFilter={recentFilter}
        />
        // </MockedProvider>
    );
    const addButton = getByTestId("addFilter");
    fireEvent.click(addButton);
    const applyButton = getByTestId("applyFilter");
    act(() => {
        fireEvent.click(applyButton);
    });
});
it("applyFilter with all fields isRequired false", () => {
    const { getByTestId } = render(
        <MockedProvider addTypename={false} mocks={mockData}>
            <Filter
                filterDataProp={dataTemp}
                appliedFiltersProp={appliedFilters}
                CustomPanel={mockCustomPanel}
                listView={{
                    predefinedFilters: [
                        {
                            name: "Bookings",
                            category: "BK",
                            default: true,
                            filters: {}
                        }
                    ]
                }}
                savedFilters={saveFilter}
                oneTimeValues={oneTimeValues}
                components={components}
                recentFilter={recentFilter}
            />
        </MockedProvider>
    );
    const addButton = getByTestId("addFilter");
    fireEvent.click(addButton);

    fireEvent.click(getByTestId("resetFilters"));
    fireEvent.click(getByTestId("Create Select Terminal:Arrival Terminal"));
    fireEvent.click(getByTestId("ISelect Terminal:Arrival Terminal"));
    fireEvent.click(getByTestId("I Select"));
    const applyButton = getByTestId("applyFilter");
    act(() => {
        fireEvent.click(applyButton);
    });
});
it("individual field for one Time Code initially added to Filter", () => {
    const { getByTestId } = render(
        <MockedProvider addTypename={false} mocks={mockData}>
            <Filter
                filterDataProp={dataTemp}
                appliedFiltersProp={appliedFilters}
                CustomPanel={mockCustomPanel}
                listView={{
                    predefinedFilters: [
                        {
                            name: "Bookings",
                            category: "BK",
                            default: true,
                            filters: {}
                        }
                    ]
                }}
                savedFilters={saveFilter}
                oneTimeValues={oneTimeValues}
                components={components}
                recentFilter={recentFilter}
            />
        </MockedProvider>
    );
    const addButton = getByTestId("addFilter");
    fireEvent.click(addButton);
    fireEvent.click(getByTestId("I Select"));
    const applyButton = getByTestId("applyFilter");
    fireEvent.click(applyButton);
});
it("Saved Filter test case", () => {
    const { getByTestId } = render(
        <MockedProvider addTypename={false} mocks={mockData}>
            <Filter
                filterDataProp={dataTemp}
                appliedFiltersProp={appliedFilters}
                CustomPanel={mockCustomPanel}
                listView={{
                    predefinedFilters: [
                        {
                            name: "Bookings",
                            category: "BK",
                            default: true,
                            filters: {}
                        }
                    ]
                }}
                savedFilters={saveFilter}
                oneTimeValues={oneTimeValues}
                components={components}
                recentFilter={recentFilter}
            />
        </MockedProvider>
    );
    fireEvent.click(getByTestId("handleListFilterCheck"));
    fireEvent.click(getByTestId("Flight above 10000kg capacity"));
    fireEvent.click(getByTestId("addFilter"));
});
it("GroupFilter One Time Values test case", () => {
    const { getByTestId } = render(
        <MockedProvider addTypename={false} mocks={mockData}>
            <Filter
                filterDataProp={FilterData}
                appliedFiltersProp={appliedFilters}
                CustomPanel={mockCustomPanel}
                listView={{
                    predefinedFilters: [
                        {
                            name: "Bookings",
                            category: "BK",
                            default: true,
                            filters: {}
                        }
                    ]
                }}
                savedFilters={saveFilter}
                oneTimeValues={oneTimeValues}
                components={components}
                recentFilter={recentFilter}
            />
        </MockedProvider>
    );
    fireEvent.click(getByTestId("addFilter"));
    fireEvent.click(getByTestId("reset"));
    fireEvent.click(getByTestId("Custom Fields"));
    fireEvent.click(
        Array.from(document.querySelectorAll("div")).find(
            (el) => el.textContent === "Departure Port"
        )
    );
    fireEvent.click(getByTestId("Date Range Port:Departure Port"));
});
it("groupFilter conditionfield disable enabling ", async () => {
    render(renderMockComponent);
    fireEvent.click(screen.getByTestId("addFilter"));
    await waitFor(() => {
        document.querySelector("[name='textField']");
    });
    fireEvent.click(document.querySelector("[name='Text Field,check']"));
    fireEvent.click(document.querySelector("[name='Text Field,check']"));
    expect(
        document.querySelector("[name='Text Field,check']")
    ).toBeInTheDocument();
}, 30000);
