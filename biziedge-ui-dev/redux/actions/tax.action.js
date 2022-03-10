export const addTax = (taxObj) => (dispatch) => {
  return dispatch({
    type: "ADD_TAX",
    payload: {
      request: {
        url: `api/tax`,
        method: "POST",
        data: taxObj,
      },
    },
  });
};
export const fetchTaxNames = (obj) => (dispatch) => {
  return dispatch({
    type: "FETCH_TAX",
    payload: {
      request: {
        url: "api/tax/list",
        method: "POST",
        data: obj,
      },
    },
  });
};
