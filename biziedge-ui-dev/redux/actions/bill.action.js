export const createBill = (data, navigate) => (dispatch) => {
  return dispatch({
    type: "CREATE_BILL",
    navigate: navigate,
    payload: {
      requestOffline: {
        url: "/api/order/generate/bill",
        method: "POST",
        data: data,
      },
    },
    meta: {
      offline: {},
    },
  });
};

export const createDraft = (data) => (dispatch) => {
  return dispatch({
    type: "CREATE_DRAFT_BILL",
    payload: {
      request: {
        url: "/api/draft-bill",
        method: "POST",
        data: data,
      },
    },
  });
};

export const fetchBill = (obj) => (dispatch) => {
  return dispatch({
    type: "FETCH_BILL",
    payload: {
      request: {
        url: "api/order/bill/fetch",
        method: "POST",
        data: obj,
      },
    },
  });
};

export const fetchDraftBill = (obj) => (dispatch) => {
  return dispatch({
    type: "FETCH_DRAFT_BILL",
    payload: {
      request: {
        url: `api/draft-bill/fetch`,
        method: "POST",
        data: obj,
      },
    },
  });
};

export const removeDraftBill = (id) => (dispatch) => {
  return dispatch({
    type: "REMOVE_DRAFT_BILL",
    payload: {
      request: {
        url: `api/draft-bill/delete/${id}`,
        method: "DELETE",
      },
    },
  });
};
