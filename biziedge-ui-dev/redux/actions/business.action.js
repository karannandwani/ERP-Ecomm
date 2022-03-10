export const addBusiness = (data) => (dispatch) => {
    return dispatch({
        type: "ADD_BUSINESS",
        payload: {
            request: {
                url: "/api/business",
                method: "POST",
                data: data,
            },
        },
    });
};
export const fetchBusiness = () => (dispatch) => {
    return dispatch({
        type: "FETCH_BUSINESS",
        payload: {
            request: {
                url: `api/business?${name ? "name=" + name : ""}&pageNo=0&pageSize=1000`,
                method: "GET",
            },
        },
    });
};
