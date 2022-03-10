export const addCoupon = (couponObj) => (dispatch) => {
  return dispatch({
    type: "ADD_COUPON",
    payload: {
      request: {
        url: `api/coupon`,
        method: "POST",
        data: couponObj,
      },
    },
  });
};
export const fetchCouponName = (obj) => (dispatch) => {
  return dispatch({
    type: "FETCH_COUPON_NAME",
    payload: {
      request: {
        url: `api/coupon/list`,
        method: "POST",
        data: obj,
      },
    },
  });
};
