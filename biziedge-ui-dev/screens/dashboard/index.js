import React from "react";
import { connect } from "react-redux";
import BusinessDashboard from "./businessDashboard";

const Dashboard = ({ user, navigation }) => {
  return <BusinessDashboard navigation={navigation}></BusinessDashboard>;
};

const mapStateToProps = ({ user }) => ({ user });

export default connect(mapStateToProps, {})(Dashboard);
