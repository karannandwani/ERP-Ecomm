export const fetchOrder = (obj) => (dispatch) => {
  return dispatch({
    type: "FETCH_ORDER",
    payload: {
      request: {
        url: `api/order`,
        method: "POST",
        data: obj,
      },
    },
  });
};

export const deliverOrder = (obj) => (dispatch) => {
  return dispatch({
    type: "DELIVER_ORDER",
    payload: {
      request: {
        url: `api/order/deliverOrder`,
        method: "POST",
        data: obj,
      },
    },
  });
};

export const acceptOrder = (obj) => (dispatch) => {
  return dispatch({
    type: "ACCEPT_ORDER",
    payload: {
      requestOffline: {
        url: `api/order/acceptOrder`,
        method: "POST",
        data: obj,
      },
    },
    meta: {
      offline: {},
    },
  });
};

export const rejectOrder = (obj) => (dispatch) => {
  return dispatch({
    type: "REJECT_ORDER",
    payload: {
      request: {
        url: `api/order/rejectOrder`,
        method: "POST",
        data: obj,
      },
    },
  });
};

export const generatePassword = (_id) => (dispatch) => {
  return dispatch({
    type: "GENERATE_PASSWORD",
    payload: {
      request: {
        url: `api/order/generatePassword/${_id}`,
        method: "GET",
      },
    },
  });
};
