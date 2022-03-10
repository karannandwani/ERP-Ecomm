import { addError } from "../actions/toast.action";
const initialState = [];

const policies = (state = initialState, action) => {
  switch (action.type) {
    case "FETCH_POLICIES_SUCCESS": {
      return action.payload.data;
    }

    case "ADD_POLICIES_FAIL":
    case "REMOVE_POLICIES_FAIL":
    case "FETCH_POLICIES_FAIL": {
      action.asyncDispatch(
        addError(action.error?.response?.data?.message, 3000)
      );
      return state;
    }

    case "ADD_POLICIES_SUCCESS": {
      let roleId = action.payload.data[0].roleId;
      let data = action.payload.data;
      return state[roleId]
        ? { ...state, [roleId]: [...state[roleId], data[0]] }
        : { ...state, roleId: data };
    }

    case "REMOVE_POLICIES_SUCCESS": {
      let index = state[action.payload.data.roleId].findIndex(
        (p) => p._id === action.payload.data._id
      );
      state[action.payload.data.roleId].splice(index, 1);
      return [...state];
    }

    case "LOGOUT": {
      return [];
    }

    default: {
      return state;
    }
  }
};

export default policies;
