export const fetchSupplier = (obj) => (dispatch) => {
  return dispatch({
    type: "FETCH_SUPPLIER",
    payload: {
      request: {
        url: `api/supplier?business=${obj.business}`,
        method: "GET",
      },
    },
  });
};
export const addSupplier = (addObj) => (dispatch) => {
  return dispatch({
    type: "ADD_SUPPLIER",
    payload: {
      request: {
        url: `api/supplier`,
        method: "POST",
        data: addObj,
      },
    },
  });
};
