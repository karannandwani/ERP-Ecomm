import { addError } from "../actions/toast.action";
const initialState = [];

const stockMismatchReason = (state = initialState, action) => {
  switch (action.type) {
    case "ADD_REASON_SUCCESS": {
      let reason = state.find((a) => a._id == action.payload.data._id);
      return reason
        ? state.map((p) => (p._id == reason._id ? action.payload.data : p))
        : [...state, action.payload.data];
    }
    case "ADD_REASON_FAIL": {
      action.asyncDispatch(
        addError(action.error?.response?.data?.message, 3000)
      );
      return state;
    }
    case "FETCH_REASON_NAME_SUCCESS": {
      return action.payload.data;
    }
    case "FETCH_REASON_NAME_FAIL": {
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
export default stockMismatchReason;
