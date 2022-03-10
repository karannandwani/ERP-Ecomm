import { addError } from "../actions/toast.action";
const initialState = [];

const manufacturerList = (state = initialState, action) => {
  switch (action.type) {
    case "ADD_MANUFACTURER_SUCCESS": {
      let manufacturer = state.find((a) => a._id == action.payload.data._id);
      return manufacturer
        ? state.map((p) =>
            p._id == manufacturer._id ? action.payload.data : p
          )
        : [...state, action.payload.data];
    }
    case "ADD_MANUFACTURER_FAIL": {
      action.asyncDispatch(
        addError(action.error?.response?.data?.message, 3000)
      );
      return state;
    }
    case "FETCH_MANUFACTURER_SUCCESS": {
      return action.payload.data;
    }
    case "FETCH_MANUFACTURER_FAIL": {
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

export default manufacturerList;
