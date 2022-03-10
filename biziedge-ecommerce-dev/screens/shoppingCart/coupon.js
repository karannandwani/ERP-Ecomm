import React, { useState, useContext, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { connect } from "react-redux";
import SaiWinLogo from "../../components/saiwinLogo/saiWinLogoComponent";
import Pipe from "../../components/utils/pipe";

import { DimensionContext } from "../../components/dimensionContext";
import { applyCoupon } from "../../redux/actions/cart.action";
import { fetchCoupon } from "../../redux/actions/coupon.action";
import config from "../../config/config";

export const coupon = ({
  coupons,
  navigation,
  applyCoupon,
  currentCart,
  fetchCoupon,
  business,
}) => {
  const { window } = useContext(DimensionContext);
  const [phrase, setPhrase] = useState("");
  const [filteredCoupons, setFilteredCoupons] = useState(coupons);
  let pipe = new Pipe();

  useState(() => {
    return () => {
      setPhrase("");
    };
  }, []);

  useEffect(() => {
    setFilteredCoupons([
      ...coupons.filter((x) =>
        x.name.toLowerCase().startsWith(phrase.toLowerCase())
      ),
    ]);
  }, [coupons]);

  const fetchCouponByPhrase = (phrase) => {
    fetchCoupon({ business: business?._id, name: phrase, type: "ECom" });
  };
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
          justifyContent: "space-between",
          backgroundColor: "#ffff",
          borderBottomLeftRadius: 40,
          borderBottomRightRadius: 40,
          minHeight: "15%",
          marginBottom: 20,
        }}
      >
        <SaiWinLogo
          backIconStyle={{
            marginLeft: 15,
          }}
          containerStyle={{ flexDirection: "row" }}
          onPressIcon={() => navigation.navigate("cart")}
          imageStyle={{ marginTop: 5 }}
          onPressLogo={() =>
            navigation.navigate("Home", { screen: "home-page" })
          }
        ></SaiWinLogo>
      </View>
      <Text
        style={{
          fontSize: 18,
          minHeight: 40,
          maxHeight: 40,
          fontWeight: "bold",
          marginLeft: 3,
        }}
      >
        Apply Coupon
      </Text>
      <TextInput
        value={phrase}
        placeholder="Search Coupons"
        style={styles.textInput}
        onChangeText={(text) => {
          setPhrase(text);
          fetchCouponByPhrase(text);
        }}
      />
      <Text style={{ margin: 3 }}>AVAILABLE COUPONS</Text>
      <ScrollView>
        {filteredCoupons?.map((e) => (
          <TouchableOpacity
            key={e._id}
            onPress={() => {
              applyCoupon({
                _id: currentCart._id,
                coupon: e._id,
                action: "Apply",
              });
              navigation.navigate("cart");
            }}
            style={{
              borderRadius: 5,
              borderWidth: 1,
              shadowOpacity: 0.5,
              margin: 4,
              padding: 2,
              backgroundColor: "#ffff",
            }}
          >
            <Text
              style={{
                color: "#000",
                fontSize: 16,
                fontWeight: "500",
              }}
            >
              {e.name}
            </Text>
            <Text
              style={{
                color: "#000",
                fontSize: 12,
              }}
            >
              {e.discountType == "Percentage"
                ? e.discountAmount + "% off "
                : "Flat " + e.discountAmount + " off"}
            </Text>
            {e.discountType == "Percentage" ? (
              <Text>
                {e.discountAmount} % discount upto{" "}
                {pipe.formatter.format(e.ceilingValue)}.
              </Text>
            ) : (
              <></>
            )}
            <Text>
              On order of {pipe.formatter.format(e.minCartValue)} or above.
            </Text>
            {currentCart.subTotal < e.minCartValue ? (
              <Text
                style={{
                  color: "#FA4248",
                  fontSize: 12,
                  fontStyle: "italic",
                }}
              >
                Add more item of{" "}
                {pipe.formatter.format(e.minCartValue - currentCart.subTotal)}{" "}
                to avail this offer.
              </Text>
            ) : (
              <></>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  textInput: {
    flex: 1,
    paddingLeft: 15,
    color: "#000",
    borderColor: "grey",
    borderWidth: 1,
    borderRadius: 5,
    margin: 3,
    marginBottom: 10,
    minHeight: 35,
    maxHeight: 35,
  },
});
const mapStateToProps = ({ coupons, currentCart, business }) => ({
  coupons,
  currentCart,
  business,
});

export default connect(mapStateToProps, { applyCoupon, fetchCoupon })(coupon);
