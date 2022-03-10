const initialState = {};

const selectedBusiness = (state = initialState, action) => {
  switch (action.type) {
    case "SET_SELECTED_BUSINESS": {
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

export default selectedBusiness;
