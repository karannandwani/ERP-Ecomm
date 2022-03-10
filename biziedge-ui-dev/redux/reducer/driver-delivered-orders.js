import { addError } from "../actions/toast.action";
const initialState = [];

const driverDeliveredOrders = (state = initialState, action) => {
  switch (action.type) {
    case "DELIVER_ORDER_TO_CUSTOMER_SUCCESS": {
      return [...state, action.payload.data];
    }

    case "DRIVER_DELIVERED_ORDERS_SUCCESS": {
      return action.payload.data;
    }
    case "DRIVER_DELIVERED_ORDERS_FAIL": {
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

export default driverDeliveredOrders;
