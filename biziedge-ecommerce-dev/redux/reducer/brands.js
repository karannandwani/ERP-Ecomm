import { addError } from "../actions/toast.action";
const initialState = [];
const brands = (state = initialState, action) => {
  switch (action.type) {
    case "FETCH_BRAND_NAMES_SUCCESS": {
      return action.payload.data;
    }

    case "FETCH_BRAND_NAMES_FAIL": {
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
export default brands;
