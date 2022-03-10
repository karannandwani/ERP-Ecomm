import { addError } from "../actions/toast.action";
const initialState = [];

const HSN = (state = initialState, action) => {
  switch (action.type) {
    case "ADD_HSN_SUCCESS": {
      let hsn = state.find((a) => a._id == action.payload.data._id);
      return hsn
        ? state.map((p) => (p._id == hsn._id ? action.payload.data : p))
        : [...state, action.payload.data];
    }

    case "ADD_HSN_FAIL": {
      action.asyncDispatch(
        addError(action.error?.response?.data?.message, 3000)
      );
      return state;
    }

    case "FETCH_HSN_NUMBER_SUCCESS": {
      return action.payload.data;
    }

    case "FETCH_HSN_NUMBER_FAIL": {
      action.asyncDispatch(
        addError(action.error?.response?.data?.message, 3000)
      );
      return state;
    }
    case "ADD_EXTRA_TAX_SUCCESS": {
      // Since adding tax returns the entire HSN object from backend, we need to
      // just replace the hsn object in the state
      let hsn = state.find((e) => e._id == action.payload.data._id);
      return hsn
        ? state.map((a) => (a._id == hsn._id ? action.payload.data : a))
        : [...state, action.payload.data];
    }
    case "ADD_EXTRA_TAX_FAIL": {
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
export default HSN;
