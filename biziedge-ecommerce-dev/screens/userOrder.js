import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import userOrderDetails from "./userAllOrders/userOrderDetails";
import eachOrderOfUser from "./userAllOrders/eachOrderOfUser";
import feedback from "./userAllOrders/feedback";
const UserOrder = createStackNavigator();
const userOrder = ({}) => {
  return (
    <UserOrder.Navigator initialRouteName="user-profile">
      <UserOrder.Screen
        component={userOrderDetails}
        options={{ headerShown: false }}
        name="user-orders"
      ></UserOrder.Screen>
      <UserOrder.Screen
        component={eachOrderOfUser}
        options={{ headerShown: false }}
        name="each-order"
      ></UserOrder.Screen>
      <UserOrder.Screen
        component={feedback}
        options={{ headerShown: false }}
        name="feedback"
      ></UserOrder.Screen>
    </UserOrder.Navigator>
  );
};
export default userOrder;
