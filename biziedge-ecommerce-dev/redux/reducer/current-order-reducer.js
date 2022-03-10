const initialState = null;

const currentOrder = (state = initialState, action) => {
  switch (action.type) {
    case "PLACE_ORDER_SUCCESS": {
      return action.payload.data;
    }

    case "REMOVE_CURRENT_ORDER": {
      return null;
    }

    case "LOGOUT": {
      return null;
    }
    default: {
      return state;
    }
  }
};

export default currentOrder;
