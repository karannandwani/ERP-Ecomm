import { addError } from "../actions/toast.action";
const initialState = null;
const currentBeat = (state = initialState, action) => {
  switch (action.type) {
    case "FETCH_BEAT_BY_LOCATION_SUCCESS": {
      return action.payload.data;
    }

    case "FETCH_BEAT_BY_LOCATION_FAIL": {
      action.asyncDispatch(
        addError(action.error?.response?.data?.message, 3000)
      );
      return state;
    }

    case "SELECTED_BEAT": {
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
export default currentBeat;
