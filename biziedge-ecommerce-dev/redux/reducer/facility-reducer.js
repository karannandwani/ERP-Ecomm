import { addError } from "../actions/toast.action";
const initialState = null;
const facility = (state = initialState, action) => {
  switch (action.type) {
    case "FETCH_FACILITY_BY_BEAT_SUCCESS": {
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
export default facility;
