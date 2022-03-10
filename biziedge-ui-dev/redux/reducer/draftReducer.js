import { addError } from "../actions/toast.action";
const initialState = [];

const draft = (state = initialState, action) => {
  switch (action.type) {
    case "SAVE_DRAFT_SUCCESS": {
      return [...state, action.payload.data];
    }
    case "FETCH_DRAFT_FAIL":
    case "REMOVE_DRAFT_FAIL":
    case "SAVE_DRAFT_FAIL": {
      action.asyncDispatch(
        addError(action.error?.response?.data?.message, 3000)
      );
      return state;
    }
    case "REMOVE_DRAFT_SUCCESS": {
      return [...state.filter((x) => x._id !== action.payload.data._id)];
    }

    case "FETCH_DRAFT_SUCCESS": {
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

export default draft;
