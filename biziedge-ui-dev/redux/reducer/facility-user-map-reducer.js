import { addError } from "../actions/toast.action";
const initialState = [];

const facilityUserMap = (state = initialState, action) => {
  switch (action.type) {
    case "ASSIGN_USER_SUCCESS": {
      return [
        ...state.filter((s) => s._id != action.payload.data._id),
        action.payload.data,
      ];
    }
    case "FETCH_FACILITY_ASSIGNED_USER_FAIL":
    case "ASSIGN_USER_FAIL": {
      action.asyncDispatch(
        addError(action.error?.response?.data?.message, 3000)
      );
      return state;
    }
    case "FETCH_FACILITY_ASSIGNED_USER_SUCCESS": {
      return action.payload.data;
    }

    case "REMOVE_USER_SUCCESS": {
      return [...state.filter((s) => s._id != action.payload.data._id)];
    }

    case "LOGOUT": {
      return [];
    }

    default: {
      return state;
    }
  }
};

export default facilityUserMap;
