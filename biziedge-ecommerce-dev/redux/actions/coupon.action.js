export const fetchCoupon = (obj) => (dispatch) => {
  return dispatch({
    type: "FETCH_COUPON",
    payload: {
      request: {
        url: `api/coupon/list`,
        method: "POST",
        data: obj,
      },
    },
  });
};
