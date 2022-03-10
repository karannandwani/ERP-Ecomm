export const addBeatAction = (data) => (dispatch) => {
    return dispatch({
        type: "ADD_BEAT",
        payload: {
            request: {
                url: "/api/beat",
                method: "POST",
                data: data,
            },
        },
    });
};
export const fetchBeat = (obj) => (dispatch) => {
    return dispatch({
        type: "FETCH_BEAT",
        payload: {
            request: {
                url: `api/beat?business=${obj.business}`,
                method: "GET",
            },
        },
    });
};