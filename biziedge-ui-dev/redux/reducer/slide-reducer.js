import { addError } from "../actions/toast.action";
const initialState = [];

const slides = (state = initialState, action) => {
  switch (action.type) {
    case "FETCH_SLIDE_SUCCESS": {
      return action.payload.data;
    }

    case "CREATE_SLIDE_SUCCESS": {
      let index = state.findIndex((x) => x._id === action.payload._id);
      if (index > -1) {
        state[index] = action.payload.data;
        return [...state];
      } else {
        return [...state, action.payload.data];
      }
    }

    case "CREATE_SLIDE_FAIL":
    case "FETCH_SLIDE_FAIL": {
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

export default slides;
