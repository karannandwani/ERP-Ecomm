const initialState = null;
const token = (state = initialState, action) => {
  switch (action.type) {
    case "LOGIN_SUCCESS": {
      return action.payload.data.token;
    }

    case "SIGNUP_SUCCESS": {
      return action.payload.data.token;
    }

    case "LOGOUT": {
      return null;
    }

    default: {
      return state;
    }
  }
};

export default token;
