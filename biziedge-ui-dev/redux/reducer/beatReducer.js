import { addError } from "../actions/toast.action";
const initialState = [];

const beats = (state = initialState, action) => {
  switch (action.type) {
    case "ADD_BEAT_SUCCESS": {
      let beat = state.find((a) => a._id == action.payload.data._id);
      return beat
        ? state.map((p) => (p._id == beat._id ? action.payload.data : p))
        : [...state, action.payload.data];
    }

    case "FETCH_BEAT_FAIL":
    case "ADD_BEAT_FAIL": {
      action.asyncDispatch(
        addError(action.error?.response?.data?.message, 3000)
      );
      return state;
    }

    case "FETCH_BEAT_SUCCESS": {
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

export default beats;
