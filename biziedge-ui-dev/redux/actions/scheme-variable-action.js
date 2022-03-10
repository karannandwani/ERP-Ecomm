export const fetchSchemeVariable = (data) => (dispatch) => {
  return dispatch({
    type: "FETCH_SCHEME_VARIABLE",
    payload: {
      request: {
        url: `api/scheme-variable?business=${data.business}`,
        method: "GET",
      },
    },
  });
};

export const addSchemeVariable = (data) => (dispatch) => {
  return dispatch({
    type: "ADD_SCHEME_VARIABLE",
    payload: {
      request: {
        url: "/api/scheme-variable",
        method: "POST",
        data: data,
      },
    },
  });
};
