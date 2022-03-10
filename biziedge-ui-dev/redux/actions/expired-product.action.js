export const fetchExpiredProduct = (obj) => (dispatch) => {
  return dispatch({
    type: "FETCH_EXPIRED_PRODUCT",
    payload: {
      request: {
        url: `api/expiryProduct`,
        method: "POST",
        data: obj,
      },
    },
  });
};
