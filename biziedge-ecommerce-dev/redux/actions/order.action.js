export const fetchOrders = (obj) => (dispatch) => {
  return dispatch({
    type: "FETCH_ORDER",
    payload: {
      request: {
        url: "api/order/e-com",
        method: "POST",
        data: obj,
      },
    },
  });
};
export const leaveOrderScreen = (obj) => (dispatch) => {
  return dispatch({
    type: "LEAVE_ORDER_SCREEN",
  });
};

export const orderFeedback = (obj) => (dispatch) => {
  return dispatch({
    type: "FEEDBACK",
    payload: {
      request: {
        url: "api/order-feedback",
        method: "POST",
        data: obj,
      },
    },
  });
};

export const removeCurrentOrder = (obj) => (dispatch) => {
  return dispatch({
    type: "REMOVE_CURRENT_ORDER",
    payload: {
      data: null,
    },
  });
};
