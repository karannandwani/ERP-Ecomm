import React from "react";
import { connect } from "react-redux";
import { Login } from "../../components/common/login";
import { login } from "../../redux/actions/login.action";

const LoginScreen = ({ login }) => {
  return <Login onLogin={(e) => login(e)} />;
};

export default connect(null, {
  login,
})(LoginScreen);
