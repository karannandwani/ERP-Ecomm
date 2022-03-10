export const addAddress = (obj) => (dispatch) => {
  return dispatch({
    type: "ADD_ADDRESS",
    payload: {
      request: {
        url: `api/address`,
        method: "POST",
        data: obj,
      },
    },
  });
};

export const fetchAddress = () => (dispatch) => {
  return dispatch({
    type: "FETCH_ADDRESS",
    payload: {
      request: {
        url: `api/address`,
        method: "GET",
      },
    },
  });
};
export const addressDelete = (addressId) => (dispatch) => {
  return dispatch({
    type: "DELETE_ADDRESS",
    payload: {
      request: {
        url: `api/address/${addressId}`,
        method: "DELETE",
      },
    },
  });
};
