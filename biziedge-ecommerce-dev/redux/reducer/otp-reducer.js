const initialState = null;

const otp = (state = initialState, action) => {
  switch (action.type) {
    case "SEND_OTP_SUCCESS": {
      return action.payload.data;
    }

    case "SEND_OTP_FAIL": {
      return null;
    }

    case "LOGOUT": {
      return null;
    }

    default: {
      return state;
    }
  }
};

export default otp;
