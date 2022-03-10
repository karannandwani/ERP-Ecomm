import { addError } from "../actions/toast.action";
const initialState = [];

const bills = (state = initialState, action) => {
  switch (action.type) {
    case "CREATE_BILL_SUCCESS": {
      const index = state.findIndex(
        (x) =>
          x._id === action.payload.data._id || x.id === action.payload.data.id
      );
      if (index > -1) {
        state[index] = action.payload.data;
        return state;
      } else {
        return [action.payload.data, ...state];
      }
    }

    case "CREATE_BILL": {
      if (action.meta?.offline.retryCount) {
        return state;
      } else {
        return [action.payload.requestOffline.data, ...state];
      }
    }

    case "CREATE_BILL_FAIL": {
      action.asyncDispatch(
        addError(action.error?.response?.data?.message, 3000)
      );
      return state;
    }
    case "FETCH_BILL_SUCCESS": {
      return action.payload.data;
    }
    case "FETCH_BILL_FAIL": {
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

export default bills;
