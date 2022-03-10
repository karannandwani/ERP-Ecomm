import React, { useEffect, useState, useRef } from "react";

import { createDrawerNavigator } from "@react-navigation/drawer";
import CustomSidebarMenu from "../components/sidebar/customSideBarMenu";
import Dashboard from "../screens/dashboard";
import {
  Dimensions,
  TouchableOpacity,
  Platform,
  AppState,
  View,
  Text,
} from "react-native";
import Icon from "../components/common/icon";
import { connect } from "react-redux";
import { logout } from "../redux/actions/login.action";
import PriceListGroup from "../screens/priceListGroup/priceListGroup";
import Manufacturer from "../screens/manufacturer/manufacturer";
import addBrand from "../screens/brand/brand";
import Policies from "../screens/user_management/policies";
import Vehicles from "../screens/vehicles/vehicles";
import Tax from "../screens/tax/tax";
import posBills from "../screens/sales/pos/pos";

import HsnNumber from "../screens/HSN/hsn";
import Supplier from "../screens/supplier/supplier";
import beat from "../screens/beat/beat";
import Category from "../screens/product Category/category";
import addRole from "../screens/user_management/role";
import facility from "../screens/facility/facility";
import AssignMenuItem from "../screens/user_management/roleMenuAssign";
import Users from "../screens/user_management/users";
import Inventory from "../screens/inventory/inventory";
import Order from "../screens/orderAndReturns/order";
import QuantityNorm from "../screens/quantityNorm/quantityNorm";
import CreateBill from "../screens/sales/pos/create_bill";
import ScanProduct from "../screens/sales/pos/scan-product";
import Payment from "../screens/sales/pos/payment";
import Business from "../screens/business/business";
import Country from "../screens/country/country";
import State from "../screens/state/state";
import OrderDetails from "../screens/orderAndReturns/orderDetails";
import Scheme from "../screens/scheme/schemes";
import OrderInvoice from "../screens/orderAndReturns/orderInvoice";
import EcomInvoice from "../screens/orderAndReturns/ecommerceInvoice";
import StockMismatchReason from "../screens/stock-mismatch-reason/stock-mismatch-reason";
import OrderReturns from "../screens/orderAndReturns/orderReturns";
import BillDetails from "../screens/sales/pos/bill_detail";
import ReturnDetails from "../screens/orderAndReturns/return-details";
import SchemeVariable from "../screens/scheme-variable/scheme-variable";
import EffectVariable from "../screens/effect-variable/effect-variable";
import AddScheme from "../screens/scheme/scheme-modal";
import InventoryDetails from "../screens/inventory/inventory-details";
import GenerateOrder from "../screens/inventory/generate-order";
import Coupon from "../screens/Coupon/coupon";
import BillInvoice from "../screens/sales/pos/bill-invoice";
import ReturnInvoice from "../screens/orderAndReturns/return-invoice";
import Avatar from "../components/common/avatar";
import AssignBeat from "../screens/assignBeat/assignBeat";
import AssignBeatComponent from "../screens/assignBeat/assignBeatComponent";
import AddProduct from "../screens/product/add-product";
import {
  fetchInventory,
  fetchInventoryLedger,
} from "../redux/actions/inventory.action";
import { fetchDraftList } from "../redux/actions/draft-order.action";
import { fetchExpiredProduct } from "../redux/actions/expired-product.action";
import GenerateLead from "../screens/leadGenerate/leadGenerate";
import CreateLead from "../screens/leadGenerate/createLead";
import { fetchBill, fetchDraftBill } from "../redux/actions/bill.action";
import { setSelectedBusiness } from "../redux/actions/selectedBusiness.action";
import { setSelectedFacility } from "../redux/actions/selectedFacility.action";
import { fetchOrder } from "../redux/actions/order.action";
import { fetchUser } from "../redux/actions/user.action";
import { fetchRoles } from "../redux/actions/role.action";
import { fetchState } from "../redux/actions/states.action";
import { fetchCountry } from "../redux/actions/country.action";
import ReturnProduct from "../screens/inventory/return-product";
import ExpiredProductDetails from "../screens/inventory/expiry-product-details";
import Product from "../screens/product/product";
import { fetchManufacturer } from "../redux/actions/manufacturer.action";
import { fetchHSN } from "../redux/actions/hsn.action";
import { fetchBrands } from "../redux/actions/brand.action";
import { fetchPricelistGroupNames } from "../redux/actions/priceListGroup.action";
import { fetchTaxNames } from "../redux/actions/tax.action";
import { fetchProducts } from "../redux/actions/propduct.action";
import { fetchProductCategories } from "../redux/actions/category.action";
import { fetchFacility } from "../redux/actions/facility.action";
import { assignedUserOfFacilities } from "../redux/actions/facility-user-map.action";
import { fetchSupplier } from "../redux/actions/supplier.action";
import { fetchVehicles } from "../redux/actions/vehicles.action";
import { fetchReturnOrders } from "../redux/actions/return.action";
import { fetchEcomOrder } from "../redux/actions/ecom-order.action";
import DeliveryOrders from "../screens/deliver-orders/delivery-orders";
import {
  fetchDriverOrders,
  driverDeliveredOrders,
} from "../redux/actions/delivery-order.action";
import { fetchOrderFeedback } from "../redux/actions/order-feedback.acttion";
import DeliveredOrders from "../screens/deliver-orders/delivered-orders";
import * as Notifications from "expo-notifications";
import OrderFeedback from "../screens/allOrderFeedback/allOrderFeedback";
import LandingPageData from "../screens/landing-page/landing-page";
import { fetchSchemes } from "../redux/actions/scheme.action";
import {
  fetchMenuItem,
  fetchRoleMenu,
  fetchPolicies,
} from "../redux/actions/policies.action";
import { fetchBeat } from "../redux/actions/beat.action";
import { fetchSlide } from "../redux/actions/slide.action";
import { fetchLandingPageData } from "../redux/actions/landing-page-data.action";
import { addNotification } from "../redux/actions/notifications.action";
import { fetchCouponName } from "../redux/actions/coupon.action";
const AppStack = createDrawerNavigator();
const windowDim = Dimensions.get("window");
const screen = Dimensions.get("screen");
import axios from "axios";
import config from "../config/config";
import NetInfo from "@react-native-community/netinfo";
import { fetchStaticData } from "../redux/actions/static-data.action";
import StaticData from "../screens/staticData/static-data";

