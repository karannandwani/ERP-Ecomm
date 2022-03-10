const initialState = [];

const multipleProduct = (state = initialState, action) => {
  switch (action.type) {
    case "MULTIPLE_PRODUCT_SUCCESS": {
      return action.payload.data;
    }
    case "MULTIPLE_PRODUCT_FAIL": {
      return state;
    }

    case "LOGOUT": {
      return initialState;
    }

    default: {
      return state;
    }
  }
};

export default multipleProduct;
