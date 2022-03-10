import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import WelcomeScreen from "../screens/welcomeScreen/welcomeScreen";
import SignUp from "../screens/signUp/signUp";
import Verification from "../screens/verification/Verification";
const LoginStack = createStackNavigator();

const LoginStackScreen = () => {
  return (
    <LoginStack.Navigator initialRouteName="welcome-screen">
      <LoginStack.Screen
        component={WelcomeScreen}
        options={{ headerShown: false }}
        name="welcome-screen"
      ></LoginStack.Screen>
      <LoginStack.Screen
        component={SignUp}
        options={{ headerShown: false }}
        name="sign-up"
      ></LoginStack.Screen>
      <LoginStack.Screen
        component={Verification}
        options={{ headerShown: false }}
        name="Verification"
      ></LoginStack.Screen>
    </LoginStack.Navigator>
  );
};

export default LoginStackScreen;
