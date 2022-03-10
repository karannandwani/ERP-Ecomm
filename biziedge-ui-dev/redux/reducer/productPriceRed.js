import { addError } from "../actions/toast.action";
const initialState = [];

const productPrice = (state = initialState, action) => {
  switch (action.type) {
    case "PRODUCT_PRICE_SUCCESS": {
      return action.payload.data;
    }
    case "PRODUCT_PRICE_FAIL": {
      action.asyncDispatch(
        addError(action.error?.response?.data?.message, 3000)
      );
      return null;
    }

    case "LOGOUT": {
      return null;
    }

    default: {
      return state;
    }
  }
};

export default productPrice;
