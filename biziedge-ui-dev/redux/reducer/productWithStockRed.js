const initialState = [];

const productsWithStock = (state = initialState, action) => {
  switch (action.type) {
    case "FETCH_PRODUCTS_WITH_STOCK_SUCCESS": {
      return action.payload.data;
    }

    case "FETCH_PRODUCTS_WITH_STOCK_FAIL": {
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
export default productsWithStock;