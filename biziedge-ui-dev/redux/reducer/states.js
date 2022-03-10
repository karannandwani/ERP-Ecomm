import { addError } from "../actions/toast.action";
const initialState = [];

const states = (state = initialState, action) => {
  switch (action.type) {
    case "ADD_STATE_SUCCESS": {
      const index = state.findIndex((x) => x._id === action.payload.data._id);
      if (index > -1) {
        state[index] = action.payload.data;
        return state;
      } else {
        return [...state, action.payload.data];
      }
    }
    case "ADD_STATE_FAIL": {
      action.asyncDispatch(
        addError(action.error?.response?.data?.message, 3000)
      );
      return state;
    }

    case "FETCH_STATE_SUCCESS": {
      return action.payload.data;
    }
    case "FETCH_STATE_FAIL": {
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

export default states;
