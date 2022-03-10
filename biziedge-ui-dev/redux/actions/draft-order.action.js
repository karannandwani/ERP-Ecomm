export const saveDraft = (draft) => (dispatch) => {
  return dispatch({
    type: "SAVE_DRAFT",
    payload: {
      request: {
        url: "/api/order/draft/add",
        method: "POST",
        data: draft,
      },
    },
  });
};

export const removeDraft = (draftId) => (dispatch) => {
  return dispatch({
    type: "REMOVE_DRAFT",
    payload: {
      request: {
        url: `/api/order/remove-draft/${draftId}`,
        method: "delete",
      },
    },
  });
};

export const fetchDraftList = (obj) => (dispatch) => {
  return dispatch({
    type: "FETCH_DRAFT",
    payload: {
      request: {
        url: "api/order/draftList",
        method: "POST",
        data: obj,
      },
    },
  });
};
