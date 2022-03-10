import { addError } from "../actions/toast.action";
const initialState = [];

const brandReducer = (state = initialState, action) => {
  switch (action.type) {
    case "ADD_BRAND_SUCCESS": {
      let brand = state.find((a) => a._id == action.payload.data._id);
      return brand
        ? state.map((p) => (p._id == brand._id ? action.payload.data : p))
        : [...state, action.payload.data];
    }
    case "ADD_BRAND_FAIL":
    case "FETCH_BRANDS_FAIL": {
      action.asyncDispatch(
        addError(action.error?.response?.data?.message, 3000)
      );
      return state;
    }
    case "FETCH_BRANDS_SUCCESS": {
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
export default brandReducer;
