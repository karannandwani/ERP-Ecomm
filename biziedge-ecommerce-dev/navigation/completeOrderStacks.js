import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Checkout from "../screens/Checkout/Checkout";
import CheckoutPhase2 from "../screens/Checkout/CheckoutPhase2";
import CheckoutSummary from "../screens/Checkout/CheckoutSummary";
import shoppingCart from "../screens/shoppingCart/shoppingCart";
import CheckoutComplete from "../screens/Checkout/CheckoutComplete";
import OrderTracking from "../screens/Checkout/orderTracking";
import { connect } from "react-redux";
import coupon from "../screens/shoppingCart/coupon";

const CompleteOrderStack = createStackNavigator();

const completeOrderStacks = ({ cart }) => {
  return cart?.length > 0 ? (
    <CompleteOrderStack.Navigator initialRouteName="cart">
      <CompleteOrderStack.Screen
        component={shoppingCart}
        options={{ headerShown: false }}
        name="cart"
      ></CompleteOrderStack.Screen>
      <CompleteOrderStack.Screen
        component={coupon}
        options={{ headerShown: false }}
        name="coupon"
      ></CompleteOrderStack.Screen>
      <CompleteOrderStack.Screen
        component={Checkout}
        options={{ headerShown: false }}
        name="address"
      ></CompleteOrderStack.Screen>
      <CompleteOrderStack.Screen
        component={CheckoutPhase2}
        options={{ headerShown: false }}
        name="payment"
      ></CompleteOrderStack.Screen>
      <CompleteOrderStack.Screen
        component={CheckoutSummary}
        options={{ headerShown: false }}
        name="summary"
      ></CompleteOrderStack.Screen>
      <CompleteOrderStack.Screen
        component={CheckoutComplete}
        options={{ headerShown: false, unmountOnBlur: true }}
        name="checkoutComplete"
      ></CompleteOrderStack.Screen>
      <CompleteOrderStack.Screen
        component={OrderTracking}
        options={{ headerShown: false }}
        name="orderTracking"
      ></CompleteOrderStack.Screen>
    </CompleteOrderStack.Navigator>
  ) : (
    <CompleteOrderStack.Navigator initialRouteName="cart">
      <CompleteOrderStack.Screen
        component={shoppingCart}
        options={{ headerShown: false }}
        name="cart"
      ></CompleteOrderStack.Screen>
    </CompleteOrderStack.Navigator>
  );
};
const mapStateToProps = ({ cart }) => ({
  cart,
});
export default connect(mapStateToProps)(completeOrderStacks);
