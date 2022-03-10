export const addToCart = (obj) => (dispatch) => {
  return dispatch({
    type: "ADD_TO_CART",
    payload: {
      request: {
        url: "api/cart",
        method: "POST",
        data: obj,
      },
    },
  });
};

export const fetchCart = (obj) => (dispatch) => {
  return dispatch({
    type: "FFETCH_CART",
    payload: {
      request: {
        url: "api/cart",
        method: "GET",
      },
    },
  });
};

export const updateCart = (obj) => (dispatch) => {
  return dispatch({
    type: "UPDATE_CART",
    payload: {
      request: {
        url: "api/cart/update",
        method: "POST",
        data: obj,
      },
    },
  });
};

export const checkout = (obj) => (dispatch) => {
  return dispatch({
    type: "PLACE_ORDER",
    payload: {
      request: {
        url: "api/cart/placeOrder",
        method: "POST",
        data: obj,
      },
    },
  });
};

export const applyCoupon = (obj) => (dispatch) => {
  return dispatch({
    type: "APPLY_COUPON",
    payload: {
      request: {
        url: "api/cart/coupon",
        method: "POST",
        data: obj,
      },
    },
  });
};
