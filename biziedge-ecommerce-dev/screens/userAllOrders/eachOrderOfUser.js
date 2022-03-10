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
import { Dimensions, Platform, SafeAreaView } from "react-native";
import { connect } from "react-redux";
import Button from "../../components/common/button/button";
import Icon from "../../components/common/icon";
import SaiWinLogo from "../../components/saiwinLogo/saiWinLogoComponent";
import Pipe from "../../components/utils/pipe";
import config from "../../config/config";
import { addToCart } from "../../redux/actions/cart.action";
import { addError } from "../../redux/actions/toast.action";
import lodash from "lodash";
import { DimensionContext } from "../../components/dimensionContext";
import moment from "moment";

const eachOrderOfUser = ({
  navigation,
  route,
  orders,
  facility,
  addToCart,
  addError,
  currentBeat,
  business,
}) => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [statusPoint, setStatusPoint] = useState(null);
  const [taxes, setTaxes] = useState([]);
  const { window } = useContext(DimensionContext);
  let stausMeter = [
    { name: "Generated", point: 1 },
    { name: "Accepted", point: 2 },
    { name: "Rejected", point: 2.5 },
    { name: "Vehicle Assigned", point: 3 },
    { name: "Dispatched", point: 4 },
    { name: "Delivered", point: 5 },
  ];

  const repeatOrder = () => {
    if (facility) {
      addToCart({
        products: selectedOrder.products.map((x) => ({
          product: x.product._id,
          ordNoOfProduct: x.ordNoOfProduct,
        })),
        facility: facility._id,
        business: business?._id,
        beat: currentBeat._id,
      });
      navigation.navigate("Cart", { screen: "cart" });
    } else {
      addError(
        "Cannot add to cart, no nearby facility available for now!",
        3000
      );
    }
  };

  useEffect(() => {
    if (route?.params) {
      let tempOrder = orders.find((e) => e._id === route.params.itemId);
      setSelectedOrder({ ...tempOrder });
      if (tempOrder)
        setStatusPoint(
          stausMeter.find((x) => x.name === tempOrder.status.name).point
        );
    }
  }, [orders, route]);

  useEffect(() => {
    if (selectedOrder) {
      let taxList = selectedOrder.products
        .map((x) => x.lots.map((x) => x.tax))
        .flat()
        .flat();

      let extraTaxes = selectedOrder.products
        .filter((x) => x.extraTax && x.extraTax.length > 0)
        .map((x) => x.extraTax)
        .flat()
        .map((x) => ({ ...x, type: x.name, percent: x.percentage }));
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
  }, [selectedOrder]);
  let pipe = new Pipe();
  return (
    <View
      style={{
        flex: 1,
        width: window.width,
      }}
    >
      <View style={{ height: window.height * 0.03 + window.height * 0.11 }}>
        <SaiWinLogo
          containerStyle={{
            alignContent: "center",
          }}
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
          onPressIcon={() => navigation.navigate("user-orders")}
          imageStyle={{ marginTop: 5 }}
          onPressLogo={() =>
            navigation.navigate("Home", { screen: "home-page" })
          }
        ></SaiWinLogo>
      </View>
      <ScrollView>
        <View
          style={{
            flexDirection: window.width >= 750 ? "row" : "column",
            justifyContent: window.width >= 750 ? "space-between" : null,
            width: window.width,
            padding: 10,
          }}
        >
          <View
            style={{
              backgroundColor: "#fff",
              borderTopLeftRadius: 40,
              borderTopRightRadius: 40,
              marginTop: 10,
              maxHeight:
                window.height -
                (64 + window.height * 0.03 + window.height * 0.11 + 10),
              mxWidth:
                window.width >= 750
                  ? (75 / 100) * window.width - 20
                  : window.width - 20,
              minWidth:
                window.width >= 750
                  ? (75 / 100) * window.width - 20
                  : window.width - 20,
              marginRight: 10,
            }}
          >
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Text
                style={{
                  marginTop: 15,
                  fontWeight: "bold",
                  marginLeft: 20,
                }}
              >
                Order #{selectedOrder?.orderNo}
              </Text>
              {selectedOrder?.password &&
              selectedOrder?.status.name != "Delivered" ? (
                <Text
                  style={{
                    marginTop: 15,
                    fontWeight: "bold",
                    marginRight: 20,
                  }}
                >
                  OTP {selectedOrder?.password}
                </Text>
              ) : (
                <></>
              )}
            </View>

            {selectedOrder?.expectedDeliveryBy &&
            selectedOrder?.status.name != "Delivered" ? (
              <View style={{ flexDirection: "row" }}>
                <Text
                  style={{
                    marginTop: 15,
                    fontWeight: "bold",
                    marginLeft: 20,
                  }}
                >
                  Expected Delivery By #
                  {moment(selectedOrder?.expectedDeliveryBy).format(
                    "DD/MM/YYYY "
                  )}
                  ,
                  {moment(selectedOrder?.expectedDeliveryBy).format(
                    `${moment(selectedOrder?.expectedDeliveryBy).format("HH")}`
                  ) >= 9 &&
                  moment(selectedOrder?.expectedDeliveryBy).format(
                    `${moment(selectedOrder?.expectedDeliveryBy).format("HH")}`
                  ) < 12 ? (
                    <Text>between 9am to 12pm</Text>
                  ) : moment(selectedOrder?.expectedDeliveryBy).format(
                      `  ${moment(selectedOrder?.expectedDeliveryBy).format(
                        "HH"
                      )}`
                    ) >= 12 &&
                    moment(selectedOrder?.expectedDeliveryBy).format(
                      `  ${moment(selectedOrder?.expectedDeliveryBy).format(
                        "HH"
                      )}`
                    ) < 17 ? (
                    <Text>between 12pm to 5pm</Text>
                  ) : moment(selectedOrder?.expectedDeliveryBy).format(
                      `  ${moment(selectedOrder?.expectedDeliveryBy).format(
                        "HH"
                      )}`
                    ) >= 17 &&
                    moment(selectedOrder?.expectedDeliveryBy).format(
                      `  ${moment(selectedOrder?.expectedDeliveryBy).format(
                        "HH"
                      )}`
                    ) < 21 ? (
                    <Text>between 5pm to 9pm</Text>
                  ) : null}
                  {/* {console.log(
                    moment(selectedOrder?.expectedDeliveryBy).format(
                      `  ${moment(selectedOrder?.expectedDeliveryBy).format(
                        "h"
                      )}`
                    )
                  )} */}
                </Text>
              </View>
            ) : (
              <></>
            )}
            <ScrollView
              showsVerticalScrollIndicator={false}
              style={{
                borderTopColor: "rgba(255, 255, 255, .4)",
                borderColor: "#989898",
              }}
            >
              {selectedOrder?.products?.map((e, i) => {
                return (
                  <View
                    key={e._id}
                    style={{
                      flexDirection: "row",
                      backgroundColor: "#fff",
                      margin: 2,
                      shadowColor: "#000",
                      shadowOffset: {
                        width: 0,
                        height: 2,
                      },
                      shadowOpacity: 0.25,
                      shadowRadius: 3.84,

                      elevation: 5,
                      padding: 12,
                    }}
                  >
                    <View
                      style={{
                        width: 100,
                        height: 100,
                        flexDirection: "row",
                        margin: 12,
                      }}
                    >
                      <Image
                        style={{
                          width: 100,
                          height: 100,
                          position: "absolute",
                        }}
                        source={
                          e?.product?.image.length > 0
                            ? {
                                uri: `data:image/jpeg;base64,${
                                  (
                                    e?.product?.image.find((x) => x.default) ||
                                    e?.product?.image[0]
                                  ).image
                                }`,
                              }
                            : require("../../assets/products.png")
                        }
                      />
                      <View
                        style={{
                          flex: 1,
                          backgroundColor: "rgba(0, 0, 0, 0.5)",
                          alignSelf: "flex-end",
                        }}
                      >
                        <Text
                          style={{ color: "white", fontSize: 16, margin: 6 }}
                        >
                          {e.product?.name}
                        </Text>
                      </View>
                    </View>
                    <View
                      style={{
                        marginTop: 24,
                      }}
                    >
                      <Text style={{ alignSelf: "center" }}>
                        {`${pipe.formatter.format(
                          e.price / e.ordNoOfProduct
                        )} x ${e.ordNoOfProduct} = ${pipe.formatter.format(
                          e.price
                        )}`}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </ScrollView>
          </View>

          <View
            style={{
              backgroundColor: "#fff",
              borderTopLeftRadius: 40,
              borderTopRightRadius: 40,
              marginTop: 10,
              flexDirection: "column",
              justifyContent: "space-between",
              maxWidth:
                window.width >= 750
                  ? (25 / 100) * window.width - 20
                  : window.width - 20,
              minWidth:
                window.width >= 750
                  ? (25 / 100) * window.width - 20
                  : window.width - 20,
              padding: 12,
              minHeight:
                window.height -
                (64 + window.height * 0.03 + window.height * 0.11 + 10),
              maxHeight:
                window.height -
                (64 + window.height * 0.03 + window.height * 0.11 + 10),
            }}
          >
            <View
              style={{
                minHeight:
                  (15 / 100) *
                  (window.height -
                    (64 + window.height * 0.03 + window.height * 0.11 + 34)),
                marginBottom: 2,
                shadowColor: "#000",
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
                elevation: 5,
                borderTopLeftRadius: 40,
                borderTopRightRadius: 40,
                padding: 12,
              }}
            >
              {taxes?.map((x) => {
                return (
                  <View
                    key={Math.random()}
                    style={{
                      flexDirection: "row",
                      paddingLeft: 12,
                      marginLeft:
                        Platform.OS === "android" || Platform.OS === "ios"
                          ? window.width / 5
                          : 25,
                    }}
                  >
                    <Text style={{ fontWeight: "bold", flex: 1 }}>
                      {x.type}{" "}
                    </Text>
                    <View
                      style={{
                        flex: 5,
                        flexWrap: "wrap",
                        alignItems: "center",
                      }}
                    >
                      {x.taxes.map((y, key) => {
                        return (
                          <Text key={Math.random()}>
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
              })}
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  paddingLeft: 12,
                  marginTop: 8,
                  marginLeft:
                    Platform.OS === "android" || Platform.OS === "ios"
                      ? window.width / 5
                      : 25,
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{
                    alignSelf: "center",
                    fontWeight: "bold",
                    flex:
                      Platform.OS === "android" || Platform.OS === "ios"
                        ? 2.8
                        : 5.6,
                  }}
                >
                  Subtotal:
                </Text>
                <Text
                  style={{
                    alignSelf: "center",
                    flex:
                      Platform.OS === "android" || Platform.OS === "ios"
                        ? 7.2
                        : 4.4,
                  }}
                >
                  {pipe.formatter.format(selectedOrder?.subTotal)}
                </Text>
              </View>
            </View>
            <View
              style={{
                minHeight:
                  (80 / 100) *
                  (window.height -
                    (64 + window.height * 0.03 + window.height * 0.11 + 36)),
              }}
            >
              <ScrollView>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-around",
                    marginBottom: 20,
                    height: 400,
                    marginTop: 30,
                  }}
                >
                  <View
                    style={{
                      flex: 1,
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <View style={styles.outerCircleStyle}>
                      {statusPoint && statusPoint >= 1 ? (
                        <View
                          style={{
                            maxWidth: 18,
                            minWidth: 18,
                            minHeight: 18,
                            maxHeight: 18,
                            borderRadius: 10,
                            borderColor: "#D6D2D2",
                            borderWidth: 1,
                            backgroundColor: "#FA4248",
                            alignSelf: "center",
                          }}
                        ></View>
                      ) : (
                        <></>
                      )}
                    </View>
                    <View
                      style={{
                        flex: 1,
                        borderColor: "#D6D2D2",
                        borderLeftWidth: 1,
                        borderLeftColor: "#FA4248",
                        // marginLeft: 15,
                        // backgroundColor:"red"
                      }}
                    ></View>
                    <View style={styles.outerCircleStyle}>
                      {statusPoint && statusPoint >= 2 ? (
                        <View
                          style={{
                            maxWidth: 18,
                            minWidth: 18,
                            minHeight: 18,
                            maxHeight: 18,
                            borderRadius: 10,
                            borderColor: "#D6D2D2",
                            borderWidth: 1,
                            backgroundColor: "#FA4248",
                            alignSelf: "center",
                          }}
                        ></View>
                      ) : (
                        <></>
                      )}
                    </View>
                    <View
                      style={{
                        flex: 1,
                        borderColor: "#D6D2D2",
                        borderLeftWidth: 1,
                        borderLeftColor: "#FA4248",
                        // marginLeft: 15,
                        // backgroundColor:"red"
                      }}
                    ></View>
                    <View style={styles.outerCircleStyle}>
                      {statusPoint && statusPoint >= 3 ? (
                        <View
                          style={{
                            maxWidth: 18,
                            minWidth: 18,
                            minHeight: 18,
                            maxHeight: 18,
                            borderRadius: 10,
                            borderColor: "#D6D2D2",
                            borderWidth: 1,
                            backgroundColor: "#FA4248",
                            alignSelf: "center",
                          }}
                        ></View>
                      ) : (
                        <></>
                      )}
                    </View>
                    <View
                      style={{
                        flex: 1,
                        borderColor: "#D6D2D2",
                        borderLeftWidth: 1,
                        borderLeftColor: "#FA4248",
                        // marginLeft: 15,
                        // backgroundColor:"red"
                      }}
                    ></View>
                    <View style={styles.outerCircleStyle}>
                      {statusPoint && statusPoint >= 4 ? (
                        <View
                          style={{
                            maxWidth: 18,
                            minWidth: 18,
                            minHeight: 18,
                            maxHeight: 18,
                            borderRadius: 10,
                            borderColor: "#D6D2D2",
                            borderWidth: 1,
                            backgroundColor: "#FA4248",
                            alignSelf: "center",
                          }}
                        ></View>
                      ) : (
                        <></>
                      )}
                    </View>
                    <View
                      style={{
                        flex: 1,
                        borderColor: "#D6D2D2",
                        borderLeftWidth: 1,
                        borderLeftColor: "#FA4248",
                      }}
                    ></View>
                    <View style={styles.outerCircleStyle}>
                      {statusPoint && statusPoint >= 4.9 ? (
                        <View
                          style={{
                            maxWidth: 18,
                            minWidth: 18,
                            minHeight: 18,
                            maxHeight: 18,
                            borderRadius: 10,
                            borderColor: "#D6D2D2",
                            borderWidth: 1,
                            backgroundColor: "#FA4248",
                            alignSelf: "center",
                          }}
                        ></View>
                      ) : (
                        <></>
                      )}
                    </View>
                  </View>

                  <View
                    style={{
                      flex: 1,
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginTop: 3,
                    }}
                  >
                    <View style={{ alignSelf: "flex-start" }}>
                      <Text style={{ fontWeight: "bold" }}>{"Generated"}</Text>
                    </View>
                    <View style={{ alignSelf: "flex-start" }}>
                      <Text style={{ fontWeight: "bold" }}>
                        {statusPoint
                          ? statusPoint > 2.5
                            ? "Accepted"
                            : statusPoint == 2.5
                            ? "Rejected"
                            : "Accept/Reject"
                          : "Accept/Reject"}
                      </Text>
                    </View>
                    <View style={{ alignSelf: "flex-start" }}>
                      <Text style={{ fontWeight: "bold" }}>
                        {"Vehicle Assigned"}
                      </Text>
                    </View>
                    <View style={{ alignSelf: "flex-start" }}>
                      <Text style={{ fontWeight: "bold" }}>{"Dispatched"}</Text>
                    </View>

                    <View style={{ alignSelf: "flex-start", marginBottom: 3 }}>
                      <Text style={{ fontWeight: "bold" }}>{"Delivered"}</Text>
                    </View>
                  </View>
                </View>
              </ScrollView>
            </View>
          </View>
        </View>
      </ScrollView>
      {selectedOrder && selectedOrder.status.name === "Delivered" ? (
        <View>
          <TouchableOpacity
            onPress={() => repeatOrder()}
            style={{ minWidth: "100%", minHeight: 40 }}
          >
            <View
              style={{
                borderTopLeftRadius: 40,
                borderTopRightRadius: 40,
                flex: 1,
                backgroundColor: "rgb(193, 56, 62)",
                alignContent: "center",
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
                BUY IT AGAIN
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("feedback", { itemId: selectedOrder._id })
            }
            style={{
              minWidth: "100%",
              backgroundColor: "rgb(193, 56, 62)",
              minHeight: 45,
            }}
          >
            <View
              style={{
                width: "100%",
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.5,
                shadowRadius: 15,
                elevation: 5,
                alignSelf: "center",
                zIndex: 1,
                borderTopLeftRadius: 40,
                borderTopRightRadius: 40,
                flex: 1,
                backgroundColor: "#FA4248",
                alignContent: "center",
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
                FEEDBACK
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      ) : (
        <></>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  outerCircleStyle: {
    flex: 1,
    maxWidth: 28,
    minWidth: 28,
    minHeight: 28,
    maxHeight: 28,
    borderRadius: 15,
    borderColor: "#D6D2D2",
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
  },
});
const mapStateToProps = ({ orders, facility, currentBeat, business }) => ({
  orders,
  facility,
  currentBeat,
  business,
});

export default connect(mapStateToProps, { addToCart, addError })(
  eachOrderOfUser
);
