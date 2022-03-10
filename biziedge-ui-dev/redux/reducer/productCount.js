const initialState = null;

const productCount = (state = initialState, action) => {
  switch (action.type) {
    case "SET_PRODUCT_COUNT": {
      return action.payload.data;
    }

    case "LOGOUT": {
      return null;
    }

    default: {
      return state;
    }
  }
};

export default productCount;
