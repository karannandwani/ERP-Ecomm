export const uuidv4 = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};
export const addInfo = (message, timeout) => ({
  type: "ADD_MESSAGE",
  payload: {
    message,
    type: "INFO",
    timeout,
    id: uuidv4(),
  },
});

export const addWarning = (message, timeout) => ({
  type: "ADD_MESSAGE",
  payload: {
    message,
    timeout,
    type: "WARN",
    id: uuidv4(),
  },
});

export const addError = (message, timeout) => ({
  type: "ADD_MESSAGE",
  payload: {
    message,
    timeout,
    type: "ERROR",
    id: uuidv4(),
  },
});

export const removeToast = (message) => ({
  type: "REMOVE_MESSAGE",
  payload: message,
});
