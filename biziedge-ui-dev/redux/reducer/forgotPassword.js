import { addError, addInfo } from "../actions/toast.action";

const initialState = "EMAIL";
const code = (state = initialState, action) => {
  switch (action.type) {
    case "SEND_CODE_SUCCESS": {
      return "CODE";
    }

    case "SEND_CODE_FAIL": {
      action.asyncDispatch(
        addError(action.error?.response?.data?.message, 3000)
      );
      return state;
    }
    case "VERIFY_CODE_SUCCESS": {
      return "VERIFIED";
    }
    case "CODE_INIT": {
      return "EMAIL";
    }
    case "VERIFY_CODE_FAIL": {
      action.asyncDispatch(
        addError(action.error?.response?.data?.message, 3000)
      );
      return state;
    }
    case "RESET_PASSWORD_SUCCESS": {
      if (action.payload.data.message === "Password changed!!! ") {
        action.asyncDispatch(addInfo("Password changed successfully", 3000));
        return "EMAIL";
      } else {
        return state;
      }
    }

    case "RESET_PASSWORD_FAIL": {
      action.asyncDispatch(
        addError(action.error?.response?.data?.message, 3000)
      );
      return state;
    }

    case "LOGOUT": {
      return null;
    }

    default: {
      return state;
    }
  }
};

export default code;
