import { addError } from "../actions/toast.action";
const initialState = [];

const landingPageData = (state = initialState, action) => {
  switch (action.type) {
    case "FETCH_LANDING_PAGE_SUCCESS": {
      return action.payload.data;
    }

    case "CREATE_LANDING_PAGE_SUCCESS": {
      let index = state.findIndex((x) => x._id === action.payload._id);
      if (index > -1) {
        state[index] = action.payload.data;
        return [...state.sort((a, b) => a - b)];
      } else {
        return [...[...state, action.payload.data].sort((a, b) => a - b)];
      }
    }

    case "CREATE_LANDING_PAGE_FAIL":
    case "FETCH_LANDING_PAGE_FAIL": {
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

export default landingPageData;
