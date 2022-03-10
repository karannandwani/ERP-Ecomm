import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Dimensions,
  Platform,
} from "react-native";
import { connect } from "react-redux";
import Icon from "../../components/common/icon";
import OrderComponent from "../../components/common/order/orderComponent";
import { Styles } from "../../components/globalStyle/globalStyle";
const window = Dimensions.get("window");
const screen = Dimensions.get("screen");
import Pipe from "../../components/utils/pipe";
import { addToCart, applyCoupon } from "../../redux/actions/cart.action";
import config from "../../config/config";
import SaiWinLogo from "../../components/saiwinLogo/saiWinLogoComponent";
import lodash from "lodash";
import ModalView from "../../components/modalView/modal";
import { fetchAddress } from "../../redux/actions/address.action";
import { fetchCoupon } from "../../redux/actions/coupon.action";
const ShoppingCart = ({
  currentCart,
  navigation,
  addToCart,
  facility,
  applyCoupon,
  currentBeat,
  route,
  coupon,
  business,
  fetchAddress,
  fetchCoupon,
}) => {
  let pipe = new Pipe();

  const [dimensions, setDimensions] = useState({ window, screen });
  const [width, setWidth] = useState(dimensions.window.width);
  const [height, setHeight] = useState(dimensions.window.height);
  const [taxes, setTaxes] = useState([]);
  const [coupons, setCoupon] = useState("");
  const [gstModal, viewGstModal] = useState(null);

  const onChange = ({ window, screen }) => {
    setDimensions({ window, screen });
    setWidth(window.width, screen.width);
    setHeight(window.height, screen.height);
  };

  useEffect(() => {
    if (currentCart) {
      let taxList = currentCart.products.map((x, i) => x.tax).flat();
      let extraTaxes = currentCart.products
        .filter((x) => x.extraTax && x.extraTax.length > 0)
        .map((x, i) => x.extraTax)
        .flat()
        .map((x, i) => ({ ...x, type: x.name, percent: x.percentage }));
      let total = Object.entries(
        lodash.groupBy([...taxList, ...extraTaxes], "type")
      ).map((aa) => ({
        type: aa[0],
        taxes: Object.entries(lodash.groupBy(aa[1], "percent")).map((x) => ({
          percent: x[0],
          sum: x[1].map((x) => x.amount).reduce((a, b) => a + b, 0),
        })),
      }));
      setTaxes(total);
    }
  }, [currentCart]);

  useEffect(() => {
    fetchAddress();
    fetchCoupon({ business: business._id, type: "ECom" });
  });

  const changeCart = (item) => {
    if (facility) {
      addToCart({
        products: [item],
        facility: facility._id,
        business: business?._id,
        beat: currentBeat._id,
      });
    } else {
      console.error(
        "Cannot add to cart, no nearby facility available for now!"
      );
    }
  };

  useEffect(() => {
    Dimensions.addEventListener("change", onChange);
    return () => {
      Dimensions.removeEventListener("change", onChange);
    };
  });
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#595453",
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
          onPressIcon={() =>
            navigation.navigate("Home", { screen: "homeScreen" })
          }
          imageStyle={{ marginTop: 5 }}
          onPressLogo={() =>
            navigation.navigate("Home", { screen: "home-page" })
          }
        ></SaiWinLogo>
      </View>
      {!currentCart || currentCart.products.length == 0 ? (
        <View style={{ marginTop: 30 }}>
          <Text
            style={{
              color: "#fff",
              fontSize: 30,
              fontWeight: "bold",
              marginLeft: 20,
            }}
          >
            Empty Cart
          </Text>
          <Image
            source={require("../../assets/cart-empty.png")}
            resizeMethod="scale"
            resizeMode="contain"
            style={{
              width: window.width,
              height: window.height,
            }}
          ></Image>
        </View>
      ) : (
        <View style={{ flex: 1, flexDirection: "column" }}>
          <Text
            style={{
              fontSize: 23,
              fontWeight: "bold",
              color: "#fff",
              marginLeft: 22,
              marginBottom: 5,
            }}
          >
            Your Order
          </Text>
          <ScrollView
            contentContainerStyle={{ paddingBottom: 40 }}
            style={{
              width: width - 20,
              marginLeft: 10,
              marginRight: 10,
              height: 130,
              backgroundColor: "#fff",
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              borderBottomLeftRadius: 20,
              borderBottomRightRadius: 20,
            }}
          >
            {currentCart.products.map((x, i) => (
              <OrderComponent
                key={x._id}
                item={x}
                onQtyChange={(data) => changeCart(data)}
              ></OrderComponent>
            ))}
          </ScrollView>
          <View style={{ flexDirection: "column", padding: 2 }}>
            <View
              style={{
                flexDirection: "column",
                minWidth: "25%",
                alignSelf: "flex-end",
                marginRight: 20,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                }}
              >
                <Text
                  style={{
                    fontWeight: "bold",
                    color: "#ffff",
                    fontSize: 21 * (window.height * 0.001),
                  }}
                >
                  GST:
                </Text>
                <Text
                  key={Math.random()}
                  style={{
                    color: "#ffff",
                    fontSize: 21 * (window.height * 0.001),
                    alignSelf: "flex-end",
                    marginLeft: window.width > 1000 ? 10 : 20,
                  }}
                >
                  {pipe.formatter.format(
                    taxes.reduce(
                      (a, b) => a + b.taxes.reduce((c, d) => c + d.sum, 0),
                      0
                    )
                  )}
                </Text>
                {/* <TouchableOpacity
                  onPress={() => viewGstModal({ view: true, allTaxes: taxes })}
                  style={{ marginTop: 1 }}
                >
                  <Icon height="15" width="15" name="info"></Icon>
                </TouchableOpacity> */}
              </View>

              {currentCart.couponDiscount ? (
                <View
                  style={{
                    flexDirection: "column",
                    minHeight:
                      Platform.OS === "android" || Platform.OS === "ios"
                        ? 40
                        : null,
                  }}
                >
                  <View style={{ flexDirection: "row", flex: 1 }}>
                    <Text
                      style={{
                        fontWeight: "bold",
                        color: "#ffff",
                        fontSize: 21 * (window.height * 0.001),
                      }}
                    >
                      DISCOUNT:
                    </Text>
                    <Text
                      style={{
                        color: "#ffff",
                        marginLeft: 10,
                        fontSize: 21 * (window.height * 0.001),
                      }}
                    >
                      {pipe.formatter.format(
                        currentCart.couponDiscount.discount
                      )}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      flex: 1,
                    }}
                  >
                    <View style={{ flex: 1 }}>
                      <Text
                        style={{
                          fontWeight: "bold",
                          color: "#ffff",
                          flex: 1,
                          fontSize: 14,
                        }}
                      >
                        COUPON:
                      </Text>
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <Text
                        style={{
                          color: "#ffff",
                          fontSize: 21 * (window.height * 0.001),
                          marginLeft: 15,
                        }}
                      >
                        {currentCart.couponDiscount.coupon.name}
                      </Text>
                      <TouchableOpacity
                        style={{
                          maxHeight: 20,
                          marginTop:
                            Platform.OS === "android" || Platform.OS === "ios"
                              ? 5
                              : null,
                        }}
                        onPress={() =>
                          applyCoupon({
                            _id: currentCart._id,
                            action: "Remove",
                          })
                        }
                      >
                        <Icon name="cross" fill={"#ffd200"}></Icon>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ) : (
                <TouchableOpacity onPress={() => navigation.navigate("coupon")}>
                  <Text
                    style={{
                      fontWeight: "bold",
                      color: "#ff8566",
                      fontSize: 14,
                    }}
                  >
                    APPLY COUPON
                  </Text>
                </TouchableOpacity>
              )}
              <View style={{ flexDirection: "row" }}>
                <Text
                  style={{
                    fontWeight: "bold",
                    color: "#ffff",

                    fontSize: 21 * (window.height * 0.001),
                  }}
                >
                  SUBTOTAL:
                </Text>
                <Text
                  style={{
                    color: "#fff",
                    fontSize: 21 * (window.height * 0.001),
                    marginLeft:
                      Platform.OS === "android" || Platform.OS === "ios"
                        ? null
                        : 5,
                  }}
                >
                  {pipe.formatter.format(currentCart.subTotal)}
                </Text>
              </View>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => navigation.navigate("address")}
            style={{
              justifyContent: "flex-end",
              height: Platform.OS === "android" ? 60 : 50,
            }}
          >
            <View
              style={{
                height: Platform.OS === "android" ? 60 : 50,
                borderTopLeftRadius: 40,
                borderTopRightRadius: 40,
                backgroundColor: "grey",
                backgroundColor: "#FA4248",
                alignContent: "flex-end",
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: "bold",
                  color: "#fff",
                  alignSelf: "center",
                }}
              >
                PROCEED TO CHECKOUT
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      )}
      <ModalView
        showModal={gstModal && gstModal.view}
        modalViewStyle={{
          padding: 20,
          minHeight: 200,
          maxHeight: 200,
          maxWidth: window.width - 50,
          minWidth: window.width - 150,
        }}
        add={
          <View style={{ minHeight: 300 }}>
            {/* {gstModal?.allTaxes.map((x, index) => {
              return (
                <View
                  key={Math.random()}
                  style={{
                    flexDirection: "row",

                    justifyContent: "space-between",
                  }}
                >
                  <Text
                    style={{
                      fontWeight: "bold",
                      color: "#ffff",
                      fontSize: 19 * (window.height * 0.001),
                    }}
                  >
                    {x.type}{" "}
                  </Text>
                  <View
                    style={{
                      flexWrap: "wrap",
                      alignItems: "flex-end",
                    }}
                  >
                    {x.taxes.map((y, index) => {
                      return (
                        <Text
                          key={Math.random()}
                          style={{
                            color: "#ffff",
                            fontSize: 19 * (window.height * 0.001),
                            alignSelf: "flex-end",
                            marginLeft: 15,
                          }}
                        >
                          {" @" +
                            y.percent +
                            "%" +
                            "  " +
                            pipe.formatter.format(y.sum)}
                        </Text>
                      );
                    })}
                  </View>
                </View>
              );
            })} */}
            <TouchableOpacity onPress={() => viewGstModal(null)}>
              <Text style={{ color: "blue", marginLeft: 15, fontSize: 17 }}>
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        }
      ></ModalView>
    </View>
  );
};
const mapStateToProps = ({
  currentCart,
  facility,
  currentBeat,
  coupon,
  business,
}) => ({
  currentCart,
  facility,
  currentBeat,
  coupon,
  business,
});

export default connect(mapStateToProps, {
  addToCart,
  applyCoupon,
  fetchAddress,
  fetchCoupon,
})(ShoppingCart);
const styles = StyleSheet.create({
  textInputStyle: {
    color: "#ffff",
    alignSelf: "center",
    width: "70%",
    height: window.width > 1000 ? 35 : window.width / 9,
    // marginLeft: 14,
    borderRadius: 20,
    // textAlign: "center",
    justifyContent: "center",
  },
});
