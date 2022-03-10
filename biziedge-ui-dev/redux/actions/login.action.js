export const login = (user) => (dispatch) => {
  return dispatch({
    type: "LOGIN",
    payload: {
      request: {
        url: "/api/user/login",
        method: "POST",
        data: user,
      },
    },
  });
};

export const logout = () => (dispatch) => {
  return dispatch({
    type: "LOGOUT",
  });
};
export const sendCode = (obj) => (dispatch) => {
  return dispatch({
    type: "SEND_CODE",
    payload: {
      request: {
        url: `api/user/password/forgot/${obj.email}`,
        method: "GET",
      },
    },
  });
};
export const verifyCode = (obj) => (dispatch) => {
  return dispatch({
    type: "VERIFY_CODE",
    payload: {
      request: {
        url: `api/user/password/code-match`,
        method: "POST",
        data: obj,
      },
    },
  });
};
export const passwordReset = (obj) => (dispatch) => {
  return dispatch({
    type: "RESET_PASSWORD",
    payload: {
      request: {
        url: `api/user/password/reset`,
        method: "POST",
        data: obj,
      },
    },
  });
};
export const initCode = () => ({
  type: "CODE_INIT",
  payload: {
    data: "EMAIL",
  },
});
