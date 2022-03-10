import React, { useContext, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
} from "react-native";
import Icon from "../../components/common/icon";
import Button from "../../components/common/button/button";
import Checkbox from "../../components/common/checkbox/Checkbox";
import ProductComponent from "../../components/common/Form/ProductComponent";
import SelectionCircle from "../../components/selectionCircle/selectionCircle";
import { connect } from "react-redux";
import { checkout } from "../../redux/actions/cart.action";
import SaiWinLogo from "../../components/saiwinLogo/saiWinLogoComponent";
import { DimensionContext } from "../../components/dimensionContext";

const CheckoutSummary = ({ orders, navigation, checkout }) => {
  const { window } = useContext(DimensionContext);
  return currentCart ? (
    <View
      style={{
        height:
          Platform.OS === "android" || Platform.OS === "ios"
            ? window.height - 35
            : window.height - 60,
        backgroundColor: "#fff",
      }}
    >
      <View style={{ flex: 1.5 }}>
        <SaiWinLogo
          backIconStyle={{
            marginLeft: 22,
          }}
          containerStyle={{
            flexDirection: "row",
            backgroundColor: "white",
            borderBottomRightRadius: 50,
            borderBottomLeftRadius: 50,
            alignContent: "center",
            borderBottomWidth: 1,
            borderBottomColor: "#000",
            borderLeftWidth: 1,
            borderRightWidth: 1,
          }}
          onPressIcon={() => navigation.navigate("payment")}
          // onPress={() => navigation.navigate("home")}
          imageStyle={{ marginTop: 5 }}
          onPressLogo={() =>
            navigation.navigate("Home", { screen: "home-page" })
          }
        ></SaiWinLogo>
      </View>
      <View style={{ flex: 1.7 }}>
        <SelectionCircle
          style={{
            marginTop:
              Platform.OS === "android" || Platform.OS === "ios"
                ? window.height / 20
                : 15,
          }}
          thirdCircle={true}
        ></SelectionCircle>
      </View>

      <ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        style={{
          maxHeight: window.height / 5,
          minHeight:
            Platform.OS === "android" || Platform.OS === "ios"
              ? window.height / 5
              : window.height < 550
              ? window.height / 4
              : window.height / 5,

          marginLeft: 10,
        }}
      >
        {currentCart?.products.map((x, i) => (
          <ProductComponent key={x._id} item={x}></ProductComponent>
        ))}
      </ScrollView>
      <View
        style={{
          flex: 3,
          flexDirection: "row",
          justifyContent: "space-between",
          marginLeft: 10,
        }}
      >
        <View
          style={{ flexDirection: "column", justifyContent: "space-around" }}
        >
          <Text
            style={{
              fontSize: 26 * (window.height * 0.001),
              fontWeight: "bold",
            }}
          >
            Shipping address
          </Text>
          <View>
            <Text style={{ fontSize: 20 * (window.height * 0.001) }}>
              {currentCart.address?.name}
            </Text>
            <Text style={{ fontSize: 20 * (window.height * 0.001) }}>
              {currentCart.address?.phone}
              {currentCart.address?.alternativePhone
                ? `, ${currentCart?.address.alternativePhone}`
                : ""}
            </Text>
            <Text style={{ fontSize: 20 * (window.height * 0.001) }}>
              {currentCart.address?.street1}
            </Text>
            <Text style={{ fontSize: 20 * (window.height * 0.001) }}>
              {currentCart.address?.street2}
            </Text>
            <Text style={{ fontSize: 20 * (window.height * 0.001) }}>
              {currentCart.address?.city}
              {", "}
              {currentCart.address?.pincode}
            </Text>
            <Text style={{ fontSize: 20 * (window.height * 0.001) }}>
              {currentCart.address?.state}
              {", "}
              {currentCart.address?.country}
            </Text>
          </View>
        </View>
        <View
          style={{
            flex: 1,
            maxHeight: 30,
            minHeight: 30,
            maxWidth: 40,
            marginTop: 10,
          }}
        >
          <Checkbox
            value={true}
            style={{
              maxHeight: 25,
              minHeight: 25,
              maxWidth: 25,
              minWidth: 25,
              borderRadius: 100,
              position: "absolute",
            }}
          ></Checkbox>
        </View>
      </View>
      <View
        style={{
          flex: 1.5,
          flexDirection: "row",
          justifyContent: "space-between",
          marginLeft: 10,
        }}
      >
        <View
          style={{
            flexDirection: "column",
            justifyContent: "space-around",
          }}
        >
          <Text
            style={{
              fontSize: 26 * (window.height * 0.001),
              fontWeight: "bold",
            }}
          >
            Payment
          </Text>
          <Text style={{ fontSize: 24 * (window.height * 0.001) }}>
            {currentCart?.payment?.type}
          </Text>
        </View>
        <View style={{ flex: 1, maxHeight: 30, minHeight: 30, maxWidth: 40 }}>
          <Checkbox
            value={true}
            style={{
              maxHeight: 25,
              minHeight: 25,
              maxWidth: 25,
              minWidth: 25,
              borderRadius: 100,
              position: "absolute",
            }}
          ></Checkbox>
        </View>
      </View>
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <View style={{ justifyContent: "center", flex: 1 }}>
          <Button
            pressFunc={() => navigation.navigate("checkoutComplete")}
            textStyle={{ color: "#fff" }}
            style={{
              maxHeight: window.height / 15,
              minHeight: window.height / 17,
              minWidth: window.width / 2.2,
              maxWidth: window.width / 2.3,
              backgroundColor: "#FA4248",
              borderColor: "#fff",
            }}
            title="Next"
          ></Button>
        </View>
      </View>
    </View>
  ) : (
    <></>
  );
};
const styles = StyleSheet.create({
  container: {
    // backgroundColor:"red"
  },
});
const mapStateToProps = ({ orders }) => ({ orders });

export default connect(mapStateToProps, { checkout })(CheckoutSummary);
