import React, { useState } from "react";
import { connect } from "react-redux";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Icon from "../../components/common/icon";
import { logout } from "../../redux/actions/login.action";

const Profile = ({ logout }) => {
  return (
    <View style={styles.container}>
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: 20,
          margin: 10,
          maxHeight: 30,
        }}
      >
        <TouchableOpacity>
          <Icon name="back"></Icon>
        </TouchableOpacity>
        <Text style={{ fontSize: 20, fontWeight: "bold", color: "#FA4248" }}>
          Profile
        </Text>
        <TouchableOpacity>
          <Icon name="search"></Icon>
        </TouchableOpacity>
      </View>
      {/* <View
        style={{
          flex: 7,
          backgroundColor: "white",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Image
          style={styles.ordcmplt}
          source={require("../../assets/orderaccept.png")}
        />
        <Text style={{ flex: 1, maxHeight: 30, marginTop: 5 }}>
          ORDER ACCEPTED
        </Text>
        <Text style={{ flex: 1, maxHeight: 40 }}>
          Your Oder No. #123-456 has been placed
        </Text>
      </View> */}
      <View
        style={{ flex: 2, marginRight: 18, marginLeft: 18, marginBottom: 50 }}
      >
        <TouchableOpacity
          onPress={() => logout()}
          style={{
            backgroundColor: "#FA4248",
            borderRadius: 100,
            padding: 12,
            alignItems: "center",
          }}
        >
          <Text style={{ color: "#fff" }}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  ordcmplt: {
    flex: 1,
    marginTop: 70,
    // margin:2,
    maxHeight: 200,
    minHeight: 200,
    maxWidth: 200,
    minWidth: 200,
  },
});
const mapStateToProps = ({ user }) => ({
  user,
});
export default connect(mapStateToProps, { logout })(Profile);
