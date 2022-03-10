import { addError } from "../actions/toast.action";
const initialState = [];

const vehicles = (state = initialState, action) => {
  switch (action.type) {
    case "ADD_VEHICLE_SUCCESS": {
      let vehicle = state.find((a) => a._id == action.payload.data._id);
      return vehicle
        ? state.map((p) => (p._id == vehicle._id ? action.payload.data : p))
        : [...state, action.payload.data];
    }
    case "ADD_VEHICLE_FAIL": {
      action.asyncDispatch(
        addError(action.error?.response?.data?.message, 3000)
      );
      return state;
    }
    case "FETCH_VEHICLES_SUCCESS": {
      return action.payload.data ?? [];
    }
    case "FETCH_VEHICLES_FAIL": {
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

export default vehicles;
