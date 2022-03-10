export const fetchManufacturer = (obj) => (dispatch) => {
  return dispatch({
    type: "FETCH_MANUFACTURER",
    payload: {
      request: {
        url: "api/manufacturer/list",
        method: "POST",
        data: obj,
      },
    },
  });
};
export const addManufacturer = (addObj) => (dispatch) => {
  return dispatch({
    type: "ADD_MANUFACTURER",
    payload: {
      request: {
        url: `api/manufacturer`,
        method: "POST",
        data: addObj,
      },
    },
  });
};
