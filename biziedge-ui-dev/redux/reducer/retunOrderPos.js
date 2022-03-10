import { addError } from "../actions/toast.action";
const initialState = [];

const returnOrders = (state = initialState, action) => {
  switch (action.type) {
    case "RETURN_ORDER_POS_SUCCESS": {
      return action.payload.data;
    }

    case "ACCEPT_RETURN_FAIL":
    case "REJECT_RETURN_FAIL":
    case "RETURN_PRODUCT_FAIL":
    case "RETURN_ORDER_POS_FAIL":
    case "ASSIGN_VEHICLE_FAIL":
    case "GENERATE_RETURN_PASSWORD_FAIL":
    case "DELIVER_RETURN_FAIL": {
      action.asyncDispatch(
        addError(action.error?.response?.data?.message, 3000)
      );
      return state;
    }

    case "ACCEPT_RETURN_SUCCESS":
    case "ASSIGN_VEHICLE_SUCCESS":
    case "GENERATE_RETURN_PASSWORD_SUCCESS":
    case "DELIVER_RETURN_SUCCESS": {
      let returnIndex = state.findIndex(
        (x) => x._id === action.payload.data._id
      );
      return [
        ...state.map((x, i) => (i === returnIndex ? action.payload.data : x)),
      ];
    }
    case "RETURN_PRODUCT_SUCCESS": {
      return [action.payload.data, ...state];
    }

    case "REJECT_RETURN_SUCCESS": {
      return state.filter((x) => x._id != action.payload.data._id);
    }

    case "LOGOUT": {
      return [];
    }

    default: {
      return state;
    }
  }
};

export default returnOrders;