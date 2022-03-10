import { addError } from "../actions/toast.action";
const initialState = [];

const draftBills = (state = initialState, action) => {
  switch (action.type) {
    case "CREATE_DRAFT_BILL_SUCCESS": {
      const index = state.findIndex((x) => x._id === action.payload.data._id);
      if (index > -1) {
        state[index] = action.payload.data;
        return state;
      } else {
        return [...state, action.payload.data];
      }
    }

    case "CREATE_DRAFT_BILL_FAIL": {
      action.asyncDispatch(
        addError(action.error?.response?.data?.message, 3000)
      );
      return state;
    }
    case "FETCH_DRAFT_BILL_SUCCESS": {
      return action.payload.data;
    }
    case "FETCH_DRAFT_BILL_FAIL": {
      action.asyncDispatch(
        addError(action.error?.response?.data?.message, 3000)
      );
      return state;
    }
    case "REMOVE_DRAFT_BILL_SUCCESS": {
      let data = action.payload.request?.responseURL.split("/");
      return state.filter((x) => x._id != data[data.length - 1]);
    }
    case "REMOVE_DRAFT_BILL_FAIL": {
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

export default draftBills;
