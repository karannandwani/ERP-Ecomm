import { addError } from "../actions/toast.action";
const initialState = [];

const resources = (state = initialState, action) => {
  switch (action.type) {
    case "FETCH_RESOURCES_SUCCESS": {
      return action.payload.data;
    }
    case "FETCH_RESOURCES_FAIL": {
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

export default resources;
