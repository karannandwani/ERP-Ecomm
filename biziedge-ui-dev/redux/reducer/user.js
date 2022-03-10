import { addError } from "../actions/toast.action";
const initialState = null;

const user = (state = initialState, action) => {
  switch (action.type) {
    case "LOGIN_SUCCESS": {
      action.asyncDispatch({
        type: "SET_DEVICE_TOKEN",
        payload: {
          user: action.payload.data._id,
        },
      });
      return action.payload.data;
    }
    case "LOGIN_FAIL": {
      action.asyncDispatch({
        type: "REMOVE_DEVICE_TOKEN",
        payload: {
          userId: state?.id,
        },
      });
      action.asyncDispatch(
        addError(action.error.response?.data?.message, 3000)
      );

      return null;
    }
    case "SIGNUP_SUCCESS": {
      return action.payload.data;
    }

    case "CHANGE_SELECTED_BUSINESS_SUCCESS": {
      let selectedBusiness = action.payload.data.businessRoleMap.find(
        (x) => x.selected
      )._id;
      return {
        ...state,
        businessRoleMap: state.businessRoleMap.map((x) =>
          x._id === selectedBusiness
            ? { ...x, selected: true }
            : { ...x, selected: false }
        ),
      };
    }

    case "LOGOUT": {
      action.asyncDispatch({
        type: "REMOVE_DEVICE_TOKEN",
        payload: {
          user: state._id,
        },
      });
      return null;
    }

    default: {
      return state;
    }
  }
};

export default user;
