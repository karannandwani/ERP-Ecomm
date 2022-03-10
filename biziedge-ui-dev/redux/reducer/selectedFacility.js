const initialState = null;

const selectedFacility = (state = initialState, action) => {
  switch (action.type) {
    case "SELECTED_FACILITY": {
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

export default selectedFacility;
