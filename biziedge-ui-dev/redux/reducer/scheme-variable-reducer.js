import { addError } from "../actions/toast.action";
const initialState = [];

const schemeVariable = (state = initialState, action) => {
  switch (action.type) {
    case "ADD_SCHEME_VARIABLE_SUCCESS": {
      const index = state.findIndex((x) => x._id === action.payload.data._id);
      if (index > -1) {
        state[index] = action.payload.data;
        return state;
      } else {
        return [...state, action.payload.data];
      }
    }
    case "ADD_SCHEME_VARIABLE_FAIL": {
      action.asyncDispatch(
        addError(action.error?.response?.data?.message, 3000)
      );
      return state;
    }

    case "FETCH_SCHEME_VARIABLE_SUCCESS": {
      return action.payload.data;
    }
    case "FETCH_SCHEME_VARIABLE_FAIL": {
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

export default schemeVariable;
