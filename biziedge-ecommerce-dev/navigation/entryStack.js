import React from "react";
import { connect } from "react-redux";
import AppStackScreen from "./appStack";
import LoginStackScreen from "./loginStack";

const EntryStack = ({ user }) => {
  return user ? <AppStackScreen /> : <LoginStackScreen />;
};

export default connect(({ user }) => ({ user }), {})(EntryStack);
