export const fetchLandingPageData = (obj) => (dispatch) => {
  return dispatch({
    type: "FETCH_LANDING_PAGE",
    payload: {
      request: {
        url: `api/landing-page/list`,
        method: "POST",
        data: obj,
      },
    },
  });
};

export const createLandingPageData = (obj) => (dispatch) => {
  return dispatch({
    type: "CREATE_LANDING_PAGE",
    payload: {
      request: {
        url: `api/landing-page`,
        method: "POST",
        data: obj,
      },
    },
  });
};
