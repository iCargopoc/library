import { gql } from "apollo-boost";
import { filterQuery } from "../src/gql/filterQuery";

const getAirportsQuery = gql`
    query getAirports($cursor: ID, $search: String) {
        airports(first: 20, cursor: $cursor, search: $search) {
            edges {
                node {
                    value: airport_code
                    label: airport_name
                    city_code
                    options {
                        value: airport_code
                        label: airport_name
                    }
                }
                cursor
            }
        }
    }
`;

const getSccsQuery = gql`
    query getSccs($cursor: ID, $search: String) {
        sccs(first: 20, cursor: $cursor, search: $search) {
            edges {
                node {
                    label: scc_description
                    value: scc_code
                }
            }
        }
    }
`;

const getCommoditiesQuery = gql`
    query getCommodities($cursor: ID, $search: String) {
        commodities(first: 20, cursor: $cursor, search: $search) {
            edges {
                node {
                    commodityCode
                    commodityDescription
                    sccCode
                }
                cursor
            }
        }
    }
`;

const getFilteredCommoditiesQuery = gql`
    query getCommodities($cursor: ID, $search: [String]) {
        commoditiesFilter(first: 20, cursor: $cursor, search: $search) {
            edges {
                node {
                    commodityCode
                    commodityDescription
                    sccCode
                }
                cursor
            }
        }
    }
`;

const getProductsQuery = gql`
    query getProducts($cursor: ID, $search: String) {
        products(first: 20, cursor: $cursor, search: $search) {
            edges {
                node {
                    productCode
                    productName
                }
                cursor
            }
            pageInfo {
                endCursor
                hasNextPage
            }
        }
    }
`;

const getMastersQuery = (query, label, value) => gql`
        query getMasters($cursor: ID, $search: String) {
            ${query}(first: 20, cursor: $cursor, search: $search) {
                edges {
                    node {
                        value: ${value}
                        label: ${label}
                    }
                }
            }
        }
    `;

const getAgentsQuery = gql`
    query getAgents($cursor: ID, $search: String) {
        listAgents(
            first: 20
            cursor: $cursor
            search: $search
            customerModel: { customer_type: "AG", customer_status: "A" }
        ) {
            edges {
                node {
                    value: customer_code
                    label: customer_name
                }
            }
        }
    }
`;

