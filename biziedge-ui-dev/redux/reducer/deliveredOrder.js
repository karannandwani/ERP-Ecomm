import { addError } from "../actions/toast.action";
const initialState = [];

const deliveredOrder = (state = initialState, action) => {
  switch (action.type) {
    case "DELIVER_ORDER_FAIL": {
      action.asyncDispatch(
        addError(action.error?.response?.data?.message, 3000)
      );
      return state;
    }
    default: {
      return state;
    }
  }
};

export default deliveredOrder;
