import { addError } from "../actions/toast.action";
const initialState = [];

const ecommerceOrders = (state = initialState, action) => {
  switch (action.type) {
    case "UPDATE_ECOM_ORDER_SUCCESS": {
      const index = state.findIndex((x) => x._id === action.payload.data._id);
      if (index > -1) {
        state[index] = action.payload.data;
        return [...state];
      } else {
        return [...state, action.payload.data];
      }
    }

    case "UPDATE_ECOM_ORDER_FAIL":
    case "FETCH_ECOM_ORDER_FAIL": {
      action.asyncDispatch(
        addError(action.error?.response?.data?.message, 3000)
      );
      return state;
    }
    case "FETCH_ECOM_ORDER_SUCCESS": {
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

export default ecommerceOrders;
