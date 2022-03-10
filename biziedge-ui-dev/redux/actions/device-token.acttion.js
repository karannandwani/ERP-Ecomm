export const saveDeviceToken = (obj) => (dispatch) => {
  return dispatch({
    type: "FETCH_ECOM_ORDERS",
    payload: {
      request: {
        url: `api/order/e-com`,
        method: "POST",
        data: obj,
      },
    },
  });
};
