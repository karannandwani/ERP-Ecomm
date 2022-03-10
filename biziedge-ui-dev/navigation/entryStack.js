import React from "react";
import { Text, View } from "react-native";
import { connect } from "react-redux";
import AppStackScreen from "./appStack";
import LoginStackScreen from "./loginStack";

const EntryStack = ({ user }) => {
  return user ? <AppStackScreen /> : <LoginStackScreen />;
};

export default connect(({ user }) => ({ user }))(EntryStack);
