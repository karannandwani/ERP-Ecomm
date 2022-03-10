const initialState = [];

const supplyOrderList = (state = initialState, action) => {
  switch (action.type) {
    case "FETCH_SUPPLY_ORDER_SUCCESS": {
      return action.payload.data;
    }
    case "FETCH_SUPPLY_ORDER_FAIL": {
      return state;
    }

    default: {
      return state;
    }
  }
};
export default supplyOrderList;
