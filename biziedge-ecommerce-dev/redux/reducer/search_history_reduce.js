const initialState = [];

const searchProductHistoryList = (state = initialState, action) => {
  switch (action.type) {
    case "SET_HISTORY_PRODUCTLIST": {
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

export default searchProductHistoryList;
