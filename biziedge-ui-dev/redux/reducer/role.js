import { addError } from "../actions/toast.action";
const initialState = [];

const roles = (state = initialState, action) => {
  switch (action.type) {
    case "FETCH_ROLE_SUCCESS": {
      return action.payload.data;
    }
    case "FETCH_ROLE_FAIL": {
      action.asyncDispatch(
        addError(action.error?.response?.data?.message, 3000)
      );
      return state;
    }
    case "ADD_ROLE_SUCCESS": {
      let role = state.find((a) => a._id == action.payload.data._id);
      return role
        ? state.map((p) => (p._id === role._id ? action.payload.data : p))
        : [...state, action.payload.data];
    }
    case "ADD_ROLE_FAIL": {
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

export default roles;
