import React from "react";
import Filter from "../src/index";
import FilterData from "./data.json";
import { mockData } from "../__mocks__/graphqlDataMock";
import { MockedProvider } from "@apollo/react-testing";
import CustomPanel from "./panels/CustomPanel";
import "./example.css";

const airport = [
    { key: "AAA", value: "AAA" },
    { key: "AAB", value: "AAB" },
    { key: "ABA", value: "ABA" },
    { key: "ABB", value: "ABB" },
    { key: "BBA", value: "BBA" },
    { key: "BAA", value: "BAA" },
    { key: "BBB", value: "BBB" }
];
const airportGroup = [
    { key: "AAA", value: "AAA" },
    { key: "AAB", value: "AAB" },
    { key: "ABA", value: "ABA" },
    { key: "ABB", value: "ABB" },
    { key: "BBA", value: "BBA" },
    { key: "BAA", value: "BAA" },
    { key: "BBB", value: "BBB" }
];

FilterData.filter.forEach((item) => {
    if (item.types) {
        for (let i in item.types) {
            if (item.types[i].dataSource === "Airport") {
                item.types[i].options = airport;
            } else {
                item.types[i].options = airportGroup;
            }
        }
    }
});

const appliedFilters = (appliedFilter) => {
    console.log("appliedFilter:", appliedFilter);
};

const savedFilters = (savedFilter) => {
    console.log("savedFilter:", savedFilter);
};

export default {
    title: "Fiter Component",
    component: Filter
};

const Template = (args) => (
    <MockedProvider addTypename={false} mocks={mockData}>
        <Filter
            filterData={FilterData}
            appliedFilters={appliedFilters}
            savedFilters={savedFilters}
            customPanel={CustomPanel}
        />
    </MockedProvider>
);

export const MainStory = Template.bind({});
MainStory.args = {};
