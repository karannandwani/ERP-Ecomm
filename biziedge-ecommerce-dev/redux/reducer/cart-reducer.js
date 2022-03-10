const initialState = [];
import { addError, addInfo } from "../actions/toast.action";
const cart = (state = initialState, action) => {
  switch (action.type) {
    case "APPLY_COUPON_SUCCESS":
    case "UPDATE_CART_SUCCESS":
    case "ADD_TO_CART_SUCCESS": {
      addInfo("Added Successfully , Go to Cart", 3000);
      let newState = state.find((a) => a._id == action.payload.data._id);
      return newState
        ? state.map((c, i) => (c._id == newState._id ? action.payload.data : c))
        : [...state, action.payload.data];
    }

    case "FFETCH_CART_SUCCESS": {
      return action.payload.data ?? [];
    }

    case "REMOVE_FROM_CART": {
      addInfo("Removed from cart.");
      return state.filter((x) => x._id !== action.payload.data._id);
    }

    case "APPLY_COUPON_FAIL":
    case "UPDATE_CART_FAIL":
    case "ADD_TO_CART_FAIL": {
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

export default cart;
