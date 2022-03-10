import { addError } from "../actions/toast.action";
const initialState = [];

const taxList = (state = initialState, action) => {
  switch (action.type) {
    case "ADD_TAX_SUCCESS": {
      let tax = state.find((a) => a._id == action.payload.data._id);
      return tax
        ? state.map((p) => (p._id == tax._id ? action.payload.data : p))
        : [...state, action.payload.data];
    }
    case "ADD_TAX_FAIL": {
      action.asyncDispatch(
        addError(action.error?.response?.data?.message, 3000)
      );
      return state;
    }

    case "LOGOUT": {
      return [];
    }

    case "FETCH_TAX_SUCCESS": {
      return action.payload.data;
    }
    case "FETCH_TAX_FAIL": {
      action.asyncDispatch(
        addError(action.error?.response?.data?.message, 3000)
      );
      return state;
    }
    default: {
      return state;
    }
  }
};
export default taxList;
