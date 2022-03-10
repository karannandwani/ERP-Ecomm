import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Touchable,
  Platform,
} from "react-native";
import { connect } from "react-redux";
import Button from "../../components/common/button/button";
import Icon from "../../components/common/icon";
import { DimensionContext } from "../../components/dimensionContext";
import SaiWinLogo from "../../components/saiwinLogo/saiWinLogoComponent";
import { fetchCart } from "../../redux/actions/cart.action";
import { removeCurrentOrder } from "../../redux/actions/order.action";

const CheckoutComplete = ({
  navigation,
  currentOrder,
  fetchCart,
  removeCurrentOrder,
}) => {
  // navigation.navigate("Home", { screen: "homeScreen" })
  const { window } = useContext(DimensionContext);

  return (
    <View
      style={{
        minHeight: window.height - window.height / 10,
        maxHeight: window.height - window.height / 10,
        marginBottom: window.height / 10,
      }}
    >
      <View
        style={{
          flex: 2,
        }}
      >
        <SaiWinLogo
          containerStyle={{ flexDirection: "row" }}
          backIconStyle={{
            marginLeft: 20,
          }}
          imageStyle={{ alignSelf: "center", marginTop: 25, marginRight: 50 }}
          onPressLogo={() =>
            navigation.navigate("Home", { screen: "home-page" })
          }
        ></SaiWinLogo>
      </View>
      <View
        style={{
          flex: 6,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Image
          style={styles.ordcmplt}
          source={require("../../assets/orderaccept.png")}
        />
        <Text style={{ marginTop: 30, fontSize: 20, fontWeight: "bold" }}>
          ORDER PLACED
        </Text>
        <Text style={{ marginTop: 30 }}>
          Your Oder No. #{currentOrder?.orderNo} has been placed
        </Text>
      </View>
      <View
        style={{
          marginRight: 18,
          marginLeft: 18,
          flex: 2,
          justifyContent: "center",
        }}
      >
        <Button
          style={{
            borderColor: "#FA4248",
            backgroundColor: "#FA4248",
            maxHeight: window.height / 17,
            minHeight: window.height / 17,
            minWidth: window.width / 1.5,
            maxWidth: window.width / 1.5,
          }}
          pressFunc={
            () => {
              fetchCart();
              removeCurrentOrder();
              navigation.navigate("Home", { screen: "home-page" });
            }
            // navigation.navigate("orderTracking", {
            //   orderId: currentOrder[currentOrder.length - 1]._id,
            // })
          }
          textStyle={{ color: "#fff" }}
          title="CONTINUE SHOPPING"
        ></Button>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  ordcmplt: {
    flex: 1,
    marginTop: 70,
    maxHeight: 200,
    minHeight: 200,
    maxWidth: 200,
    minWidth: 200,
  },
});

const mapStateToProps = ({ currentOrder }) => ({ currentOrder });

export default connect(mapStateToProps, { removeCurrentOrder, fetchCart })(
  CheckoutComplete
);
