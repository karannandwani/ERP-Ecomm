export const addNotification = (obj) => ({
  type: "ADD_NOTIFICATION",
  payload: {
    data: obj,
  },
});

export const removeNotification = (obj) => ({
  type: "REMOVE_NOTIFICATION",
  payload: {
    data: obj,
  },
});

export const clearNotifications = (obj) => ({
  type: "CLEAR_NOTIFICATIONS",
  payload: {
    data: obj,
  },
});
