const initialState = [];

const requestQueue = (state = initialState, action) => {
  switch (action.type) {
    case "ADD_TO_QUEUE": {
      return [...state, action.payload.data];
    }

    case "REMOVE_REQUESTS":
    case "LOGOUT": {
      return [];
    }

    default: {
      return state;
    }
  }
};

export default requestQueue;
