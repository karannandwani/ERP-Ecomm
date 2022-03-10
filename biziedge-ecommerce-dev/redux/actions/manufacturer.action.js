export const fetchManufacturer = (obj) => (dispatch) => {
  return dispatch({
    type: "FETCH_MANUFACTURER",
    payload: {
      request: {
        url: `api/manufacturer?business=${obj.business}`,
        method: "GET",
      },
    },
  });
};
