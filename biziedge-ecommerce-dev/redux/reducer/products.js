const initialState = [];
import { addError } from "../actions/toast.action";

const products = (state = initialState, action) => {
  switch (action.type) {
    case "FETCH_PRODUCT_SUCCESS": {
      return action.payload.data;
    }

    case "FETCH_PRODUCT_FAIL": {
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
export default products;
