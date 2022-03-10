export const addQuantityNorm = (normObj) => (dispatch) => {
  return dispatch({
    type: "ADD_QUANTITY_NORM",
    payload: {
      request: {
        url: `api/quantity-norm`,
        method: "POST",
        data: normObj,
      },
    },
  });
};
export const fetchQuantityNorm = (normObj) => (dispatch) => {
  return dispatch({
    type: "FETCH_QUANTITY_NORM",
    payload: {
      request: {
        url: `api/quantity-norm?facility=${normObj.facility}`,
        method: "GET",
      },
    },
  });
};
