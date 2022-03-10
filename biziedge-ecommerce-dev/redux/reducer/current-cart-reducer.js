const initialState = null;

const currentCart = (state = initialState, action) => {
  switch (action.type) {
    case "CURRENT_CART": {
      return action.payload.data;
    }

    case "ADD_TO_CART_SUCCESS":
    case "UPDATE_CART_SUCCESS": {
      if (state && state._id === action.payload.data._id) {
        return action.payload.data;
      }
    }

    case "PLACE_ORDER_SUCCESS":
    case "LOGOUT": {
      return null;
    }
    default: {
      return state;
    }
  }
};

export default currentCart;
