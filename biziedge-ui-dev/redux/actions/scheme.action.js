export const fetchSchemes = (data) => (dispatch) => {
  return dispatch({
    type: "FETCH_SCHEME",
    payload: {
      request: {
        url: `api/scheme?business=${data.business}`,
        method: "GET",
      },
    },
  });
};

export const addScheme = (data) => (dispatch) => {
  return dispatch({
    type: "ADD_SCHEME",
    payload: {
      request: {
        url: "/api/scheme",
        method: "POST",
        data: data,
      },
    },
  });
};
