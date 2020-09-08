export const fetchData = async (index, pageSize) => {
    const pageNumber = Math.floor(index / pageSize) + 1;

    let response = await fetch(
        // `https://skyforceapi.azurewebsites.net/api/cargoflightdetails?currentPage=${pageNumber}&pageSize=${pageSize}`
        `https://sxgfhbcma2.execute-api.us-east-2.amazonaws.com/default/cargoFlightList?currentPage=${pageNumber}&pageSize=${pageSize}`
    )
        .then((resp) => resp.json()) // Transform the data into json
        .then(function (res) {
            return res;
        })
        .catch((error) => {
            console.log("Error in fatch data :  " + error);
        });

    if (response !== undefined && response.data && response.data.result) {
        const { result } = response.data;
        if (result) {
            return result;
        }
    }
    return [];
};
