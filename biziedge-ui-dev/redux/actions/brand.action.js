export const addBrandAction = (data) => (dispatch) => {
  return dispatch({
    type: "ADD_BRAND",
    payload: {
      request: {
        url: "/api/brand",
        method: "POST",
        data: data,
      },
    },
  });
};
export const fetchBrands = (obj) => (dispatch) => {
  return dispatch({
    type: "FETCH_BRANDS",
    payload: {
      request: {
        url: "api/brand/list",
        method: "POST",
        data: obj,
      },
    },
  });
};
