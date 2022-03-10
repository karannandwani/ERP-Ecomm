const initialState = [];
const searchProductList = (state = initialState, action) => {
  switch (action.type) {
    case "FETCH_SEARCHLIST_SUCCESS": {
      return action.payload.data;
    }
    case "FETCH_SEARCHLIST_FAIL": {
      return state;
    }
    case "CLEAR_PRODUCTSEARCHLIST": {
      return [];
    }

    case "LOGOUT": {
      return null;
    }
    default: {
      return state;
    }
  }
};
export default searchProductList;
