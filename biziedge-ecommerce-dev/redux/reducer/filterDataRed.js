const initialState = [];
const filterData = (state = initialState, action) => {
  switch (action.type) {
    case "ADD_FILTERDATA": {
      return action.payload.data;
    }

    case "LOGOUT": {
      return [];
    }

    default: {
      return state;
    }
  }
};
export default filterData;
