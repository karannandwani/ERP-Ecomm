import { addError } from "../actions/toast.action";
const initialState = [];

const scheme = (state = initialState, action) => {
  switch (action.type) {
    case "ADD_SCHEME_SUCCESS": {
      const index = state.findIndex((x) => x._id === action.payload.data._id);
      if (index > -1) {
        state[index] = action.payload.data;
        return [...state];
      } else {
        return [...state, action.payload.data];
      }
    }
    case "ADD_SCHEME_FAIL": {
      action.asyncDispatch(
        addError(action.error?.response?.data?.message, 3000)
      );
      return state;
    }

    case "FETCH_SCHEME_SUCCESS": {
      return action.payload.data;
    }
    case "FETCH_SCHEME_FAIL": {
      action.asyncDispatch(
        addError(action.error?.response?.data?.message, 3000)
      );
      return state;
    }
    case "LOGOUT": {
      return [];
    }

    default: {
      return state;
    }
  }
};

export default scheme;
