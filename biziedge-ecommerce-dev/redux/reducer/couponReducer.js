import { addError } from "../actions/toast.action";
const initialState = [];

const coupons = (state = initialState, action) => {
  switch (action.type) {
    case "FETCH_COUPON_SUCCESS": {
      return action.payload.data;
    }
    case "FETCH_COUPON_FAIL": {
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
export default coupons;
