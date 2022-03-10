const initialState = [];

const archiveOrder = (state = initialState, action) => {
  switch (action.type) {
    case "REJECT_ORDER_SUCCESS": {
      return [...state, action.payload.data];
    }
    default: {
      return state;
    }
  }
};

export default archiveOrder;
