import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import loginScreen from "../screens/login/login.screen";
import OrderDetails from "../screens/orderAndReturns/orderDetails";
import forgotPassword from "../screens/forgot-password/forgotPassword";
import codeVerfication from "../screens/forgot-password/verifyCode";
import resetPassword from "../screens/forgot-password/resetPassword";
import { connect } from "react-redux";

const LoginStack = createStackNavigator();

const LoginStackScreen = ({ code }) => {
  return code === null ? (
    <LoginStack.Navigator>
      <LoginStack.Screen
        component={loginScreen}
        options={{ headerShown: false }}
        name="login"
      ></LoginStack.Screen>
      <LoginStack.Screen
        component={forgotPassword}
        options={{ headerShown: false }}
        name="send-code"
      ></LoginStack.Screen>
    </LoginStack.Navigator>
  ) : (
    <LoginStack.Navigator>
      <LoginStack.Screen
        component={loginScreen}
        options={{ headerShown: false }}
        name="login"
      ></LoginStack.Screen>
      <LoginStack.Screen
        component={forgotPassword}
        options={{ headerShown: false }}
        name="send-code"
      ></LoginStack.Screen>
      <LoginStack.Screen
        component={codeVerfication}
        options={{ headerShown: false }}
        name="verify-code"
      ></LoginStack.Screen>
      <LoginStack.Screen
        component={resetPassword}
        options={{ headerShown: false }}
        name="reset-password"
      ></LoginStack.Screen>
    </LoginStack.Navigator>
  );
};
const mapStateToProps = ({ code }) => ({
  code,
});
export default connect(mapStateToProps, {})(LoginStackScreen);
