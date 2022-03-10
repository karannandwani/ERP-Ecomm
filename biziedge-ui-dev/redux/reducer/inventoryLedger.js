import { addError } from "../actions/toast.action";
const initialState = [];

const ledger = (state = initialState, action) => {
  switch (action.type) {
    case "FETCH_INVENTORY_LEDGER_SUCCESS": {
      return action.payload.data;
    }
    case "FETCH_INVENTORY_LEDGER_FAIL": {
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

export default ledger;
