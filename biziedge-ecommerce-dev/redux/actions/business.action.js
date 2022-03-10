export const fetchBusiness = (obj) => (dispatch) => {
  return dispatch({
    type: "FETCH_BUSINESS",
    payload: {
      request: {
        url: `api/business/fetchByName`,
        method: "POST",
        data: {
          name: "Sai Win",
        },
      },
    },
  });
};

export const fetchRazorPayKey = (obj) => (dispatch) => {
  return dispatch({
    type: "FETCH_RAZORPAY_KEY",
    payload: {
      request: {
        url: `api/static-data/key`,
        method: "POST",
        data: obj,
      },
    },
  });
};
