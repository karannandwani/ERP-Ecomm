import React, { useEffect, useState, useContext } from "react";
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
  image,
  Pressable,
} from "react-native";
import { connect } from "react-redux";
import SaiWinLogo from "../../components/saiwinLogo/saiWinLogoComponent";
import Pipe from "../../components/utils/pipe";
import { DimensionContext } from "../../components/dimensionContext";
import {
  fetchOrders,
  leaveOrderScreen,
} from "../../redux/actions/order.action";
const userOrderDetails = ({
  orders,
  navigation,
  item,
  fetchOrders,
  user,
  leaveOrderScreen,
}) => {
  let pipe = new Pipe();
  const { window } = useContext(DimensionContext);

  useEffect(() => {
    fetchOrders({ user: user._id, skip: 0 });
    return () => {
      leaveOrderScreen();
    };
  }, []);
  return (
    <View
      style={{
        width: window.width,
        backgroundColor: "grey",
        flex: 1,
      }}
    >
      <View
        style={{
          height: window.height * 0.03 + window.height * 0.15,
        }}
      >
        <SaiWinLogo
          backIconStyle={{
            marginLeft: 20,
          }}
          containerStyle={{
            flexDirection: "row",
            height: "100%",
            backgroundColor: "white",
            borderBottomRightRadius: 50,
            borderBottomLeftRadius: 50,
          }}
          onPressIcon={() =>
            navigation.navigate("Home", { screen: "home-page" })
          }
          imageStyle={{ marginTop: 5 }}
          onPressLogo={() =>
            navigation.navigate("Home", { screen: "home-page" })
          }
        ></SaiWinLogo>
      </View>

      <View style={{ flex: 1, paddingHorizontal: 10 }}>
        <Text
          style={{
            fontWeight: "500",
            fontSize: 22,
            marginTop: 10,
            color: "#fff",
            marginLeft: 10,
          }}
        >
          Your Orders
        </Text>
        <View style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={{}}>
            {orders.map((e, i) => {
              let orderDate = new Date(
                parseInt(e._id.substring(0, 8), 16) * 1000
              );
              return (
                <TouchableOpacity
                  key={e._id}
                  onPress={() =>
                    navigation.navigate("each-order", { itemId: e._id })
                  }
                >
                  <View
                    style={{
                      borderRadius: 15,
                      borderWidth: 1,
                      backgroundColor: "#fff",
                      flexGrow: 1,
                      marginTop: 7,
                      padding: 20,
                      borderColor: "grey",
                    }}
                  >
                    <View style={{ flex: 3, flexDirection: "row" }}>
                      <View>
                        <Text
                          style={{
                            color:
                              e.status.name === "Delivered"
                                ? "#50aF10"
                                : e.status.name === "Rejected"
                                ? "#FF0000"
                                : "#000",
                            flex: 6,
                          }}
                        >
                          {e.orderNo}
                        </Text>
                        <Text
                          style={{
                            color:
                              e.status.name === "Delivered"
                                ? "#50aF10"
                                : e.status.name === "Rejected"
                                ? "#FF0000"
                                : "#000",
                            flex: 6,
                          }}
                        >
                          {e.status.name}
                        </Text>
                      </View>
                      <View
                        style={{
                          flex: 7,
                          flexDirection: "column",
                          justifyContent: "space-between",
                        }}
                      >
                        <Text
                          style={{
                            marginLeft: 19,
                            alignSelf: "flex-end",

                            // backgroundColor: "red",
                          }}
                        >
                          {orderDate.toLocaleString()}
                        </Text>
                        <Text
                          style={{
                            color: "#000",
                            alignSelf: "flex-end",
                            marginLeft: 28,
                          }}
                        >
                          {"Sub Total: "}
                          <Text
                            style={{
                              color:
                                e.status.name === "Delivered"
                                  ? "#50aF10"
                                  : "#ff0000",
                              textDecorationLine:
                                e.status.name === "Rejected"
                                  ? "line-through"
                                  : "none",
                            }}
                          >
                            {pipe.formatter.format(e.subTotal)}
                          </Text>
                        </Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
            {orders.length > 0 && orders.length % 10 === 0 ? (
              <TouchableOpacity
                onPress={() =>
                  fetchOrders({ user: user._id, skip: orders.length })
                }
                style={{
                  borderRadius: 15,
                  borderWidth: 1,
                  backgroundColor: "#fff",
                  flexGrow: 1,
                  marginTop: 7,
                  padding: 20,
                  borderColor: "grey",
                  justifyContent: "center",
                }}
              >
                <Text style={{ color: "#000", fontSize: 20 }}>
                  Load More...
                </Text>
              </TouchableOpacity>
            ) : (
              <></>
            )}
          </ScrollView>
        </View>
      </View>
    </View>
  );
};
const mapStateToProps = ({ orders, user }) => ({
  orders,
  user,
});

export default connect(mapStateToProps, { fetchOrders, leaveOrderScreen })(
  userOrderDetails
);
