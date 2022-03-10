import { Platform } from "react-native";
import { addError } from "../actions/toast.action";
const initialState = [];

const products = (state = initialState, action) => {
  switch (action.type) {
    case "ADD_PRODUCT_SUCCESS": {
      let brand = state.find((a) => a._id == action.payload.data._id);
      return brand
        ? state.map((p) => (p._id == brand._id ? action.payload.data : p))
        : [...state, action.payload.data];
    }
    case "FETCH_PRODUCT_SUCCESS": {
      return action.payload.data;
    }

    case "RETURNABLE_STATUS_UPDATE_FAIL":{
      return state
    }
    case "FETCH_PRODUCT_FAIL":{
      return state
    }
    case "ADD_PRODUCT_FAIL": {
      action.asyncDispatch(
        addError(action.error?.response?.data?.message, 3000)
      );
      return state;
    }

    case "DOWNLOAD_TEMPLATE_SUCCESS": {
      if (Platform.OS == "web") {
        const url = window.URL.createObjectURL(
          new Blob([action.payload.data], {
            type: `application/${action.payload.data.type}`,
          })
        );
        const link = document.createElement("a");
        link.href = url;
        link.download = `template.${action.payload.data.type}`;
        document.body.appendChild(link);
        link.click();
        link.remove();
      }
      return state;
    }
    case "DOWNLOAD_TEMPLATE_FAIL": {
      action.asyncDispatch(
        addError(action.error?.response?.data?.message, 3000)
      );
      return state;
    }

    case "RETURNABLE_STATUS_UPDATE_SUCCESS": {
      let index = state.findIndex((x) => x._id === action.payload.data._id);
      if (index > -1) {
        state[index].returnable = action.payload.data.returnable;
      }
      return [...state];
    }

    case "MULTIPLE_PRODUCT_SUCCESS": {
      return [
        ...state,
        ...action.payload.data.filter((x) => x.remarks != "Failed"),
      ];
    }
    case "MULTIPLE_PRODUCT_FAIL": {
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
export default products;
