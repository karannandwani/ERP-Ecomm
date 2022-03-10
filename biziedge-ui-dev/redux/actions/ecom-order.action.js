export const fetchEcomOrder = (obj) => (dispatch) => {
  return dispatch({
    type: "FETCH_ECOM_ORDER",
    payload: {
      request: {
        url: `api/order/e-com`,
        method: "POST",
        data: obj,
      },
    },
  });
};

export const updateEcommerceOrder = (obj) => (dispatch) => {
  return dispatch({
    type: "UPDATE_ECOM_ORDER",
    payload: {
      request: {
        url: `api/order/e-com/update`,
        method: "POST",
        data: obj,
      },
    },
  });
};
