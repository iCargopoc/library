import { gql } from "apollo-boost";

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

export const mockData = [
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
    }
];
