const initialState = [];

const brandCount = (state = initialState, action) => {
  switch (action.type) {
    case "SET_BRAND_COUNT": {
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

export default brandCount;
