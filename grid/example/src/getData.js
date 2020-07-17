import axios from "axios";

const { search } = window.location;
const urlPageSize = search ? parseInt(search.replace("?pagesize=", "")) : NaN;
const pageSize = !isNaN(urlPageSize) ? urlPageSize : 300;

export const fetchData = async (index) => {
    const pageNumber = Math.floor(index / pageSize) + 1;
    const response = await axios(
        `https://sxgfhbcma2.execute-api.us-east-2.amazonaws.com/default/cargoFlightList?currentPage=${pageNumber}&pageSize=${pageSize}`
    );
    if (response && response.data && response.data.data) {
        const { result } = response.data.data;
        if (result) {
            return result;
        }
    }
    return [];
};
