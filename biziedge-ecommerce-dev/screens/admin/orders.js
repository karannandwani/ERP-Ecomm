import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import Icon from "../../components/common/icon";
import OrderComponent from "./orderComponent";

const Orders = () => {
  return (
    <View style={styles.container}>
      <View style={{ flex: 1, flexDirection: "row" }}>
        <View style={{ flex: 1, marginTop: 10 }}>
          <Icon name="back" fill="#fff"></Icon>
        </View>
        <View
          style={{
            flex: 1,
            marginTop: 11,
          }}
        >
          <Text style={{ fontSize: 20, color: "#fff" }}>Orders</Text>
        </View>
        <View
          style={{
            flex: 1,
            marginTop: 10,
          }}
        >
          <TouchableOpacity style={{ alignSelf: "flex-end" }}>
            <Icon name="search" fill="#fff"></Icon>
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView style={{ flex: 9 }}>
        <View style={{ flexDirection: "column" }}>
          <Text
            style={{
              fontSize: 22,
              color: "#fff",
              marginTop: 10,
              marginLeft: 20,
            }}
          >
            New Orders
          </Text>
          <View style={{ flexDirection: "column", flexWrap: "wrap" }}>
            <OrderComponent></OrderComponent>
            <OrderComponent></OrderComponent>
            <OrderComponent></OrderComponent>
            <OrderComponent></OrderComponent>
            <OrderComponent></OrderComponent>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};
export default Orders;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#595453",
    marginBottom: 10,
  },
});
