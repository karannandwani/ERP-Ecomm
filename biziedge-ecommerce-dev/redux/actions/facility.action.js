export const fetchFacilityByBeat = (obj) => (dispatch) => {
  return dispatch({
    type: "FETCH_FACILITY_BY_BEAT",
    payload: {
      request: {
        url: "api/facility/beat",
        method: "POST",
        data: obj,
      },
    },
  });
};
