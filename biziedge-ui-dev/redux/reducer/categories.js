import { addError } from "../actions/toast.action";
const initialState = [];

const categoryList = (state = initialState, action) => {
  switch (action.type) {
    case "ADD_CATEGORY_SUCCESS": {
      let category = state.find((a) => a._id == action.payload.data._id);
      return category
        ? state.map((p) => (p._id == category._id ? action.payload.data : p))
        : [...state, action.payload.data];
    }

    case "ADD_CATEGORY_FAIL": {
      action.asyncDispatch(
        addError(action.error?.response?.data?.message, 3000)
      );
      return state;
    }

    case "FETCH_CATEGORIES_SUCCESS": {
      return action.payload.data;
    }

    case "FETCH_CATEGORIES_FAIL": {
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
export default categoryList;
