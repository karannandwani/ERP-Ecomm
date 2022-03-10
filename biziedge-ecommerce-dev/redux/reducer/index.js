import { combineReducers } from "redux";
import categories from "./productCategories";
import products from "./products";
import brands from "./brands";
import manufacturerList from "./manufacturer";
import token from "./token";
import cart from "./cart-reducer";
import otp from "./otp-reducer";
import filteredParams from "./selectedFilteredData";
import areas from "./beat";
import facility from "./facility-reducer";
import currentCart from "./current-cart-reducer";
import addresses from "./address-reducer";
import orders from "./order-reducer";
import currentBeat from "./current-beat";
import searchProductList from "./searchList_reducer";
import searchProductHistoryList from "./search_history_reduce";
import deviceToken from "./device-token-reducer";
import user from "./user";
import landingPageData from "./landing-page-reducer";
import coupons from "./couponReducer";
import toasts from "./toasts";
import currentOrder from "./current-order-reducer";
import business from "./business-reducer";
import razorPayDetails from "./razorpay-reducer";
import loadingReqs from "./loadingRequest";

export default combineReducers({
  user,
  categories,
  products,
  brands,
  manufacturerList,
  token,
  cart,
  otp,
  filteredParams,
  facility,
  currentCart,
  addresses,
  orders,
  areas,
  currentBeat,
  searchProductList,
  searchProductHistoryList,
  deviceToken,
  landingPageData,
  coupons,
  toasts,
  currentOrder,
  business,
  razorPayDetails,
  loadingReqs,
});
