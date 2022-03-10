import React, { useEffect } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { connect } from "react-redux";
import TabNavigationDesign from "./tabNavigationDesign";
import filterStack from "../navigation/filterStack";
import completeOrderStacks from "./completeOrderStacks";
import userStack from "./userProfileStack";
import { fetchOrders } from "../redux/actions/order.action";
import { fetchFacilityByBeat } from "../redux/actions/facility.action";
import { setCurrentCart } from "../redux/actions/current-cart.action";
import { fetchCart } from "../redux/actions/cart.action";
import { fetchManufacturer } from "../redux/actions/manufacturer.action";
import { fetchBrands } from "../redux/actions/brand.action";
import { fetchCategories } from "../redux/actions/productCategories.action";
import { fetchBeat, fetchBeatByLocation } from "../redux/actions/beat.action";
import { fetchAddress } from "../redux/actions/address.action";
import * as Location from "expo-location";
import { AppState, Platform } from "react-native";
import * as Notifications from "expo-notifications";
import { fetchLandingPageData } from "../redux/actions/user.action";
import userOrder from "../screens/userOrder";
import { fetchCoupon } from "../redux/actions/coupon.action";
import { useNavigation } from "@react-navigation/native";
import { fetchRazorPayKey } from "../redux/actions/business.action";
import { fetchProducts } from "../redux/actions/product.action";

const Tab = createBottomTabNavigator();

const AppStackScreen = ({
  fetchOrders,
  user,
  currentBeat,
  fetchFacilityByBeat,
  cart,
  facility,
  fetchCart,
  setCurrentCart,
  fetchManufacturer,
  fetchBrands,
  fetchCategories,
  fetchBeat,
  fetchAddress,
  fetchBeatByLocation,
  fetchLandingPageData,
  fetchCoupon,
  business,
  fetchRazorPayKey,
}) => {
  const navigation = useNavigation();
  const state = navigation.dangerouslyGetState();
  let actualRoute = state.routes[state.index];

  while (actualRoute.state) {
    actualRoute = actualRoute.state.routes[actualRoute.state.index || 0];
  }

  if (Platform.OS === "web") {
    navigator.serviceWorker.onmessage = (event) => {
      if (event) {
        notify(event.data);
        updateActionAccordingToNotification(event.data.data.operation);
      }
    };
  } else {
    Notifications.addNotificationReceivedListener((event) => {
      if (event.request.content.data) {
        updateActionAccordingToNotification(
          event.request.content.data.operation
        );
      }
    });
    Notifications.addNotificationResponseReceivedListener((event) => {
      if (event.request?.content?.data) {
        updateActionAccordingToNotification(
          event.request.content.data.operation
        );
      }
    });
  }

  const notify = () => {
    if (!globalThis.window.Notification) {
      console.log("Browser does not support notifications.");
    } else {
      if (Notification.permission === "granted") {
      } else {
        Notification.requestPermission()
          .then(function (p) {
            if (p === "granted") {
            }
          })
          .catch(function (err) {
            console.error(err);
          });
      }
    }
  };

  const updateActionAccordingToNotification = async (operation) => {
    switch (operation) {
      case "UPDATE_ORDER":
        fetchOrders({ user: user._id });
        break;
      default:
        console.log("NA");
    }
  };

  useEffect(() => {
    AppState.addEventListener("change", _handleAppStateChange);

    return () => {
      AppState.removeEventListener("change", _handleAppStateChange);
    };
  }, []);

  const _handleAppStateChange = () => {
    // if (
    //   appState.current.match(/inactive|background/) &&
    //   nextAppState === "active"
    // ) {
    //   setTimeout(() => {
    //     fetchData();
    //   }, 10);
    // }
    // appState.current = nextAppState;
  };

  useEffect(() => {
    if (business) {
      fetchData();
    }
  }, [business]);

  const fetchData = () => {
    let obj = { business: business._id };
    // fetchCoupon({ ...obj, type: "ECom" });
    // fetchOrders({ user: user._id });
    fetchManufacturer(obj);
    fetchBrands(obj);
    fetchCategories({ ...obj, type: "ecom" });
    fetchBeat(obj);
    // fetchAddress();
    // fetchProducts(obj);
    // fetchRazorPayKey({
    //   key: "RAZORPAY_KEY",
    //   business: business._id,
    // });
    fetchLandingPageData({ ...obj, active: true });
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        alert("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      fetchBeatByLocation({
        coordinates: {
          // latitude: 21.06912308335471,
          // longitude: 86.27838134765624,
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          // longitude: 85.427399,
          // latitude: 20.767443,
        },
        business: business._id,
      });
    })();
  };

  useEffect(() => {
    if (currentBeat) {
      fetchFacilityByBeat({ beat: currentBeat._id });
    }
  }, [currentBeat]);

  useEffect(() => {
    if (cart) {
      setCurrentCart(
        facility ? cart.find((x) => x.facility === facility._id) : null
      );
    }
  }, [cart, facility]);

  useEffect(() => {
    fetchCart();
  }, [user]);

  return (
    <Tab.Navigator
      tabBar={(props) => <TabNavigationDesign {...props} />}
      initialRouteName="Home"
      unmountInactiveTabs={true}
      screenOptions={{ unmountOnBlur: true }}
    >
      <Tab.Screen
        name="Home"
        component={filterStack}
        options={{
          tabBarIcon: "home",
          unmountOnBlur: true,
          backgroundColor:
            actualRoute?.name?.toLowerCase() == "product-details" ||
            actualRoute?.name?.toLowerCase() == "address"
              ? "#FA4248"
              : "#FFFFFF00",
        }}
      />

      <Tab.Screen
        name="Cart"
        component={completeOrderStacks}
        options={{
          tabBarIcon: "cart",
          unmountOnBlur: true,
          backgroundColor:
            actualRoute?.name?.toLowerCase() == "cart" ||
            actualRoute?.name?.toLowerCase() == "address"
              ? "#FA4248"
              : actualRoute?.name?.toLowerCase() == "checkoutcomplete"
              ? "transparent"
              : "#FFF",
        }}
      />
      <Tab.Screen
        name="Profile"
        component={userStack}
        options={{
          tabBarIcon: "profile",
          unmountOnBlur: true,
          backgroundColor: "transparent",
        }}
      />
      <Tab.Screen
        name="Orders"
        component={userOrder}
        options={{
          tabBarIcon: "order",
          unmountOnBlur: true,
          backgroundColor: "transparent",
        }}
      />
    </Tab.Navigator>
  );
};

const mapStateToProps = ({ user, currentBeat, cart, facility, business }) => ({
  user,
  currentBeat,
  cart,
  facility,
  business,
});
export default connect(mapStateToProps, {
  fetchOrders,
  fetchFacilityByBeat,
  fetchCart,
  setCurrentCart,
  fetchManufacturer,
  fetchBrands,
  fetchCategories,
  fetchBeat,
  fetchAddress,
  fetchBeatByLocation,
  fetchLandingPageData,
  fetchCoupon,
  fetchRazorPayKey,
  fetchProducts,
})(AppStackScreen);
