import { addError } from "../actions/toast.action";
const initialState = null;

const returnCountForLast24Hour = (state = initialState, action) => {
  switch (action.type) {
    case "RETURN_COUNT_LAST24HOUR_SUCCESS": {
      return action.payload.data;
    }

    case "LOGOUT": {
      return null;
    }

    default: {
      return state;
    }
  }
};

export default returnCountForLast24Hour;
