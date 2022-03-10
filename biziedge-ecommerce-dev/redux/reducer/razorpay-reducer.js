import { addError } from "../actions/toast.action";
const initialState = null;
const razorPayDetails = (state = initialState, action) => {
  switch (action.type) {
    case "FETCH_RAZORPAY_KEY_SUCCESS": {
      return action.payload.data;
    }

    case "FETCH_RAZORPAY_KEY_FAIL": {
      action.asyncDispatch(
        addError(action.error?.response?.data?.message, 3000)
      );
      return state;
    }

    case "LOGOUT": {
      return null;
    }

    default: {
      return state;
    }
  }
};
export default razorPayDetails;
