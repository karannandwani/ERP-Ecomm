import { addError } from "../actions/toast.action";
const initialState = [];
import _ from "lodash";

const orders = (state = initialState, action) => {
  switch (action.type) {
    case "PLACE_ORDER_SUCCESS": {
      let index = state
        ? state.findIndex((x) => x._id === action.payload.data._id)
        : -1;
      return index > -1
        ? [...state.map((x, i) => (i === index ? action.payload.data : x))]
        : [...state, action.payload.data];
    }
    case "FETCH_ORDER_SUCCESS": {
      return _.unionBy(state || [], action.payload.data || [], "_id");
    }
    case "FEEDBACK_SUCCESS": {
      let newState = state.find((a) => a._id == action.payload.data._id);
      return newState
        ? state.map((c, i) => (c._id == newState._id ? action.payload.data : c))
        : [...state, action.payload.data];
    }
    // case "FEEDBACK_FAIL": {
    //   action.asyncDispatch(
    //     addError(action.error?.response?.data?.message, 3000)
    //   );
    //   return state;
    // }
    case "FETCH_ORDER_FAIL":
    case "PLACE_ORDER_FAIL": {
      action.asyncDispatch(
        addError(action.error?.response?.data?.message, 3000)
      );
      return state;
    }

    case "LEAVE_ORDER_SCREEN":
    case "LOGOUT": {
      return [];
    }

    default: {
      return state;
    }
  }
};
export default orders;
