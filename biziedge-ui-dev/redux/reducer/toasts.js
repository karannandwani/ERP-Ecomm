const initialState = [];
const toasts = (state = initialState, action) => {
  switch (action.type) {
    case "ADD_MESSAGE": {
      if (
        state.find(
          (s) =>
            s.message === action.payload.message &&
            s.type === action.payload.type
        )
      ) {
        // already exists
        return state;
      }
      if (action.payload.timeout) {
        setTimeout(() => {
          action.asyncDispatch({
            type: "REMOVE_MESSAGE",
            payload: {
              id: action.payload.id,
            },
          });
        }, action.payload.timeout);
      }
      return [...state, action.payload];
    }

    case "REMOVE_MESSAGE": {
      return state.filter((m) => m && m.id != action.payload.id);
    }
    default:
      return state;
  }
};
export default toasts;
