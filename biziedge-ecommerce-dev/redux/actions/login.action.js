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

export const sendOtp = (obj) => (dispatch) => {
  return dispatch({
    type: "SEND_OTP",
    payload: {
      request: {
        url: "/api/user/sendOtp",
        method: "POST",
        data: obj,
      },
    },
  });
};

export const logout = () => (dispatch) => {
  return dispatch({
    type: "LOGOUT",
  });
};
