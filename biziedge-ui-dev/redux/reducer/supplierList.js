import { addError } from "../actions/toast.action";
const initialState = [];

const supplierList = (state = initialState, action) => {
  switch (action.type) {
    case "ADD_SUPPLIER_SUCCESS": {
      let supplier = state.find((a) => a._id == action.payload.data._id);
      return supplier
        ? state.map((p) => (p._id == supplier._id ? action.payload.data : p))
        : [...state, action.payload.data];
    }
    case "ADD_SUPPLIER_FAIL": {
      action.asyncDispatch(
        addError(action.error?.response?.data?.message, 3000)
      );
      return state;
    }
    case "FETCH_SUPPLIER_SUCCESS": {
      return action.payload.data;
    }
    case "FETCH_SUPPLIER_FAIL": {
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

export default supplierList;
