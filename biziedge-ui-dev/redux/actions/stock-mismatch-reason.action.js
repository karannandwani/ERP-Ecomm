export const addstockMismatch = (mismatchObj) => (dispatch) => {
  return dispatch({
    type: "ADD_REASON",
    payload: {
      request: {
        url: `api/stock-mismatch-reason`,
        method: "POST",
        data: mismatchObj,
      },
    },
  });
};
export const fetchReasonNames = (obj) => (dispatch) => {
  return dispatch({
    type: "FETCH_REASON_NAME",
    payload: {
      request: {
        url: `api/stock-mismatch-reason?facility=${obj.facility}`,
        method: "GET",
      },
    },
  });
};