const NavigationDrawerStructure = ({ navigation }) => {
  return (
    <TouchableOpacity
      onPress={() => {
        navigation.toggleDrawer();
      }}
      style={{
        marginLeft: 20,
      }}
    >
      <Icon name="sideMenu" />
    </TouchableOpacity>
  );
};
var isConnected = false;
const AppStackScreen = ({
  logout,
  selectedBusiness,
  fetchInventory,
  fetchDraftList,
  fetchExpiredProduct,
  setSelectedFacility,
  setSelectedBusiness,
  fetchDraftBill,
  fetchBill,
  user,
  fetchOrder,
  fetchInventoryLedger,
  fetchUser,
  fetchRoles,
  fetchCountry,
  fetchState,
  fetchManufacturer,
  fetchHSN,
  fetchBrands,
  fetchPricelistGroupNames,
  fetchTaxNames,
  fetchProducts,
  fetchProductCategories,
  fetchFacility,
  assignedUserOfFacilities,
  fetchSupplier,
  fetchVehicles,
  fetchReturnOrders,
  fetchEcomOrder,
  fetchDriverOrders,
  driverDeliveredOrders,
  selectedFacility,
  fetchOrderFeedback,
  fetchSchemes,
  fetchMenuItem,
  fetchRoleMenu,
  fetchBeat,
  fetchSlide,
  fetchLandingPageData,
  notifications,
  addNotification,
  fetchCouponName,
  fetchStaticData,
}) => {
  const [dimensions, setDimensions] = useState({ window: windowDim, screen });
  const [width, setWidth] = useState(dimensions.window.width);
  const appState = useRef(AppState.currentState);
  const [connected, setConnected] = useState(false);

  const onChange = ({ window, screen }) => {
    setDimensions({ window, screen });
    setWidth(window.width);
  };

  const client = axios.create({
    baseURL: config.baseUrl,
    responseType: "json",
  });

  client.interceptors.request.use((req) => {
    req.baseURL = config.baseUrl;
    req.timeout = 60000;
    if (user && user.token) {
      const token = user.token;
      req.headers.common.Authorization = `Bearer ${token}`;
    }
    return req;
  });

  const longPolling = () => {
    if (user.token && isConnected) {
      client.get("/api/notification").then(
        (result) => {
          if (result.data && result.data?.length > 0) {
            result.data.forEach((x) => updateActionAccordingToNotification(x));
          }
          longPolling();
        },
        (error) => {
          console.error(error);
          setTimeout(() => {
            longPolling();
          }, 1000 * (error.message == "Network Error" ? 8 : 1));
        }
      );
    }
  };

  if (Platform.OS === "web") {
    navigator.serviceWorker.onmessage = (event) => {
      if (event) {
        if (event.data.data.navigation) {
          addNotification(event.data);
        }
        notify(event.data);
        updateActionAccordingToNotification(event.data.data.operation);
      }
    };
  } else {
    Notifications.addNotificationReceivedListener((event) => {
      if (event.request.content.data) {
        if (event.request.content.data.navigation) {
          addNotification(event.request.content.data);
        }
        updateActionAccordingToNotification(
          event.request.content.data.operation
        );
      }
    });
    Notifications.addNotificationResponseReceivedListener((event) => {
      if (event.request?.content?.data) {
        if (event.request.content.data.navigation) {
          addNotification(event.request.content.data);
        }
        updateActionAccordingToNotification(
          event.request.content.data.operation
        );
      }
    });
  }

  const notify = (data) => {
    if (!globalThis.window.Notification) {
      console.log("Browser does not support notifications.");
    } else {
      if (Notification.permission === "granted") {
        var notify = new Notification(data.notification.title, {
          body: data.notification.body,
          icon: "",
        });
      } else {
        Notification.requestPermission()
          .then(function (p) {
            if (p === "granted") {
              var notify = new Notification(data.notification.title, {
                body: data.notification.body,
                icon: "",
              });
            }
          })
          .catch(function (err) {
            console.error(err);
          });
      }
    }
  };

  useEffect(() => {
    longPolling();
    fetchData();
  }, []);

  useEffect(() => {
    var unsubscribe;
    function updateOnlineStatus(event) {
      if (!connected && navigator.onLine) {
        longPolling();
      }
      setConnected(navigator.onLine ? "online" : "offline");
      isConnected = navigator.onLine ? "online" : "offline";
    }
    if (Platform.OS === "web") {
      window.addEventListener("online", updateOnlineStatus);
      window.addEventListener("offline", updateOnlineStatus);
      setConnected(navigator.onLine ? "online" : "offline");
      isConnected = navigator.onLine ? "online" : "offline";
      if (navigator.onLine) {
        setTimeout(longPolling, 3000);
      }
    } else {
      unsubscribe = NetInfo.addEventListener((state) => {
        if (!connected && state.isConnected) {
          longPolling();
        }
        setConnected(state.isConnected);
        isConnected = state.isConnected;
      });
      NetInfo.fetch().then((state) => {
        setConnected(state.isConnected);
        isConnected = state.isConnected;
        if (state.isConnected) {
          setTimeout(longPolling, 3000);
        }
      });
    }

    AppState.addEventListener("change", _handleAppStateChange);
    return () => {
      if (Platform.OS == "web") {
        window.removeEventListener("online", updateOnlineStatus);
        window.removeEventListener("offline", updateOnlineStatus);
      }
      if (unsubscribe /* && Platform.OS != "web"*/) {
        unsubscribe();
      }
      AppState.removeEventListener("change", _handleAppStateChange);
    };
  }, []);

  const _handleAppStateChange = (nextAppState) => {
    if (
      appState.current.match(/inactive|background/) &&
      nextAppState === "active"
    ) {
      setTimeout(() => {
        fetchData();
      }, 10);
    }
    appState.current = nextAppState;
  };

  const updateActionAccordingToNotification = async (operation) => {
    if (selectedBusiness)
      switch (operation) {
        case "FETCH_ORDER":
          fetchOrderAccrdingToLoginUser();
          break;
        case "INVENTORY_REFRESH":
          fetchInventoryAccrdingToLoginUser();
          break;
        case "FETCH_ECOM_ORDER":
          fetchEcomOrderAccrdingToLoginUser();
          break;
        case "CATEGORY_REFRESH":
          fetchCategoryAccrdingToLoginUser();
          break;
        case "HSN_REFRESH":
          fetchHsnAccrdingToLoginUser();
          break;
        case "PLG_REFRESH":
          fetchPricelistAccrdingToLoginUser();
          break;
        case "MANUFACTURER_REFRESH":
          fetchManufacturerAccrdingToLoginUser();
          break;
        case "BRAND_REFRESH":
          fetchBrandAccrdingToLoginUser();
          break;
        default:
          console.log("NA");
      }
  };

  useEffect(() => {
    Dimensions.addEventListener("change", onChange);
    return () => {
      Dimensions.removeEventListener("change", onChange);
    };
  });

  useEffect(() => {
    if (!selectedBusiness || !selectedBusiness._id) {
      let selected =
        user?.businessRoleMap?.find((x) => x.selected) ||
        user?.businessRoleMap[0];
      setSelectedBusiness(selected);
      if (selected.facilities && selected.facilities.length > 0)
        setSelectedFacility(
          selected.facilities.find((x) => x._id === user.selectedFacility) ||
            selected.facilities[0]
        );
    }
  }, [!selectedBusiness]);

  useEffect(() => {
    fetchData();
  }, [selectedBusiness]);

  const fetchData = () => {
    if (selectedBusiness) {
      if (selectedBusiness?.roles?.find((x) => x.name === "Business")) {
        let obj = {
          business: selectedBusiness.business._id,
        };
        fetchRoleMenu(selectedBusiness.business._id);
        fetchPolicies(selectedBusiness.business._id);
        fetchManufacturer(obj);
        fetchHSN(obj);
        fetchBrands(obj);
        fetchPricelistGroupNames(obj);
        fetchTaxNames(obj);
        fetchProductCategories(obj);
        fetchFacility(obj);
        assignedUserOfFacilities(obj);
        fetchSupplier(obj);
        fetchSchemes(obj);
        fetchBeat(obj);
        fetchSlide(obj);
        fetchLandingPageData(obj);
        fetchStaticData(obj);
      }
      if (
        selectedBusiness?.roles?.find(
          (x) => x.name === "Business" || x.name === "Facility"
        )
      ) {
        let obj = {
          business: selectedBusiness.business._id,
        };
        fetchCouponName({
          ...obj,
          pageNo: 0,
          pageSize: 15,
        });
        fetchProducts(obj);
      }
      fetchOrderAccrdingToLoginUser();
      fetchInventoryAccrdingToLoginUser();
      fetchBillAccrdingToLoginUser();
      fetchEcomOrderAccrdingToLoginUser();
      fetchVehicleAccrdingToLoginUser();
      fetchReturnOrdersAccrdingToLoginUser();
      fetchUsersAccrdingToLoginUser();
      fetchOrderFeedbackAccordingToLoginUser();

      if (selectedBusiness?.roles?.find((x) => x.name === "Driver")) {
        fetchDriverOrders({ driver: user._id, type: "Active" });
        driverDeliveredOrders({ driver: user._id, type: "Delivered" });
      }
      if (
        !selectedBusiness?.roles?.find((x) => x.name === "Business") &&
        selectedBusiness.facilities &&
        selectedBusiness.facilities.length > 0
      ) {
        let obj = {
          facilities: selectedBusiness.facilities.map((x) => x._id),
          business: selectedBusiness.business._id,
        };
        fetchDraftList(obj);
        fetchExpiredProduct(obj);
        fetchDraftBill(obj);
      }
    }
    //universal data
    fetchState();
    fetchCountry();
    fetchRoles();
    fetchMenuItem();
  };

  const fetchOrderFeedbackAccordingToLoginUser = () => {
    createFetchRequest()
      .then((result) => {
        if (result) {
          fetchOrderFeedback(result);
        }
      })
      .catch((error) => console.error(error));
  };

  const fetchUsersAccrdingToLoginUser = () => {
    createFetchRequest()
      .then((result) => {
        if (result) {
          fetchUser(result);
        }
      })
      .catch((error) => console.error(error));
  };

  const fetchReturnOrdersAccrdingToLoginUser = () => {
    createFetchRequest()
      .then((result) => {
        if (result) {
          fetchReturnOrders(result);
        }
      })
      .catch((error) => console.error(error));
  };

  const fetchVehicleAccrdingToLoginUser = () => {
    createFetchRequest()
      .then((result) => {
        if (result) {
          fetchVehicles(result);
        }
      })
      .catch((error) => console.error(error));
  };

  const fetchOrderAccrdingToLoginUser = () => {
    createFetchRequest()
      .then((result) => {
        if (result) {
          fetchOrder({ ...result, type: "Active" });
        }
      })
      .catch((error) => console.error(error));
  };

  const fetchInventoryAccrdingToLoginUser = () => {
    createFetchRequest()
      .then((result) => {
        if (result) {
          fetchInventory(result);
          fetchInventoryLedger(result);
        }
      })
      .catch((error) => console.error(error));
  };

  const fetchCategoryAccrdingToLoginUser = () => {
    createFetchRequest()
      .then((result) => {
        if (result) {
          fetchProductCategories(result);
        }
      })
      .catch((error) => console.error(error));
  };

  const fetchHsnAccrdingToLoginUser = () => {
    createFetchRequest()
      .then((result) => {
        if (result) {
          fetchHSN(result);
        }
      })
      .catch((error) => console.error(error));
  };
  const fetchPricelistAccrdingToLoginUser = () => {
    createFetchRequest()
      .then((result) => {
        if (result) {
          fetchPricelistGroupNames(result);
        }
      })
      .catch((error) => console.error(error));
  };
  const fetchManufacturerAccrdingToLoginUser = () => {
    createFetchRequest()
      .then((result) => {
        if (result) {
          fetchManufacturer(result);
        }
      })
      .catch((error) => console.error(error));
  };
  const fetchBrandAccrdingToLoginUser = () => {
    createFetchRequest()
      .then((result) => {
        if (result) {
          fetchBrands(result);
        }
      })
      .catch((error) => console.error(error));
  };

  const fetchBillAccrdingToLoginUser = () => {
    createFetchRequest()
      .then((result) => {
        if (result) {
          fetchBill(result);
        }
      })
      .catch((error) => console.error(error));
  };

  const fetchEcomOrderAccrdingToLoginUser = () => {
    createFetchRequest()
      .then((result) => {
        if (result) {
          fetchEcomOrder(result);
        }
      })
      .catch((error) => console.error(error));
  };

  const createFetchRequest = () =>
    new Promise((resolve, reject) => {
      try {
        if (
          selectedBusiness?.roles?.find((x) => x.name === "Business") &&
          selectedBusiness.facilities &&
          selectedBusiness.facilities.length > 0
        ) {
          resolve({
            business: selectedBusiness.business._id,
            facilities: selectedBusiness.facilities.map((x) => x._id),
            type: "Business",
          });
        } else if (
          !selectedBusiness?.roles?.find((x) => x.name === "Business") &&
          selectedBusiness.facilities &&
          selectedBusiness.facilities.length > 0
        ) {
          resolve({
            facilities: selectedBusiness.facilities.map((x) => x._id),
            business: selectedBusiness.business._id,
          });
        } else if (
          selectedBusiness?.roles?.find((x) => x.name === "Business") &&
          (!selectedBusiness.facilities ||
            selectedBusiness.facilities.length === 0)
        ) {
          resolve({
            business: selectedBusiness.business._id,
            type: "Business",
          });
        }
      } catch (e) {
        console.error(e);
        reject(e);
      }
    });

  return selectedBusiness ? (
    <AppStack.Navigator
      drawerContentOptions={{
        activeTintColor: "#e91e63",
        itemStyle: { marginVertical: 5 },
      }}
      screenOptions={({ navigation }) => ({
        drawerIcon: () => <Icon name="sideMenu" />,
        headerShown: true,
        headerLeft: () =>
          width > 860 ? (
            <></>
          ) : (
            <NavigationDrawerStructure navigation={navigation} />
          ),
        headerStyle: {
          backgroundColor: "#fff", //Set Header color
        },
        headerTintColor: "#000", //Set Header text color.
        headerTitleStyle: {
          maxWidth: width > 860 ? "100%" : 170,
          fontWeight: "bold", //Set Header text style
        },
        headerRight: () => (
          <View style={{ flexDirection: "row" }}>
            <View style={{ flex: 7, marginTop: 10 }}>
              <Avatar
                borderColor={connected ? "rgb(124,252,0)" : "#ffd500"}
                navigation={navigation}
                logout={logout}
                style={{ marginLeft: 3 }}
              />

              {connected ? (
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    borderRadius: 25,
                    // backgroundColor: "#f1f1f1",
                    justifyContent: "space-between",

                    marginRight: 15,
                    marginBottom: 5,
                  }}
                >
                  <Text style={{ marginLeft: 5, fontSize: 12 }}>Online</Text>
                </View>
              ) : (
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    borderRadius: 25,
                    // backgroundColor: "#f1f1f1",
                    justifyContent: "space-between",

                    marginRight: 15,
                    marginBottom: 5,
                  }}
                >
                  <Text style={{ marginLeft: 5, fontSize: 12 }}>Offline</Text>
                </View>
              )}
            </View>
            <TouchableOpacity
              onPress={() => fetchData()}
              style={{
                alignSelf: "center",
                flex: 3,
                marginRight: Platform.OS === "web" ? 17 : 7,
              }}
            >
              <Icon
                name="refresh"
                fill={"rgb(67, 66, 93)"}
                style={{
                  width: 50,
                  height: 50,
                  marginTop: 12,
                }}
              ></Icon>
            </TouchableOpacity>
          </View>
        ),
      })}
      sceneContainerStyle={{
        overflow: "hidden",
        marginBottom: 10,
      }}
      drawerType={width > 860 ? "permanent" : "front"}
      drawerContent={(props) => <CustomSidebarMenu {...props} />}
    >
      <AppStack.Screen
        component={Dashboard}
        name="dashboard"
        options={{ title: "Dashboard" }}
      ></AppStack.Screen>
      <AppStack.Screen
        component={Policies}
        name="policies"
        options={{ title: "Policies", unmountOnBlur: true }}
      ></AppStack.Screen>
      <AppStack.Screen
        component={Manufacturer}
        name="manufacturer"
        options={{ title: "Manufacturer", unmountOnBlur: true }}
      ></AppStack.Screen>
      <AppStack.Screen
        component={PriceListGroup}
        name="pricelist-group"
        options={{ title: "Pricelist Group", unmountOnBlur: true }}
      ></AppStack.Screen>
      <AppStack.Screen
        component={Tax}
        name="tax"
        options={{ title: "Tax", unmountOnBlur: true }}
      ></AppStack.Screen>
      <AppStack.Screen
        component={posBills}
        name="pos"
        options={{ title: "Bills", unmountOnBlur: true }}
      ></AppStack.Screen>
      <AppStack.Screen
        component={addBrand}
        name="brand"
        options={{ title: "Brand", unmountOnBlur: true }}
      ></AppStack.Screen>
      <AppStack.Screen
        component={Vehicles}
        name="vehicle"
        options={{ title: "Vehicles", unmountOnBlur: true }}
      ></AppStack.Screen>
      <AppStack.Screen
        component={HsnNumber}
        name="hsn"
        options={{ title: "HSN", unmountOnBlur: true }}
      ></AppStack.Screen>
      <AppStack.Screen
        component={Supplier}
        name="supplier"
        options={{ title: "Supplier", unmountOnBlur: true }}
      ></AppStack.Screen>
      <AppStack.Screen
        component={beat}
        name="beat"
        options={{ title: "Beat", unmountOnBlur: true }}
      ></AppStack.Screen>
      <AppStack.Screen
        component={addRole}
        name="role"
        options={{ title: "Role", unmountOnBlur: true }}
      ></AppStack.Screen>
      <AppStack.Screen
        component={Category}
        name="category"
        options={{ title: "Category", unmountOnBlur: true }}
      ></AppStack.Screen>
      <AppStack.Screen
        component={Product}
        name="product"
        options={{ title: "Products", unmountOnBlur: true }}
      ></AppStack.Screen>
      <AppStack.Screen
        component={facility}
        name="warehouse"
        options={{ title: "Facility", unmountOnBlur: true }}
      ></AppStack.Screen>
      <AppStack.Screen
        component={QuantityNorm}
        name="quantity-norm"
        options={{ title: "Quantity Norm", unmountOnBlur: true }}
      ></AppStack.Screen>
      <AppStack.Screen
        component={AssignMenuItem}
        name="role-menu"
        options={{ title: "Assign Menu Item", unmountOnBlur: true }}
      ></AppStack.Screen>
      <AppStack.Screen
        component={Users}
        name="users"
        options={{ title: "Users", unmountOnBlur: true }}
      ></AppStack.Screen>
      <AppStack.Screen
        component={Inventory}
        name="inventory"
        options={{ title: "Inventory", unmountOnBlur: true }}
      ></AppStack.Screen>
      <AppStack.Screen
        component={InventoryDetails}
        name="inventory-details"
        options={{ title: "Inventory Details", unmountOnBlur: true }}
      ></AppStack.Screen>
      <AppStack.Screen
        component={Order}
        name="orders"
        options={{ title: "Orders" }}
      ></AppStack.Screen>
      <AppStack.Screen
        component={Business}
        name="business"
        options={{ title: "Business" }}
      ></AppStack.Screen>
      <AppStack.Screen
        component={Country}
        name="country"
        options={{ title: "Country" }}
      ></AppStack.Screen>
      <AppStack.Screen
        component={State}
        name="state"
        options={{ title: "State" }}
      ></AppStack.Screen>
      <AppStack.Screen
        component={StockMismatchReason}
        name="stock-mismatch-reason"
        options={{ title: "Stock Mismatch Reason" }}
      ></AppStack.Screen>
      <AppStack.Screen
        component={BillDetails}
        name="billDetails"
        options={{ title: "Bill Details" }}
      ></AppStack.Screen>
      <AppStack.Screen
        component={CreateBill}
        name="createBill"
        options={{ title: "Create Bill", unmountOnBlur: true }}
      ></AppStack.Screen>
      <AppStack.Screen
        component={ScanProduct}
        name="scanProduct"
        options={{ title: "Scan Product" }}
      ></AppStack.Screen>
      <AppStack.Screen
        component={Payment}
        name="payment"
        options={{ title: "Payment" }}
      ></AppStack.Screen>
      <AppStack.Screen
        component={OrderDetails}
        name="orderDetails"
        options={{ title: "Order Details", unmountOnBlur: true }}
      ></AppStack.Screen>
      <AppStack.Screen
        component={ReturnDetails}
        name="return-details"
        options={{ title: "Return Details", unmountOnBlur: true }}
      ></AppStack.Screen>
      <AppStack.Screen
        component={Scheme}
        name="schemes"
        options={{ title: "Schemes" }}
      ></AppStack.Screen>
      <AppStack.Screen
        component={OrderInvoice}
        name="orderInvoice"
        options={{ title: "Invoice" }}
      ></AppStack.Screen>
      <AppStack.Screen
        component={EcomInvoice}
        name="ecomInvoice"
        options={{ title: "Ecommerce Invoice" }}
      ></AppStack.Screen>
      <AppStack.Screen
        component={OrderReturns}
        name="returns"
        options={{ title: "Returns" }}
      ></AppStack.Screen>
      <AppStack.Screen
        component={SchemeVariable}
        name="scheme_variable"
        options={{ title: "Scheme Variable" }}
      ></AppStack.Screen>
      <AppStack.Screen
        component={EffectVariable}
        name="effect_variable"
        options={{ title: "Effect Variable" }}
      ></AppStack.Screen>
      <AppStack.Screen
        component={AddScheme}
        name="schemeModal"
        options={{ title: "Scheme" }}
      ></AppStack.Screen>
      <AppStack.Screen
        component={GenerateOrder}
        name="generateOrder"
        options={{ title: "Generate Order", unmountOnBlur: true }}
      ></AppStack.Screen>
      <AppStack.Screen
        component={AssignBeat}
        name="assign_beats"
        options={{ title: "Assign Beat" }}
      ></AppStack.Screen>
      <AppStack.Screen
        component={AssignBeatComponent}
        name="assignBeatComponent"
        options={{ headerShown: false }}
      ></AppStack.Screen>
      <AppStack.Screen
        component={GenerateLead}
        name="lead_generate"
        options={{ title: "Generate Lead" }}
      ></AppStack.Screen>
      <AppStack.Screen
        component={CreateLead}
        name="create_lead"
        options={{ title: "Create Lead" }}
      ></AppStack.Screen>
      <AppStack.Screen
        component={Coupon}
        name="coupon"
        options={{ title: "coupon" }}
      ></AppStack.Screen>
      <AppStack.Screen
        component={BillInvoice}
        name="bill-invoice"
        options={{ title: "Bill Invoice" }}
      ></AppStack.Screen>
      <AppStack.Screen
        component={ReturnProduct}
        name="return_product"
        options={{ title: "Return Product", unmountOnBlur: true }}
      ></AppStack.Screen>
      <AppStack.Screen
        component={ExpiredProductDetails}
        name="expired-product-details"
        options={{ title: "Expired Product Details" }}
      ></AppStack.Screen>
      <AppStack.Screen
        component={AddProduct}
        name="add-products"
        options={{ title: "Manage Product", unmountOnBlur: true }}
      ></AppStack.Screen>
      <AppStack.Screen
        component={ReturnInvoice}
        name="return-invoice"
        options={{ title: "Return Invoice", unmountOnBlur: true }}
      ></AppStack.Screen>
      <AppStack.Screen
        component={DeliveryOrders}
        name="delivery-orders"
        options={{ title: "Delivery Order", unmountOnBlur: true }}
      ></AppStack.Screen>
      <AppStack.Screen
        component={DeliveredOrders}
        name="delivered-orders"
        options={{ title: "Delivered Order", unmountOnBlur: true }}
      ></AppStack.Screen>
      <AppStack.Screen
        component={OrderFeedback}
        name="order-feedbacks"
        options={{ title: "Order Feedbacks", unmountOnBlur: true }}
      ></AppStack.Screen>
      <AppStack.Screen
        component={LandingPageData}
        name="landing-page"
        options={{ title: "Landing Page", unmountOnBlur: true }}
      ></AppStack.Screen>
      <AppStack.Screen
        component={StaticData}
        name="static-data"
        options={{ title: "Static Data", unmountOnBlur: true }}
      ></AppStack.Screen>
    </AppStack.Navigator>
  ) : (
    <></>
  );
};
const mapStateToProps = ({
  selectedBusiness,
  user,
  selectedFacility,
  notifications,
}) => ({
  selectedBusiness,
  user,
  selectedFacility,
  notifications,
});
export default connect(mapStateToProps, {
  logout,
  fetchInventory,
  fetchDraftList,
  fetchExpiredProduct,
  setSelectedBusiness,
  setSelectedFacility,
  fetchBill,
  fetchDraftBill,
  fetchOrder,
  fetchInventoryLedger,
  fetchUser,
  fetchRoles,
  fetchCountry,
  fetchState,
  fetchManufacturer,
  fetchHSN,
  fetchBrands,
  fetchPricelistGroupNames,
  fetchTaxNames,
  fetchProducts,
  fetchProductCategories,
  fetchFacility,
  assignedUserOfFacilities,
  fetchSupplier,
  fetchVehicles,
  fetchReturnOrders,
  fetchEcomOrder,
  fetchDriverOrders,
  driverDeliveredOrders,
  fetchOrderFeedback,
  fetchSchemes,
  fetchMenuItem,
  fetchRoleMenu,
  fetchBeat,
  fetchSlide,
  fetchLandingPageData,
  addNotification,
  fetchCouponName,
  fetchStaticData,
})(AppStackScreen);
