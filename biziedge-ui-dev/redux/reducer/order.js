import { addError } from "../actions/toast.action";
const initialState = [];

const order = (state = initialState, action) => {
  switch (action.type) {
    case "FETCH_ORDER_SUCCESS": {
      return action.payload.data;
    }

    case "DELIVER_ORDER_SUCCESS": {
      return [...state.filter((x) => x._id !== action.payload.data._id)];
    }
    case "ACCEPT_ORDER_SUCCESS": {
      return state.map((o) =>
        o._id === action.payload.data._id
          ? {
            ...o,
            ...action.payload.data,
          }
          : o
      );
    }
    case "FETCH_ORDER_FAIL":
    case "GENERATE_ORDER_FAIL":
    case "ASSIGN_VEHICLE_FAIL":
    case "REJECT_ORDER_FAIL":
    case "ACCEPT_ORDER_FAIL":
    case "GENERATE_PASSWORD_FAIL": {
      showToast(action);
      return state;
    }
    case "REJECT_ORDER_SUCCESS": {
      let ord = state.filter((a) => a._id == action.payload.data._id);
      return ord;
    }

    case "ASSIGN_VEHICLE_SUCCESS": {
      return state.map((o) =>
        o._id === action.payload.data._id
          ? {
            ...o,
            vehicle: { ...o?.vehicle, _id: action.payload.data.vehicle },
          }
          : o
      );
    }

    case "GENERATE_PASSWORD_SUCCESS": {
      return state.map((o) =>
        o._id === action.payload.data._id
          ? {
            ...o,
            password: action.payload.data.password,
          }
          : o
      );
    }

    case "SAVE_ORDER_SUCCESS": {
      return [action.payload.data, ...state];
    }
    case "LOGOUT": {
      return [];
    }

    default: {
      return state;
    }
  }
};

const showToast = (action) => {
  action.asyncDispatch(addError(action.error?.response?.data?.message, 3000));
};

export default order;