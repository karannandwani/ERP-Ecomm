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

export const fetchLandingPageData = (data) => (dispatch) => {
  return dispatch({
    type: "FETCH_LANDING_PAGE_DATA",
    payload: {
      request: {
        url: `/api/landing-page/list/ecom`,
        method: "POST",
        data: data,
      },
    },
  });
};
