import React, { useState, useEffect, useContext } from "react";
import Lightbox from "react-native-lightbox";

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Platform,
  Image,
} from "react-native";
import { connect } from "react-redux";
import Icon from "../../components/common/icon";
import AddModal from "../../components/addModal/addModal";
import { DimensionContext } from "../../components/dimensionContext";
import moment from "moment";
const allFeedbackOfUsers = ({ orderFeedbacks, navigation }) => {
  const { window } = useContext(DimensionContext);
  const [modalVisible, setModalVisible] = useState(false);
  const [selected, setSelected] = useState(null);
  const handleCallback = () => {
    setModalVisible(false);
  };
  return (
    <ScrollView nestedScrollEnabled={true}>
      <Text
        style={{
          alignSelf: "center",
          fontSize: 17,
          fontWeight: "600",
          marginRight: 15,
        }}
      >
        User Reviews and Ratings
      </Text>
      {orderFeedbacks.map((ord, key) => (
        <View key={ord._id} style={{ flex: 1, marginTop: 5 }}>
          <View
            style={{
              width: window.width - 15,
              height:
                Platform.OS === "android" || Platform.OS === "ios"
                  ? window.height / 1.6
                  : window.height / 1.5,
              borderRadius: 20,
              borderWidth: 2,
              borderColor: "rgb(60,179,113)",
              marginLeft: 7,
            }}
          >
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Text
                style={{
                  fontSize: 11 * (window.height * 0.002),
                  fontWeight: "700",
                  marginLeft: 10,
                  alignSelf: "flex-start",
                }}
              >
                OrderNo#
                {ord?.order?.orderNo}
              </Text>
              <Text
                style={{
                  fontSize: 12 * (window.height * 0.002),
                }}
              >
                Order On :
                {moment(
                  new Date(
                    parseInt(ord?.order?._id.toString().substring(0, 8), 16) *
                      1000
                  )
                ).format("DD/MM/YYYY")}
              </Text>
              <View></View>
            </View>
            <Text
              style={{
                fontSize: 15,
                fontWeight: "700",
                marginLeft: 20,
                marginTop: 5,
              }}
            >
              Products
            </Text>
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              style={{
                minHeight:
                  Platform.OS === "android" || Platform.OS === "ios"
                    ? window.height / 6
                    : window.height / 5,
                maxHeight:
                  Platform.OS === "android" || Platform.OS === "ios"
                    ? window.height / 6
                    : window.height / 5,
                marginTop: 5,
              }}
            >
              {ord?.order?.products.map((e, key) => (
                <View key={e._id} style={{ flexDirection: "column" }}>
                  <Image
                    source={
                      e.product.image.length > 0
                        ? {
                            uri: `data:image/jpeg;base64,${
                              (
                                e?.product?.image.find((x) => x.default) ||
                                e?.product?.image[0]
                              ).image
                            }`,
                          }
                        : require("../../assets/avatar.png")
                    }
                    style={{ height: 95, width: 95, marginLeft: 10 }}
                  ></Image>
                  <Text style={{ fontSize: 15, marginLeft: 20 }}>
                    {e?.product.name}
                  </Text>
                </View>
              ))}
            </ScrollView>
            <Text style={{ fontSize: 15, padding: 5 }}>
              Total Amount : {ord?.order?.subTotal}
            </Text>
            <View
              style={{
                flexDirection: "row",
                marginTop: 10,
              }}
            >
              <View
                style={{
                  flex: 2,
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Image
                  source={
                    ord?.user?.image
                      ? {
                          uri: `data:image/jpeg;base64,${ord.user.image}`,
                        }
                      : require("../../assets/avatar.png")
                  }
                  style={{
                    height: 60,
                    width: 60,
                    borderRadius: 100,
                    marginLeft: 15,
                  }}
                ></Image>
                <View
                  style={{
                    flexDirection: "column",
                    justifyContent: "space-evenly",
                  }}
                >
                  <Text
                    numberOfLines={1}
                    style={{ fontWeight: "600", marginLeft: 10 }}
                  >
                    {ord.user.name}
                  </Text>
                  <Text
                    numberOfLines={1}
                    style={{ color: "#888888", marginLeft: 10 }}
                  >
                    25 Aug 2019
                  </Text>
                </View>
              </View>
              {ord.rating === 5 ? (
                <View
                  style={{
                    flex: 5,
                    justifyContent: "flex-end",
                    flexDirection: "row",
                  }}
                >
                  <View style={{ alignSelf: "flex-end" }}>
                    <Icon
                      height={window.height / 25}
                      width={window.height / 25}
                      fill="yellow"
                      name="star"
                    ></Icon>
                  </View>
                  <View style={{ alignSelf: "flex-end" }}>
                    <Icon
                      height={window.height / 25}
                      width={window.height / 25}
                      fill="yellow"
                      name="star"
                    ></Icon>
                  </View>
                  <View style={{ alignSelf: "flex-end" }}>
                    <Icon
                      height={window.height / 25}
                      width={window.height / 25}
                      fill="yellow"
                      name="star"
                    ></Icon>
                  </View>
                  <View style={{ alignSelf: "flex-end" }}>
                    <Icon
                      height={window.height / 25}
                      width={window.height / 25}
                      fill="yellow"
                      name="star"
                    ></Icon>
                  </View>
                  <View style={{ alignSelf: "flex-end" }}>
                    <Icon
                      height={window.height / 25}
                      width={window.height / 25}
                      fill="yellow"
                      name="star"
                    ></Icon>
                  </View>
                </View>
              ) : ord.rating === 4 ? (
                <View
                  style={{
                    flex: 8,
                    justifyContent: "flex-end",
                    flexDirection: "row",
                  }}
                >
                  <View style={{ alignSelf: "flex-end" }}>
                    <Icon
                      height={window.height / 25}
                      width={window.height / 25}
                      fill="yellow"
                      name="star"
                    ></Icon>
                  </View>
                  <View style={{ alignSelf: "flex-end" }}>
                    <Icon
                      height={window.height / 25}
                      width={window.height / 25}
                      fill="yellow"
                      name="star"
                    ></Icon>
                  </View>
                  <View style={{ alignSelf: "flex-end" }}>
                    <Icon
                      height={window.height / 25}
                      width={window.height / 25}
                      fill="yellow"
                      name="star"
                    ></Icon>
                  </View>
                  <View style={{ alignSelf: "flex-end" }}>
                    <Icon
                      height={window.height / 25}
                      width={window.height / 25}
                      fill="yellow"
                      name="star"
                    ></Icon>
                  </View>
                  <View style={{ alignSelf: "flex-end" }}>
                    <Icon
                      height={window.height / 25}
                      width={window.height / 25}
                      name="star"
                    ></Icon>
                  </View>
                </View>
              ) : ord.rating === 3 ? (
                <View
                  style={{
                    flex: 8,
                    justifyContent: "flex-end",
                    flexDirection: "row",
                  }}
                >
                  <View style={{ alignSelf: "flex-end" }}>
                    <Icon
                      height={window.height / 25}
                      width={window.height / 25}
                      fill="yellow"
                      name="star"
                    ></Icon>
                  </View>
                  <View style={{ alignSelf: "flex-end" }}>
                    <Icon
                      height={window.height / 25}
                      width={window.height / 25}
                      fill="yellow"
                      name="star"
                    ></Icon>
                  </View>
                  <View style={{ alignSelf: "flex-end" }}>
                    <Icon
                      height={window.height / 25}
                      width={window.height / 25}
                      fill="yellow"
                      name="star"
                    ></Icon>
                  </View>
                  <View style={{ alignSelf: "flex-end" }}>
                    <Icon
                      height={window.height / 25}
                      width={window.height / 25}
                      name="star"
                    ></Icon>
                  </View>
                  <View style={{ alignSelf: "flex-end" }}>
                    <Icon
                      height={window.height / 25}
                      width={window.height / 25}
                      name="star"
                    ></Icon>
                  </View>
                </View>
              ) : ord.rating === 2 ? (
                <View
                  style={{
                    flex: 8,
                    justifyContent: "flex-end",
                    flexDirection: "row",
                  }}
                >
                  <View style={{ alignSelf: "flex-end" }}>
                    <Icon
                      height={window.height / 25}
                      width={window.height / 25}
                      fill="yellow"
                      name="star"
                    ></Icon>
                  </View>
                  <View style={{ alignSelf: "flex-end" }}>
                    <Icon
                      height={window.height / 25}
                      width={window.height / 25}
                      fill="yellow"
                      name="star"
                    ></Icon>
                  </View>
                  <View style={{ alignSelf: "flex-end" }}>
                    <Icon
                      height={window.height / 25}
                      width={window.height / 25}
                      name="star"
                    ></Icon>
                  </View>
                  <View style={{ alignSelf: "flex-end" }}>
                    <Icon
                      height={window.height / 25}
                      width={window.height / 25}
                      name="star"
                    ></Icon>
                  </View>
                  <View style={{ alignSelf: "flex-end" }}>
                    <Icon
                      height={window.height / 25}
                      width={window.height / 25}
                      name="star"
                    ></Icon>
                  </View>
                </View>
              ) : ord.rating === 1 ? (
                <View
                  style={{
                    flex: 8,
                    justifyContent: "flex-end",
                    flexDirection: "row",
                  }}
                >
                  <View style={{ alignSelf: "flex-end" }}>
                    <Icon
                      height={window.height / 25}
                      width={window.height / 25}
                      fill="yellow"
                      name="star"
                    ></Icon>
                  </View>
                  <View style={{ alignSelf: "flex-end" }}>
                    <Icon
                      height={window.height / 25}
                      width={window.height / 25}
                      name="star"
                    ></Icon>
                  </View>
                  <View style={{ alignSelf: "flex-end" }}>
                    <Icon
                      height={window.height / 25}
                      width={window.height / 25}
                      name="star"
                    ></Icon>
                  </View>
                  <View style={{ alignSelf: "flex-end" }}>
                    <Icon
                      height={window.height / 25}
                      width={window.height / 25}
                      name="star"
                    ></Icon>
                  </View>
                  <View style={{ alignSelf: "flex-end" }}>
                    <Icon
                      height={window.height / 25}
                      width={window.height / 25}
                      name="star"
                    ></Icon>
                  </View>
                </View>
              ) : (
                <View
                  style={{
                    flex: 8,
                    justifyContent: "flex-end",
                    flexDirection: "row",
                  }}
                >
                  <View style={{ alignSelf: "flex-end" }}>
                    <Icon
                      height={window.height / 25}
                      width={window.height / 25}
                      name="star"
                    ></Icon>
                  </View>
                  <View style={{ alignSelf: "flex-end" }}>
                    <Icon
                      height={window.height / 25}
                      width={window.height / 25}
                      name="star"
                    ></Icon>
                  </View>
                  <View style={{ alignSelf: "flex-end" }}>
                    <Icon
                      height={window.height / 25}
                      width={window.height / 25}
                      name="star"
                    ></Icon>
                  </View>
                  <View style={{ alignSelf: "flex-end" }}>
                    <Icon
                      height={window.height / 25}
                      width={window.height / 25}
                      name="star"
                    ></Icon>
                  </View>
                  <View style={{ alignSelf: "flex-end" }}>
                    <Icon
                      height={window.height / 25}
                      width={window.height / 25}
                      name="star"
                    ></Icon>
                  </View>
                </View>
              )}
            </View>
            <ScrollView
              style={{
                flex: 1,
                marginTop: 5,
                flexWrap: "wrap",
              }}
            >
              <Text style={{ color: "#303030", marginLeft: 10 }}>
                {ord.comment}
              </Text>
            </ScrollView>
            <View>
              <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                style={{ minHeight: 85, maxHeight: 85, marginTop: 5 }}
              >
                {ord.image?.map((photo, key) => (
                  <View>
                    <TouchableOpacity
                      onPress={() => {
                        setSelected(photo);
                        setModalVisible(true);
                      }}
                    >
                      <Image
                        resizeMode="contain"
                        source={
                          photo.image
                            ? {
                                uri: `data:image/jpeg;base64,${photo.image}`,
                              }
                            : require("../../assets/avatar.png")
                        }
                        style={{
                          padding: 5,
                          height: 75,
                          width: 75,
                          borderRadius: 5,
                          marginLeft: 3,
                        }}
                      ></Image>
                    </TouchableOpacity>
                    {selected ? (
                      <AddModal
                        showModal={modalVisible}
                        onSelection={handleCallback}
                        modalViewStyle={{
                          maxWidth:
                            window.width >= 960
                              ? window.width / 3
                              : window.width >= 641 && window.width <= 960
                              ? window.width / 2
                              : window.width <= 641 && window.width >= 500
                              ? window.width / 1.5
                              : window.width <= 500 && window.width >= 450
                              ? window.width / 1.2
                              : window.width - 20,
                          minWidth:
                            window.width >= 960
                              ? window.width / 3
                              : window.width >= 641 && window.width <= 960
                              ? window.width / 2
                              : window.width <= 641 && window.width >= 500
                              ? window.width / 1.5
                              : window.width <= 500 && window.width >= 450
                              ? window.width / 1.2
                              : window.width - 20,

                          // paddingTop: 20,
                          // paddingBottom: window.width >= 360 ? 20 : 10,
                          // paddingLeft: window.width >= 360 ? 40 : 10,
                          // paddingRight: window.width >= 360 ? 40 : 10,
                          borderRadius: 6,
                          backgroundColor: "#fefefe",
                        }}
                        add={
                          <View>
                            <Image
                              resizeMode="contain"
                              source={
                                selected.image
                                  ? {
                                      uri: `data:image/jpeg;base64,${selected.image}`,
                                    }
                                  : require("../../assets/avatar.png")
                              }
                              style={{
                                alignSelf: "center",
                                height: 700,
                                width: 700,
                                borderRadius: 5,
                              }}
                            ></Image>
                          </View>
                        }
                      ></AddModal>
                    ) : (
                      <></>
                    )}
                  </View>
                ))}
              </ScrollView>
            </View>
          </View>
        </View>
      ))}
    </ScrollView>
  );
};
const mapStateToProps = ({ orderFeedbacks }) => ({ orderFeedbacks });
export default connect(mapStateToProps, {})(allFeedbackOfUsers);
