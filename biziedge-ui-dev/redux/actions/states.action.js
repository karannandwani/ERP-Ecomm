export const fetchState = () => (dispatch) => {
  return dispatch({
    type: "FETCH_STATE",
    payload: {
      request: {
        url: `api/state`,
        method: "GET",
      },
    },
  });
};


export const addState = (data) => (dispatch) => {
  return dispatch({
    type: "ADD_STATE",
    payload: {
      request: {
        url: "/api/state",
        method: "POST",
        data: data,
      },
    },
  });
};
