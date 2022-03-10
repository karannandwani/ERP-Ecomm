import { addError } from "../actions/toast.action";
const initialState = [];

const facility = (state = initialState, action) => {
  switch (action.type) {
    case "ADD_FACILITY_SUCCESS": {
      return [
        ...state.filter((s) => s._id != action.payload.data._id),
        action.payload.data,
      ];
    }
    case "ADD_FACILITY_FAIL": {
      action.asyncDispatch(
        addError(action.error?.response?.data?.message, 3000)
      );
      return state;
    }
    case "FETCH_FACILITY_SUCCESS": {
      return action.payload.data;
    }
    case "FETCH_FACILITY_FAIL": {
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

export default facility;
