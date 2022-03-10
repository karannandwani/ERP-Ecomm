import { addError } from "../actions/toast.action";
const initialState = [];

const driversOrders = (state = initialState, action) => {
  switch (action.type) {
    case "DELIVER_ORDER_TO_CUSTOMER_SUCCESS": {
      return [...state.filter((x) => x._id != action.payload.data._id)];
      // const index = state.findIndex((x) => x._id === action.payload.data._id);
      // if (index > -1) {
      //   state[index] = action.payload.data;
      //   return [...state];
      // } else {
      //   return [...state, action.payload.data];
      // }
    }

    case "DISPATCH_ORDERS_SUCCESS": {
      let dispatched = action.payload.data;
      return [
        ...state.map((x) => {
          let data = dispatched.find((y) => y._id === x._id);
          if (data) {
            return { ...x, status: data.status };
          } else {
            return { ...x };
          }
        }),
      ];
    }

    case "FETCH_ECOM_ORDERS_SUCCESS": {
      return action.payload.data;
    }
    case "DELIVER_ORDER_TO_CUSTOMER_FAIL":
    case "FETCH_ECOM_ORDERS_FAIL": {
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

export default driversOrders;
