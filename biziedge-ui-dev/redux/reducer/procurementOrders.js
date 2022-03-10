const initialState = [];

const procurementOrder = (state = initialState, action) => {
  switch (action.type) {
    case "FETCH_PROCUREMENT_ORDER_SUCCESS": {
      return action.payload.data;
    }
    case "FETCH_PROCUREMENT_ORDER_FAIL": {
      return state;
    }

    default: {
      return state;
    }
  }
};
export default procurementOrder;
