export const addVehicleAction = (data) => (dispatch) => {
  return dispatch({
    type: "ADD_VEHICLE",
    payload: {
      request: {
        url: "/api/vehicle",
        method: "POST",
        data: data,
      },
    },
  });
};
export const fetchVehicles = (obj) => (dispatch) => {
  return dispatch({
    type: "FETCH_VEHICLES",
    payload: {
      request: {
        url: `api/vehicle/list`,
        method: "POST",
        data: obj,
      },
    },
  });
};
