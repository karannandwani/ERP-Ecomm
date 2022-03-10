import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  TextInput,
  Modal,
  Pressable,
  TouchableWithoutFeedback,
  ScrollView,
  Platform,
} from "react-native";
import { DimensionContext } from "../../dimensionContext";
import Icon from "../icon";
const searchIndex = ({
  onPress,
  style,
  modalViewStyle,
  renderData,
  hideScrollbar,
  renderItem,
  navigation,
  removeNotification,
  clearNotifications,
}) => {
  const { window } = useContext(DimensionContext);

  const [modalVisible, setModalVisible] = useState(false);
  const closeModal = () => {
    setModalVisible(false);
  };

  const navigateToScreen = (item) => {
    navigation.navigate(item.data.navigation, {
      itemId: item.data._id,
      procurement: item.data.type === "procurement",
      supplyOrder: item.data.type === "supply",
      ecommerceOrder: item.data.type === "ecom",
    });
    closeModal();
    removeNotification({
      _id: item.data._id,
      title: item.notification.title,
    });
  };
  return (
    <View
      style={[
        {
          flex: 1,
          flexDirection: "row",
          minHeight: window.height / 14,
          backgroundColor: "#FFFFFF",
          padding: 10,
          justifyContent: "space-between",
        },
        style,
      ]}
    >
      {modalVisible ? (
        <TouchableWithoutFeedback onPress={() => closeModal()}>
          <View
            style={{
              height: window.height,
              width: "100%",
              flexDirection: "row-reverse",
            }}
          >
            <TouchableWithoutFeedback>
              <View
                style={{
                  backgroundColor: "#fff",
                  height:
                    window.height > 1040
                      ? window.height / 2
                      : window.height / 1.5,
                  width:
                    window.width >= 1040
                      ? window.width / 4
                      : window.width >= 960 && window.width < 1040
                      ? window.width / 2.5
                      : window.width >= 641 && window.width < 960
                      ? window.width / 2.5
                      : window.width >= 500 && window.width < 641
                      ? window.width / 2
                      : window.width >= 400 && window.width < 500
                      ? window.width / 1.5
                      : window.width - 20,
                  borderRadius: 10,
                  shadowColor: "#000",
                  shadowOffset: {
                    width: 0,
                    height: 2,
                  },
                  shadowOpacity: 0.9,
                  shadowRadius: 10,
                  elevation: 10,
                  flexDirection: "column",
                }}
              >
                <View
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    justifyContent: "space-around",
                    alignItems: "center",
                  }}
                >
                  <TouchableOpacity onPress={() => closeModal()}>
                    <Text
                      style={{
                        fontSize: 15,
                        fontWeight: "700",
                        alignSelf: "center",
                      }}
                    >
                      Cancel
                    </Text>
                  </TouchableOpacity>
                  <Text style={{ fontSize: 15, fontWeight: "700" }}>
                    Notifications
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      closeModal();
                      clearNotifications();
                    }}
                  >
                    <Text style={{ fontSize: 15, fontWeight: "700" }}>
                      Clear
                    </Text>
                  </TouchableOpacity>
                </View>
                <View style={{ flex: 9 }}>
                  <FlatList
                    scrollEnabled={true}
                    showsVerticalScrollIndicator={hideScrollbar}
                    style={{ marginTop: 5, maxHeight: window.height / 1.5 }}
                    keyExtractor={(item, index) => index.toString()}
                    data={renderData}
                    renderItem={
                      renderItem
                        ? renderItem
                        : ({ item, index }) => (
                            <View
                              style={{
                                borderWidth: 1,
                                borderLeftColor: "#fff",
                                borderTopColor: "#fff",
                                borderRightColor: "#fff",
                                borderBottomColor: "#D0D0D0",
                                height: 50,
                                justifyContent: "center",
                              }}
                            >
                              <TouchableOpacity
                                onPress={() => navigateToScreen(item)}
                              >
                                <Text
                                  style={{
                                    alignSelf: "center",
                                    fontSize: 17,
                                    fontWeight: "500",
                                  }}
                                >
                                  {item.notification.title}
                                </Text>
                              </TouchableOpacity>
                            </View>
                          )
                    }
                  />
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      ) : (
        <></>
      )}
      {/* <View
        style={{
          position:
            Platform.OS === "android" || Platform.OS === "ios"
              ? null
              : "absolute",
          alignSelf: "flex-start",
        }}
      >
        {(modalVisible && Platform.OS === "android") ||
        Platform.OS === "ios" ? (
          <></>
        ) : (
          <TouchableOpacity>
            <Icon name="search"></Icon>
          </TouchableOpacity>
        )}
      </View> */}
      <View
        style={{
          minHeight: 50,
          maxHeight: 50,
          minWidth: "85%",
        }}
      ></View>
      {/* <View style={{ marginTop: 10 }}>
        <Icon name="support"></Icon>
      </View>
      <View style={{ marginTop: 10 }}>
        <Icon name="chat"></Icon>
      </View> */}
      <View>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Icon name="notification"></Icon>
        </TouchableOpacity>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  modalView: {
    alignSelf: "flex-end",

    backgroundColor: "white",
    borderRadius: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },

  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
});

export default searchIndex;
