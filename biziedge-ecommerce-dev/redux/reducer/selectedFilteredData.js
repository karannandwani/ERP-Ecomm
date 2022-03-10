const initialState = {
  manufacturers: [],
  categories: [],
  brands: [],
  text: "",
};
const filteredParams = (state = initialState, action) => {
  switch (action.type) {
    case "SET_FILTERED_DATA": {
      return action.payload.data;
    }
    case "LOGOUT": {
      return initialState;
    }
    default: {
      return state;
    }
  }
};
export default filteredParams;
