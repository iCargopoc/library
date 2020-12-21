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
        if (result) {
            return result;
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
