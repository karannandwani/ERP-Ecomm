export const fetchOrderFeedback = (obj) => (dispatch) => {
  return dispatch({
    type: "FETCH_ORDER_FEEDBACK",
    payload: {
      request: {
        url: "api/order-feedback/list",
        method: "POST",
        data: obj,
      },
    },
  });
};
