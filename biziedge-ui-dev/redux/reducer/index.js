import { combineReducers } from "redux";
import user from "./user";
import token from "./token";
import toasts from "./toasts";
import loadingReqs from "./loadingReqs";
import pricelistGroups from "./priceListGroups";
import brandNames from "./brandReducer";
import products from "./productReducer";
import selectedBusiness from "./selectedBusiness";
import roles from "./role";
import policies from "./policiesRed";
import actions from "./actionRed";
import resources from "./resourcesRed";
import supplierList from "./supplierList";
import taxList from "./taxNames";
import HSN from "./hsnNumbers";
import manufacturerList from "./manufacturer";
import vehicles from "./vehiclesRed";
import beats from "./beatReducer";
import categoryList from "./categories";
import users from "./userManagementRed";
import facility from "./facility";
import country from "./country";
import states from "./states";
import menuItem from "./menuItemRed";
import roleMenuItem from "./roleMenuRed";
import order from "./order";
import brandCount from "./brandCountRed";
import selectedFacility from "../reducer/selectedFacility";
import productCount from "./productCount";
import quickDetails from "./quickDetails";
import inventory from "./inventoryReducer";
import business from "./businessRed";
import quantityNorm from "./quantityNorm";
import bills from "./billRed";
import schemes from "./schemeReducer";
import productsWithStock from "./productWithStockRed";
import returnOrders from "./retunOrderPos";
import stockMismatchReason from "./stock-mismatch-reason";
import returnCountForLast24Hour from "./returnCountForLast24Hour";
import deliveredOrder from "../reducer/deliveredOrder";
import assignVehicle from "../reducer/assignVehicle";
import draft from "./draftReducer";
import schemeVariables from "./scheme-variable-reducer";
import effectVariables from "./effect-variable-reducer";
import archiveOrder from "./archiveOrder";
import ledger from "./inventoryLedger";
import reasons from "./reasons";
import facilityUserMap from "./facility-user-map-reducer";
import productByNorm from "./productByNormRed";
import expiredProduct from "./expired-product-reducer";
import draftBills from "./draftBillRed";
import supplyOrderList from "./suplyOrders";
import procurementOrder from "./procurementOrders";
import assignedBeats from "./assignedBeats";
import leads from "./leads";
import coupon from "./couponRed";
import multipleProduct from "./uploadMultiProductRed";
import ecommerceOrders from "./ecom-order-reducer";
import driversOrders from "./driver-orders-reducer";
import code from "./forgotPassword";
import deviceToken from "./device-token-reducer";
import orderFeedbacks from "./order-feedback-reducer";
import notifications from "./notification-reducer";
import landingPageData from "./landing-page-data-reducer";
import slides from "./slide-reducer";
import driverDeliveredOrders from "./driver-delivered-orders";
import requestQueue from "./request-queue";
import staticDataList from "./static-data-reducer";

export default combineReducers({
  user,
  token,
  toasts,
  loadingReqs,
  pricelistGroups,
  brandNames,
  selectedBusiness,
  roles,
  policies,
  actions,
  resources,
  manufacturerList,
  taxList,
  HSN,
  supplierList,
  vehicles,
  beats,
  categoryList,
  users,
  facility,
  country,
  states,
  menuItem,
  roleMenuItem,
  order,
  brandCount,
  selectedFacility,
  productCount,
  quickDetails,
  products,
  inventory,
  business,
  quantityNorm,
  bills,
  schemes,
  productsWithStock,
  stockMismatchReason,
  returnOrders,
  returnCountForLast24Hour,
  deliveredOrder,
  assignVehicle,
  schemeVariables,
  effectVariables,
  draft,
  archiveOrder,
  ledger,
  reasons,
  facilityUserMap,
  productByNorm,
  expiredProduct,
  draftBills,
  supplyOrderList,
  procurementOrder,
  assignedBeats,
  leads,
  coupon,
  multipleProduct,
  ecommerceOrders,
  driversOrders,
  code,
  deviceToken,
  orderFeedbacks,
  notifications,
  landingPageData,
  slides,
  driverDeliveredOrders,
  requestQueue,
  staticDataList,
});
