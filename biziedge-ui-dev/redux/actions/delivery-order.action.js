export const deliverOrder = (obj) => (dispatch) => {
  return dispatch({
    type: "DELIVER_ORDER_TO_CUSTOMER",
    payload: {
      request: {
        url: `api/order/e-com/update`,
        method: "POST",
        data: obj,
      },
    },
  });
};

export const fetchDriverOrders = (obj) => (dispatch) => {
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

export const dispatchOrders = (obj) => (dispatch) => {
  return dispatch({
    type: "DISPATCH_ORDERS",
    payload: {
      request: {
        url: `api/order/dispatch`,
        method: "POST",
        data: obj,
      },
    },
  });
};

export const driverDeliveredOrders = (obj) => (dispatch) => {
  return dispatch({
    type: "DRIVER_DELIVERED_ORDERS",
    payload: {
      request: {
        url: `api/order/e-com`,
        method: "POST",
        data: obj,
      },
    },
  });
};
