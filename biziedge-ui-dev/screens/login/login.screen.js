import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Login } from "../../components/common/login";
import { initCode, login } from "../../redux/actions/login.action";
const LoginScreen = ({ login, navigation, initCode, user }) => {
  return (
    <Login
      onPress={() => {
        initCode();
        navigation.navigate("send-code");
      }}
      onLogin={(e) => login(e)}
    />
  );
};
const mapStateToProps = ({ user }) => ({
  user,
});
export default connect(mapStateToProps, {
  login,
  initCode,
})(LoginScreen);
