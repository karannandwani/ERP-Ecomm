export const assignedUserOfFacilities = (obj) => (dispatch) => {
  return dispatch({
    type: "FETCH_FACILITY_ASSIGNED_USER",
    payload: {
      request: {
        url: `api/facility-map?business=${obj.business}`,
        method: "GET",
      },
    },
  });
};

export const assignUserToFacility = (obj) => (dispatch) => {
  return dispatch({
    type: "ASSIGN_USER",
    payload: {
      request: {
        url: `api/facility-map`,
        method: "POST",
        data: obj,
      },
    },
  });
};

export const removeUserFromFacility = (obj) => (dispatch) => {
  return dispatch({
    type: "REMOVE_USER",
    payload: {
      request: {
        url: `api/facility-map/remove/user/${obj.mapId}`,
        method: "DELETE",
        data: obj,
      },
    },
  });
};