export const mockData = [
    {
        request: {
            query: filterQuery
        },
        result: {
            data: {
                findFilterConfig: {
                    filterConfigs: [
                        {
                            name: "Delayed Flights",
                            category: "FOA",
                            autoLoadFilters: false,
                            filter: [
                                {
                                    label: "Date",
                                    isSubFilter: false,
                                    isGroupFilter: false,
                                    dataType: "IDatePicker",
                                    isRequired: false,
                                    name: "date",
                                    initialValue: "",
                                    condition: [],
                                    initialValue: ""
                                },
                                {
                                    label: "Toggle Field",
                                    isSubFilter: false,
                                    isGroupFilter: false,
                                    dataType: "IToggle",
                                    isRequired: true,
                                    name: "itoggle",
                                    condition: [],
                                    initialValue: ""
                                },
                                {
                                    label: "Flight No",
                                    isSubFilter: false,
                                    isGroupFilter: false,
                                    dataType: "IFlightNumber",
                                    condition: [
                                        {
                                            label: "equal to",
                                            value: "equal to"
                                        },
                                        {
                                            label: "greater than",
                                            value: "greater than"
                                        },
                                        {
                                            label: "less than",
                                            value: "less than"
                                        }
                                    ],
                                    isRequired: true,
                                    name: "flightNo",
                                    initialValue: ""
                                },
                                {
                                    label: "Flight Status",
                                    isSubFilter: false,
                                    isGroupFilter: false,
                                    dataType: "ITextField",
                                    condition: [
                                        {
                                            label: "equal to",
                                            value: "equal to"
                                        },
                                        {
                                            label: "greater than",
                                            value: "greater than"
                                        },
                                        {
                                            label: "less than",
                                            value: "less than"
                                        }
                                    ],
                                    isRequired: true,
                                    name: "flightStatus",
                                    initialValue: ""
                                },
                                {
                                    label: "Segment Status",
                                    isSubFilter: false,
                                    isGroupFilter: false,
                                    dataType: "ITextField",
                                    condition: [
                                        {
                                            label: "equal to",
                                            value: "equal to"
                                        },
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
                                }
                            ]
                        }
                    ]
                }
            }
        }
    },
    {
        request: {
            query: getAirportsQuery
        },
        result: {
            data: {
                airports: {
                    edges: [
                        {
                            node: {
                                value: "BEY",
                                label: "BEIRUT AIRPORT",
                                city_code: "BEY",
                                options: null
                            },
                            cursor: null
                        },
                        {
                            node: {
                                value: "CDG",
                                label: "R002",
                                city_code: "PAR",
                                options: null
                            },
                            cursor: null
                        },
                        {
                            node: {
                                value: "FRA",
                                label: "FRANKFURT AIRPORT",
                                city_code: "FRA",
                                options: null
                            },
                            cursor: null
                        },
                        {
                            node: {
                                value: "TRV",
                                label: "THIRUVANANTHAPURAM AIRPORT",
                                city_code: "TRV",
                                options: null
                            },
                            cursor: null
                        },
                        {
                            node: {
                                value: "DXB",
                                label: "DUBAI AIRPORT",
                                city_code: "DXB",
                                options: null
                            },
                            cursor: null
                        },
                        {
                            node: {
                                value: "ICN",
                                label: "INCHEON INTERNATIONAL AIRPORT",
                                city_code: "SEL",
                                options: null
                            },
                            cursor: null
                        },
                        {
                            node: {
                                value: "SYD",
                                label: "SYDNEY AIRPORT",
                                city_code: "SYD",
                                options: null
                            },
                            cursor: null
                        },
                        {
                            node: {
                                value: "LHR",
                                label: "HEATHROW AIRPORT",
                                city_code: "LON",
                                options: null
                            },
                            cursor: null
                        },
                        {
                            node: {
                                value: "AAA",
                                label: "ANAA AIRPORT",
                                city_code: "AAA",
                                options: null
                            },
                            cursor: null
                        },
                        {
                            node: {
                                value: "DEL",
                                label: "DELHI AIRPORT",
                                city_code: "DEL",
                                options: null
                            },
                            cursor: null
                        },
                        {
                            node: {
                                value: "AAE",
                                label: "ANNABA AIRPORT",
                                city_code: "AAE",
                                options: null
                            },
                            cursor: null
                        },
                        {
                            node: {
                                value: "LIY",
                                label: "HINESVILLE AIRPORT",
                                city_code: "LIY",
                                options: null
                            },
                            cursor: null
                        },
                        {
                            node: {
                                value: "BJO",
                                label: "BERMEJO AIRPORT",
                                city_code: "BJO",
                                options: null
                            },
                            cursor: null
                        },
                        {
                            node: {
                                value: "LTK",
                                label: "LATAKIA AIRPORT",
                                city_code: "LTK",
                                options: null
                            },
                            cursor: null
                        },
                        {
                            node: {
                                value: "AIZ",
                                label: "KAISER/LAKE OZARK AIRPORT",
                                city_code: "AIZ",
                                options: null
                            },
                            cursor: null
                        },
                        {
                            node: {
                                value: "KDO",
                                label: "KADHDHOO ISLAND AIRPORT",
                                city_code: "KDO",
                                options: null
                            },
                            cursor: null
                        },
                        {
                            node: {
                                value: "YCZ",
                                label: "FAIRMOUNT HOT SPRINGS AIRPORT",
                                city_code: "YCZ",
                                options: null
                            },
                            cursor: null
                        },
                        {
                            node: {
                                value: "KLP",
                                label: "KELP BAY AIRPORT",
                                city_code: "KLP",
                                options: null
                            },
                            cursor: null
                        },
                        {
                            node: {
                                value: "TAH",
                                label: "TANNA ISLAND AIRPORT",
                                city_code: "TAH",
                                options: null
                            },
                            cursor: null
                        },
                        {
                            node: {
                                value: "SVE",
                                label: "SUSANVILLE AIRPORT",
                                city_code: "SVE",
                                options: null
                            },
                            cursor: null
                        }
                    ]
                }
            }
        }
    },
    {
        request: {
            query: getAirportsQuery,
            variables: { search: "x" }
        },
        result: {
            data: {
                airports: {
                    edges: [
                        {
                            node: {
                                value: "MXZ",
                                label: "MEIXIAN AIRPORT",
                                city_code: "MXZ",
                                options: null
                            },
                            cursor: null
                        },
                        {
                            node: {
                                value: "FXM",
                                label: "FLAXMAN ISLAND AIRPORT",
                                city_code: "FXM",
                                options: null
                            },
                            cursor: null
                        },
                        {
                            node: {
                                value: "WUX",
                                label: "WUXI AIRPORT",
                                city_code: "WUX",
                                options: null
                            },
                            cursor: null
                        },
                        {
                            node: {
                                value: "TGZ",
                                label: "TUXTLA GUTIERREZ AIRPORT",
                                city_code: "TGZ",
                                options: null
                            },
                            cursor: null
                        },
                        {
                            node: {
                                value: "XIN",
                                label: "XINGNING AIRPORT",
                                city_code: "XIN",
                                options: null
                            },
                            cursor: null
                        },
                        {
                            node: {
                                value: "DVT",
                                label: "PHOENIX-DEER VALLEY AIRPORT",
                                city_code: "PHX",
                                options: null
                            },
                            cursor: null
                        },
                        {
                            node: {
                                value: "YHZ",
                                label: "HALIFAX AIRPORT",
                                city_code: "YHZ",
                                options: null
                            },
                            cursor: null
                        },
                        {
                            node: {
                                value: "GGT",
                                label: "EXUMA INTERNATIONAL AIRPORT",
                                city_code: "GGT",
                                options: null
                            },
                            cursor: null
                        },
                        {
                            node: {
                                value: "XIE",
                                label: "XIENGLOM AIRPORT",
                                city_code: "XIE",
                                options: null
                            },
                            cursor: null
                        },
                        {
                            node: {
                                value: "IZT",
                                label: "IXTEPEC AIRPORT",
                                city_code: "IZT",
                                options: null
                            },
                            cursor: null
                        },
                        {
                            node: {
                                value: "OAX",
                                label: "OAXACA AIRPORT",
                                city_code: "OAX",
                                options: null
                            },
                            cursor: null
                        },
                        {
                            node: {
                                value: "XIL",
                                label: "XILINHOT AIRPORT",
                                city_code: "XIL",
                                options: null
                            },
                            cursor: null
                        },
                        {
                            node: {
                                value: "BFB",
                                label: "BLUE FOX BAY AIRPORT",
                                city_code: "BFB",
                                options: null
                            },
                            cursor: null
                        },
                        {
                            node: {
                                value: "RKZ",
                                label: "XIGAZE/RIKAZE AIRPORT",
                                city_code: "RKZ",
                                options: null
                            },
                            cursor: null
                        },
                        {
                            node: {
                                value: "BXC",
                                label: "BOXBOROUGH AIRPORT",
                                city_code: "BXC",
                                options: null
                            },
                            cursor: null
                        },
                        {
                            node: {
                                value: "GXH",
                                label: "XIAHE AIRPORT",
                                city_code: "GXH",
                                options: null
                            },
                            cursor: null
                        },
                        {
                            node: {
                                value: "HAX",
                                label: "HATBOX FIELD AIRPORT",
                                city_code: "MKO",
                                options: null
                            },
                            cursor: null
                        },
                        {
                            node: {
                                value: "DXD",
                                label: "DIXIE AIRPORT",
                                city_code: "DXD",
                                options: null
                            },
                            cursor: null
                        },
                        {
                            node: {
                                value: "CHR",
                                label: "CHATEAUROUX AIRPORT",
                                city_code: "CHR",
                                options: null
                            },
                            cursor: null
                        },
                        {
                            node: {
                                value: "XEN",
                                label: "XINGCHENG AIRPORT",
                                city_code: "XEN",
                                options: null
                            },
                            cursor: null
                        }
                    ]
                }
            }
        }
    },
    {
        request: {
            query: getAirportsQuery,
            variables: { search: "ee" }
        },
        result: {
            data: {
                airports: {
                    edges: []
                }
            }
        }
    },
    {
        request: {
            query: getAirportsQuery
        },
        result: {}
    },
    {
        request: {
            query: getAirportsQuery,
            variables: { search: "fra" }
        },
        result: {
            data: {
                airports: {
                    edges: [
                        {
                            node: {
                                value: "FRA",
                                label: "FRANKFURT AIRPORT",
                                city_code: "FRA",
                                options: null
                            },
                            cursor: null
                        },
                        {
                            node: {
                                value: null,
                                label: null,
                                city_code: "FRA",
                                options: [
                                    {
                                        value: "HHN",
                                        label: "HAHN AIRPORT"
                                    },
                                    {
                                        value: "FRF",
                                        label: "FRANKFURT RHEIN MAIN"
                                    }
                                ]
                            },
                            cursor: null
                        },
                        {
                            node: {
                                value: "SFC",
                                label: "ST-FRANCOIS AIRPORT",
                                city_code: "SFC",
                                options: null
                            },
                            cursor: null
                        },
                        {
                            node: {
                                value: "YAG",
                                label: "FORT FRANCES AIRPORT",
                                city_code: "YAG",
                                options: null
                            },
                            cursor: null
                        },
                        {
                            node: {
                                value: "FRW",
                                label: "FRANCISTOWN AIRPORT",
                                city_code: "FRW",
                                options: null
                            },
                            cursor: null
                        },
                        {
                            node: {
                                value: "AKF",
                                label: "KUFRA AIRPORT",
                                city_code: "AKF",
                                options: null
                            },
                            cursor: null
                        },
                        {
                            node: {
                                value: "MVB",
                                label: "FRANCEVILLE AIRPORT",
                                city_code: "MVB",
                                options: null
                            },
                            cursor: null
                        },
                        {
                            node: {
                                value: "WHO",
                                label: "FRANZ JOSEF GLACIER AIRPORT",
                                city_code: "WHO",
                                options: null
                            },
                            cursor: null
                        },
                        {
                            node: {
                                value: "FKL",
                                label: "FRANKLIN AIRPORT",
                                city_code: "FKL",
                                options: null
                            },
                            cursor: null
                        },
                        {
                            node: {
                                value: "IFO",
                                label: "IVANO-FRANKIVSK AIRPORT",
                                city_code: "IFO",
                                options: null
                            },
                            cursor: null
                        },
                        {
                            node: {
                                value: "FFT",
                                label: "FRANKFORT AIRPORT",
                                city_code: "FFT",
                                options: null
                            },
                            cursor: null
                        },
                        {
                            node: {
                                value: "MDR",
                                label: "MEDFRA AIRPORT",
                                city_code: "MDR",
                                options: null
                            },
                            cursor: null
                        },
                        {
                            node: {
                                value: "SFO",
                                label: "SAN FRANCISCO AIRPORT",
                                city_code: "SFO",
                                options: null
                            },
                            cursor: null
                        },
                        {
                            node: {
                                value: "OMF",
                                label: "MAFRAQ AIRPORT",
                                city_code: "OMF",
                                options: null
                            },
                            cursor: null
                        },
                        {
                            node: {
                                value: "FBE",
                                label: "FRANCISCO BELTRAO AIRPORT",
                                city_code: "FBE",
                                options: null
                            },
                            cursor: null
                        },
                        {
                            node: {
                                value: "OKB",
                                label: "FRASER ISLAND AIRPORT",
                                city_code: "OKB",
                                options: null
                            },
                            cursor: null
                        },
                        {
                            node: {
                                value: "FRC",
                                label: "FRANCA AIRPORT",
                                city_code: "FRC",
                                options: null
                            },
                            cursor: null
                        },
                        {
                            node: {
                                value: "DHF",
                                label: "AL DHAFRA AB AIRPORT",
                                city_code: "AUH",
                                options: null
                            },
                            cursor: null
                        },
                        {
                            node: {
                                value: "FDF",
                                label: "FORT-DE-FRANCE AIRPORT",
                                city_code: "FDF",
                                options: null
                            },
                            cursor: null
                        }
                    ]
                }
            }
        }
    },
    ,
    {
        request: {
            query: getMastersQuery(
                "commodities",
                "commodityDescription",
                "commodityCode"
            )
        },
        result: {
            data: {
                commodities: {
                    edges: [
                        {
                            node: {
                                value: "FLW",
                                label: "FLOWERS"
                            },
                            cursor: null
                        },
                        {
                            node: {
                                value: "GEN",
                                label: "GENERAL CARGO"
                            },
                            cursor: null
                        },
                        {
                            node: {
                                value: "LTF",
                                label: "LIVE TROPICAL FISH"
                            },
                            cursor: null
                        },
                        {
                            node: {
                                value: "LOB",
                                label: "LOBSTERS"
                            },
                            cursor: null
                        },
                        {
                            node: {
                                value: "PIG",
                                label: "PORK"
                            },
                            cursor: null
                        },
                        {
                            node: {
                                value: "TUNA",
                                label: "TUNA"
                            },
                            cursor: null
                        },
                        {
                            node: {
                                value: "VAL",
                                label: "VALUABLE GOODS"
                            },
                            cursor: null
                        },
                        {
                            node: {
                                value: "PER",
                                label: "PERISHABLES"
                            },
                            cursor: null
                        },
                        {
                            node: {
                                value: "AVI",
                                label: "LIVE ANIMALS"
                            },
                            cursor: null
                        },
                        {
                            node: {
                                value: "HUM",
                                label: "HUMAN REMAINS"
                            },
                            cursor: null
                        },
                        {
                            node: {
                                value: "ATT",
                                label: "FAC"
                            },
                            cursor: null
                        },
                        {
                            node: {
                                value: "ICE",
                                label: "DRY ICE"
                            },
                            cursor: null
                        },
                        {
                            node: {
                                value: "VUL",
                                label: "VUNERABLE"
                            },
                            cursor: null
                        },
                        {
                            node: {
                                value: "HEA",
                                label: "HEAVY"
                            },
                            cursor: null
                        },
                        {
                            node: {
                                value: "AOG",
                                label: "AOG SPARES"
                            },
                            cursor: null
                        },
                        {
                            node: {
                                value: "PES",
                                label: "SEA FOOD"
                            },
                            cursor: null
                        },
                        {
                            node: {
                                value: "PEF",
                                label: "FLOWERS"
                            },
                            cursor: null
                        },
                        {
                            node: {
                                value: "PEM",
                                label: "MEAT"
                            },
                            cursor: null
                        },
                        {
                            node: {
                                value: "HEG",
                                label: "HATCHING EGGS",
                                sccCode: "HEG"
                            },
                            cursor: null
                        },
                        {
                            node: {
                                value: "DGR",
                                label: "DANGEROUS GOODS",
                                sccCode: "DGR"
                            },
                            cursor: null
                        }
                    ]
                }
            }
        }
    },
    {
        request: {
            query: getMastersQuery(
                "commodities",
                "commodityDescription",
                "commodityCode"
            ),
            variables: { search: "tr" }
        },
        result: {
            data: {
                commodities: {
                    edges: [
                        {
                            node: {
                                value: "LTF",
                                label: "LIVE TROPICAL FISH"
                            }
                        },
                        {
                            node: {
                                value: "LTFIS",
                                label: "LIVE TROPICAL FISH"
                            }
                        },
                        {
                            node: {
                                value: "COMPTR",
                                label: "COMPUTER"
                            }
                        },
                        {
                            node: {
                                value: "MSCIST",
                                label: "MUSIC INSTRUMENT"
                            }
                        },
                        {
                            node: {
                                value: "TROFIS",
                                label: "TROPICAL FISH"
                            }
                        },
                        {
                            node: {
                                value: "ELCEQP",
                                label: "ELECTRICAL EQUIPMENT"
                            }
                        },
                        {
                            node: {
                                value: "CRTMAT",
                                label: "CONSTRUCTION MATERIALS"
                            }
                        },
                        {
                            node: {
                                value: "EEQ",
                                label: "ELECTRONIC EQUIPMENT"
                            }
                        },
                        {
                            node: {
                                value: "STRWB",
                                label: "STRAWBERRIES"
                            }
                        },
                        {
                            node: {
                                value: "POU",
                                label: "POULTRY"
                            }
                        },
                        {
                            node: {
                                value: "SUB",
                                label: "SUBTROPICALS"
                            }
                        },
                        {
                            node: {
                                value: "PAS",
                                label: "PASTRY"
                            }
                        },
                        {
                            node: {
                                value: "CIT",
                                label: "CITRUS"
                            }
                        }
                    ]
                }
            }
        }
    },
    {
        request: {
            query: getMastersQuery(
                "commodities",
                "commodityDescription",
                "commodityCode"
            ),
            variables: { search: "qwerty" }
        },
        result: {
            data: {
                commodities: {
                    edges: []
                }
            }
        }
    },
    {
        request: {
            query: getMastersQuery("products", "productName", "productCode")
        },
        result: {
            data: {
                products: {
                    edges: [
                        {
                            node: {
                                value: "PHRM",
                                label: "Pharmaceutical Logistics"
                            }
                        },
                        {
                            node: {
                                value: "TEMP",
                                label: "TempCheck"
                            }
                        },
                        {
                            node: {
                                value: "CARX",
                                label: "CargoExtra"
                            }
                        },
                        {
                            node: {
                                value: "OIL",
                                label: "Oil and Gas"
                            }
                        },
                        {
                            node: {
                                value: "AUTO",
                                label: "Automative Product"
                            }
                        },
                        {
                            node: {
                                value: "DGR",
                                label: "Dangerous Goods"
                            }
                        },
                        {
                            node: {
                                value: "LIVE",
                                label: "Live Animals"
                            }
                        },
                        {
                            node: {
                                value: "EXPR",
                                label: "Express Product"
                            }
                        },
                        {
                            node: {
                                value: "GENC",
                                label: "GENERAL CARGO"
                            }
                        },
                        {
                            node: {
                                value: "REG",
                                label: "Regular"
                            }
                        }
                    ]
                }
            }
        }
    },
    {
        request: {
            query: getMastersQuery("airports", "airport_name", "airport_code")
        },
        result: {
            data: {
                airports: {
                    edges: [
                        {
                            node: {
                                value: "BEY",
                                label: "BEIRUT AIRPORT"
                            }
                        },
                        {
                            node: {
                                value: "CDG",
                                label: "R002"
                            }
                        },
                        {
                            node: {
                                value: "FRA",
                                label: "FRANKFURT AIRPORT"
                            }
                        },
                        {
                            node: {
                                value: "TRV",
                                label: "THIRUVANANTHAPURAM AIRPORT"
                            }
                        },
                        {
                            node: {
                                value: "DXB",
                                label: "DUBAI AIRPORT"
                            }
                        },
                        {
                            node: {
                                value: "ICN",
                                label: "INCHEON INTERNATIONAL AIRPORT"
                            }
                        },
                        {
                            node: {
                                value: "SYD",
                                label: "SYDNEY AIRPORT"
                            }
                        },
                        {
                            node: {
                                value: "LHR",
                                label: "HEATHROW AIRPORT"
                            }
                        },
                        {
                            node: {
                                value: "AAA",
                                label: "ANAA AIRPORT"
                            }
                        },
                        {
                            node: {
                                value: "DEL",
                                label: "DELHI AIRPORT"
                            }
                        },
                        {
                            node: {
                                value: "AAE",
                                label: "ANNABA AIRPORT"
                            }
                        },
                        {
                            node: {
                                value: "LIY",
                                label: "HINESVILLE AIRPORT"
                            }
                        },
                        {
                            node: {
                                value: "BJO",
                                label: "BERMEJO AIRPORT"
                            }
                        },
                        {
                            node: {
                                value: "LTK",
                                label: "LATAKIA AIRPORT"
                            }
                        },
                        {
                            node: {
                                value: "AIZ",
                                label: "KAISER/LAKE OZARK AIRPORT"
                            }
                        },
                        {
                            node: {
                                value: "KDO",
                                label: "KADHDHOO ISLAND AIRPORT"
                            }
                        },
                        {
                            node: {
                                value: "YCZ",
                                label: "FAIRMOUNT HOT SPRINGS AIRPORT"
                            }
                        },
                        {
                            node: {
                                value: "KLP",
                                label: "KELP BAY AIRPORT"
                            }
                        },
                        {
                            node: {
                                value: "TAH",
                                label: "TANNA ISLAND AIRPORT"
                            }
                        },
                        {
                            node: {
                                value: "SVE",
                                label: "SUSANVILLE AIRPORT"
                            }
                        }
                    ]
                }
            }
        }
    },
    {
        request: {
            query: getMastersQuery("airports", "airport_name", "airport_code"),
            variables: { search: "x" }
        },
        result: {
            data: {
                airports: {
                    edges: [
                        {
                            node: {
                                value: "MXZ",
                                label: "MEIXIAN AIRPORT"
                            }
                        },
                        {
                            node: {
                                value: "FXM",
                                label: "FLAXMAN ISLAND AIRPORT"
                            }
                        },
                        {
                            node: {
                                value: "WUX",
                                label: "WUXI AIRPORT"
                            }
                        },
                        {
                            node: {
                                value: "TGZ",
                                label: "TUXTLA GUTIERREZ AIRPORT"
                            }
                        },
                        {
                            node: {
                                value: "XIN",
                                label: "XINGNING AIRPORT"
                            }
                        },
                        {
                            node: {
                                value: "DVT",
                                label: "PHOENIX-DEER VALLEY AIRPORT"
                            }
                        },
                        {
                            node: {
                                value: "YHZ",
                                label: "HALIFAX AIRPORT"
                            }
                        },
                        {
                            node: {
                                value: "GGT",
                                label: "EXUMA INTERNATIONAL AIRPORT"
                            }
                        },
                        {
                            node: {
                                value: "XIE",
                                label: "XIENGLOM AIRPORT"
                            }
                        },
                        {
                            node: {
                                value: "IZT",
                                label: "IXTEPEC AIRPORT"
                            }
                        },
                        {
                            node: {
                                value: "OAX",
                                label: "OAXACA AIRPORT"
                            }
                        },
                        {
                            node: {
                                value: "XIL",
                                label: "XILINHOT AIRPORT"
                            }
                        },
                        {
                            node: {
                                value: "BFB",
                                label: "BLUE FOX BAY AIRPORT"
                            }
                        },
                        {
                            node: {
                                value: "RKZ",
                                label: "XIGAZE/RIKAZE AIRPORT"
                            }
                        },
                        {
                            node: {
                                value: "BXC",
                                label: "BOXBOROUGH AIRPORT"
                            }
                        },
                        {
                            node: {
                                value: "GXH",
                                label: "XIAHE AIRPORT"
                            }
                        },
                        {
                            node: {
                                value: "HAX",
                                label: "HATBOX FIELD AIRPORT"
                            }
                        },
                        {
                            node: {
                                value: "DXD",
                                label: "DIXIE AIRPORT"
                            }
                        },
                        {
                            node: {
                                value: "CHR",
                                label: "CHATEAUROUX AIRPORT"
                            }
                        },
                        {
                            node: {
                                value: "XEN",
                                label: "XINGCHENG AIRPORT"
                            }
                        }
                    ]
                }
            }
        }
    },
    {
        request: {
            query: getProductsQuery
        },
        result: {
            data: {
                products: {
                    edges: [
                        {
                            node: {
                                productCode: "123",
                                productName: "Express"
                            },
                            cursor: "c7d50241-9411-4e02-8ad1-80d63e11b306"
                        },
                        {
                            node: {
                                productCode: "456",
                                productName: "Sea"
                            },
                            cursor: "94ae6a39-0459-42ca-8e7d-389472532277"
                        }
                    ],
                    pageInfo: {
                        endCursor: "94ae6a39-0459-42ca-8e7d-389472532277",
                        hasNextPage: false
                    }
                }
            }
        }
    },
    {
        request: {
            query: getProductsQuery,
            variables: { search: "a" }
        },
        result: {
            data: {
                products: {
                    edges: [
                        {
                            node: {
                                productCode: "456",
                                productName: "Sea"
                            },
                            cursor: "94ae6a39-0459-42ca-8e7d-389472532277"
                        }
                    ],
                    pageInfo: {
                        endCursor: "94ae6a39-0459-42ca-8e7d-389472532277",
                        hasNextPage: false
                    }
                }
            }
        }
    },
    {
        request: {
            query: getProductsQuery,
            variables: { search: "ee" }
        },
        result: {
            data: {
                products: {
                    edges: []
                }
            }
        }
    },
    {
        request: {
            query: getCommoditiesQuery
        },
        result: {
            data: {
                commodities: {
                    edges: [
                        {
                            node: {
                                commodityCode: "FLW",
                                commodityDescription: "FLOWERS",
                                sccCode: "PEF"
                            },
                            cursor: null
                        },
                        {
                            node: {
                                commodityCode: "GEN",
                                commodityDescription: "GENERAL CARGO",
                                sccCode: "GEN"
                            },
                            cursor: null
                        },
                        {
                            node: {
                                commodityCode: "LTF",
                                commodityDescription: "LIVE TROPICAL FISH",
                                sccCode: "AVI"
                            },
                            cursor: null
                        },
                        {
                            node: {
                                commodityCode: "LOB",
                                commodityDescription: "LOBSTERS",
                                sccCode: "PES"
                            },
                            cursor: null
                        },
                        {
                            node: {
                                commodityCode: "PIG",
                                commodityDescription: "PORK",
                                sccCode: "PEM"
                            },
                            cursor: null
                        },
                        {
                            node: {
                                commodityCode: "TUNA",
                                commodityDescription: "TUNA",
                                sccCode: "PES"
                            },
                            cursor: null
                        },
                        {
                            node: {
                                commodityCode: "VAL",
                                commodityDescription: "VALUABLE GOODS",
                                sccCode: "VAL"
                            },
                            cursor: null
                        },
                        {
                            node: {
                                commodityCode: "PER",
                                commodityDescription: "PERISHABLES",
                                sccCode: "PER"
                            },
                            cursor: null
                        },
                        {
                            node: {
                                commodityCode: "AVI",
                                commodityDescription: "LIVE ANIMALS",
                                sccCode: "AVI"
                            },
                            cursor: null
                        },
                        {
                            node: {
                                commodityCode: "HUM",
                                commodityDescription: "HUMAN REMAINS",
                                sccCode: "HUM"
                            },
                            cursor: null
                        },
                        {
                            node: {
                                commodityCode: "ATT",
                                commodityDescription: "FAC",
                                sccCode: "ATT"
                            },
                            cursor: null
                        },
                        {
                            node: {
                                commodityCode: "ICE",
                                commodityDescription: "DRY ICE",
                                sccCode: "ICE"
                            },
                            cursor: null
                        },
                        {
                            node: {
                                commodityCode: "VUL",
                                commodityDescription: "VUNERABLE",
                                sccCode: "VUN"
                            },
                            cursor: null
                        },
                        {
                            node: {
                                commodityCode: "HEA",
                                commodityDescription: "HEAVY",
                                sccCode: "HEA"
                            },
                            cursor: null
                        },
                        {
                            node: {
                                commodityCode: "AOG",
                                commodityDescription: "AOG SPARES",
                                sccCode: "AOG"
                            },
                            cursor: null
                        },
                        {
                            node: {
                                commodityCode: "PES",
                                commodityDescription: "SEA FOOD",
                                sccCode: "PES"
                            },
                            cursor: null
                        },
                        {
                            node: {
                                commodityCode: "PEF",
                                commodityDescription: "FLOWERS",
                                sccCode: "PEF"
                            },
                            cursor: null
                        },
                        {
                            node: {
                                commodityCode: "PEM",
                                commodityDescription: "MEAT",
                                sccCode: "PEM"
                            },
                            cursor: null
                        },
                        {
                            node: {
                                commodityCode: "HEG",
                                commodityDescription: "HATCHING EGGS",
                                sccCode: "HEG"
                            },
                            cursor: null
                        },
                        {
                            node: {
                                commodityCode: "DGR",
                                commodityDescription: "DANGEROUS GOODS",
                                sccCode: "DGR"
                            },
                            cursor: null
                        }
                    ]
                }
            }
        }
    },
    {
        request: {
            query: getCommoditiesQuery,
            variables: { search: "wer" }
        },
        result: {
            data: {
                commodities: {
                    edges: [
                        {
                            node: {
                                commodityCode: "FLW",
                                commodityDescription: "FLOWERS",
                                sccCode: "PEF"
                            },
                            cursor: null
                        },
                        {
                            node: {
                                commodityCode: "PEF",
                                commodityDescription: "FLOWERS",
                                sccCode: "PEF"
                            },
                            cursor: null
                        },
                        {
                            node: {
                                commodityCode: "BUL",
                                commodityDescription: "FLOWER BULBS",
                                sccCode: "PER"
                            },
                            cursor: null
                        },
                        {
                            node: {
                                commodityCode: "FRSFLW",
                                commodityDescription: "FRESH CUT FLOWERS",
                                sccCode: "PEF"
                            },
                            cursor: null
                        },
                        {
                            node: {
                                commodityCode: "TUB",
                                commodityDescription: "FLOWER TUBERS",
                                sccCode: "GEN"
                            },
                            cursor: null
                        }
                    ]
                }
            }
        }
    },
    {
        request: {
            query: getCommoditiesQuery,
            variables: { search: "jj" }
        },
        result: {
            data: {
                commodities: {
                    edges: []
                }
            }
        }
    },
    {
        request: {
            query: getFilteredCommoditiesQuery,
            variables: { search: ["FLW", "GEN", "TUNA"] }
        },
        result: {
            data: {
                commoditiesFilter: {
                    edges: [
                        {
                            node: {
                                commodityCode: "FLW",
                                commodityDescription: "FLOWERS",
                                sccCode: "PEF"
                            },
                            cursor: null
                        },
                        {
                            node: {
                                commodityCode: "GEN",
                                commodityDescription: "GENERAL CARGO",
                                sccCode: "GEN"
                            },
                            cursor: null
                        },
                        {
                            node: {
                                commodityCode: "TUNA",
                                commodityDescription: "TUNA",
                                sccCode: "PES"
                            },
                            cursor: null
                        }
                    ]
                }
            }
        }
    },
    {
        request: {
            query: getAgentsQuery
        },
        result: {
            data: {
                listAgents: {
                    edges: [
                        {
                            node: {
                                value: "TESTAGENT",
                                label: "TESTAGENT"
                            }
                        },
                        {
                            node: {
                                value: "AMPAR00001",
                                label: "TEST"
                            }
                        },
                        {
                            node: {
                                value: "CCLHR",
                                label: "CCLHR"
                            }
                        },
                        {
                            node: {
                                value: "INPAR00001",
                                label: "TEST"
                            }
                        },
                        {
                            node: {
                                value: "TEST",
                                label: "TEST"
                            }
                        },
                        {
                            node: {
                                value: "AIEDXB",
                                label: "AIR EXPRESS INTERNATIONAL"
                            }
                        },
                        {
                            node: {
                                value: "DHLCDG001",
                                label: "DHL WORLDWIDE INTERNATIONAL"
                            }
                        },
                        {
                            node: {
                                value: "125463",
                                label: "DHL WORLDWIDE INTERNATIONAL"
                            }
                        },
                        {
                            node: {
                                value: "12995468",
                                label: "DHL WORLDWIDE INTERNATIONAL"
                            }
                        },
                        {
                            node: {
                                value: "USDFW000013",
                                label: "DHL WORLDWIDE INTERNATIONAL"
                            }
                        },
                        {
                            node: {
                                value: "INDFW000005",
                                label: "DHL WORLDWIDE INTERNATIONAL"
                            }
                        },
                        {
                            node: {
                                value: "INDFW000006",
                                label: "DHL WORLDWIDE INTERNATIONAL"
                            }
                        },
                        {
                            node: {
                                value: "INDFW000007",
                                label: "DHL WORLDWIDE INTERNATIONAL"
                            }
                        },
                        {
                            node: {
                                value: "INDFW000008",
                                label: "DHL WORLDWIDE INTERNATIONAL"
                            }
                        },
                        {
                            node: {
                                value: "INDFW000009",
                                label: "DHL WORLDWIDE INTERNATIONAL"
                            }
                        },
                        {
                            node: {
                                value: "INDFW000010",
                                label: "DHL WORLDWIDE INTERNATIONAL"
                            }
                        },
                        {
                            node: {
                                value: "INDFW000019",
                                label: "DHL WORLDWIDE INTERNATIONAL"
                            }
                        },
                        {
                            node: {
                                value: "USDFW000020",
                                label: "DHL WORLDWIDE INTERNATIONAL"
                            }
                        },
                        {
                            node: {
                                value: "USDFW000010",
                                label: "DHL WORLDWIDE INTERNATIONAL"
                            }
                        },
                        {
                            node: {
                                value: "USDFW000011",
                                label: "DHL WORLDWIDE INTERNATIONAL"
                            }
                        }
                    ]
                }
            }
        }
    },
    {
        request: {
            query: getAgentsQuery,
            variables: { search: "ag" }
        },
        result: {
            data: {
                listAgents: {
                    edges: [
                        {
                            node: {
                                value: "TESTAGENT",
                                label: "TESTAGENT"
                            }
                        },
                        {
                            node: {
                                value: "BEYAGENT2",
                                label: "AGENT 2"
                            }
                        },
                        {
                            node: {
                                value: "LONCUST",
                                label: "LONDON AGENT"
                            }
                        },
                        {
                            node: {
                                value: "MEAAGT",
                                label: "MEAAGT"
                            }
                        },
                        {
                            node: {
                                value: "UCBAGENT",
                                label: "COURIER AGENT"
                            }
                        }
                    ]
                }
            }
        }
    },
    {
        request: {
            query: getAgentsQuery,
            variables: { search: "jj" }
        },
        result: {
            data: {
                listAgents: {
                    edges: []
                }
            }
        }
    },
    {
        request: {
            query: getSccsQuery
        },
        result: {
            data: {
                sccs: {
                    edges: [
                        {
                            node: {
                                label: "AAA",
                                value: "AAA"
                            }
                        },
                        {
                            node: {
                                label: "AAE CARGO",
                                value: "AAE"
                            }
                        },
                        {
                            node: {
                                label: "ABC",
                                value: "ABC"
                            }
                        },
                        {
                            node: {
                                label: "ACA",
                                value: "ACA"
                            }
                        },
                        {
                            node: {
                                label: "PRIO",
                                value: "ACE"
                            }
                        },
                        {
                            node: {
                                label: "ACTIVE TEMPERATURE CONTROL",
                                value: "ACT"
                            }
                        },
                        {
                            node: {
                                label: "CFX USE ADELANCE",
                                value: "ADL"
                            }
                        },
                        {
                            node: {
                                label: "ADPSP",
                                value: "ADP"
                            }
                        },
                        {
                            node: {
                                label: "AIR MAIL",
                                value: "AIR"
                            }
                        },
                        {
                            node: {
                                label: "CFX USE AISHIN",
                                value: "AIS"
                            }
                        },
                        {
                            node: {
                                label: "AJV",
                                value: "AJV"
                            }
                        },
                        {
                            node: {
                                label: "ALLEX CARGO",
                                value: "ALX"
                            }
                        },
                        {
                            node: {
                                label: "AMT",
                                value: "AMT"
                            }
                        },
                        {
                            node: {
                                label: "ANA",
                                value: "ANA"
                            }
                        },
                        {
                            node: {
                                label: "ANS",
                                value: "ANS"
                            }
                        },
                        {
                            node: {
                                label: "AIRCRAFT ON GROUND",
                                value: "AOG"
                            }
                        },
                        {
                            node: {
                                label: "AOR ALT CGO",
                                value: "AOR"
                            }
                        },
                        {
                            node: {
                                label: "ARM",
                                value: "ARM"
                            }
                        },
                        {
                            node: {
                                label: "PRIO ART",
                                value: "ART"
                            }
                        },
                        {
                            node: {
                                label: "ATA",
                                value: "ATA"
                            }
                        }
                    ]
                }
            }
        }
    },
    {
        request: {
            query: getSccsQuery,
            variables: { search: "as" }
        },
        result: {
            data: {
                sccs: {
                    edges: [
                        {
                            node: {
                                label: "CFX USE ASTELLAS",
                                value: "FJS"
                            }
                        },
                        {
                            node: {
                                label: "PAFPAYAS",
                                value: "FPA"
                            }
                        },
                        {
                            node: {
                                label: "CFX USE HAYADASHI",
                                value: "HHH"
                            }
                        },
                        {
                            node: {
                                label: "CFX USE IHARASUISAN",
                                value: "IHA"
                            }
                        },
                        {
                            node: {
                                label: "LAST PART OF BALANCE",
                                value: "LPS"
                            }
                        },
                        {
                            node: {
                                label: "BY PASS SHIPMENT",
                                value: "PAS"
                            }
                        },
                        {
                            node: {
                                label: "DANGEROUS GOODS FLAMMABLE GAS",
                                value: "RFG"
                            }
                        },
                        {
                            node: {
                                label:
                                    "DANGEROUS GOODS NON FLAMMABLE NON TOXIC GAS",
                                value: "RNG"
                            }
                        },
                        {
                            node: {
                                label: "DANGEROUS GOODS TOXIC GAS",
                                value: "RPG"
                            }
                        },
                        {
                            node: {
                                label: "CFX USE SOUTHERN FLASH",
                                value: "SFL"
                            }
                        },
                        {
                            node: {
                                label: "CFX USE TAS",
                                value: "TDS"
                            }
                        },
                        {
                            node: {
                                label: "TEXAS INSTRUMENT",
                                value: "TEX"
                            }
                        },
                        {
                            node: {
                                label: "ASPARAGUS",
                                value: "VAS"
                            }
                        },
                        {
                            node: {
                                label: "WEAPONS ANS AMMUNITION",
                                value: "WAS"
                            }
                        }
                    ]
                }
            }
        }
    },
    {
        request: {
            query: getSccsQuery,
            variables: { search: "jj" }
        },
        result: {
            data: {
                sccs: {
                    edges: []
                }
            }
        }
    }
];
