export const fetchSlide = (obj) => (dispatch) => {
  return dispatch({
    type: "FETCH_SLIDE",
    payload: {
      request: {
        url: `api/slide/list`,
        method: "POST",
        data: obj,
      },
    },
  });
};

export const createSlide = (obj) => (dispatch) => {
  return dispatch({
    type: "CREATE_SLIDE",
    payload: {
      request: {
        url: `api/slide`,
        method: "POST",
        data: obj,
      },
    },
  });
};
