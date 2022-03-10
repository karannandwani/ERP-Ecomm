import { addError } from "../actions/toast.action";
const initialState = [];

const roleMenuItem = (state = initialState, action) => {
  switch (action.type) {
    case "FETCH_ROLE_MENU_SUCCESS": {
      return action.payload.data;
    }
    case "FETCH_ROLE_MENU_FAIL": {
      action.asyncDispatch(
        addError(action.error?.response?.data?.message, 3000)
      );
      return state;
    }

    case "ADD_ROLE_MENU_SUCCESS": {
      var roleId = action.payload.data.roleId._id;
      return state[roleId]
        ? { ...state, [roleId]: [...state[roleId], action.payload.data] }
        : { ...state, [roleId]: [action.payload.data] };
    }
    case "ADD_ROLE_MENU_FAIL": {
      action.asyncDispatch(
        addError(action.error?.response?.data?.message, 3000)
      );
      return state;
    }

    case "REMOVE_ROLE_MENU_SUCCESS": {
      let index = state[action.payload.data.roleId].findIndex(
        (p) => p._id === action.payload.data._id
      );
      state[action.payload.data.roleId].splice(index, 1);
      return { ...state };
    }
    case "REMOVE_ROLE_MENU_FAIL": {
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

export default roleMenuItem;
