export const assignVehicle = (obj) => (dispatch) => {
  return dispatch({
    type: "ASSIGN_VEHICLE",
    payload: {
      request: {
        url: `api/order/assignVehicle`,
        method: "POST",
        data: obj,
      },
    },
  });
};
