export const fetchLeads = (obj) => (dispatch) => {
  return dispatch({
    type: "FETCH_LEADS",
    payload: {
      request: {
        url: `api/lead?business=${obj.business}`,
        method: "GET",
      },
    },
  });
};

export const createLead = (obj) => (dispatch) => {
  return dispatch({
    type: "CREATE_LEAD",
    payload: {
      request: {
        url: `api/lead`,
        method: "POST",
        data: obj,
      },
    },
  });
};
