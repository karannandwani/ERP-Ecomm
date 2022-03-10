import { addError } from "../actions/toast.action";
const initialState = [];

const users = (state = initialState, action) => {
  switch (action.type) {
    case "ADD_USER_SUCCESS": {
      let user = state.find((a) => a._id == action.payload.data._id);
      return user
        ? state.map((p) => (p._id === user._id ? action.payload.data : p))
        : [...state, action.payload.data];
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

    case "LOGOUT": {
      return [];
    }

    default: {
      return state;
    }
  }
};

export default users;
