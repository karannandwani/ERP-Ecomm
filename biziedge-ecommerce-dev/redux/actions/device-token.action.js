export const saveDeviceToken = (obj) => (dispatch) => {
  return dispatch({
    type: "SAVE_DEVICE_TOKEN",
    payload: {
      request: {
        url: `api/device`,
        method: "POST",
        data: obj,
      },
    },
  });
};

export const removeDeviceToken = (obj) => (dispatch) => {
  return dispatch({
    type: "REMOVE_DEVICE_TOKEN",
    payload: {
      request: {
        url: `api/device`,
        method: "DELETE",
        data: obj,
      },
    },
  });
};
