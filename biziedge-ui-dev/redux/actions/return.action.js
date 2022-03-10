export const fetchReturnOrders = (obj) => (dispatch) => {
  return dispatch({
    type: "RETURN_ORDER_POS",
    payload: {
      request: {
        url: `api/return/list`,
        method: "POST",
        data: obj,
      },
    },
  });
};

export const fetchReturnCountForLast24Hour = (obj) => (dispatch) => {
  let query = "";
  if (obj.facilityId) {
    query = `?facilityId=${obj.facilityId}`;
  } else {
    query = `?businessId=${obj.businessId}`;
  }

  return dispatch({
    type: "RETURN_COUNT_LAST24HOUR",
    payload: {
      request: {
        url: `api/return/count${query}`,
        method: "GET",
        data: obj,
      },
    },
  });
};

export const returnProductToSupplier = (data) => (dispatch) => {
  return dispatch({
    type: "RETURN_PRODUCT",
    payload: {
      request: {
        url: "/api/return",
        method: "POST",
        data: data,
      },
    },
  });
};

export const rejectReturn = (data) => (dispatch) => {
  return dispatch({
    type: "REJECT_RETURN",
    payload: {
      request: {
        url: "/api/return/reject",
        method: "POST",
        data: data,
      },
    },
  });
};

export const acceptReturn = (data) => (dispatch) => {
  return dispatch({
    type: "ACCEPT_RETURN",
    payload: {
      request: {
        url: "/api/return/accept",
        method: "POST",
        data: data,
      },
    },
  });
};

export const assignVehicle = (data) => (dispatch) => {
  return dispatch({
    type: "ASSIGN_VEHICLE",
    payload: {
      request: {
        url: "/api/return/assignVehicle",
        method: "POST",
        data: data,
      },
    },
  });
};

export const generateReturnPassword = (data) => (dispatch) => {
  return dispatch({
    type: "GENERATE_RETURN_PASSWORD",
    payload: {
      request: {
        url: `/api/return/generatePassword/${data._id}`,
        method: "GET",
      },
    },
  });
};

export const deliverReturn = (data) => (dispatch) => {
  return dispatch({
    type: "DELIVER_RETURN",
    payload: {
      request: {
        url: "/api/return/deliverReturn",
        method: "POST",
        data: data,
      },
    },
  });
};
