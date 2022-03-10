import { addError } from "../actions/toast.action";
const initialState = [];
const landingPageData = (state = initialState, action) => {
  switch (action.type) {
    case "FETCH_LANDING_PAGE_DATA_SUCCESS": {
      return action.payload.data;
    }

    case "LOGOUT": {
      return [];
    }

    default: {
      return state;
    }
  }
};
export default landingPageData;
