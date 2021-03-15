export const fetchData = async (pageInfo) => {
    const { pageNum, endCursor, pageSize } = pageInfo;
    const pageNumner = pageNum || Math.ceil(endCursor / pageSize);
    const response = await fetch(
        `https://sxgfhbcma2.execute-api.us-east-2.amazonaws.com/default/cargoFlightList?currentPage=${pageNumner}&pageSize=${pageSize}`
    )
        .then((resp) => resp.json()) // Transform the data into json
        .then(function (res) {
            return res;
        })
        .catch((error) => {
            console.log(`Error in fetch grid data :  ${error}`);
        });

    if (response !== undefined && response.data && response.data.result) {
        const { result } = response.data;

        const flightClasses = ["Economy", "Business", "First"];
        const airlineNames = [
            "Air Asia",
            "Air India",
            "Go Air",
            "Indigo",
            "Jet Airways",
            "Spice Jet"
        ];
        const airlineCodes = ["I5", "AI", "GA", "6E", "JA", "SJ"];
        const airlineNumbers = ["7775", "2058", "1079", "8356", "4218", "3569"];
        if (result) {
            const updatedResult = result.map((item) => {
                const updatedItem = { ...item };
                const { flight } = item;
                if (flight) {
                    const newConnectionFlights = [];
                    const randomNumber = Math.floor(Math.random() * 6);
                    for (let i = 0; i <= randomNumber; i++) {
                        newConnectionFlights.push({
                            airlinename: airlineNames[i],
                            airlinenumbers: {
                                code: airlineCodes[i],
                                number: airlineNumbers[i]
                            }
                        });
                    }
                    updatedItem.flight.flightdetails = {
                        connectionflights: newConnectionFlights,
                        flightclass:
                            flightClasses[Math.floor(Math.random() * 3)]
                    };
                }
                return updatedItem;
            });
            return updatedResult;
        }
    }
    return [];
};

export const fetchSubComponentData = async (pageInfo) => {
    const { pageNum, pageSize } = pageInfo;
    const response = await fetch(
        `https://epwy14rtqi.execute-api.us-east-2.amazonaws.com/default/cargoTreeList?currentPage=${pageNum}&pageSize=${pageSize}`
    )
        .then((resp) => resp.json()) // Transform the data into json
        .then(function (res) {
            return res;
        })
        .catch((error) => {
            console.log(`Error in fatch sub component data :  ${error}`);
        });

    if (response !== undefined && response.data && response.data.result) {
        const { result } = response.data;
        if (result) {
            return result;
        }
    }
    return [];
};
