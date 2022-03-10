import { addError } from "../actions/toast.action";
const initialState = [];

const menuItem = (state = initialState, action) => {
  switch (action.type) {
    case "FETCH_MENU_ITEM_SUCCESS": {
      return action.payload.data;
    }
    case "FETCH_MENU_ITEM_FAIL": {
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

export default menuItem;
