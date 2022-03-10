export const addHSN = (hsnObj) => (dispatch) => {
  return dispatch({
    type: "ADD_HSN",
    payload: {
      request: {
        url: `api/hsn-gst`,
        method: "POST",
        data: hsnObj,
      },
    },
  });
};
export const fetchHSN = (obj) => (dispatch) => {
  return dispatch({
    type: "FETCH_HSN_NUMBER",
    payload: {
      request: {
        url: `api/hsn-gst/list`,
        method: "POST",
        data: obj,
      },
    },
  });
};
export const addExtraTax = (obj) => (dispatch) => {
  return dispatch({
    type: "ADD_EXTRA_TAX",
    payload: {
      request: {
        url: `api/tax`,
        method: "POST",
        data: obj,
      },
    },
  });
};
