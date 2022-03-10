import { addError } from "../actions/toast.action";
const initialState = [];

const assignVehicle = (state = initialState, action) => {
  switch (action.type) {
    case "ASSIGN_VEHICLE_SUCCESS": {
      return action.payload.data;
    }
    case "ASSIGN_VEHICLE_FAIL": {
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

export default assignVehicle;
