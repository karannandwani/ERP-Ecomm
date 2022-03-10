import { addError } from "../actions/toast.action";
const initialState = [];
const notifications = (state = initialState, action) => {
  switch (action.type) {
    case "ADD_NOTIFICATION": {
      return [...state, action.payload.data];
    }

    case "REMOVE_NOTIFICATION": {
      return [
        ...state.filter(
          (x) =>
            x.data._id != action.payload.data._id &&
            x.notification.title != action.payload.data.title
        ),
      ];
    }
    case "CLEAR_NOTIFICATIONS": {
      return [
        ...state.filter(
          (x) => x?.data?.facility !== action.payload.data?.facility
        ),
      ];
    }

    case "LOGOUT": {
      return [];
    }

    default: {
      return state;
    }
  }
};

export default notifications;
