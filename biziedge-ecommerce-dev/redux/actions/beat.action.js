export const fetchBeat = (obj) => (dispatch) => {
  return dispatch({
    type: "FETCH_BEAT",
    payload: {
      request: {
        url: `api/beat?business=${obj.business}`,
        method: "GET",
      },
    },
  });
};

export const selectBeat = (obj) => (dispatch) => {
  return dispatch({
    type: "SELECTED_BEAT",
    payload: {
      data: obj,
    },
  });
};

export const fetchBeatByLocation = (obj) => (dispatch) => {
  return dispatch({
    type: "FETCH_BEAT_BY_LOCATION",
    payload: {
      request: {
        url: "api/beat/location",
        method: "POST",
        data: obj,
      },
    },
  });
};
