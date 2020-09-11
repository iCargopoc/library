export const fetchData = async () => {
    const response = await fetch(
        `https://skyforce-api.azurewebsites.net/api/cargoFlightDetilsForExcel`
    )
        .then((resp) => resp.json()) // Transform the data into json
        // eslint-disable-next-line func-names
        .then(function (res) {
            return res;
        })
        .catch((error) => {
            // eslint-disable-next-line no-console
            console.log(`Error in fatch data :  ${error}`);
        });

    if (response !== undefined && response.data && response.data.data) {
        const { result } = response.data.data;
        if (result) {
            return result;
        }
    }
    return [];
};
