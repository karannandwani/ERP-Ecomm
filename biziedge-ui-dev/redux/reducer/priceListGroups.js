import { addError } from "../actions/toast.action";
const initialState = [];

const pricelistGroups = (state = initialState, action) => {
  switch (action.type) {
    case "ADD_PRICELIST_GROUP_SUCCESS": {
      let priceListGroup = state.find((a) => a._id == action.payload.data._id);
      return priceListGroup
        ? state.map((p) =>
            p._id == priceListGroup._id ? action.payload.data : p
          )
        : [...state, action.payload.data];
    }
    case "ADD_PRICELIST_GROUP_FAIL": {
      action.asyncDispatch(
        addError(action.error?.response?.data?.message, 3000)
      );
      return state;
    }
    case "FETCH_PRICELIST_NAME_SUCCESS": {
      return action.payload.data;
    }
    case "FETCH_PRICELIST_NAME_FAIL": {
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
export default pricelistGroups;
