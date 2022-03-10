import { addError } from "../actions/toast.action";
const initialState = [];

const areas = (state = initialState, action) => {
  switch (action.type) {
    case "FETCH_BEAT_SUCCESS": {
      return action.payload.data;
    }
    case "FETCH_BEAT_FAIL": {
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

export default areas;
