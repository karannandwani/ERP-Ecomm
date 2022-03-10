import { addError } from "../actions/toast.action";
const initialState = [];

const quantityNorm = (state = initialState, action) => {
  switch (action.type) {
    case "ADD_QUANTITY_NORM_SUCCESS": {
      let norm = state.find((a) => a._id == action.payload.data[0]._id);
      return norm
        ? state.map((p) => (p._id == norm._id ? action.payload.data[0] : p))
        : [...state, ...action.payload.data];
    }
    case "ADD_QUANTITY_NORM_FAIL": {
      action.asyncDispatch(
        addError(action.error?.response?.data?.message, 3000)
      );
      return state;
    }
    case "FETCH_QUANTITY_NORM_SUCCESS": {
      return action.payload.data;
    }
    case "FETCH_QUANTITY_NORM_FAIL": {
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
export default quantityNorm;
