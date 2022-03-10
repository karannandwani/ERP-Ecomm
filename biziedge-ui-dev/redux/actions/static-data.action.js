export const fetchStaticData = (obj) => (dispatch) => {
  return dispatch({
    type: "FETCH_STATIC_DATA",
    payload: {
      request: {
        url: `api/static-data/list`,
        method: "POST",
        data: obj,
      },
    },
  });
};

export const addStaticData = (data) => (dispatch) => {
  return dispatch({
    type: "ADD_STATIC_DATA",
    payload: {
      request: {
        url: "/api/static-data",
        method: "POST",
        data: data,
      },
    },
  });
};
