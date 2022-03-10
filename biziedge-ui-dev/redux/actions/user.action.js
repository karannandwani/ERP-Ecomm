export const fetchUser = (data) => (dispatch) => {
  return dispatch({
    type: "FETCH_USER",
    payload: {
      request: {
        url: "/api/user/list",
        method: "POST",
        data: data,
      },
    },
  });
};
export const addUser = (data) => (dispatch) => {
  return dispatch({
    type: "ADD_USER",
    payload: {
      request: {
        url: "/api/user/register",
        method: "POST",
        data: data,
      },
    },
  });
};
export const changeSelectedBusiness = (data) => (dispatch) => {
  return dispatch({
    type: "CHANGE_SELECTED_BUSINESS",
    payload: {
      request: {
        url: `/api/user/business/changeSelected?business=${data.business}`,
        method: "GET",
      },
    },
  });
};

export const changeSelectedFacility = (data) => (dispatch) => {
  return dispatch({
    type: "CHANGE_SELECTED_FACILITY",
    payload: {
      request: {
        url: `/api/facility-map/change/${data.facility}`,
        method: "GET",
      },
    },
  });
};
