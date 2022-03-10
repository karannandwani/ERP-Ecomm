import { addError } from "../actions/toast.action";
const initialState = [];

const leads = (state = initialState, action) => {
  switch (action.type) {
    case "FETCH_LEADS_SUCCESS": {
      return action.payload.data;
    }
    case "FETCH_LEADS_FAIL": {
      action.asyncDispatch(
        addError(action.error?.response?.data?.message, 3000)
      );
      return state;
    }
    case "CREATE_LEAD_SUCCESS": {
      return [...state, action.payload.data];
    }
    case "CREATE_LEAD_FAIL": {
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

export default leads;
