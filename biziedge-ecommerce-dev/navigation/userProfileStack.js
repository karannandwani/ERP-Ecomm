import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import userProfile from "../screens/UserProfile/userProfile";
import userOrderDetails from "../screens/userAllOrders/userOrderDetails";
import eachOrderOfUser from "../screens/userAllOrders/eachOrderOfUser";
import feedback from "../screens/userAllOrders/feedback";
import editProfile from "../screens/UserProfile/editProfile";
const UserStack = createStackNavigator();
const userStack = ({}) => {
  return (
    <UserStack.Navigator initialRouteName="user-profile">
      <UserStack.Screen
        component={userProfile}
        options={{ headerShown: false }}
        name="user-profile"
      ></UserStack.Screen>
      <UserStack.Screen
        component={editProfile}
        options={{ headerShown: false }}
        name="edit-profile"
      ></UserStack.Screen>
      <UserStack.Screen
        component={userOrderDetails}
        options={{ headerShown: false }}
        name="user-orders"
      ></UserStack.Screen>
      <UserStack.Screen
        component={eachOrderOfUser}
        options={{ headerShown: false }}
        name="each-order"
      ></UserStack.Screen>
      <UserStack.Screen
        component={feedback}
        options={{ headerShown: false }}
        name="feedback"
      ></UserStack.Screen>
    </UserStack.Navigator>
  );
};
export default userStack;
