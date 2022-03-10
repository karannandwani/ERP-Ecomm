const initialState = {};
const paymentsDetails = (state = initialState, action) => {
  switch (action.type) {
    case "ADD_PAYMENT": {
      return action.payload.data;
    }

    default: {
      return state;
    }
  }
};

export default paymentsDetails;
