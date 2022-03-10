export const fetchCountry = (obj) => (dispatch) => {
  return dispatch({
    type: "FETCH_COUNTRY",
    payload: {
      request: {
        url: `api/country`,
        method: "GET",
      },
    },
  });
};

export const addCountry = (data) => (dispatch) => {
  return dispatch({
      type: "ADD_COUNTRY",
      payload: {
          request: {
              url: "/api/country",
              method: "POST",
              data: data,
          },
      },
  });
};

