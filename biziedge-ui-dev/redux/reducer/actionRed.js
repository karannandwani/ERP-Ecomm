const initialState = [];

const actions = (state = initialState, action) => {
  switch (action.type) {
    case "FETCH_ACTION_SUCCESS": {
      return action.payload.data;
    }
    case "FETCH_ACTION_FAIL": {
      return state;
    }

    case "LOGOUT": {
      return [];
    }

    default: {
      return state;
    }
  }
};

export default actions;