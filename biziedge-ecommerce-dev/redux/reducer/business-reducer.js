import { addError } from "../actions/toast.action";
const initialState = null;
const business = (state = initialState, action) => {
  switch (action.type) {
    case "FETCH_BUSINESS_SUCCESS": {
      return action.payload.data;
    }

    case "FETCH_BUSINESS_FAIL": {
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
export default business;
