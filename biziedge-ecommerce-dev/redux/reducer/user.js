const initialState = null;
import { addError } from "../actions/toast.action";
const user = (state = initialState, action) => {
  switch (action.type) {
    case "LOGIN_SUCCESS": {
      action.asyncDispatch({
        type: "SET_DEVICE_TOKEN",
        payload: {
          user: action.payload.data._id,
        },
      });
      return action.payload.data;
    }

    case "LOGIN_FAIL": {
      return null;
    }

    case "SIGNUP_SUCCESS": {
      return action.payload.data;
    }

    case "LOGOUT": {
      action.asyncDispatch({
        type: "REMOVE_DEVICE_TOKEN",
        payload: {
          user: state._id,
        },
      });
      return null;
    }
    case "ADD_USER_SUCCESS": {
      return action.payload.data;
    }
    case "ADD_USER_FAIL": {
      action.asyncDispatch(
        addError(action.error?.response?.data?.message, 3000)
      );
      return state;
    }
    case "FETCH_USER_FAIL": {
      action.asyncDispatch(
        addError(action.error?.response?.data?.message, 3000)
      );
      return state;
    }

    case "FETCH_USER_SUCCESS": {
      return action.payload.data;
    }

    default: {
      return state;
    }
  }
};

export default user;
