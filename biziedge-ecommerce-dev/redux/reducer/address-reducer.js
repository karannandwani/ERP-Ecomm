import { addError } from "../actions/toast.action";
const initialState = [];
const addresses = (state = initialState, action) => {
  switch (action.type) {
    case "ADD_ADDRESS_SUCCESS": {
      let index = state.findIndex((x) => x._id === action.payload.data._id);
      return index > -1
        ? [...state.map((x, i) => (i === index ? action.payload.data : x))]
        : [...state, action.payload.data];
    }

    case "FETCH_ADDRESS_SUCCESS": {
      return action.payload.data;
    }

    case "DELETE_ADDRESS_FAIL":
    case "ADD_ADDRESS_FAIL":
    case "FETCH_ADDRESS_FAIL": {
      action.asyncDispatch(
        addError(action.error?.response?.data?.message, 3000)
      );
      return state;
    }
    case "DELETE_ADDRESS_SUCCESS": {
      return [...state.filter((x) => x._id !== action.payload.data._id)];
    }
    case "DELETE_ADDRESS_FAIL": {
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
export default addresses;
