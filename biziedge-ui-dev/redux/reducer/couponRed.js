import { addError } from "../actions/toast.action";
const initialState = [];

const coupon = (state = initialState, action) => {
  switch (action.type) {
    case "ADD_COUPON_SUCCESS": {
      let coupon = state.find((a) => a._id == action.payload.data._id);
      return coupon
        ? state.map((c) => (c._id == coupon._id ? action.payload.data : c))
        : [...state, action.payload.data];
    }
    case "ADD_COUPON_FAIL": {
      action.asyncDispatch(
        addError(action.error?.response?.data?.message, 3000)
      );
      return state;
    }
    case "FETCH_COUPON_NAME_SUCCESS": {
      return action.payload.data;
    }
    case "FETCH_COUPON_NAME_FAIL": {
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
export default coupon;
