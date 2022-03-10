export const fetchFacility = (obj) => (dispatch) => {
  return dispatch({
    type: "FETCH_FACILITY",
    payload: {
      request: {
        url: `api/facility?business=${obj.business}&pageNo=0&pageSize=100`,
        method: "GET",
      },
    },
  });
};
export const addFacility = (addObj) => (dispatch) => {
  return dispatch({
    type: "ADD_FACILITY",
    payload: {
      request: {
        url: `api/facility`,
        method: "POST",
        data: addObj,
      },
    },
  });
};
