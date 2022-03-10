export const fetchQuickDetails = (obj) => (dispatch) => {
  return dispatch({
    type: "FETCH_QUICK_DETAILS",
    payload: {
      request: {
        url: `api/order/count?facility=${obj.facility}`,
        method: "get",
      },
    },
  });
};
