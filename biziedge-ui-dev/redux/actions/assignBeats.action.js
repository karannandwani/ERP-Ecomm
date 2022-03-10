export const fetchAssignedBeat = (obj) => (dispatch) => {
  return dispatch({
    type: "FETCH_ASSIGNED_BEAT",
    payload: {
      request: {
        url: `api/beat?business=${obj.business}`,
        method: "GET",
      },
    },
  });
};
